
import UserAPI from "../_API/userAPI";
import {checkPassword, checkStringLenght} from "../formPatternControl";
import authAPI from "../_API/authAPI";
import userAPI from "../_API/userAPI";

export const HandleUserPost = (newUser, postTreatment, setLoader, setErrors ) => {
    setLoader(true)
    UserAPI.register(newUser)
        .then(response => {
            postTreatment(response.data[0])
        })
        .catch(error => {
            console.log(error.response)
            setLoader(false)
            setErrors(error.response.data)
        })
};

export const HandleUserUpdate = async (userSubmitted, postTreatment, setLoader, setErrors, history, forAdmin=false ) => {
    setLoader(true);
    if (authAPI.isAuthenticated()) {
        let adminManagement = forAdmin ? {admin: true} : undefined
        if (userSubmitted.roles !== undefined) {
            adminManagement["roles"] = !(userSubmitted.roles === "ROLE_USER")
        }

        UserAPI.put(userSubmitted, {}, adminManagement)
            .then(response => {
                if (response.data.token) window.localStorage.setItem("authToken", response.data.token);
                postTreatment(response.data[0])
            })
            .catch(error => {
                setErrors(error.response.data)
            })
            .finally(() => {
                setLoader(false) //todo check when loader need false (with lodal or not)
            })
    } else history.replace('/login')
};

export const HandleGetUsers = async (params, postTreatment, setLoader, setErrors, history = undefined, isAdmin = false) => {

    setLoader(true)
    if (params.access === 'public') {
        userAPI.getPublic("search", params.user)
            .then(response => {
                postTreatment(params.id ? response.data[0] : response.data)
            })
            .catch(error => {
                console.log(error)
                setErrors(error.response.data)
            })
            .finally(() => {
                setLoader(false)
            })
    } else {
        if (await authAPI.isAuthenticated()) {
            userAPI.get(params.access, params.user, isAdmin)
                .then(response => {
                    postTreatment(response.data)
                })
                .finally(() => setLoader(false))
        } else {
            history.replace('/login')
        }
    }
}

//todo placer dans modal admin userPage_admin et page activation
export const HandleConfirmUserEmailAccount = (tokenActivation, postTreatment, setLoader, setError, forAdmin = false) => {
    setLoader(true)
    userAPI.activation(tokenActivation)
        .then(response => {
            postTreatment(response)
          /*  setNeedConfirm(false)
            setLoader(false)
            setTimeout(() => {
                props.history.replace('/login')
            }, 3000);*/
        })
        .catch(error => {
            console.log(error)
            console.log(error.response)
            setError(error.response) //todo test with an error
            setLoader(false)
        })
    //    .finally(()=>setLoader(false))
}

export const checkUserFormValidity = (user, setErrors) => {
 //   console.log(user)
    let errorsRslt = []
    let boolRslt = true;

    //checkPassword
    if(user.password){
        if(user.password && !checkPassword(user.password)){
            errorsRslt["password"] = "password_bad_pattern"
            boolRslt = false;
        }else errorsRslt["password"] = undefined

        if(user.confirmPassword && !(user.password === user.passwordConfirm || user.passwordConfirm === "")) {
            errorsRslt["passwordConfirm"] = "password_not_match"
            boolRslt = false;
        }else errorsRslt["passwordConfirm"] = undefined
    }

    //lastname
    if (user.lastname && !checkStringLenght(user.lastname, 2, 50)){
        errorsRslt["lastname"] = "error_namePattern"
        boolRslt = false;
    }else  errorsRslt["lastname"] = undefined

    //firstname
    if(user.firstname && !checkStringLenght(user.firstname, 2, 50)) {
        errorsRslt["firstname"] = "error_namePattern"
        boolRslt = false;
    }else errorsRslt["firstname"] = undefined

  //  console.log(boolRslt)
    if(boolRslt){
        setErrors({})
        return boolRslt
    }else {
        setErrors(errorsRslt)
        return boolRslt;
    }
}

/**
 * return is an userObject have change.
 * with returnOnlyChanges, return the user only with changes.
 * @param initialUser
 * @param actualUser
 * @param returnOnlyChanges
 * @returns {{user}|boolean}
 */
export function asUserChange(initialUser, actualUser, returnOnlyChanges = false ){

    if(returnOnlyChanges) {

        let userWithChanges = { ...actualUser };
        //submit only really changes
        if ( actualUser.firstname === initialUser.firstname ) userWithChanges.firstname = undefined
        if ( actualUser.lastname && actualUser.lastname === initialUser.lastname ) userWithChanges.lastname = undefined
        if ( actualUser.email && actualUser.email === initialUser.email ) userWithChanges.email = undefined
        if ( (actualUser.phone || actualUser.phone === null) && actualUser.phone === initialUser.phone ) userWithChanges.phone = undefined
        if ( (actualUser.mobile || actualUser.mobile === null) && actualUser.mobile === initialUser.mobile ) userWithChanges.mobile = undefined

        return userWithChanges

    }
    else{
        let boolResult = false

        if(
            (actualUser.firstname && actualUser.firstname !== initialUser.firstname)
            || (actualUser.lastname && actualUser.lastname !== initialUser.lastname)
            || (actualUser.email && actualUser.email !== initialUser.email)
            || ((actualUser.phone || actualUser.phone === null) && actualUser.phone !== initialUser.phone)
            || ((actualUser.mobile || actualUser.mobile == null) && actualUser.mobile !== initialUser.mobile)
            || actualUser.pictureFile !== undefined
        ) boolResult = true

        return boolResult
    }
}