import React, { Fragment, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from '../layout/Loader';
import {MDBDataTable} from 'mdbreact';
import {toast} from 'react-toastify';
import Sidebar from "./Sidebar";
import { clearError, clearReviewDeleted } from "../../slices/productSlice";
import { deleteReviews, getReviews } from "../../actions/productActions";

export default function ReviewList(){
    const { reviews = [], loading = true, error, isReviewDeleted } = useSelector(state => state.productState);

    const [productId, setProductId] = useState('');  //For to send productId to getReviews to access product details by submitting the form under review List title...

    const dispatch = useDispatch();

    const setReviews = () => {
        const data = {
            columns : [
                {
                    label : 'ID',
                    field : 'id',
                    sort : 'asc'
                },
                {
                    label : 'Rating',
                    field : 'rating',
                    sort : 'asc'
                },
                {
                    label : 'User',
                    field : 'user',
                    sort : 'asc'
                },
                {
                    label : 'Comment',
                    field : 'comment',
                    sort : 'asc'
                },
                {
                    label : 'Action',
                    field : 'action',
                    sort : 'asc'
                }

            ],
            rows : []
        }

        reviews.forEach( review => {
            data.rows.push({
                id : review._id,
                rating : review.rating,
                user : review.user.name,
                comment : review.comment,
                action : (
                    <Fragment>
                        <Button onClick={e => deleteHandler(e, review._id)} className="btn btn-danger py-1 px-2 ml-2">
                            <i className="fa fa-trash"></i>
                        </Button>
                    </Fragment>
                )
            })
        })
        return data;
    }

    const deleteHandler = (e, id) => {
        e.target.disabled = true;
        dispatch(deleteReviews(productId, id));
    }

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(getReviews(productId));  //Only get productId by clicking the search button used to give product id, so putting getReviews inside subitHandler...
    }

    useEffect(() => {
        if(error) {
            toast(error, {
                position : "bottom-center",
                type : 'error',
                onOpen: () => {  
                    dispatch(clearError()); 
                }
            })
            return 
        }

        if(isReviewDeleted) {
            toast("Review Deleted Successfully", {
                type: 'success',
                position : "bottom-center",
                onOpen : () => {  //Using for not to show the update pop up message more than once when success message appears, only show when user click the delete icon..
                    dispatch(clearReviewDeleted());
                }
            })
            dispatch(getReviews(productId));  //It instantly removes once deleted if this line is not it only removes once page refreshes...
            return;
        }

    },[dispatch, error, isReviewDeleted]);  



    return(
        <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar/>
                </div>
                <div className="col-12 col-md-10">
                <h1 className="my-4">Review List</h1>
                <div className="row justify-content-center mt-5">
                    <div className="col-5">
                        <form onSubmit={submitHandler}>
                            <div className="form-group">
                                <label>Product Id</label>
                                <input 
                                type = 'text'
                                onChange={e => setProductId(e.target.value)}
                                value = {productId}
                                className="form-control"
                                />
                            </div>
                            <button type="submit" disabled={loading} className="btn btn-primary btn-block py-2">
                                Search
                            </button>
                        </form>
                    </div>
                </div>
                <Fragment>
                    {loading ? <Loader/> :
                    <MDBDataTable 
                        data = {setReviews()}
                        bordered
                        striped
                        hover
                        className="px-3"
                    />
                    }
                </Fragment>
                </div>
            </div>
    )
}