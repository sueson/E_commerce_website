import React, { Fragment, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from '../layout/Loader';
import {MDBDataTable} from 'mdbreact';
import {toast} from 'react-toastify';
import Sidebar from "./Sidebar";
import { deleteUser, getUsers } from "../../actions/userActions";
import { clearError, clearUserDeleted } from "../../slices/userSlice";

export default function UserList(){
    const { users = [], loading = true, error, isUserDeleted } = useSelector(state => state.userState);

    const dispatch = useDispatch();

    const setUsers = () => {
        const data = {
            columns : [
                {
                    label : 'ID',
                    field : 'id',
                    sort : 'asc'
                },
                {
                    label : 'Name',
                    field : 'name',
                    sort : 'asc'
                },
                {
                    label : 'Email',
                    field : 'email',
                    sort : 'asc'
                },
                {
                    label : 'Role',
                    field : 'role',
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

        users.forEach( user => {
            data.rows.push({
                id : user._id,
                name : user.name,
                email : user.email,
                role : user.role,
                action : (
                    <Fragment>
                        <Link to={`/admin/user/${user._id}`} className="btn btn-primary"> <i className="fa fa-pencil"></i> </Link>
                        <Button onClick={e => deleteHandler(e, user._id)} className="btn btn-danger py-1 px-2 ml-2">
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
        dispatch(deleteUser(id));
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

        if(isUserDeleted) {
            toast("User Deleted Successfully", {
                type: 'success',
                position : "bottom-center",
                onOpen : () => {  //Using for not to show the update pop up message more than once when success message appears, only show when user click the delete icon..
                    dispatch(clearUserDeleted());
                }
            })
            return;
        }

        dispatch(getUsers);
    },[dispatch, error, isUserDeleted]);  



    return(
        <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar/>
                </div>
                <div className="col-12 col-md-10">
                <h1 className="my-4">User List</h1>
                <Fragment>
                    {loading ? <Loader/> :
                    <MDBDataTable 
                        data = {setUsers()}
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