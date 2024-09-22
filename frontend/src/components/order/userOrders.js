import React, { Fragment, useEffect } from "react";
import MetaData from "../layout/MetaData";
import {MDBDataTable} from 'mdbreact'; 
import { useDispatch, useSelector } from "react-redux";
import { userOrders as userOrdersAction } from "../../actions/orderActions";
import { Link } from "react-router-dom";

export default function UserOrders(){
    const {userOrders = []} = useSelector(state => state.orderState);  //Default value is empty so giving empty array at initial..
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(userOrdersAction)
    },[])
    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: "Order ID",
                    field: 'id',
                    sort: "asc"
                },
                {
                    label: "Number of Items",
                    field: 'numOfItems',
                    sort: "asc"
                },
                {
                    label: "Amount",
                    field: 'amount',
                    sort: "asc"
                },
                {
                    label: "Status",
                    field: 'status',
                    sort: "asc"
                },
                {
                    label: "Actions",
                    field: 'actions',
                    sort: "asc"
                }
            ],
            rows : [

            ]
        }

        userOrders.forEach(userOrder => {
            data.rows.push({
                id:  userOrder._id,    //field name...
                numOfItems: userOrder.orderItems.length,
                amount: `$${userOrder.totalPrice}`,
                status: userOrder.OrderStatus && userOrder.OrderStatus.includes('Delivered') ?
                (<p style={{color: 'green'}}> {userOrder.OrderStatus} </p>):
                (<p style={{color: 'red'}}> {userOrder.OrderStatus} </p>),
                actions: <Link to={`/order/${userOrder._id}`} className="btn btn-primary" >
                    <i className='fa fa-eye'></i>
                </Link>
            })
        });


        return data;
    }
    return(
        <Fragment>
            <MetaData title = "My Orders" />
            <h1 className="mt-5">My Orders</h1>
            <MDBDataTable      //For creating a data in table as rows and columns...
                className="px-3"
                bordered
                striped
                hover
                data ={setOrders()}  //get from the setOrders function which return data...
            />
        </Fragment>
    )
}