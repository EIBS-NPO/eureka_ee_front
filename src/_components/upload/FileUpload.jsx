
import React, { useState } from 'react';
import {Item, Button, Form, Icon, Loader, Segment, Header} from "semantic-ui-react";
import fileAPI from "../../_services/fileAPI";
import {withTranslation} from "react-i18next";
import utilities from "../../_services/utilities";



const FileUpload = ( props ) => {

    const activity = props.activity
    console.log(props.activity)
 //   console.log(activityFile)

    const [activityFile, setActivityFile] = useState()
    const [file, setFile] = useState()
    const [loader, setLoader] = useState(false)


    /*//todo verif si fonction pour file, ca vient du uploader d'image*/
    const onInputChange = (e) => {
        setFile(e.target.files[0])
        let reader = new FileReader()

        //todo utile?
        reader.addEventListener('load', () => {
            console.log(reader.result)
            setActivityFile(reader.result)
        }, false)

        if (file) {
            reader.readAsDataURL(file)
        }
    }

    const handleSubmitFile = (event) => {
        event.preventDefault()
        setLoader(true)
        let bodyFormData = new FormData();
        bodyFormData.append('file', file)
        bodyFormData.append('id', activity.id)


        fileAPI.uploadFile( bodyFormData )
            .then(response => {
                //    notification.successNotif('nouvelle photo de profil bien enregistrée')
                //  setRefresh(response.data[0].picture)
                console.log(response)
                props.setter(response.data)
                // parentCallBack()
            })
            .catch(error => {
                //handle error
                console.log(error);
            })
            .finally(() => setLoader(false))
    }

    return (
        <>
            {loader &&
                <Loader
                    active
                    content={
                        <p>{props.t('loading') +" : " + props.t('presentation') }</p>
                    }
                    inline="centered"
                />
            }
{/*file pdf outline*/}
            {!loader &&
                <Item>

                    {!activity.fileType &&
                    <Header icon>
                        <Icon name='pdf file outline' />

                        No documents are listed for this customer.
                    </Header>
                    }
                    {activity.fileType &&
                    <Header icon>
                        <Icon name='pdf file outline' />
                        <p>{activity.filePath}</p>
                        <p>{utilities.octetsToKilos(activity.size) + "kB"}</p>
                    </Header>
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
                            <Button.Content visible>{ props.t('save') } </Button.Content>
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