function formatInvoiceDate(value) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(value ? new Date(value) : new Date());
}

export function downloadInvoiceAsPng(summary, orderId, paidAt) {
  const benefits = summary.benefits || [];
  const benefitLines = benefits.flatMap((benefit) => {
    const words = String(benefit).split(" ");
    const lines = [];
    let line = "";
    words.forEach((word) => {
      const nextLine = line ? `${line} ${word}` : word;
      if (nextLine.length > 62) {
        lines.push(line);
        line = word;
      } else {
        line = nextLine;
      }
    });
    if (line) lines.push(line);
    return lines;
  });

  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 1110 + benefitLines.length * 34;
  const context = canvas.getContext("2d");
  if (!context) return;

  context.fillStyle = "#f7f6f1";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#17243d";
  context.fillRect(0, 0, canvas.width, 250);

  const logo = new Image();
  logo.onload = () => {
    context.drawImage(logo, 75, 55, 360, 140);
    context.fillStyle = "#ffb000";
    context.fillRect(75, 230, 1250, 6);
    context.fillStyle = "#17243d";
    context.font = "900 44px Arial";
    context.fillText("INVOICE PEMBAYARAN", 75, 340);
    context.font = "700 27px Arial";
    context.fillStyle = "#687386";
    context.fillText(`Order ID: ${orderId}`, 75, 390);
    context.fillText(formatInvoiceDate(paidAt), 75, 430);
    context.fillStyle = "#ffffff";
    const detailHeight = 350 + benefitLines.length * 34;
    context.fillRect(75, 485, 1250, detailHeight);
    context.fillStyle = "#17243d";
    context.font = "900 32px Arial";
    context.fillText("Detail transaksi", 115, 545);
    context.font = "700 27px Arial";
    context.fillText(summary.serviceName, 115, 610);
    context.font = "500 23px Arial";
    context.fillStyle = "#687386";
    context.fillText(summary.duration, 115, 650);
    context.fillStyle = "#17243d";
    context.font = "700 24px Arial";
    context.fillText("Isi paket:", 115, 705);
    context.font = "500 22px Arial";
    context.fillStyle = "#687386";
    benefitLines.forEach((line, index) => context.fillText(`• ${line}`, 135, 745 + index * 34));
    const customerStart = 745 + benefitLines.length * 34;
    context.fillText(`Pembeli: ${summary.customerName}`, 115, customerStart);
    context.fillText(summary.customerEmail, 115, customerStart + 40);
    context.textAlign = "right";
    context.fillStyle = "#17243d";
    context.font = "700 25px Arial";
    context.fillText("Total dibayar", 1285, 610);
    context.fillStyle = "#2563eb";
    context.font = "900 36px Arial";
    context.fillText(new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(summary.totalAmount || 0), 1285, 665);
    context.textAlign = "left";
    context.fillStyle = "#17243d";
    context.font = "700 25px Arial";
    const footerStart = 555 + detailHeight;
    context.fillText("Terima kasih telah memilih Sebisa Project.", 75, footerStart);
    context.font = "500 21px Arial";
    context.fillStyle = "#687386";
    context.fillText("Invoice ini adalah bukti pembayaran yang sah.", 75, footerStart + 40);
    const link = document.createElement("a");
    link.download = `invoice-${orderId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
  logo.src = "/images/logo-sebisa-project.png";
}
