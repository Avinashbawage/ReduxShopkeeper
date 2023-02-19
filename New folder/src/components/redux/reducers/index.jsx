import {
  BUY_BOOK,
  SELLALLBOOKS,
  ELEMENTS,
  ALLDATA,
} from "../action/actionconstants";

const intialState = {
  noofbooks: 100,
  booklist: [],
  apidata: [],
};

const Bookbuy = (state = intialState, action) => {
  switch (action.type) {
    case BUY_BOOK:
      return { ...state, noofbooks: state.noofbooks - action.payload };
    case SELLALLBOOKS:
      return { ...state, noofbooks: 0 };
    case ELEMENTS:
      return {
        ...state,
        booklist: [...state.booklist, action.payload],
      };
    case ALLDATA:
      return {
        ...state,
        apidata: [...state.apidata, action.payload],
      };
    default:
      return state;
  }
};

export default Bookbuy;
