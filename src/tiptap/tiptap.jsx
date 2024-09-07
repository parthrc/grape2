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

    content: content, // Ensure content has a fallback
    // content: `askdljalkjdalkdj`,

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
      // console.log("tiptap updated: ", text);

      // Pass the updated content back to the parent component
      onContentChange(editor.getHTML());
    },

    // Adding custom keyboard shortcuts using addKeyboardShortcuts
    addKeyboardShortcuts() {
      return {
        Enter: ({ editor }) => {
          // Check if the editor is active in bullet list mode
          if (editor.isActive("bulletList")) {
            // Handle Enter key differently for bullet lists
            editor.commands.insertContent("<li>New item</li>"); // Example for adding a new item
            return true; // Prevent default behavior
          }

          // Handle Enter key in other contexts if needed
          return false;
        },
        // Define other shortcuts if necessary
      };
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
