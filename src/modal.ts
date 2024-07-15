import { Editor } from "grapesjs";
import html2canvas from "html2canvas";
import { onSubmit, uniqueId } from "./function";
import { getInstance } from "./UserBlocks"

export function customSaveModal(editor: Editor, opts: any): any {
  const selectedComponent = editor.getSelected();
  // Get the Modal module
  const Modal = editor.Modal;

  // Define the content of the modal
  const content = `
<div class="modal">
  <div class="modal-content gjs-sm-properties" style="display: block">
    <div>
      <div style="margin-bottom: 10px; display: flex; gap: 10px;">
        <div class="gjs-field-wrp gjs-field-wrp--text">
          <div class="gjs-field gjs-field-text">
            <input class="form-column" type="text" id="component-name" name="component-name" placeholder="${opts.blockLabel}">
          </div>
        </div>
        <div class="gjs-field-wrp gjs-field-wrp--text">
          <div class="gjs-field gjs-field-text">
            <input class="form-column" type="text" id="component-category" name="component-category" placeholder="${opts.categoryLabel}">
          </div>
        </div>
      </div>
      <div style="margin-bottom: 10px;">
        <div id="screenShotCanvas" style="max-height: 300px; overflow: auto;"></div>
      </div>
      <div>
        <button id="submit" class="gjs-btn-prim save-button">${opts.buttonSaveLabel}</button>
        <button id="reset" class="gjs-btn-prim reset-button">${opts.buttonResetLabel}</button>
      </div>
    </div>
  </div>
</div>`;


  // Create the modal
  const saveModal = Modal.open({
    content,
    title: opts.modalSaveTitle,
    width: "400px",
    height: "auto",
    closedOnEscape: true,
    closedOnClickOutside: true,
  });

  const submitButton = document.getElementById("submit") as HTMLButtonElement;
  submitButton?.addEventListener("click", handleSubmit);

  const resetButton = document.getElementById("reset") as HTMLButtonElement;
  resetButton?.addEventListener("click", handleReset);

  saveModal.onceClose(() => {
    submitButton?.removeEventListener("click", handleSubmit);
    resetButton?.removeEventListener("click", handleReset);
  });

  /* functioning of modal */
  html2canvas(selectedComponent?.getEl() as HTMLElement).then(function (
    canvas
  ) {
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    document.getElementById("screenShotCanvas")?.appendChild(canvas);
  });

  function handleSubmit() {
    const nameBlock = document.getElementById(
      "component-name"
    ) as HTMLInputElement;
    const categoryBlock = document.getElementById(
      "component-category"
    ) as HTMLInputElement;

    const details = {
      id: uniqueId(),
      label: nameBlock.value,
      category: categoryBlock.value,
    };

    onSubmit({ selectedComponent, editor, details, saveModal });
  }

  function handleReset() {
    const nameBlock = document.getElementById(
      "component-name"
    ) as HTMLInputElement;
    const categoryBlock = document.getElementById(
      "component-category"
    ) as HTMLInputElement;

    nameBlock.value = "";
    categoryBlock.value = "";
  }

  return saveModal;
}

