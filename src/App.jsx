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
import { Template } from "./grapesjs/React Templates/Templates.jsx";

function App() {
  const {
    setGrapesjsEditor,
    setAvailableBlocks,
    grapesjsEditor,
    canvasPages,
    setPreviewMode,
    addCanvasPage,
    isPreviewMode,
    setCanvasPages,
    updateCanvasPage,
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

    // on any canvas update, update localStorage
    editor.on("update", () => {
      console.log("Canvas updated");
      handleSave(editor);
    });

    // fired when children of any component updates
    editor.on("component:update:components", (component) => {
      console.log("comp inside update", component);
      // for custom-page updates
      if (component.get("type") === "custom-page") {
        // get the index of the page in which udpate happened
        const pageIndex = component.getTrait("index")?.get("value");
        console.log("Current page updated=", pageIndex);

        const updatedPage = {
          index: component.getTrait("index")?.get("value"),
          component: component.toJSON(),
        };
        // Update Zustand store
        updateCanvasPage(updatedPage);
      }
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
    if (!editor) return;
    const domComponents = editor.DomComponents;

    // clear canvas
    domComponents.clear();
    // setCanvasPages([]);
    // if we have saved content in localstorage
    // create canvasPages  by looping through all components
    // we just get all custom-page comps and add them to the canvasPages array, only if they have children (are not blank)
    const savedContent = JSON.parse(localStorage.getItem("MyCanvas"));
    console.log("saved content", savedContent.allPages);
    // if (savedContent.allPages && canvasPages.length === 0) {
    //   savedContent.allPages.map((page, index) => {
    //     addCanvasPage({
    //       index,
    //       content: page.components,
    //     });
    //   });
    // }

    // render from canvasPages
    // if no page exist add a new page
    if (canvasPages.length === 0) {
      console.log("Zero pages");
      addCanvasPage({
        index: canvasPages.length + 1,
      });
      return;
    }
    // if pages exist
    // render each page
    // render if it has children or else dont

    // when we have pages
    if (canvasPages.length > 0) {
      canvasPages.map((page) => {
        // render only if not empty
        // has children components
        // if it has children
        if (page.component) {
          domComponents.addComponent({
            type: "custom-page",
            content: page.component,
            traits: [
              {
                label: "Index",
                type: "number",
                name: "index",
                value: page.index,
              },
            ],
          });
          domComponents.addComponent({ type: "custom-divider" });
          return;
        }
        // if empty page
        domComponents.addComponent({
          type: "custom-page",
          traits: [
            {
              label: "Index",
              type: "number",
              name: "index",
              value: page.index,
            },
          ],
        });
        domComponents.addComponent({ type: "custom-divider" });
      });
    }

    // check for saved content
    // const savedContent = JSON.parse(localStorage.getItem("MyCanvas"));
    // console.log("getting savedContent:", savedContent);
    // if (savedContent && savedContent.components.length > 0) {
    //   editor.setComponents(savedContent.components);
    // }

    // if (!savedContent || savedContent.components.length === 0) {
    //   console.log(true);
    //   domComponents.addComponent({ type: "custom-page" });
    //   domComponents.addComponent({ type: "custom-divider" });
    //   handleSave(editor);
    // }

    // // check if editor instance exists
    // // check if there are pages in the canvas
    // if (editor && canvasPages.length > 0) {
    //   // clear any components
    //   // because we will render all ourselves
    //   const domComponents = editor.DomComponents;
    //   domComponents.clear();
    //   // loop through all pages store in zustand store
    //   canvasPages.forEach((page, index) => {
    //     // for each page add custom-page component
    //     // with all its children
    //     console.log(page);
    //     domComponents.addComponent({
    //       type: "custom-page",
    //       components: page.componentsList,
    //     });

    //     // add custom divider after end of each page
    //     domComponents.addComponent({ type: "custom-divider" });
    //   });
    // }
    // if canvas is empty just who one custom divider
    // else if (editor && canvasPages.length === 0) {
    //   addCanvasPage({
    //     id: canvasPages.length + 1,
    //     componentsList: [],
    //   });
    //   const domComponents = editor.DomComponents;
    //   domComponents.addComponent({ type: "custom-page" });
    //   domComponents.addComponent({ type: "custom-divider" });
    // }
  }, [canvasPages, grapesjsEditor, addCanvasPage]);

  // save fucntion
  const handleSave = (editor) => {
    console.log("Saving canvas...");
    // if (grapesjsEditor) {
    //   console.log("Editor exists inside the save functon");
    //   const components = grapesjsEditor.getComponents();
    //   const savedContent = {
    //     components: components.toJSON(),
    //   };
    //   localStorage.setItem("MyCanvas", JSON.stringify(savedContent));
    //   return;
    // }
    const components = editor.getComponents();
    const savedContent = {
      allPages: components.toJSON(),
    };
    console.log("setting savedContent:", savedContent);
    localStorage.setItem("MyCanvas", JSON.stringify(savedContent));
  };
  // clear the canvas
  const handleClear = (editor) => {
    editor.setComponents([]);
    localStorage.setItem("MyCanvas", "");
  };

  return (
    <div>
      {/* Main editor component */}
      {!isPreviewMode && (
        <>
          <button onClick={() => handleSave(grapesjsEditor)}>Save</button>
          <button onClick={() => handleClear(grapesjsEditor)}>Clear</button>
        </>
      )}
      <GjsEditor
        grapesjs={GrapesJS}
        grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
        plugins={[
          GrapesjsTailwindPlugin,
          CustomPageComponent,
          parserPostCSS,
          {
            id: "gjs-blocks-basic",
            src: "https://unpkg.com/grapesjs-blocks-basic",
          },

          ReactCoreGrapesjs,
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
          // storageManager: {
          //   type: "local", // Storage type. Available: local | remote
          //   options: {
          //     local: { key: `grapesjs-jaarvis` },
          //   },
          //   autosave: true, // Store data automatically
          //   autoload: true, // Autoload stored data on init
          //   stepsBeforeSave: 1, // If autosave is enabled, indicates how many changes are necessary before the store method is triggered
          //   // to style individual compoenents
          // },
          storageManager: false,
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
      <Template />
    </div>
  );
}

export default App;
