import React, { useState, useContext} from 'react'
import ImageCropper from './ImageCropper'
import Modal from "../Modal";
import userAPI from '../../_services/userAPI';
import AuthAPI from "../../_services/authAPI";
import AuthContext from "../../_contexts/AuthContext";
//import notification from '../../services/notification';

const ImageUpload = ({ refresh, setRefresh, parentCallBack }) => {

    const [blob, setBlob] = useState(null)
    const [inputImg, setInputImg] = useState('')

    const getBlob = (blob) => {
        // pass blob up from the ImageCropper component
        setBlob(blob)
    }

    const onInputChange = (e) => {
        // convert image file to base64 string
        const file = e.target.files[0]
        const reader = new FileReader()

        reader.addEventListener('load', () => {
            setInputImg(reader.result)
        }, false)

        if (file) {
            reader.readAsDataURL(file)
        }
        showModal()
    }

    const handleSubmitImage = (e) => {
        // upload blob to firebase 'images' folder with filename 'image'
        e.preventDefault()
        var bodyFormData = new FormData();
        bodyFormData.append('image', blob)

        userAPI.uploadPic(bodyFormData)
            .then(response => {
            //    notification.successNotif('nouvelle photo de profil bien enregistrée')
                setRefresh(refresh + 1)
                parentCallBack()
                hideModal()
            })
            .catch(error => {
                //handle error
                console.log(error);
            });
        hideModal()
    }

    const [show, setShow] = useState(false)
    const showModal = () => {
        setShow(true)
    }
    const hideModal = () => {
        setShow(false)
        document.getElementById('formPicture').reset()
    }

    return (
        <form onSubmit={handleSubmitImage} id="formPicture">
            {
                inputImg && (
                    <Modal
                        show={show}
                        handleClose={hideModal}
                        title="Crop Img"
                    >
                        <div className="ModalCrop">
                            <ImageCropper
                                getBlob={getBlob}
                                inputImg={inputImg}
                            />
                            <button type='submit' className="btn btn-secondary">Submit</button>
                            <button type='submit' className="btn btn-secondary" onClick={hideModal}>Cancel</button>
                        </div>
                    </Modal>
                )
            }
            {/*<label htmlFor="inputUploadImg" className="inputUploadImg">
                Changer votre photo de profil
            </label>*/}
            <input
                lang="en"
                type='file'
                accept='image/png, image/jpeg'
                onChange={onInputChange}
                id="inputUploadImg"
                /*hidden*/
            />

        </form>
    )
}

export default ImageUpload