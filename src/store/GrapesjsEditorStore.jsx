import { create } from "zustand";

const useGrapesjsEditorStore = create((set) => ({
  grapesjsEditor: null,
  setGrapesjsEditor: (editor) => set({ grapesjsEditor: editor }),
  availableBlocks: [],
  setAvailableBlocks: (blocks) => set({ availableBlocks: blocks }),
  tiptapEditor: null,
  setTiptapEditor: (editor) => set({ tiptapEditor: editor }),
  // List of pages in the canvas
  canvasPages: [],
  setCanvasPages: (canvasPages) => set({ canvasPages }),
  addCanvasPage: (page) =>
    set((state) => ({ canvasPages: [...state.canvasPages, page] })),

  isPreviewMode: false,
  setPreviewMode: (isPreview) => set({ isPreviewMode: isPreview }),
}));

export default useGrapesjsEditorStore;
