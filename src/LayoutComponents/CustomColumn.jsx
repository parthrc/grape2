const CustomColumn = (editor) => {
  // isComponent

  editor.Components.addType("custom-column", {
    isComponent: (el) =>
      el.tagName === "DIV" && el.classList.contains("custom-column"),
    // model definition
    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "custom-column" },
        droppable: true,
        draggable: true,
        resizable: true,
        // A column
        components: [
          {
            type: "custom-text-box",
          },
        ],
        // Default styles
        style: {
          width: "100%",
          padding: "5px",

          color: "#000000",
          border: "1px solid #000000",
          "font-size": "16px",
          "min-height": "50px",
        },
        // custom methods
      },
    },
    // view definition
    // View definition (optional)
    view: {
      onRender() {
        // console.log("CustomColumn rendered");
      },
    },
  });
  // Add the custom component to the Block Manager
  editor.BlockManager.add("custom-column", {
    label: "Custom Column",
    category: "Layout",
    content: { type: "custom-column" },
  });
};
export default CustomColumn;
