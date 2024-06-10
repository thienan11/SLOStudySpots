import { html, css } from "lit";
import { Model } from "../model";
import { Msg } from "../messages";
import { View, Auth, Observer } from "@calpoly/mustang";
import { property, state } from "lit/decorators.js";
import resetCSS from "../css/reset";
import { Profile, StudySpot, Review } from "server/models";

export class AddReviewViewElement extends View<Model, Msg> {
  @property({ type: Number }) quietnessRating: number = 0;
  @property({ type: Number }) wifiQualityRating: number = 0;
  @property({ type: Number }) crowdednessRating: number = 0;
  @property({ type: Number }) powerOutletRating: number = 0;
  @property({ type: Number }) amenitiesRating: number = 0;
  @property({ type: String }) comment: string = '';
  @property({ type: String }) bestTimeToGo: string = '';
  @property({ type: Number }) overallRating: number = 0;

  constructor() {
    super("slostudyspots:model");
  }

  @state()
  get profile(): Profile | undefined {
    return this.model.profile;
  }

  @property({ attribute: "spot-id", reflect: true })
  spotid = "";

  @state()
  get studySpot(): StudySpot | undefined {
    return this.model.studySpot;
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (
      name === "spot-id" &&
      oldValue !== newValue &&
      newValue
    ) {
      console.log("Study spot being reviewed:", newValue);

      this.dispatchMessage([
        "study-spot/select",
        { spotid: newValue }
      ]);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe(({ user }) => {
      if (user) {
        if (!this.profile) {
          this.dispatchMessage([
            "profile/select",
            { userid: user.username }
          ]);
        }
      }
    });
  }

  calculateOverallRating() {
    return (
      this.quietnessRating +
      this.wifiQualityRating +
      this.crowdednessRating +
      this.powerOutletRating +
      this.amenitiesRating
    ) / 5;
  }

  render() {
    console.log('My Profile:', this.profile);
    console.log('Study Spot:', this.studySpot);
    return html`
      <main>
        <section class="add-review">
          <h2>Add Your Review for ${this.studySpot?.name}</h2>
            <form id="addReviewForm" autocomplete="off">
              <div class="star-form-group">
                <label><strong>Quietness:</strong> <small>(Rate how quiet the area is)</small></label>
                  <input
                    type="number"
                    name="quietnessRating"
                    placeholder="Quietness Rating (0-5)"
                    @change=${(e: any) => (this.quietnessRating = parseInt(e.target.value))}
                    required
                    min="0"
                    max="5"
                  />
              </div>
              <div class="star-form-group">
                <label><strong>Wifi Quality:</strong> <small>(Evaluate the reliability and speed of the WiFi)</small></label>
                <input
                  type="number"
                  name="wifiQualityRating"
                  placeholder="WiFi Quality Rating (0-5)"
                  @change=${(e: any) => (this.wifiQualityRating = parseInt(e.target.value))}
                  required
                  min="0"
                  max="5"
                />
              </div>
              <div class="star-form-group">
                <label><strong>Crowdedness:</strong> <small>(Rate how uncrowded the spot is)</small></label>
                <input
                  type="number"
                  name="crowdednessRating"
                  placeholder="Crowdedness Rating (0-5)"
                  @change=${(e: any) => (this.crowdednessRating = parseInt(e.target.value))}
                  required
                  min="0"
                  max="5"
                />
              </div>
              <div class="star-form-group">
                <label><strong>Power Outlets:</strong> <small>(Assess the availability of power outlets)</small></label>
                <input
                  type="number"
                  name="powerOutletRating"
                  placeholder="Power Outlet Rating (0-5)"
                  @change=${(e: any) => (this.powerOutletRating = parseInt(e.target.value))}
                  required
                  min="0"
                  max="5"
                />
              </div>
              <div class="star-form-group">
                <label><strong>Amenities:</strong> <small>(Evaluate the availability and quality of amenities)</small></label>
                <input
                  type="number"
                  name="amenitiesRating"
                  placeholder="Amenities Rating (0-5)"
                  @change=${(e: any) => (this.amenitiesRating = parseInt(e.target.value))}
                  required
                  min="0"
                  max="5"
                />
              </div>
              <div class="form-group">
                <label for="comment">Comment:</label>
                <textarea
                  name="comment"
                  id="comment"
                  rows="4"
                  cols="50"
                  @change=${(e: any) => (this.comment = e.target.value)}
                  required
                ></textarea>
              </div>
              <div class="form-group">
                <label>Best Time to Go:</label>
                <input
                  type="text"
                  name="bestTimeToGo"
                  rows="4"
                  cols="50"
                  @change=${(e: any) => (this.bestTimeToGo = e.target.value)}
                />
              </div>
              <button type="submit" @click=${this.onSubmit} class="btn-large">Submit</button>
            </form>
        </section>
      </main>
    `;
  }

  _authObserver = new Observer<Auth.Model>(
    this,
    "slostudyspots:auth"
  );

  onSubmit(e: Event) {
    e.preventDefault();
    
    this.overallRating = this.calculateOverallRating();

    if (!this.profile) {
      console.error('Current user not found');
      return;
    }

    const review = {
      userId: this.profile,
      spotId: this.spotid,
      quietnessRating: this.quietnessRating,
      wifiQualityRating: this.wifiQualityRating,
      crowdednessRating: this.crowdednessRating,
      powerOutletRating: this.powerOutletRating,
      amenitiesRating: this.amenitiesRating,
      overallRating: this.overallRating,
      comment: this.comment,
      bestTimeToGo: this.bestTimeToGo,
      createdAt: new Date(),
      likes: 0,
      edited: false
    };

    this.updateStudySpotRatings(review);

    this.dispatchMessage([
      "review/add", {
        review,
        onSuccess: () => {
          console.log('Review saved successfully');
          window.location.pathname = `/app/study-spot/${this.spotid}`;
        },
        onFailure: (error: Error) => {
          console.error('Failed to save review:', error);
          alert('Failed to save study spot');
        }
      }
    ]);
  }

  updateStudySpotRatings(review: Review) {
    if (!this.studySpot) {
      console.error('Study spot not found');
      return;
    }

    const ratings = this.studySpot.ratings;
    const reviewCount = this.studySpot.reviewsCount || 0;

    ratings.quietness = (ratings.quietness * reviewCount + review.quietnessRating) / (reviewCount + 1);
    ratings.wifiQuality = (ratings.wifiQuality * reviewCount + review.wifiQualityRating) / (reviewCount + 1);
    ratings.crowdedness = (ratings.crowdedness * reviewCount + review.crowdednessRating) / (reviewCount + 1);
    ratings.powerOutlets = (ratings.powerOutlets * reviewCount + review.powerOutletRating) / (reviewCount + 1);
    ratings.amenities = (ratings.amenities * reviewCount + review.amenitiesRating) / (reviewCount + 1);
    ratings.overall = (ratings.overall * reviewCount + review.overallRating) / (reviewCount + 1);

    this.dispatchMessage([
      "study-spot/update",
      {
        spotid: this.spotid,
        rating: ratings,
        reviewsCount: reviewCount + 1,
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
    css`
      main {
        padding: var(--space-regular);
        flex-grow: 1;
      }

      .form-group {
        margin-bottom: var(--space-regular);
      }
      
      .form-group label {
        display: block;
        margin-bottom: 8px;
        color: var(--color-text-primary);
        font-weight: bold;
      }
      
      .form-group input[type="text"],
      .form-group textarea {
        width: 100%;
        padding: 12px;
        border: 2px solid var(--color-primary);
        border-radius: var(--border-radius);
        box-sizing: border-box;
        outline: none;
      }
      
      .form-group input[type="text"]:focus,
      .form-group textarea:focus {
        border-color: var(--color-secondary);
      }

      .add-review {
        background-color: var(--color-background-secondary);
        padding: 20px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-hover-small);
        margin: 20px auto;
        width: 90%;
        max-width: 800px;
      }
      
      .add-review h2 {
        text-align: center;
        color: var(--color-secondary);
      }
      
      .star-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      
      .star-container label {
        margin-right: 20px;
        white-space: nowrap;
      }
      
      .star-form-group {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      
      .star-form-group label {
        margin-right: 20px;
        white-space: nowrap; /* Prevents the label from breaking into multiple lines */
      }
      
      /* Star Rating Styles */
      /* .star-rating {
        display: inline-block; /* Aligns the stars horizontally *
      } */
      
      .star-rating input[type='radio'] {
        display: none; /* Hide radio buttons */
      }
      
      .star-rating label {
        float: right;
        padding: 5px;
        font-size: 25px;
        color: #ccc;
        transition: all 0.3s ease;
        cursor: pointer;
      }
      
      .star-rating label:hover,
      .star-rating label:hover ~ label,
      .star-rating input[type='radio']:checked ~ label {
        /* color: #f5d315; */
        color: var(--color-links);
        transform: scale(1.2);
      }

      .btn-large {
        width: 100%;
        padding: 12px;
        background-color: var(--color-primary);
        color: var(--color-background-primary);
        font-size: 1.1rem;
        border-radius: var(--border-radius);
        cursor: pointer;
        border: none;
        transition: background-color 0.3s ease;
      }

      .btn-large:hover {
        background-color: var(--color-links);
      }
    `
  ];
}
