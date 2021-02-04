import Axios from "axios";
import {API_URL, PROJECT_API} from "../config";


function post(project) {
    console.log(project)
    return Axios.post(PROJECT_API, project)
}

function put(project) {
    return Axios.put(PROJECT_API, project)
}

function get(id = null){
    console.log(PROJECT_API + "/public")
    return Axios.get(API_URL + "/project/public")
}

function getMy(id =null){
    if(id === null ){
        return Axios.get(API_URL + "/project/created")
    }else {
        return Axios.get(API_URL + "/project/created/?id="+ id)
    }

}

export default {
    post,
    put,
    get,
    getMy
};