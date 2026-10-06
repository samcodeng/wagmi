"use client";

type InfoModalProps = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

export default function InfoModal({
  title,
  children,
  onClose,
}: InfoModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="info-modal-title"
        className="max-h-[min(680px,90vh)] w-full max-w-lg overflow-y-auto rounded-2xl border border-teal-300/20 bg-slate-900 p-6 text-slate-200 shadow-[0_0_50px_rgba(12,23,45,0.8)] sm:p-8"
      >
        <div className="flex items-start justify-between gap-5">
          <h2 id="info-modal-title" className="text-2xl font-black text-white">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="rounded-full border border-white/10 px-3 py-1 text-lg leading-none text-slate-300 transition-colors hover:border-teal-300/40 hover:text-white"
          >
            ×
          </button>
        </div>
        <div className="mt-6 space-y-4 text-sm leading-6 text-slate-300">
          {children}
        </div>
      </div>
    </div>
  );
}
