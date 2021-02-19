import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

const LanguageSelector = () => {
    const { t, i18n } = useTranslation()
   /* console.log(i18n.languageCode)
    console.log(t.language)*/
//    console.log(i18n.options)
 //   const [lg, setLg ] = useState();

    const countryOptions = [
        {key: 'en', value: 'en', flag: 'gb', text: ''},
        {key: 'fr', value: 'fr', flag: 'fr', text: ''},
        {key: 'nl', value: 'nl', flag: 'nl', text: ''},
    ]

    const handleChange = (e, { value }) => {
        i18n.changeLanguage( value )
   //     setLg(value)
    }

    return (
            <Dropdown
                placeholder='Select Country'
                fluid
                search
                selection
                options={countryOptions}
                value={i18n.language}
                onChange={handleChange}
            />
    )
}

export default LanguageSelector
