import { Editor } from "grapesjs";
import html2canvas from "html2canvas";
import { onSubmit, getBlocksFromLocalStorage } from "./function";

export function customSaveModal(editor: Editor): any {
  const selectedComponent = editor.getSelected();
  // Get the Modal module
  const modal = editor.Modal;

  // Define the content of the modal
  const content = `
                <div class="modal">
                <div class="modal-content">
                  <div>
                    <p>Details</p>
                    <div class="container form-row">
                      <input class="form-column" type="text" id="component-name" name="component-name" placeholder="name">
                      <input class="form-column" type="text" id="component-category" name="component-category" placeholder="category">
                    </div>
                    <div class="container image-container">
                      <div id="screenShotCanvas"/>
                    </div>
                    <div class="container button-container">
                      <button id="submit" class="button save-button">Save</button>
                      <button id="reset" class="button reset-button">Reset</button>
                    </div>
                  </div>
                </div>
              </div>
`;


// Create the modal
const myModal = modal.open({
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
    // console.log(canvas.toDataURL());
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
      name: nameBlock.value,
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
  const blocks = getBlocksFromLocalStorage();
}
