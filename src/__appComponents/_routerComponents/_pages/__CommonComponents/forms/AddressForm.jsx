
import React, { useState, useEffect } from 'react';
import {Container, Button, Form, Icon, Item, Label, Segment} from "semantic-ui-react";
import {useTranslation, withTranslation} from "react-i18next";
import addressAPI from "../../../../../__services/_API/addressAPI";
import userAPI from "../../../../../__services/_API/userAPI";
import utilities from "../../../../../__services/utilities";
import orgAPI from "../../../../../__services/_API/orgAPI";

const AddressForm = ({ type, obj, setter }) => {

    const { t } = useTranslation()

    const [address, setAddress] = useState(undefined)
    const [update,setUpdate] = useState(false)

    const [errors, setErrors] = useState({
        id:undefined,
        address: "",
        complement: "",
        country:"",
        city:"",
        zipCode:""
    });

    const [loader, setLoader] = useState(false);

    const isOwner = () => {
        let userMail = userAPI.checkMail()

        if(type === "user"){
            return obj && obj.email === userMail
        }
        else{
            return obj.referent.email === userMail
        }
    }

    useEffect(() => {
        if(obj !== undefined) {
            setAddress(obj.address)
        }
    },[obj])

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setAddress({ ...address, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoader(true);

        obj.address = address;
        if(type === "org"){
            orgAPI.put(obj)
                .then(response => {
                    setter(response.data[0])
                })
                .catch(error => {
                    setErrors(error.response.data)
                    console.log(error.response)
                })
                .finally(()=> {
                    setLoader(false)
                })
        }
        else if(type === "user"){
            userAPI.put(obj)
                .then(response => {
                    setter(response.data[0])
                })
                .catch(error => {
                    setErrors(error.response.data)
                    console.log(error.response)
                })
                .finally(()=> {
                    setLoader(false)
                })
        }
    };

    const handleDelete = () => {

    }

    const switchUpdate = (e) => {
        e.preventDefault()
        setUpdate(true)
    }
    const stopUpdate = (e) => {
        e.preventDefault()
        setUpdate(false)
    }

    return (
        <Item.Group>
            <Item>
                <Item.Content>
                    <Label attached='top'>
                        <h4>{utilities.strUcFirst(t("address"))}</h4>
                    </Label>
                    {update &&
                        <Form onSubmit={handleSubmit} loading={loader}>
                            <Segment className="unpadded" basic>
                                <Form.Field >
                                    <Label basic color="blue" size="tiny" attached="top">
                                        { t("address") }
                                    </Label>
                                    <input
                                        className="w-70 text-center"
                                        name="address"
                                        type="text"
                                        minLength={2}
                                        maxLength={255}
                                        value={address && address.address ? address.address : ""}
                                        onChange={handleChange}
                                        //    errors={errors.firstname ? errors.firstname : null}
                                        required
                                    />
                                    {errors && errors.address && <p className="error">{errors.address}</p>}
                                </Form.Field>
                            </Segment>

                            <Segment className="unpadded" basic>
                                <Form.Field >
                                    <Label basic color="blue" size="tiny" attached="top">
                                        { t("complement") }
                                    </Label>
                                    <input
                                        className="w-70 text-center"
                                        name="complement"
                                        type="text"
                                        maxLength={255}
                                        value={address && address.complement ? address.complement : ""}
                                        onChange={handleChange}
                                        //    errors={errors.firstname ? errors.firstname : null}
                                      //  required
                                    />
                                    {errors && errors.complement && <p className="error">{errors.complement}</p>}
                                </Form.Field>
                            </Segment>

                            <Segment className="unpadded" basic>
                                <Form.Field >
                                    <Label basic color="blue" size="tiny" attached="top">
                                        { t("city") }
                                    </Label>
                                    <input
                                        className="w-70 text-center"
                                        name="city"
                                        type="text"
                                        minLength={2}
                                        maxLength={30}
                                        value={address && address.city ? address.city : ""}
                                        onChange={handleChange}
                                        //    errors={errors.firstname ? errors.firstname : null}
                                        required
                                    />
                                    {errors && errors.city && <p className="error">{errors.city}</p>}
                                </Form.Field>
                            </Segment>

                            <Segment className="unpadded" basic>
                                <Form.Field >
                                    <Label basic color="blue" size="tiny" attached="top">
                                        { t("zipCode") }
                                    </Label>
                                    <input
                                        className="w-70 text-center"
                                        name="zipCode"
                                        type="text"
                                        minLength={2}
                                        maxLength={10}
                                        value={address && address.zipCode ? address.zipCode : ""}
                                        onChange={handleChange}
                                        //    errors={errors.firstname ? errors.firstname : null}
                                        required
                                    />
                                    {errors && errors.zipCode && <p className="error">{errors.zipCode}</p>}
                                </Form.Field>
                            </Segment>

                            <Segment className="unpadded" basic>
                                <Form.Field >
                                    <Label basic color="blue" size="tiny" attached="top">
                                        { t("country") }
                                    </Label>
                                    <input
                                        className="w-70 text-center"
                                        name="country"
                                        type="text"
                                        minLength={2}
                                        maxLength={10}
                                        value={address && address.country ? address.country : ""}
                                        onChange={handleChange}
                                        //    errors={errors.firstname ? errors.firstname : null}
                                        required
                                    />
                                    {errors && errors.country && <p className="error">{errors.country}</p>}
                                </Form.Field>
                            </Segment>

                            <Button.Group>
                                <Button size="small" onClick={stopUpdate}> { t("cancel") } </Button>
                                <Button.Or />
                                <Button size="small" positive > { t("save") } </Button>
                               {/* <Button.Or />
                                <Button
                                    basic icon='remove circle'
                                    color="red" size='mini'
                                    content= { t('delete') } onClick={handleDelete}
                                />*/}
                            </Button.Group>
                            
                            <Segment basic>
                                <Button
                                    basic icon='remove circle'
                                    color="red" size='mini'
                                    content= { t('delete') } onClick={handleDelete}
                                />
                            </Segment>
                        </Form>
                    }
                    {!update &&
                        <Item.Description>
                            <Item.Group divided >
                                <Item>
                                    <Item.Content verticalAlign='middle'>
                                        <Item.Description>
                                            {address !== undefined ?
                                                <>
                                                    <p><b>{address.address}</b></p>
                                                    {address.complement &&<p><b>{address.complement}</b></p>}
                                                    <p>
                                                        <b>
                                                            {address.zipCode + " " +
                                                            address.city + " " +
                                                            address.country}
                                                        </b>
                                                    </p>
                                                </>
                                                :
                                                <p>
                                                    { t('not_specified') }
                                                </p>
                                            }

                                        </Item.Description>
                                    </Item.Content>
                                </Item>
                                {isOwner() &&
                                <Item>
                                    <Item.Content>
                                        <Button as='div' labelPosition='right' onClick={switchUpdate}>
                                            <Button basic color='blue'>
                                                {t('change')}
                                            </Button>
                                            <Label basic color='blue'>
                                                <Icon name='edit' />
                                            </Label>
                                        </Button>
                                    </Item.Content>
                                </Item>
                                }
                            </Item.Group>
                        </Item.Description>
                    }
                </Item.Content>
            </Item>
        </Item.Group>
    )
}


export default withTranslation()(AddressForm);