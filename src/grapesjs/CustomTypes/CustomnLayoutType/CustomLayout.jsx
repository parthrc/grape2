const CustomLayout = (editor) => {
  editor.BlockManager.add("custom-layout", {
    label: "Custom Layout",
    content: {
      type: "custom-layout",
    },
  });

  editor.Components.addType("custom-layout", {
    model: {
      defaults: {
        tagName: "div",
        draggable: true,
        droppable: true,
        attributes: { class: "custom-layout" },
        style: {
          display: "flex",
          flexWrap: "wrap",
          padding: "10px",
          width: "100%",
          minHeight: "50px",
          boxSizing: "border-box",
        },
        components: [],
        traits: [],
        initialize() {
          console.log("Custom layout component initialized");
          this.on("component:dragend", this.updateLayout);
        },
        updateLayout(droppedComponent) {
          const parentEl = this.view.el;

          // Calculate the position of the drop
          const dropPosition = this.getDropPosition(
            parentEl,
            droppedComponent.view.el
          );

          // Adjust flex direction and child styles based on drop position
          if (dropPosition === "top" || dropPosition === "bottom") {
            parentEl.style.flexDirection = "column";
            droppedComponent.addStyle({
              width: "100%",
              boxSizing: "border-box",
            });
            if (dropPosition === "top") {
              parentEl.insertBefore(
                droppedComponent.view.el,
                parentEl.firstChild
              );
            } else {
              parentEl.appendChild(droppedComponent.view.el);
            }
          } else if (dropPosition === "left" || dropPosition === "right") {
            parentEl.style.flexDirection = "row";
            droppedComponent.addStyle({
              width: "50%",
              boxSizing: "border-box",
            });
            if (dropPosition === "left") {
              parentEl.insertBefore(
                droppedComponent.view.el,
                parentEl.firstChild
              );
            } else {
              parentEl.appendChild(droppedComponent.view.el);
            }
          }

          // Force the parent container to update its layout
          parentEl.style.display = "flex";
          parentEl.style.width = "100%";
          parentEl.style.boxSizing = "border-box";
        },
        getDropPosition(parentEl, droppedEl) {
          const parentRect = parentEl.getBoundingClientRect();
          const droppedRect = droppedEl.getBoundingClientRect();

          const dropLeft = droppedRect.left - parentRect.left;
          const dropRight = parentRect.right - droppedRect.right;
          const dropTop = droppedRect.top - parentRect.top;
          const dropBottom = parentRect.bottom - droppedRect.bottom;

          const min = Math.min(dropLeft, dropRight, dropTop, dropBottom);

          if (min === dropLeft) return "left";
          if (min === dropRight) return "right";
          if (min === dropTop) return "top";
          if (min === dropBottom) return "bottom";
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

export default CustomLayout;
