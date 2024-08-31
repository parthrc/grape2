const CustomColumn = (editor) => {
  editor.BlockManager.add("custom-column", {
    label: "Custom Column",
    content: {
      type: "custom-column",
    },
  });

  editor.Components.addType("custom-column", {
    model: {
      defaults: {
        tagName: "div",
        draggable: true,
        droppable: true,
        resizable: true,
        attributes: { class: "custom-column" },
        style: {
          width: "100%",
          padding: "10px",
        },
        components: [],
        traits: [],
        init() {
          this.on("change:components", this.updateColumns);
        },
        updateColumns() {
          const children = this.components();
          const count = children.length;

          if (count === 1) {
            children.at(0).setStyle({ width: "100%" });
          } else if (count === 2) {
            children.at(0).setStyle({ width: "50%", float: "left" });
            children.at(1).setStyle({ width: "50%", float: "left" });
          } else if (count > 2) {
            // Handle more than 2 children, e.g., stack vertically or limit to two
            children.each((child, index) => {
              child.setStyle({ width: `${100 / count}%`, float: "left" });
            });
          }
        },
      },
    },
    view: {
      onRender({ el }) {
        el.style.minHeight = "50px";
      },
    },
  });
};

export default CustomColumn;
