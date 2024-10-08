import "./App.css";
import GjsEditor, { Canvas, PagesProvider } from "@grapesjs/react";
import GrapesJS from "grapesjs";
import ReactCoreGrapesjs from "./grapesjs/core/react-core-grapesjs.jsx";
import useGrapesjsEditorStore from "./store/GrapesjsEditorStore.jsx";
import FloatingPagesSidebar from "./grapesjs/components/FloatingPagesSidebar/FloatingPagesSidebar.jsx";
import { useEffect } from "react";
import GrapesjsTailwindPlugin from "grapesjs-tailwind";
import CustomPageComponent from "./grapesjs/CustomTypes/CustomPageType/CustomPage.jsx";
import parserPostCSS from "grapesjs-parser-postcss";
import CustomDividerComponenet from "./grapesjs/CustomTypes/CustomDividerType/CustomDivider.jsx";
import AddEventListeners from "./grapesjs/EventListeners/GrapesjsListeners.jsx";

function App() {
  const {
    setGrapesjsEditor,
    setAvailableBlocks,
    grapesjsEditor,
    canvasPages,
    setPreviewMode,
    addCanvasPage,
  } = useGrapesjsEditorStore();

  // Handle tailwind's use of slashes in css names
  const escapeName = (name) =>
    `${name}`.trim().replace(/([^a-z0-9\w-:/]+)/gi, "-");

  // callback called once editor is initalized
  const onEditor = (editor) => {
    // console.log("Editor loaded", { editor });
    // set editor isntance to zustand store
    if (editor) setGrapesjsEditor(editor);

    // commands
    // when previwe mode is true
    editor.on("run:core:preview", () => {
      setPreviewMode(true);
      console.log("Preview mode enabled!");
    });
    // when preview mode is false
    editor.on("stop:core:preview", () => {
      setPreviewMode(false);
      console.log("Preview mode disabled!");
    });

    // Add components to as Blocks...

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

    // PAGES section
    // we need to programmatically render the canvas
  };

  // useEffect to render all apges in teh canvas
  useEffect(() => {
    const editor = grapesjsEditor;
    // check if editor instance exists
    // check if there are pages in the canvas
    if (editor && canvasPages.length > 0) {
      // clear any components
      // because we will render all ourselves
      const domComponents = editor.DomComponents;
      domComponents.clear();
      // loop through all pages store in zustand store
      canvasPages.forEach((page, index) => {
        // for each page add custom-page component
        // with all its children
        console.log(page);
        domComponents.addComponent({
          type: "custom-page",
          components: page.componentsList,
        });

        // add custom divider after end of each page
        domComponents.addComponent({ type: "custom-divider" });
      });
    }
    // if canvas is empty just who one custom divider
    else if (editor && canvasPages.length === 0) {
      addCanvasPage({
        id: canvasPages.length + 1,
        componentsList: [],
      });
      const domComponents = editor.DomComponents;
      domComponents.addComponent({ type: "custom-page" });
      domComponents.addComponent({ type: "custom-divider" });
    }
  }, [canvasPages, grapesjsEditor, addCanvasPage]);
  return (
    <div>
      {/* Main editor component */}
      <GjsEditor
        grapesjs={GrapesJS}
        grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
        plugins={[
          GrapesjsTailwindPlugin,
          CustomPageComponent,
          parserPostCSS,
          CustomDividerComponenet,
          {
            id: "gjs-blocks-basic",
            src: "https://unpkg.com/grapesjs-blocks-basic",
          },

          ReactCoreGrapesjs,
          AddEventListeners,
        ]}
        onEditor={onEditor}
        options={{
          // canvas: {
          //   // Disable only the hover type spot
          //   customSpots: { hover: true },
          // },
          pluginsOpts: {
            [GrapesjsTailwindPlugin]: {
              // custom config
              config: {
                content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"], // where tailwind will look for styles
                theme: {
                  extend: {},
                },
                corePlugins: {
                  preflight: false, // disable tailwind base styles
                },
              },
            },
          },
          fromElement: true,
          height: "100vh",
          // Default configurations
          storageManager: {
            type: "local", // Storage type. Available: local | remote
            options: {
              local: { key: `grapesjs-jaarvis` },
            },
            autosave: true, // Store data automatically
            autoload: true, // Autoload stored data on init
            stepsBeforeSave: 1, // If autosave is enabled, indicates how many changes are necessary before the store method is triggered
            // to style individual compoenents
          },
          selectorManager: {
            componentFirst: true,
            escapeName,
          },
          parser: {
            optionsHtml: {
              allowScripts: true,
            },
          },
        }}
      >
        <PagesProvider>
          {(props) => (
            <>
              <div
                style={{
                  position: "fixed",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: "999999",
                }}
              >
                <FloatingPagesSidebar {...props} />
              </div>
              <div style={{ marginTop: "30px" }}>
                <Canvas />
              </div>
            </>
          )}
        </PagesProvider>
      </GjsEditor>
    </div>
  );
}

export default App;
