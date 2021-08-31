import React, {useState} from "react";

/*export default React.createContext({
    firstname: "",
    setName: (value) => { },
    lastname : "",
    picture: ""
});*/
/*
export const userContext = {
    id: undefined,
    email: undefined,
    lastname: undefined,
    picture: undefined,
    firstname: undefined,
    phone: undefined,
    mobile: undefined,
    address: undefined
}*/

export default React.createContext({
    user:undefined ,
    setUser: (value) => {},
   // picture: this.user.picture,
  //  setter({...tabText, [lg]: value})
});