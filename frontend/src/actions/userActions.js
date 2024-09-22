import { 
    RegisterFail, 
    RegisterRequest, 
    RegisterSuccess, 
    clearError, 
    forgotPasswordFail, 
    forgotPasswordRequest, 
    forgotPasswordSuccess, 
    loadUserFail, 
    loadUserRequest, 
    loadUserSuccess, 
    loginFail, 
    loginRequest, 
    loginSuccess, 
    logoutFail, 
    logoutSuccess,
    resetPasswordFail,
    resetPasswordRequest,
    resetPasswordSuccess,
    updatePasswordFail,
    updatePasswordRequest,
    updatePasswordSuccess,
    updateProfileFail,
    updateProfileRequest,
    updateProfileSuccess
} from "../slices/authSlice"

import axios from "axios";
import { deleteUserFail, 
    deleteUserRequest, 
    deleteUserSuccess, 
    updateUserFail, 
    updateUserRequest, 
    updateUserSuccess, 
    userFail, 
    userRequest, 
    userSuccess, 
    usersFail, 
    usersRequest, 
    usersSuccess } from "../slices/userSlice";


//Login actions...
export const login = (email, password) => async(dispatch) => {
    try {
        dispatch(loginRequest());   //have to pass the action creator inside dispatch to get succeed....it will change the loading default to true...
        const { data } = await axios.post(`/api/v1/login`, {email, password});  //From this API requests will get email and password using await, have to store inside data variable..

        dispatch(loginSuccess(data));  //Pass data inside here, it will do the remaining process..
    }
    catch(error) {  //If faced an error...
        dispatch(loginFail(error.response.data.message));
    }
}

export const clearAuthError = (dispatch) => {
    dispatch(clearError());
}


//Register actions...
export const register = (userData) => async(dispatch) => {   //Get formData from userData
    try {
        dispatch(RegisterRequest());   //have to pass the action creator inside dispatch to get succeed....it will change the loading default to true...

        const config = {
            headers : {  //Used for uploading files / Documents...(user profile avatar / form-submission)....
                'Content-type' : 'multipart/form-data'
            }
        }
        const { data } = await axios.post(`/api/v1/register`, userData, config);  //From this API requests will get data of users using await, have to store inside data variable..

        dispatch(RegisterSuccess(data));  //Pass data inside here, it will do the remaining process..
    }
    catch(error) {  //If faced an error...
        dispatch(RegisterFail(error.response.data.message));
    }
}

//To load user Data...
export const loadUser = async(dispatch) => {
    try {
        dispatch(loadUserRequest());   //have to pass the action creator inside dispatch to get succeed....it will change the loading default to true...

        const { data } = await axios.get(`/api/v1/myprofile`);

        dispatch(loadUserSuccess(data));  //Pass data inside here, it will do the remaining process..
    }
    catch(error) {  //If faced an error...
        dispatch(loadUserFail(error.response.data.message));
    }
}


//To logOut user...
export const logout = async(dispatch) => {
    try {

        await axios.get(`/api/v1/logout`);

        dispatch(logoutSuccess()); 
    }
    catch(error) {  //If faced an error...
        dispatch(logoutFail(error.response.data.message));
    }
}

//Update User Profile Data..
export const updateProfile = (userData) => async(dispatch) => {   //Get formData from userData
    try {
        dispatch(updateProfileRequest());   //have to pass the action creator inside dispatch to get succeed....it will change the loading default to true...

        const config = {
            headers : {  //Used for uploading files / Documents...(user profile avatar / form-submission)....
                'Content-type' : 'multipart/form-data'
            }
        }
        const { data } = await axios.put(`/api/v1/update`, userData, config);  //From this API requests will get data of users using await, have to store inside data variable..

        dispatch(updateProfileSuccess(data));  //Pass data inside here, it will do the remaining process..
    }
    catch(error) {  //If faced an error...
        dispatch(updateProfileFail(error.response.data.message));
    }
}


