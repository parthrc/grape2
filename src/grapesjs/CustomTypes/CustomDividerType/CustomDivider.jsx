const CustomDividerComponent = (editor) => {
  // Custom Divider Component with Plus Sign
  editor.Components.addType("custom-divider", {
    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "custom-divider editor-only" },
        components:
          '<span class="plus-sign" style="font-size: 24px; color: #007bff; cursor: pointer; margin-inline:auto; width: 40px; height: 40px; display: block; ">+</span>',
        layerable: false,
        selectable: true,
      },
    },
    view: {
      events: {
        "click .plus-sign": "addNewPage",
      },
      addNewPage() {
        const parent = this.model.parent(); // Get the parent component
        const currentIndex = this.model.index(); // Get the index of the current custom divider

        // Add the new page immediately after the current custom divider
        const newPage = parent
          .components()
          .add({ type: "custom-page" }, { at: currentIndex + 1 });

        // Add a new custom divider immediately after the new page
        parent
          .components()
          .add({ type: "custom-divider" }, { at: currentIndex + 2 });
      },
    },
  });

  // CSS to Hide Divider in Final Output
  const styleElement = document.createElement("style");
  styleElement.innerHTML = `
      .custom-divider {
        height: 60px; /* Set height to ensure vertical centering works */
        display: flex;
        align-items: center;
        justify-content: center;
      }
        
  
      .editor-only {
        display: block; /* Visible in editor */
      }
      .gjs-frame .editor-only {
        display: none; /* Hidden in final output */
      }
    `;
  document.head.appendChild(styleElement);
};

export default CustomDividerComponent;
