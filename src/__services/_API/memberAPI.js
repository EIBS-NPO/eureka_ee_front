import Axios from "axios";
import { API_URL } from "../../config";

const addMember = (orgId, email) => {
    return Axios.put( API_URL + '/member/add', {
        orgId : orgId,
        email : email
    })
}

function get(orgId){
    return Axios.get(API_URL + "/member/public?orgId=" + orgId)
}

function remove(userId, orgId){
    return Axios.put(API_URL + "/member/remove", {
        userId: userId,
        orgId : orgId
    })
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    addMember,
    get,
    remove
}