import Axios from "axios";
import {API_URL, ORG_API} from "../config";


function post(org) {
    return Axios.post(ORG_API, org)
}

function put(org) {
    return Axios.put(ORG_API, org)
}

function get(id = null){
    if(id === null){
        return Axios.get(API_URL + "/org/public")
    }else {
        return Axios.get(API_URL + "/org/public/?id=" + id)
    }
  //  return Axios.get(API_URL + "/org/public" id)
}

function getMy(id= null){
    if(id === null){
        return Axios.get(API_URL + "/org")
    }else {
        return Axios.get(API_URL + "/org?id=" + id)
    }
}

const uploadPic = (bodyFormData) => {
    console.log(bodyFormData)
    //return Axios.post(API_URL + "/user/picture", {picture:pic} );
    return Axios({
        method: 'post',
        url: API_URL + "/user/picture",
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
}

const downloadPic = (picture) => {
    return Axios.get(API_URL + "/user/picture/?pic=" + picture)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    post,
    put,
    get,
    getMy,
    uploadPic,
    downloadPic
};
