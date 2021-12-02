import React, {useContext, useState} from 'react'
import {Button } from "semantic-ui-react";
import ImageCropper from './ImageCropper'
import Modal from "../../Modal";
import '../../../../scss/components/Modal.scss';
import MediaContext from "../../../../__appContexts/MediaContext";
import {useTranslation} from "react-i18next";

const ImageUpload = ({ setter, entity}) => {

    const Media = useContext(MediaContext).Media

    const { t } = useTranslation()

    const [blob, setBlob] = useState(null)

    //image from form in base64
    const [inputImg, setInputImg] = useState('')

    const [oldPicture, setOldpicture] = useState(undefined)
    const onInputChange = (e) => {
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
        e.preventDefault()
        setter({...entity, "pictureFile": blob})
        hideModal()
    }

    const handleCancel = (e) => {
        e.preventDefault()
        if(oldPicture){ //if we have a oldPicture
            setter({ ...entity, "picture": oldPicture })
        }else{ //else juste remove.
            setter({ ...entity, "picture": undefined })
        }
        setter({...entity, "pictureFile": undefined})
        hideModal()
    }

    const handleDelete = (e) => {
        e.preventDefault()
        setter({ ...entity, "picture": null })
        setter({ ...entity, "pictureFile": null})
    }

    const [show, setShow] = useState(false)
    const showModal = () => {
        setShow(true)
    }

    const hideModal = () => {
        setShow(false)
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
                {entity.picture && entity.pictureFile !== null &&
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
                {entity.picture && entity.pictureFile !== null &&
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
                {entity.picture && entity.pictureFile !== null &&
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