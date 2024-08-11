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
        const wrapper = editor.getWrapper();
        const newPage = editor.addComponents({ type: "custom-page" });
        const index = wrapper.indexOf(this.model);
        wrapper.components().add(newPage, { at: index + 1 });
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
