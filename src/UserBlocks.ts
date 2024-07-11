import { Editor } from "grapesjs";

type Block = { cssCode: string; htmlCode: string };
type AddBlock = {
  details: { id: string, category: string },
  htmlCode: string,
  cssCode: string
}

let _blocks: { [category: string]: { [id: string]: Block } } = {};

export class UserBlocks {
  constructor(public editor: Editor) {
    this.editor = editor;
  }

  async loadBlocks() {
    const { userBlocks } = await this.editor.load();
    if (!userBlocks) return;

    _blocks = userBlocks;

    return _blocks;
  }
  get blocks() {
    return _blocks;
  }
  addBlock({ details, htmlCode, cssCode }: AddBlock) {
    if (!_blocks[details.category]) _blocks[details.category] = {};
    _blocks[details.category][details.id] = { htmlCode, cssCode };
  }
  updateBlock(oldBlockId: string, newBlockId: string) {
    for (let category in _blocks) {
      let blocks = _blocks[category];
      if (blocks[oldBlockId]) {
        blocks[newBlockId] = blocks[oldBlockId];
        delete blocks[oldBlockId];
        break;
      }
    }
  }
  removeBlock(blockId: string) {
    for (let category in _blocks) {
      let blocks = _blocks[category];
      if (blocks[blockId]) {
        delete blocks[blockId];
        break;
      }
    }
  }
  updateBlockCategory(oldCategory: string, newCategory: string) {
    if (_blocks[oldCategory]) {
      _blocks[newCategory] = _blocks[oldCategory];
      delete _blocks[oldCategory];
    }
  }
}