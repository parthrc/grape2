import { useState } from "react";
import { FiFilm } from "react-icons/fi";
import useGrapesjsEditorStore from "../../../store/GrapesjsEditorStore.jsx";

const styles = {
  container: {
    backgroundColor: "white",
    paddingInline: "1rem",
    paddingBlock: "0.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "1px solid #bbbaba",
    borderRadius: "10px",
    boxShadow: "2px 2px rgba(0, 0, 0, 0.1)",
  },
  xBtn: {
    cursor: "pointer",
    paddingInline: "0.7rem",
    paddingBlock: "1rem",
  },
  filmBtn: {
    cursor: "pointer",
    paddingInline: "0.7rem",
    paddingBlock: "1rem",
    backgroundColor: "white",
    border: "1px solid #bbbaba",
    borderRadius: "10px",
    boxShadow: "2px 2px rgba(0, 0, 0, 0.1)",
  },
  pagesOverviewContainer: {
    border: "1px solid blue",
    padding: "0.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
  },
  pagesOverviewItem: {
    border: "2px solid red",
    padding: "0.5rem",
  },
};

const FloatingPagesSidebar = ({ pages, selected, add, select, remove }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { grapesjsEditor, canvasPages } = useGrapesjsEditorStore();

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    // const json = grapesjsEditor.getComponents();
    // const projectData = grapesjsEditor.getProjectData();
    // console.log("canvasPages: ", canvasPages);

    // // looping
    // canvasPages.map((model, index) => {
    //   console.log(index, "=", model);
    // });
  };

  return (
    <div>
      {!isSidebarOpen && (
        <div onClick={handleToggleSidebar} style={styles.filmBtn}>
          <FiFilm />
        </div>
      )}
      {isSidebarOpen && (
        <div style={styles.container}>
          <div onClick={handleToggleSidebar} style={styles.xBtn}>
            X
          </div>

          {canvasPages.length === 0 && <div>No pages yet</div>}
          {canvasPages.length > 0 && (
            <div style={styles.pagesOverviewContainer}>
              {canvasPages.map((page) => {
                console.log(page);
                return (
                  <div key={page.id} style={styles.pagesOverviewItem}>
                    {page.id}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FloatingPagesSidebar;
