import { useContext, useEffect } from "react";
import { register,login,getMe,logout } from "../services/auth.api";
import { AuthContext } from "../auth.context";




export const useAuth=()=>{
    const context=useContext(AuthContext);

    const{user,setUser,loading,setLoading}=context;

    const handlerRegister=async({username,email,password})=>{
        setLoading(true);
        try {
            const data=await register({username,email,password});
            setUser(data.user);
            return data;
        } finally {
            setLoading(false);
        }
    }

    const handlerLogin=async({email,password,username})=>{
        setLoading(true);
        try {
            const data=await login({email,password,username});
            setUser(data.user);
            return data;
        } finally {
            setLoading(false);
        }
    }
    const handlerGetMe=async()=>{
        setLoading(true);
        try {
            const data=await getMe();
            setUser(data.user);
            return data;
        } catch (error) {
            setUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    }
    const handlerLogout=async()=>{
        setLoading(true);
        try {
            const data=await logout();
            setUser(null);
            return data;
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handlerGetMe();
    }, []);


    return(
        {handlerRegister,handlerLogin,handlerGetMe,handlerLogout,user,loading}
    )
}   
