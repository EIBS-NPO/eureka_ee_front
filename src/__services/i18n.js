import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from '../_locales/en-GB/en-GB.json';
import fr from '../_locales/fr-FR/fr-FR.json';
import nl from '../_locales/nl-BE/nl-BE.json';

i18n
    .use(detector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources: {
            "en-GB": { // translation is the default namespace
                translation: en,
            },
            "fr-FR": {
                translation: fr,
            },
            "nl-BE": {
                translation: nl,
            }
        },
        fallbackLng: 'en-GB',

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    })

export default i18n;