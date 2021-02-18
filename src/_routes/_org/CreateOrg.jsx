import React, { useContext, useState } from "react";
import { withTranslation } from 'react-i18next';
import OrgAPI from "../../_services/orgAPI";
import AuthContext from "../../_contexts/AuthContext";
import {Label, Segment, Button, Form, Icon, TextArea, Grid, Item} from "semantic-ui-react";
import AuthAPI from "../../_services/authAPI";

import TextAreaMultilang from "../../_components/forms/TextAreaMultilang";

const CreateOrg = ({ history, t }) => {
    AuthAPI.setup();
    const isAuthenticated = useContext(AuthContext);
    if (isAuthenticated === true) {
        history.replace('/');
    }

    const [org, setOrg] = useState({
        name: "",
        type: "",
        description: {},
        email: "",
        phone: "",
    });

    const [desc, setDesc] = useState({
        en:"",
        fr:"",
        nl:""
    })

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setOrg({ ...org, [name]: value });
    };

    const preSubmit = (event) => {
        event.preventDefault()
        console.log(desc)
        org.description = desc;
     //   setOrg({...org, description: desc})
        console.log(org)
        handleSubmit()
    }

    const handleSubmit = () => {
        OrgAPI.post(org)
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
            <h1> {t('new_org')} </h1>
                <Form onSubmit={preSubmit}>
                    <Segment>
                        {/*<Label attached="top">
                            { t('description') }
                        </Label>*/}
                            <Item>
                                <Form.Input
                                    label={t('name')}
                                    name="name"
                                    value={org.name}
                                    onChange={handleChange}
                                    placeholder={t('name') + "..."}
                                    type="text"
                                    error={errors.name ? errors.name : null}
                                    required
                                />
                            </Item>
                            <Item>
                                <Form.Input
                                    label={t('type')}
                                    name="type"
                                    type="text"
                                    value={org.type}
                                    onChange={handleChange}
                                    placeholder={t('type') + "..."}
                                    error={errors.type ? errors.type : null}
                                    required
                                />
                            </Item>
                    </Segment>

                    <Segment>
                        <Label attached="top">
                            { t('contact') }
                        </Label>
                        <Form.Input
                            icon='mail'
                            iconPosition='left'

                            label={t('email')}
                            name="email"
                            type="email"
                            value={org.email}
                            onChange={handleChange}
                            placeholder={t('email') + "..."}
                            error={errors.email ? errors.email : null}
                        />
                        <Form.Input
                            icon='phone'
                            iconPosition='left'

                            label={t('phone')}
                            name="phone"
                            type="phone"
                            value={org.phone}
                            onChange={handleChange}
                            placeholder={t('phone') + "..."}
                            error={errors.phone ? errors.phone : null}
                        />
                    </Segment>

                    <Segment>
                        <Label attached="top">
                            { t('description') }
                        </Label>
                            <TextAreaMultilang  tabText={desc} setter={setDesc}/>
                    </Segment>

                    <Button fluid animated >
                        <Button.Content visible>{ t('save') } </Button.Content>
                        <Button.Content hidden>
                            <Icon name='save' />
                        </Button.Content>
                    </Button>
                </Form>


        </div>
    );
};

export default withTranslation()(CreateOrg);

