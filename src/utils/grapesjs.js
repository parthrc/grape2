const addComponentNextToSelected = (editor, newComponent) => {
  const selected = editor.getSelected();
  if (selected) {
    const parent = selected.parent();
    const index = parent.components().indexOf(selected);
    parent.append(newComponent, { at: index + 1 });
  } else {
    console.warn("No component selected");
  }
};

export default addComponentNextToSelected;
