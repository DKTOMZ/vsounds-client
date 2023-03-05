import { CSpinner } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { setUserOrders } from "../../redux/store";
import { getOrders } from "../../sync";

export const UserOrders = () => {
    const { currentUser } = useAuth();
    const [loading,setLoading] = useState(true);
    const orders = useSelector((state)=>state.userOrders ? [...state.userOrders].sort((a,b)=>{return b.timestamp - a.timestamp}): state.userOrders);
    const dispatch = useDispatch();
    useEffect(()=>{
        fetchOrders();
    },[]);

    const fetchOrders = async() => {
        const response = await getOrders(currentUser.uid);
        if (response.error) {return console.log(response.error);}
        dispatch(setUserOrders(response));
        setLoading(false);
    }

    return (
        <div id="user-orders">
            <h3 style={{marginBottom:'10px'}}>ORDERS</h3>
            <div id="title-decoration"></div>
            {loading ? <CSpinner color="success"/> 
            : 
            orders.length > 0 ?
                <>
                    <p>If you made an order recently, refresh the page to see it here.</p>
                    <h5>Orders</h5>
                    <div className="orders">
                        <div className="title">DATE</div>
                        <div className="title">STATUS</div>
                        <div className="title">ORDERID</div>
                        <div className="title">PAYMENT METHOD</div>
                        <div className="title">TOTAL AMOUNT</div>
                        <div className="title"></div>
                    </div>
                    {
                        orders.map((order,index)=>{
                            let date = new Date(order.timestamp);
                            return <div className="order-card" key={index}>
                                <div className="date">
                                    <p style={{marginBottom:'0',color: '#1DB954',fontWeight:'bold'}}>DATE: </p>
                                    <p style={{marginBottom:'0'}}>
                                        { `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}
                                        ${date.getHours()<10?'0'+date.getHours():date.getHours()}:${date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()}:${date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds()}`}
                                    </p>
                                </div>
                                <div className="status">
                                    <p style={{marginBottom:'0',color: '#1DB954',fontWeight:'bold'}}>STATUS:</p>
                                    <p style={order.deliveryStatus === 'delivered' ? {color: '#1DB954',marginBottom:'0'}:{color:'#fc9b2c',marginBottom:'0'}}>
                                        {order.deliveryStatus.toUpperCase()}
                                    </p>
                                </div>
                                <div className="order-id">
                                    <p style={{marginBottom:'0',color: '#1DB954',fontWeight:'bold'}}>ORDERID:</p>
                                    <p style={{marginBottom:'0'}}>
                                        {order.customerId}
                                    </p>
                                </div>
                                <div className="payment">
                                    <p style={{marginBottom:'0',color: '#1DB954',fontWeight:'bold'}}>PAYMENT:</p>
                                    <p style={{marginBottom:'0'}}>
                                        {order.paymentMethod}
                                    </p>
                                </div>
                                <div className="total">
                                    <p style={{marginBottom:'0',color: '#1DB954',fontWeight:'bold'}}>TOTAL:</p>
                                    <p style={{marginBottom:'0'}}>
                                        ${order.total}
                                    </p>
                                </div>
                                <div>
                                    <div></div>
                                    <Link className="details" to='Products'>Details</Link>
                                </div>
                            </div>
                        })
                    }
                    {
                        orders.map((order,index)=>{
                            let date = new Date(order.timestamp);
                            return <div key={index} className="orders content">
                                <div className="date">{ `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}
                                ${date.getHours()<10?'0'+date.getHours():date.getHours()}:${date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()}:${date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds()}`}</div>
                                <div className="status" 
                                style={order.deliveryStatus === 'delivered' ? {color: '#1DB954'}:{color:'#fc9b2c'}}>
                                    {order.deliveryStatus.toUpperCase()}
                                </div>
                                <div className="order-id">{order.customerId}</div>
                                <div className="payment">{order.paymentMethod}</div>
                                <div className="total">${order.total}</div>
                                <Link className="details" to={`/Order/?orderId=${order.customerId}`} >Details</Link>
                            </div>
                    })
                    }
                </>
                : <h4 style={{color:'#1DB954',marginBottom:'80px'}}><i className="fa-solid fa-face-frown"></i> Make some purchases to see your orders here.</h4>}
        </div>
    );
};