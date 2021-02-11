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
    return Axios.put(PROJECT_API, project)
}

function get(id = null){
    return Axios.get(API_URL + "/project/public")
}

function getMy(id =null){
    if(id === null ){
        return Axios.get(API_URL + "/project/created")
    }else {
        return Axios.get(API_URL + "/project/created/?id="+ id)
    }

}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    post,
    put,
    get,
    getMy
};