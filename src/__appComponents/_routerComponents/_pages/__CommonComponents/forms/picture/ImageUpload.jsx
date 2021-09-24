import React, {useContext, useState} from 'react'
import {Button, Input, Label} from "semantic-ui-react";
import ImageCropper from './ImageCropper'
import Modal from "../../Modal";
import fileAPI from '../../../../../../__services/_API/fileAPI';
import '../../../../../../scss/components/Modal.scss';
import MediaContext from "../../../../../../__appContexts/MediaContext";
import {useTranslation} from "react-i18next";
import UserContext from "../../../_userPages/_userContexts/UserContext";
import authAPI from "../../../../../../__services/_API/authAPI";

//todo traduction
const ImageUpload = ({ setter, type, entity}) => {

    const Media = useContext(MediaContext).Media
  //  const setUser = useContext(UserContext).setUser

    const { t } = useTranslation()

    const [blob, setBlob] = useState(null)

    //inputImage c'est l'image que l'on va chercher passé en base64
    const [inputImg, setInputImg] = useState('')

    const [oldPicture, setOldpicture] = useState(undefined)
    const onInputChange = (e) => {
        // convert image file to base64 string
        if(entity.picture){
            setOldpicture(entity.picture)
        }

        const file = e.target.files[0]

        let reader = new FileReader()

        reader.addEventListener('load', () => {
            setInputImg(reader.result)
        }, false)

        if (file) {
            reader.readAsDataURL(file)
        }
        e.target.value = null
        showModal()
    }

    const handleSubmitImage = async (e) => {
        // console.log(blob)
        e.preventDefault()
        if (entity.id !== undefined) { //if entiy already exist in database, update immediatly
            // fileHandler blob to firebase 'images' folder with filename 'image'

            if (await authAPI.isAuthenticated()) {
                fileAPI.uploadPic(type, entity, blob)
                    .then(response => {
                        setter({...entity, "picture": response.data[0].picture})
                        hideModal()
                    })
                    .catch(error => {
                        //handle error
                        console.log(error)
                        console.log(error.response);
                    });
            } else {
                history.replace("/login")
            }
        } else { //if no entityId is null, case of a new Entity just pass picture. it will be created with the entity
            setter({...entity, "picture": blob})
        }

        hideModal()
    }

    const handleCancel = (e) => {
        e.preventDefault()
        if(oldPicture){ //if we have a oldPicture
            setter({ ...entity, "picture": oldPicture })
        }else{ //else juste remove.
            setter({ ...entity, "picture": undefined })
        }
        hideModal()
    }

    const handleDelete = () => {
        if(entity.id !== undefined){
            fileAPI.uploadPic(type, entity, null)
                .then(response => {
                    setter({ ...entity, "picture": response.data[0].picture })
                    hideModal()
                })
                .catch(error => {
                    //handle error
                    console.log(error)
                    console.log(error.response);
                });
        }
        setter({ ...entity, "picture": null })
    }

    const [show, setShow] = useState(false)
    const showModal = () => {
        setShow(true)
    }

    const hideModal = () => {
        setShow(false)
    //    document.getElementById('formPicture').reset()
    }

    return (
        <form onSubmit={handleSubmitImage} id="formPicture">
            <Media at="xs">
                <label htmlFor="inputUploadImg_Atxs" className="ui basic button mini">
                    { t('change')}
                    <input
                        type='file' hidden
                        lang="en" id="inputUploadImg_Atxs"
                        accept='image/png, image/jpeg' onChange={onInputChange}
                    />
                </label>
                {entity && entity.picture &&
                <Button
                    basic icon='remove circle'
                    color="red" size='mini'
                    content= { t('delete') } onClick={handleDelete}
                />
                }
            </Media>
            <Media at="mobile">
                <label htmlFor="inputUploadImg_Atmobile" className="ui basic button mini">
                    { t('change')}
                <input
                    type='file'  hidden
                    lang="en" id="inputUploadImg_Atmobile"
                    accept='image/png, image/jpeg' onChange={onInputChange}
                />
                </label>
                {entity && entity.picture &&
                <Button
                    basic icon='remove circle'
                    color="red" size='mini'
                    content= { t('delete') } onClick={handleDelete}
                />
                }
            </Media>
            <Media greaterThan="mobile">
                <label htmlFor="inputUploadImg_GTmobile" className="ui basic button mini">
                    { t('change')}
                <input
                    type='file'  hidden
                    lang="en" id="inputUploadImg_GTmobile"
                    accept='image/png, image/jpeg' onChange={onInputChange}
                />
                </label>
                {entity && entity.picture &&
                    <Button
                        basic icon='remove circle'
                        color="red" size='mini'
                        content= { t('delete') } onClick={handleDelete}
                    />
                }

            </Media>

            {
                inputImg && (
                    <Modal show={show} handleClose={hideModal} title="Crop Img">
                        <div className="ModalCrop">
                            <ImageCropper
                                setBlob={setBlob}
                                inputImg={inputImg}
                                form={entity.id === null ? null : "blob"}
                            />
                            <button type='submit' className="btn btn-secondary" onClick={handleSubmitImage}>{ t("confirm")}</button>
                            <button type='submit' className="btn btn-secondary" onClick={handleCancel}>{ t("cancel")}</button>
                        </div>
                    </Modal>
                )
            }
        </form>
    )
}

export default ImageUpload