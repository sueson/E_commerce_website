import { useElements, useStripe } from '@stripe/react-stripe-js';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { validateShipping } from './Shipping';
import axios from 'axios';
import { toast } from 'react-toastify';
import { orderCompleted } from '../../slices/cartSlice';
import { createOrder } from '../../actions/orderActions';
import { clearError as clearOrderError } from '../../slices/orderSlice';

export default function Payment(){

    const stripe = useStripe();   //used for frontend functions....
    const elements = useElements()   //used for having information of card, and other details to handle...

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo')) || {}  //Get from sessionStorage (orderInfo)..which is from confirm order.js..

    const {user} = useSelector(state => state.authState);   //To get user information....

    const {items:cartItems, shippingInfo } = useSelector(state => state.cartState);  //To get cart items...

    const {error:orderError} = useSelector(state => state.orderState);
                //Naming it as orderError, because there are so many named error names, to be not confused naming it as orderError...

    //Payment Data...
    const paymentData = {
            //Intially comes with big number eg: (0.2232424324) so using math and rounding off..
        amount : Math.round( orderInfo.totalPrice * 100),   //sendig cents, Which makes 1 dollar
        shipping : {
            name : user.name,
            address : {
                city : shippingInfo.city,
                postal_code : shippingInfo.postalCode,
                country : shippingInfo.country,
                state : shippingInfo.state,
                line1 : shippingInfo.address   //for address, give in line1(payment process)...
            },
            phone : shippingInfo.phoneNo 
        }
    }

    //Order Data..
    const order = {
        orderItems : cartItems,
        shippingInfo
    }

    if(orderInfo) {
        order.itemsPrice = orderInfo.itemsPrice
        order.shippingPrice = orderInfo.shippingPrice
        order.taxPrice = orderInfo.taxPrice
        order.totalPrice = orderInfo.totalPrice
    }

    useEffect(() => {   //To check before payment compoent, shipping info must be there...
        validateShipping(shippingInfo, navigate);   //From shipping component..
        
        if(orderError) {
            toast(orderError, {
                position : "bottom-center",
                type : 'error',
                onOpen: () => {  //It will change the error value to null once user logged in...
                    dispatch(clearOrderError());
                }
            })
        }
    },[])

    const submitHandler = async (e) => {  //Fro payment submission...
        e.preventDefault();
        document.querySelector('#pay_btn').disabled = true  //Setting for if user click the button without entering details..
        try {
            const {data} = await axios.post('/api/v1/payment/process', paymentData);
            const clientSecret = data.client_secret  //Get from backend...
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method : {
                    card : elements.getElement(CardNumberElement),  //Stores the value of input which enter by user to card...
                    billing_details : {
                        name : user.name,
                        email : user.email
                    }
                }
            })

            if(result.error) {  //If payment faced error...
                toast(result.error.message, {
                    type : 'error',
                    position : "bottom-center"
                })
                document.querySelector('#pay_btn').disabled = false  //Setting for if the user click the button after entering details...
            }
            else {
                if((await result).paymentIntent.status === 'succeeded') {
                    toast('Payment Success!', {
                        type : 'success',
                        position : "bottom-center"
                    })
                    order.paymentInfo = {
                        id : result.paymentIntent.id,
                        status : result.paymentIntent.status
                    }
                    dispatch(orderCompleted())   //From cartSlice, for once payment completed it removes every details from local & session storage...
                    dispatch(createOrder(order));  //For to creating a order..
                    
                    navigate("/order/success");
                }else {
                    toast('Please try again', {
                        type : 'warning',
                        position : "bottom-center"
                    })
                }
            }
        }
        catch(error) {
            toast.error('Something went wrong. Please try again later.', {
                position: "bottom-center",
            });
            document.querySelector('#pay_btn').disabled = false;
        }

    }

    return(
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form onSubmit={submitHandler} className="shadow-lg">
                    <h1 className="mb-4">Card Info</h1>
                    <div className="form-group">
                    <label htmlFor="card_num_field">Card Number</label>
                    <CardNumberElement
                        type="text"
                        id="card_num_field"
                        className="form-control"
                    />
                    </div>
                    
                    <div className="form-group">
                    <label htmlFor="card_exp_field">Card Expiry</label>
                    <CardExpiryElement
                        type="text"
                        id="card_exp_field"
                        className="form-control"
                    />
                    </div>
                    
                    <div className="form-group">
                    <label htmlFor="card_cvc_field">Card CVC</label>
                    <CardCvcElement
                        type="text"
                        id="card_cvc_field"
                        className="form-control"
                    />
                    </div>
        
                
                    <button
                    id="pay_btn"
                    type="submit"
                    className="btn btn-block py-3"
                    >
                    Pay {`$${orderInfo && orderInfo.totalPrice}`}
                    </button>
        
                </form>
            </div>
        </div>
    )
}