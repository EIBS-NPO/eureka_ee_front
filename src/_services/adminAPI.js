import Axios from "axios";
import JwtDecode from "jwt-decode";
import { API_URL } from "../config";

function getUser(id =null) {
    let addURL = "/admin/user";
    if(id != null){
        addURL = addURL + "?id=" + id;
    }
    return Axios.get(API_URL + addURL )
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getUser
};