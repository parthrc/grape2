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
          padding: "5px",
          
          color: "#000000",
          border: "1px solid #000000",

          "font-size": "16px",
          "min-height": "50px",
        },
      },

      init() {},
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
