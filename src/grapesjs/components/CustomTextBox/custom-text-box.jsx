import React, { useCallback, useRef, useState } from "react";
import Tiptap from "../../../tiptap/tiptap.jsx";
import SlashMenu from "../SlashMenu/SlashMenu.jsx";

const CustomTextBox = () => {
  // State to manage slash menu visibility
  const [showMenu, setShowMenu] = useState(false);
  // ref for slash menu
  const slashMenuRef = useRef(null);

  // handle toggle of slashmenu
  const handleToggleMenu = useCallback((show) => {
    setShowMenu(show);
  }, []);

  const styles = {
    container: {
      border: "1px solid black",
      backgroundColor: "white",
      transition: "background-color 0.3s",
      paddingInline: "10px",
      position: "relative",
    },

    innerBox: {
      margin: "1px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.innerBox}>
        <Tiptap onToggleMenu={handleToggleMenu} />
      </div>
      {showMenu && (
        <div ref={slashMenuRef}>
          <SlashMenu />
        </div>
      )}
    </div>
  );
};

export default CustomTextBox;
