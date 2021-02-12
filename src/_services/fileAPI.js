import Axios from "axios";
import {API_URL} from "../config";

const uploadPic = (entity, bodyFormData) => {
   // console.log(bodyFormData)
    //return Axios.post(API_URL + "/user/picture", {picture:pic} );
    return Axios({
        method: 'post',
        url: API_URL + "/" + entity + "/picture",
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
}

/*const downloadPic = (entity, picture) => {
    return Axios.get(API_URL + "/" + entity + "/picture/?pic=" + picture)
}*/

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    uploadPic,
  //  downloadPic
}