import React, { useState } from "react";
import TabPane from "../TabPane";

const CustomTabs = (props) => {
  const { children, className } = props;
  // getting headers of tab menu
  const headers = React.Children.map(children, (element) => {
    return element.props.name;
  });
  const [active, setActive] = useState(headers.length > 0 ? headers[0] : "");

  const getActiveChild = () => {
    for (const child of children) {
      if (child.props.name === active) {
        return child;
      }
    }
    return children[0];
  };
  const activeChild = getActiveChild();

  return (
    <>
      <div className={className["tabs-menu"]}>
        {headers.map((header, i) => (
          <button
            key={`${header}-${i}`}
            onClick={(event) => {
              setActive(header);
            }}
            className={
              header === active
                ? className["active-tab"]
                : className["unactive-tab"]
            }
          >
            {header}
          </button>
        ))}
      </div>
      <div className={className["tab-content"]}>{activeChild}</div>
    </>
  );
};
CustomTabs.propTypes = {
  children: (props, propName, componentName) => {
    const prop = props[propName];
    let error = null;
    React.Children.forEach(prop, (child) => {
      if (child.type !== TabPane) {
        error = new Error("Component is not of type TabPane");
      }
    });
    return error;
  },
};

export default CustomTabs;
