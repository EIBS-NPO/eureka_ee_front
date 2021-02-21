import Axios from "axios";
import {API_URL} from "../config";

const uploadPic = (entityName, bodyFormData) => {
    return Axios({
        method: 'post',
        url: API_URL + "/" + entityName + "/picture",
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
}

/*
//todo maybe change route to match with backEnd
 */
const uploadFile = ( bodyFormData ) => {
    return Axios({
        method: 'post',
        url: API_URL + "/file",
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
}

function urlDownloadPublic ( id ) {
    return "API_URL + /file/download/public?id=" +id
}

function urlDownload (id) {
    return Axios.get(API_URL + "/file/download?id=" +id)
   // return "API_URL + /file/download?id=" +id
}

/*const downloadPublicFile = (id){
    return Axios.get(API_URL + "/file/download/public?id=" + id)
}*/
/*const downloadPic = (entity, picture) => {
    return Axios.get(API_URL + "/" + entity + "/picture/?pic=" + picture)
}*/

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    uploadPic,
    uploadFile,
    urlDownloadPublic,
    urlDownload
  //  downloadPic
}