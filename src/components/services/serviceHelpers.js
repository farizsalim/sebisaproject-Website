import {
  FaBuildingColumns,
  FaCamera,
  FaCartShopping,
  FaChartLine,
  FaGlobe,
  FaInstagram,
  FaMicrophone,
  FaQrcode,
  FaStore,
  FaTiktok,
  FaWallet,
  FaYoutube,
} from "react-icons/fa6";

export function getTimeRemaining(deadline) {
  const difference = Math.max(0, new Date(deadline).getTime() - Date.now());
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export function isFlashSaleActive(service) {
  if (!service?.flashSale) return false;
  if (!service.flashSaleEndsAt) return true;
  return new Date(service.flashSaleEndsAt).getTime() > Date.now();
}

export function getCurrentServicePrice(service) {
  return isFlashSaleActive(service) ? service.price : service.originalPrice || service.price;
}

export function formatTime(value) {
  return String(value).padStart(2, "0");
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function getServiceIcons(serviceName = "") {
  const normalizedName = serviceName.toLowerCase();
  if (normalizedName.includes("instagram") && normalizedName.includes("tiktok")) return [FaInstagram, FaTiktok];
  if (normalizedName.includes("instagram")) return [FaInstagram];
  if (normalizedName.includes("tiktok")) return [FaTiktok];
  if (normalizedName.includes("youtube")) return [FaYoutube];
  if (normalizedName.includes("podcast") || normalizedName.includes("audio")) return [FaMicrophone];
  if (normalizedName.includes("marketplace") || normalizedName.includes("toko")) return [FaCartShopping];
  if (normalizedName.includes("website")) return [FaGlobe];
  if (normalizedName.includes("foto")) return [FaCamera];
  return [FaChartLine];
}

export function getServiceBenefits(description, benefits) {
  return (benefits?.length ? benefits : String(description || "").split(","))
    .map((benefit) => String(benefit).trim())
    .filter(Boolean);
}

export function getServiceQuestionLink(service) {
  const message = [
    "Halo Sebisa Project, saya ingin bertanya tentang layanan berikut:",
    `Layanan: ${service.name}`,
    `Harga: ${getCurrentServicePrice(service)}`,
    "Mohon bantu jelaskan apakah layanan ini sesuai dengan kebutuhan saya.",
  ].join("\n");
  return `https://wa.me/6280000000000?text=${encodeURIComponent(message)}`;
}

export function getPaymentConfirmationLink(service, orderId) {
  const message = [
    "Halo Sebisa Project, saya sudah melakukan pembayaran.",
    `Layanan: ${service.name}`,
    `Order ID: ${orderId}`,
    "Mohon konfirmasi pembayaran saya.",
  ].join("\n");
  return `https://wa.me/6280000000000?text=${encodeURIComponent(message)}`;
}

export const paymentMethodOptions = [
  { value: "qris", label: "QRIS", icon: FaQrcode, mark: "QRIS", tone: "bg-blue-600 text-white" },
  { value: "bca_va", label: "Virtual Account BCA", icon: FaBuildingColumns, mark: "BCA", tone: "bg-blue-700 text-white" },
  { value: "bni_va", label: "Virtual Account BNI", icon: FaBuildingColumns, mark: "BNI", tone: "bg-orange-500 text-white" },
  { value: "bri_va", label: "Virtual Account BRI", icon: FaBuildingColumns, mark: "BRI", tone: "bg-blue-500 text-white" },
  { value: "mandiri_va", label: "Virtual Account Mandiri", icon: FaBuildingColumns, mark: "MANDIRI", tone: "bg-yellow-300 text-deep-navy" },
  { value: "cimb_va", label: "Virtual Account CIMB Niaga", icon: FaBuildingColumns, mark: "CIMB", tone: "bg-red-600 text-white" },
  { value: "gopay", label: "GoPay", icon: FaWallet, mark: "GoPay", tone: "bg-green-500 text-white" },
  { value: "shopeepay", label: "ShopeePay", icon: FaStore, mark: "SPay", tone: "bg-orange-600 text-white" },
];
