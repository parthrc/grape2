import "./App.css";
import GjsEditor, { Canvas, PagesProvider } from "@grapesjs/react";
import GrapesJS from "grapesjs";
import gjsPresetWebpagePlugin from "grapesjs-preset-webpage";
import ReactCoreGrapesjs from "./grapesjs/core/react-core-grapesjs.jsx";
import useGrapesjsEditorStore from "./store/GrapesjsEditorStore.jsx";
import FloatingPagesSidebar from "./grapesjs/components/FloatingPagesSidebar/FloatingPagesSidebar.jsx";
import { useEffect } from "react";

function App() {
  const {
    setGrapesjsEditor,
    setAvailableBlocks,
    availableBlocks,
    grapesjsEditor,
    pages,
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

    if (editor && pages.length > 0) {
      const domComponents = editor.DomComponents;
      domComponents.clear();

      pages.forEach((page, index) => {
        domComponents.addComponent({
          type: "custom-page",
          components: [
            {
              type: "text",
              content: page.content,
            },
          ],
        });

        domComponents.addComponent({ type: "custom-divider" });
      });
    } else if (editor) {
      const domComponents = editor.DomComponents;
      domComponents.addComponent({ type: "custom-divider" });
    }
  }, [pages, grapesjsEditor]);
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
        ]}
        onEditor={onEditor}
        options={{
          fromElement: true,
          height: "100vh",
          storageManager: false,
          selectorManager: true,
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
                  top: "48%",
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
