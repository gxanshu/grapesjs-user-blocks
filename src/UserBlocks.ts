import { Editor } from "grapesjs";

type Block = { label: string; cssCode: string; htmlCode: string };
type AddBlock = {
  details: { id: string, label: string; category: string },
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
    const { userBlocks } = await this.editor.load({});
    if (!userBlocks) return;

    this._blocks = userBlocks;

    return this._blocks;
  }
  get blocks() {
    return this._blocks;
  }
  get categories() {
    return Object.keys(this._blocks);
  }
  addBlock({ details, htmlCode, cssCode }: AddBlock) {
    if (!this._blocks[details.category]) this._blocks[details.category] = {};
    this._blocks[details.category][details.id] = { label: details.label, htmlCode, cssCode };
  }
  updateBlock(blockId: string, label: string) {
    for (let category in this._blocks) {
      let blocks = this._blocks[category];
      if (blocks[blockId]) {
        blocks[blockId] = { ...blocks[blockId], label };
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