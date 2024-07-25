import { Extension } from "@tiptap/core";
import useGrapesjsEditorStore from "../../store/GrapesjsEditorStore.jsx";

// Custom extension to handle Enter key
const CustomEnterExtension = Extension.create({
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        // Prevent default behavior
        editor.chain().focus().run();

        // custom behavior for Enter key
        // get current grarpesjsEditor isntance
        const grapesjsEditor = useGrapesjsEditorStore.getState().editor;
        // add new custom-text-box on Enter key press
        grapesjsEditor.addComponents({ type: "custom-text-box" });

        return true; // Retrun true to indicate Enter key was handled
      },
    };
  },
});

export default CustomEnterExtension;
