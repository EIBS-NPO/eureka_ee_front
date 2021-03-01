
import Axios from "axios";
import { ACT_API, FOLW_ACT_API } from "../config";

console.log(ACT_API)

const post = (activity) => {
    return Axios.post(ACT_API, activity)
}

const put = (activity) => {
    return Axios.put(ACT_API, activity)
}

const get = (context, id = null, orgId = null, projectId = null) => {
    let params = "?cxt="+ context
    if(id !== null){
        params += "&id="+ id
    }
    return Axios.get(ACT_API + params)
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
    return Axios.put(FOLW_ACT_API + "/add", { "activityId":activityId })
}

const rmvFollow = (activityId) => {
    return Axios.put(FOLW_ACT_API + "/remove", { "activityId":activityId })
}

const getFollowers = (id) => {
    return Axios.get(FOLW_ACT_API + "/public?id="+id)
}

const getFavorites = () => {
    return Axios.get(FOLW_ACT_API + "/myFavorites")
}

export default {
    post,
    put,
    get,
    getPublic,
    downloadPic,
    remove,
    addFollow,
    rmvFollow,
    getFollowers,
    getFavorites
};
