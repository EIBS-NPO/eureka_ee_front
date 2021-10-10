import Axios from "axios";
import {FOLW_PROJECT, ORG_API, PROJECT_API} from "../../config";


const getBodyFormData = (project) => {
    let bodyFormData = new FormData();
    bodyFormData.append('title', project.title)
    bodyFormData.append('description', JSON.stringify(project.description))
    if(project.id !== undefined){
        bodyFormData.append('id', project.id)
    }
    if(project.startDate !== undefined){
        bodyFormData.append('startDate', project.startDate)
    }
    if(project.endDate !== undefined){
        bodyFormData.append('endDate', project.endDate)
    }
    if(project.pictureFile !== undefined){
        bodyFormData.append('pictureFile', project.pictureFile)
    }
    if(project.organization !== undefined){
        let org = project.organization === null ? null : project.organization.id
        bodyFormData.append('organization', org)
    }
    return bodyFormData;
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

const put = (project, putRelationWith ={}) => {
    if(putRelationWith["org"] !== undefined){
        project.organization = putRelationWith["org"]
    }
    if(putRelationWith["pictureFile"] !== undefined){
        project.pictureFile = putRelationWith["pictureFile"]
    }

    let bodyFormData = getBodyFormData(project)

    //add after for multiRelationnal (ListOf)
    if(putRelationWith["activity"] !== undefined){
        bodyFormData.append('activity', putRelationWith["activity"].id)
    }
    if(putRelationWith["follow"] !== undefined){
        bodyFormData.append('follow', "true")
    }
    if(putRelationWith["assign"] !== undefined){
        bodyFormData.append('assign', "true")
    }
    return Axios({
        method: 'post',
        url: PROJECT_API+"/update",
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
   /* let data = {
        "id": project.id,
        "title": project.title,
        "description": project.description,
        "startDate": project.startDate,
        "endDate": project.endDate
    }
    return Axios.put(PROJECT_API, data)*/
}


const get = (context, id = null) => {
    let params = "?ctx="+ context
    if(id !== null){ params += "&projectId="+ id }
    return Axios.get(PROJECT_API + params)
}


//access may be Private, or Owner, or ...?
const getProject = (access = null , id = null) => {
    let params = "?";
    if(access !== null){ params += "access=" + access }
    if(id !== null){
        if( params !== "" ) { params += "&"}
        params += "id=" + id
    }
    if(params === "?" ){
        return Axios.get(PROJECT_API )
    }else {
        return Axios.get(PROJECT_API + params)
    }
}

const getPublic = (id=null) => {
    let params = "";
    if(id !== null){
        params += "?id=" + id
    }
    return Axios.get(PROJECT_API + "/public" + params )
}

/*const getAssigned = () => {
    return Axios.get(PROJECT_API + "/assigned");
}*/

/*const getFollowed = () => {
    return Axios.get(PROJECT_API + "/followed");
}*/

const addAssigning = ( projectId, email ) => {
    return Axios.post(FOLW_PROJECT, {
        projectId:projectId,
        email:email,
        isAssigning:true
    })
}

const addFollowing = ( projectId ) => {
    return Axios.post(FOLW_PROJECT, {
        projectId:projectId,
        isFollowing:true
    })
}

const rmvAssigning = ( projectId, userId ) => {
    return Axios.put(FOLW_PROJECT, {
        projectId:projectId,
        userId:userId,
        isAssigning:false
    })
}

const rmvFollowing = ( projectId ) => {
    return Axios.put(FOLW_PROJECT, {
        projectId:projectId,
        isFollowing:false
    })
}

const manageActivity = (activity, projId) => {
    return Axios.put(PROJECT_API + "/manageActivity", {
        projectId:projId,
        activityId:activity.id
    })
}

const manageOrg = (org, projId) => {
    return Axios.put(PROJECT_API + "/manageOrg", {
        projectId:projId,
        orgId: org.id
    })
}

const deleteProject = (projectId) => {
    return Axios.delete(PROJECT_API + "?projectId=" + projectId)
}

/*
const addTeammate = (projectId, email) => {
    return Axios.put( , {
        projectId : projectId,
        email : email
    })
}
*/

const getTeam = (projectId) => {
    return Axios.get(PROJECT_API + "/team/public?projectId=" + projectId)
}

const isFollowing = (projectId, followType) => {
    let params = "?projectId=" + projectId;
    if(followType === "assign"){ params += "&isAssigning=1" }
    if(followType === "follow"){ params += "&isFollowing=1" }
    return Axios.get(FOLW_PROJECT + params)
}

/*
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
    getPublic,
    addAssigning,
    addFollowing,
    rmvAssigning,
    rmvFollowing,
    getTeam,
    isFollowing,
 //   getFollowed,
//    getAssigned,
    manageActivity,
    manageOrg,
    deleteProject,
    getProject
};