import { configureStore } from "@reduxjs/toolkit";
import grapesjsEditorReducer from "./grapesjsSlice.jsx"; // Adjust the path accordingly

const store = configureStore({
  reducer: {
    grapesjsEditor: grapesjsEditorReducer,
  },
});

export default store;
