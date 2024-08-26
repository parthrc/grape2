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
}) => {
  // console.log("Editor inside the TIPTAP component,", grapesjsEditor);
  const { setTiptapEditor, isPreviewMode } = useGrapesjsEditorStore();
  // Ensure that ccontent has a fallback value
  const initialContent = content || "a";
  console.log("Content inside the tiptap==", typeof ccontent);
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
    content: initialContent,
    // content: `askdljalkjdalkdj`,

    editorProps: {
      attributes: {
        class: "customTiptapInput",
      },
    },

    autofocus: true,
    // add bullet list if flag is set
    onCreate({ editor }) {
      // console.log("Creating tiptap editor...");
      // console.log("isBulletList", isBulletList);
      if (isBulletList) {
        // console.log("isBulkletList flag is TRUE");
        editor.chain().focus().toggleBulletList().run();
      }
    },
    // when editor loses focus
    onBlur() {
      onToggleMenu(false);
      // add new custom-text-box onBlur
      // grapesjsEditor.addComponents({ type: "custom-text-box" });
    },
    // onUpdate function, runs on every keystroke

    onUpdate({ editor }) {
      const text = editor.getText();
      // get index of slash
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

    // Adding custom keyboard shortcuts using addKeyboardShortcuts
    addKeyboardShortcuts() {
      console.log("addKeyboardShortcuts called");
      return {
        Enter: ({ editor }) => {
          console.log("ENter key pressed");
          if (editor.isActive("bulletList")) {
            onEnterPress(editor.getHTML()); // Call the handler passed as a prop
            return true; // Prevent default behavior
          }
          return false;
        },
      };
    },
  });

  // set tiptapEditor isnatnce to zustand
  useEffect(() => {
    console.log("Content inside tiptap=", content);
    if (tiptapEditor) {
      setTiptapEditor(tiptapEditor);
      // set editable status of tiptap based on previewMode
      tiptapEditor.setEditable(!isPreviewMode);
      // disbale slash menu if its open
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
