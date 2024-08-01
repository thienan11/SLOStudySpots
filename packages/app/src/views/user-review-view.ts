import { View, Auth, Observer } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import resetCSS from "../css/reset";
import starsCSS from "../css/stars";
import { Review, Profile, StudySpot } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

// TODO: Potentially make this more efficient by fetching one study spot at a time based on the review's spotId?
export class UserReviewViewElement extends View<Model, Msg> {
  @state()
  get reviews(): Review[] {
    return this.model.reviews || [];
  }

  @state()
  get profile(): Profile | undefined {
    return this.model.profile;
  }

  @state()
  get studySpots(): StudySpot[] {
    return this.model.studySpotIndex || [];
  }
  
  // Map of study spot IDs to study spot objects
  @state()
  get studySpotMap(): Map<string, StudySpot> {
    const map = new Map<string, StudySpot>();
    // Iterate through all the fetched study spots and map them
    (this.studySpots as (StudySpot & { _id: string })[]).forEach(spot => map.set(spot._id, spot));
    return map;
  }

  constructor() {
    super("slostudyspots:model");
  }

  private fetchStudySpotsForReviews() {
    if (this.reviews.length > 0) {
      // Fetch each study spot and update the model
      for (const review of this.reviews) {
        this.dispatchMessage(["study-spot/select", { spotid: review.spotId }]);
      }
    }
  }

  private fetchStudySpots() {
    this.dispatchMessage(["study-spot/index"]);
  }  

  private reviewsFetched: boolean = false;

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe(async ({ user }) => {
      if (user && !this.reviewsFetched) {
        console.log("Authenticated user:", user.username);
        this.dispatchMessage([
          "profile/select",
          { userid: user.username }
        ]);

        const profile = this.model.profile as unknown as { _id: string };
        if (profile && profile._id) {
          console.log("Profile fetched with _id:", profile._id);

          // Fetch reviews for the user
          this.dispatchMessage(["review/list-by-user", { userId: profile._id }]);

          // Fetch study spots for the reviews
          this.fetchStudySpots();

          this.reviewsFetched = true;
        } else {
          console.warn("Profile _id is not set. Review list message not dispatched.");
        }
      }
    });
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      // hour: '2-digit',
      // minute: '2-digit',
      // hour12: true
    });
  }

  renderStars(rating: number): TemplateResult {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(html`<span class="star full"></span>`);
    }

    if (halfStars) {
      stars.push(html`<span class="star half"></span>`);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(html`<span class="star empty"></span>`);
    }

    return html`${stars}`;
  }

  render(): TemplateResult {
    if (!this.profile) {
      return html`<p>Loading...</p>`;
    }

    return html`
      <main>
        <section class="profile-header">
          <h1>${this.profile.name}'s Reviews</h1>
        </section>
        <section class="reviews-list">
          ${this.reviews.map(review => this.renderReview(review))}
        </section>
      </main>
    `;
  }

  renderReview(review: Review): TemplateResult {
    const { overallRating, comment, createdAt } = review;
    const date = new Date(createdAt).toLocaleDateString();
    const studySpot = this.studySpotMap.get(review.spotId);

    return html`
      <div class="review-container">
        <div class="review-header">
          <a href="/app/study-spot/${review.spotId}" class="review-link">
            ${studySpot ? studySpot.name : 'Unknown Spot'}
          </a>
          <div class="stars">${this.renderStars(overallRating)}</div>
        </div>
        <p class="review-date">${date}</p>
        <p class="review-comment">${comment}</p>
      </div>
    `;
  }

  static styles = [
    resetCSS,
    starsCSS,
    css`
      main {
        padding: var(--space-regular);
      }

      .profile-header {
        text-align: center;
        margin-bottom: var(--space-regular);
      }

      .profile-header h1 {
        font-size: var(--font-size-large);
        color: var(--color-primary);
      }

      .reviews-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-gap: var(--space-regular);
      }

      .review-container {
        border: 1px solid var(--color-primary);
        border-radius: var(--border-radius);
        padding: var(--space-small);
        background-color: var(--color-background-secondary);
        transition: box-shadow 0.3s ease-in-out;
      }

      .review-container:hover {
        box-shadow: var(--shadow-hover-large);
      }

      .review-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-small);
      }

      .review-header h3 {
        margin: 0;
        font-size: 1.25rem;
        color: var(--color-primary);
      }

      .review-date {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        margin-bottom: var(--space-small);
      }

      .review-comment {
        font-size: 1rem;
        color: var(--color-text-primary);
      }
    `
  ];

  _authObserver = new Observer<Auth.Model>(
    this,
    "slostudyspots:auth"
  );
}
