import HardBreak from "@tiptap/extension-hard-break";

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
        if (editor.isActive("bulletList")) {
          console.log(
            "Bullet list is active, adding a new custom-text-box with bullet list enabled"
          );

          if (grapesjsEditor) {
            // Add a new custom-text-box component with the bullet list active
            grapesjsEditor.addComponents({
              type: "custom-text-box",
              // handle initializing tiptap with bullet list active
              attributes: { isBulletList: true },
            });
          } else {
            console.log("GrapesJS Editor instance is not available.");
          }

          return true; // Prevent default behavior, since we're handling it customly
        }

        // custom enter key behavior when bullet list is not active
        if (grapesjsEditor !== null && grapesjsEditor !== undefined) {
          console.log("GrapesJS Editor instance is valid:", grapesjsEditor);
          grapesjsEditor.addComponents({ type: "custom-text-box" });
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
