import { db } from "./configs/firebase";
import { collection, addDoc, getDocs, query, where, } from "firebase/firestore";

const usersRef = collection(db,'Users');
const productsRef = collection(db,'Products');
const ordersRef = collection(db,'Orders');

export const addUser = async(user) => {
    try {
        await addDoc(usersRef,{
            uid: user.uid,
            role: 'customer'
        });
    } catch (error) {
        return {error: error};
    } 
};

export const getOrders = async(userId) => {
    try {
        let data = [];
        (await getDocs(query(ordersRef,where('userId','==',userId)))).forEach((doc)=>data.push(doc.data()));
        return data;
    } catch (error) {
        return {error:error};
    }
};

export const getOrder = async(customerId) => {
    try {
        let data = [];
        (await getDocs(query(ordersRef,where('customerId','==',customerId)))).forEach((doc)=>data.push(doc.data()));
        return data;
    } catch (error) {
        return {error:error};
    }
};

export const getProducts = async() => {
    try {
        let data = [];
        (await getDocs(productsRef)).forEach((doc)=>data.push(doc.data()));
        return data;
    } catch (error) {
        return {error:error};
    }
};