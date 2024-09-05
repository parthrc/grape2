import React, { useCallback, useEffect, useRef, useState } from "react";
import Tiptap from "../../../tiptap/tiptap.jsx";
import SlashMenu from "../SlashMenu/SlashMenu.jsx";
import useGrapesjsEditorStore from "../../../store/GrapesjsEditorStore.jsx";
import { sliceUntilSlash } from "../../../utils/random.js";

const CustomTextBox = ({ editor, style, isBulletList, content }) => {
  // console.log("isBulletList flag inside custom-text-box", isBulletList);
  // State to manage slash menu visibility
  const [showMenu, setShowMenu] = useState(false);
  const [query, setQuery] = useState("");
  // state for content of tiptap editor
  const [tiptapContent, setTiptapContent] = useState("");
  // ref for slash menu
  const slashMenuRef = useRef(null);

  // useEffect(() => {
  //   // get content from traits
  //   console.log("Content from traits", content);
  //   setTiptapContent(content);
  //   const handleComponentDragStart = (component) => {
  //     // Only run if the event is for a custom-text-box
  //     if (component?.target?.attributes?.type === "custom-text-box") {
  //       console.log("Drag start for:", component.target.attributes);

  //       const contentTrait = component.target.getTrait("content");
  //       console.log("Contenttrait dragSTART", contentTrait);
  //       if (contentTrait) {
  //         console.log("Saving content before drag:", tiptapContent);
  //         contentTrait.setValue(content);
  //       }
  //     }
  //   };

  //   const handleComponentDragEnd = (component) => {
  //     // Only run if the event is for a custom-text-box
  //     if (component?.target?.attributes?.type === "custom-text-box") {
  //       console.log("Drag end for:", component.target);

  //       const contentTrait = component.target.getTrait("content").attributes;
  //       console.log("Contenttrait dragEND");

  //       if (contentTrait) {
  //         const contentValue = contentTrait.value;
  //         console.log("Content value END", contentValue);
  //         if (contentValue) {
  //           console.log("Restoring content after drag:", contentValue);
  //           setTiptapContent(contentValue);
  //         }
  //       }
  //     }
  //   };

  //   if (editor) {
  //     console.log("Editor exists in ctb useEffect");
  //     editor.on("component:drag:start", handleComponentDragStart);
  //     editor.on("component:drag:end", handleComponentDragEnd);
  //   }

  //   return () => {
  //     if (editor) {
  //       editor.off("component:drag:start", handleComponentDragStart);
  //       editor.off("component:drag:end", handleComponentDragEnd);
  //     }
  //   };
  // }, [editor, tiptapContent, content]);

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
    console.log("handleCotentChange fired", newContent);
    setTiptapContent(newContent);

    console.log("Editor isntance=", editor);
    if (editor) {
      const comp = editor.getSelected();
      if (comp) {
        // console.log("Comp==", comp);
        // Ensure the selected component is a `custom-text-box`
        if (comp.attributes.type === "custom-text-box") {
          // console.log("Yes its a custom textbox");
          const contentTrait = comp.getTrait("content");
          if (contentTrait) {
            // console.log(
            //   "Setting value on update",
            //   newContent,
            //   "contentTrait=",
            //   contentTrait
            // );
            contentTrait.setValue(newContent);
          }
        } else {
          console.log("No component is selected in GrapesJS editor.");
        }
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
    console.log("Running focus command");
    tiptapEditor.commands.focus("end");
  };
  // clear editor text after slash menu click
  const handleMenuItemClick = () => {
    if (tiptapEditor) {
      tiptapEditor.commands.setContent(""); // Clear the content
    }
  };

  // handle custom behaviour for bullet list
  // const handleEnterPress = useCallback(
  //   (currentContent) => {
  //     if (editor) {
  //       const comp = editor.getSelected();
  //       if (comp) {
  //         const newComponent = editor.addComponents({
  //           type: "custom-text-box",
  //           content: "<ul>" + currentContent + "</ul>", // Pass the bullet list content
  //           props: { isBulletList: true }, // Pass the flag
  //         });

  //         const parent = comp.parent();
  //         const index = parent.components().indexOf(comp);
  //         parent.components().add(newComponent, { at: index + 1 });

  //         editor.select(newComponent);
  //       }
  //     }
  //   },
  //   [editor]
  // );

  const styles = {
    container: {
      border: "1px solid black",
      backgroundColor: "white",
      transition: "background-color 0.3s",
      padding: "50px",
      position: "relative",
    },

    innerBox: {
      margin: "1px",
      padding: "50px",
    },
  };

  return (
    <div style={styles.innerBox}>
      <Tiptap
        onToggleMenu={handleToggleMenu}
        onQueryChange={handleQueryChange}
        ccontent={tiptapContent}
        onContentChange={handleContentChange}
        grapesjsEditor={grapesjsEditor}
        isBulletList={isBulletList}
      />
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
