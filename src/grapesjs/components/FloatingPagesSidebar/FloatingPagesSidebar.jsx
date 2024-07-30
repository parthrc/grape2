import { useState } from "react";
import { FiFilm } from "react-icons/fi";

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
};

const FloatingPagesSidebar = ({ pages, selected, add, select, remove }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  console.log("Pages=", pages[0]);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
          <div>Sidebar</div>
          {pages &&
            pages.map((page, index) => {
              return <div key={index}>{page.getName() + "a"}</div>;
            })}
        </div>
      )}
    </div>
  );
};

export default FloatingPagesSidebar;
