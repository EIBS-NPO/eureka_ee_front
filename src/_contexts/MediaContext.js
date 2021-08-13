import React from "react";
import {createMedia} from "@artsy/fresnel";
/*

const AppMedia = createMedia({
    breakpoints: {
        mobile: 320,
        tablet: 768,
        computer: 992,
        largeScreen: 1200,
        widescreen: 1920
    }
});

const mediaStyles = AppMedia.createMediaStyle();
const { Media, MediaContextProvider } = AppMedia;
*/

export default React.createContext({
    media: "",
    mediaStyles: "",
    mediaContext: "",
});