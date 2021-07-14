import React from "react";
import createStyles from "./ViewBonusCreate.module.css";

import BonusCRUDForm from "../BonusCRUDForm";

import { postBonus } from "../../endpoint/bonus.methods";

const defaultInitialValues = {
  bonusName: "",
  quantity: "",
  state: "",
  bonusType: "Por cantidad de pedidos",
  numOrders: "",
  bonusDiscount: "Por porcentaje",
  discountAmount: "",
  clientLevel: "",
};

const CreateBonusView = (props) => {
  return (
    <BonusCRUDForm
      create
      defaultInitialValues={defaultInitialValues}
      httpMethod={postBonus}
      className={createStyles}
    />
  );
};

export default CreateBonusView;
