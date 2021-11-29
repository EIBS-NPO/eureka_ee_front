
import React, {useEffect, useState} from 'react';
import { createMedia } from "@artsy/fresnel";

import AuthContext from "./__appContexts/AuthContext";
import MediaContext from "./__appContexts/MediaContext";

import AppRouter from "./___router/AppRouter";

import authAPI from "./__services/_API/authAPI";

import 'semantic-ui-css/semantic.min.css'
import 'react-phone-number-input/style.css'
import './scss/main.scss';
import './scss/components/Modal.scss'
import fileAPI from "./__services/_API/fileAPI";
import {HandleGetOrgs} from "./__services/_Entity/organizationServices";
import orgAPI from "./__services/_API/orgAPI";

 function App({history}) {

     const [isAuthenticated, setIsAuthenticated] = useState( window.localStorage.getItem("authToken") != null )
     const [firstname, setFirstname] = useState( authAPI.getFirstname())
     const [lastname, setLastname] = useState( authAPI.getLastname())
     const [email, setEmail] = useState( authAPI.getEmail())
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
     const [allowedMimes, setAllowedMimes] = useState([])

     const [errors, setErrors] = useState('')

     function getAllowedMimeType(){
         fileAPI.getAllowedMime()
             .then(response => {
                 setAllowedMimes(response.data[0].split(','))
             })
             .catch(error =>{
                 console.log(error.response)
             })
     }
     function getPartner(){
         HandleGetOrgs(
             {access:"public", org:{partner:true}},
             setPartnerList,
             undefined,
             setErrors,
             history
         )
       /*  orgAPI.getPublic( "public",{partner:true})
             .then(response => {
                 setPartnerList(response.data)
             })
             .catch(error => console.log(error))*/
     }
     useEffect(()=>{
         getAllowedMimeType()
         getPartner()
     },[])

  return (
      <>
        <style>{mediaStyles}</style>
        <MediaContext.Provider value={{Media, mediaStyles, MediaContextProvider,allowedMimes}}>
          <AuthContext.Provider value={{
              isAuthenticated, setIsAuthenticated,
              firstname, setFirstname,
              lastname, setLastname,
              email, setEmail,
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

