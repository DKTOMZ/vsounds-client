import { CSpinner } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getOrder } from "../../sync";
import { NotFound } from "../utilities/404";

export const Order = () => {
    const query = new URLSearchParams(useLocation().search).get('orderId');
    const [order,setOrder] = useState([]);
    const [loading,setLoading] = useState(true);
    const [orderDate,setOrderDate] = useState('');
    const [notFound,setNotFound] = useState('loading');

    useEffect(()=>{
        fetchOrder();
    },[order]);

    const fetchOrder = async() => {
        const response = await  getOrder(query);
        if (response.error || !response.length === 0) {return setNotFound('Not found');}
        setOrder(response[0]);
        setOrderDate(new Date(response[0].timestamp));
        setLoading(false);
    }
    
    return (
        <>
            {!loading ?
                <div id="order">
                    <div id="title-decoration"></div>
                    <h3>ORDER {query}</h3>
                    <div style={{color:'#cccaca'}} className="date">Placed: 
                        {` ${orderDate.getDate()}/${orderDate.getMonth()}/${orderDate.getFullYear()},
                        ${orderDate.getHours()<10?'0'+orderDate.getHours():orderDate.getHours()}:${orderDate.getMinutes()<10?'0'+orderDate.getMinutes():orderDate.getMinutes()}:${orderDate.getSeconds()<10?'0'+orderDate.getSeconds():orderDate.getSeconds()}`}
                    </div>
                    <br/>
                    <div style={{backgroundColor:'#2c3640'}} className="products">
                        <div className="title">ORDERED PRODUCTS</div>
                        <div className="title">DELIVERY STATUS</div>
                    </div>
                    {order.products.map((product,index)=>{
                        return <div style={{marginBottom:'10px',backgroundColor:'#2c3640', padding: '10px'}} key={index} className="order-card">
                            <div className="desc">
                                <div style={{marginRight:'10px'}}>ORDERED PRODUCT:</div>
                                <p style={{float:'right'}}>{product.name}</p>
                            </div>
                            <div className="desc">
                                <div style={{marginRight:'10px'}}>PRICE:</div>
                                <p style={{float:'right'}}>${product.price}</p>
                            </div>
                            <div className="desc">
                                <div style={{marginRight:'10px'}}>IMAGE:</div>
                                <img style={{float:'right'}} src={product.imageurl_and_colors.img} height={50} width={50}/>
                            </div>
                            <div className="desc">
                                <div style={{marginRight:'10px'}}>DELIVERY STATUS:</div>
                                <p style={order.deliveryStatus === 'delivered' ?{color:'#1DB954',textTransform:'uppercase',float:'right'}:{color:'#fc9b2c',textTransform:'uppercase',float:'right'}}>{order.deliveryStatus}</p>
                            </div>
                        </div>
                    })}
                    {order.products.map((product,index)=>{
                        return <div key={index} className="products content">
                            <div className="desc">
                                <img src={product.imageurl_and_colors.img} height={100} width={100}/>
                                <div className="text">
                                    <p>{product.name}</p>
                                    <p>${product.price}</p>
                                </div>
                            </div>
                            <div>
                                <p style={order.deliveryStatus === 'delivered' ?{color:'#1DB954',textTransform:'uppercase'}:{color:'#fc9b2c',textTransform:'uppercase'}}>{order.deliveryStatus}</p>
                            </div>
                        </div>
                    })}
                    <div style={{padding:'10px',margin:'10px 0',backgroundColor:'#2c3640'}} className="payment">
                        <p style={{fontWeight:'bold'}}>PAYMENT DETAILS</p>
                        <h4 style={{color:'#1DB954'}}>PAYMENT COMPLETE <i className="fa-regular fa-circle-check"></i></h4>
                        <p>Payment was completed successfully</p>
                        <p style={{fontSize:'13px'}}>Payment Method: {order.paymentMethod}</p>
                    </div>
                    <div style={{padding:'10px',marginTop:'10px',marginBottom:'30px',backgroundColor:'#2c3640'}} className="payment">
                        <p style={{fontWeight:'bold'}}>ORDER SUMMARY</p>
                        <div style={{fontSize:'14px'}} className="shipping">Shipping: {order.shippingFee > 0 ? `$${order.shippingFee}`: 'Free'}</div>
                        <div className="total">Total: ${order.total}</div>
                    </div>
                </div> 
            : notFound === 'loading' ? <CSpinner color="success"/> : <NotFound/>}
        </>
    );
};