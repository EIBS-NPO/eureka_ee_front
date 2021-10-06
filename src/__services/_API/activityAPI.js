
import Axios from "axios";
import {ACT_API, FOLW_ACT } from "../../config";

const getBodyFormData = (activity) => {
    let bodyFormData = new FormData();
    bodyFormData.append('title', activity.title)
    bodyFormData.append('isPublic', activity.isPublic)
    bodyFormData.append('summary', JSON.stringify(activity.summary))
    if(activity.id !== undefined){
        bodyFormData.append('id', activity.id)
    }
    if(activity.pictureFile !== undefined){
        bodyFormData.append('pictureFile', activity.pictureFile)
    }
    if(activity.file !== undefined){
        bodyFormData.append('file', activity.file)
    }
    if(activity.organization !== undefined){
        let org = activity.organization === null ? null : activity.organization.id
        bodyFormData.append('organization', org)
    }
    if(activity.project !== undefined){
        let project = activity.project === null ? null : activity.project.id
        bodyFormData.append('project', project)
    }
    return bodyFormData;
}

const post = (activity) => {
    let bodyFormData = getBodyFormData(activity)
    return Axios({
        method: 'post',
        url: ACT_API,
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
//    return Axios.post(ACT_API, activity)
}

const put = (activity, putRelationWith={}) => {
    if(putRelationWith["org"] !== undefined){
        activity.organization = putRelationWith["org"]
    }
    if(putRelationWith["project"] !== undefined){
        activity.project = putRelationWith["project"]
    }
    if(putRelationWith["pictureFile"] !== undefined){
        activity.pictureFile = putRelationWith["pictureFile"]
    }
    if(putRelationWith["file"] !== undefined){
        activity.file = putRelationWith["file"]
    }
    let bodyFormData = getBodyFormData(activity)

    //add after for multiRelationnal (ListOf)
    if(putRelationWith["follow"] !== undefined){
        bodyFormData.append('follow', "true")
    }
    return Axios({
        method: 'post',
        url: ACT_API+"/update",
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
    /*let data = {
        "id": activity.id,
        "title": activity.title,
        "summary": JSON.stringify(activity.summary),
        "isPublic": activity.endDate
    }
    return Axios.put(ACT_API, activity)*/
}

const get = (context, id = null, orgId = null, projectId = null) => {
    let params = "?ctx="+ context
    if(id !== null){
        params += "&id="+ id
    }
    return Axios.get(ACT_API + params)
}

function getActivity(access =null, id =null){
    let params = "?";
    if(access !== null){ params += "access=" + access }
    if(id !== null){
        if( params !== "" ) { params += "&"}
        params += "id=" + id
    }
    if(params === "?" ){
        return Axios.get(ACT_API )
    }else {
        return Axios.get(ACT_API + params)
    }
}

const getPublic = (id = null) => {
    if(id === null ){
        return Axios.get(ACT_API + "/public")
    }else {
        return Axios.get(ACT_API + "/public?id="+ id)
    }

}

const remove = (id) => {
    return Axios.delete(ACT_API + "?id=" + id)
}

const addFollow = (activityId) => {
    return Axios.put(FOLW_ACT + "/add", { "activityId":activityId })
}

const rmvFollow = (activityId) => {
    return Axios.put(FOLW_ACT + "/remove", { "activityId":activityId })
}

const getFollowers = (id) => {
    return Axios.get(FOLW_ACT + "/public?id="+id)
}

const getFavorites = () => {
    return Axios.get(FOLW_ACT + "/myFavorites")
}

const isFollowing = (activityId) => {
    return Axios.get(FOLW_ACT + "?activityId=" + activityId)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    post,
    put,
    get,
    getActivity,
    getPublic,
    remove,
    addFollow,
    rmvFollow,
    getFollowers,
    getFavorites,
    isFollowing
};
