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
  <div class="modal-content gjs-sm-properties" style="display: block">
  ${Object.entries(list)
    .map(
      ([category, blocks]) =>
        `<div class="gjs-trt-trait__wrp gjs-trt-trait__wrp-id" style="max-width: 300px;">
          <form class="form-category gjs-trt-trait gjs-trt-trait--text">
            <div class="gjs-label-wrp">
              <div class="gjs-label" title="Category">Category</div>
            </div>
            <div class="gjs-field-wrp gjs-field-wrp--text">
              <div class="gjs-field gjs-field-text">
                <input type="hidden" name="oldName" value="${category}"/>
                <input name="newName" class="category-input" type="text" value="${category}"/>
              </div>
            </div>
            <button type="submit" class="gjs-btn-prim save-category-button" data-category-id="${category}">Save</button>
          </form>
        </div>
        <div class="gjs-sm-field gjs-sm-composite">
        <div class="gjs-sm-properties" style="display:block">
          <ul class="gjs-fields" style="list-style:none; padding: 0">
          ${Object.entries(blocks as any)
            .map(
              ([blockName]) =>
                `<li>
                  <div class="gjs-trt-trait__wrp gjs-trt-trait__wrp-id">
                    <form class="form-block gjs-trt-trait gjs-trt-trait--text" style="width:100%">
                      <div class="gjs-label-wrp">
                        <div class="gjs-label" title="Block">Block</div>
                      </div>
                      <div class="gjs-field-wrp gjs-field-wrp--text">
                        <div class="gjs-field gjs-field-text">
                          <input name="oldName" type="hidden" value="${blockName}"/>
                          <input name="newName" class="name-input" type="text" value="${blockName}"/>
                        </div>
                      </div>
                      <button type="submit" class="gjs-btn-prim save-button" data-block-id="${blockName}">Save</button>
                      <button type="button" class="gjs-btn-prim delete-button" data-block-id="${blockName}">Delete</button>
                    </form>
                  </div>
                </li>`
            )
            .join("\n\t")}
          </ul>
        </div>
      </div>`
    )
    .join("  ")}
  </div>
</div>`;
  const myModal = Modal.open({
    content,
    title: "Edit",
    closedOnEscape: true,
    closedOnClickOutside: true,
  });


  setTimeout(() => {
    const formBlock = document.querySelectorAll(".form-block");
    formBlock.forEach((elem) => {
      elem.addEventListener("submit", handleSubmit);
    });
    const deleteButton = document.querySelectorAll(".delete-button");
    deleteButton.forEach(elem => {
      elem.addEventListener("click", handleDelete);
    });
    const formCategory = document.querySelectorAll(".form-category");
    formCategory.forEach((elem) => {
      elem.addEventListener("submit", handleSaveCategory);
    });
  }, 1)
  myModal.onceClose(() => {
    const submitButton = document.querySelectorAll(".save-button");
    submitButton.forEach((elem) => {
      elem.removeEventListener("click", handleSubmit);
    });
    const deleteButton = document.querySelectorAll(".delete-button");
    deleteButton.forEach(elem => {
      elem.removeEventListener("click", handleDelete);
    });
    const saveCategoryButton = document.querySelectorAll(".save-category-button");
    saveCategoryButton.forEach(elem => {
      elem.removeEventListener("click", handleSaveCategory);
    });
  });

  function handleSubmit(e: any) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const oldName = formData.get("oldName") as string;
    const newName = formData.get("newName") as string;

    if (!oldName || !newName) return;

    const block = BlockManager.get(oldName);
    block.set('id', newName)
    block.set('label', newName)
    userBlocks.updateBlock(oldName, newName);
    editor.store()
  }

  function handleDelete(e: any) {
    e.preventDefault();
    const blockId = e.target.dataset.blockId;
    BlockManager.remove(blockId)
    userBlocks.removeBlock(blockId)
    editor.store()
  }

  function handleSaveCategory(e: any) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const oldName = formData.get("oldName") as string;
    const newName = formData.get("newName") as string;

    if (!oldName || !newName) return;

    userBlocks.updateBlockCategory(oldName, newName);
    editor.store()
  }
}
