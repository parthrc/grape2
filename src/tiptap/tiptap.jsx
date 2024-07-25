import HardBreak from "@tiptap/extension-hard-break";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CustomEnterExtension from "./plugins/CustomEnterKeyPlugin.jsx";

const Tiptap = () => {
  const tiptapEditor = useEditor({
    extensions: [
      StarterKit,
      CustomEnterExtension,
      //   HardBreak.extend({
      //     addKeyboardShortcuts() {
      //       return {
      //         Enter: (e) => {
      //           e.preventDefault();
      //           console.log("Enter pressed");
      //           return;
      //         },
      //       };
      //     },
      //   }),
    ],
    content: "Hello tiptap",
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
