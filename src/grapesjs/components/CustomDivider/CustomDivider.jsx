import { FaPlus } from "react-icons/fa";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import useGrapesjsEditorStore from "../../../store/GrapesjsEditorStore.jsx";
import { v4 as uuidv4 } from "uuid";

const CustomDivider = () => {
  const { grapesjsEditor, addCanvasPage, canvasPages } =
    useGrapesjsEditorStore();

  const handleAddNewPage = () => {
    const newPageId = uuidv4();
    const newPageContent = `<div>New Page Content for ${newPageId}</div>`;
    // const pageManager = grapesjsEditor.Pages;
    // add new page to pageManager
    // pageManager.add({
    //   id: newPageId,
    //   styles: `.my-class { color: red }`,
    //   component: `<div class="my-class">${newPageContent}</div>`,
    // });

    // add new page to our zustand store
    addCanvasPage({
      id: canvasPages.length + 1,
      content: newPageContent,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        padding: "1rem",
        marginBlock: "5px",
        justifyContent: "center",
        alignItems: "center",
        gap: "1.5rem",
        width: "fit-content",
        marginInline: "auto",
        border: "1px solid black",
        borderRadius: "10px",
        boxShadow: "2px 2px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div onClick={handleAddNewPage} style={{ cursor: "pointer" }}>
        <FaPlus />
      </div>
      <div>
        <FaWandMagicSparkles />
      </div>
      <div>
        <FaChevronDown />
      </div>
    </div>
  );
};

export default CustomDivider;
