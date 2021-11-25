
import React, {useEffect, useState} from "react";
import {Button, Form, Icon, Item, Label } from "semantic-ui-react";
import {useTranslation} from "react-i18next";
import {TextFormField} from "./forms/formsServices";
import {HandleUserUpdate} from "../../__services/_Entity/userServices";
import {HandleUpdateOrg} from "../../__services/_Entity/organizationServices";
import {asAddressChange, checkAddressFormValidity} from "../../__services/_Entity/addressServices";

export const AllAddressFormField = ({ address, setAddress, errors }) => {
    const {t}=useTranslation()
    return (
        <>
            <TextFormField t={t}
                           fieldName="address"
                           iconName="home"
                           fieldValue={ address && address.address ? address.address : "" }
                           setFieldValue={(value) =>setAddress({...address, "address": value }) }
                           min={2} max={255}
                           errors={errors}
            />
            <TextFormField t={t}
                           fieldName="complement"
                           iconName="home"
                           fieldValue={ address && address.complement ? address.complement : "" }
                           setFieldValue={(value) =>setAddress({...address, "complement": value }) }
                           min={2} max={255}
                           errors={errors}
                           isRequired={false}
            />
            <TextFormField t={t}
                           fieldName="city"
                           iconName="home"
                           fieldValue={ address && address.city ? address.city : "" }
                           setFieldValue={(value) =>setAddress({...address, "city": value }) }
                           min={2} max={30}
                           errors={errors}
            />
            <TextFormField t={t}
                           fieldName="zipCode"
                           iconName="home"
                           fieldValue={ address && address.zipCode ? address.zipCode : "" }
                           setFieldValue={(value) =>setAddress({...address, "zipCode": value }) }
                           min={2} max={10}
                           errors={errors}
            />
            <TextFormField t={t}
                           fieldName="country"
                           iconName="home"
                           fieldValue={ address && address.country ? address.country : "" }
                           setFieldValue={(value) =>setAddress({...address, "country": value }) }
                           min={2} max={10}
                           errors={errors}
            />
        </>
    )
}

export const AddressForm = ({t, history, object, addressFor, postTreatment, cancel = undefined, isRequired=false, forAdmin=false}) => {

    const [addressUpdated, setAddressUpdated] = useState({
        address: object.address && object.address.address ? object.address.address : undefined,
        complement: object.address && object.address.complement ? object.address.complement : undefined,
        city: object.address && object.address.city ? object.address.city : undefined,
        zipCode: object.address && object.address.zipCode ? object.address.zipCode : undefined,
        country: object.address && object.address.country ? object.address.country : undefined
    })

    const [loader, setLoader] = useState(false)
    const [errors, setErrors] = useState("")

    //todo handleCancel
    //todo test
    const handleCancel = (e) => {
        e.preventDefault()
     //   setAddressUpdated( object.address ? object.address : undefined )
        if(cancel){
            cancel()
        }
    }

    const [canSave, setCanSave] = useState(false)
    useEffect(() => {
        async function checkChange () {
            setCanSave(asAddressChange(object.address, addressUpdated))
        }
        checkChange()
    },[addressUpdated])


    const preSubmit = async () => {

        if (checkAddressFormValidity(addressUpdated, setErrors)) {

            let addressWithChanges = asAddressChange(object.address, addressUpdated, true)

            switch (addressFor) {
                case "user":
                    await HandleUserUpdate({
                        id: object.id,
                        address: addressWithChanges
                    }, postTreatment, setLoader, setErrors, history, forAdmin)
                    break;
                case "org":
                    await HandleUpdateOrg({
                        id: object.id,
                        address: addressWithChanges
                    }, postTreatment, setLoader, setErrors, history, forAdmin)
                    break;
            }
        }
    }

   /* const handleDelete = (e) => {
        e.preventDefault()
        setAddress(undefined)
        /!*setter({ ...entity, "picture": null })
        setter({ ...entity, "pictureFile": null})*!/
    }*/

    return (
        <Form onSubmit={preSubmit} loading={loader}>
            <AllAddressFormField address={addressUpdated} setAddress={setAddressUpdated} errors={errors} />

            <Button.Group>
                <Button size="small" onClick={handleCancel}> { t("cancel") } </Button>
                <Button.Or />
                <Button size="small" positive disabled={!canSave}> { t("save") } </Button>
            </Button.Group>
        </Form>
        )
}

export const AddressDisplay = ({ object, editable=false, setSwitch=undefined }) => {
    const {t} = useTranslation()
    return (
        <Item className="breakWord">
            <Item.Content>
                { object.address &&
                <Item.Description>
                    <p>{ object.address.address ? object.address.address : t('address') + " " + t('not_specified') }</p>
                    {object.address.complement && <p>{ object.address.complement }</p> }
                    <p>
                        <span> { object.address.zipCode } </span>
                        <span> { object.address.city } </span>
                        <span> { object.address.country } </span>
                    </p>
                </Item.Description>
                }
                {!object.address &&
                <Item.Description> { t('address') + " " + t('not_specified') }</Item.Description>
                }

            </Item.Content>

            {editable &&
            <Item>
                <Item.Content>
                    <Button as='div' labelPosition='right' onClick={setSwitch}>
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
        </Item>
    )
}

//todo replace ProfileAddress here