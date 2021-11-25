
import React, { useState } from "react";
import { withTranslation } from 'react-i18next';
import { Container, Segment } from "semantic-ui-react";
import PictureForm from "../components/forms/picture/PictureForm";
import {CreateActivityForm} from "../components/entityForms/ActivityForms";
import {checkActivityFormValidity, HandleCreateActivity} from "../../__services/_Entity/activityServices";
import {FileUploadFormInput} from "../components/FilesComponents";
import FileInfos from "../components/forms/fileHandler/FileInfos";
import { BtnRemove} from "../components/Buttons";

const CreateActivity = ({ history, t }) => {

    const [loader, setLoader] = useState(false)
    const [activity, setActivity] = useState({
        id: undefined,
        picture:undefined,
        file:undefined,
        title: "",
        summary: {
            "en-GB":"",
            "fr-FR":"",
            "nl-BE":""
        },
        isPublic: false,
    });

    const postTreatment = ( newActivity ) => {
        setActivity(newActivity)
        history.replace('/activity/owned_' + newActivity.id)
    }

    const preSubmit = async (newActivity) => {
        if (checkActivityFormValidity(newActivity, setErrors)) {
            //handlingRequest
            await HandleCreateActivity(newActivity, postTreatment, setLoader, setErrors, history)
        }
    }
  /*  const handleSubmit = async(event) => {
        event.preventDefault()
        activity.summary = summary
        let newActivity

        //create activity entity
        let response = await activityAPI.post(activity)
            .catch(error => {
                console.log(error.response)
                setErrors(error.response)
            })
        if(response && response.status === 200){//if success
            newActivity = response.data[0]
        }
        setActivity(newActivity)
        history.replace('/activity/owned_' + newActivity.id)
    };*/

    const [errors, setErrors] = useState({
        file:"",
        picture:"",
        name: "",
        type: "",
        email: "",
        phone: "",
        summary:""
    });

    const handleCancel = (e) => {
        e.preventDefault()
        setActivity({ ...activity, file:undefined })
        //     if(onClose !== undefined) onClose(e)
    }

    return (
        <div className="card">
            <h1> {t('new_activity')} </h1>
            <Segment.Group horizontal>
                <Segment>
                    <PictureForm entityType="activity" entity={activity} setter={setActivity} />
                </Segment>
                <Segment placeholder>
                    <Container textAlign='center'>
                        <FileInfos activity={activity} />
                        <FileUploadFormInput activity={activity} setActivity={setActivity} />
                        {activity.file &&
                            <BtnRemove t={t} removeAction={(e)=>handleCancel(e)} />
                        }
                        {/*<FileUploadForm
                            t={t}
                            activity={activity}
                            postTreatment={setActivity}
                            error={errors}
                            history={history}
                        />*/}
                        {/*<FileUpload
                            activity={ activity } setter={ setActivity }
                            handleDirect={false}
                            errors={errors.file?errors.file:undefined}
                        />*/}
                    </Container>
                </Segment>
            </Segment.Group>

            <CreateActivityForm
                activity={activity} setActivity={setActivity}
                handleSubmit={preSubmit}
                loader={loader} errors={errors}
                history={history}
            />

        </div>
    );
};

export default withTranslation()(CreateActivity);

