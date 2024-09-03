const Bootstrap = (editor) => {
  editor.DomComponents.addType("bootstrap-card", {
    isComponent: (el) => el.tagName === "DIV" && el.classList.contains("card"),
    model: {
      defaults: {
        tagName: "div",
        attributes: {
          class: "card",
          "data-gjs-name": "card",
        },
        classes: ["card"],
        traits: [
          {
            type: "select",
            label: "Card Size",
            name: "card-size",
            options: [
              { id: "", name: "Default" },
              { id: "card-sm", name: "Small" },
              { id: "card-lg", name: "Large" },
            ],
          },
          {
            type: "checkbox",
            label: "Show Image",
            name: "show-image",
          },
        ],
        components: `
                  <img class="card-img-top" src="https://via.placeholder.com/300x200" alt="Card Image">
                  <div class="card-body">
                    <h5 class="card-title">Card Title</h5>
                    <p class="card-text">This is a short example text.</p>
                    <a href="#" class="btn btn-primary">Go somewhere</a>
                  </div>
                `,
      },
    },
    view: {
      init() {
        console.log("Init");
        this.listenTo(
          this.model,
          "change:attributes:card-size",
          this.updateCardSize
        );
        this.listenTo(
          this.model,
          "change:attributes:show-image",
          this.toggleImage
        );
      },
      updateCardSize() {
        const size = this.model.get("attributes")["card-size"];
        this.el.classList.remove("card-sm", "card-lg");
        if (size) {
          this.el.classList.add(size);
        }
      },
      toggleImage() {
        const showImage = this.model.get("attributes")["show-image"];
        const imgElement = this.el.querySelector(".card-img-top");
        if (imgElement) {
          imgElement.style.display = showImage ? "block" : "none";
        }
      },
    },
  });

  editor.BlockManager.add("bootstrap-card", {
    label: "بطاقة بوتستراب",
    category: "أساسيات",
    content: { type: "bootstrap-card" },
    media: '<img src="path_to_card_icon.png" alt="بطاقة بوتستراب">',
  });
};

export default Bootstrap;
