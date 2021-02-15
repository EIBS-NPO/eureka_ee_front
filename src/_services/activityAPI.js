import Axios from "axios";
import {API_URL, ACT_API} from "../config";


function post(activity) {
    return Axios.post(ACT_API, activity)
}

function put(activity) {
    return Axios.put(ACT_API, activity)
}

function get(context, id = null){
    let params = "?context="+ context
    if(id !== null){
        params += "&id="+ id
    }
    return Axios.get(API_URL + "/activity/" + params)
}

function getPublic(id =null){
    if(id === null ){
        return Axios.get(API_URL + "/activity/public")
    }else {
        return Axios.get(API_URL + "/activity/public/?id="+ id)
    }

}

const uploadPic = (bodyFormData) => {
    return Axios({
        method: 'post',
        url: API_URL + "/activity/picture",
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
}

const downloadPic = (picture) => {
    return Axios.get(API_URL + "/activity/picture/?pic=" + picture)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    post,
    put,
    get,
    getPublic,
    uploadPic,
    downloadPic
};
