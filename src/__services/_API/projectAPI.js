import Axios from "axios";
import {PROJECT_API} from "../../config";


const getBodyFormData = (project) => {
    let bodyFormData = new FormData();
    if(project.id !== undefined){
        bodyFormData.append('id', project.id)
    }
    if(project.title !== undefined){
        bodyFormData.append('title', project.title)
    }
    if(project.description !== undefined){
        bodyFormData.append('description', JSON.stringify(project.description))
    }
    if(project.startDate !== undefined){
        bodyFormData.append('startDate', project.startDate === "" ? null : project.startDate)
    }
    if(project.endDate !== undefined){
        bodyFormData.append('endDate', project.endDate === "" ? null : project.endDate)
    }
    if(project.pictureFile !== undefined){
        bodyFormData.append('pictureFile', project.pictureFile)
    }
    if(project.organization !== undefined){
        let org = project.organization === null ? null : project.organization.id
        bodyFormData.append('organization', org)
    }
    if(project.activity !== undefined){
        let activity = project.activity === null ? null : project.activity.id
        bodyFormData.append('activity', activity)
    }
    if(project.follow !== undefined){
        bodyFormData.append('follow', "true")
    }
    return bodyFormData;
}

const getUrlParams = (access, project = undefined, admin = undefined) => {

    let params = "?access="+access
    if(admin === true) params += "&admin=1";
    if(access !== "all") {
        if (project) {
            if (project.id) params += "&id=" + project.id
            if (project.title) params += "&title=" + project.title
            if (project.email) params += "&email=" + project.email

            //by creator
            if (project.creator) {
                if (project.creator.id) params += "&creator_id=" + project.creator.id
                if (project.creator.firstname) params += "&creator_firstname=" + project.creator.firstname
                if (project.creator.lastname) params += "&creator_lastname=" + project.creator.lastname
                if (project.creator.email) params += "&creator_email=" + project.creator.email
            }

            //by org
            if (project.organization) {
                if (project.organization.id) params += "&organization_id=" + project.organization.id
                if (project.organization.name) params += "&organization_name=" + project.organization.name
                if (project.organization.email) params += "&organization_email=" + project.organization.email
            }

            //by user assigned
            if(project.followings) {
                if(project.followings.isAssign) params += "&followings_isAssigning=" + project.followings.isAssign
                if(project.followings.follower) params += "&follower_id=" + project.followings.follower.id
            }
        }
    }

    return params;
}

const post = (project) => {
    let bodyFormData = getBodyFormData(project)
    return Axios({
        method: 'post',
        url: PROJECT_API,
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
}

const put = (project, adminManagment = undefined) => {
    let bodyFormData = getBodyFormData(project)

    if(adminManagment !== undefined ) {
        bodyFormData.append("admin", "1")
    }

    return Axios({
        method: 'post',
        url: PROJECT_API+"/update",
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
}


const get = (access, project, admin = false) => {
    return Axios.get(PROJECT_API + getUrlParams(access, project, admin))
}

const getPublic = (access, project) => {
    return Axios.get(PROJECT_API + "/public" + getUrlParams(access, project))
}

const deleteProject = (projectId) => {
    return Axios.delete(PROJECT_API + "?projectId=" + projectId)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    post,
    put,
    getPublic,
    get,
    deleteProject
};