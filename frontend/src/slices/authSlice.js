import { createSlice } from "@reduxjs/toolkit";

//Login Authentication Slicess...
const authSlice = createSlice({
    name : 'auth',  //name of the slice..
    initialState : {    //At the time of refreshing page, API requests send so, the initial could be....
        loading : true,  //Setting loading initially would be true so when user logged in, they can accesss page by typing path in Urls..
        isAuthenticated : false   //Checks wheather the user logged in or not..
    },
    reducers : {  //After loading reducers will do what happens next....
        loginRequest(state, action){
            return {        //Once the page loads this function works and return the state as true...
                ...state,  //It will bring initialStage loading as false and isAuthenticated with this request....isAuthenticated stll remains as false,
                loading : true
            }
        },
        loginSuccess(state, action){  //It works once the data received and loading become false to stop the process....
            return {
                loading : false,
                isAuthenticated : true,   //User logged in successfully...
                user : action.payload.user  //when requesting the data we get the user data as value from backend, received by payload properties and store into actions and stored in the user properties..
            }
        },
        loginFail(state, action){  //What if we doesn't get the products, so handling error this function was used...
            return {
                ...state,   //It will bring isAuthenticated as false, caz the user failed to login...
                loading : false,
                error : action.payload  //It will send the error message to action...
            }
        },
        clearError(state, action){  //Used for change the error value to be null once user logged in...or it will show error even user logged in....
            return {
                ...state,
                error : null
            }
        },
        RegisterRequest(state, action){
            return {        //Once the page loads this function works and return the state as true...
                ...state,  //It will bring initialStage loading as true and isAuthenticated with this request....isAuthenticated stll remains as false,
                loading : true
            }
        },
        RegisterSuccess(state, action){  //It works once the data received and loading become false to stop the process....
            return {
                loading : false,
                isAuthenticated : true,   //User registered successfully...
                user : action.payload.user  //when requesting the data we get the user data as value from backend, received by payload properties and store into actions and stored in the user properties..
            }
        },
        RegisterFail(state, action){  //What if we doesn't get the data, so handling error this function was used...
            return {
                ...state,   //It will bring isAuthenticated as false, caz the user failed to login / initialSatge isAuthenticated is false...
                loading : false,
                error : action.payload  //It will send the error message to action...
            }
        },
        
        //To save user cookies once logged In...
        loadUserRequest(state, action){
            return {
                ...state,
                isAuthenticated : false,
                loading : true
            }
        },
        loadUserSuccess(state, action){
            return {
                ...state,
                loading : false,
                isAuthenticated : true,
                user : action.payload.user  //payload is a http....which brings user data..
            }
        },
        loadUserFail(state, action){
            return {
                ...state,
                loading : false
            }
        },
        //To logout User...remove cookies from browser...
        logoutSuccess(state, action){
            return {
                loading : false,
                isAuthenticated : false
            }
        },
        logoutFail(state, action){
            return {
                ...state,
                error : action.payload
            }
        },
        updateProfileRequest(state, action){
            return {        //Once the page loads this function works and return the state as true...
                ...state,  //It will bring initialStage loading as true and isAuthenticated with this request....isAuthenticated stll remains as false,
                loading : true,
                isUpdated : false
            }
        },
        updateProfileSuccess(state, action){  //It works once the data received and loading become false to stop the process....
            return {
                ...state,
                loading : false,
                user : action.payload.user,  //when requesting the updated data we get the user updated data as value from backend, received by payload properties and store into actions and stored in the user properties..
                isUpdated : true   //To know the data where updated...
            }
        },
        updateProfileFail(state, action){  //What if we doesn't get the data, so handling error this function was used...
            return {
                ...state,   //It will bring isAuthenticated as false, caz the user failed to login / initialSatge isAuthenticated is false...
                loading : false,
                error : action.payload  //It will send the error message to action...
            }
        },
        clearUpdateProfile(state, action) {  //Using for not to show the updated message pop up everytime click on update page, only have to show if user click the update button..
            return {
                ...state,
                isUpdated : false
            }
        },
        updatePasswordRequest(state, action){
            return {        //Once the page loads this function works and return the state as true...
                ...state,  //It will bring initialStage loading as true and isAuthenticated with this request....isAuthenticated stll remains as false,
                loading : true,
                isUpdated : false
            }
        },
        updatePasswordSuccess(state, action){  //It works once the data received and loading become false to stop the process....
            return {
                ...state,
                loading : false,
                isUpdated : true   //To know the data where updated...
            }
        },
        updatePasswordFail(state, action){  //What if we doesn't get the data, so handling error this function was used...
            return {
                ...state,   //It will bring isAuthenticated as false, caz the user failed to login / initialSatge isAuthenticated is false...
                loading : false,
                error : action.payload  //It will send the error message to action...
            }
        },
        forgotPasswordRequest(state, action){
            return {        //Once the page loads this function works and return the state as true...
                ...state,  //It will bring initialStage loading as true and isAuthenticated with this request....isAuthenticated stll remains as false,
                loading : true,
                message : null
            }
        },
        forgotPasswordSuccess(state, action){  //It works once the data received and loading become false to stop the process....
            return {
                ...state,
                loading : false,
                message : action.payload.message
            }
        },
        forgotPasswordFail(state, action){  //What if we doesn't get the data, so handling error this function was used...
            return {
                ...state,   //It will bring isAuthenticated as false, caz the user failed to login / initialSatge isAuthenticated is false...
                loading : false,
                error : action.payload  //It will send the error message to action...
            }
        },
        resetPasswordRequest(state, action){
            return {        //Once the page loads this function works and return the state as true...
                ...state,  //It will bring initialStage loading as true and isAuthenticated with this request....isAuthenticated stll remains as false,
                loading : true
            }
        },
        resetPasswordSuccess(state, action){  //It works once the data received and loading become false to stop the process....
            return {
                ...state,
                loading : false,
                isAuthenticated : true,   //If user logged in successfull isAuthenticated becomes true..
                user : action.payload.user   //Will load user data from payload requests..
            }
        },
        resetPasswordFail(state, action){  //What if we doesn't get the data, so handling error this function was used...
            return {
                ...state,   //It will bring isAuthenticated as false, caz the user failed to login / initialSatge isAuthenticated is false...
                loading : false,
                error : action.payload  //It will send the error message to action...
            }
        }

    }
});


//Action creator using redux/toolkit...
const {actions, reducer } = authSlice;  

//These functions will work as action creators...
export const { 
    loginRequest,
    loginSuccess, 
    loginFail, 
    clearError,
    RegisterRequest,
    RegisterSuccess,
    RegisterFail,
    loadUserRequest,
    loadUserSuccess,
    loadUserFail,
    logoutSuccess,
    logoutFail,
    updateProfileSuccess,
    updateProfileRequest,
    updateProfileFail,
    updatePasswordFail,
    updatePasswordRequest,
    updatePasswordSuccess,
    clearUpdateProfile,
    forgotPasswordRequest,
    forgotPasswordSuccess,
    forgotPasswordFail,
    resetPasswordRequest,
    resetPasswordSuccess,
    resetPasswordFail
} = actions;  //It will export action creators....

export default reducer;  //It will go inside combineReducers in store.js...