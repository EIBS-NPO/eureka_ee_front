
import React, {useState, useEffect} from 'react';
import PhoneInput, {
    formatPhoneNumber,
    isValidPhoneNumber,
    isPossiblePhoneNumber,
    parsePhoneNumber, getCountryCallingCode
} from 'react-phone-number-input';
import MobileInput from "react-phone-number-input/mobile";

import {useTranslation, withTranslation} from "react-i18next";

import Flags from 'country-flag-icons/react/3x2'
import {hasFlag} from "country-flag-icons";
import {Button, Form, Icon, Message, Segment} from "semantic-ui-react";

export const PhoneFormInput = ({object, setObject, phoneType}) => {
    const {t, i18n}= useTranslation()
    const lg = i18n.language.split("-")[1];

    const [error, setError] = useState(undefined)
    const [phoneNumber, setPhoneNumber] = useState(
        object[phoneType] !== undefined ? object[phoneType] : ""
    )

    useEffect(()=>{
        if(phoneNumber){
            if(isValidPhoneNumber(phoneNumber) && isPossiblePhoneNumber(phoneNumber)){
                    setError(undefined)
                    setObject({ ...object, [phoneType]: phoneNumber });
            }else{
                setError(t('invalid'))
            }

        }else if(phoneNumber === null){
            setObject({...object,[phoneType]: null})
        }
        else{setObject({...object,[phoneType]: undefined})}
    },[phoneNumber])

    const europeanCountry = [
        "BE", "FR", "DE", "NL", "IT", "AT", "LV", "LT", "BG", "LU", "CY", "MT", "HR", "DK", "PL", "ES", "PT", "EE", "RO", "FI", "SK", "SI", "GR", "SE", "HU", "CZ", "IE",
        "|"
    ]

    const handleRemove = (e) => {
        e.preventDefault()
        setObject({...object,[phoneType]: null})
        setPhoneNumber(null)
    }

    return (
        <>
            {phoneType === "phone" &&
                <Segment className="row space-around unpadded" basic>
                    <PhoneInput
                        defaultCountry={lg}
                        initialValueFormat="national"
                        countryOptionsOrder={europeanCountry}
                        limitMaxLength
                        value={ phoneNumber }
                        onChange={ setPhoneNumber }
                        error={error ? error : ""}
                    />
                    {phoneNumber && <Icon name='eraser' link onClick={(e) => handleRemove(e)} />}
                    {phoneNumber && error && <Icon name="x" color="red" /> }
                    {phoneNumber && !error && <Icon name="check circle outline" color="green" /> }
                </Segment>

            }
            { phoneType === "mobile" &&
                <Segment className="row space-around unpadded" basic>
                    <MobileInput
                        defaultCountry={lg}
                        initialValueFormat="national"
                        countryOptionsOrder={europeanCountry}
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        error={error ? error : ""}
                    />
                    {phoneNumber && <Icon name='eraser' link onClick={(e) => handleRemove(e)} />}
                    {phoneNumber && error && <Icon name="x" color="red" /> }
                    {phoneNumber && !error && <Icon name="check circle outline" color="green" /> }
                </Segment>
            }
        </>

        )
}

export const PhoneDisplay = ({phoneNumber}) =>{
    const {t} = useTranslation()

    const [flag, setFlag] = useState(undefined)

    useEffect(()=> {
        getFlag()

        //dismiss unmounted warning
        return () => {
            setFlag({});
        };

    },[])
    function getCountryFromNumber (phoneNumber) {
        const pPN = parsePhoneNumber(phoneNumber)
        if (pPN !== undefined) {
            return pPN.country;
        }else return undefined
    }

    const getFlag = () => {
        let country = getCountryFromNumber(phoneNumber)
        if(country !== undefined){
            if(hasFlag(country)){
                let Flg = Flags[country]
                setFlag(<Flg title={country+"_flag"} width={"21px"} className="simpleBorder"/>)
               // return  ;
            }//else return ""
        }//else return ""
    }

    return (
        phoneNumber  ?
            flag !== undefined ?
                <p className="item">
                    {flag}
                    {"  (+"+getCountryCallingCode(getCountryFromNumber(phoneNumber))+")  "}
                    {formatPhoneNumber(phoneNumber)   }
                </p>
            :
                <p>
                    { phoneNumber }
                </p>
        :
            <p>{t('not_specified')}</p>

    )
}

export default withTranslation()(
    PhoneFormInput,
    PhoneDisplay
)