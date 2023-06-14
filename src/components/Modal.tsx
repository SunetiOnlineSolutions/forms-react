import React from 'react';
import BSModal from 'react-bootstrap/Modal';

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onOkay?: () => void;
  buttons?: React.ReactNode;
}

const Modal: React.FunctionComponent<Props> = ({ title, isOpen, onClose, buttons, onOkay, children }) => {
  return <BSModal show={isOpen} onHide={onClose}>
    <div className="modal-content">
      <div className="modal-header">
        <h4 className="modal-title">{title}</h4>
        <button type="button" className="close" onClick={onClose} aria-hidden="true">×</button>
      </div>
      <div className="modal-body">
        {children}
      </div>
      <div className="modal-footer">
        {buttons ?? <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-primary status-button" onClick={onOkay}>Okay</button>
        </>}
      </div>
    </div>
  </BSModal>
}

export default Modal;
