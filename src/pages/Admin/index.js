import React, { useEffect, useState } from "react";
import "./index.css";
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalBarSeries,
  Hint,
  ChartLabel,
} from "react-vis";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Admin = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [chargeCustomers, setChargeCustomers] = useState(false);
  const [songAmount, setSongAmount] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const token = localStorage.getItem("jwt_token");
  const tokenData = JSON.parse(token);

  useEffect(() => {
    const getCompanyData = async () => {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/${tokenData.id}`,
        {
          method: "GET",
        }
      );
      const data = await res.json();
      setName(data.data.name);
      setLocation(data.data.location);
      setChargeCustomers(data.data.charge_customers);
      setSongAmount(data.data.amount);
    };
    getCompanyData();
  }, []);
  useEffect(() => {
    setDisabled();
  }, [songAmount, chargeCustomers]);
  const changeSongAmount = (e, category) => {
    setSongAmount({ ...songAmount, [category]: parseInt(e.target.value) });
  };
  const setDisabled = () => {
    if (!chargeCustomers || !songAmount) {
      setIsButtonDisabled(true);
      return;
    }
    if (
      songAmount.category_6 < 99 ||
      songAmount.category_7 < 79 ||
      songAmount.category_8 < 59 ||
      songAmount.category_9 < 39 ||
      songAmount.category_10 < 19
    ) {
      setIsButtonDisabled(true);
      return;
    } else {
      setIsButtonDisabled(false);
      return;
    }
  };
  const updateValues = async () => {
    setIsButtonDisabled(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/${tokenData.id}`,
        {
          body: JSON.stringify({
            amount: songAmount,
          }),
          method: "PUT",
        }
      );
      console.log(res);
      const data = await res.json();
      console.log(data);
      if (res.status == 200) {
        toast("Updated Successfully");
      }
    } catch (err) {
      console.log(err);
      toast("Error While Updating");
    }
    setIsButtonDisabled(false);
  };
  return (
    <div className="admin-container">
      <h1 className="loging-header">
        {name},{location} on Dhun Jam
      </h1>
      <div className="form-container">
        <h1 className="question-header">
          Do You want to charge your customers for requesting songs?
        </h1>
        <div className="radio-container">
          <input
            className="radio-button"
            type="radio"
            checked={chargeCustomers ? true : false}
            onChange={() => {
              setChargeCustomers(!chargeCustomers);
            }}
          />
          Yes
          <input
            className="radio-button"
            type="radio"
            checked={chargeCustomers ? false : true}
            onChange={() => {
              setChargeCustomers(!chargeCustomers);
            }}
          />
          No
        </div>
      </div>
      <div className="form-container">
        <h1 className="question-header">Custom song request amount-</h1>
        <div className="input-box">
          <input
            type="number"
            value={songAmount?.category_6}
            className="custom-amount-input"
            onChange={(e) => changeSongAmount(e, "category_6")}
            disabled={!chargeCustomers}
          />
        </div>
      </div>
      <div className="form-container">
        <h1 className="question-header">
          Regular song request amounts from high to low-
        </h1>
        <div className="input-box">
          <input
            type="number"
            value={songAmount?.category_7}
            className="amount-input"
            onChange={(e) => changeSongAmount(e, "category_7")}
            disabled={!chargeCustomers}
          />
          <input
            type="number"
            value={songAmount?.category_8}
            className="amount-input"
            onChange={(e) => changeSongAmount(e, "category_8")}
            disabled={!chargeCustomers}
          />
          <input
            type="number"
            value={songAmount?.category_9}
            className="amount-input"
            onChange={(e) => changeSongAmount(e, "category_9")}
            disabled={!chargeCustomers}
          />
          <input
            type="number"
            value={songAmount?.category_10}
            className="amount-input"
            onChange={(e) => changeSongAmount(e, "category_10")}
            disabled={!chargeCustomers}
          />
        </div>
      </div>
      {chargeCustomers && (
        <div className="graph-container">
          <XYPlot xType="ordinal" width={600} height={300}>
            <VerticalBarSeries
              data={[
                { x: "Custom", y: songAmount?.category_6 },
                { x: "Category1", y: songAmount?.category_7 },
                { x: "Category2", y: songAmount?.category_8 },
                { x: "Category3", y: songAmount?.category_9 },
                { x: "Category4", y: songAmount?.category_10 },
              ]}
              barWidth={0.2} // Adjust the bar width
              color="#F0C3F1"
            />
            <XAxis />
            <YAxis />
          </XYPlot>
        </div>
      )}
      <button
        disabled={isButtonDisabled}
        className="save-button"
        onClick={updateValues}
      >
        Save
      </button>
    </div>
  );
};

export default Admin;
