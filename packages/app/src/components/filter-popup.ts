import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import resetCSS from "../css/reset";

export class FilterPopup extends LitElement {
  @property({ type: Boolean })
  open: boolean = false;

  @state()
  sort: boolean = false;

  openPopup() {
    this.open = true;
  }

  closePopup(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    if (clickedElement.classList.contains("popup-overlay")) {
      this.open = false;
    }
  }

  triggerSort(sortType: string) {
    this.dispatchEvent(new CustomEvent("sort-requested", { detail: { sortType } }));
    this.open = false;
  }

  render() {
    return html`
      <button class="filter-container" @click="${this.openPopup}">
        <svg class="filter-icon">
          <use href="/icons/filter.svg#icon-filter" />
        </svg>
        <h4>Filter</h4>
      </button>

      ${this.open
        ? html`
            <div class="popup-overlay" @click="${this.closePopup}">
              <div class="popup">
                <div class="filter-title">
                  <h3>Change Filters</h3>
                  <img
                    class="close"
                    src="/icons/close.svg"
                    alt="close"
                    @click="${() => (this.open = false)}"
                    width="30px"
                  />
                </div>

                <button @click="${() => this.triggerSort('alphabetically')}">Sort Alphabetically</button>
              </div>
            </div>
          `
        : ""}
    `;
  }

  static styles = [
    resetCSS,
    css`
    .popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .popup {
      background-color: white;
      padding: 20px;
      height: 25vh;
      width: 25vw;
      border-radius: 5px;
      position: relative;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .filter-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      padding: 10px;
      border-radius: 10px;
      background-color: var(--color-background-primary);
      cursor: pointer;
    }

    .filter-icon {
      height: 25px;
      width: 25px;
      fill: var(--color-primary);
      stroke: var(--color-primary);
      background-color: inherit;
    }

    .filter-container h4 {
      font-size: 15px;
      font-weight: 500;
      color: var(--color-primary);
      background-color: inherit;
    }

    .filter-container:hover {
      background-color: rgb(230, 230, 230);
    }

    .filter-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .close {
      cursor: pointer;
    }

    button {
      cursor: pointer;
      background-color: white;
      border: 1px solid var(--color-background-secondary);
      padding: 10px 20px;
      border-radius: 5px;
      margin-top: 10px;
    }

    button:hover {
      background-color: var(--color-links);
    }
  `];
}