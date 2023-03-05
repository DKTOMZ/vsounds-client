import { browserSessionPersistence, browserLocalPersistence, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, setPersistence, signInWithEmailAndPassword, signOut, updatePassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {createContext, useContext, useEffect, useState} from 'react';
import { onSnapshot, collection } from "firebase/firestore";
import { db } from '../configs/firebase';
import { auth } from "../configs/firebase";
import { addUser, getProducts } from '../sync';
import { useDispatch } from 'react-redux';
import { setAppData } from '../redux/store';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const registerUser = async(email,password) => {
        try {
            const UserCredential =  await createUserWithEmailAndPassword(auth,email,password);
            const addResponse = await addUser({uid : UserCredential.user.uid});
            if (addResponse.error) {
                await signOut(auth);
                return {error:'Something went wrong. Try again'};
            }
        } catch (error) {
            return {error: error.code}
        }
        return emailUserVerification();
    };
    
    const loginWithGoogle = async() => {
        const provider = new GoogleAuthProvider();
        provider.addScope('email');
        provider.addScope('profile');
        try {
            const UserCredential = await signInWithPopup(auth,provider);
            await addUser({uid : UserCredential.user.uid});
            return UserCredential.user;
        } catch (error) {
            return {error: error.code}
        }
    };

    const loginUser = async(email,password,persistence=null) => {
        try {
            persistence 
            ? await setPersistence(auth,browserLocalPersistence)
            : await setPersistence(auth,browserSessionPersistence);
        } catch (error) {
            return {error: error.code}
        }

        try {
            const UserCredential = await signInWithEmailAndPassword(auth,email,password);
            if (auth.currentUser.emailVerified) {return UserCredential.user}
        } catch (error) {
            return {error: error.code}
        }

        return emailUserVerification();
    };

    const emailUserVerification = async() => {
        try {
            await sendEmailVerification(auth.currentUser);
            await signOut(auth);
            return {verifyEmail:'Please check email/spam folder to verify your account then login'};
        } catch (error) {
            return {error: error.code}
        }
    }

    const resetUserPassword = async(email) => {
        try {
            await sendPasswordResetEmail(auth,email);
            return {resetEmail:'Please check email/spam folder to reset your account password then login'};
        } catch (error) {
            return {error: error.code};
        }
    };

    const updateUserProfile = async(photoURL=null,name=null,password=null,) => {
        if (password) {
            try {
                await updatePassword(auth.currentUser,password);    
            } catch (error) {
                return {passworderror:error.code};
            }
        }
        try {
            await updateProfile(auth.currentUser,{
                displayName: name,
                photoURL: photoURL
            });
        } catch (error) {
            return {profileerror:error.code};
        }
    };

    const logOutUser = async() => {
        try {
            await signOut(auth);
            return;
        } catch (error) {
            return {error: error.code};
        }
    };

    useEffect(()=>{
        const unsubscribe = onSnapshot(collection(db,'Products'),(snapshot)=>{
            dispatch(setAppData(snapshot.docs.map((doc)=>doc.data())));
        },async(error)=>{
            const response = await getProducts();
            if (response.error) {return}
            dispatch(setAppData(response));
        });
        return unsubscribe;
    },[]);

    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged((user)=>{
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    },[]);

    const localUser = {registerUser,loginWithGoogle,loginUser,emailUserVerification,resetUserPassword,updateUserProfile,logOutUser,currentUser};

    return (
        <AuthContext.Provider value={localUser}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

