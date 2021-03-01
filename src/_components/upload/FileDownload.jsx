
import React, { useState } from 'react';
import { Button, Container, Icon, Segment} from "semantic-ui-react";
import fileAPI from "../../_services/fileAPI";
import {useTranslation, withTranslation} from "react-i18next";
import FileInfos from "./FileInfos";

const FileDownload = ({ file } ) => {


    const { t } = useTranslation()

    const [loader, setLoader]= useState(false)

    const downloadFile = () => {
        setLoader(true)
        fileAPI.download(file.isPublic, file.id)
            .then(response => {
                let blob = new Blob([response.data], { type: file.fileType });
                let link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.download = file.filename
                link.click()
            }).catch(error => {
                console.log(error)
            })
            .finally(() => setLoader(false))
    }
    return (
        <Segment placeholder loading={loader}>
                <>
                    <FileInfos file={ file } />
                    <Container textAlign='center'>
                        <Button fluid animated onClick={downloadFile} disabled={!file.fileType}>
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