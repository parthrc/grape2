import "./App.css";
import GjsEditor, { Canvas, PagesProvider } from "@grapesjs/react";
import GrapesJS from "grapesjs";
import ReactCoreGrapesjs from "./grapesjs/core/react-core-grapesjs.jsx";
import useGrapesjsEditorStore from "./store/GrapesjsEditorStore.jsx";
import FloatingPagesSidebar from "./grapesjs/components/FloatingPagesSidebar/FloatingPagesSidebar.jsx";
import { useEffect } from "react";
import GrapesjsTailwindPlugin from "grapesjs-tailwind";

function App() {
  const {
    setGrapesjsEditor,
    setAvailableBlocks,
    availableBlocks,
    grapesjsEditor,
    canvasPages,
    setCanvasPages,
  } = useGrapesjsEditorStore();

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
    // add custom-divieder to Blocks
    editor.Blocks.add("custom-divider", {
      label: "Custom Divider",
      content: {
        type: "custom-divider",
      },
      category: "React components",
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
        domComponents.addComponent({
          type: "custom-page",
          props: {
            content: page.id,
          },
          components: [
            {
              type: "text",
              content: page.content,
            },
          ],
        });

        // add custom divider after end of each page
        domComponents.addComponent({ type: "custom-divider" });
      });
    }
    // if canavs is empty just who one custom divider
    else if (editor) {
      const domComponents = editor.DomComponents;
      domComponents.addComponent({ type: "custom-divider" });
    }
  }, [canvasPages, grapesjsEditor]);
  return (
    <div>
      {/* Main editor component */}
      <GjsEditor
        grapesjs={GrapesJS}
        grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
        plugins={[
          {
            id: "gjs-blocks-basic",
            src: "https://unpkg.com/grapesjs-blocks-basic",
          },

          ReactCoreGrapesjs,

          GrapesjsTailwindPlugin, // disabled, conflicting with slash menu css
        ]}
        onEditor={onEditor}
        options={{
          fromElement: true,
          height: "100vh",
          storageManager: false,
          // to style individual compoenents
          selectorManager: {
            componentFirst: true,
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
