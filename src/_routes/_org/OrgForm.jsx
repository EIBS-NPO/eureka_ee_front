import React, { useEffect, useState} from 'react';
import orgAPI from '../../_services/orgAPI';
import {Button, Form, Icon, Item, Label, Segment} from "semantic-ui-react";
import {withTranslation} from "react-i18next";
import PictureForm from "../../_components/forms/PictureForm";
import TextAreaMultilang from "../../_components/forms/TextAreaMultilang";

const OrgForm = ( props ) => {

    const  org  = props.org

    const [updateOrg, setUpdateOrg] = useState({ })

    const [desc, setDesc] = useState(org.description)

    useEffect(() => {
        setUpdateOrg(org)
    },[])

    const [errors, setErrors] = useState({
        name:"",
        type:"",
        description: "",
        email:"",
        phone:""
    });

    const [loader, setLoader] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setUpdateOrg({ ...updateOrg, [name]: value })
    };

    const preSubmit = () => {
        org.description = desc;
        if(updateOrg.name){org.name = updateOrg.name}
        if(updateOrg.type){org.type = updateOrg.type}
        if(updateOrg.phone){org.phone = updateOrg.phone}
        if(updateOrg.email){org.nemail= updateOrg.email}
    }

    const cancelForm = (e) => {
        e.preventDefault()
        props.setForm(false)
    }


    //todo clean up ? marche? marche pas?
    const submit = () => {
            const abortController = new AbortController()
            const signal = abortController.signal

            preSubmit()

            setLoader(true);
            orgAPI.put(org, {signal:signal})
                .then(response => {
                    console.log(response.data[0])
                    props.setForm(false)
                    //todo confirmation
                })
                .catch(error => {
                    console.log(error)
                    setErrors(error.response)
                })
                .finally(() => {
                    setLoader(false)
                })
            //specify how to cleanup after this effect
            return function cleanup(){
                abortController.abort()
            }
    }

    return (
        <>
            <Segment>
                <PictureForm entityType="org" entity={org} setter={props.setter}/>
            </Segment>

            <Form onSubmit={submit} loading={loader}>
                <Segment>
                    <Item>
                        <Form.Input
                            label={props.t('name')}
                            name="name"
                            value={updateOrg.name ? updateOrg.name : ""}
                            onChange={handleChange}
                            placeholder={props.t('name') + "..."}
                            type="text"
                            error={errors.name ? errors.name : null}
                            required
                        />
                    </Item>
                    <Item>
                        <Form.Input
                            label={props.t('type')}
                            name="type"
                            type="text"
                            value={updateOrg.type ? updateOrg.type : ""}
                            onChange={handleChange}
                            placeholder={props.t('type') + "..."}
                            error={errors.type ? errors.type : null}
                            required
                        />
                    </Item>
                </Segment>

                <Segment>
                    <Label attached="top">
                        { props.t('contact') }
                    </Label>
                    <Form.Input
                        icon='mail'
                        iconPosition='left'

                        label={props.t('email')}
                        name="email"
                        type="email"
                        value={updateOrg.email ? updateOrg.email : ""}
                        onChange={handleChange}
                        placeholder={props.t('email') + "..."}
                        error={errors.email ? errors.email : null}
                    />
                    <Form.Input
                        icon='phone'
                        iconPosition='left'

                        label={props.t('phone')}
                        name="phone"
                        type="phone"
                        value={updateOrg.phone ? updateOrg.phone : ""}
                        onChange={handleChange}
                        placeholder={props.t('phone') + "..."}
                        error={errors.phone ? errors.phone : null}
                    />
                </Segment>

                <Segment>
                    <Label attached="top">
                        { props.t('description') }
                    </Label>
                    <TextAreaMultilang  tabText={desc} setter={setDesc} name="description" min={2} max={500}/>
                </Segment>

                <Button fluid animated >
                    <Button.Content visible>{ props.t('save') } </Button.Content>
                    <Button.Content hidden>
                        <Icon name='save' />
                    </Button.Content>
                </Button>
                <Button onClick={cancelForm} fluid animated>
                    <Button.Content visible>
                        { props.t('cancel') }
                    </Button.Content>
                    <Button.Content hidden>
                        <Icon name='cancel'/>
                    </Button.Content>
                </Button>
            </Form>
        </>
    );
};

export default withTranslation()(OrgForm);