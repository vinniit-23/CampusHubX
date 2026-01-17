import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import clsx from "clsx";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  className,
}) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gray-500/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={clsx(
          "relative w-full mx-4 rounded-lg bg-white shadow-xl",
          sizes[size],
          className
        )}
      >
        <div className="px-6 py-5">
          {title && (
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
