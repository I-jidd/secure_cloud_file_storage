import Button from "./Button";

function Modal({
  isOpen,
  title,
  description,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  isSubmitting = false,
  confirmVariant = "primary",
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">
            {title}
          </h2>

          {description && (
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {description}
            </p>
          )}
        </div>

        {children && <div className="mt-6">{children}</div>}

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            {cancelText}
          </Button>

          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Please wait..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
