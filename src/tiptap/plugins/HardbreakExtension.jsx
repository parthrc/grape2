import HardBreak from "@tiptap/extension-hard-break";

const HardbreakExtended = HardBreak.extend({
  addOptions() {
    return {
      grapesjsEditor: null, // Default value for the GrapesJS editor instance
    };
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => {
        const grapesjsEditor = this.options.grapesjsEditor;
        console.log(
          "GrapesJS Editor instance inside the extension:",
          grapesjsEditor
        );

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
