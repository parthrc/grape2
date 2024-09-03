const CustomColumn = (editor) => {
  editor.DomComponents.addType("custom-column", {
    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "custom-column" },
        droppable: true,
        draggable: true,
      },
    },

    view: {
      onRender({ el }) {
        el.style.flex = "1"; // Make the column flexible
        el.style.minHeight = "50px";
        el.style.border = "1px dashed #ccc";
      },
    },
  });

  editor.BlockManager.add("custom-column", {
    label: "Column",
    content: { type: "custom-column" },
    category: "Layout",
  });
};

export default CustomColumn;
