import HardBreak from "@tiptap/extension-hard-break";
import { addComponentNextToSelected } from "../../utils/grapesjs.js";

const HardbreakExtended = HardBreak.extend({
  addOptions() {
    return {
      grapesjsEditor: null, // Default value for the GrapesJS editor instance
    };
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const grapesjsEditor = this.options.grapesjsEditor;
        console.log(
          "GrapesJS Editor instance inside the extension:",
          grapesjsEditor
        );

        // Handle bullet list scenario
        if (editor.isActive("bulletList")) {
          console.log(
            "Bullet list is active, adding a new custom-text-box with bullet list enabled"
          );

          if (grapesjsEditor) {
            const selectedComponent = grapesjsEditor.getSelected();
            console.log("Current selected component = ", selectedComponent);

            if (selectedComponent) {
              const newComponent = grapesjsEditor.addComponents({
                type: "custom-text-box",
                attributes: { isBulletList: true }, // Flag indicating bullet list active
              });

              addComponentNextToSelected(grapesjsEditor, newComponent);
              grapesjsEditor.select(newComponent);
            } else {
              console.log("No component is selected in the GrapesJS editor.");
            }
          } else {
            console.log("GrapesJS Editor instance is not available.");
          }

          return true; // Prevent default behavior
        }

        // Handle ordered list scenario
        if (editor.isActive("orderedList")) {
          console.log(
            "Ordered list is active, adding a new custom-text-box with ordered list enabled"
          );

          if (grapesjsEditor) {
            const selectedComponent = grapesjsEditor.getSelected();
            console.log("Current selected component = ", selectedComponent);

            if (selectedComponent) {
              // Get the current list item
              const listItem = editor.getAttributes();
              const start = listItem.start || 1; // Get the current start number

              // Create the new component with the correct list number
              const newComponent = grapesjsEditor.addComponents({
                type: "custom-text-box",
                attributes: { isOrderedList: true, listStart: start }, // Pass start number
              });

              addComponentNextToSelected(grapesjsEditor, newComponent);
              grapesjsEditor.select(newComponent);
            } else {
              console.log("No component is selected in the GrapesJS editor.");
            }
          } else {
            console.log("GrapesJS Editor instance is not available.");
          }

          return true; // Prevent default behavior
        }

        // Handle default case
        if (grapesjsEditor) {
          console.log("GrapesJS Editor instance is valid:", grapesjsEditor);

          const newComponent = grapesjsEditor.addComponents({
            type: "custom-text-box",
          });

          addComponentNextToSelected(grapesjsEditor, newComponent);
          grapesjsEditor.select(newComponent);
        } else {
          console.log("GrapesJS Editor instance is not available.");
        }

        return true; // Prevent default behavior
      },
    };
  },
});

export default HardbreakExtended;
