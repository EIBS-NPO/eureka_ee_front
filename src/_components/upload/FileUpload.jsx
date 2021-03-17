
import React, { useState } from 'react';
import { Message, Item, Button, Form, Icon, Loader } from "semantic-ui-react";
import fileAPI from "../../_services/fileAPI";
import {useTranslation, withTranslation} from "react-i18next";
import authAPI from "../../_services/authAPI";
import FileInfos from "./FileInfos";

//todo config jpa sur type mime accepté par le button
/**
 *
 * @param history
 * @param activity
 * @param setter
 * @param hideModal
 * @returns {JSX.Element}
 * @constructor
 */
const FileUpload = ( { history, activity, setter, hideModal=false} ) => {
    const { t } = useTranslation()

    const [isSave, setIsSave] = useState(false)
    const [activityFile, setActivityFile] = useState(undefined)
    const [file, setFile] = useState(undefined)
    const [loader, setLoader] = useState(false)

    const onInputChange = (e) => {
        setFile(e.target.files[0])
        let reader = new FileReader()

        reader.addEventListener('load', () => {
            setActivityFile(reader.result)
        }, false)

        if (file) {
            reader.readAsDataURL(file)
        }
    }

    const [error, setError] = useState()

    const handleSubmitFile = (event) => {
        if ( !authAPI.isAuthenticated ) {
            history.replace.push('/login')
        }

        event.preventDefault()
        setLoader(true)
        let bodyFormData = new FormData();
        bodyFormData.append('file', file)
        bodyFormData.append('id', activity.id)

        //todo controle sur mimi GPA
        if(activity.fileType){
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

        }else {
            fileAPI.postFile(bodyFormData)
                .then(response => {
                    console.log(response)
                 //   redirectToNewActivity(response.data.id)
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
                console.log(response)
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
{/*file pdf outline*/}
            {!loader &&
                <Item>

                    {/*{!error && !activity.fileType &&*/}
                    {/*    <Message warning icon="file outline" header={ t('no_file') } />*/}
                    {/*}*/}

                    {error &&
                        <Message error icon="file" header={ error.status }>
                            <p> { error.data }</p>
                            <p>{ t( error.statusText )}</p>
                        </Message>

                        /* <Header icon>
                             <Icon name='pdf file outline' />
                             <p>{activity.filePath}</p>
                             <p>{utilities.octetsToKilos(activity.size) + "kB"}</p>
                         </Header>*/
                    }

                    {file !== undefined && !isSave &&
                        <Message info icon="file outline" header={ t('ready')} content={t('file_ready')}/>
                    }

                        <Form onSubmit={handleSubmitFile}>
                            <Form.Input
                                lang="en"
                                type='file'
                                //    accept='.pdf, .csv'
                                onChange={onInputChange}
                                /*hidden*/
                            />
                            {file && !isSave &&
                            <Button fluid animated>
                                <Button.Content visible>{t('save')} </Button.Content>
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