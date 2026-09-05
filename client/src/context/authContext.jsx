import { useState, createContext, useEffect, useContext } from "react";



export const  AuthContext = createContext(null);

export function AuthProvider({children}){
    const [token, setToken ]= useState(null);
    const [user, setUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    useEffect(()=>{
        const storedToken = localStorage.getItem('teacher_engine_token');
        const storedUser = localStorage.getItem('teacher_engine_user');

        if(storedToken && storedUser){
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    },[]);

    const loginUser = (sessionToken, userProfile)=>{
        setToken(sessionToken);
        setUser(userProfile);
        localStorage.setItem('teacher_engine_token', sessionToken);
        localStorage.setItem('teacher_engine_user', JSON.stringify(userProfile));
    };

    const logoutUser = ()=>{
        setToken(null);
        setUser(null);
        localStorage.removeItem('teacher_engine_token');
        localStorage.removeItem('teacher_engine_user');
    }

    return (
    <AuthContext.Provider value={{token, user, loading, loginUser, logoutUser, setToken, setUser, setLoading}}>
        {children}
     </AuthContext.Provider>
    )
};

export const useAuth=()=>{
    return useContext(AuthContext);
}

