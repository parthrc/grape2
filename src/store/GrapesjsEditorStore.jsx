import { create } from "zustand";

const useGrapesjsEditorStore = create((set) => ({
  grapesjsEditor: null,
  setGrapesjsEditor: (editor) => set({ grapesjsEditor: editor }),
  availableBlocks: [],
  setAvailableBlocks: (blocks) => set({ availableBlocks: blocks }),
  tiptapEditor: null,
  setTiptapEditor: (editor) => set({ tiptapEditor: editor }),
  canvasPages: [],
  setCanvasPages: (canvasPages) => set({ canvasPages }),
  addCanvasPage: (page) =>
    set((state) => ({ canvasPages: [...state.canvasPages, page] })),
  updateCanvasPage: (updatedPage) =>
    set((state) => ({
      canvasPages: state.canvasPages.map((page) =>
        page.index === updatedPage.index ? updatedPage : page
      ),
    })),
  isPreviewMode: false,
  setPreviewMode: (isPreview) => set({ isPreviewMode: isPreview }),
}));

export default useGrapesjsEditorStore;
