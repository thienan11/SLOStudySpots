import { View, Auth, Observer, define } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import resetCSS from "../css/reset";
import starsCSS from "../css/stars";
import { Review, Profile, StudySpot } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import { DropdownElement } from "../components/drop-down";

// TODO: Potentially make this more efficient by fetching one study spot at a time based on the review's spotId?
export class UserReviewViewElement extends View<Model, Msg> {

  static uses = define({
    "drop-down": DropdownElement,
  });

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
    this._authObserver.observe(({ user }) => {
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

  renderSubratings(review: Review): TemplateResult {
    return html`
      <div class="subratings-container">
        <div class="subrating">
          <span class="subrating-label">Quietness:</span>
          <div class="stars">${this.renderStars(review.quietnessRating)}</div>
        </div>
        <div class="subrating">
          <span class="subrating-label">Wifi Quality:</span>
          <div class="stars">${this.renderStars(review.wifiQualityRating)}</div>
        </div>
        <div class="subrating">
          <span class="subrating-label">Crowdedness:</span>
          <div class="stars">${this.renderStars(review.crowdednessRating)}</div>
        </div>
        <div class="subrating">
          <span class="subrating-label">Power Outlets:</span>
          <div class="stars">${this.renderStars(review.powerOutletRating)}</div>
        </div>
        <div class="subrating">
          <span class="subrating-label">Amenities:</span>
          <div class="stars">${this.renderStars(review.amenitiesRating)}</div>
        </div>
      </div>
    `;
  }

  render(): TemplateResult {
    if (!this.profile) {
      return html`<p>Loading...</p>`;
    }

    return html`
      <main>
        <section class="profile-header">
          <h1>${this.profile.userid}'s Reviews (${this.profile.reviewsCount})</h1>
        </section>
        <section class="reviews-list">
          ${this.reviews.length === 0
            ? html`<p>No reviews available.</p>`
            : this.reviews.map(review => this.renderReview(review))
          }
        </section>
      </main>
    `;
  }

  renderReview(review: Review): TemplateResult {
    const { overallRating, comment, createdAt, bestTimeToGo } = review;
    const date = new Date(createdAt).toLocaleDateString();
    const studySpot = this.studySpotMap.get(review.spotId);

    return html`
      <div class="review-container">
        <div class="review-header">
          <a href="/app/study-spot/${review.spotId}" class="review-link">
            ${studySpot ? studySpot.name : 'Unknown Spot'}
          </a>
          <div class="stars">${this.renderStars(overallRating)}</div>
          <drop-down iconSrc="/icons/three-dots.svg">
            <div class="dropdown-container">
              <a class="dropdown-option" href="my-reviews/${(review as Review & { _id: string })._id}">Update</a>
              <div class="dropdown-option" @click="${() => this.deleteReview((review as Review & { _id: string })._id, review, this.profile)}">Delete</div>
            </div>
          </drop-down>
        </div>
        <p class="review-date">${date}</p>
        <p class="review-best-time">Best Time to Go: ${bestTimeToGo}</p>
        ${this.renderSubratings(review)}
        <p class="review-comment">${comment}</p>
      </div>
    `;
  }

  deleteReview(reviewId: string, review: Review, profile: Profile | undefined): void {
    console.log("Delete review", reviewId);

    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    // Ensure the review exists in the current reviews array
    const reviewIndex = this.model.reviews?.findIndex(r => (r as Review & { _id: string })._id === reviewId);
    if (reviewIndex === undefined || reviewIndex === -1) {
      console.error('Review not found');
      return;
    }

    // Dispatch the delete message
    this.dispatchMessage(["review/delete", { reviewId }]);
  
    // Optionally, you can remove the review from the UI directly
    // Assuming the model is updated elsewhere
    this.model.reviews = this.model.reviews?.filter(r => (r as Review & { _id: string })._id !== reviewId);
  

    // UPDATE SPOT RATINGS
    const studySpot = this.studySpotMap.get(review.spotId);

    if (!studySpot) {
      console.error('Study spot not found');
      return;
    }

    const ratings = studySpot.ratings;
    const reviewCount = studySpot.reviewsCount || 0;

    // If there's only one review, reset ratings to zero
    if (reviewCount === 1) {
      ratings.quietness = 0;
      ratings.wifiQuality = 0;
      ratings.crowdedness = 0;
      ratings.powerOutlets = 0;
      ratings.amenities = 0;
      ratings.overall = 0;
    } else {
      // Otherwise, recalculate the ratings
      ratings.quietness = (ratings.quietness * reviewCount - review.quietnessRating) / (reviewCount - 1);
      ratings.wifiQuality = (ratings.wifiQuality * reviewCount - review.wifiQualityRating) / (reviewCount - 1);
      ratings.crowdedness = (ratings.crowdedness * reviewCount - review.crowdednessRating) / (reviewCount - 1);
      ratings.powerOutlets = (ratings.powerOutlets * reviewCount - review.powerOutletRating) / (reviewCount - 1);
      ratings.amenities = (ratings.amenities * reviewCount - review.amenitiesRating) / (reviewCount - 1);
      ratings.overall = (ratings.overall * reviewCount - review.overallRating) / (reviewCount - 1);
    }

    this.dispatchMessage([
      "study-spot/update",
      {
        spotid: review.spotId,
        rating: ratings,
        reviewsCount: reviewCount - 1,
        onSuccess: () => {
          console.log('Study spot ratings updated successfully');
        },
        onFailure: (error: Error) => {
          console.error('Failed to update study spot ratings:', error);
        }
      }
    ]);


    // UPDATE PROFILE REVIEWS COUNT
    if (profile) {
      this.dispatchMessage([
        "profile/save",
        {
          userid: profile.userid,
          profile: {
            ...profile,
            reviewsCount: profile.reviewsCount - 1
          },
          onSuccess: () => {
            console.log('Profile updated successfully');
          },
          onFailure: (error: Error) => {
            console.error('Failed to update profile:', error);
          }
        }
      ]);
    }
  }

  static styles = [
    resetCSS,
    starsCSS,
    css`
      main {
        padding: var(--space-regular);
        max-width: 1200px;
        margin: 0 auto;
      }

      .profile-header {
        text-align: center;
        margin-bottom: var(--space-regular);
      }

      .profile-header h1 {
        font-size: var(--font-size-large);
        color: var(--color-secondary);
        margin: 0;
        padding-bottom: var(--space-regular);
      }

      .reviews-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-gap: var(--space-regular);
      }

      .review-container {
        border: 1px solid #ccc;
        border-radius: var(--border-radius);
        padding: var(--space-regular);
        background-color: var(--color-background-secondary);
        transition: box-shadow 0.3s ease-in-out, transform 0.3s ease;
        overflow: hidden; /* Prevents content from spilling out */
      }

      .review-container:hover {
        box-shadow: var(--shadow-hover-large);
        transform: translateY(-5px);
      }

      .review-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-small);
      }

      .review-link {
        color: var(--color-primary);
        text-decoration: none;
        font-weight: bold;
      }

      .review-link:hover {
        text-decoration: underline;
      }

      .review-date {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        margin-bottom: var(--space-small);
      }

      .review-best-time {
        font-size: 0.875rem;
        color: var(--color-accent);
        margin-bottom: var(--space-small);
        font-weight: bold;
        background-color: var(--color-background-highlight);
        padding: var(--space-small);
        border-radius: var(--border-radius);
      }

      .review-comment {
        font-size: 1rem;
        color: var(--color-text-primary);
        margin-top: var(--space-small);
        font-style: italic;
        background-color: var(--color-background-highlight);
        padding: var(--space-small);
        border-radius: var(--border-radius);
      }

      .subratings-container {
        margin-top: var(--space-small);
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--space-small);
      }

      .subrating {
        display: flex;
        align-items: center;
      }

      .subrating-label {
        margin-right: var(--space-small);
        font-size: 0.875rem;
        color: var(--color-text-primary);
        width: 6rem; /* To align stars in a column */
      }

      .dropdown-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }

      .dropdown-option {
        padding: var(--space-small);
        cursor: pointer;
        color: var(--color-text-primary);
        border-radius: var(--border-radius);
        transition: background-color 0.3s ease;
        text-decoration: none;
        margin: 0;
      }

      .dropdown-option:hover {
        background-color: var(--color-primary);
        color: var(--color-background-primary);
      }
    `
  ];

  _authObserver = new Observer<Auth.Model>(
    this,
    "slostudyspots:auth"
  );
}
