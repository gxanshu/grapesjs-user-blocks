import {Editor, Component} from "grapesjs"

export interface onSubmitProps {
    selectedComponent: Component | undefined;
    editor: Editor;
    details: {
      id: string;
      category: string
    }
    // ModalModule
    myModal: any
}

export interface setBlockInLocalStorageProps {
    details: onSubmitProps["details"];
    htmlCode: string
    cssCode: string
}

export interface addBlocksToBlockManagerProps {
    BlockManager: any
    details: {
        id: string
        category: string
    }
    htmlCode: string
    cssCode: string
}