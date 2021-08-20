import React, { useState } from "react";
import { withTranslation } from 'react-i18next';
import {Button, Checkbox, Container, Form, Icon, Item, Label, Segment } from "semantic-ui-react";
import activityAPI from "../../_services/activityAPI";
import TextAreaMultilang from "../../_components/forms/TextAreaMultilang";
import authAPI from "../../_services/authAPI";
import FileUpload from "../../_components/upload/FileUpload";
import PictureForm from "../../_components/forms/PictureForm";
import fileAPI from "../../_services/fileAPI";

const CreateActivity = ({ history, t }) => {
    if (!authAPI.isAuthenticated()) {
        authAPI.logout()
    }

    const [activity, setActivity] = useState({
        id: undefined,
        picture:undefined,
        file:undefined,
        title: "",
        summary: {},
        isPublic: false,
    });

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setActivity({ ...activity, [name]: value });
    };

    const handlePublication = () => {
        if(!activity.isPublic){
            setActivity({ ...activity, "isPublic": true })
        }else {
            setActivity({ ...activity, "isPublic": false })
        }
    }

    const [summary, setSummary] = useState([])

    const handleSubmit = async(event) => {
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

        //add picture to the created activity
        if(activity.picture){
            console.log("save picture")
            let bodyFormData = new FormData();
            bodyFormData.append('image', activity.picture)
            bodyFormData.append('id', newActivity.id)
            await fileAPI.uploadPic("activity", bodyFormData)
                .catch(error => {
                    console.log(error.response)
                    setErrors({...error,"picture":error.response})
                })
        }

        //add file to the created activity
        if(activity.file){
            console.log("save file")
            let bodyFormData = new FormData();
            bodyFormData.append('file', activity.file)
            bodyFormData.append('id', newActivity.id)

            let response = await fileAPI.postFile(bodyFormData)
                .catch(error => {
                    console.log(error.response)
                    setErrors({...error,"file":error.response})
                })
            if(response && response.status === 200){//if success
                newActivity = response.data[0]
            }

        }
        setActivity(newActivity)
        history.replace('/activity/creator_' + newActivity.id)
    };

    const [errors, setErrors] = useState({
        file:"",
        picture:"",
        name: "",
        type: "",
        email: "",
        phone: "",
        summary:""
    });

    return (
        <div className="card">
            <h1> {t('new_activity')} </h1>
            <Segment.Group horizontal>
                <Segment>
                    <PictureForm entityType="activity" entity={activity} setter={setActivity} />
                </Segment>
                <Segment placeholder>
                    <Container textAlign='center'>
                        {/*<FileInfos activity={activity} />*/}
                        <FileUpload activity={ activity } setter={ setActivity } handleDirect={false} errors={errors.file?errors.file:undefined}/>
                    </Container>
                </Segment>
            </Segment.Group>

            <Form onSubmit={handleSubmit}>
                <Segment>
                    <Form.Input
                        iconPosition='left'

                        label={t('title')}
                        name="title"
                        value={activity.title}
                        onChange={handleChange}
                        placeholder={t('title') + "..."}
                        type="text"
                        error={errors.title ? errors.title : null}
                        required
                    />
                </Segment>


                <Segment>
                    <Label attached="top">
                        { t('description') }
                    </Label>
                    <TextAreaMultilang  tabText={summary} setter={setSummary} name="summary" min={2} max={500}/>

                </Segment>

                <Segment>
                    <Item>
                        {activity.isPublic ?
                            <Label color="green" size="small" horizontal>
                                { t("public") }
                            </Label>
                            :
                            <Label size="small" horizontal>
                                { t("private") }
                            </Label>
                        }
                        <Checkbox
                            name='isPublic'
                            checked={activity.isPublic}
                            onChange={handlePublication}
                            toggle
                        />
                    </Item>
                </Segment>

                <Button className="ui primary basic button" fluid animated >
                    <Button.Content visible>{ t('save') } </Button.Content>
                    <Button.Content hidden>
                        <Icon name='save' />
                    </Button.Content>
                </Button>
            </Form>
        </div>
    );
};

export default withTranslation()(CreateActivity);

