import { useEffect, useMemo, useState } from "react";
import { FiFilm } from "react-icons/fi";
import useGrapesjsEditorStore from "../../../store/GrapesjsEditorStore.jsx";
import SidebarItem from "./SidebarItem.jsx";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import {
  DndContext,
  useSensors,
  useSensor,
  PointerSensor,
} from "@dnd-kit/core";

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
  const {
    grapesjsEditor,
    canvasPages = [],
    setCanvasPages,
  } = useGrapesjsEditorStore();
  // console.log("Canvas pages START", canvasPages);

  // console.log("Outside memo canvasPages", canvasPages);
  const [pagesIds, setPagesIds] = useState([]);

  // Update pagesIds whenever canvasPages changes
  useEffect(() => {
    // console.log("use effect running");
    setPagesIds(canvasPages.map((page) => page.id));
  }, [canvasPages]);

  // create ID's for sortable context of DND-KIT for dragging
  // const pagesIds = useMemo(() => {
  //   console.log("Inside memo canvasPages");

  //   return canvasPages.map((page) => page.id);
  // }, [canvasPages]);

  // track current dragged sidebar item
  const [activeDragPage, setActiveDragPage] = useState(null);
  // track side item over which the currently dragged sidebaritem resides
  const [activeDragOver, setActiveDragOver] = useState(null);

  //start DRAG event only if user is trying to drag,
  //not jsut cliking on the delete button
  const sensors = useSensors(
    //we are using pointer sensor
    useSensor(PointerSensor, {
      //activated when moved by atleast 3px
      activationConstraint: {
        distance: 3,
      },
    })
  );

  // callback when drag event starts
  function onDragStart(event) {
    console.log("drag start");
    // check if drag event is "PageSidebarItem"
    // useful if in future, we add other draggable elements
    if (event.active.data.current?.type === "PageSidebarItem") {
      setActiveDragPage(event.active.data.current.page);
      return;
    }
  }

  // callback when drag event ends
  //this fires when we drag and leave an element
  //now there are three cases
  //if the dragged element was let go on NO other element
  //if dragged element was let go on the same element
  //if dragged element was let go on another element
  function onDragEnd(event) {
    console.log("Drag end fired");
    setActiveDragPage(null);
    setActiveDragOver(null);

    //We get info of the active and over objects from the event
    const { active, over } = event;
    // Case 1: let go, not on any other element
    if (!over) {
      console.log("No over");
      return;
    }
    // get Id of the actively dragged item
    // get Id of the over sidebar item
    const activeSidebarItemId = active.id;
    const activeOverItemId = over.id;

    // Case 2: let go on the same spot
    if (activeSidebarItemId === activeOverItemId) {
      console.log("Same spot");
      return;
    }

    // Case 3: let on other spot
    //Swap places in our columns state of the columns
    console.log("Now running setCanvasPages");
    //find index of currently dragged element in our STATE canvasPages
    const activeItemIndex = canvasPages.findIndex(
      (page) => page.id === activeSidebarItemId
    );
    // find index of the current over item in canvasPages
    const activeOverIndex = canvasPages.findIndex(
      (page) => page.id === activeOverItemId
    );
    //arrayMove is dnd-kit function which is used to swap places of two elements in an array
    console.log("canvasPages before arrayMove", canvasPages);
    const final = arrayMove(canvasPages, activeItemIndex, activeOverIndex);
    console.log("Final", final);

    setCanvasPages(final);
    console.log("Last return");
    return;
  }

  // sidebar toggle handler
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
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        sensors={sensors}
      >
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
                <SortableContext items={pagesIds}>
                  {canvasPages.map((page) => {
                    console.log(page);
                    return (
                      <SidebarItem key={page.id} page={page}></SidebarItem>
                    );
                  })}
                </SortableContext>
              </div>
            )}
          </div>
        )}
      </DndContext>
    </div>
  );
};

export default FloatingPagesSidebar;
