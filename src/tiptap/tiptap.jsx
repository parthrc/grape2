import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTiptapEditor } from "../store/Redux store/grapesjsSlice.jsx";

const Tiptap = ({ onToggleMenu, onQueryChange }) => {
  const dispatch = useDispatch();
  const isPreviewMode = useSelector((state) => state.isPreviewMode);
  const tiptapEditor = useEditor({
    extensions: [
      StarterKit,
      // CustomEnterExtension,
      Placeholder.configure({
        placeholder: `start typing or use "/" for commands...`,
      }),
    ],
    // content: ``,
    editorProps: {
      attributes: {
        class: "customTiptapInput",
      },
    },

    autofocus: true,
    // when editor loses focus
    onBlur() {
      onToggleMenu(false);
      // add new custom-text-box onBlur
      // grapesjsEditor.addComponents({ type: "custom-text-box" });
    },
    // onUpdate function, runs on every keystroke
    // onUpdate({ editor }) {
    //   const text = editor.getText();
    //   const lastChar = text.slice(-1);
    //   if (lastChar === "/") {
    //     onToggleMenu(true);
    //   } else {
    //     onToggleMenu(false);
    //   }
    //   console.log("tiptap updated: ", text);
    // },
    onUpdate({ editor }) {
      const text = editor.getText();
      const lastSlashIndex = text.lastIndexOf("/");
      if (lastSlashIndex !== -1) {
        const query = text.substring(lastSlashIndex + 1);
        onQueryChange(query);
        onToggleMenu(true);
      } else {
        onQueryChange("");
        onToggleMenu(false);
      }
      console.log("tiptap updated: ", text);
    },
  });

  // set tiptapEditor isnatnce to zustand
  useEffect(() => {
    if (tiptapEditor) {
      dispatch(setTiptapEditor(tiptapEditor));
      // set editable status of tiptap based on previewMode
      tiptapEditor.setEditable(!isPreviewMode);
    }
  }, [tiptapEditor, isPreviewMode, dispatch]);

  return (
    <div className="tiptap-container">
      <EditorContent editor={tiptapEditor} />
    </div>
  );
};

export default Tiptap;
