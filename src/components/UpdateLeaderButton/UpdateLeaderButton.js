import React, { useState } from "react";
import buttonStyle from "./UpdateLeaderButton.module.css";
import { Redirect } from "react-router-dom";

const UpdateLeaderButton = (props) => {
  const { id } = props;
  const [redirect, setRedirect] = useState(false);

  const handleClick = () => {
    setRedirect(true);
  };

  return (
    <>
      <button onClick={handleClick} className={buttonStyle["update-button"]}>
        Editar
      </button>
      {redirect && id && <Redirect to={`/assessors/update/${id}`} />}
    </>
  );
};

export default UpdateLeaderButton;
