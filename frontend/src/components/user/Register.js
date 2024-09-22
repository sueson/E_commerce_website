import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, clearAuthError } from "../../actions/userActions";
import {toast} from 'react-toastify';
import { useNavigate } from "react-router-dom";

export default function Register(){

    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: ""
    }); 

    const [avatar, setAvatar] = useState("");

    const [avatarPreview, setAvatarPreview] = useState("/images/default_image.jpg");

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { loading, error, isAuthenticated } = useSelector(state => state.authState);


    const onChange = (e) => {
        if(e.target.name === 'avatar') {  //If the file uploading is a image...
            const reader = new FileReader();
            reader.onload = ()=>{  //After read As data reads the file, this one happens...
                if(reader.readyState === 2 ) {  //When readyState value becomes 2, then file read completed...
                    setAvatarPreview(reader.result)  //using result will get the file of url..
                    setAvatar(e.target.files[0])
                }
            }

            reader.readAsDataURL(e.target.files[0]);  //It will read image data
        }
        else {  //If the file is text, this one will work.
            setUserData({...userData, [e.target.name]: e.target.value});  //It will first get value from name field from input and store it's value into userData..
        }
    }

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();  //It's a javascript class..
        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        formData.append('avatar', avatar);
        dispatch(register(formData));
    }

    useEffect(() => {
        if(isAuthenticated) {
            navigate('/');
            return
        }
        if(error) {
            toast(error, {
                position : "bottom-center",
                type : 'error',
                onOpen: () => {  //It will change the error value to null once user logged in...
                    dispatch(clearAuthError);
                }
            })
        }
        return
    }, [error, isAuthenticated, dispatch, navigate]);

    return(
        <Fragment>
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data'>
                    <h1 className="mb-3">Register</h1>

                <div className="form-group">
                    <label htmlFor="email_field">Name</label>
                    <input name="name" onChange={onChange} type="name" id="name_field" className="form-control"/>
                </div>

                    <div className="form-group">
                    <label htmlFor="email_field">Email</label>
                    <input
                        name="email"
                        onChange={onChange}
                        type="email"
                        id="email_field"
                        className="form-control"
                    />
                    </div>
        
                    <div className="form-group">
                    <label htmlFor="password_field">Password</label>
                    <input
                        name="password"
                        onChange={onChange}
                        type="password"
                        id="password_field"
                        className="form-control"
                    />
                    </div>

                    <div className='form-group'>
                    <label htmlFor='avatar_upload'>Avatar</label>
                    <div className='d-flex align-items-center'>
                        <div>
                            <figure className='avatar mr-3 item-rtl'>
                                <img
                                    src={avatarPreview}
                                    className='rounded-circle'
                                    alt='Avatar'
                                />
                            </figure>
                        </div>
                        <div className='custom-file'>
                            <input
                                type='file'
                                name='avatar'
                                onChange={onChange}
                                className='custom-file-input'
                                id='customFile'
                            />
                            <label className='custom-file-label' htmlFor='customFile'>
                                Choose Avatar
                            </label>
                        </div>
                    </div>
                </div>
        
                    <button
                    id="register_button"
                    type="submit"
                    className="btn btn-block py-3"
                    disabled={loading}
                    >
                    REGISTER
                    </button>
                </form>
                </div>
            </div>
        </Fragment>
    )
}