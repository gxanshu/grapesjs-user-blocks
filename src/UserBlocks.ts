import { Editor } from "grapesjs";

type Block = { cssCode: string; htmlCode: string };
type AddBlock = {
  details: { id: string, category: string },
  htmlCode: string,
  cssCode: string
}

let instance: UserBlocks;

class UserBlocks {
  private _blocks: { [category: string]: { [id: string]: Block } } = {};
  constructor(public editor: Editor) {
    if (instance) {
      throw new Error("New instance cannot be created!");
    }
    this.editor = editor;
  }

  async loadBlocks() {
    const { userBlocks } = await this.editor.load();
    if (!userBlocks) return;

    this._blocks = userBlocks;

    return this._blocks;
  }
  get blocks() {
    return this._blocks;
  }
  addBlock({ details, htmlCode, cssCode }: AddBlock) {
    if (!this._blocks[details.category]) this._blocks[details.category] = {};
    this._blocks[details.category][details.id] = { htmlCode, cssCode };
  }
  updateBlock(oldBlockId: string, newBlockId: string) {
    for (let category in this._blocks) {
      let blocks = this._blocks[category];
      if (blocks[oldBlockId]) {
        blocks[newBlockId] = blocks[oldBlockId];
        delete blocks[oldBlockId];
        break;
      }
    }
  }
  removeBlock(blockId: string) {
    for (let category in this._blocks) {
      let blocks = this._blocks[category];
      if (blocks[blockId]) {
        delete blocks[blockId];
        break;
      }
    }
  }
  updateBlockCategory(oldCategory: string, newCategory: string) {
    if (this._blocks[oldCategory]) {
      this._blocks[newCategory] = this._blocks[oldCategory];
      delete this._blocks[oldCategory];
    }
  }
}

export function getInstance(editor: Editor) {
  if (!instance) instance = new UserBlocks(editor);
  return instance;
}