import React from "react";
import { createRoot, Root } from "react-dom/client";
import BaseEntity from "./entity/BaseEntity";
import Entity from "./entity/Entity";

/** Useful for rendering react to the screen when you want it */
export class ReactEntity<Props> extends BaseEntity implements Entity {
  el!: HTMLDivElement;
  autoRender = true;

  reactRoot!: Root;

  constructor(private getContent: () => React.ReactElement) {
    super();
  }

  reactRender() {
    this.reactRoot.render(this.getContent());
  }

  onRender() {
    if (this.autoRender) {
      this.reactRender();
    }
  }

  onAdd() {
    this.el = document.createElement("div");
    document.body.append(this.el);
    this.reactRoot = createRoot(this.el);
  }

  onDestroy() {
    this.el.remove();
    this.reactRoot.unmount();
  }
}