export function customEditModal(editor: Editor, opts: any) {
  const Modal = editor.Modal;
  const BlockManager = editor.Blocks;
  const userBlocks = getInstance(editor)
  const list = userBlocks.blocks;
  const content = `<div class="modal">
  <form id="saveAllForm" class="modal-content gjs-sm-properties" style="display: block">
  ${Object.entries(list)
    .map(
      ([category, blocks]) =>
        `<div class="gjs-trt-trait__wrp gjs-trt-trait__wrp-id" style="margin-bottom: 10px; max-width: 300px;">
          <div class="gjs-trt-trait gjs-trt-trait--text">
            <div class="gjs-label-wrp">
              <div class="gjs-label" title="${opts.categoryLabel}">${opts.categoryLabel}</div>
            </div>
            <div class="gjs-field-wrp gjs-field-wrp--text">
              <div class="gjs-field gjs-field-text">
                <input type="hidden" name="${category}OldName" value="${category}"/>
                <input type="text" name="${category}NewName" class="category-input" value="${category}" placeholder="${opts.categoryLabel}"/>
              </div>
            </div>
          </div>
        </div>
        <div class="gjs-sm-field gjs-sm-composite" style="margin-bottom: 10px;">
        <div class="gjs-sm-properties" style="display:block">
          <ul class="gjs-fields" style="flex-wrap: wrap; list-style:none; padding: 0">
          ${Object.entries(blocks)
            .map(
              ([blockId]) =>
                `<li style="display: flex" data-block-item="${blockId}">
                  <div class="gjs-trt-trait__wrp gjs-trt-trait__wrp-id">
                    <div class="gjs-trt-trait gjs-trt-trait--text" style="width:100%; box-sizing: border-box;">
                      <div class="gjs-label-wrp">
                        <div class="gjs-label" title="${opts.blockLabel}">${opts.blockLabel}</div>
                      </div>
                      <div class="gjs-field-wrp gjs-field-wrp--text">
                        <div class="gjs-field gjs-field-text">
                          <input type="hidden" name="${blockId}Id" value="${blockId}"/>
                          <input type="text" name="${blockId}NewName" class="name-input" value="${blocks[blockId].label}" placeholder="${opts.blockLabel}"/>
                        </div>
                      </div>
                      <button type="button" class="gjs-btn-prim delete-button" data-block-id="${blockId}">${opts.buttonDeleteLabel}</button>
                    </div>
                  </div>
                </li>`
            )
            .join("\n\t")}
          </ul>
        </div>
      </div>`
    )
    .join("  ")}
    <button type="submit" class="gjs-btn-prim save-all-button" form="saveAllForm">${opts.buttonSaveLabel}</button>
  </form>
</div>`;
  const editModal = Modal.open({
    content,
    title: opts.modalEditTitle,
    closedOnEscape: true,
    closedOnClickOutside: true,
  });


  setTimeout(() => {
    const deleteButton = document.querySelectorAll(".delete-button");
    deleteButton.forEach(elem => {
      elem.addEventListener("click", handleDelete);
    });
    document.getElementById('saveAllForm')?.addEventListener('submit', handleSaveAll);
  }, 1)
  editModal.onceClose(() => {
    const deleteButton = document.querySelectorAll(".delete-button");
    deleteButton.forEach((elem) => {
      elem.removeEventListener("click", handleDelete);
    });
    document
      .getElementById("saveAllForm")
      ?.removeEventListener("submit", handleSaveAll);
  });

  async function handleDelete(e: any) {
    e.preventDefault();
    const blockId = e.target.dataset.blockId;
    const blockElement = document.querySelector(`[data-block-item="${blockId}"]`);
    if (!confirm(opts.messageDeleteBlock)) return;
    BlockManager.remove(blockId)
    userBlocks.removeBlock(blockId)
    if (blockElement) blockElement.remove();
    await editor.store()
  }

  async function handleSaveAll(e: any) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const categories = BlockManager.getCategories();
    Object.entries(userBlocks.blocks).forEach(([category, blocks]) => {
      const oldCategory = formData.get(`${category}OldName`) as string;
      const newCategory = formData.get(`${category}NewName`) as string;
      if (oldCategory !== newCategory) {
        userBlocks.updateBlockCategory(oldCategory, newCategory);
        const category = categories.get(oldCategory);
        category.set("label", newCategory);
        category.set("id", newCategory);
      }

      Object.entries(blocks).forEach(([blockId]) => {
        const newName = formData.get(`${blockId}NewName`) as string;
        userBlocks.updateBlock(blockId, newName);
        const block = BlockManager.get(blockId);
        block.set("label", newName);
      });
    });
    await editor.store();
    editModal.close();
  }
}
