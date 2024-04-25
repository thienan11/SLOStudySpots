import { prepareTemplate } from "./template.js";

export class DropdownElement extends HTMLElement {
  static template = prepareTemplate(`<template>
    <slot name="actuator">
      <button> 
        <img src="../icons/menu.svg" alt="Menu" id="menu-icon"/>
      </button>
    </slot>
    <div id="panel">
      <slot></slot>
    </div>
    
    <style>
      :host {
        position: relative;
        font-family: var(--font-family-body);
        display: inline-block; /* Ensures the component does not span full width */
      }
      #panel {
        display: none;
        position: absolute;
        right: 0; /* Align the right edge of the dropdown with the right edge of the button */
        margin-top: var(--space-small); /* Small spacing from the button */
        width: max-content;
        padding: var(--space-small);
        border-radius: var(--border-radius);
        background: var(--color-background-secondary);
        color: var(--color-text);
        box-shadow: var(--shadow-hover-med);
        z-index: 1000; /* Ensure dropdown is on top of other elements */
      }
      :host([open]) #panel {
        display: block;
      }
      button {
        background: var(--color-primary);
        border: none;
        padding: 8px;
        color: var(--color-text);
        cursor: pointer;
        border-radius: var(--border-radius);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      button:hover {
        background: var(--color-links);
      }
      #menu-icon {
        width: 24px; /* Adjust size as needed */
        height: auto;
        transition: transform 0.3s ease; /* Smooth transform on state change */
      }
    </style>
  </template>`);

  constructor() {
    super();

    this.attachShadow({ mode: "open" }).appendChild(
      DropdownElement.template.cloneNode(true)
    );
    this.shadowRoot
      .querySelector("slot[name='actuator']")
      .addEventListener("click", () => this.toggle());
  }

  toggle() {
    if (this.hasAttribute("open")) this.removeAttribute("open");
    else this.setAttribute("open", "open");
  }
}

customElements.define("drop-down", DropdownElement);
