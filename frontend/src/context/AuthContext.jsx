import {Children, createContext, useContext, useEffect, useState} from 'react'
import {auth} from '../firebase/firebaseConfig'
import { onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
 } from 'firebase/auth'

const  AuthContext = createContext()

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            setLoading(false);
        })
        return() => {
            unsubscribe();
        }
    },[])

    const signUp = (email,password) => {
        return createUserWithEmailAndPassword(auth,email,password)
    }

    const logIn = (email,password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logOut = () =>{
        return signOut(auth)
    }

    return (
        <AuthContext.Provider value={{user, signUp, logIn, logOut, loading}}>
            {children}
        </AuthContext.Provider>
    )
}