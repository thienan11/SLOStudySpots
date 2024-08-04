import { html, css } from "lit";
import { Model } from "../model";
import { Msg } from "../messages";
import { View, Auth, Observer, History } from "@calpoly/mustang";
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
                <div class="label-container">
                  <label><strong>Quietness:</strong></label>
                  <p><small>Consider how quiet the area is</small></p>
                </div>
                <div class="star-rating">
                  <input type="radio" id="star5-quietness" name="quietnessRating" value="5" @change=${(e: any) => (this.quietnessRating = parseInt(e.target.value))} />
                  <label for="star5-quietness" title="5 stars">★</label>
                  <input type="radio" id="star4-quietness" name="quietnessRating" value="4" @change=${(e: any) => (this.quietnessRating = parseInt(e.target.value))} />
                  <label for="star4-quietness" title="4 stars">★</label>
                  <input type="radio" id="star3-quietness" name="quietnessRating" value="3" @change=${(e: any) => (this.quietnessRating = parseInt(e.target.value))} />
                  <label for="star3-quietness" title="3 stars">★</label>
                  <input type="radio" id="star2-quietness" name="quietnessRating" value="2" @change=${(e: any) => (this.quietnessRating = parseInt(e.target.value))} />
                  <label for="star2-quietness" title="2 stars">★</label>
                  <input type="radio" id="star1-quietness" name="quietnessRating" value="1" @change=${(e: any) => (this.quietnessRating = parseInt(e.target.value))} />
                  <label for="star1-quietness" title="1 star">★</label>
                </div>
              </div>
              <div class="star-form-group">
                <div class="label-container">
                  <label><strong>Wifi Quality:</strong></label>
                  <p><small>Consider the reliability and speed of the WiFi</small></p>
                </div>
                <div class="star-rating">
                  <input type="radio" id="star5-wifi" name="wifiQualityRating" value="5" @change=${(e: any) => (this.wifiQualityRating = parseInt(e.target.value))} />
                  <label for="star5-wifi" title="5 stars">★</label>
                  <input type="radio" id="star4-wifi" name="wifiQualityRating" value="4" @change=${(e: any) => (this.wifiQualityRating = parseInt(e.target.value))} />
                  <label for="star4-wifi" title="4 stars">★</label>
                  <input type="radio" id="star3-wifi" name="wifiQualityRating" value="3" @change=${(e: any) => (this.wifiQualityRating = parseInt(e.target.value))} />
                  <label for="star3-wifi" title="3 stars">★</label>
                  <input type="radio" id="star2-wifi" name="wifiQualityRating" value="2" @change=${(e: any) => (this.wifiQualityRating = parseInt(e.target.value))} />
                  <label for="star2-wifi" title="2 stars">★</label>
                  <input type="radio" id="star1-wifi" name="wifiQualityRating" value="1" @change=${(e: any) => (this.wifiQualityRating = parseInt(e.target.value))} />
                  <label for="star1-wifi" title="1 star">★</label>
                </div>
              </div>
              <div class="star-form-group">
                <div class="label-container">
                  <label><strong>Crowdedness:</strong></label>
                  <p><small>Consider how uncrowded the spot is</small></p>
                </div>
                <div class="star-rating">
                  <input type="radio" id="star5-crowd" name="crowdednessRating" value="5" @change=${(e: any) => (this.crowdednessRating = parseInt(e.target.value))} />
                  <label for="star5-crowd" title="5 stars">★</label>
                  <input type="radio" id="star4-crowd" name="crowdednessRating" value="4" @change=${(e: any) => (this.crowdednessRating = parseInt(e.target.value))} />
                  <label for="star4-crowd" title="4 stars">★</label>
                  <input type="radio" id="star3-crowd" name="crowdednessRating" value="3" @change=${(e: any) => (this.crowdednessRating = parseInt(e.target.value))} />
                  <label for="star3-crowd" title="3 stars">★</label>
                  <input type="radio" id="star2-crowd" name="crowdednessRating" value="2" @change=${(e: any) => (this.crowdednessRating = parseInt(e.target.value))} />
                  <label for="star2-crowd" title="2 stars">★</label>
                  <input type="radio" id="star1-crowd" name="crowdednessRating" value="1" @change=${(e: any) => (this.crowdednessRating = parseInt(e.target.value))} />
                  <label for="star1-crowd" title="1 star">★</label>
                </div>
              </div>
              <div class="star-form-group">
                <div class="label-container">
                  <label><strong>Power Outlets:</strong></label>
                  <p><small>Consider the availability of power outlets</small></p>
                </div>
                <div class="star-rating">
                  <input type="radio" id="star5-power" name="powerOutletRating" value="5" @change=${(e: any) => (this.powerOutletRating = parseInt(e.target.value))} />
                  <label for="star5-power" title="5 stars">★</label>
                  <input type="radio" id="star4-power" name="powerOutletRating" value="4" @change=${(e: any) => (this.powerOutletRating = parseInt(e.target.value))} />
                  <label for="star4-power" title="4 stars">★</label>
                  <input type="radio" id="star3-power" name="powerOutletRating" value="3" @change=${(e: any) => (this.powerOutletRating = parseInt(e.target.value))} />
                  <label for="star3-power" title="3 stars">★</label>
                  <input type="radio" id="star2-power" name="powerOutletRating" value="2" @change=${(e: any) => (this.powerOutletRating = parseInt(e.target.value))} />
                  <label for="star2-power" title="2 stars">★</label>
                  <input type="radio" id="star1-power" name="powerOutletRating" value="1" @change=${(e: any) => (this.powerOutletRating = parseInt(e.target.value))} />
                  <label for="star1-power" title="1 star">★</label>
                </div>
              </div>
              <div class="star-form-group">
                <div class="label-container">
                  <label><strong>Amenities:</strong></label>
                  <p><small>Consider the availability and quality of amenities</small></p>
                </div>
                <div class="star-rating">
                  <input type="radio" id="star5-amenities" name="amenitiesRating" value="5" @change=${(e: any) => (this.amenitiesRating = parseInt(e.target.value))} />
                  <label for="star5-amenities" title="5 stars">★</label>
                  <input type="radio" id="star4-amenities" name="amenitiesRating" value="4" @change=${(e: any) => (this.amenitiesRating = parseInt(e.target.value))} />
                  <label for="star4-amenities" title="4 stars">★</label>
                  <input type="radio" id="star3-amenities" name="amenitiesRating" value="3" @change=${(e: any) => (this.amenitiesRating = parseInt(e.target.value))} />
                  <label for="star3-amenities" title="3 stars">★</label>
                  <input type="radio" id="star2-amenities" name="amenitiesRating" value="2" @change=${(e: any) => (this.amenitiesRating = parseInt(e.target.value))} />
                  <label for="star2-amenities" title="2 stars">★</label>
                  <input type="radio" id="star1-amenities" name="amenitiesRating" value="1" @change=${(e: any) => (this.amenitiesRating = parseInt(e.target.value))} />
                  <label for="star1-amenities" title="1 star">★</label>
                </div>
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
          // window.location.pathname = `/app/study-spot/${this.spotid}`;
          History.dispatch(this, "history/navigate", {
            href: `/app/study-spot/${this.spotid}`
          });
        },
        onFailure: (error: Error) => {
          console.error('Failed to save review:', error);
          alert('Failed to save review!');
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

      textarea {
        height: 100px;
        resize: vertical;
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
        padding-bottom: 20px;
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
        padding-bottom: 20px;
        /* border-bottom: 2px solid var(--color-primary); */
        margin-bottom: 20px;
      }

      .label-container {
        display: flex;
        flex-direction: column;
        margin-bottom: 5px;
      }

      .label-container label {
        color: var(--color-text-primary);
        font-weight: bold;
      }

      .label-container small {
        color: var(--color-text-secondary, #666);
        font-size: 0.8em;
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
        font-size: 30px;
        color: #ccc;
        transition: all 0.3s ease;
        cursor: pointer;
      }
      
      .star-rating label:hover,
      .star-rating label:hover ~ label,
      .star-rating input[type='radio']:checked ~ label {
        /* color: #f5d315; */
        color: var(--color-links);
        transform: scale(1.3);
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

      @media (max-width: 768px) {
        .star-form-group {
          flex-direction: column;
        }

        .label-container {
          text-align: center;
        }

        .star-form-group label {
          margin-bottom: 4px; /* Adds space between the label and input on smaller screens */
        }

        .add-review {
          padding: 10px;
          width: 100%;
        }

        .form-group input[type="text"],
        .form-group textarea {
          padding: 8px; /* Smaller padding on smaller screens */
        }

        .btn-large {
          font-size: 0.9rem; /* Smaller font size on smaller screens */
        }
      }
    `
  ];
}
