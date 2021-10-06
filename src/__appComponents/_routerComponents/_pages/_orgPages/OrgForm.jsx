import React, { useState} from 'react';
import orgAPI from '../../../../__services/_API/orgAPI';
import {Button, Form, Icon, Item, Label, Segment} from "semantic-ui-react";
import {withTranslation} from "react-i18next";
import PictureForm from "../__CommonComponents/forms/picture/PictureForm";
import TextAreaMultilang from "../__CommonComponents/forms/TextAreaMultilang";
//import AddressForm from "../__CommonComponents/forms/AddressForm";

/**
 *
 * @param props (org, setter )
 * props.hideModal (optionnal)
 * props.setForm (optionnal)
 * @returns {JSX.Element}
 * @constructor
 */
const OrgForm = ( props ) => {


    const  org  = props.org

    const [updateOrg, setUpdateOrg] = useState( org )


    const [desc, setDesc] = useState(org.description)

    /*useEffect(() => {
        setUpdateOrg(org)
    },[])*/

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
        if(updateOrg.email){org.email= updateOrg.email}
    }

    const cancelForm = (e) => {
        if(props.hideModal !== undefined){
            props.hideModal()
        }else {
            e.preventDefault()
            props.setForm(false)
        }
    }



    const submit = () => {
           /* const abortController = new AbortController()
            const signal = abortController.signal
*/

            preSubmit()
            setLoader(true);
            orgAPI.put(org/*, {signal:signal}*/)
                .then(response => {
                    props.setter(response.data[0])
                    if(props.setForm !== undefined){ props.setForm(false) }
                    if(props.handleEditOrg !== undefined){ props.handleEditOrg(response.data[0]) }
                    //todo msg-confirmation
                })
                .catch(error => {
                    console.log(error)
                    setErrors(error)
                })
                .finally(() => {
                    setLoader(false)
                    if(props.hideModal !== undefined){
                        props.hideModal()
                    }
                })
            //specify how to cleanup after this effect
           /* return function cleanup(){
                abortController.abort()
            }*/
    }

    const handleDelete = () => {
        setLoader(true)
        orgAPI.remove(org.id)
            .then(() => {
                props.history.replace('/all_organizations/creator')
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => setLoader(false))
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
                            value={updateOrg && updateOrg.name ? updateOrg.name : ""}
                            onChange={handleChange}
                            placeholder={props.t('name') + "..."}
                            type="text"
                            error={ errors.name ? errors.name : null}
                            required
                        />
                    </Item>
                    <Item>
                        <Form.Input
                            label={props.t('type')}
                            name="type"
                            type="text"
                            value={updateOrg && updateOrg.type ? updateOrg.type : ""}
                            onChange={handleChange}
                            placeholder={props.t('type') + "..."}
                            error={ errors.type ? errors.type : null}
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
                        value={updateOrg && updateOrg.email ? updateOrg.email : ""}
                        onChange={handleChange}
                        placeholder={props.t('email') + "..."}
                        error={ errors.email ? errors.email : null}
                    />
                    <Form.Input
                        icon='phone'
                        iconPosition='left'

                        label={props.t('phone')}
                        name="phone"
                        type="phone"
                        value={updateOrg && updateOrg.phone ? updateOrg.phone : ""}
                        onChange={handleChange}
                        placeholder={props.t('phone') + "..."}
                        error={ errors.phone ? errors.phone : null}
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
            <Segment>
                <Button
                    basic
                    icon='remove circle'
                    color="red"
                    size='large'
                    content= { props.t('delete') }
                    onClick={handleDelete}
                />
            </Segment>
        </>
    );
};

export default withTranslation()(OrgForm);