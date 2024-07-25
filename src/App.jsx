import "./App.css";

import "grapesjs/dist/css/grapes.min.css";
import GrapesJS from "grapesjs";
import { useEffect } from "react";
import gjsPresetWebpagePlugin from "grapesjs-preset-webpage";

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
      plugins: [gjsPresetWebpagePlugin],

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
  }, []);
  return <div id="gjs" />;
}

export default App;
