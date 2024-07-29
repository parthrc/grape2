import "./App.css";
import GjsEditor, { Canvas } from "@grapesjs/react";
import GrapesJS from "grapesjs";
import gjsPresetWebpagePlugin from "grapesjs-preset-webpage";
import ReactCoreGrapesjs from "./grapesjs/core/react-core-grapesjs.jsx";
import useGrapesjsEditorStore from "./store/GrapesjsEditorStore.jsx";
import FloatingPagesSidebar from "./grapesjs/components/FloatingPagesSidebar/FloatingPagesSidebar.jsx";

function App() {
  const { setGrapesjsEditor, setAvailableBlocks, availableBlocks } =
    useGrapesjsEditorStore();

  // callback called once editor is initalized
  const onEditor = (editor) => {
    console.log("Editor loaded", { editor });
    // set editor isntance to zustand store
    if (editor) setGrapesjsEditor(editor);

    // Add components to as Blocks...

    // adding custom-text-box to Blocks
    editor.Blocks.add("custom-text-box", {
      label: "Custom text box",
      content: { type: "custom-text-box" },
      category: "React components",
    });
    // add sample-component to Blocks
    editor.Blocks.add("sample-component", {
      label: "Sample Component",
      content: {
        type: "sample-component",
      },
      category: "React components",
    });

    // add first custom-text-box on first load
    // also add custom-text-box on after every new component added
    editor.addComponents({
      type: "custom-text-box",
    });

    // initialize the slash menu
    let finalSlashMenuItems = [
      { label: "bullet", type: "rte" },
      { label: "h1", type: "rte" },
    ];

    // using Blocks API
    // get list of all available blocks
    const blockManager = editor.Blocks;
    const allBlocks = blockManager.getBlocksByCategory();
    // add all blocks to slashMenuItems
    allBlocks.map((block) => {
      if (block.category) {
        if (block.items) {
          block.items.map((item) => {
            finalSlashMenuItems.push({
              label: item.attributes.label,
              category: "custom-component",
              component_id: item.attributes.id,
            });
          });
        }
      }
    });

    // save finalSlashMenuItems to the zustand store
    setAvailableBlocks(finalSlashMenuItems);

    // add a new page
    // Get the Pages module first
    const pages = editor.Pages;

    // Get an array of all pages
    const allPages = pages.getAll();

    // Get currently selected page
    const selectedPage = pages.getSelected();

    // Add a new Page
    const newPage = pages.add({
      id: "new-page-id",
      styles: ".my-class { color: red }",
      component: '<div class="my-class">My element</div>',
    });

    // Get the Page by ID
    const page = pages.get("new-page-id");
    console.log("page id", page);

    console.log(pages.getAll());

    // Get the HTML/CSS code from the page component
    const component = page.getMainComponent();
    const htmlPage = editor.getHtml({ component });
    const cssPage = editor.getCss({ component });

    // try adding new page to the canvas
    editor.addComponents(component);
  };

  return (
    <div>
      {/* Floating pages sidebar */}
      <div
        style={{
          position: "fixed",
          left: "10px",
          top: "48%",
          zIndex: "999",
        }}
      >
        <FloatingPagesSidebar />
      </div>
      <GjsEditor
        grapesjs={GrapesJS}
        grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
        plugins={[gjsPresetWebpagePlugin, ReactCoreGrapesjs]}
        onEditor={onEditor}
        options={{
          height: "100vh",
          storageManager: false,
          selectorManager: true,
          parser: {
            optionsHtml: {
              allowScripts: true,
            },
          },
        }}
      ></GjsEditor>
    </div>
  );
}

export default App;
