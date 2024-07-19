import { Editor, Component } from "grapesjs";
import { getInstance } from "./UserBlocks"

interface onSubmitProps {
  selectedComponent: Component | undefined;
  editor: Editor;
  details: {
    id: string;
    label: string;
    category: string;
  };
  saveModal: any;
}

/**
 * handle onSubmit button generate HTML & CSS of selected component and save them in local
 * storage
 * @param selectedComponent selected component
 * @param editor grapesjs editor
 * @param details name and category of component
 * @param saveModal modal for user blocks
 */
export function onSubmit({
  selectedComponent,
  editor,
  details,
  saveModal,
}: onSubmitProps) {
  const BlockManager = editor.Blocks; // `Blocks` is an alias of `BlockManager`
  const htmlCode = selectedComponent?.toHTML() as string;
  let cssCode = editor.CodeManager.getCode(selectedComponent, "css", {
    cssc: editor.CssComposer,
  });

  const userBlocks = getInstance(editor);
  userBlocks.addBlock({ details, htmlCode, cssCode });
  editor.store({});
  BlockManager.add(details.id, {
    label: details.label,
    category: details.category,
    content: `${htmlCode}
      <style>
      ${cssCode}
      </style>`,
  });

  saveModal.close();
}

/**
 * load all the blocks from localStorage and render Blockmanager
 * @param BlockManager grapesjs block manager eg. editor.blocks
 */
export function loadAllBlocksInBlockManager(editor: Editor) {
  // updating BlockManager
  const userBlocks = getInstance(editor)
  const BlockManager = editor.BlockManager
  let allBlocks = userBlocks.blocks;
  // Iterate over the allBlocks object
  for (let category in allBlocks) {
    let blocks = allBlocks[category];
    for (let blockId in blocks) {
      let block = blocks[blockId];
      let details = {
        id: blockId,
        label: block.label,
        category: category,
      };
      let htmlCode = block.htmlCode;
      let cssCode = block.cssCode;
      BlockManager.add(details.id, {
        // Your block properties...
        label: details.label,
        category: details.category,
        content: `${htmlCode}
      <style>
      ${cssCode}
      </style>`,
      });
    }
  }
  // @ts-ignore by default render all global blocks
  BlockManager.render();
}

export function uniqueId() {
  const dateString = Date.now().toString(36);
  const randomness = Math.random().toString(36).slice(2);
  return dateString + randomness;
};