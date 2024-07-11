import { Editor } from "grapesjs";
import {
  onSubmitProps,
} from "./types";
import { UserBlocks } from "./UserBlocks"

/**
 * handle onSubmit button generate HTML & CSS of selected component and save them in local
 * storage
 * @param selectedComponent selected component
 * @param editor grapesjs editor
 * @param details name and category of component
 * @param myModal modal for user blocks
 */
export function onSubmit({
  selectedComponent,
  editor,
  details,
  myModal,
}: onSubmitProps) {
  const BlockManager = editor.Blocks; // `Blocks` is an alias of `BlockManager`
  const htmlCode = selectedComponent?.toHTML() as string;
  let cssCode = editor.CodeManager.getCode(selectedComponent, "css", {
    cssc: editor.CssComposer,
  });


  const userBlocks = new UserBlocks(editor);
  userBlocks.addBlock({ details, htmlCode, cssCode });
  editor.store();
  BlockManager.add(details.id, {
    label: details.id,
    category: details.category,
    content: `${htmlCode}
      <style>
      ${cssCode}
      </style>`,
  });

  myModal.close();
}

/**
 * load all the blocks from localStorage and render Blockmanager
 * @param BlockManager grapesjs block manager eg. editor.blocks
 */
export function loadAllBlocksInBlockManager(editor: Editor) {
  // updating BlockManager
  const userBlocks = new UserBlocks(editor)
  const BlockManager = editor.BlockManager
  let allBlocks = userBlocks.blocks;
  // Iterate over the allBlocks object
  for (let category in allBlocks) {
    let blocks = allBlocks[category];
    for (let blockID in blocks) {
      let block = blocks[blockID];
      let details = {
        id: blockID,
        category: category,
      };
      let htmlCode = block.htmlCode;
      let cssCode = block.cssCode;
      BlockManager.add(details.id, {
        // Your block properties...
        label: details.id,
        category: details.category,
        content: `${htmlCode}
      <style>
      ${cssCode}
      </style>`,
      });
    }
  }
  BlockManager.render();
}