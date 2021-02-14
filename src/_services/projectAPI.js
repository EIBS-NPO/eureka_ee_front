import Axios from "axios";
import {API_URL, PROJECT_API} from "../config";

function post(project) {
    let data = {
        "title": project.title,
        "description": project.description,
        "startDate": project.startDate,
        "endDate": project.endDate,
        "isPublic": project.isPublic,
    }
    if(project.organization) {
        data["orgId"] = project.organization.id
    }
    console.log(data)
    return Axios.post(PROJECT_API, data)
}

function put(project) {
    console.log(project)
    return Axios.put(PROJECT_API, project)
}

function get(context, id = null){
    let params = "?context="+ context
    if(id !== null){
           params += "&id="+ id
    }
    return Axios.get(API_URL + "/project/" + params)
}

function getPublic(id =null){
    if(id === null ){
        return Axios.get(API_URL + "/project/public")
    }else {
        return Axios.get(API_URL + "/project/public/?id="+ id)
    }

}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    post,
    put,
    get,
    getPublic
};