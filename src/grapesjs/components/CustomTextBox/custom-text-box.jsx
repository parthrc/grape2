import React, { useCallback, useEffect, useRef, useState } from "react";
import Tiptap from "../../../tiptap/tiptap.jsx";
import SlashMenu from "../SlashMenu/SlashMenu.jsx";
import useGrapesjsEditorStore from "../../../store/GrapesjsEditorStore.jsx";
import { sliceUntilSlash } from "../../../utils/random.js";

const CustomTextBox = ({ editor, style }) => {
  // State to manage slash menu visibility
  const [showMenu, setShowMenu] = useState(false);
  const [query, setQuery] = useState("");
  // state for content of tiptap editor
  const [tiptapContent, setTiptapContent] = useState("hello");
  // ref for slash menu
  const slashMenuRef = useRef(null);

  // get saved content from traits
  useEffect(() => {
    if (editor) {
      // get currently selected component
      const comp = editor.getSelected();
      // run only if currently selected component is custom-page
      if (comp && comp.attributes.type === "custom-page") {
        setTiptapContent(comp.getTrait("content").get("value"));
      }
    }
  }, [editor]);

  // get tiptapEditor isntance from zustand
  const { tiptapEditor, grapesjsEditor } = useGrapesjsEditorStore();

  // handle toggle of slashmenu
  const handleToggleMenu = useCallback((show) => {
    setShowMenu(show);
  }, []);

  // handle slash menu query
  const handleQueryChange = useCallback((newQuery) => {
    setQuery(newQuery);
  }, []);

  const handleContentChange = (newContent) => {
    console.log("handleCotentChange fired");
    setTiptapContent(newContent);
    // console.log("Editor isntance=", editor);
    if (editor) {
      const comp = editor.getSelected();
      if (comp) {
        // console.log("Comp==", comp);
        const contentTrait = comp.getTrait("content");
        if (contentTrait) {
          contentTrait.set("value", newContent);
        }
      } else {
        console.log("No component is selected in GrapesJS editor.");
      }
    }
  };

  // handle fixed-menu actions
  const handleMenuAction = (action) => {
    if (!tiptapEditor) return;

    // Remove the slash from teh text before executing the rte fucntions
    tiptapEditor.commands.setContent(sliceUntilSlash(tiptapEditor.getText()));

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

  // handle custom behaviour for bullet list
  const handleEnterPress = useCallback(
    (currentContent) => {
      if (editor) {
        const comp = editor.getSelected();
        if (comp) {
          const newComponent = editor.addComponents({
            type: "custom-text-box",
            content: "<ul>" + currentContent + "</ul>", // Pass the bullet list content
          });

          const parent = comp.parent();
          const index = parent.components().indexOf(comp);
          parent.components().add(newComponent, { at: index + 1 });

          editor.select(newComponent);
        }
      }
    },
    [editor]
  );

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
    <div className="bg-blue-50">
      <div style={styles.innerBox}>
        {/* <FixedMenu onAction={(action) => handleMenuAction(action)} /> */}
        <Tiptap
          onToggleMenu={handleToggleMenu}
          onQueryChange={handleQueryChange}
          content={tiptapContent}
          onContentChange={handleContentChange}
          grapesjsEditor={grapesjsEditor}
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
