import React, { useState, useEffect} from 'react';
import { createMedia } from "@artsy/fresnel";

import AuthContext from "./__appContexts/AuthContext";
import MediaContext from "./__appContexts/MediaContext";

import AppRouter from "./__appComponents/AppRouter";

import authAPI from "./__services/_API/authAPI";
import fileAPI from "./__services/_API/fileAPI";

import 'semantic-ui-css/semantic.min.css'
import './scss/main.scss';



 function App({history}) {
     authAPI.setup()

     //todo use AuthContext
     const [isAuthenticated, setIsAuthenticated] = useState( authAPI.isAuthenticated() )

     const [firstname, setFirstname] = useState( authAPI.getFirstname())
     const [lastname, setLastname] = useState( authAPI.getLastname())
     const [isAdmin, setIsAdmin] = useState(authAPI.isAdmin())

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
         /*setLoader(true)*/
         let response = await fileAPI.getAllowedMime()
             .catch(error =>{
                 console.log(error.response)
             })
         if(response && response.status === 200){
             setAllowedMimes(response.data)
         }
         /*setLoader(false)*/
     },[])

  return (
      <>
        <style>{mediaStyles}</style>
        <MediaContext.Provider value={{Media, mediaStyles, MediaContextProvider, allowedMimes }}>
          <AuthContext.Provider value={{
              isAuthenticated, setIsAuthenticated,
              firstname, setFirstname,
              lastname, setLastname,
              isAdmin, setIsAdmin
          }}>
            <AppRouter />
          </AuthContext.Provider>
        </MediaContext.Provider>
      </>
  );
}

export default App;

