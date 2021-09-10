import Axios from "axios";
import {API_URL} from "../../config";

const uploadPic = (entityName, entity, blob) => {
    let bodyFormData = new FormData();
    bodyFormData.append('pictureFile', blob)
    if(entityName !== "user"){
        bodyFormData.append('id', entity.id)
    }
    return Axios({
        method: 'post',
        url: API_URL + "/" + entityName + "/picture",
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
}

const putFile = ( activity, currentFile ) => {
    let bodyFormData = new FormData();
    bodyFormData.append('file', currentFile)
    bodyFormData.append('id', activity.id)
    return Axios({
        method: 'post',
        url: API_URL + "/activity/file",
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
}

const download = (isPublic, id, access) => {
    let url = "/activity/download"
    if(isPublic){
        url += "/public"
    }
   // url += "?id=" +id+ "&access=" +access
    url += "?id=" +id+ "&access=" +access
    return Axios.get(API_URL +url,
        {responseType: 'arraybuffer'}
    )
}

/*const download = (isPublic, id, access) => {
    let url = "/file/download"
    if(isPublic){
        url += "/public"
    }
    url += "?id=" +id
console.log(url)
    return Axios.get(API_URL + url, {responseType: 'arraybuffer'})
}*/

const remove = (id) => {
    return Axios.delete(API_URL + "/file?id=" +id)
}

const getAllowedMime = () =>{
    return Axios.get(API_URL + "/file/allowed")
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    uploadPic,
    putFile,
    download,
    remove,
    getAllowedMime
}