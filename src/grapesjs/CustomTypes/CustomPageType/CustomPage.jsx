const CustomPageComponent = (editor) => {
  editor.DomComponents.addType("custom-page", {
    // make editor understand when to bind 'custom-page'
    isComponent: (el) => el.tagName === "CUSTOMPAGE",

    // Model definition
    model: {
      // default properties
      defaults: {
        tagName: "div",
        attributes: { title: "Custom page", class: "custom-page" },
        // Default styles to make it visible and usable
        style: {
          minHeight: "200px",
          height: "200px",
          // Ensures it's large enough to drop components into
          padding: "10px", // Adds space inside the component
          border: "2px dashed #ccc", // Visual indication that something can be dropped here
          backgroundColor: "#bb1515", // Light background to make it stand out
        },
        // styles: `.custom-page {}`,
        draggable: false, // cannot drag this comp
        droppable: true, // can drop other comps inside
        components: [
          {
            type: "text",
            content: "Drop your content here", // Default content
            style: { color: "#ccc", textAlign: "center", paddingTop: "80px" }, // Centered and light text
          },
        ],
      },
    },

    init() {
      // Listen for changes in the 'components' property
      this.listenTo(this.components(), "add", this.removePlaceholder);
    },

    removePlaceholder() {
      console.log("Inside listener");
      // Find the placeholder text component and remove it
      const placeholder = this.components().filter((comp) => {
        return (
          comp.get("type") === "text" &&
          comp.get("content") === "Drop your content here"
        );
      });

      placeholder.forEach((comp) => this.components().remove(comp));
    },

    // View definition
    // how it is rendered in the canvas
    // can add extra fetures like rte in text editors
    // wont show up in final html output
    // need to update model properties for that
    // view: {
    //   // Be default, the tag of the element is the same of the model
    //   // can change it if u want
    //   tagName: "div",

    //   // Add easily component specific listeners with `events`
    //   // Being component specific (eg. you can't attach here listeners to window)
    //   // you don't need to care about removing them when the component is removed,
    //   // they will be managed automatically by the editor
    //   // events: {
    //   //   click: "clickOnElement",
    //   //   // You can also make use of event delegation
    //   //   // and listen to events bubbled from some inner element
    //   //   "dblclick .inner-el": "innerElClick",
    //   // },

    //   // innerElClick(ev) {
    //   //   ev.stopPropagation();
    //   //   console.log("Clicked inside custom page element");
    //   //   // ...
    //   //   // If you need you can access the model from any function in the view
    //   //   this.model.components("Update inner components");
    //   // },

    //   // Do something with the content once the element is rendered.
    //   // The DOM element is passed as `el` in the argument object,
    //   // but you can access it from any function via `this.el`
    //   // onRender({ el }) {
    //   //   const btn = document.createElement("button");
    //   //   btn.value = "+sadasdasdasd";
    //   //   // This is just an example, AVOID adding events on inner elements,
    //   //   // use `events` for these cases
    //   //   btn.addEventListener("click", () => {});
    //   //   el.appendChild(btn);
    //   // },
    // },
  });
};

export default CustomPageComponent;
