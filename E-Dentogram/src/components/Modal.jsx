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
    <div
        onClick={onClose}
        style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex:100,
        }}
    >
        <div
            onClick={e => {
            // do not close modal if anything inside modal content is clicked
            e.stopPropagation();
            }}
            style={{
                background: "white",
                margin: "auto",
                padding: "2%",
                border: "2px solid #000",
                borderRadius: "10px",
                boxShadow: "2px solid black",
                maxHeight:"85vh",
                overflowY:"auto"
            }}
        >
            {children}
        </div>
    </div>
    )
}

export default Modal