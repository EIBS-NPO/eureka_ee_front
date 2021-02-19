import React, { useContext, useState } from "react";
import { withTranslation } from 'react-i18next';
import AuthContext from "../../_contexts/AuthContext";
import {Button, Checkbox, Form, Icon, Item, Label, TextArea} from "semantic-ui-react";
import AuthAPI from "../../_services/authAPI";
import activityAPI from "../../_services/activityAPI";

const CreateActivity = ({ history, t }) => {
    AuthAPI.setup();
    const isAuthenticated = useContext(AuthContext);
    if (isAuthenticated === true) {
        history.replace('/');
    }

    const [activity, setActivity] = useState({
        title: "",
        description: "",
        summary: "",
        isPublic: false,
    });

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setActivity({ ...activity, [name]: value });
    };

    const handlePublication = (event) => {
        if(!activity.isPublic){
            setActivity({ ...activity, "isPublic": true })
        }else {
            setActivity({ ...activity, "isPublic": false })
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(activity)
        activityAPI.post(activity)
            .then(response =>
                console.log(response.data)
            )
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
    });

    return (
        <div className="card">
            <h1> {t('new_activity')} </h1>
            <form className="center column" onSubmit={handleSubmit}>
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
                <TextArea
                    /*icon='tag'*/
                    iconPosition='left'

                    label={ t("description") }
                    name="description"
                    type="textarea"
                    minLength="2"
                    maxLength="250"
                    value={activity.type}
                    onChange={handleChange}
                    placeholder={ t("description") + "..."}
                    error={errors.type ? errors.type : null}
                    required
                />
                <TextArea
                    /*icon='email'*/
                    iconPosition='left'

                    label={ t("summary")}
                    name="summary"
                    type="textarea"
                    minLength="2"
                    maxLength="250"
                    value={activity.summary}
                    onChange={handleChange}
                    placeholder={ t("summary") + "..."}
                    error={errors.summary ? errors.summary : null}
                    required
                />
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
                <Button fluid animated >
                    <Button.Content visible>{ t('save') } </Button.Content>
                    <Button.Content hidden>
                        <Icon name='save' />
                    </Button.Content>
                </Button>
            </form>
        </div>
    );
};

export default withTranslation()(CreateActivity);

