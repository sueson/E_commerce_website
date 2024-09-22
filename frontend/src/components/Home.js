import React, { Fragment, useEffect, useState } from "react";
import MetaData from "./layout/MetaData";
import { getProducts } from "../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./layout/Loader";
import Product from "./product/Product";
import {toast} from 'react-toastify';
import Pagination from 'react-js-pagination';

export default function Home(){
    const dispatch = useDispatch();  //Have to use dispatch as hooks....

    //Only destructuring products and loading to use in client-side
    const {products, loading, error, productsCount, resPerPage} = useSelector((state) => state.productsState);  //Doing this we can access all the state, but for this we need only productsState from Store.js...
    
    const [currentPage, setCurrentPage] = useState(1);  //For Pagination...
    // console.log(currentPage);

    const setCurrentPageNo = (pageNo) => {  //For updating currentPage..no..
        setCurrentPage(pageNo);
    }

    useEffect(() => {   //Whenever the browser loads this useEffect will load data...

        dispatch(getProducts(null, null, null, null, currentPage))  //Send getProducts as arguments, so dispatch will work on productsSlice.js...
                                    //Send currentPage as a argument to getProducts, so it will pass it and load next products when click on second page...
                                    //Sending null for keyword, price, category and ratings before loads from ProductSearch.js
        if(error) {
            return toast.error(error,{
                position: "bottom-center"
            });
        };

    }, [error, dispatch, currentPage]);  //whenever error renders it would pop up error message from productsFail()..useSelector(error)..

    return (
        <Fragment>
            {loading ? <Loader/> :
                <Fragment>
                    <MetaData title = {'Buy Best Products'} />  {/* Used to change the title of browser dynamically*/}
                    <h1 id="products_heading">Latest Products</h1>

                    <section id="products" className="container mt-5">
                        <div className="row">
                            {products && products.map(product => (  //Using products && will initially check wheather products data available or not, if it's then products.map will loop through it...
                                <Product col={3} key={product._id} product={product}/>
                            ))}
                        </div>
                    </section>
                    {productsCount > 0 && productsCount > resPerPage ?  //resPerPage for if we have only two products in our website, no neede of showing pagination, for that purpose we using this conditional rendering..
                    <div className="d-flex justify-content-center mt-5">
                        <Pagination
                            activePage={currentPage}  //From Pagination component...
                            onChange={setCurrentPageNo}   
                            totalItemsCount = {productsCount}   //From Pagination component...Initially it shows undefined caz loading would be false at the time of browser loads..so have to do contional rendering....
                            itemsCountPerPage = {resPerPage}   //From Pagination component...
                            nextPageText={'Next'}    //To show the text for page...from pagination components...
                            firstPageText={'First'}  //To show the text for page...from pagination components...
                            lastPageText={'Last'}    //To show the text for page...from pagination components...
                            itemClass={'page-item'}  //Bootstrap class
                            linkClass={'page-link'}  //Bootstrap class
                        />
                    </div>: null}
                </Fragment>
            }
        </Fragment>
    )
}