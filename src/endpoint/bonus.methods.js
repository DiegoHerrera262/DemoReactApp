import axios from "axios";

const postBonus = ({ data }) => {
  console.log("Creando bonificación...");
  for (var pair of data.entries()) {
    console.log(pair[0] + ": " + pair[1]);
  }
};

const putBonus = ({ data, params: { id } }) => {
  console.log(`Actualizando Bonificación ${id}`);
  for (var pair of data.entries()) {
    console.log(pair[0] + ": " + pair[1]);
  }
};

const getBonusById = (id) => {
  return {
    bonusName: "Test Bonus",
    quantity: id,
    state: "Activo",
    bonusType: "Por cantidad de pedidos",
    numOrders: id,
    bonusDiscount: "Por porcentaje",
    discountAmount: id,
    clientLevel: "nOOb",
  };
};

export { postBonus, putBonus, getBonusById };
