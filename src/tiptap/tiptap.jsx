import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const Tiptap = () => {
  const tiptapEditor = useEditor({
    extensions: [StarterKit],
    content: "Hello tiptap",
  });

  return <EditorContent editor={tiptapEditor} />;
};

export default Tiptap;
