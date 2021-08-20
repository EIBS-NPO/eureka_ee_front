
import React, { useState } from 'react';
import { Message, Item, Button, Form, Icon, Loader } from "semantic-ui-react";
import fileAPI from "../../_services/fileAPI";
import {useTranslation, withTranslation} from "react-i18next";
import authAPI from "../../_services/authAPI";
import FileInfos from "./FileInfos";

//todo config jpa sur type mime accepté par le button
//todo hideModal useLess?
/**
 *
 * @param history
 * @param activity
 * @param setter
 * @param hideModal
 * @param handleDirect
 * @param errrors
 * @returns {JSX.Element}
 * @constructor
 */
const FileUpload = ( { history=undefined, activity, setter, hideModal=false, handleDirect=true, errors=undefined}) => {
    const { t } = useTranslation()
    console.log(activity)

    const [isSave, setIsSave] = useState(false)
    const [activityFile, setActivityFile] = useState(undefined)
    const [loader, setLoader] = useState(false)

    const currentFile = activity.file ? activity.file :  activity

    //todo add error by param?
    const [error, setError] = useState(errors?errors:undefined)

    /*
    //todo controle sur mime GPA
    //todo requete recup mime autorisé.
    //todo compare avec le format du fichier, lever une erreur et désactivé le form
    ou
    //todo envoie le mime fichier au back pour lui demander si autorisé !
    //todo sauf que ca revient a envoiyé le fichier est avoir une réponse négative du back, sauf que la on préviens l'utilisateur.
    //todo donc il faudrait pouvoir bloquer la création si le fichier n'est pas bon. a voir dans le back. si existance de fichier et si il est bon. puis dans le front gérer le retour errur mime en restant sur le form.
     */

    const onInputChange = (e) => {
        let file = e.target.files[0]
    //    setCurrentFile(file)
        console.log("inputChange")
//console.log(file)
        let reader = new FileReader()

        //todo useless?
        reader.addEventListener('load', () => {
            setActivityFile(reader.result)
        }, false)

        if (file) {
            reader.readAsDataURL(file)

            console.log(handleDirect)
            if(!handleDirect){ //case of the file will be handled by a parent form. just pass the file
                console.log("give the file to createForm")
              //  activity.file=file;
              //  setter(activity)

            }
            setter({...activity, "file": file})
        }
    }



    const handleSubmitFile = (event) => {
        event.preventDefault()
        /*if ( !authAPI.isAuthenticated ) {
            history.replace.push('/login')
        }*/

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
                    //            console.log(response)
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
         //       console.log(response)
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

                    {/*{!error && !activity.fileType &&*/}
                    {/*    <Message warning icon="file outline" header={ t('no_file') } />*/}
                    {/*}*/}
                    <FileInfos file={ currentFile } />
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

                    {activity.file !== undefined && !isSave &&
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
                            {activity.file && !isSave && handleDirect &&
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