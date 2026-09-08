export default function CheckoutProgress({ isCheckoutStep, paymentDetails }) {
  const activeIndex = paymentDetails ? 2 : isCheckoutStep ? 1 : 0;
  const steps = ["Paket", "Data", "Bayar"];

  return (
    <div className="mt-4 grid grid-cols-3 gap-2">
      {steps.map((label, index) => {
        const active = index <= activeIndex;
        return (
          <div key={label}>
            <div className="flex items-center">
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[8px] font-black ${active ? "bg-brand-blue text-white" : "bg-deep-navy/[0.06] text-deep-navy/30"}`}>
                0{index + 1}
              </span>
              {index < steps.length - 1 && <span className={`mx-2 h-px flex-1 ${index < activeIndex ? "bg-brand-blue" : "bg-deep-navy/10"}`} />}
            </div>
            <p className={`mt-1.5 text-[8px] font-black uppercase tracking-[0.1em] ${active ? "text-deep-navy" : "text-deep-navy/30"}`}>
              {label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
