import Axios from "axios";
import {API_URL} from "../../config";

const uploadPic = (entityName, bodyFormData) => {
    return Axios({
        method: 'post',
        url: API_URL + "/" + entityName + "/picture",
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
}

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

const download = (isPublic, id) => {
    let url = "/file/download"
    if(isPublic){
        url += "/public"
    }
    url += "?id=" +id
console.log(url)
    return Axios.get(API_URL + url, {responseType: 'arraybuffer'})
}

const remove = (id) => {
    return Axios.delete(API_URL + "/file?id=" +id)
}

const getAllowedMime = () =>{
    return Axios.get(API_URL + "/file/allowed")
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    uploadPic,
    postFile,
    putFile,
    download,
    remove,
    getAllowedMime
}