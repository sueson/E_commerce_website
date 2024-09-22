import React, { Fragment, useEffect, useState } from "react";
import { createReview, getProduct } from "../../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../layout/Loader";
import {Carousel} from 'react-bootstrap';
import MetaData from "../layout/MetaData";
import { addCartItem } from "../../actions/cartActions";
import {Modal} from'react-bootstrap';
import { clearReviewSubmitted, clearError, clearProduct } from "../../slices/productSlice";
import {toast} from 'react-toastify';
import ProductReview from "./ProductReview";

export default function ProductDetail(){  
    //What if the page loads the id is not there it should show error so the default value for product is empty object to prevent error...
    const {product = {}, loading, isReviewSubmitted, error} = useSelector((state) => state.productState);

    const {user} = useSelector(state => state.authState);

    const dispatch = useDispatch();  //Have to use dispatch as hooks....

    const { id } = useParams();  //Using for getting ID from URLs...

    const [quantity, setQuantity] = useState(1);  //For increment / decrement quantity...initally it could be one..

    const increaseQuantity = () => {
        const count = document.querySelector('.count');
        //The stock would not be 0 and the count would not go more than stock, the count number should stay as no.of stocks available..
        if(product.stock == 0 || count.valueAsNumber >= product.stock) {  //If the stock is 0 then increse doesn't work..
            return;
        }
        //If not the number will increase.. 
        const qty = count.valueAsNumber + 1;
        setQuantity(qty);
    }

    const decreaseQuantity = () => {
        const count = document.querySelector('.count');
        //If the count value is 1 it should not decrease to 0 or -1, it should stop stays default value as 1...
        if(count.valueAsNumber == 1 ) {
            return;
        }
        //If not the number will decrease eg(stock has 5) then it would decrease.. 
        const qty = count.valueAsNumber - 1;
        setQuantity(qty);
    }

    //For react-bootstrap Modal...
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //For valuating stars...
    const [rating, setRating] = useState(1);

    //For comment...
    const[comment, setComment] = useState("");

    const reviewHandler = () => {
        const formData = new FormData();
        formData.append('rating', rating);
        formData.append('comment', comment);
        formData.append('productId', id);  //id from useParams to get product id...
        dispatch(createReview(formData));
    }

    useEffect(() => {
        if(isReviewSubmitted){
            handleClose();  //To close review form after clicking submit button....
            toast("Review Submitted Successfully", {
                type: 'success',
                position : "bottom-center",
                onOpen : () => { 
                    dispatch(clearReviewSubmitted());  //To change the isReviewSubmitted value to false...
                }
            })
        }

        if(error) {
            toast(error, {
                position : "bottom-center",
                type : 'error',
                onOpen: () => {  //It will change the error value to null once user logged in...
                    dispatch(clearError);
                }
            })
            return;
        }

        if(!product._id || isReviewSubmitted) {
            dispatch(getProduct(id));  //Passing the ID as argument to getProduct...
        }

        return () => {  //To bring back the product id once getting out of this function, orelse using the above function will change the all product id as same...
            dispatch(clearProduct())
        }


    },[dispatch, id, isReviewSubmitted, error]);
    return (
        <Fragment>
            {loading ? <Loader/> :
                            <Fragment>
                                <MetaData title = {product.name}/>
                                    <div className="row f-flex justify-content-around">
                                    <div className="col-12 col-lg-5 img-fluid" id="product_image">
                                        <Carousel pause="hover">
                                            {product.images && product.images.map(image => 
                                                <Carousel.Item key={image._id}>
                                                    <img className="d-block w-100" src={image.image} alt={product.name} height="500" width="500" />
                                                </Carousel.Item>
                                            )}
                                        </Carousel>
                                    </div>
                    
                                    <div className="col-12 col-lg-5 mt-5">
                                        <h3>{product.name}</h3>
                                        <p id="product_id">Product # {product._id}</p>
                    
                                        <hr/>
                    
                                        <div className="rating-outer">
                                            <div className="rating-inner" style={{width : `${product.ratings/5 *100}%`}}></div>
                                        </div>
                                        <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>
                    
                                        <hr/>
                    
                                        <p id="product_price">${product.price}</p>
                                        <div className="stockCounter d-inline">
                                            <span className="btn btn-danger minus" onClick={decreaseQuantity}>-</span>
                    
                                            <input type="number" className="form-control count d-inline" value={quantity} readOnly />
                    
                                            <span className="btn btn-primary plus" onClick={increaseQuantity}>+</span>
                                        </div>
                                        <button 
                                        type="button" id="cart_btn" 
                                        disabled={ product.stock == 0 ? true : false } 
                                        onClick={() => {
                                            dispatch(addCartItem(product._id, quantity))
                                            toast("Item Added Successfully", {  //To show alert message...
                                                type: 'success',
                                                position : "bottom-center"
                                            })
                                        }}
                                        className="btn btn-primary d-inline ml-4"
                                        >
                                            Add to Cart

                                        </button>
                    
                                        <hr/>
                    
                                        <p>Status: <span className={product.stock > 0 ? 'greenColor' : 'redColor'} id="stock_status">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></p>
                    
                                        <hr/>
                    
                                        <h4 className="mt-2">Description:</h4>
                                        <p>{product.description}</p>
                                        <hr/>
                                        <p id="product_seller mb-3">Sold by: <strong>{product.seller}</strong></p>
                                        
                                        {user ? 
                                        <button onClick={handleShow} id="review_btn" type="button" className="btn btn-primary mt-4" data-toggle="modal" data-target="#ratingModal">
                                                    Submit Your Review
                                        </button> :
                                        <div className="alert alert-danger mt-5"> Login to Post Review</div> 
                                        }
                                        
                                        <div className="row mt-2 mb-5">
                                            <div className="rating w-50">
                    
                                                {/* <div className="modal fade" id="ratingModal" tabIndex="-1" role="dialog" aria-labelledby="ratingModalLabel" aria-hidden="true">
                                                    <div className="modal-dialog" role="document">
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <h5 className="modal-title" id="ratingModalLabel">Submit Review</h5>
                                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                                    <span aria-hidden="true">&times;</span>
                                                                </button>
                                                            </div>
                                                            <div className="modal-body">
                    
                                                                <ul className="stars" >
                                                                    <li className="star"><i className="fa fa-star"></i></li>
                                                                    <li className="star"><i className="fa fa-star"></i></li>
                                                                    <li className="star"><i className="fa fa-star"></i></li>
                                                                    <li className="star"><i className="fa fa-star"></i></li>
                                                                    <li className="star"><i className="fa fa-star"></i></li>
                                                                </ul>
                    
                                                                <textarea name="review" id="review" className="form-control mt-3">
                    
                                                                </textarea>
                    
                                                                <button className="btn my-3 float-right review-btn px-4 text-white" data-dismiss="modal" aria-label="Close">Submit</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> */}


                                                {/* For review form Modal from react-bootstrap */}
                                                <Modal show={show} onHide={handleClose}>
                                                    <Modal.Header closeButton>
                                                    <Modal.Title>Submit Review</Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        <ul className="stars" >
                                                            {
                                                                [1,2,3,4,5].map(star => (
                                                                    <li
                                                                    value={star}
                                                                    onClick={() => setRating(star)}
                                                                    className = {`star ${star <= rating ? 'orange' : ''}`}
                                                                    onMouseOver={(e) => e.target.classList.add('yellow')}
                                                                    onMouseOut={(e) => e.target.classList.remove('yellow')}
                                                                    ><i className="fa fa-star"></i></li>
                                                                ))
                                                            }
                                                            
                                                        </ul>
                        
                                                            <textarea onChange={(e) => setComment(e.target.value)} name="review" id="review" className="form-control mt-3">
                        
                                                            </textarea>
                                                            <button disabled={loading} onClick={reviewHandler} aria-label="Close" className="btn my-3 float-right review-btn px-4 text-white">Submit</button>
                                                    </Modal.Body>
                                                </Modal>

                                            </div>
                                                
                                    </div>
                    
                                    </div>
                    
                                    </div>

                                    {/* To show review form */}...
                                    {
                                    product.reviews && product.reviews.length > 0 ?
                                    <ProductReview reviews={product.reviews}/> : null
                                    }
                        </Fragment>
            }
        </Fragment>
    )
}