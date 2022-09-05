import axios from 'axios'
import { CART_EMPTY, ORDER_CREATE_SUCCESS, ORDER_CREATE_REQUEST, ORDER_CREATE_FAIL, ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCESS, ORDER_DETAILS_FAIL, ORDER_PAY_REQUEST, ORDER_PAY_SUCCESS, ORDER_PAY_FAIL, MY_ORDER_LIST_REQUEST, MY_ORDER_LIST_FAIL, MY_ORDER_LIST_SUCCESS, ORDERS_LIST_REQUEST, ORDERS_LIST_SUCCESS, ORDERS_LIST_FAIL, ORDER_DELETE_REQUEST, ORDER_DELETE_SUCCESS, ORDER_DELETE_FAIL, ORDER_DELIVER_REQUEST, ORDER_DELIVER_SUCCESS, ORDER_DELIVER_FAIL } from './types'

export const createOrder = (order) => async (dispatch, getState) => {
    dispatch({ type: ORDER_CREATE_REQUEST, payload: order })
    try {
        const { userSignInReducer: { userInfo } } = getState()
        const request = await axios.post("/api/order", order, {
            headers: {
                authorization: `Bearer ${userInfo.data.token}`
            }
        })
        dispatch({ type: ORDER_CREATE_SUCCESS, payload: request })
        dispatch({ type: CART_EMPTY })
        localStorage.removeItem("cartItems")
    } catch (error) {
        dispatch({ type: ORDER_CREATE_FAIL, payload: error.response && error.response.data.message ? error.response.data.message : error.message })
    }
}

export const detailsOrder = (orderId) => async (dispatch, getState) => {
    dispatch({ type: ORDER_DETAILS_REQUEST, payload: orderId })
    const { userSignInReducer: { userInfo } } = getState()
    try {
        const { data } = await axios.get(`/api/order/${orderId}`, {
            headers: { authorization: `Bearer ${userInfo.data.token}` }
        })
        dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data })
    } catch (error) {
        dispatch({ type: ORDER_DETAILS_FAIL, payload: error.response && error.response.data.message ? error.response.data.message : error.message })
    }
}

export const payOrder = (order, paymentResult) => async (dispatch, getState) => {
    dispatch({ type: ORDER_PAY_REQUEST, payload: { order, paymentResult } })
    const { userSignInReducer: { userInfo } } = getState()
    try {
        const { data } = await axios.put(`/api/order/pay/${order._id}`, paymentResult, {
            headers: { authorization: `Bearer ${userInfo.data.token}` }
        })
        dispatch({ type: ORDER_PAY_SUCCESS, payload: data })
    } catch (error) {
        dispatch({ type: ORDER_PAY_FAIL, payload: error.response && error.response.data.message ? error.response.data.message : error.message })
    }
}

export const deliverOrder = (orderId) => async (dispatch, getState) => {
    dispatch({ type: ORDER_DELIVER_REQUEST, payload: { orderId } })
    const { userSignInReducer: { userInfo } } = getState()
    try {
        const { data } = await axios.put(`/api/order/deliver/${orderId}`, {}, {
            headers: { authorization: `Bearer ${userInfo.data.token}` }
        })
        dispatch({ type: ORDER_DELIVER_SUCCESS, payload: data })
    } catch (error) {
        dispatch({ type: ORDER_DELIVER_FAIL, payload: error.response && error.response.data.message ? error.response.data.message : error.message })
    }
}

export const myOrders = () => async (dispatch, getState) => {
    dispatch({type: MY_ORDER_LIST_REQUEST})
    const { userSignInReducer: { userInfo } } = getState()
    try {
        const { data } = await axios.get(`/api/order/myorder`, {
            headers: { authorization: `Bearer ${userInfo.data.token}` }
        })
        dispatch({ type: MY_ORDER_LIST_SUCCESS, payload: data })
    } catch (error) {
        dispatch({ type: MY_ORDER_LIST_FAIL, payload: error.response && error.response.data.message ? error.response.data.message : error.message })
    }
}

export const allOrderss = () => async (dispatch, getState) => {
    dispatch({type: ORDERS_LIST_REQUEST})
    const { userSignInReducer: { userInfo } } = getState()
    try {
        const { data } = await axios.get(`/api/order/orders`, {
            headers: { authorization: `Bearer ${userInfo.data.token}` }
        })
        dispatch({ type: ORDERS_LIST_SUCCESS, payload: data })
    } catch (error) {
        dispatch({ type: ORDERS_LIST_FAIL, payload: error.response && error.response.data.message ? error.response.data.message : error.message })
    }
}

export const deleteOrder = (orderId) => async (dispatch, getState) => {
    dispatch({ type: ORDER_DELETE_REQUEST })
    const { userSignInReducer: { userInfo } } = getState()
    try {
        const { data } = await axios.delete(`/api/order/${orderId}`, {
            headers: { authorization: `Bearer ${userInfo.data.token}` }
        })
        dispatch({ type: ORDER_DELETE_SUCCESS, payload: data })
    } catch (error) {
        dispatch({ type: ORDER_DELETE_FAIL, payload: error.response && error.response.data.message ? error.response.data.message : error.message })
    }
}