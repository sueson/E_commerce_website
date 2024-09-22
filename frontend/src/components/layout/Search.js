import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Search(){

    const navigate = useNavigate()   //Used for navigate dynamically url into browser / It can change browser Urls...

    const location = useLocation()  //Used to clear input value whenever path changes....

    const [keyword, setKeyword] = useState("");

    const searchHandler = (e) => {
        e.preventDefault();
        navigate(`/search/${keyword}`);  //From this we can get the searched products...
    }

    const clearKeyword = () =>{
        setKeyword("");
    }

    useEffect(()=>{
        if(location.pathname === '/') {
            clearKeyword();
        }
    },[location]);
    return(
        
        <form onSubmit={searchHandler}>
            <div className="input-group">
                <input
                    type="text"
                    id="search_field"
                    className="form-control"
                    placeholder="Enter Product Name ..."
                    value={keyword}  //Value used for get the typed word, so it used as dynamic to search things....
                    onChange={(e) => {setKeyword(e.target.value)}}  //When typing the value inside input it stores inside keyword state...
                />
                <div className="input-group-append">
                    <button id="search_btn" className="btn">
                    <i className="fa fa-search" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </form>
        
    )
}