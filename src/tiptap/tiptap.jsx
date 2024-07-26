import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CustomEnterExtension from "./plugins/CustomEnterKeyPlugin.jsx";
import Placeholder from "@tiptap/extension-placeholder";

const Tiptap = ({ onToggleMenu }) => {
  const tiptapEditor = useEditor({
    extensions: [
      StarterKit,
      CustomEnterExtension,
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
    },
    // onUpdate function, runs on every keystroke
    onUpdate({ editor }) {
      const text = editor.getText();
      const lastChar = text.slice(-1);
      if (lastChar === "/") {
        onToggleMenu(true);
      } else {
        onToggleMenu(false);
      }
      console.log("tiptap updated: ", text);
    },
  });

  return <EditorContent editor={tiptapEditor} />;
};

export default Tiptap;
