
import React from "react"
import {useTranslation} from "react-i18next";

const LanguageSwitcher = (text) => {
    const {t,  i18n } = useTranslation()
    const lg = i18n.language.split('-')[0]

    if(text){
        if(text[lg]) {
            return text[lg]
        }else if(text['en']) {
            return text['en']
        }
    }else {
        return( <p>t('no_translation')</p> )
    }
}

export default LanguageSwitcher