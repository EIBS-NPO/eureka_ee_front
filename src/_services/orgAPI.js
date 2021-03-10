import Axios from "axios";
import { ORG_API } from "../config";

function post(org) {
    return Axios.post(ORG_API, org)
}

function put(org) {
    return Axios.put(ORG_API, org)
}

function getPublic(id = null){
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
    getPublic,
    getMy,
    uploadPic,
    downloadPic,
    manageActivity,
    manageProject,
    getMembered
};
