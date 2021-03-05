

import React, {useState} from "react";
import {Button, Form, Item} from "semantic-ui-react";
import {useTranslation, withTranslation} from "react-i18next";


const AddressForm2 = ({handleSubmit, obj, setObj, errors, loader, handleCancel}) => {
    const { t } = useTranslation()

    const [address, setAddress] = useState(obj.address)
    const handleChange = (event) => {
        const { name, value } = event.currentTarget;
        setAddress({ ...address, [name]: value });
    };
//console.log(address)
    const preSubmit = () => {
    obj.address = address
    //    setObj({...obj, "address" : address})
        console.log(obj)
        handleSubmit()
    }

    return (
        <Form onSubmit={preSubmit} loading={loader}>
            <Item.Group divided>
                <Item>
                    <Form.Input
                        label={ t('address') }
                        name="address"
                        value={address.address ? address.address : ""}
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
                        value={address.complement ? address.complement : ""}
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
                        value={address.city ? address.city : ""}
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
                        value={address.zipCode ? address.zipCode : ""}
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
                        value={address.country ? address.country : ""}
                        onChange={handleChange}
                        placeholder={t('country') + "..."}
                        type="text"
                        error={ errors.country ? errors.country : null}
                        required
                    />
                </Item>
                <Item>
                    <Button.Group>
                        <Button size="small" onClick={handleCancel}> { t("cancel") } </Button>
                        <Button.Or />
                        <Button size="small" positive > { t("save") } </Button>
                    </Button.Group>
                </Item>
            </Item.Group>
        </Form>
    )
}

export  default withTranslation()(AddressForm2)