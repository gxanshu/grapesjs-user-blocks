import {
  onSubmitProps,
  setBlockInLocalStorageProps,
  addBlocksToBlockManagerProps,
} from "./types";

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
  // for debuging only
  // console.log("htmlCode: ", htmlCode)
  // console.log("cssCode: ", cssCode)
  setBlockInLocalStorage({ details, htmlCode, cssCode });
  loadAllBlocksFromLocalStorage(BlockManager);
  myModal.close();
}

/**
 * initize or proivde ID for the block
 * @returns ID from component (unique block number)
 */
function localStorageIniter(): number {
  let blockValue = localStorage.getItem("totalBlocks");
  if (blockValue) {
    blockValue = String(parseInt(blockValue, 10) + 1);
  } else {
    blockValue = "1";
  }
  localStorage.setItem("totalBlocks", blockValue);
  return parseInt(blockValue, 10);
}

/**
 * return blocks from Local Storage if nothing theres then it return {}
 * @returns {} of blocks
 */
export function getBlocksFromLocalStorage(): any {
  let initalValue = {};

  let blocks = localStorage.getItem("userBlocks");
  if (blocks == null) {
    return initalValue;
  } else {
    return JSON.parse(blocks);
  }
}

/**
 * set block's data into localStorage
 * @param details name and category of block
 * @param htmlCode html code string
 * @param cssCode css code string
 */

export function setBlockInLocalStorage({
  details,
  htmlCode,
  cssCode,
}: setBlockInLocalStorageProps) {
  let blockNumber = localStorageIniter();
  const newName = `${details.name}-${blockNumber}`;
  let allBlocks = getBlocksFromLocalStorage();
  if (!allBlocks[details.category]) {
    allBlocks[details.category] = {};
  }

  allBlocks[details.category][newName] = {
    htmlCode,
    cssCode,
  };

  //updating blockNumbr
  blockNumber = blockNumber + 1;
  localStorage.setItem("totalBlocks", JSON.stringify(blockNumber));
  localStorage.setItem("userBlocks", JSON.stringify(allBlocks));
}

/**
 * add block to BlockManager
 * @param BlockManager grapesjs block manager editor.Blocks
 * @param details id and category of block
 * @param htmlCode html string
 * @param cssCode css string
 */
export function addBlocksToBlockManager({
  BlockManager,
  details,
  htmlCode,
  cssCode,
}: addBlocksToBlockManagerProps) {
  // Add a new Block
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

/**
 * load all the blocks from localStorage and render Blockmanager
 * @param BlockManager grapesjs block manager eg. editor.blocks
 */
export function loadAllBlocksFromLocalStorage(BlockManager: any) {
  // updating BlockManager
  let allBlocks = getBlocksFromLocalStorage();
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
      addBlocksToBlockManager({ BlockManager, details, htmlCode, cssCode });
    }
  }
  BlockManager.render();
}
