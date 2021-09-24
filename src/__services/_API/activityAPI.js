
import Axios from "axios";
import {ACT_API, FOLW_ACT, ORG_API, PROJECT_API} from "../../config";

/*
id: undefined,
        picture:undefined,
        file:undefined,
        title: "",
        summary: {},
        isPublic: false,
 */

const post = (activity) => {
    let bodyFormData = new FormData();
    bodyFormData.append('title', activity.title)
    bodyFormData.append('isPublic', activity.isPublic)
    bodyFormData.append('summary', JSON.stringify(activity.summary))
    if(activity.picture !== undefined){
        bodyFormData.append('pictureFile', activity.picture)
    }
    if(activity.file !== undefined){
        bodyFormData.append('file', activity.file)
    }
    return Axios({
        method: 'post',
        url: ACT_API,
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
//    return Axios.post(ACT_API, activity)
}

const put = (activity) => {
    let data = {
        "id": activity.id,
        "title": activity.title,
        "summary": JSON.stringify(activity.summary),
        "isPublic": activity.endDate
    }
    return Axios.put(ACT_API, activity)
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

const uploadPic = (bodyFormData) => {
    return Axios({
        method: 'post',
        url: ACT_API + "/picture",
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
}

const downloadPic = (picture) => {
    return Axios.get(ACT_API + "/picture/?pic=" + picture)
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
    downloadPic,
    remove,
    addFollow,
    rmvFollow,
    getFollowers,
    getFavorites,
    isFollowing
};
