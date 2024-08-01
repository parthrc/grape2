import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SidebarItem = ({ page }) => {
  // Dragging logic
  //to make an task draggable
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: page.id,
    data: {
      type: "PageSidebarItem",
      page,
    },
  });

  const styles = {
    pagesOverviewItem: {
      border: "2px solid red",
      padding: "0.5rem",
      cursor: "pointer",
      // below two properties for animating the dragging
      transition,
      transform: CSS.Transform.toString(transform),
    },
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={styles.pagesOverviewItem}
    >
      {page.id}
    </div>
  );
};

export default SidebarItem;
