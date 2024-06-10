import { View } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import resetCSS from "../css/reset";
import { Review } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class UserReviewViewElement extends View<Model, Msg> {
  @property({ attribute: "user-id", reflect: true })
  userId: string = "";

  @state()
  get reviews(): Review[] {
    return this.model.reviews || [];
  }

  constructor() {
    super("slostudyspots:model");
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "user-id" && oldValue !== newValue && newValue) {
      this.dispatchMessage(["review/list-by-user", { userId: newValue }]);
    }
  }
  

  render(): TemplateResult {
    // const reviews = this.model.reviews || [];
    // console.log("Reviews:", reviews);

    return html`
      <main>
        <section class="user-reviews">
          <ul class="reviews-list">
            ${this.reviews.length > 0
              ? this.reviews.map(review => html`
                  <li class="review-item">
                    <h3>${review.spotId}</h3>
                    <p>${review.comment}</p>
                    <div class="review-ratings">
                      <p><strong>Overall Rating:</strong> ${review.overallRating} / 5</p>
                      <p><strong>Quietness:</strong> ${review.quietnessRating} / 5</p>
                      <p><strong>Wifi Quality:</strong> ${review.wifiQualityRating} / 5</p>
                      <p><strong>Crowdedness:</strong> ${review.crowdednessRating} / 5</p>
                      <p><strong>Power Outlets:</strong> ${review.powerOutletRating} / 5</p>
                      <p><strong>Amenities:</strong> ${review.amenitiesRating} / 5</p>
                    </div>
                  </li>
                `)
              : html`<p>No reviews yet.</p>`}
          </ul>
        </section>
      </main>
    `;
  }

  static styles = [
    resetCSS,
    css`
      main {
        padding: var(--space-regular);
        flex-grow: 1;
      }

      .user-reviews {
        text-align: center;
        padding: var(--space-regular) 0;
      }

      .reviews-list {
        list-style: none;
        padding: 0;
      }

      .review-item {
        border: 1px solid var(--color-primary);
        border-radius: var(--border-radius);
        padding: var(--space-regular);
        margin-bottom: var(--space-small);
        background-color: var(--color-background-secondary);
      }

      .review-item h3 {
        margin: var(--space-small) 0;
        color: var(--color-primary);
      }

      .review-ratings p {
        margin: var(--space-small) 0;
      }
    `
  ];
}
