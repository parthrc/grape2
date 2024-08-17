import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import useGrapesjsEditorStore from "../store/GrapesjsEditorStore.jsx";
import { useEffect } from "react";

const Tiptap = ({ onToggleMenu, onQueryChange, content, onContentChange }) => {
  const { setTiptapEditor, isPreviewMode } = useGrapesjsEditorStore();
  const tiptapEditor = useEditor({
    extensions: [
      StarterKit,
      // CustomEnterExtension,
      Placeholder.configure({
        placeholder: `start typing or use "/" for commands...`,
      }),
    ],
    content: content,

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

      // Pass the updated content back to the parent component
      onContentChange(editor.getHTML());
    },
  });

  // set tiptapEditor isnatnce to zustand
  useEffect(() => {
    console.log("Content inside tiptap=", content);
    if (tiptapEditor) {
      setTiptapEditor(tiptapEditor);
      // set editable status of tiptap based on previewMode
      tiptapEditor.setEditable(!isPreviewMode);
    }
  }, [tiptapEditor, setTiptapEditor, isPreviewMode]);

  return (
    <div className="tiptap-container">
      <EditorContent editor={tiptapEditor} />
    </div>
  );
};

export default Tiptap;
