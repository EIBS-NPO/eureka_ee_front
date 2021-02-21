
import React, { useState } from 'react'
import {Form, Dropdown, Item, Menu} from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

//todo ou en parmas ou en context, mais il faut l=que le champs text modifie bine l'attribut de l'objet géré par le form
const TextAreaMultilang = ({ tabText, setter }) => {
    const {t,  i18n } = useTranslation()
    const [lg, setLg ] = useState(i18n.language)

    const handleText = ( event ) => {
        const { value } = event.currentTarget;
        setter({...tabText, [lg]: value})
    }

    const getText = () => {
        if(tabText[lg]){
            return  tabText[lg]
        }
        else return ""
    }

    const countryOptions = [
        {key: 'en', value: 'en', flag: 'gb', text: ''},
        {key: 'fr', value: 'fr', flag: 'fr', text: ''},
        {key: 'nl', value: 'nl', flag: 'nl', text: ''},
    ]

    const handleLanguage = (e, { value }) => {
        setLg(value)
    }

    /*const controlArea = () => {
        let isOk = true
        tabText.forEach(t => {
            if(t === ""){ isOk += isOk + false}
        })
    }*/

    return (
        <>
            <Item>
                <Menu>
                    <Menu.Item header> { t('choose_language_translation')} </Menu.Item>
                    <Menu.Menu position='right'>
                        <Dropdown
                            inline
                            floating
                            compact
                            search
                            selection
                            options={countryOptions}
                            value={lg}
                            onChange={handleLanguage}
                        />
                    </Menu.Menu>
                </Menu>
                <Form.Input
                    control={"textarea"}
                    name="description"
                    minLength="2"
                    maxLength="250"
                    value={getText()}
                    onChange={handleText}
                    placeholder={ t('your_translation_here')}

                />
            </Item>
        </>
    )
}


export default TextAreaMultilang