import React from "react";
import useGrapesjsEditorStore from "../../../store/GrapesjsEditorStore.jsx";

const SlashMenu = ({ handleMenuAction }) => {
  // get all blocks
  const { availableBlocks, grapesjsEditor } = useGrapesjsEditorStore();

  //ahndler
  const handleOnClickSlashMenuItem = (block) => {
    // check type of clicked item and proceed accordingly

    // if custom component
    if (block.category === "custom-component") {
      // Create a JSX component from the component ID
      const jsxComponent = React.createElement(block.component_id);
      grapesjsEditor.addComponents(jsxComponent);
    }

    // if tiptap menu item
    if (block.type === "rte") {
      handleMenuAction(block.label);
    }
  };

  console.log("avialable block", availableBlocks);
  return (
    <div
      style={{
        border: "1px solid black",
        position: "absolute",
        background: "white",
        zIndex: "99999",
      }}
    >
      SlashMenu
      {availableBlocks.map((block, index) => {
        // console.log("block=", block.label);
        return (
          <div
            key={index}
            style={{ padding: "5px", cursor: "pointer" }}
            onMouseDown={() => handleOnClickSlashMenuItem(block)}
          >
            {block.label}
          </div>
        );
      })}
    </div>
  );
};

export default SlashMenu;
