import React from "react";
import useGrapesjsEditorStore from "../../../store/GrapesjsEditorStore.jsx";
import { addComponentNextToSelected } from "../../../utils/grapesjs.js";

const SlashMenu = ({ handleMenuAction, query, handleMenuItemClick }) => {
  // Get all blocks from the GrapesJS store
  const { availableBlocks, grapesjsEditor } = useGrapesjsEditorStore();

  // Handler for click on slash menu item
  const handleOnClickSlashMenuItem = (block) => {
    console.log("Block=", block);
    console.log("editor", grapesjsEditor);
    if (block.category === "Custom component") {
      addComponentNextToSelected(grapesjsEditor, block.content);

      handleMenuItemClick();
    }

    if (block.type === "rte") {
      // If it's a Tiptap item, execute the related action
      handleMenuAction(block.name);
    }
  };

  // Filter blocks based on query input
  const filteredBlocks = availableBlocks.filter((block) =>
    block.label.toLowerCase().includes(query.toLowerCase())
  );

  // Group the filtered blocks by category
  const groupedBlocks = filteredBlocks.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="absolute py-4 px-2 z-[999999] bg-white drop-shadow-lg flex flex-col gap-2">
      {/* Render grouped blocks based on the query */}
      {Object.keys(groupedBlocks).length ? (
        Object.keys(groupedBlocks).map((category, index) => (
          <div key={index} className=" flex flex-col gap-2">
            <div className=" text-[#807e7e] text-sm">{category}</div>
            {groupedBlocks[category].map((block, blockIndex) => (
              <div
                key={blockIndex}
                className=" flex flex-col gap-2 text-md cursor-pointer px-2 text-[#2b2b2b]"
                onMouseDown={() => handleOnClickSlashMenuItem(block)}
              >
                {block.label}
              </div>
            ))}
          </div>
        ))
      ) : (
        <div style={{ padding: "5px" }}>No results found</div>
      )}
    </div>
  );
};

export default SlashMenu;
