const CustomRow = (editor) => {
  editor.Components.addType("custom-row", {
    isComponent: (el) =>
      el.tagName === "DIV" && el.classList.contains("custom-row"),

    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "custom-row" },
        droppable: true,
        draggable: true,
        components: [
          {
            type: "custom-column",
          },
        ],
        style: {
          display: "flex",
          padding: "10px",
          "background-color": "#e0f0ff",
          color: "#000000",
          border: "1px solid #0454a8",
          "border-radius": "5px",
          "font-size": "16px",
          "min-height": "50px",
        },
      },

      init() {
        // this.on("component:update", this.adjustColumnWidths);
        // // Listen to the component:add event to handle new components
        // this.listenTo(this.components(), "add", this.adjustColumnWidths);
      },

      adjustColumnWidths() {
        const columns = this.components();
        const columnCount = columns.length;
        console.log("adjustColumnWidths", columnCount);
        console.log("Total columns", columns);

        // Limit to a maximum of 4 columns
        if (columnCount > 4) {
          console.log("Inside columns are more than 4");
          // Remove columns added after the 4th
          for (let i = columnCount - 1; i >= 4; i--) {
            console.log("Column at ", i, " is ", columns.at(i));
            columns.at(i).remove();
          }
        }

        // Wrap any new components in columns
        columns.each((column, index) => {
          console.log("Each column=", column);
          console.log("Each column=", column.attributes.type);
          const currentStyle = column.getStyle();
          if (index < 4) {
            column.setStyle({
              ...currentStyle,
              width: `${100 / Math.min(columnCount, 4)}%`,
            });

            // Ensure that any direct children are wrapped in a custom-column
            // const childComponents = column.components();
            // childComponents.each((child) => {
            //   //   console.log("Child type=", child.get("type"));
            //   if (child.get("type") !== "custom-column") {
            //     column.append({
            //       type: "custom-column",
            //       components: [child.clone()],
            //     });
            //     child.remove();
            //   }
            // });
          }
        });
      },
    },

    view: {
      onRender() {
        console.log("CustomRow rendered");
      },
    },
  });

  editor.BlockManager.add("custom-row", {
    label: "Custom Row",
    category: "Layout",
    content: { type: "custom-row" },
  });
};

export default CustomRow;
