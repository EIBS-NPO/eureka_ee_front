
import React, {useContext, useEffect, useState} from 'react';
import { Message, Item, Button, Form, Icon, Loader } from "semantic-ui-react";
import fileAPI from "../../../../../../__services/_API/fileAPI";
import {useTranslation, withTranslation} from "react-i18next";
import authAPI from "../../../../../../__services/_API/authAPI";
import FileInfos from "./FileInfos";
import MediaContext from "../../../../../../__appContexts/MediaContext";
import AuthContext from "../../../../../../__appContexts/AuthContext";

//todo test allowedMimes in MediaContext
//todo hideModal useLess?
//todo traduction
/**
 *
 * @param history for redirect if necessary
 * @param activity activity or activityFile entity get by backend
 * @param setter to update the state of activity
 * @param hideModal if a modal is necessary
 * @param handleDirect to call directly the backend
 * @param errors for error throws by front controls
 * @returns {JSX.Element}
 * @constructor
 * @author Thierry Fauconnier <th.fauconnier@outlook.fr>
 */
const FileUpload = ( { history=undefined, activity, setter, hideModal=false, handleDirect=true, errors=undefined}) => {
    const { t } = useTranslation()

    const [isSave, setIsSave] = useState(false)
    const [activityFile, setActivityFile] = useState(undefined)
    const [loader, setLoader] = useState(false)

    const currentFile = activity.file ? activity.file :  activity

    const [error, setError] = useState(errors?errors:undefined)

  //  const [isValid, setIsValid] = useState(true)

    const allowedMimes = useContext(MediaContext).allowedMimes

    const isValid = () => {
        let fileType = currentFile.type ? currentFile.type : currentFile.fileType
        return allowedMimes.includes(fileType)
    }

    const onInputChange = (e) => {

    //    setIsValid(false)
        let file = e.target.files[0]

        let reader = new FileReader()

        //todo useless?
        reader.addEventListener('load', () => {
            setActivityFile(reader.result)
        }, false)

        if (file) {
            reader.readAsDataURL(file)
            setter({...activity, "file": file})
        }
    }



    const handleSubmitFile = (event) => {
        event.preventDefault()

        setLoader(true)

        let bodyFormData = new FormData();

        bodyFormData.append('file', currentFile)
        bodyFormData.append('id', activity.id)

        if(activity.fileType){ //for update a file
            fileAPI.putFile(bodyFormData)
                .then(response => {
                    console.log(response)
                    setter(response.data[0])
                    setIsSave(true)
                })
                .catch(error => {
                    setError(error.response)
                })
                .finally(() => setLoader(false))

        }else { //for create a new file
            fileAPI.postFile(bodyFormData)
                .then(response => {
                    setter(response.data[0])
                    setIsSave(true)
                    if(!hideModal){
                        history.replace('/activity/creator_' + response.data[0].id)
                    }
                })
                .catch(error => {
                    console.log(error.response)
                    setError(error.response)
                })
                .finally(() => setLoader(false))
        }

    }

    const handleDelete = () => {
        if ( !authAPI.isAuthenticated ) {
            history.replace.push('/login')
        }

        setLoader(true)
        fileAPI.remove(activity.id)
            .then(response => {
                setter(response.data[0])
                history.replace('/activity/creator_' + response.data[0].id)
            })
            .catch(error => {
                console.log(error.response)
            })
            .finally(() => setLoader(false))
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
                    <FileInfos file={ currentFile } isValid={isValid()} />
                    {error &&
                        <Message error icon="file" header={ error.status }>
                            <p> { error.data }</p>
                            <p>{ t( error.statusText )}</p>
                        </Message>
                    }

                    {activity.file !== undefined && !error && !isValid() &&
                        <Message error icon="file" >
                            <p>{t("Supported_Media_Type") + allowedMimes.join(',')} </p>
                        </Message>
                    }

                    {activity.file !== undefined && !isSave && isValid() &&
                        <Message info icon="file outline" header={ t('ready')} content={t('file_ready')}/>
                    }

                        <Form onSubmit={handleSubmitFile}>
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

                            {activity.file && handleDirect &&
                            <Button fluid animated disabled={!isValid()}>
                                <Button.Content visible >{t('save')} </Button.Content>
                                <Button.Content hidden>
                                    <Icon name='save'/>
                                </Button.Content>
                            </Button>
                            }
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

                    {hideModal !== false &&
                    <Form onSubmit={hideModal}>
                        <Button fluid animated >
                            <Button.Content visible>{ t('finish') } </Button.Content>
                            <Button.Content hidden>
                                <Icon name='thumbs up' />
                            </Button.Content>
                        </Button>
                    </Form>
                    }
                </Item>
            }
    </>
    )
}

export default withTranslation()(FileUpload)