import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name : 'user',
    initialState : {
        loading : false,
        user : {},  //To get single user
        users : [],  //To show multiple user lists
        isUserUpdated : false,  //To show alert...
        isUserDeleted : false,  //To show alert...
    },
    reducers : {
        //For multiple user list for admin to handle...
        usersRequest(state, action){
            return {
                ...state,
                loading : true
            }
        },
        usersSuccess(state, action){
            return {
                ...state,
                loading : false,
                users : action.payload.users
            }
        },
        usersFail(state, action){
            return {
                ...state,
                loading : false,
                error : action.payload
            }
        },

        //For single user for admin to handle...
        userRequest(state, action){
            return {
                ...state,
                loading : true
            }
        },
        userSuccess(state, action){
            return {
                ...state,
                loading : false,
                user : action.payload.user
            }
        },
        userFail(state, action){
            return {
                ...state,
                loading : false,
                error : action.payload
            }
        },

        //To delete...
        deleteUserRequest(state, action){
            return {
                ...state,
                loading : true
            }
        },
        deleteUserSuccess(state, action){
            return {
                ...state,
                loading : false,
                isUserDeleted : true
            }
        },
        deleteUserFail(state, action){
            return {
                ...state,
                loading : false,
                error : action.payload
            }
        },

        //To update user...
        updateUserRequest(state, action){
            return {
                ...state,
                loading : true
            }
        },
        updateUserSuccess(state, action){
            return {
                ...state,
                loading : false,
                isUserUpdated : true
            }
        },
        updateUserFail(state, action){
            return {
                ...state,
                loading : false,
                error : action.payload
            }
        },

        clearUserDeleted(state, action){
            return {
                ...state,
                isUserDeleted : false
            }
        },
        clearUserUpdated(state, action){
            return {
                ...state,
                isUserUpdated : false
            }
        },

        clearError(state, action){
            return {
                ...state,
                error : null
            }
        }
    }
});

//Action creator using redux/toolkit...
const {actions, reducer} = userSlice;

//These functions will work as action creators...
export const {
    usersRequest,
    usersSuccess,
    usersFail,
    userRequest,
    userSuccess,
    userFail,
    deleteUserRequest,
    deleteUserSuccess,
    deleteUserFail,
    updateUserRequest,
    updateUserSuccess,
    updateUserFail,
    clearUserDeleted,
    clearUserUpdated,
    clearError
} = actions;

//It will go inside combineReducers in store.js...
export default reducer;