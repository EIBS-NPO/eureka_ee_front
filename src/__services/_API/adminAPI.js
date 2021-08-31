import Axios from "axios";
import JwtDecode from "jwt-decode";
import {API_URL, USR_API} from "../../config";


/** ADMIN USER **/
function getUser(id =null) {
    let addURL = "/admin/user";
    if(id != null){
        addURL = addURL + "?id=" + id;
    }
    return Axios.get(API_URL + addURL )
}

const putUser = (user) => {

    return Axios.put(API_URL + "/admin/user", user)
}

const activ = (userId, isActiv) => {
    return Axios.put(API_URL + "/admin/user/active", {
        id:userId,
        isDisable:isActiv
    })
}

/** ADMIN ORGS **/

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getUser,
    putUser,
    activ
};