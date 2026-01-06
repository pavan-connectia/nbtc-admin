import React, { useRef } from "react";
import { Button, Heading, Text } from "..";
import useClickOutside from "@/hooks/useClickOutside";

const Modal = ({
  isOpen,
  onClose,
  children,
  modalTitle,
  modalDescription,
  maxWidth = "max-w-5xl",
}) => {
  const modalRef = useRef(null);
  useClickOutside(modalRef, onClose);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div
        className={`w-11/12 rounded-lg bg-white shadow-lg ${maxWidth} relative z-40 max-h-[90vh] overflow-y-auto p-5 sm:p-8`}
        ref={modalRef}
      >
        <div className="absolute right-2 top-2">
          <Button
            onClick={onClose}
            variant="none"
            className="text-2xl font-semibold opacity-70 hover:opacity-100"
          >
            &times;
          </Button>
        </div>

        {modalTitle && <Heading className="mt-3 text-lg">{modalTitle}</Heading>}
        {modalDescription && <Text>{modalDescription}</Text>}

        <div className="z-40 overflow-y-auto p-1">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
