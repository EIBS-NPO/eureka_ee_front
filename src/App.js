import React, { useState } from 'react';
import { createMedia } from "@artsy/fresnel";

import AuthContext from "./__appContexts/AuthContext";
import MediaContext from "./__appContexts/MediaContext";

import AppRouter from "./__appComponents/AppRouter";

import authAPI from "./__services/_API/authAPI";

import 'semantic-ui-css/semantic.min.css'
import './scss/main.scss';

 function App({history}) {

     const [isAuthenticated, setIsAuthenticated] = useState( window.localStorage.getItem("authToken") != null )
     const [firstname, setFirstname] = useState( authAPI.getFirstname())
     const [lastname, setLastname] = useState( authAPI.getLastname())
     const [isAdmin, setIsAdmin] = useState(authAPI.isAdmin())
     const [partnerList, setPartnerList] = useState([])
     const [needConfirm, setNeedConfirm] = useState(undefined)

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

     // todo provoque un rechargement de la page, a placer dans le compo nécessaire, avec loader
    /* const [allowedMimes, setAllowedMimes] = useState([])
     useEffect(async()=>{

         let response = await fileAPI.getAllowedMime()
             .catch(error =>{
                 console.log(error.response)
             })
         if(response && response.status === 200){
             setAllowedMimes(response.data)
         }
     },[])*/
  return (
      <>
        <style>{mediaStyles}</style>
        <MediaContext.Provider value={{Media, mediaStyles, MediaContextProvider }}>
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

