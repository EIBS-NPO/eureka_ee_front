
import React from 'react'
import { Header, Icon} from "semantic-ui-react";
import utilities from "../../_services/utilities";
import {useTranslation, withTranslation} from "react-i18next";

/**
 *
 * @param file
 * @param isValid if the file is allowed
 * @returns {JSX.Element}
 * @constructor
 * @author Thierry Fauconnier <th.fauconnier@outlook.fr>
 */
const FileInfos = ( { file, isValid } ) => {

    const { t } = useTranslation()
console.log(isValid)
    return (
        <>
            {file === undefined || (file && file.size === undefined) &&
                <Header icon>
                    <Icon name='pdf file outline'/>
                    {t('no_file')}
                </Header>
            }

            {file && file.size &&
                    <Header icon color={isValid?"teal":"red"}>
                        {!isValid && <p> {t('Unsupported Media Type')} </p>}
                        <Icon name='file pdf' />
                        <p>{file.name?file.name:file.filename}</p>
                        <p>{utilities.octetsToKilos(file.size) + "kB"}</p>
                    </Header>
            }
        </>
    )
}

export default withTranslation()(FileInfos)
