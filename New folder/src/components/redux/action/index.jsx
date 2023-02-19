import {
  BUY_BOOK,
  SELLALLBOOKS,
  ELEMENTS,
  ALLDATA,
} from "../action/actionconstants";
import axios from "axios";

// Action = {type: "" }
export const BookPurchase = (number) => {
  return {
    type: BUY_BOOK,
    payload: number,
  };
};

export const SellallBooks = () => {
  return {
    type: SELLALLBOOKS,
  };
};

export const elements = (tasks) => {
  return {
    type: ELEMENTS,
    payload: tasks,
  };
};

export const alldata = (datas) => {
  return {
    type: ALLDATA,
    payload: datas,
  };
};

/* 
const GET_CURRENT_USER = "GET_CURRENT_USER";
const GET_CURRENT_USER_SUCCESS = "GET_CURRENT_USER_SUCCESS";
const GET_CURRENT_USER_FAILURE = "GET_CURRENT_USER_FAILURE";

const getUser = () => {
  return (dispatch) => {
    //nameless functions
    // Initial action dispatched
    dispatch({ type: GET_CURRENT_USER });
    // Return promise with success and failure actions
    return axios.get("https://zenquotes.io/api/quotes").then(
      (user) =>
        dispatch({ type: GET_CURRENT_USER_SUCCESS, payload: user.data }),

      (err) => dispatch({ type: GET_CURRENT_USER_FAILURE, err })
    );
  };
};

getUser();
 */
