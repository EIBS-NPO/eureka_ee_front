
import React, {useContext, useState} from 'react';
import {Message, Item, Button, Form, Icon, Loader, Segment} from "semantic-ui-react";
import {useTranslation, withTranslation} from "react-i18next";
import authAPI from "../../../../__services/_API/authAPI";
import FileInfos from "./FileInfos";
import MediaContext from "../../../../__appContexts/MediaContext";
import activityAPI from "../../../../__services/_API/activityAPI";

/**
 *
 * @param history for redirect if necessary
 * @param activity activity or activityFile entity get by backend
 * @param setter to update the state of activity
 * @param cancelForm
 * @param hideModal if a modal is necessary
 * @param handleDirect to call directly the backend
 * @param errors for error throws by front controls
 * @returns {JSX.Element}
 * @constructor
 * @author Thierry Fauconnier <th.fauconnier@outlook.fr>
 */
const FileUpload = ( { history=undefined, activity, setter, cancelForm, hideModal, handleSubmit = undefined, errors=undefined}) => {
    const { t } = useTranslation()

    const [isSave, setIsSave] = useState(false)
    const [newFile, setNewFile] = useState(undefined)

    const [loader, setLoader] = useState(false)

    const currentFile = activity.file ? activity.file :  activity

    const [error, setError] = useState(errors?errors:undefined)

    const allowedMimes = useContext(MediaContext).allowedMimes

    const isValid = (testedFile) => {
        let fileType = testedFile.type ? testedFile.type : testedFile.fileType
        return allowedMimes.includes(fileType)
    }

    const onInputChange = (e) => {

    //    setIsValid(false)
        let file = e.target.files[0]

        let reader = new FileReader()

        reader.addEventListener('load', () => {
            setNewFile(reader.result)
        }, false)

        if (file) {
            reader.readAsDataURL(file)
            if(handleSubmit === undefined){
                setNewFile(file)
            }else {
                setter({...activity, "file": file})
            }
        }
    }


    const preSubmit = () => {
     //   event.preventDefault()
        //todo check validation
        if(handleSubmit !== undefined){
            handleSubmit(activity)
        }else {
            handleSubmitFile()
        }
    }

    const handleSubmitFile = () => {
    //    event.preventDefault()

        setLoader(true)
       // if(activity.fileType){ //for update a file
        activityAPI.put({id:activity.id, file:newFile}, {})
            .then(response => {
                setter(response.data[0])
                setIsSave(true)
                history.replace('/activity/owned_' + response.data[0].id)
                hideModal()
            })
            .catch(error => {
                setError(error.response)
            })
            .finally(() => setLoader(false))

    }

    const handleDelete = () => {

        setNewFile(null)
        handleSubmitFile()
    }

    return (
        <>
            {loader &&
                <Loader
                    active
                    content={
                        <p>{t('loading') +" : " + t('upload') }</p>
                    }
                    inline="centered"
                />
            }

            {!loader &&
                <Item>
                    <FileInfos file={ currentFile } isValid={isValid(currentFile)} />
                    {error &&
                        <Message error icon="file" header={ error.status }>
                            <p> { error.data }</p>
                            <p>{ t( error.statusText )}</p>
                        </Message>
                    }

                    {activity.file !== undefined && !error && !isValid(currentFile) &&
                        <Message error icon="file" >
                            <p>{t("Supported_Media_Type") + allowedMimes.join(',')} </p>
                        </Message>
                    }

                    {newFile !== undefined && !isSave && isValid(newFile) &&
                        <Message info icon="file outline" header={ t('ready')} content={t('file_ready')}/>
                    }

                        <Form onSubmit={preSubmit}>
                            <label htmlFor="inputUploadFile" className="ui basic button mini">
                                { t('select') }
                                <input
                                    lang="en"
                                    type='file'
                                    accept={allowedMimes.join(',')}
                                    onChange={onInputChange}
                                    id="inputUploadFile"
                                    hidden
                                />
                            </label>

                            {newFile && handleSubmit === undefined &&
                                <Segment className="center" basic>
                                    <Form.Group>
                                        <Button.Group>
                                            <Button size="small" onClick={cancelForm}> { t("cancel") } </Button>
                                            <Button.Or />
                                            <Button size="small" positive disabled={!isValid(newFile)}> { t("save") } </Button>
                                        </Button.Group>
                                    </Form.Group>
                                </Segment>
                            }



                            {/*
                                activity.file && handleDirect &&
                                <Button fluid animated disabled={!isValid()}>
                                    <Button.Content visible >{t('save')} </Button.Content>
                                    <Button.Content hidden>
                                        <Icon name='save'/>
                                    </Button.Content>
                                </Button>
                            */}
                        </Form>

                    {activity.fileType &&
                        <Form onSubmit={handleDelete}>
                            <Button fluid animated >
                                <Button.Content visible>{ t('delete') } </Button.Content>
                                <Button.Content hidden>
                                    <Icon name='delete' />
                                </Button.Content>
                            </Button>
                        </Form>
                    }

                    {/*{hideModal !== false &&
                    <Form onSubmit={hideModal}>
                        <Button fluid animated >
                            <Button.Content visible>{ t('finish') } </Button.Content>
                            <Button.Content hidden>
                                <Icon name='thumbs up' />
                            </Button.Content>
                        </Button>
                    </Form>
                    }*/}
                </Item>
            }
    </>
    )
}

export default withTranslation()(FileUpload)