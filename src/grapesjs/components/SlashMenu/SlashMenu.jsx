import React from "react";
import useGrapesjsEditorStore from "../../../store/GrapesjsEditorStore.jsx";
import addComponentNextToSelected from "../../../utils/grapesjs.js";

const SlashMenu = ({ handleMenuAction, query, handleMenuItemClick }) => {
  // get all blocks
  const { availableBlocks, grapesjsEditor } = useGrapesjsEditorStore();

  //ahndler
  const handleOnClickSlashMenuItem = (block) => {
    // addComponentNextToSelected(grapesjsEditor);
    // check type of clicked item and proceed accordingly

    // if custom component
    if (block.category === "custom-component") {
      // Create a JSX component from the component ID
      const jsxComponent = React.createElement(block.component_id);
      // add new component next to the currently clicked element
      addComponentNextToSelected(grapesjsEditor, jsxComponent);
      // grapesjsEditor.addComponents(jsxComponent);

      handleMenuItemClick();
    }

    // if tiptap menu item
    if (block.type === "rte") {
      handleMenuAction(block.label);
    }

    console.log("Final after both clicks");
  };

  // filter blocks based on query
  const filteredBlocks = availableBlocks.filter((block) =>
    block.label.toLowerCase().includes(query.toLowerCase())
  );

  // console.log("avialable block", availableBlocks);
  return (
    <div
      style={{
        border: "1px solid black",
        position: "absolute",
        background: "white",
        zIndex: "99999",
      }}
    >
      {filteredBlocks.map((block, index) => {
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
