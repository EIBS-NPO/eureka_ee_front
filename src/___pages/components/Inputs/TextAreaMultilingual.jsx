
import React, { useState, useEffect } from 'react'
import {Message, Icon, Container, Label, Form, Item, Flag, Segment} from 'semantic-ui-react'
import {useTranslation, withTranslation} from 'react-i18next'
import {getTranslateFromTextTable} from "../../../__services/utilities";

/**
 *
 * @param tabText
 * @param setTabText
 * @param name
 * @param min
 * @param max
 * @returns {JSX.Element}
 * @constructor
 */
const TextAreaMultilingual = ({ tabText, setTabText, name, min, max }) => {

    const {t,  i18n } = useTranslation()
    const [lg, setLg ] = useState(i18n.language)

    const handleText = async (event) => {
        const {value} = event.currentTarget;
        await setTabText({...tabText, [lg]: value})
    }

    const getText = (l) => {
        if(tabText[l]){
            return  tabText[l]
        }
        else return ""
    }

    const LangOptions = [
        {key: 'en-GB', value: 'en-GB', flag: 'gb', text: ''},
        {key: 'fr-FR', value: 'fr-FR', flag: 'fr', text: ''},
        {key: 'nl-BE', value: 'nl-BE', flag: 'nl', text: ''}
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
            LangOptions.map((lang) => {
                initLang[lang.key] = ""
            })
            setTabText(initLang)
        }
    },[])

    return (
        <Segment basic>
            <Item>
                <Form.Input
                    control={"textarea"}
                    name={name}
                    minLength={min}
                    maxLength={max}
                    value={getText(lg)}
                    onChange={handleText}
                    placeholder={ t('your_translation_here') }
                />
                <Container textAlign="left">
                    <MenuFlag />
                </Container>

                {!tabText['en-GB'] &&
                    <Message
                        info compact color="teal" size="mini"
                         icon='idea'
                         header={ t('default_language') }
                         content={ t('remember_english') }
                    />
                }

            </Item>
        </Segment>
    )
}

export const MultilingualTextDisplay = ({object, typeText}) => {

    const {t,  i18n } = useTranslation()
    const [lg, setLg ] = useState(i18n.language)
    const LangOptions = [
        {key: 'en-GB', value: 'en-GB', flag: 'gb', text: ''},
        {key: 'fr-FR', value: 'fr-FR', flag: 'fr', text: ''},
        {key: 'nl-BE', value: 'nl-BE', flag: 'nl', text: ''}
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
                            <Icon name="check" color={object[typeText][opt.key] !== "" ? "green" : undefined} />
                        </Label.Group>
                    </Label>
                )
            )
        )
    }

    return(
        <Item>
            <Item.Content>
                <p>{getTranslateFromTextTable(object, typeText, t, lg)}</p>
                <MenuFlag />
            </Item.Content>
        </Item>
    )
}


export default withTranslation()(
    TextAreaMultilingual,
    MultilingualTextDisplay
)