import React from "react";
import { Provider } from "react-redux";
import BookShop from "./components/BooksShop";
import store from "./components/redux/store";

const App = () => {
  return (
    <>
      <Provider store={store}>
        <BookShop />
      </Provider>
    </>
  );
};

export default App;
