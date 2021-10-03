import React, { useState, useEffect} from 'react';
import { createMedia } from "@artsy/fresnel";

import AuthContext from "./__appContexts/AuthContext";
import MediaContext from "./__appContexts/MediaContext";

import AppRouter from "./__appComponents/AppRouter";

import authAPI from "./__services/_API/authAPI";
import fileAPI from "./__services/_API/fileAPI";

import 'semantic-ui-css/semantic.min.css'
import './scss/main.scss';

/*
state = {
    data: null
  };

  componentDidMount() {
      // Call our fetch function below once the component mounts
    this.callBackendAPI()
      .then(res => this.setState({ data: res.express }))
      .catch(err => console.log(err));
  }
    // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  };
 */

 function App({history}) {

     const [isAuthenticated, setIsAuthenticated] = useState( window.localStorage.getItem("authToken") != null )
     const [firstname, setFirstname] = useState( authAPI.getFirstname())
     const [lastname, setLastname] = useState( authAPI.getLastname())
     const [isAdmin, setIsAdmin] = useState(authAPI.isAdmin())
     const [partnerList, setPartnerList] = useState([])
     const [needConfirm, setNeedConfirm] = useState(undefined)

    //exressBackend
   //  const [data, setData] = useState(null)
   /*  const callBackendAPI = async () => {
         const response = await fetch('/express_backend');
         const body = await response.json();

         if (response.status !== 200) {
             throw Error(body.message)
         }
        // return body;
     };*/

     /*const callMailTest = async () => {
         await fetch('/send', {method:'POST'})
     }*/

     const AppMedia = createMedia({
         breakpoints: {
             xs:0,
             mobile: 601,//361
            // tablet: 601,
             computer: 992,
             largeScreen: 1200,
             widescreen: 1920
         }
     });
     const mediaStyles = AppMedia.createMediaStyle();
     const { Media, MediaContextProvider } = AppMedia;

     const [allowedMimes, setAllowedMimes] = useState([])
     useEffect(async()=>{

         //expressBackend
             // Call our fetch function below once the component mounts
        /* callBackendAPI()
             .then(res => console.log(res))
             .catch(err => console.log(err))*/
         // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js

        /* callMailTest()
             .then(res => console.log(res.express))
             .catch(err => console.log(err))*/

         let response = await fileAPI.getAllowedMime()
             .catch(error =>{
                 console.log(error.response)
             })
         if(response && response.status === 200){
             setAllowedMimes(response.data)
         }
     },[])


     //todo where pass backend data
  return (
      <>
        <style>{mediaStyles}</style>
        <MediaContext.Provider value={{Media, mediaStyles, MediaContextProvider, allowedMimes }}>
          <AuthContext.Provider value={{
              isAuthenticated, setIsAuthenticated,
              firstname, setFirstname,
              lastname, setLastname,
              isAdmin, setIsAdmin,
              partnerList, setPartnerList,
              needConfirm, setNeedConfirm
            }}
          >
            <AppRouter history={history}/>
          </AuthContext.Provider>
        </MediaContext.Provider>
      </>
  );
}

export default App;

