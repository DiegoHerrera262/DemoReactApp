import React, { useState } from "react";
import { Redirect } from "react-router-dom";

const RedirectButton = (props) => {
  const { buttonLabel, buttonStyle, path } = props;
  const [redirect, setRedirect] = useState(false);
  const handleClick = () => {
    setRedirect(true);
  };

  if (redirect) {
    return <Redirect to={path} />;
  }

  return (
    <button onClick={handleClick} className={buttonStyle}>
      {buttonLabel}
    </button>
  );
};

export default RedirectButton;
