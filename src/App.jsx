import "./App.css";

import "grapesjs/dist/css/grapes.min.css";
import GrapesJS from "grapesjs";
import { useEffect } from "react";
import gjsPresetWebpagePlugin from "grapesjs-preset-webpage";
import ReactCoreGrapesjs from "./grapesjs/core/react-core-grapesjs.jsx";

function App() {
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

    // Add components to as Blocks...

    // adding custom-text-box to Blocks
    editor.Blocks.add("custom-text-box", {
      label: "Custom text box",
      content: { type: "custom-text-box" },
      category: "React components",
    });
  }, []);
  return <div id="gjs" />;
}

export default App;
