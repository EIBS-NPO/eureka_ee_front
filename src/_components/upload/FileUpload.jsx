
import React, {useContext, useState} from 'react';
import { Message, Item, Button, Form, Icon, Loader, Segment, Header} from "semantic-ui-react";
import fileAPI from "../../_services/fileAPI";
import {useTranslation, withTranslation} from "react-i18next";
import utilities from "../../_services/utilities";
import AuthContext from "../../_contexts/AuthContext";
import authAPI from "../../_services/authAPI";

//todo config jpa sur type mime accepté par le button
/**
 *
 * @param history
 * @param activity
 * @param setter
 * @returns {JSX.Element}
 * @constructor
 */
const FileUpload = ( { history, activity, setter} ) => {
    if ( !authAPI.isAuthenticated ) {
        console.log('test pour voir')
        history.replace.push('/login')
    }

    const { t } = useTranslation()

 //   console.log(activity)

    const [activityFile, setActivityFile] = useState()
    const [file, setFile] = useState()
    const [loader, setLoader] = useState(false)

    const onInputChange = (e) => {
        setFile(e.target.files[0])
        let reader = new FileReader()

        //todo sert a quetchy
        reader.addEventListener('load', () => {
            setActivityFile(reader.result)
        //    console.log(activityFile);
        }, false)

        if (file) {
            reader.readAsDataURL(file)
        }
    }

    const [error, setError] = useState()
 //   console.log(error)

    /*const redirectToNewActivity = (id) => {
       return <Redirect to={"/activity/creator_" + id}/>
    }*/

    const handleSubmitFile = (event) => {
        event.preventDefault()
        setLoader(true)
        let bodyFormData = new FormData();
        console.log(file);
        bodyFormData.append('file', file)
        bodyFormData.append('id', activity.id)

        //todo controle sur mimi GPA
        if(activity.fileType){
            fileAPI.putFile(bodyFormData)
            .then(response => {
                console.log(response)
                setter(response.data[0])
            })
            .catch(error => {
                //handle error
                console.log(error.response)
                console.log(error.response.data)
                console.log(error.response.status)
                console.log(error.response.statusText)
                setError(error.response)
            })
            .finally(() => setLoader(false))

        }else {
            fileAPI.postFile(bodyFormData)
                .then(response => {
                    console.log(response)
                 //   redirectToNewActivity(response.data.id)
                    setter(response.data[0])
                    history.replace('/activity/creator_'+response.data[0].id)
                })
                .catch(error => {
                    console.log(error)
                    setError(error.response)
                })
                .finally(() => setLoader(false))
        }

    }

    return (
        <>
            {loader &&
                <Loader
                    active
                    content={
                        <p>{t('loading') +" : " + t('presentation') }</p>
                    }
                    inline="centered"
                />
            }
{/*file pdf outline*/}
            {!loader &&
                <Item>

                    {!error && !activity.fileType &&
                    /*<Header icon>
                        <Icon name='pdf file outline' />

                        No documents are listed for this customer.
                    </Header>*/
                        <Message warning icon="file outline" header={ t('no_file') } />
                    }

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

                    <Form onSubmit={handleSubmitFile}>
                        <Form.Input
                            lang="en"
                            type='file'
                         //    accept='.pdf, .csv'
                            onChange={onInputChange}
                            /*hidden*/
                        />
                        <Button fluid animated >
                            <Button.Content visible>{ t('save') } </Button.Content>
                            <Button.Content hidden>
                                <Icon name='save' />
                            </Button.Content>
                        </Button>
                    </Form>
                </Item>
            }
    </>
    )
}

export default withTranslation()(FileUpload)