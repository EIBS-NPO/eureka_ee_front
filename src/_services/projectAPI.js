import Axios from "axios";
import { FOLW_PROJECT, PROJECT_API } from "../config";

const post = (project) => {
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

const put = (project) => {
    console.log(project)
    return Axios.put(PROJECT_API, project)
}

/**
 *
 * @param context
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
const get = (context, id = null) => {
    let params = "?ctx="+ context
    console.log(params)
    if(id !== null){
           params += "&id="+ id
        console.log(params)
    }
    return Axios.get(PROJECT_API + params)
}

const getPublic = (id = null) => {
    if(id === null ){
        return Axios.get(PROJECT_API + "/public")
    }else {
        return Axios.get(PROJECT_API + "/public?id="+ id)
    }
}

const getAssigned = () => {
    return Axios.get(PROJECT_API + "/assigned");
}

const getFollowed = () => {
    return Axios.get(PROJECT_API + "/followed");
}

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
    console.log(projectId)
    console.log(followType)
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
    getFollowed,
    getAssigned,
    manageActivity,
    manageOrg
};