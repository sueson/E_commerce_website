import { createSlice } from "@reduxjs/toolkit";


//To Add cart items...
const orderSlice = createSlice({
    name: 'order',  //name of the slice..
    initialState: {   //To get cart items from local storage....
        orderDetail : {},  //User to view order details...
        userOrders : [],   //To view user all orders..
        adminOrders : [],  //To view admin orders...
        loading : false,
        isOrderDeleted : false,
        isOrderUpdated : false
    },
    reducers: {     //Send request to API when adding a cart item...
        createOrderRequests(state, action){  //To get the order info before creating orders...
            return {
                ...state,
                loading : true
            }
        },
        createOrderSuccess(state, action){  //To get the order info after success...
            return {
                ...state,
                loading : false,
                orderDetail : action.payload.order  //Stores the data from payload...
            }
        },
        createOrderFail(state, action) {  //If it's failed
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
        clearError(state, action){
            return{
                ...state,
                error : null
            }
        },
        userOrdersRequests(state, action){
            return{
                ...state,
                loading : true
            }
        },
        userOrdersSuccess(state, action){
            return{
                ...state,
                loading : false,
                userOrders : action.payload.orders   //Stores the data from payload...
            }
        },
        userOrdersFail(state, action){
            return{
                ...state,
                loading : false,
                error : action.payload
            }
        },

        orderDetailRequests(state, action){   //To get order details..
            return{
                ...state,
                loading : true
            }
        },
        orderDetailSuccess(state, action){
            return{
                ...state,
                loading : false,
                orderDetail : action.payload.order
            }
        },
        orderDetailFail(state, action){
            return{
                ...state,
                loading : false,
                error : action.payload
            }
        },

        adminOrdersRequests(state, action){
            return{
                ...state,
                loading : true
            }
        },
        adminOrdersSuccess(state, action){
            return{
                ...state,
                loading : false,
                adminOrders : action.payload.orders   //Stores the data from payload...
            }
        },
        adminOrdersFail(state, action){
            return{
                ...state,
                loading : false,
                error : action.payload
            }
        },

        deleteOrderRequests(state, action){
            return{
                ...state,
                loading : true
            }
        },
        deleteOrderSuccess(state, action){
            return{
                ...state,
                loading : false,
                isOrderDeleted : true
            }
        },
        deleteOrderFail(state, action){
            return{
                ...state,
                loading : false,
                error : action.payload
            }
        },

        updateOrderRequests(state, action){
            return{
                ...state,
                loading : true
            }
        },
        updateOrderSuccess(state, action){
            return{
                ...state,
                loading : false,
                isOrderUpdated : true
            }
        },
        updateOrderFail(state, action){
            return{
                ...state,
                loading : false,
                error : action.payload
            }
        },

        clearOrderDeleted(state, action) {
            return {
                ...state,
                isOrderDeleted : false
            }
        },
        clearOrderUpdated(state, action) {
            return {
                ...state,
                isOrderUpdated : false
            }
        }
    }
});


//Action creator using redux/toolkit...
const { actions, reducer } = orderSlice;

//These functions will work as action creators...
export const { 
    createOrderRequests,
    createOrderSuccess,
    createOrderFail,
    clearError,
    userOrdersRequests,
    userOrdersSuccess,
    userOrdersFail,
    orderDetailRequests,
    orderDetailSuccess,
    orderDetailFail,
    adminOrdersRequests,
    adminOrdersSuccess,
    adminOrdersFail,
    deleteOrderRequests,
    deleteOrderSuccess,
    deleteOrderFail,
    updateOrderRequests,
    updateOrderSuccess,
    updateOrderFail,
    clearOrderDeleted,
    clearOrderUpdated
 } = actions;    //It will export action creators....

export default reducer;   //It will go inside combineReducers in store.js...














