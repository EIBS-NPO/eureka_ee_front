
export const checkPassword = (password) => {
    const regex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,20}$/)
    return regex.test(password)
}

export const checkUrlToken = (urlToken) => {
    //todo
}

export const checkStringLenght = (str, min, max) => {
    return str.length >= min && str.length <= max
}


export const checkMultiTextHaveText = ( tabText ) => {
    let result = false
    for (const text of Object.entries(tabText)) {
        if( text[1] !== "") result = true
    }
    return result
}

export const checkMultiTextHaveChange = async (initialTabText, actualTabText = {}) => {
    let result = undefined
  //  function checkChange() {
        for (const [keyText, text] of Object.entries(actualTabText)) {
            //  console.log(["text",text])
            //  console.log(["intitialText",initialTabText[keyText]])
            //  if(text !== initialTabText[keyText]) result = true
            if (text !== initialTabText[keyText]) result = true
        }
  //  }
  //  await checkChange()
    return result ? result : false
    //   return result
}

/*
Combined with @fezfox's improvements(?) and length optimized: ^\+((?:9[679]|8[035789]|6[789]|5[90]|42|3[578]|2[1-689])|9[0-58]|8[1246]|6[0-6]|5[1-8]|4[013-9]|3[0-469]|2[70]|7|1)(?:\W*\d){0,13}\d$
 */
export const checkInternationnalPhone = (phoneNumber) => {
    const regex = new RegExp(/\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/)
    return regex.test(phoneNumber)
}