
import React, { useState } from 'react';
import { Button, Container, Icon, Segment} from "semantic-ui-react";
import fileAPI from "../../../../../../__services/_API/fileAPI";
import {useTranslation, withTranslation} from "react-i18next";
import FileInfos from "./FileInfos";

/**
 *
 * @param activity
 * @param access
 * @returns {JSX.Element}
 * @constructor
 * @author Thierry Fauconnier <th.fauconnier@outlook.fr>
 */
const FileDownload = ({ activity, access } ) => {


    const { t } = useTranslation()

    const [loader, setLoader]= useState(false)

    const downloadFile = () => {
        setLoader(true)
        fileAPI.download(activity.isPublic, activity.id, access)
            .then(response => {
                let blob = new Blob([response.data], { type: activity.fileType });
                let link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.download = activity.filename
                link.click()
            }).catch(error => {
            console.log(error)
        })
            .finally(() => setLoader(false))
       /* fileAPI.download(activity.isPublic, activity.id)
            .then(response => {
                let blob = new Blob([response.data], { type: activity.fileType });
                let link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.download = activity.filename
                link.click()
            }).catch(error => {
                console.log(error)
            })
            .finally(() => setLoader(false))*/
    }
    return (
        <Segment className="heightLess w-70 margAuto" placeholder loading={loader}>
                <>
                    <FileInfos file={ activity } isValid={true} />
                    <Container textAlign='center'>
                        <Button fluid animated onClick={downloadFile} disabled={!activity.fileType}>
                            <Button.Content visible>
                                { t('download') }
                            </Button.Content>
                            <Button.Content hidden>
                                <Icon name='download'/>
                            </Button.Content>
                        </Button>
                    </Container>
                </>
        </Segment>
        )

}

export default withTranslation()(FileDownload);