//Update password..
export const updatePassword = (formData) => async(dispatch) => {   //Will get fromData from UpdatePassword.js component as argument(old password, new password)..
    try {
        dispatch(updatePasswordRequest());   //have to pass the action creator inside dispatch to get succeed....it will change the loading default to true...

        const config = {
            headers : {  //Used for changing multipart form  to json text data..
                'Content-type' : 'application/json'
            }
        };

        await axios.put(`/api/v1/password/change`, formData, config);  //Sends Api formData request to update password..

        dispatch(updatePasswordSuccess()); 
    }
    catch(error) {  //If faced an error...
        dispatch(updatePasswordFail(error.response.data.message));
    }
}


//Forgot password..
export const forgotPassword = (formData) => async(dispatch) => {   //Will get fromData from UpdatePassword.js component as argument(old password, new password)..
    try {
        dispatch(forgotPasswordRequest());   //have to pass the action creator inside dispatch to get succeed....it will change the loading default to true...

        const config = {
            headers : {  //Used for changing multipart form  to json text data..
                'Content-type' : 'application/json'
            }
        };

        const {data} = await axios.post(`/api/v1/password/forgot`, formData, config);  // will get data and Sends Api formData request to update password..

        dispatch(forgotPasswordSuccess(data)); 
    }
    catch(error) {  //If faced an error...
        dispatch(forgotPasswordFail(error.response.data.message)); 
    }
}


//Reset password..
export const resetPassword = (formData, token) => async(dispatch) => {   //Will get fromData from UpdatePassword.js component as argument(old password, new password)..
    try {
        dispatch(resetPasswordRequest());   //have to pass the action creator inside dispatch to get succeed....it will change the loading default to true...

        const config = {
            headers : {  //Used for changing multipart form  to json text data..
                'Content-type' : 'application/json'
            }
        };

        const {data} = await axios.post(`/api/v1/password/reset/${token}`, formData, config);  // will get data and dynamic Url from mail as token and Sends Api formData request to update password..

        dispatch(resetPasswordSuccess(data)); 
    }
    catch(error) {  //If faced an error...
        dispatch(resetPasswordFail(error.response.data.message)); 
    }
}


//For admin to handle users - /api/v1/admin/users...
export const getUsers = async(dispatch) => {
    try {
        dispatch(usersRequest());   //have to pass the action creator inside dispatch to get succeed....it will change the loading default to true...

        const { data } = await axios.get(`/api/v1/admin/users`);

        dispatch(usersSuccess(data));  //Pass data inside here, it will do the remaining process..
    }
    catch(error) {  //If faced an error...
        dispatch(usersFail(error.response.data.message));
    }
}

//For admin to handle single user - /api/v1/admin/user/:id
export const getUser = id => async(dispatch) => {
    try {
        dispatch(userRequest());   //have to pass the action creator inside dispatch to get succeed....it will change the loading default to true...

        const { data } = await axios.get(`/api/v1/admin/user/${id}`);

        dispatch(userSuccess(data));  //Pass data inside here, it will do the remaining process..
    }
    catch(error) {  //If faced an error...
        dispatch(userFail(error.response.data.message));
    }
}


//For admin to handle delete user - 
export const deleteUser = id => async(dispatch) => {
    try {
        dispatch(deleteUserRequest());   //have to pass the action creator inside dispatch to get succeed....it will change the loading default to true...

        await axios.delete(`/api/v1/admin/user/${id}`);

        dispatch(deleteUserSuccess());  
    }
    catch(error) {  //If faced an error...
        dispatch(deleteUserFail(error.response.data.message));
    }
}

//For admin to update user - /api/v1/admin/user/:id
export const updateUser = (id, formData) => async(dispatch) => {   //Will get fromData from UpdateUser.js component as argument...
    try {
        dispatch(updateUserRequest());   //have to pass the action creator inside dispatch to get succeed....it will change the loading default to true...

        const config = {
            headers : {  //Used for changing multipart form  to json text data..
                'Content-type' : 'application/json'
            }
        };

        await axios.put(`/api/v1/admin/user/${id}`, formData, config);  //Sends Api formData request to update user...

        dispatch(updateUserSuccess()); 
    }
    catch(error) {  //If faced an error...
        dispatch(updateUserFail(error.response.data.message));
    }
}