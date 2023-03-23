import React, { useState, useEffect } from "react";
import axios from "axios";
import LeftPanel from "./sliderPanel";
import GraphArea from "./graphArea";
import ErrorPage from "./errorPage";

function Calculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(500);
  const [investmentPeriod, setInvestmentPeriod] = useState(1);
  const [rateOfReturn, setRateOfReturn] = useState(1);
  const [delay, setDelay] = useState(1);
  const [startToday, setStartToday] = useState();
  const [delayedStart, setDelayedStart] = useState();
  const [notionalLoss, setNotionalLoss] = useState();
  const [err, setErr] = useState();

  //Set Values of monthly investment,rate of return, investmment period, delay 

  function changeValues(index, val) {
    switch (index) {
      case 0:
        setMonthlyInvestment(val);
        break;
      case 1:
        setInvestmentPeriod(val);
        break;
      case 2:
        setRateOfReturn(val);
        break;
      case 3:
        setDelay(val);
        break;
    }
  }

  //Api calling 

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("/getResults", {
        params: {
          monthlyInvestment: monthlyInvestment,
          investmentPeriod: investmentPeriod,
          rateOfReturn: rateOfReturn,
          delay: delay,
        },
      });
      const response = res.data.result;
      // for backend validation and showing the error page 
      if (res.data.status == 0) {
        setStartToday(response.startToday);
        setDelayedStart(response.delayedStart);
        setNotionalLoss(response.notionalLoss);
        setErr(false);
      }
      if (res.data.status == -1) {
        setErr(true);
      }
    }
    fetchData();
  }, [monthlyInvestment, investmentPeriod, rateOfReturn, delay]);

  return (
    <div className="calculator">
      <h2 className="heading"> SIP Delay Calculator</h2>

      <h5 className="info">
        It tells you how much wealth you can create by making monthly investment
      </h5>
      <div className="container">
        <LeftPanel
          monthlyInvestment={monthlyInvestment}
          investmentPeriod={investmentPeriod}
          rateOfReturn={rateOfReturn}
          delay={delay}
          changeValues={changeValues}
        />
        {err ? (
          <ErrorPage />
        ) : (
          <GraphArea
            monthlyInvestment={monthlyInvestment}
            investmentPeriod={investmentPeriod}
            startToday={startToday}
            delayedStart={delayedStart}
            notionalLoss={notionalLoss}
          />
        )}
      </div>
    </div>
  );
}

export default Calculator;
