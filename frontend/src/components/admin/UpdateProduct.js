import React, { Fragment, useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct, updateProduct } from '../../actions/productActions';
import { clearProductUpdated } from '../../slices/productSlice';
import {toast} from 'react-toastify';
import { clearError } from '../../slices/productsSlice';

export default function UpdateProduct(){
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [seller, setSeller] = useState('');
    const [images, setImages] = useState([]);
    const [imagesCleared, setImagesCleared] = useState(false);
    const [imagesPreview, setImagesPreview] = useState([]);

    const { id:productId } = useParams();

    const { loading, isProductUpdated, error, product } = useSelector(state => state.productState);

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

    const navigate = useNavigate();

    const dispatch = useDispatch();

    //For showing Image preview...
    const onImagesChange = (e) => {
        const files = Array.from(e.target.files);  //Array.from will change the file from object to array...

        files.forEach(file => {
            const reader = new FileReader();

            reader.onload = () => {
                if(reader.readyState == 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result]);  //For to show preview of the image...
                    setImages(oldArray => [...oldArray, file]);   //For sending image when submiting form...
                }
            }

            reader.readAsDataURL(file);  //It will read the data into url form...
        })
    }

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('description', description);
        formData.append('seller', seller);
        formData.append('category', category);
        images.forEach(image => {
            formData.append('images', image);
        })
        formData.append('imagesCleared', imagesCleared);
        dispatch(updateProduct(productId, formData));
    }

    const clearImagesHandler = () => {
        setImages([]);
        setImagesPreview([]);
        setImagesCleared(true);
    }


    useEffect(() => {
        if(isProductUpdated) {
            toast("Product Updated Successfully", {
                type: 'success',
                position : "bottom-center",
                onOpen : () => {  //Using for not to show the update pop up message more than once when success message appears, only show when user click the create button..
                    dispatch(clearProductUpdated());
                }
            })
            setImages([])
            return;
        }

        if(error) {
            toast(error, {
                position : "bottom-center",
                type : 'error',
                onOpen: () => {  //It will change the error value to null once user logged in...
                    dispatch(clearError());
                }
            })
            return;
        }

        dispatch(getProduct(productId))
    }, [isProductUpdated, error, dispatch]);

    useEffect(() => {
        if(product._id) {
            setName(product.name);
            setPrice(product.price);
            setStock(product.stock);
            setDescription(product.description);
            setSeller(product.seller);
            setCategory(product.category);

            let images = [];
            product.images.forEach(image => {
                images.push(image.image)
            });
            setImagesPreview(images);
        }
    }, [product]);

    return (
        <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar/>
                </div>
                <div className="col-12 col-md-10">
                <h1 className="my-4">Products List</h1>
                <Fragment>
                <div className="wrapper my-5"> 
                <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data'>
                    <h1 className="mb-4">Update Product</h1>

                    <div className="form-group">
                    <label htmlFor="name_field">Name</label>
                    <input
                        type="text"
                        id="name_field"
                        className="form-control"
                        onChange={e => setName(e.target.value)}
                        value={name}
                    />
                    </div>

                    <div className="form-group">
                        <label htmlFor="price_field">Price</label>
                        <input
                        type="text"
                        id="price_field"
                        className="form-control"
                        onChange={e => setPrice(e.target.value)}
                        value={price}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description_field">Description</label>
                        <textarea 
                        className="form-control" 
                        id="description_field" 
                        rows="8" 
                        onChange={e => setDescription(e.target.value)}
                        value={description}
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="category_field">Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} className="form-control" id="category_field">
                            <option value= "" >Select</option>
                            {categories.map(category => (
                                <option key={category}
                                value={category} 
                                >
                                    {category}

                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="stock_field">Stock</label>
                        <input
                        type="number"
                        id="stock_field"
                        className="form-control"
                        onChange={e => setStock(e.target.value)}
                        value={stock}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="seller_field">Seller Name</label>
                        <input
                        type="text"
                        id="seller_field"
                        className="form-control"
                        onChange={e => setSeller(e.target.value)}
                        value={seller}
                        />
                    </div>
                    
                    <div className='form-group'>
                        <label>Images</label>
                        
                            <div className='custom-file'>
                                <input
                                    type='file'
                                    name='product_images'
                                    className='custom-file-input'
                                    id='customFile'
                                    multiple
                                    onChange={onImagesChange}
                                />
                                <label className='custom-file-label' htmlFor='customFile'>
                                    Choose Images
                                </label>
                            </div>
                            {imagesPreview.length > 0 && <span className='mr-2' onClick={clearImagesHandler} style={{cursor : 'pointer'}}><i className='fa fa-trash'></i></span>}  {/* For updating product image */}
                            {imagesPreview.map(image => (
                                <img
                                className='mt-3 mr-2'
                                key={image}
                                src={image}
                                alt='Image Preview'
                                width='55'
                                height='52' 
                                />
                            ))}
                    </div>

        
                    <button
                    id="login_button"
                    type="submit"
                    className="btn btn-block py-3"
                    disabled = {loading}   //If the loading value is true the button will become unclickable...
                    >
                    UPDATE
                    </button>

                </form>
            </div>
                </Fragment>
                </div>
            </div>
    )
}