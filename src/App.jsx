import "./App.css";

import "grapesjs/dist/css/grapes.min.css";
import GrapesJS from "grapesjs";
import { useEffect } from "react";
import gjsPresetWebpagePlugin from "grapesjs-preset-webpage";
import ReactCoreGrapesjs from "./grapesjs/core/react-core-grapesjs.jsx";
import useGrapesjsEditorStore from "./store/GrapesjsEditorStore.jsx";

function App() {
  const { setGrapesjsEditor } = useGrapesjsEditorStore();
  // grapesjs setup
  useEffect(() => {
    const editor = GrapesJS.init({
      container: "#gjs",
      fromElement: true,
      showOffsets: true,
      noticeOnUnload: false,
      storageManager: false,
      // plugins here
      plugins: [gjsPresetWebpagePlugin, ReactCoreGrapesjs],

      // to apply styles to individual components
      selectorManager: {
        componentFirst: true,
      },

      parser: {
        optionsHtml: {
          allowScripts: true,
        },
      },
    });

    // set editor isntance to zustand store
    if (editor) setGrapesjsEditor(editor);

    // Add components to as Blocks...

    // adding custom-text-box to Blocks
    editor.Blocks.add("custom-text-box", {
      label: "Custom text box",
      content: { type: "custom-text-box" },
      category: "React components",
    });

    // add first custom-text-box on first load
    // also add custom-text-box on after every new component added
    editor.addComponents({
      type: "custom-text-box",
    });
  }, []);
  return <div id="gjs" />;
}

export default App;
