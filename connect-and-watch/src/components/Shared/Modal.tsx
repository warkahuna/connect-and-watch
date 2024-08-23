import React from "react";

const Modal: React.FC<{
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: any;
}> = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h4>{title}</h4>
        <button onClick={onClose}>Close</button>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
