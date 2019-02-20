import { FIREBASE_DATABASE }  from '../../constants/Firebase';

const getUserDetails = (user) => {
    return{
        type: "GET_USER_DETAILS",
        user,
    }
}

const updateUser =  (id) => async dispatch => {
    FIREBASE_DATABASE.ref('users').child(id).once('value', snap => {
        dispatch(getUserDetails(snap.val()))
    })
}


const isLogin = (flag) => {
    return{
        type: "IS_LOGIN",
        isLogin:flag,
    }
}

const isAccountCreate = (flag) => {
    return{
        type: "IS_ACCOUNT_CREATE",
        isAccountCreate:flag,
    }
}

export {
    getUserDetails,
    isAccountCreate,
    isLogin,
    updateUser
}