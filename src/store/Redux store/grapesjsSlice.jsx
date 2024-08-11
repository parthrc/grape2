import { createSlice, configureStore } from "@reduxjs/toolkit";

const grapesjsEditorSlice = createSlice({
  name: "grapesjsEditor",
  initialState: {
    grapesjsEditor: null,
    availableBlocks: [],
    tiptapEditor: null,
    canvasPages: [],
    isPreviewMode: false,
  },
  reducers: {
    setGrapesjsEditor: (state, action) => {
      state.grapesjsEditor = action.payload;
    },
    setAvailableBlocks: (state, action) => {
      state.availableBlocks = action.payload;
    },
    setTiptapEditor: (state, action) => {
      state.tiptapEditor = action.payload;
    },
    setCanvasPages: (state, action) => {
      state.canvasPages = action.payload;
    },
    addCanvasPage: (state, action) => {
      state.canvasPages.push(action.payload);
    },
    setPreviewMode: (state, action) => {
      state.isPreviewMode = action.payload;
    },
  },
});

export const {
  setGrapesjsEditor,
  setAvailableBlocks,
  setTiptapEditor,
  setCanvasPages,
  addCanvasPage,
  setPreviewMode,
} = grapesjsEditorSlice.actions;

export default grapesjsEditorSlice.reducer;
