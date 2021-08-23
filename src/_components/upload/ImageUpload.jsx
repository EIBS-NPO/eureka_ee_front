import React, {useContext, useState} from 'react'
import {Button, Input, Label} from "semantic-ui-react";
import ImageCropper from './ImageCropper'
import Modal from "../Modal";
import fileAPI from '../../_services/fileAPI';
import '../../scss/components/Modal.scss';
import MediaContext from "../../_contexts/MediaContext";
import {useTranslation} from "react-i18next";

//todo traduction
const ImageUpload = ({ setter, type, entity}) => {

    const Media = useContext(MediaContext).Media
    const { t } = useTranslation()
    //todo harmoniser les différents média? => placer picture dans un context local au pictForm

    //todo canceled, => keep the old picture for restore
    const [blob, setBlob] = useState(null)

    //inputImage c'est l'image que l'on va chercher passé en base64
    const [inputImg, setInputImg] = useState('')

    const onInputChange = (e) => {
        // convert image file to base64 string
        const file = e.target.files[0]

        let reader = new FileReader()

        reader.addEventListener('load', () => {
            setInputImg(reader.result)
        }, false)

        if (file) {
            reader.readAsDataURL(file)
        }
        showModal()
    }

    const handleSubmitImage = (e) => {
       // console.log(blob)
        e.preventDefault()
        if(entity.id !== undefined){
            console.log("savePicture")
            // upload blob to firebase 'images' folder with filename 'image'
            let bodyFormData = new FormData();
            bodyFormData.append('image', blob)

            bodyFormData.append('id', entity.id)
            /*if(type !== "user"){
                bodyFormData.append('id', entity.id)
            }*/

            fileAPI.uploadPic(type, bodyFormData)
                .then(response => {
                    //    notification.successNotif('nouvelle photo de profil bien enregistrée')
                    setter({ ...entity, "picture": response.data[0].picture })
                  //  setPicture(response.data[0].picture)
                    //     console.log(response)
                    // parentCallBack()
                    hideModal()
                })
                .catch(error => {
                    //handle error
                    console.log(error.response);
                });
        }
        else { //if no entityId is null, case of a new Entity just pass picture. it will be created with the entity
            setter({ ...entity, "picture": blob })
        }

        hideModal()
    }

    const [show, setShow] = useState(false)
    const showModal = () => {
        setShow(true)
    }
    const hideModal = () => {
        setShow(false)
    //    document.getElementById('formPicture').reset()
    }

    //todo make dynamique Id depend on media
    return (
        <form onSubmit={handleSubmitImage} id="formPicture">
            {
                inputImg && (
                    <Modal show={show} handleClose={hideModal} title="Crop Img">
                        <div className="ModalCrop">
                            <ImageCropper
                                setBlob={setBlob}
                                inputImg={inputImg}
                                form={entity.id === null ? null : "blob"}
                            />
                            <button type='submit' className="btn btn-secondary">{ t("confirm")}</button>
                            <button type='submit' className="btn btn-secondary" onClick={hideModal}>{ t("cancel")}</button>
                        </div>
                    </Modal>
                )
            }

            <Media at="xs">
                <label htmlFor="inputUploadImg_Atxs" className="ui basic button mini">
                    { t('change')}
                    <input
                        lang="en"
                        type='file'
                        accept='image/png, image/jpeg'
                        onChange={onInputChange}
                        id="inputUploadImg_Atxs"
                        hidden
                    />
                </label>
            </Media>
            <Media at="mobile">
                <label htmlFor="inputUploadImg_Atmobile" className="ui basic button mini">
                    { t('change')}
                <input
                    lang="en"
                    type='file'
                    accept='image/png, image/jpeg'
                    onChange={onInputChange}
                    id="inputUploadImg_Atmobile"
                    hidden
                />
                </label>
            </Media>
            <Media greaterThan="mobile">
                <label htmlFor="inputUploadImg_GTmobile" className="ui basic button mini">
                    { t('change')}
                <input
                    lang="en"
                    type='file'
                    accept='image/png, image/jpeg'
                    onChange={onInputChange}
                    id="inputUploadImg_GTmobile"
                    hidden
                />
                </label>
            </Media>

        </form>
    )
}

export default ImageUpload