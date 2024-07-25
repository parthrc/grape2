import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CustomEnterExtension from "./plugins/CustomEnterKeyPlugin.jsx";
import Placeholder from "@tiptap/extension-placeholder";

const Tiptap = () => {
  const tiptapEditor = useEditor({
    extensions: [
      StarterKit,
      CustomEnterExtension,
      Placeholder.configure({
        placeholder: `start typing or use "/" for commands...`,
      }),
    ],
    // content: ``,

    autofocus: true,
    // onUpdate function, runs on every keystroke
    onUpdate({ editor }) {
      console.log("tiptap updated: ", editor.getText());
      console.log("Pressed=");
    },
  });

  return <EditorContent editor={tiptapEditor} />;
};

export default Tiptap;
