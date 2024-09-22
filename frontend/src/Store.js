import { combineReducers, configureStore} from '@reduxjs/toolkit'; 
import { thunk } from 'redux-thunk';
import productsReducer from './slices/productsSlice';  //named the reducer as productsReducer....
import productReducer from './slices/productSlice';  //named the reducer as productReducer..
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';

const reducer = combineReducers({
    productsState : productsReducer,  //It will give all the products..
    productState : productReducer,     //Only particular product...
    authState : authReducer,   //To handle authentication..
    cartState : cartReducer,  //To handle cartItems....
    orderState : orderReducer, //To handle user orders...
    userState : userReducer  //For admin to handle users...
});

const Store = configureStore({
    reducer,   //reducer is ues for handling or changing the states... reducer as key as well reducer as value so just reducer is fine....
    middleware : () =>  [thunk]  //used for handling api calling using async for handling actions..
});

export default Store;