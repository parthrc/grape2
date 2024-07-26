import { create } from "zustand";

const useGrapesjsEditorStore = create((set) => ({
  grapesjsEditor: null,
  setGrapesjsEditor: (editor) => set({ grapesjsEditor: editor }),
  availableBlocks: [],
  setAvailableBlocks: (blocks) => set({ availableBlocks: blocks }),
  tiptapEditor: null,
  setTiptapEditor: (editor) => set({ tiptapEditor: editor }),
}));

export default useGrapesjsEditorStore;
