import { createSlice } from "@reduxjs/toolkit";


//To Add cart items...
const cartSlice = createSlice({
    name: 'cart',  //name of the slice..
    initialState: {   //To get cart items from local storage....
        items: localStorage.getItem('cartItems')? JSON.parse(localStorage.getItem('cartItems')): [],
        loading: false,
        shippingInfo: localStorage.getItem('shippingInfo')? JSON.parse(localStorage.getItem('shippingInfo')): {}
    },
    reducers: {     //Send request to API when adding a cart item...
        addCartItemRequest(state, action){
            return {
                ...state,    //Once the page loads this function works and return the state as true...
                loading: true
            }
        },
        addCartItemSuccess(state, action){    //Checks the new item and existItem, if new item added to cart it will bring the previous added item along with it....
            const item = action.payload    //This is the new item adding payload...

            const isItemExist = state.items.find( i => i.product == item.product);   //Checks wheather the product id and item id are same..
            
            if(isItemExist) {
                state = {
                    ...state,
                    loading: false,
                }
            }else{
                state = {
                    items: [...state.items, item],
                    loading: false
                }
                
                localStorage.setItem('cartItems', JSON.stringify(state.items));   //Once done it updates in localStorage...
            }
            return state
            
        },
        increaseCartItemQty(state, action) {
            state.items = state.items.map(item => {  //Checks the product id and product from payload request id are same, if it increase the quantity..
                if(item.product == action.payload) {
                    item.quantity = item.quantity + 1
                }
                return item;
            })
            localStorage.setItem('cartItems', JSON.stringify(state.items));

        },
        decreaseCartItemQty(state, action) {
            state.items = state.items.map(item => {
                if(item.product == action.payload) {   //Checks the product id and product from payload request id are same, if it increase the quantity..
                    item.quantity = item.quantity - 1
                }
                return item;
            })
            localStorage.setItem('cartItems', JSON.stringify(state.items));   //Once done it updates in localStorage...

        },
        removeItemFromCart(state, action) {   //For delete items from cart...
            const filterItems = state.items.filter(item => {
                return item.product !== action.payload   //get product from cart.js
            })
            localStorage.setItem('cartItems', JSON.stringify(filterItems));    //Once done it updates in localStorage...
            return {
                ...state,
                items: filterItems
            }
        },
        saveShippingInfo(state, action) {
            localStorage.setItem('shippingInfo', JSON.stringify(action.payload));

            return {
                ...state,
                shippingInfo : action.payload
            }
        },
        orderCompleted(state, action) {   //Once payment completed all details have to remove from local storage...
            localStorage.removeItem('shippingInfo');
            localStorage.removeItem('cartItems');
            sessionStorage.removeItem('orderInfo');

            return {
                items: [],
                loading: false,
                shippingInfo: {}

            }
        }

    }
});


//Action creator using redux/toolkit...
const { actions, reducer } = cartSlice;

//These functions will work as action creators...
export const { 
    addCartItemRequest, 
    addCartItemSuccess,
    decreaseCartItemQty,
    increaseCartItemQty,
    removeItemFromCart,
    saveShippingInfo,
    orderCompleted
 } = actions;    //It will export action creators....

export default reducer;   //It will go inside combineReducers in store.js...










