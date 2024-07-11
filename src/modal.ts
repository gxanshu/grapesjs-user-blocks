import { Editor } from "grapesjs";
import html2canvas from "html2canvas";
import { onSubmit } from "./function";
import { UserBlocks } from "./UserBlocks"

export function customSaveModal(editor: Editor): any {
  const selectedComponent = editor.getSelected();
  // Get the Modal module
  const Modal = editor.Modal;

  // Define the content of the modal
  const content = `
<div class="modal">
  <div class="modal-content">
    <div>
      <p>Details</p>
      <div class="container form-row">
        <div class="gjs-field-wrp gjs-field-wrp--text">
          <div class="gjs-field gjs-field-text">
            <input class="form-column" type="text" id="component-name" name="component-name" placeholder="name">
          </div>
        </div>
        <div class="gjs-field-wrp gjs-field-wrp--text">
          <div class="gjs-field gjs-field-text">
            <input class="form-column" type="text" id="component-category" name="component-category" placeholder="category">
          </div>
        </div>
      </div>
      <div class="container image-container">
        <div id="screenShotCanvas"></div>
      </div>
      <div class="container button-container">
        <button id="submit" class="gjs-btn-prim save-button">Save</button>
        <button id="reset" class="gjs-btn-prim reset-button">Reset</button>
      </div>
    </div>
  </div>
</div>`;


  // Create the modal
  const myModal = Modal.open({
    content,
    title: "Save",
    width: "400px",
    height: "auto",
    closedOnEscape: true,
    closedOnClickOutside: true,
  });

  const submitButton = document.getElementById("submit") as HTMLButtonElement;
  submitButton?.addEventListener("click", handleSubmit);

  const resetButton = document.getElementById("reset") as HTMLButtonElement;
  resetButton?.addEventListener("click", handleReset);

  myModal.onceClose(() => {
    submitButton?.removeEventListener('click', handleSubmit);
    resetButton?.removeEventListener('click', handleReset);
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
      id: nameBlock.value,
      category: categoryBlock.value,
    };

    onSubmit({ selectedComponent, editor, details, myModal });
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

  return myModal;
}

export function customEditModal(editor: Editor) {
  const Modal = editor.Modal;
  const BlockManager = editor.Blocks;
  const userBlocks = new UserBlocks(editor)
  const list = userBlocks.blocks;
  const content = `<div class="modal">
  <form id="saveAllForm" class="modal-content gjs-sm-properties" style="display: block">
  ${Object.entries(list)
    .map(
      ([category, blocks]) =>
        `<div class="gjs-trt-trait__wrp gjs-trt-trait__wrp-id" style="max-width: 300px;">
          <div class="gjs-trt-trait gjs-trt-trait--text">
            <div class="gjs-label-wrp">
              <div class="gjs-label" title="Category">Category</div>
            </div>
            <div class="gjs-field-wrp gjs-field-wrp--text">
              <div class="gjs-field gjs-field-text">
                <input type="hidden" name="${category}OldName" value="${category}"/>
                <input type="text" name="${category}NewName" class="category-input" value="${category}"/>
              </div>
            </div>
          </div>
        </div>
        <div class="gjs-sm-field gjs-sm-composite">
        <div class="gjs-sm-properties" style="display:block">
          <ul class="gjs-fields" style="flex-wrap: wrap; list-style:none; padding: 0">
          ${Object.entries(blocks as any)
            .map(
              ([blockName]) =>
                `<li style="display: flex" data-block-item="${blockName}">
                  <div class="gjs-trt-trait__wrp gjs-trt-trait__wrp-id">
                    <div class="gjs-trt-trait gjs-trt-trait--text" style="width:100%; box-sizing: border-box;">
                      <div class="gjs-label-wrp">
                        <div class="gjs-label" title="Block">Block</div>
                      </div>
                      <div class="gjs-field-wrp gjs-field-wrp--text">
                        <div class="gjs-field gjs-field-text">
                          <input type="hidden" name="${blockName}OldName" value="${blockName}"/>
                          <input type="text" name="${blockName}NewName" class="name-input" value="${blockName}"/>
                        </div>
                      </div>
                      <button type="button" class="gjs-btn-prim delete-button" data-block-id="${blockName}">Delete</button>
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
    <button type="submit" class="gjs-btn-prim save-all-button" form="saveAllForm">Save</button>
  </form>
</div>`;
  const myModal = Modal.open({
    content,
    title: "Edit",
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
  myModal.onceClose(() => {
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
    if (!confirm("Are you sure you want to delete this block?")) return;
    BlockManager.remove(blockId)
    userBlocks.removeBlock(blockId)
    if (blockElement) blockElement.remove();
    await editor.store()
  }

  async function handleSaveAll(e: any) {
    e.preventDefault();
    var formData = new FormData(e.target);

    Object.entries(userBlocks.blocks).forEach(([category, blocks]) => {
      const oldCategory = formData.get(`${category}OldName`) as string;
      const newCategory = formData.get(`${category}NewName`) as string;
      if (oldCategory !== newCategory) {
        userBlocks.updateBlockCategory(oldCategory, newCategory);
      }

      Object.entries(blocks).forEach(([blockName, block]) => {
        const oldName = formData.get(`${blockName}OldName`) as string;
        const newName = formData.get(`${blockName}NewName`) as string;
        if (oldName === newName) return;
        userBlocks.updateBlock(oldName, newName);
      });
    });
    await editor.store();
    myModal.close();
  }
}
