import React, { useCallback, useRef, useState } from "react";
import Tiptap from "../../../tiptap/tiptap.jsx";
import SlashMenu from "../SlashMenu/SlashMenu.jsx";
import useGrapesjsEditorStore from "../../../store/GrapesjsEditorStore.jsx";

const CustomTextBox = () => {
  // State to manage slash menu visibility
  const [showMenu, setShowMenu] = useState(false);
  const [query, setQuery] = useState("");
  // ref for slash menu
  const slashMenuRef = useRef(null);

  // get tiptapEditor isntance from zustand
  const { tiptapEditor } = useGrapesjsEditorStore();

  // handle toggle of slashmenu
  const handleToggleMenu = useCallback((show) => {
    setShowMenu(show);
  }, []);

  // handle slash menu query
  const handleQueryChange = useCallback((newQuery) => {
    setQuery(newQuery);
  }, []);

  // handle fixed-menu actions
  const handleMenuAction = (action) => {
    if (!tiptapEditor) return;
    console.log("editor value,", tiptapEditor.getText());
    // clear slash menu query
    setQuery("");
    switch (action) {
      case "bold":
        console.log("bold fired");
        tiptapEditor.chain().focus().toggleBold().run();
        break;
      case "italic":
        tiptapEditor.chain().focus().toggleItalic().run();
        break;
      case "strike":
        tiptapEditor.chain().focus().toggleStrike().run();
        break;
      case "bullet":
        tiptapEditor.chain().focus().toggleBulletList().run();
        break;
      case "h1":
        tiptapEditor.chain().focus().toggleHeading({ level: 1 }).run();
        break;

      default:
        console.log("default case");
        break;
    }

    tiptapEditor.commands.focus("end");
  };
  // clear editor text after slash menu click
  const handleMenuItemClick = () => {
    if (tiptapEditor) {
      tiptapEditor.commands.setContent(""); // Clear the content
    }
  };

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
        {/* <FixedMenu onAction={(action) => handleMenuAction(action)} /> */}
        <Tiptap
          onToggleMenu={handleToggleMenu}
          onQueryChange={handleQueryChange}
        />
      </div>
      {showMenu && (
        <div ref={slashMenuRef}>
          <SlashMenu
            handleMenuAction={handleMenuAction}
            query={query}
            handleMenuItemClick={handleMenuItemClick}
          />
        </div>
      )}
    </div>
  );
};

export default CustomTextBox;
