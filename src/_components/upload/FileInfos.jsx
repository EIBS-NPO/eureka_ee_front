
import React from 'react'
import { Header, Icon} from "semantic-ui-react";
import utilities from "../../_services/utilities";
import {useTranslation, withTranslation} from "react-i18next";


const FileInfos = ( { file } ) => {

    const { t } = useTranslation()

 //   console.log(file)

    return (
        <>
            {!file.fileType &&
                <Header icon>
                    <Icon name='pdf file outline' />
                    { t('no_file') }
                </Header>
            }

            {file.fileType &&
                <Header icon>
                    <Icon name='file pdf' />
                    <p>{file.filename}</p>
                    <p>{utilities.octetsToKilos(file.size) + "kB"}</p>
                </Header>
            }
        </>
    )
}

export default withTranslation()(FileInfos)
