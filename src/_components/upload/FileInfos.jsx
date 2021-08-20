
import React from 'react'
import { Header, Icon} from "semantic-ui-react";
import utilities from "../../_services/utilities";
import {useTranslation, withTranslation} from "react-i18next";


const FileInfos = ( { file} ) => {

    const { t } = useTranslation()

    return (
        <>
            {file === undefined || (file && file.size === undefined) &&
                <Header icon>
                    <Icon name='pdf file outline'/>
                    {t('no_file')}
                </Header>
            }

            {file && file.size &&
                    <Header icon>
                        <Icon name='file pdf' />
                        <p>{file.name?file.name:file.filename}</p>
                        <p>{utilities.octetsToKilos(file.size) + "kB"}</p>
                    </Header>
            }
        </>
    )
}

export default withTranslation()(FileInfos)
