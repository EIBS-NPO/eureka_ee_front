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
const postFile = ( bodyFormData ) => {
    return Axios({
        method: 'post',
        url: API_URL + "/file/create",
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
}

const putFile = ( bodyFormData ) => {
    return Axios({
        method: 'post',
        url: API_URL + "/file/update",
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
}

//todo ca marche!!! suffit de config la reponse, on demande comment a v aetre servit!
const download = (isPublic, id) => {
    let url = "/file/download"
    if(isPublic){
        url += "/public"
    }
    url += "?id=" +id
console.log(url)
    return Axios.get(API_URL + url, {responseType: 'arraybuffer'})
}

/*function urlDownloadPublic ( url ) {
    //"/file/download/public?id=" +id
    return Axios.get(API_URL + url)
}

function urlDownload (url) {
    //"/file/download?id=" +id
    return Axios.get(API_URL + url)
   // return "API_URL + /file/download?id=" +id
}*/

/*const downloadPublicFile = (id){
    return Axios.get(API_URL + "/file/download/public?id=" + id)
}*/
/*const downloadPic = (entity, picture) => {
    return Axios.get(API_URL + "/" + entity + "/picture/?pic=" + picture)
}*/

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    uploadPic,
    postFile,
    putFile,
    download
  //  downloadPic
}