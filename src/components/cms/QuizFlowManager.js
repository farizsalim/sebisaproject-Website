"use client";

import { useCallback, useEffect, useState } from "react";
import { FaFloppyDisk, FaPlus, FaRotate, FaTrash } from "react-icons/fa6";
import {
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const inputClassName = "w-full rounded-xl border border-deep-navy/15 bg-white px-3 py-2 text-sm text-deep-navy outline-none focus:border-brand-blue";

function QuestionNode({ data }) {
  return (
    <div className="w-72 rounded-2xl border-2 border-brand-blue bg-white p-4 text-deep-navy shadow-lg">
      <Handle className="!h-3 !w-3 !border-2 !border-white !bg-brand-blue" position={Position.Left} type="target" />
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-brand-blue">Pertanyaan</p>
      <p className="mt-2 text-sm font-black leading-5">{data.title || "Pertanyaan baru"}</p>
      <div className="mt-3 grid gap-2">
        {data.options.map((option, index) => (
          <div className="relative rounded-lg bg-brand-surface-alt px-3 py-2 pr-5 text-xs font-bold" key={`${option.label}-${index}`}>
            {option.label || `Opsi ${index + 1}`}
            <Handle className="!right-[-7px] !h-3 !w-3 !border-2 !border-white !bg-orange" id={`option-${index}`} position={Position.Right} type="source" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultNode({ data }) {
  return (
    <div className="w-64 rounded-2xl border-2 border-orange bg-deep-navy p-4 text-white shadow-lg">
      <Handle className="!h-3 !w-3 !border-2 !border-white !bg-orange" position={Position.Left} type="target" />
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-orange">Hasil rekomendasi</p>
      <p className="mt-2 text-sm font-black leading-5">{data.label || "Hasil baru"}</p>
    </div>
  );
}

const nodeTypes = { question: QuestionNode, result: ResultNode };

function createNodesFromContent(value) {
  if (value?.flow?.nodes?.length) {
    return value.flow.nodes;
  }

  const questions = value?.questions || [];
  const nodes = questions.map((question, index) => ({
    id: question.id || `q${index + 1}`,
    type: "question",
    position: question.position || { x: index * 360, y: 80 },
    data: {
      title: question.title,
      options: (question.options || []).map((option) => typeof option === "string" ? { label: option, target: null } : option),
    },
  }));

  const recommendations = Object.values(value?.recommendations || {}).flat();
  const uniqueRecommendations = [...new Set(recommendations)];
  uniqueRecommendations.forEach((label, index) => {
    nodes.push({
      id: `result-${index + 1}`,
      type: "result",
      position: { x: Math.max(questions.length * 360, 500), y: index * 150 },
      data: { label },
    });
  });

  return nodes;
}

function createEdgesFromContent(value, nodes) {
  if (value?.flow?.edges?.length) {
    return value.flow.edges;
  }

  const edges = [];
  nodes.filter((node) => node.type === "question").forEach((node) => {
    node.data.options.forEach((option, index) => {
      if (!option.target) return;
      edges.push({
        id: `${node.id}-${index}-${option.target}`,
        source: node.id,
        sourceHandle: `option-${index}`,
        target: option.target,
        type: "smoothstep",
        animated: true,
        style: { stroke: "#ffb000", strokeWidth: 2 },
      });
    });
  });
  return edges;
}

function serializeContent(value, nodes, edges) {
  const questions = nodes.filter((node) => node.type === "question").map((node) => ({
    id: node.id,
    title: node.data.title,
    position: node.position,
    options: node.data.options.map((option, index) => ({
      label: option.label,
      target: edges.find((edge) => edge.source === node.id && edge.sourceHandle === `option-${index}`)?.target || null,
    })),
  }));
  const recommendations = {};
  nodes.filter((node) => node.type === "result").forEach((node) => { recommendations[node.data.label] = [node.data.label]; });

  return {
    ...value,
    questions,
    flow: {
      startId: nodes.find((node) => node.type === "question")?.id || null,
      nodes: nodes.map((node) => ({ id: node.id, type: node.type, position: node.position, data: node.data })),
      edges: edges.map((edge) => ({ id: edge.id, source: edge.source, sourceHandle: edge.sourceHandle, target: edge.target, type: edge.type, animated: edge.animated })),
    },
    recommendations: Object.keys(recommendations).length ? { ...value.recommendations, ...recommendations } : value.recommendations,
  };
}

export default function QuizFlowManager() {
  const [quizId, setQuizId] = useState(null);
  const [startNodeId, setStartNodeId] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadQuiz = useCallback(async () => {
    setIsLoading(true);
    const response = await fetch("/api/cms/content?type=quiz", { cache: "no-store" });
    const result = await response.json();
    const quiz = result.quiz;
    if (!response.ok || !quiz) {
      setError(result.error || "Kuis belum tersedia.");
    } else {
      const nextNodes = quiz.nodes;
      setQuizId(quiz.id);
      setStartNodeId(quiz.startNodeId);
      setNodes(nextNodes);
      setEdges(quiz.edges);
    }
    setIsLoading(false);
  }, [setEdges, setNodes]);

  useEffect(() => { loadQuiz(); }, [loadQuiz]);

  const onConnect = useCallback((connection) => {
    setEdges((currentEdges) => addEdge({ ...connection, type: "smoothstep", animated: true, style: { stroke: "#ffb000", strokeWidth: 2 } }, currentEdges));
  }, [setEdges]);

  function addQuestion() {
    const id = `q-${Date.now()}`;
    setNodes((currentNodes) => [...currentNodes, { id, type: "question", position: { x: 120, y: currentNodes.length * 180 }, data: { title: "Pertanyaan baru", options: [{ label: "Opsi baru", target: null }] } }]);
  }

  function addResult() {
    const id = `result-${Date.now()}`;
    setNodes((currentNodes) => [...currentNodes, { id, type: "result", position: { x: 700, y: currentNodes.length * 140 }, data: { label: "Rekomendasi baru" } }]);
  }

  function updateSelectedNode(field, value) {
    setNodes((currentNodes) => currentNodes.map((node) => node.id === selectedNode?.id ? { ...node, data: { ...node.data, [field]: value } } : node));
    setSelectedNode((node) => node ? { ...node, data: { ...node.data, [field]: value } } : node);
  }

  function updateOption(index, label) {
    const nextOptions = [...(selectedNode?.data.options || [])];
    nextOptions[index] = { ...nextOptions[index], label };
    updateSelectedNode("options", nextOptions);
  }

  function removeSelectedNode() {
    if (!selectedNode) return;
    setNodes((currentNodes) => currentNodes.filter((node) => node.id !== selectedNode.id));
    setEdges((currentEdges) => currentEdges.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id));
    setSelectedNode(null);
  }

  async function saveQuiz() {
    setIsSaving(true);
    setMessage("");
    setError("");
    const persistedNodes = nodes.map((node) => node.type !== "question" ? node : {
      ...node,
      data: {
        ...node.data,
        options: (node.data.options || []).map((option, index) => ({
          ...option,
          target: edges.find((edge) => edge.source === node.id && edge.sourceHandle === `option-${index}`)?.target || null,
        })),
      },
    });
    const response = await fetch("/api/cms/content", { method: "PATCH", headers: { "Content-Type": "application/json", "x-content-type": "quiz" }, body: JSON.stringify({ quizId, startNodeId, nodes: persistedNodes, edges }) });
    const result = await response.json();
    if (!response.ok) setError(result.error || "Gagal menyimpan kuis.");
    else { setMessage("Alur kuis berhasil disimpan."); await loadQuiz(); }
    setIsSaving(false);
  }

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-deep-navy/10 bg-white p-4 shadow-[0_12px_28px_rgb(23_36_61_/_8%)] sm:p-6">
      <div className="flex flex-col justify-between gap-4 border-b-2 border-deep-navy/10 pb-5 lg:flex-row lg:items-center">
        <div><p className="text-xs font-black uppercase tracking-[0.2em] text-brand-blue">Flow editor</p><h2 className="mt-2 text-2xl font-black">Alur kuis konsultasi</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Geser node, tarik koneksi dari opsi ke pertanyaan atau hasil, lalu simpan alurnya.</p></div>
        <div className="flex flex-wrap gap-2"><button className="inline-flex items-center gap-2 rounded-full bg-brand-surface-alt px-4 py-2 text-xs font-black text-deep-navy" onClick={addQuestion} type="button"><FaPlus /> Pertanyaan</button><button className="inline-flex items-center gap-2 rounded-full bg-orange px-4 py-2 text-xs font-black text-deep-navy" onClick={addResult} type="button"><FaPlus /> Hasil</button><button className="inline-flex items-center gap-2 rounded-full border border-deep-navy px-4 py-2 text-xs font-black text-deep-navy" onClick={loadQuiz} type="button"><FaRotate /> Muat ulang</button></div>
      </div>
      {message ? <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">{message}</p> : null}
      {error ? <p className="mt-4 rounded-xl bg-hot-pink/10 px-4 py-3 text-sm font-bold text-deep-navy">{error}</p> : null}
      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_280px]">
        <div className="h-[620px] overflow-hidden rounded-2xl border border-deep-navy/10 bg-slate-50">
          {isLoading ? <div className="flex h-full items-center justify-center text-sm font-bold text-slate-500">Memuat alur kuis...</div> : <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onNodeClick={(_, node) => setSelectedNode(node)} fitView><Background color="#cbd5e1" gap={24} /><Controls /><MiniMap /></ReactFlow>}
        </div>
        <aside className="rounded-2xl border border-deep-navy/10 bg-brand-surface-alt p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-blue">Editor node</p>
          {!selectedNode ? <p className="mt-4 text-sm leading-6 text-slate-600">Pilih node untuk mengubah teks dan opsi.</p> : <div className="mt-4 grid gap-4"><label className="grid gap-2 text-sm font-bold">{selectedNode.type === "question" ? "Pertanyaan" : "Rekomendasi"}<input className={inputClassName} value={selectedNode.data.title || selectedNode.data.label || ""} onChange={(event) => updateSelectedNode(selectedNode.type === "question" ? "title" : "label", event.target.value)} /></label>{selectedNode.type === "question" ? <div className="grid gap-3"><p className="text-xs font-black uppercase tracking-[0.12em] text-deep-navy">Opsi jawaban</p>{selectedNode.data.options.map((option, index) => <input className={inputClassName} key={`${selectedNode.id}-${index}`} value={option.label} onChange={(event) => updateOption(index, event.target.value)} />)}<button className="rounded-xl border border-dashed border-deep-navy/30 px-3 py-2 text-xs font-bold text-deep-navy" onClick={() => updateSelectedNode("options", [...selectedNode.data.options, { label: "Opsi baru", target: null }])} type="button">+ Tambah opsi</button></div> : null}<button className="inline-flex items-center justify-center gap-2 rounded-full bg-hot-pink px-4 py-2 text-xs font-black text-white" onClick={removeSelectedNode} type="button"><FaTrash /> Hapus node</button></div>}
          <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange px-4 py-3 text-sm font-black text-deep-navy shadow-sm disabled:opacity-60" disabled={isSaving || !quizId} onClick={saveQuiz} type="button"><FaFloppyDisk /> {isSaving ? "Menyimpan..." : "Simpan alur kuis"}</button>
        </aside>
      </div>
    </section>
  );
}
