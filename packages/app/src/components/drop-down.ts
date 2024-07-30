import { LitElement, html, css } from "lit";

export class DropdownElement extends LitElement {
  static styles = css`
    :host {
      position: relative;
      font-family: var(--font-family-body);
      display: inline-block;
    }
    #panel {
      display: none;
      position: absolute;
      right: 0;
      margin-top: var(--space-small);
      width: max-content;
      padding: var(--space-small);
      border-radius: var(--border-radius);
      background: var(--color-background-secondary);
      color: var(--color-text);
      box-shadow: var(--shadow-hover-med);
      z-index: 1000;
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
      width: 24px;
      height: auto;
      transition: transform 0.3s ease;
      filter: var(--invert-black-to-white);
    }
  `;

  render() {
    return html`
      <slot name="actuator">
        <button @click="${this.toggle}">
          <img src="/icons/menu.svg" alt="Menu" id="menu-icon" />
        </button>
      </slot>
      <div id="panel">
        <slot></slot>
      </div>
    `;
  }

  toggle() {
    const isOpen = this.hasAttribute("open");
    if (!isOpen) {
      // Open the dropdown and add a listener for clicks outside
      this.setAttribute("open", "");
      setTimeout(() => {
        window.addEventListener("click", this._onClickAway);
      }, 0);
    } else {
      // Close the dropdown and remove the listener
      this.removeAttribute("open");
      window.removeEventListener("click", this._onClickAway);
    }
  }

  _onClickAway = (event: MouseEvent) => {
    if (!this.contains(event.target as Node)) {
      this.removeAttribute("open");
      window.removeEventListener("click", this._onClickAway);
    }
  };

  disconnectedCallback() {
    super.disconnectedCallback();
    // Ensure to clean up the event listener when the component is destroyed
    window.removeEventListener("click", this._onClickAway);
  }
}

customElements.define("drop-down", DropdownElement);
