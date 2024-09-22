import axios from 'axios';
import { adminProductsFail, adminProductsRequest, adminProductsSuccess, productsFail, productsRequest, productsSuccess } from '../slices/productsSlice';  //For all products..
import { createReviewFail, 
    createReviewRequest, 
    createReviewSuccess, 
    deleteProductFail, 
    deleteProductRequest, 
    deleteProductSuccess, 
    deleteReviewFail, 
    deleteReviewRequest, 
    deleteReviewSuccess, 
    newProductFail, 
    newProductRequest, 
    newProductSuccess, 
    productFail, 
    productRequest, 
    productSuccess, 
    reviewsFail, 
    reviewsRequest, 
    reviewsSuccess, 
    updateProductFail, 
    updateProductRequest,
    updateProductSuccess} from '../slices/productSlice';  //For particular product...

//To get all the products - /api/v1/products...
export const getProducts = (keyword, price, category, ratings, currentPage) =>  async (dispatch) => {  //without dispatch the actions cannot succeed...also dispatch is a hook so it should call inside home components...
                                //In here it receives the currentPage and set it inside axios, which loads the page Url, when click the page link...
    try {
        dispatch(productsRequest());  //have to pass the action creator inside dispatch to get succeed....it will change the loading default to true...

        let link = `/api/v1/products?page=${currentPage}`; //In here page pass as dynamic, so it loads the next pages...

        if(keyword) {
            link += `&keyword=${keyword}`;   //If loading home page there is a keyword it should load this, if not it remains Null which pass inside Home.js for keyword value..
        }

        if(price) {
            link += `&price[gte]=${price[0]}&price[lte]=${price[1]}`  //If loading search Products there is a price range, it should be null at home page loads, and when used to search products and using rc-slider it should change the url and filter the product price...
        }

        if(category) {
            link += `&category=${category}`  //If loading search Products there is a category, it should be null at home page loads, and when used to search products by selecting category it should change the url based on categories...
        }

        if(ratings) {
            link += `&ratings=${ratings}`  //If loading search Products there is a ratings, it should be null at home page loads, and when used to search products by ratings it should change the url based on ratings...
        }

        const { data } = await axios.get(link);

        dispatch(productsSuccess(data));  //It will pass the products (data) to actions, so the loading become false and stops...also products data will receive successfully...
    }
    catch(error) {  //If the data faces any error...
        //Handle error..
        dispatch(productsFail(error.response.data.message));  //In axios we get response from error so this format will send error successfully...
                                    //response(400).data(json.data) and it's message...
    }
}




//To get particular product - /api/v1/product...
export const getProduct = id =>  async (dispatch) => {  //without dispatch the actions cannot succeed...also dispatch is a hook so it should call inside home components...
                            //Receives id from ProductDetail.js as argument...
    try {
        dispatch(productRequest());  //have to pass the action creator inside dispatch to get succeed....it will change the loading default to true...
        const { data } = await axios.get(`/api/v1/product/${id}`);  //will get id from getProduct = id ..
        dispatch(productSuccess(data));  //It will pass the particular product (data) to actions, so the loading become false and stops...also particular product data will receive successfully...
    }
    catch(error) {  //If the data faces any error...
        //Handle error..
        dispatch(productFail(error.response.data.message));  //In axios we get response from error so this format will send error successfully...
                                    //response(400).data(json.data) and it's message...
    }
}


//For product review - /api/v1/review...
export const createReview =  reviewData => async(dispatch) => {
    try {
        dispatch(createReviewRequest());
        //For sending JSON data...
        const config = {
            headers : {
                'Content-type' : 'application/json'
            }
        }
        
        const{data} = await axios.put(`/api/v1/review`, reviewData, config);
        dispatch(createReviewSuccess(data));
    }
    catch(error) {
        dispatch(createReviewFail(error.response.data.message));
    }
}


//For Admin...
//To get all products - /api/v1/admin/products...
export const getAdminProducts = async(dispatch) => {
    try {
        dispatch(adminProductsRequest());  //have to pass the action creator inside dispatch to get succeed....it will change the loading default to true... 

        const { data } = await axios.get('/api/v1/admin/products');

        dispatch(adminProductsSuccess(data));  //It will pass the products (data) to actions, so the loading become false and stops...also products data will receive successfully...
    }
    catch(error) {  //If the data faces any error...
        //Handle error..
        dispatch(adminProductsFail(error.response.data.message));  //In axios we get response from error so this format will send error successfully...
                                    //response(400).data(json.data) and it's message...
    }
}

//To create new product - /api/v1/admin/product/new...
export const createNewProduct = productData => async(dispatch) => {
    try {
        dispatch(newProductRequest());
        
        const { data } = await axios.post(`/api/v1/admin/product/new`, productData);

        dispatch(newProductSuccess(data));
    }
    catch(error) {
        dispatch(newProductFail(error.response.data.message));
    }
}

//To delete Product - /api/v1/admin/product/:id...
export const deleteProduct = id => async(dispatch) => {
    try {
        dispatch(deleteProductRequest());
        
        await axios.delete(`/api/v1/admin/product/${id}`);

        dispatch(deleteProductSuccess());
    }
    catch(error) {
        dispatch(deleteProductFail(error.response.data.message));
    }
}

//For updating product from admin - /api/v1/product/:id
export const updateProduct  =  (id, productData) => async (dispatch) => {

    try {  
        dispatch(updateProductRequest()) 
        const { data }  =  await axios.put(`/api/v1/admin/product/${id}`, productData);
        dispatch(updateProductSuccess(data))
    } catch (error) {
        //handle error
        dispatch(updateProductFail(error.response.data.message))
    }
    
}


//For admin to get reviews - /api/v1/admin/reviews...
export const getReviews = id => async (dispatch) => {  
    try {
        dispatch(reviewsRequest()); 

        const { data } = await axios.get(`/api/v1/admin/reviews`,{params : {id}});  //params for to get query parameter for specific product reviews...

        dispatch(reviewsSuccess(data));
    }
    catch(error) {  //If the data faces any error...
    //Handle error..
    dispatch(reviewsFail(error.response.data.message));  //In axios we get response from error so this format will send error successfully...
        //response(400).data(json.data) and it's message...
    }
}


//For admin to delete review - /api/v1/admin/review/:id...
export const deleteReviews =  (productId, id) => async (dispatch) => {  
    try {
        dispatch(deleteReviewRequest()); 

        await axios.delete(`/api/v1/admin/review`,{params : {productId, id}});  //params for to get query parameter for specific product reviews...

        dispatch(deleteReviewSuccess());
    }
    catch(error) {  //If the data faces any error...
    //Handle error..
    dispatch(deleteReviewFail(error.response.data.message));  //In axios we get response from error so this format will send error successfully...
        //response(400).data(json.data) and it's message...
    }
}