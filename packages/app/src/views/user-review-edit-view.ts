import { View, Auth, define, Form, History, Observer } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import resetCSS from "../css/reset";
import starsCSS from "../css/stars";
import { Review, StudySpot } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class UpdateReviewViewElement extends View<Model, Msg> {
  static uses = define({
    "mu-form": Form.Element,
  });

  @property({ attribute: "review-id", reflect: true })
  reviewId = "";

  @state()
  get review(): Review | undefined {
    return this.model.review;
  }

  @state()
  get studySpot(): StudySpot | undefined {
    return this.model.studySpot;
  }

  private oldReview: Review | undefined;

  constructor() {
    super("slostudyspots:model");
    this.addEventListener("mu-form:submit", (event) =>
      this._handleSubmit(event as Form.SubmitEvent<Review>)
    );
  }

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe(async ({ user }) => {
      if (user && this.reviewId && !this.review) {
        this.fetchReview(this.reviewId);
      }
    });
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (
      name === "review-id" &&
      oldValue !== newValue &&
      newValue &&
      !this.review
    ) {
      console.log("Update Review Page:", newValue);
      this.fetchReview(newValue);
    }
  }

  private fetchReview(reviewId: string) {
    this.dispatchMessage(["review/select", { reviewId }]);
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
  
    if (this.review && !this.studySpot) {
      this.fetchStudySpot(this.review.spotId);
    }

    // Ensure oldReview is set if it's not already set and review is available
    if (this.review && !this.oldReview) {
      this.oldReview = { ...this.review }; // Store the old review before any updates
      console.log("Old review set:", this.oldReview);
    }
  }

  private fetchStudySpot(spotId: string) {
    this.dispatchMessage(["study-spot/select", { spotid: spotId }]);
  }

  render(): TemplateResult {
    if (!this.review || !this.studySpot) {
      return html`<p>Loading...</p>`;
    }

    return html`
      <main>
        <h1>Update Review for ${this.studySpot.name}</h1>
        <mu-form .init=${this.review}>
          <label>
            <span>Comment:</span>
            <textarea name="comment"></textarea>
          </label>
          <label>
            <span>Best Time to Go:</span>
            <input name="bestTimeToGo" type="text">
          </label>
          ${this.renderRatingInputs()}
        </mu-form>
      </main>
    `;
  }

  private renderRatingInputs(): TemplateResult {
    const ratingFields =
      [
        'quietnessRating',
        'wifiQualityRating',
        'crowdednessRating',
        'powerOutletRating',
        'amenitiesRating'] as const;
    return html`
      ${ratingFields.map(field => html`
        <label>
          <span>${this.modifyField(field)}:</span>
          <input name="${field}" type="number" min="0" max="5" step="0.5">
        </label>
      `)}
    `;
  }

  private modifyField(string: string): string {
    string = string.replace('Rating', '');
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  private _handleSubmit(event: Form.SubmitEvent<Review>) {
    console.log("Handling submit of mu-form");
  
    // Log the event detail to check the form values
    console.log("Form values:", event.detail);
  
    // Merge the form values with the existing review
    const updatedReview = { ...this.review, ...event.detail };
  
    // Convert form values from strings to numbers
    updatedReview.quietnessRating = Number(updatedReview.quietnessRating);
    updatedReview.wifiQualityRating = Number(updatedReview.wifiQualityRating);
    updatedReview.crowdednessRating = Number(updatedReview.crowdednessRating);
    updatedReview.powerOutletRating = Number(updatedReview.powerOutletRating);
    updatedReview.amenitiesRating = Number(updatedReview.amenitiesRating);
    updatedReview.overallRating = 0;
  
    // Log the updated review before modifying it
    console.log("UPDATED REVIEW (before):", updatedReview);
  
    updatedReview.edited = true;
  
    // Calculate the overall rating
    updatedReview.overallRating = (
      updatedReview.quietnessRating +
      updatedReview.wifiQualityRating +
      updatedReview.crowdednessRating +
      updatedReview.powerOutletRating +
      updatedReview.amenitiesRating
    ) / 5;
  
    // Log the calculated overall rating
    console.log("OVERALL RATING:", updatedReview.overallRating);
  
    // Log the updated review after modifying it
    console.log("UPDATED REVIEW (after):", updatedReview);
  
    // Dispatch the message to update the review
    this.dispatchMessage([
      "review/update",
      {
        review: updatedReview,
        onSuccess: () => {
          // Update study spot ratings after review update
          this.updateStudySpotRatings(updatedReview);
  
          // Redirect to the updated review page
          History.dispatch(this, "history/navigate", {
            href: `/app/my-reviews`
          });
        },
        onFailure: (error: Error) =>
          console.log("ERROR:", error)
      }
    ]);
  }

  private updateStudySpotRatings(updatedReview: Review) {
    const spot = this.studySpot;
  
    if (!spot) {
      console.error('Study spot not found');
      return;
    }
  
    const ratings = spot.ratings;
    const reviewCount = spot.reviewsCount;

    // Ensure oldReview is defined
    if (!this.oldReview) {
      console.error('Old review not found');
      return;
    }
  
    // Recalculate ratings based on the updated review
    ratings.quietness = (ratings.quietness * reviewCount - this.oldReview.quietnessRating + updatedReview.quietnessRating) / reviewCount;
    ratings.wifiQuality = (ratings.wifiQuality * reviewCount - this.oldReview.wifiQualityRating + updatedReview.wifiQualityRating) / reviewCount;
    ratings.crowdedness = (ratings.crowdedness * reviewCount - this.oldReview.crowdednessRating + updatedReview.crowdednessRating) / reviewCount;
    ratings.powerOutlets = (ratings.powerOutlets * reviewCount - this.oldReview.powerOutletRating + updatedReview.powerOutletRating) / reviewCount;
    ratings.amenities = (ratings.amenities * reviewCount - this.oldReview.amenitiesRating + updatedReview.amenitiesRating) / reviewCount;
    ratings.overall = (ratings.overall * reviewCount - this.oldReview.overallRating + updatedReview.overallRating) / reviewCount;
  
    this.dispatchMessage([
      "study-spot/update",
      {
        spotid: this.review?.spotId || '',
        rating: ratings,
        reviewsCount: reviewCount,
        onSuccess: () => {
          console.log('Study spot ratings updated successfully');
        },
        onFailure: (error: Error) => {
          console.error('Failed to update study spot ratings:', error);
        }
      }
    ]);
  }
  

  static styles = [
    resetCSS,
    starsCSS,
    css`
      main {
        padding: var(--space-regular);
        max-width: 900px;
        margin: 0 auto;
      }

      h1 {
        font-size: var(--font-size-large);
        color: var(--color-secondary);
        margin-bottom: var(--space-regular);
        text-align: center;
      }

      mu-form {
        display: grid;
        gap: var(--space-regular);
      }

      label {
        display: grid;
        gap: var(--space-small);
      }

      span {
        font-weight: bold;
        color: var(--color-text-primary);
      }

      input[type="number"],
      input[type="text"],
      textarea {
        width: 100%;
        padding: var(--space-small);
        border: 1px solid #ccc;
        border-radius: var(--border-radius);
        font-size: var(--font-size-body);
      }

      textarea {
        height: 100px;
        resize: vertical;
      }

      button {
        background-color: var(--color-primary);
        color: var(--color-background-primary);
        border: none;
        padding: var(--space-small) var(--space-regular);
        border-radius: var(--border-radius);
        font-size: var(--font-size-body);
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      button:hover {
        background-color: var(--color-links);
      }
    `
  ];

  _authObserver = new Observer<Auth.Model>(
    this,
    "slostudyspots:auth"
  );
}
