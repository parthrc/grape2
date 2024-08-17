// const addComponentNextToSelected = (editor, newComponent) => {
//   const selected = editor.getSelected();
//   if (selected) {
//     const parent = selected.parent();
//     const index = parent.components().indexOf(selected);
//     parent.append(newComponent, { at: index + 1 });
//   } else {
//     console.log("No component selected");
//   }
// };

// export default addComponentNextToSelected;

const addComponentNextToSelected = (editor, newComponent) => {
  const selected = editor.getSelected();
  console.log("inside addComponentNextToSelected=", selected);
  if (selected) {
    const parent = selected.parent();
    console.log("parent=", parent.components());
    const index = parent.components().indexOf(selected);
    console.log("Index", index);
    const app = parent.append(newComponent, { at: index + 1 });
    console.log("Append=", app);
  } else {
    console.log("No component selected");
  }
};

export default addComponentNextToSelected;
