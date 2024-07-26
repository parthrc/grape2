This repo contains a basic implementation of a custom React component text box with slash menu functionality as part of custom Grapesjs Block.

## Grapesjs editor initialization

The `App.jsx` file contains the configuration for the main Grapesjs editor.
We need to add a custom plugin for rendering React components as grapesjs blocks. The creation of this plugin is explained ahead in core react model & view implementation section.
We also need to add css files of any third party libraries we may have used. First we need to copy those css files and place in the public folder and then add the path to the **canvas** option.
Once the editor in initialized we need to add our custom React components to the Blocks lsit so that appears in the right side blocks section which makes it able to be dragged and dropped.
Now we need to create alist of items to be placed in the slash menu, we can do it by getting all the blocks from the BlockManager and creating list which we store in a zustand store, so that we can access it in the SlashMenu component

## Core react model & view implementation for Grapesjs

The `grapesjs/core` folder contains the core implementation of the grapesjs model and view, required to render a React Component as a grapesjs block.
Any new custom react component we make has to extend these core react models and views.

## Tiptap integration

The `tiptap/tiptap.jsx` file contains the Tiptap editor implementation Tiptap is the rich text editor used since it makes it easier to create custom functionality like the slash menu functionality we have developed.
