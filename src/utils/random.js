function sliceUntilSlash(str) {
  // find the position of the first slash from teh end
  const slashIndex = str.indexOf("/");

  // If there's no slash, return the original string
  if (slashIndex === -1) {
    return str;
  }

  // slice the string up to the slash index, keeping the slasj
  return str.slice(0, slashIndex);
}

export { sliceUntilSlash };
