import React, { useState } from "react";
import { withTranslation } from 'react-i18next';
import {Button, Checkbox, Container, Form, Icon, Item, Label, Segment } from "semantic-ui-react";
import activityAPI from "../../_services/activityAPI";
import TextAreaMultilang from "../../_components/forms/TextAreaMultilang";
import authAPI from "../../_services/authAPI";
import FileInfos from "../../_components/upload/FileInfos";
import FileUpload from "../../_components/upload/FileUpload";
import Modal from "../../_components/Modal";

const CreateActivity = ({ history, t }) => {
    if (!authAPI.isAuthenticated()) {
        authAPI.logout()
    }

    const [activity, setActivity] = useState({
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

    const handleSubmit = (event) => {
        event.preventDefault()
        activity.summary = summary

        activityAPI.post(activity)
            .then(response => {
            //    console.log(response.data)
                setActivity(response.data[0])
                setShow(true)//for add file
            })
            .catch(error => {
                console.log(error.response)
                setErrors(error.response.data.error);
            })
    };

    const [errors, setErrors] = useState({
        name: "",
        type: "",
        email: "",
        phone: "",
        summary:""
    });


    const [show, setShow] = useState(false)

    const hideModal = () => {
        setShow(false)
        history.replace('/activity/creator_' + activity.id)
      //  setUserTarget(undefined)
    }

    return (
        <div className="card">
            <h1> {t('new_activity')} </h1>
            <Form onSubmit={handleSubmit}>
                <Segment>

                    <Form.Input
                        /*icon='user'*/
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

                <Button fluid animated >
                    <Button.Content visible>{ t('save') } </Button.Content>
                    <Button.Content hidden>
                        <Icon name='save' />
                    </Button.Content>
                </Button>
            </Form>

            <Modal show={show} handleClose={hideModal} title={ t('confirmation')} >
                <div className={"card"}>
                    {activity &&
                    <>
                        <div className="messageBox">
                            <Segment placeholder>
                                <Container textAlign='center'>
                                    <FileInfos file={activity} />
                                    <FileUpload history={history} activity={ activity } setter={ setActivity } hideModal={hideModal}/>
                                </Container>
                            </Segment>
                        </div>
                    </>
                    }

                    {!activity &&
                    <p> { t('errors')} </p>
                    }

                </div>
            </Modal>

        </div>
    );
};

export default withTranslation()(CreateActivity);

