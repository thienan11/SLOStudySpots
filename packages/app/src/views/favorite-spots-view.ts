import { View } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import resetCSS from "../css/reset";
import starsCSS from "../css/stars";
import { Model } from "../model";
import { Msg } from "../messages";

export class FavoriteSpotsViewElement extends View<Model, Msg> {

  render(): TemplateResult {
    return html`
      <div class="coming-soon-container">
        <div class="animation-container">
          <img src="/gifs/shooting-star.gif" alt="Gifer Animated Gif" />
        </div>
        <h1 class="coming-soon-title">Coming Soon</h1>
        <p class="coming-soon-message">
          This feature is currently under development. Check back later!
        </p>
      </div>
    `;
  }

  static styles = [
    resetCSS,
    starsCSS,
    css`
      .coming-soon-container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 70vh;
        color: var(--color-text-primary);
        text-align: center;
        flex-direction: column;
        position: relative;
      }

      .coming-soon-title {
        font-size: 3rem;
        margin-bottom: 16px;
      }

      .coming-soon-message {
        font-size: 1.3rem;
      }

      .coming-soon-title, .coming-soon-message {
        animation: fadeIn 2s ease-in-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animation-container {
        animation: fadeIn 2s ease-in-out;
      }

      .animation-container img {
        max-width: 180px; /* Adjust size as needed */
      }
    `
  ];
}
