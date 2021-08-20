
import React, { useState } from 'react';
import { Button, Container, Icon, Segment} from "semantic-ui-react";
import fileAPI from "../../_services/fileAPI";
import {useTranslation, withTranslation} from "react-i18next";
import FileInfos from "./FileInfos";

const FileDownload = ({ activity } ) => {


    const { t } = useTranslation()

    const [loader, setLoader]= useState(false)
console.log(activity)
    const downloadFile = () => {
        setLoader(true)
        fileAPI.download(activity.isPublic, activity.id)
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
    }
    return (
        <Segment className="heightLess w-70 margAuto" placeholder loading={loader}>
                <>
                    <FileInfos file={ activity } />
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