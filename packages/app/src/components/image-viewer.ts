import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

export class ImageViewerElement extends LitElement {
  @property({ type: String }) url = '';
  @property({ type: String }) uploadedBy = '';
  @property({ type: String }) uploadDate = '';
  @property({ type: Boolean, reflect: true }) open = false;

  static styles = css`
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      visibility: hidden;
      opacity: 0;
      transition: opacity 0.3s, visibility 0.3s;
      z-index: 1000;
      overflow: auto;
    }

    :host([open]) {
      visibility: visible;
      opacity: 1;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .popup {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--color-background-secondary);
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      max-width: 90%;
      max-height: 90%;
      overflow: auto;
      box-sizing: border-box;
      z-index: 1001; /* Ensure it is above the overlay */
    }

    .popup img {
      max-width: 100%;
      height: auto;
      display: block;
      margin-bottom: 10px;
    }

    .popup .details {
      font-size: 14px;
      color: var(--color-text-secondary);
      display: flex;
      justify-content: space-between;
    }

    .popup .close-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: #ff0000;
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      cursor: pointer;
    }

    .close-btn:hover {
      transform: scale(1.1);
    }

    @media (max-width: 600px) {
      .popup {
        width: 95%;
        height: auto;
        padding: 10px;
      }

      .popup img {
        width: 100%;
        height: auto;
      }

      .popup .close-btn {
        width: 25px;
        height: 25px;
        font-size: 16px;
      }
    }

    @media (max-width: 400px) {
      .popup {
        width: 100%;
        height: auto;
        padding: 5px;
      }

      .popup img {
        width: 100%;
        height: auto;
      }

      .popup .close-btn {
        width: 20px;
        height: 20px;
        font-size: 14px;
      }
    }
  `;

  private _close() {
    // this.removeAttribute('open');
    this.open = false;
    const closeEvent = new CustomEvent('close-popup', { detail: { closed: true } });
    this.dispatchEvent(closeEvent);
  }

  private _handleOverlayClick(event: MouseEvent) {
    // Close the popup if the click is outside of the popup
    if ((event.target as HTMLElement).classList.contains('overlay')) {
      this._close();
    }
  }

  render() {
    console.log("Rendering ImageViewer with URL:", this.url);
    return html`
      <div class="overlay" @click=${this._handleOverlayClick}>
        <div class="popup">
          <img
            class="close-btn"
            src="/icons/close.svg"
            alt="close"
            width="30px"
            @click=${this._close}
          />
          <img src="${this.url}" alt="Image">
          <div class="details">
            <p>Uploaded by: ${this.uploadedBy}</p>
            <p>Upload date: ${new Date(this.uploadDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    `;
  }  
}
