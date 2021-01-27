import Axios from "axios";
import {API_URL, ORG_API} from "../config";


function post(org) {
    return Axios.post(ORG_API, org)
}

function put(org) {
    return Axios.put(ORG_API, org)
}

function get(id = null){
console.log(ORG_API + "/public")
    return Axios.get(API_URL + "/org/public", id)
}

function getMy(id= null){
    if(id !== null){
        return Axios.get(API_URL + "/org", id)
    }else {
        return Axios.get(API_URL + "/org")
    }
}

export default {
    post,
    put,
    get,
    getMy
};
