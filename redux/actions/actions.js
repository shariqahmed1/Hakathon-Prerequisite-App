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

const services = (services) => {
    return{
        type: "GET_SERVICES",
        services,
    }
}

const cities = (cities) => {
    return{
        type: "GET_CITIES",
        cities,
    }
}

const filter = (filter) => {
    return{
        type: "GET_FILTERS",
        filter,
    }
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
    cities,
    filter,
    services,
    isAccountCreate,
    isLogin,
    updateUser
}