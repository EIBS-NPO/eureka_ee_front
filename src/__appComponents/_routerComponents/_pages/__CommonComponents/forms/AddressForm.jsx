
import React, { useState, useEffect } from 'react';
import {Container, Button, Form, Icon, Item, Label} from "semantic-ui-react";
import {useTranslation, withTranslation} from "react-i18next";
import addressAPI from "../../../../../__services/_API/addressAPI";
import userAPI from "../../../../../__services/_API/userAPI";
import utilities from "../../../../../__services/utilities";

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
            return obj.email === userMail
        }
        else{
            return obj.referent.email === userMail
        }
    }
    useEffect(() => {
       setAddress(obj.address)
    },[obj])

    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setAddress({ ...address, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoader(true);
        if(obj.referent){
            address.orgId = obj.id
        }
        //update User
        if(obj.address){
            addressAPI.put(address)
                .then(response => {
                    setter({...obj, address: response.data[0]})
                    setUpdate(false)
            //        console.log(response)
                })
                .catch(error => {
                    setErrors(error.response.data)
                    console.log(error.response)
                })
                .finally(()=> {
                    setLoader(false)
                })
        }
        else {
            addressAPI.post(type, obj.id, address)
                .then(response => {
                    setter({...obj, address: response.data[0]})
                    setUpdate(false)
              //      console.log(response)
                })
                .catch(error => {
                    setErrors(error.response.data)
                })
                .finally(()=> {
                    setLoader(false)
                })
        }
    };

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
                        <Item.Group divided>
                            <Item>
                                <Form.Input
                                    label={ t('address') }
                                    name="address"
                                    value={address && address.address ? address.address : ""}
                                    onChange={handleChange}
                                    placeholder={t('address') + "..."}
                                    type="textarea"
                                    error={ errors.address ? errors.address : null}
                                    required
                                />
                            </Item>
                            <Item>
                                <Form.Input
                                    label={ t('complement') }
                                    name="complement"
                                    value={address && address.complement ? address.complement : ""}
                                    onChange={handleChange}
                                    placeholder={t('complement') + "..."}
                                    type="textarea"
                                    error={ errors.complement ? errors.complement : null}
                                />
                            </Item>
                            <Item>
                                <Form.Input
                                    label={ t('city') }
                                    name="city"
                                    value={address && address.city ? address.city : ""}
                                    onChange={handleChange}
                                    placeholder={t('city') + "..."}
                                    type="text"
                                    error={ errors.city ? errors.city : null }
                                    required
                                />
                            </Item>
                            <Item>
                                <Form.Input
                                    label={ t('zipCode') }
                                    name="zipCode"
                                    value={address && address.zipCode ? address.zipCode : ""}
                                    onChange={handleChange}
                                    placeholder={t('zipCode') + "..."}
                                    type="text"
                                    error={ errors.zipCode ? errors.zipCode : null}
                                    required
                                />
                            </Item>
                            <Item>
                                <Form.Input
                                    label={ t('country') }
                                    name="country"
                                    value={address && address.country ? address.country : ""}
                                    onChange={handleChange}
                                    placeholder={t('country') + "..."}
                                    type="text"
                                    error={ errors.country ? errors.country : null}
                                    required
                                />
                            </Item>
                            <Item>
                                <Button.Group>
                                    <Button size="small" onClick={stopUpdate}> { t("cancel") } </Button>
                                    <Button.Or />
                                    <Button size="small" positive > { t("save") } </Button>
                                </Button.Group>
                            </Item>
                        </Item.Group>
                    </Form>
                    }
                    {!update &&
                        <Item.Group divided >
                            <Container textAlign="center">
                            <Item>
                                <Item.Content verticalAlign='middle'>
                                    <Item.Description>
                                        {address !== undefined ?
                                            <>
                                                <p>{ address.address }</p>
                                                <p>{ address.complement }</p>
                                                <p>{ address.city }</p>
                                                <p>{ address.zipCode }</p>
                                                <p>{ address.country }</p>
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
                                        <Button size="small" onClick={switchUpdate}>
                                            <Icon name='edit'/> Modifier
                                        </Button>
                                    </Item.Content>
                                </Item>
                            }
                            </Container>
                        </Item.Group>
                    }
                </Item.Content>
            </Item>
        </Item.Group>
    )
}


export default withTranslation()(AddressForm);