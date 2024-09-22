import { createSlice } from "@reduxjs/toolkit";

//To get single product...
const productSlice = createSlice({
    name : 'product',  //name of the slice..
    initialState : {    //At the time of refreshing page, API requests send so, the initial could be....
        loading : false,
        product : {},   //Giving this at initial State it would pass {id} as dynamic, so it will not remains undefined...
        isReviewSubmitted : false,  //For review...
        isProductCreated : false,  //For checking that new product is created by admin...
        isProductDeleted : false,  //For checking wheather the product is deleted or not...
        isProductUpdated : false,  //For admin to edit and update...
        isReviewDeleted : false,  //For admin to get alert message...
        reviews : []  //To get reviews data...
     },
    reducers : {  //After loading reducers will do what happens next....
        productRequest(state, action){
            return {        //Once the page loads this function works and return the state as true...
                ...state,
                loading : true
            }
        },
        productSuccess(state, action){  //It works once the data received and loading become false to stop the process....
            return {
                ...state,
                loading : false,
                product : action.payload.product  //when requesting the data we get particular product as value from backend (get product/:id) received by payload properties and store into actions and stored in the products properties..
            }
        },
        productFail(state, action){  //What if we doesn't get the products, so handling error this function was used...
            return {
                ...state,
                loading : false,
                error : action.payload  //It will send the error message to action...
            }
        },
        createReviewRequest(state, action){
            return{
                ...state,
                loading : true
            }
        },
        createReviewSuccess(state, action){
            return{
                ...state,
                loading : false,
                isReviewSubmitted : true
            }
        },
        createReviewFail(state, action){
            return{
                ...state,
                loading : false,
                error : action.payload
            }
        },
        clearReviewSubmitted(state, action){  //For to clear isReviewSubmitted, have to check for submit new review, so the isReviewsubmitted should be false as default..
            return{
                ...state,
                isReviewSubmitted : false
            }
        },
        clearError(state, action){
            return{
                ...state,
                error : null
            }
        },
        clearProduct(state, action){  //It will clear the previous product id which stores by clcking the product and store new product id...
            return{
                ...state,
                product : {}
            }
        },
        //For creating new product by admin...
        newProductRequest(state, action){
            return{
                ...state,
                loading : true
            }
        },
        newProductSuccess(state, action){
            return{
                ...state,
                loading : false,
                product : action.payload.product,
                isProductCreated : true
            }
        },
        newProductFail(state, action){
            return{
                ...state,
                loading : false,
                error : action.payload,
                isProductCreated : false
            }
        },
        clearProductCreated(state, action){  //For showing the alert message to once after showing success message...
            return{
                ...state,
                isProductCreated : false
            }
        },
        deleteProductRequest(state, action){
            return{
                ...state,
                loading : true
            }
        },
        deleteProductSuccess(state, action){
            return{
                ...state,
                loading : false,
                isProductDeleted : true
            }
        },
        deleteProductFail(state, action){
            return{
                ...state,
                loading : false,
                error : action.payload
            }
        },
        clearProductDeleted(state, action){  //For showing the alert message to once after showing success message...
            return{
                ...state,
                isProductCreated : false
            }
        },
        updateProductRequest(state, action){
            return{
                ...state,
                loading : true
            }
        },
        updateProductSuccess(state, action){
            return{
                ...state,
                loading : false,
                product : action.payload.product,
                isProductUpdated : true
            }
        },
        updateProductFail(state, action){
            return{
                ...state,
                loading : false,
                error : action.payload
            }
        },
        clearProductUpdated(state, action){  //For showing the alert message to once after showing success message...
            return{
                ...state,
                isProductUpdated : false
            }
        },

        //For reviews...
        reviewsRequest(state, action){
            return {
                ...state,
                loading : true
            }
        },
        reviewsSuccess(state, action){
            return {
                ...state,
                loading : false,
                reviews : action.payload.reviews
            }
        },
        reviewsFail(state, action){
            return {
                ...state,
                loading : false,
                error : action.payload
            }
        },

        //To delete reviews...
        deleteReviewRequest(state, action){
            return{
                ...state,
                loading : true
            }
        },
        deleteReviewSuccess(state, action){
            return{
                ...state,
                loading : false,
                isReviewDeleted : true
            }
        },
        deleteReviewFail(state, action){
            return{
                ...state,
                loading : false,
                error : action.payload
            }
        },

        clearReviewDeleted(state, action){
            return {
                ...state,
                isReviewDeleted : false
            }
        }
    }
});


//Action creator using redux/toolkit...
const {actions, reducer } = productSlice;  

//These functions will work as action creators...
export const { 
    productRequest, 
    productSuccess, 
    productFail,
    createReviewRequest,
    createReviewSuccess,
    createReviewFail,
    clearReviewSubmitted,
    newProductRequest,
    newProductSuccess,
    newProductFail,
    clearProductCreated,
    deleteProductRequest,
    deleteProductSuccess,
    deleteProductFail,
    clearProductDeleted,
    clearProduct,
    clearError,
    updateProductRequest,
    updateProductSuccess,
    updateProductFail,
    clearProductUpdated,
    reviewsRequest,
    reviewsSuccess,
    reviewsFail,
    deleteReviewRequest,
    deleteReviewSuccess,
    deleteReviewFail,
    clearReviewDeleted
} = actions;  //It will export action creators....

export default reducer;  //It will go inside combineReducers in store.js...