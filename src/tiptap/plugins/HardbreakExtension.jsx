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

        // Check if the bullet list is active, add custom textbox with bullet active
        // if (editor.isActive("bulletList")) {
        //   console.log(
        //     "Bullet list is active, adding a new custom-text-box with bullet list enabled"
        //   );

        //   if (grapesjsEditor) {
        //     // Add a new custom-text-box component with the bullet list active
        //     const comp = grapesjsEditor.getSelected();
        //     console.log("Current slected component = ", comp);
        //     if (comp) {
        //       const newComponent = grapesjsEditor.addComponents({
        //         type: "custom-text-box",
        //         // handle initializing tiptap with bullet list active
        //         attributes: { isBulletList: true },
        //       });
        //       const parent = comp.parent();
        //       console.log("Parent of selected component", parent);
        //       const index = parent.components().indexOf(comp);
        //       console.log(
        //         "Index of selected comp inside the parent component",
        //         index
        //       );
        //       parent.components().add(newComponent, { at: index + 1 });
        //       // focus on the new component added
        //       grapesjsEditor.select(newComponent);
        //     } else {
        //       console.log("GrapesJS Editor instance is not available.");
        //     }
        //   }

        //   return true; // Prevent default behavior, since we're handling it customly
        // }

        if (editor.isActive("bulletList")) {
          console.log(
            "Bullet list is active, adding a new custom-text-box with bullet list enabled"
          );

          if (grapesjsEditor) {
            // Get the currently selected component
            const selectedComponent = grapesjsEditor.getSelected();
            console.log("Current selected component = ", selectedComponent);

            if (selectedComponent) {
              // Create the new component
              const newComponent = grapesjsEditor.addComponents({
                type: "custom-text-box",
                attributes: { isBulletList: true }, // Pass the flag to indicate bullet list active
              });

              addComponentNextToSelected(grapesjsEditor, newComponent);
              // Focus on the newly added component
              grapesjsEditor.select(newComponent);
            } else {
              console.log("No component is selected in the GrapesJS editor.");
            }
          } else {
            console.log("GrapesJS Editor instance is not available.");
          }

          return true; // Prevent default behavior
        }

        // custom enter key behavior when bullet list is not active
        if (grapesjsEditor !== null && grapesjsEditor !== undefined) {
          console.log("GrapesJS Editor instance is valid:", grapesjsEditor);
          const newComponent = grapesjsEditor.addComponents({
            type: "custom-text-box",
          });

          addComponentNextToSelected(grapesjsEditor, newComponent);
          // Focus on the newly added component
          grapesjsEditor.select(newComponent);
        } else {
          console.log("GrapesJS Editor instance is not available.");
        }
        // console.log("No grapesjs inside");
        return true;
      },
    };
  },
});

export default HardbreakExtended;
