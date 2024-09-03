import ReactDOM from "react-dom";
import React from "react";
import SampleComponent from "../components/SampleComponent/SampleComponent.jsx";
import CustomTextBox from "../components/CustomTextBox/custom-text-box.jsx";
import Listing from "../components/Listing/Listing.jsx";

const BaseReactCore = (editor) => {
  const domc = editor.Components;
  const defType = domc.getType("default");
  const defModel = defType.model;
  const wrpChld = "data-chld";

  // Main React component
  domc.addType("react-component", {
    model: {
      toHTML(opts = {}) {
        return defModel.prototype.toHTML.call(this, {
          ...opts,
          tag: this.get("type"),
        });
      },
    },
    view: {
      tagName: "div",

      init() {
        const { model } = this;
        this.listenTo(model, "change:attributes", this.render);
        this.listenTo(model.components(), "add remove reset", this.__upRender);
      },

      /**
       * Added this method to return the "holder" container wich
       * is not a real element just keep the children until we
       * insert it on the real container
       */
      getChildrenContainerHolder() {
        const { childrenContainer } = this;
        if (childrenContainer) return childrenContainer;

        this.childrenContainer = document.createElement("childc");

        return this.childrenContainer;
      },

      /**
       * Changed this method to return the real children container or
       * the holder in case of the real is not inserted in the DOM yet
       */
      getChildrenContainer() {
        const childrenContainer = this.el.querySelector(`span[${wrpChld}]`);
        return childrenContainer ?? this.getChildrenContainerHolder();
      },

      /**
       * We need this container to understand if the React component is able
       * to render children
       */
      createReactChildWrap() {
        return React.createElement("span", { [wrpChld]: true });
      },

      createReactEl(cmp, props) {
        return React.createElement(cmp, props, this.createReactChildWrap());
      },

      mountReact(cmp, el) {
        ReactDOM.createRoot(cmp, el);
      },

      render() {
        const { model, el } = this;
        this.updateAttributes();
        this.renderChildren();
        const reactEl = this.createReactEl(model.get("component"), {
          ...model.get("attributes"),
        });
        this.mountReact(reactEl, el);
        const chld = el.querySelector(`span[${wrpChld}]`);

        // If the container is found, the react component is able to render children
        if (chld) {
          const chldCont = this.getChildrenContainerHolder();
          while (chldCont.firstChild) {
            chld.appendChild(chldCont.firstChild);
          }
        }

        return this;
      },

      __upRender() {
        clearTimeout(this._upr);
        this._upr = setTimeout(() => this.render());
      },
    },
  });

  // Add custom text box type
  domc.addType("custom-text-box", {
    extend: "react-component",
    model: {
      //   ...coreReactModel,
      defaults: {
        component: (props) => {
          // Access the trait values from the model's attributes
          const content = props.content;

          return <CustomTextBox {...props} editor={editor} content={content} />;
        }, // Pass the editor as a prop,
        tagName: "div",
        // traits
        traits: [
          { label: "Content", type: "text", name: "content", value: "hey" },
        ],
        style: {
          backgroudColor: "green",
          color: "pink",
          width: "fit-content",
        },

        draggable: true,
        droppable: true,
        editable: true,
        attributes: { class: "custom-text-box" },
        props: {}, // Add this line to define custom props
      },
    },
    isComponent: (el) => el.tagName === "CUSTOM-TEXT-BOX",
    // view: coreReactView,
  });

  // Add sample-component
  domc.addType("sample-component", {
    extend: "react-component",
    model: {
      //   ...coreReactModel,
      defaults: {
        component: SampleComponent,
        tagName: "div",
        draggable: true,
        droppable: true,
        editable: false,
        attributes: { class: "sample-component" },
        props: {}, // Add this line to define custom props
      },
    },
    isComponent: (el) => el.tagName === "sample-component",
    // view: coreReactView,
  });

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

  editor.Components.addType("Listing", {
    extend: "react-component",
    model: {
      defaults: {
        component: Listing,
        stylable: true,
        resizable: true,
        editable: true,
        draggable: true,
        droppable: true,
        attributes: {
          mlsid: "Default MLSID",
          editable: true,
        },
        traits: [
          {
            type: "number",
            label: "MLS ID",
            name: "mlsid",
          },
        ],
      },
    },
    isComponent: (el) => el.tagName === "LISTING",
  });

  editor.BlockManager.add("listing", {
    label: "<div class='gjs-fonts gjs-f-b1'>Listing</div>",
    category: "React Components",
    content: "<Listing>Foo</Listing>",
  });
};

export default BaseReactCore;
