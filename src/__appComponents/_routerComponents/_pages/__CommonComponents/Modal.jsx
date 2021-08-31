
import React from 'react';
import '../../../../scss/components/Modal.scss';


const Modal = ({ show, title = 'Modal Title', children }) => {

    const showHideClassName = show ? "modal display-block" : "modal display-none";

    return (
        <div className={showHideClassName}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        {/*<button onClick={handleClose} className="btn btn-primary close-btn" type="button"> X </button>*/}
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;