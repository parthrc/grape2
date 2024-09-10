const addComponentNextToSelected = (editor, newComponent, position = 1) => {
  const selected = editor.getSelected();
  console.log("inside addComponentNextToSelected=", selected);
  console.log("inside selected=", selected.attributes.type);
  console.log("inside parent=", selected.parent().attributes.type);
  if (selected) {
    const parent = selected.parent();
    console.log("parent=", parent.components());
    const index = parent.components().indexOf(selected);
    console.log("Index", index);
    const app = parent.append(newComponent, { at: index + position });
    console.log("Append=", app);
  } else {
    console.log("No component selected");
  }
};

function getTextAfterFirstWhitespace(input) {
  // Find the index of the first whitespace
  const firstWhitespaceIndex = input.search(/\s/); // Regular expression to find any whitespace character

  // If whitespace is found, slice the string starting from that index
  if (firstWhitespaceIndex !== -1) {
    return input.slice(firstWhitespaceIndex);
  }

  // If no whitespace is found, return an empty string
  return "";
}
// get clean text from html string
function removeHTMLTags(input) {
  const tagPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi; // Matches HTML tags
  const tags = []; // Array to store tags

  // Replace the tags and push them to the `tags` array
  const cleanedString = input.replace(tagPattern, (match, tagName) => {
    tags.push(tagName); // Store the tag name
    return ""; // Remove the tag from the string
  });

  return { cleanedString, tags };
}

export {
  addComponentNextToSelected,
  getTextAfterFirstWhitespace,
  removeHTMLTags,
};
