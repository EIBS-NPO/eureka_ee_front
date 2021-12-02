
import React, { useState } from "react";
import { withTranslation } from 'react-i18next';
import { Container, Segment } from "semantic-ui-react";
import PictureForm from "../components/forms/picture/PictureForm";
import {CreateActivityForm} from "../components/entityForms/ActivityForms";
import {checkActivityFormValidity, HandleCreateActivity} from "../../__services/_Entity/activityServices";
import {FileUploadFormInput, FileInfos} from "../components/Inputs/FilesComponents";
//import FileInfos from "../components/forms/fileHandler/FileInfos";
import { BtnRemove} from "../components/Inputs/Buttons";
import {ContentContainer} from "../components/Loader";

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
        <ContentContainer
            loaderActive={loader}
            loaderMsg={ t('loading') +" : " + t('creation') +" "+ t('activity') }
        >
            <h1> {t('new_activity')} </h1>
            {!loader &&
            <Segment.Group horizontal>
                <Segment>
                    <PictureForm entityType="activity" entity={activity} setter={setActivity}/>
                </Segment>
                <Segment placeholder>
                    <Container textAlign='center'>
                        <FileInfos activity={activity}/>
                        <FileUploadFormInput activity={activity} setActivity={setActivity}/>
                        {activity.file &&
                        <BtnRemove t={t} removeAction={(e) => handleCancel(e)}/>
                        }
                    </Container>
                </Segment>
            </Segment.Group>
            }
            {!loader &&
            <CreateActivityForm
            activity={activity} setActivity={setActivity}
            handleSubmit={preSubmit}
            errors={errors}
            history={history}
            />
            }
        </ContentContainer>
    );
};

export default withTranslation()(CreateActivity);

