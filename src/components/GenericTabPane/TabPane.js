import React from "react";
import PropTypes from "prop-types";

const TabPane = (props) => {
  // const { className } = props;
  return <>{props.children}</>;
};
TabPane.propTypes = {
  name: PropTypes.string,
};

export default TabPane;
