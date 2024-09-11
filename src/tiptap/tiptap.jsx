import { EditorContent, useEditor } from "@tiptap/react";
import useGrapesjsEditorStore from "../store/GrapesjsEditorStore.jsx";
import { useEffect } from "react";

const Tiptap = ({
  onToggleMenu,
  content,
  uniqueId,

  tiptapEditor,
}) => {
  // console.log("Editor inside the TIPTAP component,", grapesjsEditor);
  const { addTiptapEditor, isPreviewMode, getTiptapEditor } =
    useGrapesjsEditorStore();
  // console.log("Content inside the tiptap==", typeof ccontent);

  // set tiptapEditor isnatnce to zustand
  useEffect(() => {
    // set tiptapEditor with uniqueId to zustand

    // if tiptap editor exists with content
    if (tiptapEditor && content) {
      if (tiptapEditor && content) {
        if (tiptapEditor.isActive("bulletList")) {
          console.log("Bullet list is active");
          tiptapEditor.commands.setContent(content); // Set content if in bullet list format
        } else if (tiptapEditor.isActive("orderedList")) {
          console.log("Ordered list is active");
          tiptapEditor.commands.setContent(content); // Set content if in ordered list format
        } else {
          tiptapEditor.commands.setContent(content); // Default setContent
        }
      }
    }
  }, [
    isPreviewMode,
    content,
    onToggleMenu,
    getTiptapEditor,
    uniqueId,
    addTiptapEditor,
    tiptapEditor,
  ]);

  return (
    <div className="tiptap-container">
      <EditorContent editor={tiptapEditor} />
    </div>
  );
};

export default Tiptap;
