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
import CustomColumn from "./LayoutComponents/CustomColumn.jsx";
import CustomLayout from "./grapesjs/CustomTypes/CustomnLayoutType/CustomLayout.jsx";
import TestComp from "./grapesjs/CustomTypes/Test/TestComp.jsx";
import CustomColumns from "./grapesjs/CustomTypes/Columns/CustomColumns.jsx";
import CustomRow from "./LayoutComponents/CustomRow.jsx";
import Bootstrap from "./grapesjs/CustomTypes/Bootstrap/Bootstrap.jsx";
import BaseReactCore from "./grapesjs/core/core2.jsx";
import { getPositionOfChild } from "./utils/grapesjs-utils.js";

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

    editor.addComponents({ type: "custom-text-box" });
    editor.addComponents({ type: "custom-row" });

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

    editor.BlockManager.add("two-columns", {
      label: "Two Columns",
      content: `
    <div class="two-columns" style="display: flex;">
      <div class="column" style="flex: 1; padding: 40px; border: 1px solid #ccc;">Column 3 </div>
     
    </div>
  `,
      category: "Layout",
    });
    editor.DomComponents.addType("two-columns", {
      model: {
        defaults: {
          droppable: true,
          attributes: { class: "two-columns" },
          // components: [],
        },
      },
    });
    const maxColumns = 4;
    // Listen to the event when a component is added
    editor.on("component:mount", (component) => {
      // Get the parent of the added component
      const parent = component.parent();

      // Check if the parent is a 'two-columns' component
      if (
        parent &&
        parent.get("classes").some((cl) => cl.id === "custom-text-box")
      ) {
        // Count the number of columns in the parent
        const columns = parent
          .components()
          .filter((comp) => comp.get("classes"));
        console.log("Inside if", parent, component);
        console.log("columns=", columns);
        // If the number of columns exceeds the maximum, remove the last added column
        if (columns.length > maxColumns) {
          // editor.getModel().get('UndoManager').undo();
          component.remove();
        }
      }
    });
    // custom row creation
    const reloadIframe = (editor) => {
      const iframe = editor.Canvas.getFrameEl();
      if (iframe) {
        iframe.contentWindow.location.reload();
      }
    };

    const handleComponentAdd = (model) => {
      const parent = model.parent();
      console.log("Parent=", parent);

      // if a new component is added to the main canvas
      // wrap it inside custom-row component first
      if (parent.attributes.type === "wrapper") {
        console.log("New component added = ", model);

        // Temporarily remove the event listener
        editor.off("component:add", handleComponentAdd);

        const position = getPositionOfChild(model);
        const latestAddedComp = parent.getChildAt(position);
        console.log("Latest Added = ", latestAddedComp);
        console.log("Before replacing", parent.components().models);

        // Replace the latest added component with a new one
        latestAddedComp.replaceWith(
          {
            type: "custom-row",
            components: [
              { type: "custom-column", components: [latestAddedComp.clone()] },
            ],
          },
          { at: position }
        );
        console.log("After replacing", parent.components().models);
        // Add the event listener back
        editor.on("component:add", handleComponentAdd);
        // force reload iframe
        reloadIframe(editor);
      }
    };

    editor.on("component:add", handleComponentAdd);

    // on any canvas update, update localStorage
    // editor.on("update", () => {
    //   console.log("Canvas updated");
    //   handleSave(editor);
    // });

    // fired when any component updates
    // editor.on("component:update", (component) => {
    //   console.log("component update event fired type=", component.get("type"));
    //   // for custom-page updates
    //   if (component.get("type") === "custom-page") {
    //     // get the index of the page in which udpate happened
    //     const pageIndex = component.getTrait("index")?.get("value");
    //     console.log("Current page updated=", pageIndex);

    //     const updatedPage = {
    //       index: component.getTrait("index")?.get("value"),
    //       components: component.components().models,
    //     };
    //     console.log("Updated page=", updatedPage);
    //     console.log("jSON=", component.components().models);

    //     // check if page is updated
    //     // check if canvasPages alreadyahs the updated page with all children
    //     const exists = canvasPages.map((page) => {
    //       console.log("Page", page);
    //       if (page === updatedPage) {
    //         return true;
    //       }
    //       return false;
    //     });
    //     console.log("Exists = ", exists);

    //     // console.log("jSON=", component.getComponents());
    //     // Update Zustand store
    //     updateCanvasPage(updatedPage);
    //     handleSave(editor);
    //     return;
    //   }
    //   console.log(" component event fired not custom page");
    // });

    // let isUpdating = false;

    // editor.on("component:add", (component) => {
    //   // Avoid running the logic if already updating to prevent an infinite loop
    //   if (isUpdating) return;

    //   console.log("Component ADD fired", component.get("type"));
    //   console.log("Added comp Parent", component.parent().get("type"));

    //   const compParent = component.parent();

    //   // Check if the added component is inside a "custom-page" component
    //   if (compParent.get("type") === "custom-page") {
    //     console.log(
    //       "Component added inside a custom-page:",
    //       component.attributes.type
    //     );
    //     const pageIndex = compParent.getTrait("index")?.get("value");

    //     const updatedPage = {
    //       index: pageIndex,
    //       content: compParent.components().models,
    //     };
    //     console.log("updated page=", updatedPage);

    //     // Check if the updated page already exists at the specified index
    //     const exists = canvasPages.some(
    //       (i) =>
    //         i.index === updatedPage.index &&
    //         JSON.stringify(i.content) === JSON.stringify(updatedPage.content)
    //     );
    //     console.log("Exists = ", exists);
    //     console.log("Not exists", !exists);

    //     if (!exists) {
    //       isUpdating = true; // Set the flag to indicate that an update is in progress
    //       try {
    //         console.log("try block exists");
    //         // Update Zustand store
    //         updateCanvasPage(updatedPage);
    //         handleSave(editor);
    //       } finally {
    //         setTimeout(() => {
    //           isUpdating = false; // Reset the flag after the update is complete
    //         }, 0); // Use a small delay to avoid immediate re-triggering
    //       }
    //     }
    //   }
    // });
    // Add components to as Blocks...

    // initialize the slash menu
    let finalSlashMenuItems = [
      { label: "bullet", type: "rte" },
      { label: "h1", type: "rte" },
      { label: "strike", type: "rte" },
      { label: "italic", type: "rte" },
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

  // useEffect to render all pges in the canvas
  // useEffect(() => {
  //   const editor = grapesjsEditor;
  //   if (!editor) return;
  //   const domComponents = editor.DomComponents;
  //   if (!domComponents) return; // Ensure domComponents is defined

  //   // clear canvas
  //   domComponents.clear();
  //   // setCanvasPages([]);
  //   // if we have saved content in localstorage
  //   // create canvasPages  by looping through all components
  //   // we just get all custom-page comps and add them to the canvasPages array, only if they have children (are not blank)
  //   // const savedContent = JSON.parse(localStorage.getItem("MyCanvas"));
  //   const savedContent = localStorage.getItem("MyCanvas");

  //   let parsedContent = null;

  //   if (savedContent) {
  //     try {
  //       parsedContent = JSON.parse(savedContent);
  //     } catch (error) {
  //       console.error("Error parsing JSON:", error);
  //     }
  //   }

  //   // updte local state of canvasPgeas absed on localStorage
  //   // if (parsedContent && parsedContent.allPages && canvasPages.length === 0) {
  //   //   parsedContent.allPages.map((page, index) => {
  //   //     addCanvasPage({
  //   //       index,
  //   //       content: page.components,
  //   //     });
  //   //   });
  //   // }

  //   // render from canvasPages
  //   // if no page exist add a new page
  //   if (canvasPages.length === 0) {
  //     console.log("Zero pages");
  //     addCanvasPage({
  //       index: canvasPages.length + 1,
  //     });
  //     return;
  //   }
  //   // if pages exist
  //   // render each page
  //   // render if it has children or else dont

  //   // when we have pages
  //   if (canvasPages.length > 0) {
  //     console.log("RENDERING ALL PAGES");
  //     canvasPages.map((page) => {
  //       // render only if not empty, has children components
  //       // if it has children
  //       console.log("Main RENDER=", page);
  //       if (page.content && page.content.length > 0) {
  //         console.log("page has content");
  //         domComponents.addComponent({
  //           type: "custom-page",
  //           components: page.content,
  //           traits: [
  //             {
  //               label: "Index",
  //               type: "number",
  //               name: "index",
  //               value: page.index,
  //             },
  //           ],
  //         });
  //         domComponents.addComponent({ type: "custom-divider" });
  //         return;
  //       }
  //       // if empty page
  //       domComponents.addComponent({
  //         type: "custom-page",
  //         traits: [
  //           {
  //             label: "Index",
  //             type: "number",
  //             name: "index",
  //             value: page.index,
  //           },
  //         ],
  //       });
  //       domComponents.addComponent({ type: "custom-divider" });
  //     });
  //   }

  //   // check for saved content
  //   // const savedContent = JSON.parse(localStorage.getItem("MyCanvas"));
  //   // console.log("getting savedContent:", savedContent);
  //   // if (savedContent && savedContent.components.length > 0) {
  //   //   editor.setComponents(savedContent.components);
  //   // }

  //   // if (!savedContent || savedContent.components.length === 0) {
  //   //   console.log(true);
  //   //   domComponents.addComponent({ type: "custom-page" });
  //   //   domComponents.addComponent({ type: "custom-divider" });
  //   //   handleSave(editor);
  //   // }

  //   // // check if editor instance exists
  //   // // check if there are pages in the canvas
  //   // if (editor && canvasPages.length > 0) {
  //   //   // clear any components
  //   //   // because we will render all ourselves
  //   //   const domComponents = editor.DomComponents;
  //   //   domComponents.clear();
  //   //   // loop through all pages store in zustand store
  //   //   canvasPages.forEach((page, index) => {
  //   //     // for each page add custom-page component
  //   //     // with all its children
  //   //     console.log(page);
  //   //     domComponents.addComponent({
  //   //       type: "custom-page",
  //   //       components: page.componentsList,
  //   //     });

  //   //     // add custom divider after end of each page
  //   //     domComponents.addComponent({ type: "custom-divider" });
  //   //   });
  //   // }
  //   // if canvas is empty just who one custom divider
  //   // else if (editor && canvasPages.length === 0) {
  //   //   addCanvasPage({
  //   //     id: canvasPages.length + 1,
  //   //     componentsList: [],
  //   //   });
  //   //   const domComponents = editor.DomComponents;
  //   //   domComponents.addComponent({ type: "custom-page" });
  //   //   domComponents.addComponent({ type: "custom-divider" });
  //   // }
  // }, [canvasPages, grapesjsEditor, addCanvasPage]);

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
    // const components = editor.getComponents();
    console.log("Canvas pages before saving=", canvasPages);
    const savedContent = {
      allPages: canvasPages,
    };
    console.log("setting savedContent:", savedContent);
    localStorage.setItem("MyCanvas", JSON.stringify(savedContent));
  };
  // clear the canvas & lcoalStorage
  const handleClear = (editor) => {
    editor.setComponents([]);
    localStorage.setItem("MyCanvas", "");
    localStorage.setItem("grapesjs-editor-store", "");
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
          CustomColumn,
          CustomLayout,
          TestComp,
          CustomColumns,
          parserPostCSS,
          CustomRow,
          Bootstrap,
          {
            id: "gjs-blocks-basic",
            src: "https://unpkg.com/grapesjs-blocks-basic",
          },

          ReactCoreGrapesjs,
          // BaseReactCore,
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
