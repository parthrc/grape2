import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import useGrapesjsEditorStore from "../store/GrapesjsEditorStore.jsx";
import { useEffect } from "react";
import HardbreakExtended from "./plugins/HardbreakExtension.jsx";

const Tiptap = ({
  onToggleMenu,
  onQueryChange,
  content,
  onContentChange,
  onEnterPress,
  grapesjsEditor,
  isBulletList,
  onSlashPositionChange,
  showMenu,
}) => {
  // console.log("Editor inside the TIPTAP component,", grapesjsEditor);
  const { setTiptapEditor, isPreviewMode } = useGrapesjsEditorStore();

  // console.log("Content inside the tiptap==", typeof ccontent);
  const tiptapEditor = useEditor({
    extensions: [
      StarterKit,
      HardbreakExtended.configure({
        grapesjsEditor: grapesjsEditor,
      }),

      // CustomEnterExtension,
      // Placeholder.configure({
      //   placeholder: `start typing or use "/" for commands...`,
      // }),
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
    },
    // when editor loses focus
    onBlur() {
      onToggleMenu(false);
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
          onQueryChange(query);
        }

        // if slash menu is open followed by space, close menu
        if (showMenu && charAfterQuery === " ") {
          console.log("Closing menu");
          onToggleMenu(false);
          return;
        }
        if (
          (charBefore === " " || charBefore === "") &&
          (charAfterQuery === " " || charAfterQuery === "")
        ) {
          console.log("True");
          // Get the query by extracting everything after the slash until the next space

          onToggleMenu(true);

          // Get the position of the last slash
          const slashPos =
            editor.state.selection.from - (text.length - lastSlashIndex);
          const slashCoords = editor.view.coordsAtPos(slashPos);

          // Pass the coordinates to CustomTextBox
          onSlashPositionChange(slashCoords);
        }
        //  else {
        //   // Reset if the conditions are not met
        //   onQueryChange("");
        //   onToggleMenu(false);
        // }
      } else {
        onQueryChange("");
        onToggleMenu(false);
      }

      // Pass the updated content back to the parent component
      onContentChange(editor.getHTML());
    },
  });

  // set tiptapEditor isnatnce to zustand
  useEffect(() => {
    if (tiptapEditor && content) {
      if (tiptapEditor.isActive("bulletList")) {
        tiptapEditor.commands.setContent(content); // Set content if in bullet list format
      } else {
        tiptapEditor.commands.setContent(content); // Default setContent
      }
    }

    if (tiptapEditor) {
      setTiptapEditor(tiptapEditor);
      tiptapEditor.setEditable(!isPreviewMode);
      if (isPreviewMode) {
        onToggleMenu(false);
      }
    }
  }, [tiptapEditor, setTiptapEditor, isPreviewMode, content, onToggleMenu]);

  return (
    <div className="tiptap-container">
      <EditorContent editor={tiptapEditor} />
    </div>
  );
};

export default Tiptap;
