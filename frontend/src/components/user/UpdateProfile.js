import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { updateProfile, clearAuthError } from "../../actions/userActions";
import { toast } from "react-toastify";
import { clearUpdateProfile } from "../../slices/authSlice";

export default function UpdateProfile(){

    const { error, isUpdated, user} = useSelector( state => state.authState);

    const [name, setName] = useState("");    //To get the value and update...
    const [email, setEmail] = useState("");  //To get the value and update...
    const [avatar, setAvatar] = useState("");   //To get the value and update...
    const [avatarPreview, setAvatarPreview] = useState('/images/default_image.jpg');   //To get the value and update...

    const dispatch = useDispatch();

    const onChangeAvatar = (e) => {  //For avatar update..
        const reader = new FileReader();
            reader.onload = ()=>{  //After read As data reads the file, this one happens...
                if(reader.readyState === 2 ) {  //When readyState value becomes 2, then file read completed...
                    setAvatarPreview(reader.result)  //using result will get the file of url..
                    setAvatar(e.target.files[0])
                }
            }

            reader.readAsDataURL(e.target.files[0]);  //It will read image data
    }

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();  //It's a javascript class..
        formData.append('name', name);
        formData.append('email', email);
        formData.append('avatar', avatar);
        dispatch(updateProfile(formData));
    }

    useEffect(() => {
        if(user) {
            setName(user.name);
            setEmail(user.email);
            if(user.avatar) {   //checks if user have sets avatar...
                setAvatarPreview(user.avatar);
            }
        }
        if(isUpdated) {
            toast("Profile Updated Successfully", {
                type: 'success',
                position : "bottom-center",
                onOpen : () => {  //Using for not to show the update pop up message more than once enter into the user update page, only show when user click the update button..
                    dispatch(clearUpdateProfile());
                }
            })
            return;
        }
        if(error) {
            toast(error, {
                position : "bottom-center",
                type : 'error',
                onOpen: () => {  //It will change the error value to null once user logged in...
                    dispatch(clearAuthError);
                }
            })
            return;
        }
    }, [user, isUpdated, error, dispatch]);

    return(
        <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data'>
                        <h1 className="mt-2 mb-5">Update Profile</h1>

                        <div className="form-group">
                            <label htmlFor="email_field">Name</label>
                            <input 
								type="name" 
								id="name_field" 
								className="form-control"
                                name='name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                name='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                            alt='Avatar Preview'
                                        />
                                    </figure>
                                </div>
                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='avatar'
                                        className='custom-file-input'
                                        id='customFile'
                                        onChange={onChangeAvatar}
                                    />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Choose Avatar
                                </label>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn update-btn btn-block mt-4 mb-3" >Update</button>
                    </form>
                </div>
            </div>
    )
}