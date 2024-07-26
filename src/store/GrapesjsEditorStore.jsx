import { create } from "zustand";

const useGrapesjsEditorStore = create((set) => ({
  grapesjsEditor: null,
  setGrapesjsEditor: (editor) => set({ editor }),
  availableBlocks: [],
  setAvailableBlocks: (blocks) => set({ availableBlocks: blocks }),
}));

export default useGrapesjsEditorStore;
