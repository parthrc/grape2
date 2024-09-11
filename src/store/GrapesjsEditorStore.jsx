import { create } from "zustand";
import { persist } from "zustand/middleware";

function safeStringify(obj) {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  });
}

const useGrapesjsEditorStore = create(
  persist(
    (set, get) => ({
      grapesjsEditor: null,
      setGrapesjsEditor: (editor) => set({ grapesjsEditor: editor }),
      availableBlocks: [],
      setAvailableBlocks: (blocks) => set({ availableBlocks: blocks }),
      tiptapEditor: null,
      // setTiptapEditor: (editor) => set({ tiptapEditor: editor }),
      tiptapEditors: [],
      addTiptapEditor: (id, editor) =>
        set((state) => {
          if (!state.tiptapEditors[id]) {
            // Only add if the editor doesn't already exist
            return { tiptapEditors: { ...state.tiptapEditors, [id]: editor } };
          }
        }),
      removeTiptapEditor: (id) =>
        set((state) => {
          const newEditors = { ...state.tiptapEditors };
          delete newEditors[id];
          return { tiptapEditors: newEditors };
        }),
      getTiptapEditor: (id) => {
        const state = get();
        return state.tiptapEditors[id] || null;
      },
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
    }),
    {
      name: "grapesjs-editor-store", // Name of the item in storage
      serialize: (state) => safeStringify(state), // Use custom serializer
      storage: localStorage, // Use localStorage for persistence
      partialize: (state) => ({ canvasPages: state.canvasPages }),
    }
  )
);

export default useGrapesjsEditorStore;
