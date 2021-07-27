import Axios from "axios";
import { ORG_API } from "../config";

function post(org) {
    return Axios.post(ORG_API, org)
}

function put(org) {
    let data = {
        "orgId" : org.id,
        "name" : org.name,
        "type": org.type,
        "email": org.email,
        "phone" : org.phone,
        'description': org.description
    }
    if(org.partner !== undefined){
        data["isPartner"] = org.partner
    }
    return Axios.put(ORG_API, data)
}

function getPublic(id = null, isPartner=null){
    let endPoint = ORG_API;
    if(id === null){
        if(isPartner !== null){
            endPoint += "/public?isPartner=true"
        }
        else{
            endPoint += "/public";
        }
    }else {
        endPoint += "/public?id=" + id;
    }
    return Axios.get(endPoint)
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

const manageActivity = (activity, orgId) => {
    return Axios.put(ORG_API + "/manageActivity", {
            orgId: orgId,
            activityId: activity.id
        })
}

const manageProject = (project, orgId) => {
    return Axios.put(ORG_API + "/manageProject", {
        orgId: orgId,
        projectId: project.id
    })
}

const getMembered = () => {
    return Axios.get(ORG_API + "/membered")
}

const remove = (orgId) => {
    return Axios.delete(ORG_API + "?orgId=" + orgId)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    post,
    put,
    remove,
    getPublic,
    getMy,
    uploadPic,
    downloadPic,
    manageActivity,
    manageProject,
    getMembered
};
