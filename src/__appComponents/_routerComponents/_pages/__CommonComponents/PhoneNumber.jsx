
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
                setError(t('invalid_country_phoneNumber'))
            }

        }else{setObject({...object,[phoneType]: null})}
    },[phoneNumber])

    const europeanCountry = [
        "BE", "FR", "DE", "NL", "IT", "AT", "LV", "LT", "BG", "LU", "CY", "MT", "HR", "DK", "PL", "ES", "PT", "EE", "RO", "FI", "SK", "SI", "GR", "SE", "HU", "CZ", "IE",
        "|"
    ]

    return (
        <>
            {phoneType === "phone" &&
                <PhoneInput
                    defaultCountry={lg}
                    initialValueFormat="national"
                    countryOptionsOrder={europeanCountry}
                    limitMaxLength
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    error={!!error}
                />
            }
            { phoneType === "mobile" &&
                <MobileInput
                    defaultCountry={lg}
                    initialValueFormat="national"
                    countryOptionsOrder={["FR","NL","GB","|"]}
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    error={!!error}
                />
            }
            {error && <p className="error">{error}</p>}

        </>

        )
}

export const PhoneDisplay = ({phoneNumber}) =>{
    const {t} = useTranslation()

    function getCountryFromNumber (phoneNumber) {
        const pPN = parsePhoneNumber(phoneNumber)
        if (pPN) {
            return pPN.country;
        }
    }

    const getFlag = () => {
        let country = getCountryFromNumber(phoneNumber)
        if(country !== undefined){
            if(hasFlag(country)){
                let Flg = Flags[country]
                return  <Flg title={country+"_flag"} width={"21px"} className="simpleBorder"/>;
            }else return ""
        }else return ""
    }

    return (
        phoneNumber  ?
            <p>
                {getFlag()}
                {"  (+"+getCountryCallingCode(getCountryFromNumber(phoneNumber))+")  "}
                {formatPhoneNumber(phoneNumber)   }
            </p>
        :
            <p>{t('not_specified')}</p>

    )
}

export default withTranslation()(
    PhoneFormInput,
    PhoneDisplay
)