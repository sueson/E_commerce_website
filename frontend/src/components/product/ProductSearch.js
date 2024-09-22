import React, { Fragment, useEffect, useState } from "react";
import MetaData from ".././layout/MetaData";
import { getProducts } from "../../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from ".././layout/Loader";
import Product from ".././product/Product";
import {toast} from 'react-toastify';
import Pagination from 'react-js-pagination';
import { useParams } from "react-router-dom";
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

export default function ProductSearch(){
    const dispatch = useDispatch();  //Have to use dispatch as hooks....

    //Only destructuring products and loading to use in client-side
    const {products, loading, error, productsCount, resPerPage} = useSelector((state) => state.productsState);  //Doing this we can access all the state, but for this we need only productsState from Store.js...
    
    const [currentPage, setCurrentPage] = useState(1);  //For Pagination...
    // console.log(currentPage);

    const [price, setPrice] = useState([1, 1000]);  //This one is for modifying Slider...

    const [priceChanged, setPriceChanged] = useState(price);  //For onMouseUp listener...

    const [category, setCategory] = useState(null);   //For filtering based on category..

    const [ratings, setRatings] = useState(0);  

    const {keyword} = useParams();  //Pass keyword inside getProducts as argument...

    const categories = [
                'Electronics',
                'Mobile Phones',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'Clothes/Shoes',
                'Beauty/Health',
                'Outdoor',
                'Home',
                'Sports'
    ];

    const setCurrentPageNo = (pageNo) => {  //For updating currentPage..no..
        setCurrentPage(pageNo);
    }

    useEffect(() => {   //Whenever the browser loads this useEffect will load data...

        dispatch(getProducts(keyword, priceChanged, category, ratings, currentPage))  //Send getProducts as arguments, so dispatch will work on productsSlice.js...
                                    //Send currentPage as a argument to getProducts, so it will pass it and load next products when click on second page...
        if(error) {
            return toast.error(error);
        };

    }, [error, dispatch, currentPage, keyword, priceChanged, category, ratings]);  //whenever error renders it would pop up error message from productsFail()..useSelector(error)..

    return (
        <Fragment>
            {loading ? <Loader/> :
                <Fragment>
                    <MetaData title = {'Buy Best Products'} />  {/* Used to change the title of browser dynamically*/}
                    <h1 id="products_heading">Search Products</h1>

                    <section id="products" className="container mt-5">
                        <div className="row">

                            
                            <div className="col-6 col-md-3 mb-5 mt-5">  {/* For Creating Slider to choose Price filter.. */}
                                {/* Price Filter */}
                                <div className="px-5" onMouseUp={() => setPriceChanged(price)}>
                                    <Slider
                                    range = {true}
                                    marks = {
                                        {
                                            1 : "$1",
                                            1000 : "$1000"
                                        }
                                    }
                                    min = {1}
                                    max = {1000}
                                    defaultValue = {price}
                                    onChange={(price) => {
                                        setPrice(price)
                                    }}
                                    handleRender={          //For Showing Price range when we drag the slider....
                                        renderProps => {
                                            return (
                                                <Tooltip overlay={`$${renderProps.props['aria-valuenow']}`}>
                                                     <div {...renderProps.props}> </div> 
                                                </Tooltip>
                                            )
                                        }
                                    }
                                    />
                                </div>
                                <hr className="my-5"/>

                                {/* Category Filter */}
                                <div className="mt-5">
                                    <h3 className="mb-3">Categories</h3>
                                    <ul className="pl-0">
                                        {categories.map(category => 
                                        <li 
                                        style={{
                                            cursor: 'pointer',
                                            listStyle : 'none'
                                        }}
                                        key={category}     //key used for react to identifies the individual lists...
                                        onClick={() => {setCategory(category)}}  //It should update the products by categories..
                                        > {category}</li>
                                        )}
                                        
                                    </ul>
                                </div>
                                <hr className="my-5"></hr>

                                {/* Ratings Filter */}
                                <div className="mt-5">
                                    <h4 className="mb-3">Ratings</h4>

                                    <ul className="pl-0">
                                        {[5, 4, 3, 2, 1].map(star => 
                                        <li 
                                        style={{
                                            cursor: 'pointer',
                                            listStyle : 'none'
                                        }}
                                        key={star}     //key used for react to identifies the individual lists...
                                        onClick={() => {setRatings(star)}}   //It should update the products by ratings of star...
                                        > 
                                        <div className="rating-outer">
                                            <div className="rating-inner"
                                            style={{
                                                width: `${star * 20}%`   //For updating the stars color by percentage...
                                            }}
                                            ></div>
                                        </div>
                                        </li>
                                        )}
                                        
                                    </ul>
                                </div>
                            </div>
                            <div className="col-6 col-md-9">
                                <div className="row">
                                    {products && products.map(product => (  //Using products && will initially check wheather products data available or not, if it's then products.map will loop through it...
                                    <Product col={4} key={product._id} product={product}/>
                                    ))}
                                </div>
                            </div>
                            
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