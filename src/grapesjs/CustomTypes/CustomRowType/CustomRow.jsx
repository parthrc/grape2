const CustomRow = (editor) => {
  editor.DomComponents.addType("custom-row", {
    isComponent: (el) =>
      el.tagName === "DIV" && el.classList.contains("custom-row"),
    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "custom-row" },
        droppable: true,
        draggable: true,
        // A row always starts with one column
        components: [
          {
            type: "custom-column",
          },
        ],
        // Custom method to determine drop position
        methods: {
          addNewRowOrColumn(droppedComponent, position) {
            console.log("Position=", position);
            if (position === "top" || position === "bottom") {
              console.log("Dropped at top or bottom");
              // Add a new row above or below this row
              this.collection.add(
                { type: "custom-row" },
                { at: position === "top" ? this.index() : this.index() + 1 }
              );
            } else if (position === "left" || position === "right") {
              console.log("Dropped at left or right");
              // Add a new column to this row
              const column = this.get("components").find((comp) =>
                comp.is("custom-column")
              );
              column.components().add(droppedComponent, {
                at: position === "left" ? 0 : column.components().length,
              });
            }
          },
        },
      },

      init() {
        console.log("Init for custom row");
        this.handleDragEvent = this.handleDragEvent.bind(this);
        this.listenTo(this.em, "component:drag", this.handleDragEvent);
      },

      handleDragEvent(dragEvent) {
        console.log("Drag event of custom row", dragEvent);
        console.log("Drag event of custom row");
        // Determine where the component is being dragged and call `addNewRowOrColumn`
        const { target, model } = dragEvent;
        const droppedPosition = this.getDropPosition(model); // Implement this to return 'top', 'bottom', 'left', 'right'
        this.addNewRowOrColumn(target, droppedPosition);
      },

      getDropPosition(model) {
        // Custom logic to determine whether the drop is top, bottom, left, or right
        const { el } = model.view;
        const rect = el.getBoundingClientRect();
        const { clientX, clientY } = model.get("lastPosition");

        const verticalMiddle = rect.top + rect.height / 2;
        const horizontalMiddle = rect.left + rect.width / 2;

        if (clientY < verticalMiddle) return "top";
        if (clientY > verticalMiddle) return "bottom";
        if (clientX < horizontalMiddle) return "left";
        if (clientX > horizontalMiddle) return "right";
      },
    },

    view: {
      onRender({ el }) {
        el.style.width = "100%";
        el.style.minHeight = "50px";
        el.style.display = "flex";
        el.style.flexDirection = "column";
      },
    },
  });

  editor.BlockManager.add("custom-row", {
    label: "Row",
    content: { type: "custom-row" },
    category: "Layout",
  });
};

export default CustomRow;
