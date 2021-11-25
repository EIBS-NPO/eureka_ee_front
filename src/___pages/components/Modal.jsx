
import React from 'react';
import '../../scss/components/Modal.scss';

/*
export const TestConfirmModal = ({ t, modalSettings, setModalSettings}) => {
    return(
        modalSettings.showModal &&
        <Modal show={modalSettings.showModal}
               handleClose={ () => setModalSettings({...modalSettings, "showModal":false}) }
               title={ t(modalSettings.title) }>
            <div>
                <p> { modalSettings.message } </p>
                <Segment basic>
                    <Button.Group>
                        <BtnOnCLick isPositive={true} isDisabled={false} onClickFunction={ () =>modalSettings.action( modalSettings.target ) } text={ t('confirm') }/>
                        <Button.Or />
                        <BtnOnCLick isDisabled={false} onClickFunction={() =>modalSettings.cancel() } text={ t('cancel') }/>
                    </Button.Group>
                </Segment>
            </div>
        </Modal>
    )
}*/


//todo faire une modal action
//s iaction a besoin de confirmation,, faire en sorte que le form de confirm s'affiche dans la modal a la place du frm d'action!
//l'annulation réafichera le formAction
//qui aura lui même un btn cancel pour fermer la modal.
//l'actionTable contiendra les form d'action en objet indexé par leur nom d'action.
/*
export const ActionModal = ({ t, show, handleClose, title, content }) => {

    return (
        <Modal show={show} handleClose={handleClose} title={ t(title) } >
            <Segment className="card">
                { content }
            </Segment>
        </Modal>
    )
}

export const ConfirmModal = ({ t, showModal, setShowModal, title, msgModal, modalHandleFunction }) => {

    return (
        showModal &&
        <Modal show={showModal} handleClose={() => setShowModal(false)} title={ t(title) }>
            <div >
                <p> { msgModal } </p>
                <Segment basic>
                    <Button.Group>
                        <BtnOnCLick isPositive={true} isDisabled={false} onClickFunction={() =>modalHandleFunction(true)} text={ t('confirm') }/>
                        <Button.Or />
                        <BtnOnCLick isDisabled={false} onClickFunction={() =>modalHandleFunction(false)} text={ t('cancel') }/>
                    </Button.Group>
                </Segment>
            </div>
        </Modal>
    )
}*/

const Modal = ({ show, title = 'Modal Title', children }) => {

    const showHideClassName = show ? "modal display-block" : "modal display-none";

    return (
        <div className={showHideClassName}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
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