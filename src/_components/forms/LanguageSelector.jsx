import React, { useState }from 'react'
import { Dropdown } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

const LanguageSelector = () => {
    const {t, i18n} = useTranslation()
    const [lg, setLg ] = useState();

    const countryOptions = [
        {key: 'en', value: 'en', flag: 'gb', text: ''},
        {key: 'fr', value: 'fr', flag: 'fr', text: ''},
        {key: 'nl', value: 'nl', flag: 'nl', text: ''},
    ]

    const handleChange = (e, { value }) => {
        i18n.changeLanguage( value )
        setLg(value)
    }

    return (
            <Dropdown
                placeholder='Select Country'
                fluid
                search
                selection
                options={countryOptions}
                value={lg ? lg : "en"}
                onChange={handleChange}
            />
    )
}

export default LanguageSelector
