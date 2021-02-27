
import React, { useState, useEffect } from 'react';
import {Input, Item, Button, Container, Icon, Loader, Segment} from "semantic-ui-react";
import fileAPI from "../../_services/fileAPI";
import {useTranslation, withTranslation} from "react-i18next";
import FileInfos from "./FileInfos";
import {Buffer} from "buffer";

const FileDownload = ({ file, setter } ) => {

//    console.log(file)

    const { t } = useTranslation()

    const [loader, setLoader]= useState(false)

  /*  useEffect (() => {
        let url = "/file/download"
        if(file.isPublic){
            url += "/public"
        }
        return url += "?id=" +file.id
    }, [file])*/

    /*function getUrl () {
        let url = "/file/download"
        if(file.isPublic){
            url += "/public"
        }
        return url += "?id=" +file.id
    }*/

    const [dlUrl, setDlUrl] =useState()

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
                        <Button fluid animated onClick={downloadFile}>
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


/*

 <div id="container">
                        <h1>Download File using React App</h1>
                        <h3>Download Employee Data using Button</h3>
                        <button onClick={downloadEmployeeData}>Download</button>
                        <p/>
                        <h3>Download Employee Data using Link</h3>
                        <a href="#" onClick={downloadEmployeeData}>Download</a>
                    </div>


<Segment.Group horizontal>
    <Segment>
        <Card obj={activity} type="activity" profile={true} ctx={ctx()}/>
    </Segment>
    <Segment placeholder >
        <Container textAlign='center'>
            {!activity.fileType &&
            <Header icon>
                <Icon name='pdf file outline' />
                { props.t('no_file') }
            </Header>
            }
            {activity.fileType &&
            <>
                <Header icon>
                    <Icon name='file pdf' />
                    <p>{activity.filePath}</p>
                    <p>{utilities.octetsToKilos(activity.size) + "kB"}</p>
                </Header>
                {activity.isPublic ?
                    //     <a href={fileAPI.urlDownloadPublic(activity.id)} download />
                    <Input as={"a"} type="download" href={fileAPI.urlDownloadPublic(activity.id)} />
                    :
                    <Input as={"a"} type="download" href={fileAPI.urlDownload(activity.id)} />
                    /!*<a href={fileAPI.urlDownload(activity.id)} download />*!/
                }

                {/!*

                                                        <input type="file" onChange="Upload(this)"></input>
<script>
  function Upload(element) {
    var reader = new FileReader();
    let file = element.files[0];
    reader.onload = function () {
      var arrayBuffer = this.result;
      Download(arrayBuffer, file.type);
    }
    reader.readAsArrayBuffer(file);
  }

  function Download(arrayBuffer, type) {
    var blob = new Blob([arrayBuffer], { type: type });
    var url = URL.createObjectURL(blob);
    window.open(url);
  }

</script>

                                                        *!/}
                <Button fluid animated onClick={downloadFile}>
                    <Button.Content visible>
                        { props.t('download') }
                    </Button.Content>
                    <Button.Content hidden>
                        <Icon name='download'/>
                    </Button.Content>
                </Button>
            </>
            }
        </Container>
    </Segment>

</Segment.Group>*/
