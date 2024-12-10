import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import UserContext from "../UserContext";



export default function Logout(){
    const { unsetUser, setUser } = useContext(UserContext);

    const navigate = useNavigate();

    

    useEffect(() => {
        unsetUser();
            setUser({
                id: null,
                isAdmin: null
        })
    }, [])


    return(
        <>
        <Navigate to="/login"/>
        </>
    )
}