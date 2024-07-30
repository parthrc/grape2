import { FaPlus } from "react-icons/fa";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import useGrapesjsEditorStore from "../../../store/GrapesjsEditorStore.jsx";
const CustomDivider = () => {
  const { grapesjsEditor } = useGrapesjsEditorStore();

  // add new Page
  const handleAddNewPage = () => {
    const newPageContent = "<div>New Page Content</div>";
    grapesjsEditor.addComponents({ type: "custom-text-box" });
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
      <div onClick={handleAddNewPage}>
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
