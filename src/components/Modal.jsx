import { useEffect } from "react";

function Modal({isOpen, onClose, children}){

    useEffect(() => {
        const handleEsc = (event) => {
          if (event.key === 'Escape') {
            onClose()
          }
        };
        window.addEventListener('keydown', handleEsc);
  
        return () => {
          window.removeEventListener('keydown', handleEsc);
        };
      }, []);


    if (!isOpen) return null;

    return(
    <div role="modal"
        onClick={onClose}
        className="modal-outter"
    >
        <div
            onClick={e => {
            // do not close modal if anything inside modal content is clicked
            e.stopPropagation();
            }}
            className="modal-inner"
        >
            {children}
        </div>
    </div>
    )
}

export default Modal