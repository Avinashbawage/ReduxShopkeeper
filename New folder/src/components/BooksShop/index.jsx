import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { BookPurchase, SellallBooks, elements } from "../redux/action/index";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

function BookShop() {
  const select = useSelector((state) => {
    return state;
  });
  const [inputValue, setInputValue] = useState(" ");
  const [quotes, setQuotes] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("https://type.fit/api/quotes");
      let i = Math.floor(Math.random() * 10);
      setQuotes(result.data[i]);
      console.log("first", result.data[i]);
    };

    fetchData();
  }, []);

  const handleSubmit = () => {
    dispatch(elements(inputValue));
    setInputValue("");
  };

  return (
    <>
      <div className="main_container">
        <div className={styles.container}>
          <h2>Todays Quote</h2>
          <div className="box">
            <h3>{quotes?.text}</h3>
            <p> -{quotes?.author}</p>
          </div>
          <h3>
            <u> BookShop</u>
          </h3>
          <div>No of Books Availiable = {select?.noofbooks}</div>
          <button
            onClick={() => {
              dispatch(BookPurchase(5));
            }}
          >
            Buy Books 5
          </button>
          <br />
          <br />
          <button
            onClick={() => {
              dispatch(SellallBooks());
            }}
          >
            Buy all books
          </button>

          <br />

          <div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <div>
            {" "}
            <button onClick={() => handleSubmit()}>Buy book</button>{" "}
          </div>
        </div>

        <div className={styles.lists}>
          <div>
            <h2>List of Items</h2>
            <div className="box">
              <ol>
                {select?.booklist.map((item) => {
                  return (
                    <div key={item}>
                      <li>{item} </li>
                    </div>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookShop;
