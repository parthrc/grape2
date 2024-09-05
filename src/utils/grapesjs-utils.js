const getPositionOfChild = (component) => {
  // get parent
  const parent = component.parent();
  // get list of children from parent
  const siblings = parent.components();
  const collection = siblings.models;
  // get position
  //   console.log("Collection=", collection);

  const index = collection.findIndex((item) => item.cid === component.cid);
  //   console.log("Index", index);
  return index;
};

export { getPositionOfChild };
