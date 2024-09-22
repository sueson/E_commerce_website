import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";
import Loader from '../layout/Loader';

export default function ProtectedRoute({children, isAdmin}){   //Only login users can view pages...so we created security...

    const { isAuthenticated, loading, user } = useSelector(state => state.authState);

    if(!isAuthenticated && !loading ) {
        return <Navigate to="/login"/>    //Redirect to login page, user doesn't logged in..
    }

    if(isAuthenticated) {  //isAdmin is to check wheather is client is admin or not to access the url dashboard path...
        if(isAdmin === true && user.role !== 'admin'){
            return <Navigate to="/login"/>
        }
        return children;
    }

    if(loading) {
        return <Loader/>
    }

    return children;   //Will retun user profile page if user logged in..
}