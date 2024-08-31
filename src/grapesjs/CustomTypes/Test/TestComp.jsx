const TestComp = (editor) => {
  editor.Components.addType("test-component", {
    model: {
      defaults: {
        tagName: "div",
        draggable: true,
        droppable: true,
        attributes: { class: "test-component" },
        init() {
          console.log("Test component initialized");
        },
      },
    },
  });

  editor.BlockManager.add("test-component", {
    label: "Test Component",
    content: { type: "test-component" },
  });
};

export default TestComp;
