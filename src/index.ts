import { Editor } from 'grapesjs'
import { customSaveModal, customEditModal } from "./modal";
import { loadAllBlocksInBlockManager } from "./function";
import storage from './storage'
import { getInstance } from './UserBlocks'

export type PluginOptions = {
  blockLabel: string;
  categoryLabel: string;
  buttonSaveLabel: string;
  buttonResetLabel: string;
  buttonEditLabel: string;
  buttonDeleteLabel: string;
  modalSaveTitle: string;
  modalEditTitle: string;
  messageDeleteBlock: string;
  newCategoryLabel: string;
};

export default (editor: Editor, opts = {}) => {
  const options: PluginOptions = {
    blockLabel: "Name",
    categoryLabel: "Category",
    buttonSaveLabel: "Save",
    buttonResetLabel: "Reset",
    buttonEditLabel: "Edit Blocks",
    buttonDeleteLabel: "Delete",
    modalSaveTitle: "Save",
    modalEditTitle: "Edit",
    messageDeleteBlock: "Are you sure you want to delete this block?",
    newCategoryLabel: "New Category",
    ...opts
  };
  const dc = editor.DomComponents;
  const Commands = editor.Commands;
  const PanelManager = editor.Panels;
  const userBlocks = getInstance(editor);
  const commandAddBlock = "block-adder";
  const commandEditBlocks = "blocks-editor";
  const htmlLabel = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
  </svg>
  `;

  storage(editor);

  // load all the blocks from blockmanager as soon as editor init
  userBlocks.loadBlocks().then(() => loadAllBlocksInBlockManager(editor));

  PanelManager.addButton("options", {
    id: commandEditBlocks,
    className: "fa fa-folder",
    command: commandEditBlocks,
    attributes: { title: options.buttonEditLabel },
  });

  dc.getTypes().forEach((elType) => {
    const { model: oldModel, view: oldView } = elType;
    dc.addType(elType.id, {
      model: oldModel.extend({
        initToolbar() {
          //@ts-ignore i don't know
          // eslint-disable-next-line prefer-rest-params
          oldModel.prototype.initToolbar.apply(this, arguments);
          const toolbar = this.get("toolbar");

          if (
            !toolbar.filter((tlb: any) => tlb.id === commandAddBlock).length
          ) {
            toolbar.unshift({
              id: commandAddBlock,
              command: function () {
                customSaveModal(editor, options);
              },
              label: htmlLabel,
            });
            this.set("toolbar", toolbar);
          }
        },
      }),
      view: oldView,
    });
  });

  Commands.add(commandEditBlocks, {
    run: () => customEditModal(editor, options),
  });
};
