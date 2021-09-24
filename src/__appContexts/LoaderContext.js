import React from 'react';


export default React.createContext({
    callAPI: undefined,
    setCallAPI: (value) => {},
    data: undefined,
    setData: (value) => {}
})