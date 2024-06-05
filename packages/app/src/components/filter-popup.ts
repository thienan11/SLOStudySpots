import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";

class FilterPopup extends LitElement {
  @property({ reflect: true, type: Boolean })
  open: boolean = false;

  @state()
  sort: boolean = false;

  static styles = css`
    * {
      margin: 0;
      padding: 0;
    }

    .popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5); /* Darkens the background */
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .popup {
      background-color: white;
      padding: 20px;
      height: 40vh;
      width: 40vw;
      border-radius: 5px;
      position: relative;
    }

    .filter-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      padding: 10px;
      border-radius: 10px;
      background-color: var(--color-main-bg);
      margin-left: 30px;
      border: 1px solid var(--color-light);
    }

    .filter-icon {
      display: inline;
      height: 25px;
      width: 25px;
      vertical-align: top;
      fill: var(--color-primary);
      stroke: var(--color-primary);
      transform: translate(1.5px, 1px);
      background-color: inherit;
    }

    .filter-container h4 {
      font-size: 15px;
      font-weight: 500;
      color: var(--color-primary);
      background-color: inherit;
    }

    .filter-container:hover {
      cursor: pointer;
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
      border: 1px solid var(--color-light);
      padding: 10px 20px;
      border-radius: 5px;
      margin-top: 10px;
    }

    button:hover {
      background-color: rgb(230, 230, 230);
    }
    
  `;

  openPopup() {
    this.open = true;
    // document.body.style.overflow = 'hidden'; // Disable scrolling on the background
  }

  closePopup(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    if (clickedElement.classList.contains("popup-overlay")) {
      this.open = false;
      document.body.style.overflow = ""; // Enable scrolling back on the background
      console.log("Closing popup...");
    }
  }

  triggerSort() {
    this.sort = !this.sort;
    this.dispatchEvent(
      new CustomEvent("sort-requested", { detail: this.sort })
    );
    // this.open = false;
  }

  render() {
    return html`
  
        <button class="filter-container" @click="${this.openPopup}">
          <svg class="filter-icon">
            <use href="/icons/filter.svg#icon-filter" />
          </svg>
          <h4>Filter</h4>
        </button>

        ${
          this.open
            ? html`
                <div class="popup-overlay" @click="${this.closePopup}">
                  <div class="popup">
                    <div class="filter-title">
                      <h3>Change Filters</h3>

                      <img
                        class="close"
                        src="/icons/close.svg"
                        alt="close"
                        class="close-button"
                        @click="${() => (this.open = false)}"
                        width="30px"
                      />
                    </div>

                    <button @click="${this.triggerSort}" class="sort-button">
                      Sort Alphabetically
                    </button>

                    <button @click="${this.triggerSort}" class="sort-button">
                      Sort By Date
                    </button>

                  </div>
                </div>
              `
            : ""
        }
      </div>
    `;
  }
}

customElements.define("filter-popup", FilterPopup);