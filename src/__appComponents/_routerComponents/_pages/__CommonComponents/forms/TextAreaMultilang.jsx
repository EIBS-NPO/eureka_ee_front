
import React, { useState, useEffect } from 'react'
import {Message, Icon, Container, Label, Form, Item, Flag} from 'semantic-ui-react'
import {useTranslation, withTranslation} from 'react-i18next'

//todo ou en-GB parmas ou en-GB context, mais il faut l=que le champs text modifie bine l'attribut de l'objet géré par le form
/**
 *
 * @param tabText
 * @param setter
 * @param name
 * @param min
 * @param max
 * @returns {JSX.Element}
 * @constructor
 */
const TextAreaMultilang = ({ tabText, setter, name, min, max }) => {
    const {t,  i18n } = useTranslation()
    const [lg, setLg ] = useState(i18n.language.split('-')[0])

    const handleText = ( event ) => {
        const { value } = event.currentTarget;
        setter({...tabText, [lg]: value})
    }

    const getText = (l) => {
        if(tabText[l]){
            return  tabText[l]
        }
        else return ""
    }

    const LangOptions = [
        {key: 'en', value: 'en', flag: 'gb', text: ''},
        {key: 'fr', value: 'fr', flag: 'fr', text: ''},
        {key: 'nl', value: 'nl', flag: 'nl', text: ''},
    ]

    const handleLanguage = ( e, value  ) => {
        e.preventDefault()
        setLg(value)
    }

    const MenuFlag = () => {

        return (
            LangOptions.map((opt,key ) => (
                <Label key={key}
                       as='a' basic image
                       onClick={(event) => handleLanguage(event,opt.value)}
                       color={lg === opt.key ? "blue" : undefined}
                >
                   <Label.Group>
                       <Flag name={opt.flag} />
                     <Icon name="check" color={getText(opt.key) !== "" ? "green" : undefined} />
                   </Label.Group>
                </Label>
                )
            )
        )
    }

    useEffect(()=>{
        if(tabText.length === 0 ){
            let initLang = []
            LangOptions.map((lang, index) => {
                initLang[lang.key] = ""
            })
            setter(initLang)
        }
    },[])

    return (
        <>
            <Item>
                <Form.Input
                    control={"textarea"}
                    name={name}
                    minLength={min}
                    maxLength={max}
                    value={getText(lg)}
                    onChange={handleText}
                    placeholder={ t('your_translation_here')}
                    required
                />
                <Container textAlign="left">
                    <MenuFlag />
                </Container>

                {!tabText['en'] &&
                    <Message
                        info compact color="teal" size="mini"
                         icon='idea'
                         header={ t('default_language') }
                         content={ t('remember_english') }
                    />
                }

            </Item>
        </>
    )
}


export default withTranslation()(TextAreaMultilang)