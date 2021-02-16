import Axios from "axios";
import { ORG_API } from "../config";


function post(org) {
    return Axios.post(ORG_API, org)
}

function put(org) {
    return Axios.put(ORG_API, org)
}

function get(id = null){
    if(id === null){
        return Axios.get(ORG_API + "/public")
    }else {
        return Axios.get(ORG_API + "/public?id=" + id)
    }
}

function getMy(id= null){
    if(id === null){
        return Axios.get(ORG_API)
    }else {
        return Axios.get(ORG_API + "?id=" + id)
    }
}

const uploadPic = (bodyFormData) => {
    return Axios({
        method: 'post',
        url: ORG_API + "/picture",
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
}

const downloadPic = (picture) => {
    return Axios.get(ORG_API + "/picture/?pic=" + picture)
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
