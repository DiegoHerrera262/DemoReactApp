import React, { useState, useEffect } from "react";
import updateStyles from "./ViewBonusUpdate.module.css";

import { putBonus, getBonusById } from "../../endpoint/bonus.methods";

import BonusCRUDForm from "../BonusCRUDForm";

const resetValues = {
  bonusName: "",
  quantity: "",
  state: "",
  bonusType: "Por cantidad de pedidos",
  numOrders: "",
  bonusDiscount: "Por porcentaje",
  discountAmount: "",
  clientLevel: "",
};

const BonusUpdateView = (props) => {
  const { bonusId } = props;
  const [isLoading, setIsLoading] = useState(true);

  const [defaultInitialValues, setDefaultInitialValues] = useState(resetValues);

  /* Here data should be fetched from the Bonus API */
  useEffect(() => {
    const fetchData = async () => {
      const bonusData = await getBonusById(bonusId);
      setDefaultInitialValues(bonusData);
      setIsLoading(false);
    };
    fetchData();
  }, [bonusId]);

  if (isLoading) {
    return <div className={updateStyles["loading-div"]} />;
  }

  return (
    <BonusCRUDForm
      defaultInitialValues={defaultInitialValues}
      httpMethod={putBonus}
      httpParams={{
        id: bonusId,
      }}
      className={updateStyles}
    />
  );
};

export default BonusUpdateView;
