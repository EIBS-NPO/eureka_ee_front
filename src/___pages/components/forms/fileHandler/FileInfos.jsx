
import React from 'react'
import {Header, Icon, Item} from "semantic-ui-react";
import utilities from "../../../../__services/utilities";
import {useTranslation, withTranslation} from "react-i18next";

/**
 *
 * @param file
 * @param isValid if the file is allowed
 * @returns {JSX.Element}
 * @constructor
 * @author Thierry Fauconnier <th.fauconnier@outlook.fr>
 */
const FileInfos = ( { activity } ) => {

    const { t } = useTranslation()

    const isFromDB = activity && activity.filename && activity.file === undefined

    const fileSize =
        (activity && activity.file && activity.file.size) ? activity.file.size
        : activity && activity.size ? activity.size : undefined

    const filename =
        activity && activity.file && activity.file.name ?
            activity.file.name
            : activity && activity.filename ? activity.filename : undefined

    const isValid = isFromDB ? true : activity && activity.isValid

    return (
        <Item>

            {!fileSize &&
                <Header icon>
                    <Icon name='pdf file outline'/>
                    {t('no_file')}
                </Header>
            }

            {fileSize && isValid !== undefined &&
                <Header icon color = { isFromDB ? "blue" : isValid ? "teal" : "red" }>
                    <Icon name='file pdf' />
                    <p>{ filename }</p>
                    <p>{utilities.octetsToKilos(fileSize) + "kB"}</p>
                </Header>
            }
        </Item>
    )
}

export default withTranslation()(FileInfos)
