import React from "react";
import Tiptap from "../../../tiptap/tiptap.jsx";

const CustomTextBox = () => {
  const styles = {
    container: {
      border: "1px solid black",
      backgroundColor: "white",
      transition: "background-color 0.3s",
      paddingInline: "10px",
    },
    containerHover: {
      backgroundColor: "#dfdcdc",
    },
    innerBox: {
      margin: "1px",
    },
  };

  return (
    <div
      style={styles.container}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor =
          styles.containerHover.backgroundColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor =
          styles.container.backgroundColor;
      }}
    >
      <div style={styles.innerBox}>
        <Tiptap />
      </div>
    </div>
  );
};

export default CustomTextBox;
