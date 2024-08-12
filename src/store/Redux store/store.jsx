import { configureStore } from "@reduxjs/toolkit";
import grapesjsEditorReducer from "./grapesjsSlice.jsx";

const store = configureStore({
  reducer: {
    grapesjsEditor: grapesjsEditorReducer,
  },
});

export default store;
