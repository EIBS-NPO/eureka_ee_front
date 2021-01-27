import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them)

import en from './_locales/en/translation.json';
import fr from './_locales/fr/translation.json';
import nl from './_locales/nl/translation.json';

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources: {
            en: { // translation is the default namespace
                translation: en,
            },
            fr: {
                translation: fr,
            },
            nl: {
                translation: nl,
            }
        },
        fallbackLng: 'en'
    })
/*const resources = {
    en: {
        translation: {
            "Welcome to React": "Welcome"
        }
    },
    fr: {
        translation: {
            "Welcome to React": "Bienvenue"
        }
    }
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: "en",

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });*/

export default i18n;