import { getPositionOfChild, reloadIframe } from "../utils/grapesjs-utils.js";

const CustomRow = (editor) => {
  editor.Components.addType("custom-row", {
    isComponent: (el) =>
      el.tagName === "DIV" && el.classList.contains("custom-row"),

    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "custom-row" },
        droppable: (targetComp, destinationComp) => {
          if (destinationComp.components().length > 3) return false;
          return true;
        },
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
        // Listen to the component:add event to handle new components
        // this.listenTo(this.components(), "add", this.adjustColumnWidths);
      },

      // adjustColumnWidths(model) {
      //   this.off(this.components(), "add", this.adjustColumnWidths);

      //   const columns = this.components();
      //   const columnCount = columns.length;
      //   const parent = model.parent();
      //   console.log("Current colums", columns);
      //   //get postiion of dropped comp
      //   const position = getPositionOfChild(model);
      //   console.log("Position of new dropepd comp", position);
      //   // get the newly added component
      //   const latestAddedComp = parent.getChildAt(position);
      //   // wrap newly added comp with custom column
      //   latestAddedComp.replaceWith(
      //     {
      //       type: "custom-column",
      //       components: [latestAddedComp.clone()],
      //     },
      //     { at: position }
      //   );
      //   // set widths based on number of columns by updating the style trait
      //   columns.each((column, index) => {
      //     const currentStyle = column.getStyle();
      //     if (index < 4) {
      //       column.setStyle({
      //         ...currentStyle,
      //         width: `${100 / Math.min(columnCount, 4)}%`,
      //       });
      //     }
      //   });
      //   this.on(this.components(), "add", this.adjustColumnWidths);
      // },
    },

    view: {
      onRender() {
        // console.log("CustomRow rendered");
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
