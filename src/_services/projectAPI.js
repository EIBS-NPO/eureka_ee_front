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
    let params = "?ctx="+ context
    console.log(params)
    if(id !== null){
           params += "&id="+ id
        console.log(params)
    }
    return Axios.get(PROJECT_API + params)
}

function getPublic(id =null){
    if(id === null ){
        return Axios.get(PROJECT_API + "/public")
    }else {
        return Axios.get(PROJECT_API + "/public?id="+ id)
    }
}
/*
const addTeammate = (projectId, email) => {
    return Axios.put( , {
        projectId : projectId,
        email : email
    })
}

function getTeam(projectId){
    return Axios.get()
}

function rmvTeammate(userId, projectId){
    return Axios.put(, {
        userId: userId,
        projectId : projectId
    })
}*/

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    post,
    put,
    get,
    getPublic
};