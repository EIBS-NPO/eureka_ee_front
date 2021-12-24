
import {checkStringLenght} from "../formPatternControl";

export function checkAddressFormValidity (address, setErrors ) {
    let errorsRslt = []
    let boolRslt = true;

    //address
    if (address.address && !checkStringLenght(address.address, 2, 255)){
        errorsRslt["address"] = "error_addressPattern"
        boolRslt = false;
    }else  errorsRslt["address"] = undefined

    //complement
    if (address.complement && !checkStringLenght(address.complement, 0, 255)){
        errorsRslt["complement"] = "error_complementPattern"
        boolRslt = false;
    }else  errorsRslt["complement"] = undefined

    //country
    if (address.country && !checkStringLenght(address.country, 2, 30)){
        errorsRslt["country"] = "error_countryPattern"
        boolRslt = false;
    }else  errorsRslt["country"] = undefined

    //zipCode
    if (address.zipCode && !checkStringLenght(address.zipCode, 2, 10)){
        errorsRslt["zipCode"] = "error_zipCodePattern"
        boolRslt = false;
    }else  errorsRslt["zipCode"] = undefined

    //city
    if (address.city && !checkStringLenght(address.city, 2, 50)){
        errorsRslt["city"] = "error_cityPattern"
        boolRslt = false;
    }else  errorsRslt["city"] = undefined

    if(boolRslt){
        setErrors({})
        return boolRslt
    }else {
        setErrors(errorsRslt)
        return boolRslt;
    }
}

export function asAddressChange(initialAddress, actualAddress, returnOnlyChanges = false ){

    if(returnOnlyChanges) {
        //submit only really changes
        if(initialAddress){
            if( actualAddress.address && actualAddress.address === initialAddress.address) initialAddress.address = undefined
            if( actualAddress.complement && actualAddress.complement === initialAddress.complement) actualAddress.complement = undefined
            if( actualAddress.city && actualAddress.city === initialAddress.city) actualAddress.city = undefined
            if( actualAddress.zipCode && actualAddress.zipCode === initialAddress.zipCode) actualAddress.zipCode = undefined
            if( actualAddress.country && actualAddress.country === initialAddress.country) actualAddress.country = undefined
        }

        return actualAddress

    }
    else{
        let boolResult = false

        if( !initialAddress )  boolResult = true
        else if(
            (  actualAddress.address && actualAddress.address !== initialAddress.address )
            || ( actualAddress.complement && actualAddress.complement !== initialAddress.complement )
            || ( actualAddress.city && actualAddress.city !== initialAddress.city )
            || ( actualAddress.zipCode && actualAddress.zipCode !== initialAddress.zipCode )
            || ( actualAddress.country && actualAddress.country !== initialAddress.country )
        ) boolResult = true

        return boolResult
    }
}