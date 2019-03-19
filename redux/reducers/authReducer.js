const reducer = (state = {}, action) => {
    switch(action.type) {
        case "GET_USER_DETAILS": {
            return {...state, user: action.user}
        }
        case "IS_LOGIN" :{
            return {...state, isLogin : action.isLogin}
        }
        case "IS_ACCOUNT_CREATE":{
            return {...state, isAccountCreate : action.isAccountCreate}
        }
        case "GET_SERVICES":{
            return {...state, services : action.services}
        }
        case "GET_CITIES":{
            return {...state, cities : action.cities}
        }
        case "GET_FILTERS":{
            return {...state, filter : action.filter}
        }
        default: {
            return state;
        }
    }
}

export default reducer