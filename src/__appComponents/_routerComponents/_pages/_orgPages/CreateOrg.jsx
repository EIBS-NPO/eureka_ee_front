import React, { useState } from "react";
import { withTranslation } from 'react-i18next';
import OrgAPI from "../../../../__services/_API/orgAPI";
import {Label, Segment, Button, Form, Icon, Item, Loader} from "semantic-ui-react";

import TextAreaMultilang from "../__CommonComponents/forms/TextAreaMultilang";
import PictureForm from "../__CommonComponents/forms/picture/PictureForm";
import fileAPI from "../../../../__services/_API/fileAPI";
import * as url from "url";

const CreateOrg = ({ history, t }) => {

    const [loader, setLoader] = useState(false)
    const [org, setOrg] = useState({
        picture:undefined,
        name: "",
        type: "",
        description: {},
        email: "",
        phone: "",
    });

    const [desc, setDesc] = useState({
        'en-GB':"",
        'fr-FR':"",
        'nl-BE':""
    })

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setOrg({ ...org, [name]: value });
    };

    const preSubmit = (event) => {
        event.preventDefault()
        org.description = desc;
     //   setOrg({...org, description: desc})
        handleSubmit()
    }

    const handleSubmit = async() => {
        setLoader(true)
        let newOrg
        let urlMsg = ""

        let response = await OrgAPI.post(org)
            .catch(error => {
                console.log(error.response.data)
                setErrors(error.response.data);
            })
        if(response && response.status >= 200 && response.status < 300){
            switch(response.status){
                case 206 :
                    newOrg = response.data[1]
                    urlMsg = "_"+response.data[0].split(" : ")[2];
                    break;
                default :
                    newOrg = response.data[0]
            }
        }


        /*if(org.picture){
            let bodyFormData = new FormData();
            bodyFormData.append('image', org.picture)
            bodyFormData.append('id', newOrg.id)
            await fileAPI.uploadPic("org", bodyFormData)
                .catch(error => {
                    console.log(error.response)
                    setErrors({...error,"picture":error.response})
                })
        }*/

        history.replace("/org/owned_" + newOrg.id + urlMsg)
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
            {!loader &&
                <>
                    <Segment>
                        <PictureForm entityType="org" entity={org} setter={setOrg} />
                    </Segment>
                    <Form onSubmit={preSubmit}>
                        <Segment>
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
                                    label={t('legal_status')}
                                    name="type"
                                    type="text"
                                    value={org.type}
                                    onChange={handleChange}
                                    placeholder={t('legal_status') + "..."}
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
                            <TextAreaMultilang  tabText={desc} setter={setDesc} name="description" min={2} max={500}/>
                        </Segment>

                        <Button fluid animated >
                            <Button.Content visible>{ t('save') } </Button.Content>
                            <Button.Content hidden>
                                <Icon name='save' />
                            </Button.Content>
                        </Button>
                    </Form>
                </>

            }
            {loader &&
            <Segment>
                <Loader
                    active
                    content={
                        <p>{t('loading') +" : " + t('creation') }</p>
                    }
                    inline="centered"
                />
            </Segment>
            }
        </div>
    );
};

export default withTranslation()(CreateOrg);

