import { createSlice } from "@reduxjs/toolkit";

//To get all the products...
const productsSlice = createSlice({
    name : 'products',  //name of the slice..
    initialState : {    //At the time of refreshing page, API requests send so, the initial could be....
        loading : false
    },
    reducers : {  //After loading reducers will do what happens next....
        productsRequest(state, action){
            return {        //Once the page loads this function works and return the state as true...
                loading : true
            }
        },
        productsSuccess(state, action){  //It works once the data received and loading become false to stop the process....
            return {
                loading : false,
                products : action.payload.products,  //when requesting the data we get products as value from backend (get all products) received by payload properties and store into actions and stored in the products properties..
                productsCount : action.payload.count,   //For Pagination get count value from API data...It will show the total product count...
                resPerPage : action.payload.resPerPage   //It will show the data load in single page count...
            }
        },
        productsFail(state, action){  //What if we doesn't get the products, so handling error this function was used...
            return {
                loading : false,
                error : action.payload  //It will send the error message to action...
            }
        },
        //For Admin....
        adminProductsRequest(state, action){
            return{
                loading : true
            }
        },
        adminProductsSuccess(state, action){
            return{
                loading : false,
                products : action.payload.products
            }
        },
        adminProductsFail(state, action){
            return{
                loading : false,
                error : action.payload
            }
        },
        clearError(state, action){
            return{
                ...state,
                error : null
            }
        }
    }
});


//Action creator using redux/toolkit...
const {actions, reducer } = productsSlice;  

//These functions will work as action creators...
export const { productsRequest, productsSuccess, productsFail, adminProductsFail, adminProductsRequest, adminProductsSuccess, clearError} = actions;  //It will export action creators....

export default reducer;  //It will go inside combineReducers in store.js...