import React, { useCallback, useEffect, useRef, useState } from "react";
import Tiptap from "../../../tiptap/tiptap.jsx";
import SlashMenu from "../SlashMenu/SlashMenu.jsx";
import useGrapesjsEditorStore from "../../../store/GrapesjsEditorStore.jsx";
import { sliceUntilSlash } from "../../../utils/random.js";
import {
  addComponentNextToSelected,
  getTextAfterFirstWhitespace,
} from "../../../utils/grapesjs.js";
import { nanoid } from "nanoid";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import HardbreakExtended from "../../../tiptap/plugins/HardbreakExtension.jsx";
import OrderedList from "@tiptap/extension-ordered-list";

const CustomTextBox = ({
  editor,
  style,
  isBulletList,
  content,
  isOrderedList,
}) => {
  // console.log("isBulletList flag inside custom-text-box", isBulletList);
  // State to manage slash menu visibility
  const [showMenu, setShowMenu] = useState(false);
  const [query, setQuery] = useState("");
  // state for content of tiptap editor
  const [tiptapContent, setTiptapContent] = useState("");
  // ref for slash menu
  const slashMenuRef = useRef(null);
  // psotion of slash menu in text box
  const [slashCoords, setSlashCoords] = useState(null);
  // get tiptapEditor isntance from zustand
  const {
    addTiptapEditor,
    grapesjsEditor,
    getTiptapEditor,
    removeTiptapEditor,
  } = useGrapesjsEditorStore();

  const newTiptapEditor = useEditor({
    extensions: [
      StarterKit,
      HardbreakExtended.configure({
        grapesjsEditor: grapesjsEditor,
      }),
      OrderedList,
    ],
    // This option gives us the control to disable the default behavior of re-rendering the editor on every transaction.
    shouldRerenderOnTransaction: false,

    content: content,

    editorProps: {
      attributes: {
        class: "customTiptapInput",
      },
    },

    autofocus: true,
    // on focus
    onFocus({ editor }) {
      console.log("Tip tap focused is editor destroyed", editor.isDestroyed);
    },
    // add bullet list if flag is set
    onCreate({ editor }) {
      console.log("Tiptap on create=", content);
      // console.log("isBulletList", isBulletList);
      if (isBulletList) {
        // console.log("isBulkletList flag is TRUE");
        editor.chain().focus().toggleBulletList().run();
      }
      if (isOrderedList) {
        // console.log("isBulkletList flag is TRUE");
        editor.chain().focus().toggleOrderedList().run();
      }
    },
    // when editor loses focus
    onBlur() {
      handleToggleMenu(false);
    },

    // onUpdate function, runs on every keystroke
    onUpdate({ editor }) {
      const text = editor.getText(); // Get the full text in the editor
      const lastSlashIndex = text.lastIndexOf("/"); // Find the last position of a slash

      // console.log("Starting update");
      // console.log("slash open=", showMenu);
      // console.log("lastSlashIndex", lastSlashIndex);
      if (lastSlashIndex !== -1) {
        // Ensure there is a space before and after the slash
        // there was conflict between whitespace and keyboard space characters, so we replace first
        const replacedText = text.replace(String.fromCharCode(160), " ");
        const charBefore = replacedText[lastSlashIndex - 1] || "";
        const charAfterQuery = replacedText.slice(lastSlashIndex + 1)[0] || "";
        console.log("charBefore", charBefore.toString());
        console.log("charAfterQuery", charAfterQuery);

        console.log(charBefore === " " || charBefore === "");
        console.log(charAfterQuery === " " || charAfterQuery === "");

        // if slash menu is open followed by query, update query
        if (showMenu && charAfterQuery !== " ") {
          const query = text.slice(lastSlashIndex + 1).split(" ")[0];
          console.log("query=", query);
          handleQueryChange(query);
        }

        // if slash menu is open followed by space, close menu
        if (showMenu && charAfterQuery === " ") {
          console.log("Closing menu");
          handleToggleMenu(false);
          return;
        }
        if (
          (charBefore === " " || charBefore === "") &&
          (charAfterQuery === " " || charAfterQuery === "")
        ) {
          console.log("True");
          // Get the query by extracting everything after the slash until the next space

          handleToggleMenu(true);

          // Get the position of the last slash
          const slashPos =
            editor.state.selection.from - (text.length - lastSlashIndex);
          const slashCoords = editor.view.coordsAtPos(slashPos);

          // Pass the coordinates to CustomTextBox
          handleSlashPositionChange(slashCoords);
        }
        //  else {
        //   // Reset if the conditions are not met
        //   onQueryChange("");
        //   onToggleMenu(false);
        // }
      } else {
        handleQueryChange("");
        handleToggleMenu(false);
      }

      // Pass the updated content back to the parent component
      handleContentChange(editor.getHTML());
    },
  });

  // create a new uniqueId for this comp

  const uniqueId = useRef(nanoid(8)).current;
  console.log("uniqueId", uniqueId);
  const tiptapEditor = getTiptapEditor(uniqueId);
  console.log("Get tiptap editor=", tiptapEditor);
  // useEffect
  useEffect(() => {
    // create a new tiptapEditor instance
    if (!tiptapEditor) addTiptapEditor(uniqueId, newTiptapEditor);
    // addTiptapEditor
    // set content
    setTiptapContent(content);
  }, [content]);

  // handle toggle of slashmenu
  const handleToggleMenu = useCallback((show) => {
    setShowMenu(show);
  }, []);

  // handle slash menu query
  const handleQueryChange = useCallback((newQuery) => {
    console.log("Handling query=", newQuery);
    setQuery(newQuery);
  }, []);

  // handle position change from Tiptap
  const handleSlashPositionChange = (coords) => {
    setSlashCoords(coords);
  };

  const handleContentChange = (newContent) => {
    // console.log(
    //   "handleCotentChange fired",
    //   newContent,
    //   " trait content=",
    //   content
    // );

    if (editor) {
      const comp = editor.getSelected();
      if (comp) {
        // Ensure the selected component is a `custom-text-box`
        if (comp.attributes.type === "custom-text-box") {
          const contentTrait = comp.getTrait("content");
          if (contentTrait) {
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
      case "ordered":
        tiptapEditor.chain().focus().toggleOrderedList().run();
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
  // remove slash from editor after adding comp
  const handleMenuItemClick = () => {
    console.log("rannnn", tiptapEditor);

    if (tiptapEditor) {
      const text = tiptapEditor.getText(); // Get the full text in the editor
      const lastSlashIndex = text.lastIndexOf("/"); // Find the last occurrence of a slash
      const textBeforeSlash = text.slice(0, lastSlashIndex);
      console.log("text==", text);
      console.log("index of slash=-", lastSlashIndex);
      console.log("Setting text before slash", textBeforeSlash);
      tiptapEditor.commands.setContent(textBeforeSlash);

      // if text exists after slash create a new component after the newly added one with that text
      // this text should be counted only if there is a slash followed by space followed by text, if there is no space then its just query
      const textAfterSlash = text.slice(lastSlashIndex + 1);
      console.log("text after slash", textAfterSlash);
      const textWithoutQuery = getTextAfterFirstWhitespace(textAfterSlash);
      const replacedText = textWithoutQuery.replace(
        String.fromCharCode(160),
        " "
      );

      if (replacedText[0] === " ") {
        console.log("Inside text after slash", replacedText);

        // add new comp with remaining text
        addComponentNextToSelected(
          grapesjsEditor,
          {
            type: "custom-text-box",
            traits: [
              {
                label: "Content",
                type: "text",
                name: "content",
                value: replacedText,
              },
            ],
          },
          2
        );
      }
    }
  };

  return (
    <div className="bg-white">
      <Tiptap
        onToggleMenu={handleToggleMenu}
        onQueryChange={handleQueryChange}
        content={tiptapContent}
        onContentChange={handleContentChange}
        grapesjsEditor={grapesjsEditor}
        isBulletList={isBulletList}
        onSlashPositionChange={handleSlashPositionChange}
        showMenu={showMenu}
        tiptapEditor={tiptapEditor}
      />
      {showMenu && (
        <div
          ref={slashMenuRef}
          style={{
            position: "absolute",
            top: slashCoords?.top + 20 ?? 0,
            left: slashCoords?.left + 5 ?? 0,
          }}
        >
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
