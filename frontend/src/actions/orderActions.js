import { adminOrdersFail, adminOrdersRequests, adminOrdersSuccess, createOrderFail, 
        createOrderRequests, 
        createOrderSuccess, 
        deleteOrderFail, 
        deleteOrderRequests, 
        deleteOrderSuccess, 
        orderDetailFail, 
        orderDetailRequests, 
        orderDetailSuccess, 
        updateOrderFail, 
        updateOrderRequests, 
        updateOrderSuccess, 
        userOrdersFail, 
        userOrdersRequests, 
        userOrdersSuccess } from "../slices/orderSlice"
import axios from "axios"

//To create orders...
export const createOrder = order =>  async(dispatch) => {  //order is used to get data...
    try {
        dispatch(createOrderRequests());
        const {data} = await axios.post(`/api/v1/order/new`, order);
        dispatch(createOrderSuccess(data));
    }
    catch(error){
        dispatch(createOrderFail(error.response.data.message));
    }
}

//To get user Orders...
export const userOrders  = async(dispatch) => {  //order is used to get data...
    try {
        dispatch(userOrdersRequests());
        const {data} = await axios.get(`/api/v1/myorders`);
        dispatch(userOrdersSuccess(data));
    }
    catch(error){
        dispatch(userOrdersFail(error.response.data.message));
    }
}

//To get order Details...
export const orderDetail = id =>  async(dispatch) => {  //order is used to get data...
    try {
        dispatch(orderDetailRequests());
        const {data} = await axios.get(`/api/v1/order/${id}`);
        dispatch(orderDetailSuccess(data));
    }
    catch(error){
        dispatch(orderDetailFail(error.response.data.message));
    }
}

//To get admin orders - /api/v1/admin/orders...
export const adminOrders  = async(dispatch) => {  //order is used to get data...
    try {
        dispatch(adminOrdersRequests());
        const {data} = await axios.get(`/api/v1/admin/orders`);
        dispatch(adminOrdersSuccess(data));
    }
    catch(error){
        dispatch(adminOrdersFail(error.response.data.message));
    }
}

//To delete admin order
export const deleteOrder  = id =>  async(dispatch) => {  //order is used to get data...
    try {
        dispatch(deleteOrderRequests());
        await axios.delete(`/api/v1/admin/order/${id}`);
        dispatch(deleteOrderSuccess());
    }
    catch(error){
        dispatch(deleteOrderFail(error.response.data.message));
    }
} 


//To update admin order
export const updateOrder  = (id, orderData) =>  async(dispatch) => {  //order is used to get data...
    try {
        dispatch(updateOrderRequests());
        const { data } = await axios.put(`/api/v1/admin/order/${id}`, orderData);
        dispatch(updateOrderSuccess(data));
    }
    catch(error){
        dispatch(updateOrderFail(error.response.data.message));
    }
} 

