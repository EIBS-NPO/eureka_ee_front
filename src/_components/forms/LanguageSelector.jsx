import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

const LanguageSelector = () => {
    const { i18n } = useTranslation()

    const countryOptions = [
        {key: 'en-GB', value: 'en-GB', flag: 'gb', text: ''},
        {key: 'fr-FR', value: 'fr-FR', flag: 'fr', text: ''},
        {key: 'nl-BE', value: 'nl-BE', flag: 'nl', text: ''},
    ]

    //don't touche (e, {value}) event is important for Dropdown (onClick event)
    const handleChange = (e, {value}) => {
        i18n.changeLanguage( value )
    }

    return (
            <Dropdown
                placeholder='Country'
                closeOnBlur
                value={i18n.language}
                options={countryOptions}
                onChange={handleChange}
            />
    )
}

export default LanguageSelector
