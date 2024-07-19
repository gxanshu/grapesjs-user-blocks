import { Editor } from "grapesjs";
import { getInstance } from "./UserBlocks";

export default (editor: Editor) => {
  const Storage = editor.StorageManager;
  const currentStorage = Storage.getCurrentStorage();
  const userBlocks = getInstance(editor);

  if(!currentStorage) return;

  editor.Storage.add(Storage.getCurrent(), {
    async load() {
      return currentStorage.load(Storage.getCurrentOptions());
    },
    async store(data) {
      return currentStorage.store(
        { ...data, userBlocks: userBlocks.blocks },
        Storage.getCurrentOptions()
      );
    },
  });
}