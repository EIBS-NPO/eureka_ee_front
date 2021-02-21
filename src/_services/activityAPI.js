import Axios from "axios";
import { ACT_API } from "../config";


function post(activity) {
    return Axios.post(ACT_API, activity)
}

function put(activity) {
    return Axios.put(ACT_API, activity)
}

function get(context, id = null){
    let params = "?cxt="+ context
    if(id !== null){
        params += "&id="+ id
    }
    return Axios.get(ACT_API + params)
}

function getPublic(id =null){
    if(id === null ){
        return Axios.get(ACT_API + "/public")
    }else {
        return Axios.get(ACT_API + "/public?id="+ id)
    }

}

const uploadPic = (bodyFormData) => {
    return Axios({
        method: 'post',
        url: ACT_API + "/picture",
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
}

const downloadPic = (picture) => {
    return Axios.get(ACT_API + "/picture/?pic=" + picture)
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
