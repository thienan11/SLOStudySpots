import { define, View } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import resetCSS from "../css/reset";
import {
  StudySpot,
  Review
} from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class StudySpotViewElement extends View<Model, Msg> {
  // static uses = define({
    
  // });

  @property({ attribute: "spot-id", reflect: true })
  spotid = "";

  @state()
  get studySpot(): StudySpot | undefined {
    return this.model.studySpot;
  }

  @state()
  reviews: Review[] = [];

  constructor() {
    super("slostudyspots:model");
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
      console.log("Study Spot Page:", newValue);
      this.dispatchMessage([
        "study-spot/select",
        { spotid: newValue }
      ]);
      this.dispatchMessage(["review/load", { spotId: newValue }]);
    }
  }

  // formatDate(date: Date): string {
  //   return `${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;
  // }  

  render(): TemplateResult {
    const {
      name,
      address,
      locationType,
      hoursOfOperation,
      ratings,
      tags,
      photos,
      link,
    } = this.studySpot || {};
    
    const photoURL = this.studySpot?.photos?.[0] || '/icons/default-photo.webp';

    const tags_html = this.studySpot?.tags?.map(s => html`<span class="feature-tag">${s}</span>`) || html``;

    const reviews = this.model.reviews || [];

    return html`
      <main>
        <section class="gallery-preview">
        <img src="${photoURL}" alt="View of ${this.studySpot?.name}" class="featured-image">
          <div class="view-gallery-overlay">
            <h2 class="spot-title">${name}</h2>
            <a href="" class="btn-view-gallery">
              <img src="/icons/default-photo.svg" alt="Gallery Icon">
              View Gallery
            </a>
          </div>
        </section>

        <section class="study-spot-actions">
          <a href="#" class="btn-add-photo">
            <img src="/icons/upload-photo.svg" alt="Add Photo Icon" class="btn-icon-white">
            Add Photo
          </a>
          <a href="app/study-spot/${this.spotid}/write-review" class="btn-write-review">
            <img src="/icons/create.svg" alt="Write Review Icon" class="btn-icon-white">
            Write Review
          </a>
        </section>

        <div class="details-reviews-container">
          <div class="details-ratings">
            <section class="spot-details">
              <h3>Details</h3>
              <p><strong>Address: </strong>${address}</p>
              <p><strong>Website Link: </strong> <a href="${link}" target="_blank">Link</a></p>
              <p>
                <strong>Features:</strong>
                ${tags_html}
              </p>
            </section>
            <section class="rating-breakdown">
              <h3><strong>Overall Rating:</strong></h3>
              <div class="overall-rating-image-container">
                <img src="/icons/star-rating.svg" alt="Star Rating" class="star-icon"/>
                <h4 class="rating-value">${ratings?.overall}</h4>
              </div>
              <h3>Rating Breakdown</h3>
              <p><strong>Quietness:</strong> ${ratings?.quietness} / 5</p>
              <p><strong>Wifi Quality:</strong> ${ratings?.wifiQuality} / 5</p>
              <p><strong>Crowdedness:</strong> ${ratings?.crowdedness} / 5</p>
              <p><strong>Power Outlets:</strong> ${ratings?.powerOutlets} / 5</p>
              <p><strong>Amenities:</strong> ${ratings?.amenities} / 5</p>
            </section>
          </div>
          <section class="user-reviews">
            <h3>User Reviews</h3>
            ${reviews.length > 0 ? reviews.map(review => html`
          <div class="review">
            <h4>${review.userId.name}</h4>
            
            <br/>
            <p><strong>Comment: </strong>${review.comment}</p>
            <br/>
            <p><strong>Best Time to Go</strong>: ${review.bestTimeToGo}</p>
            <br/>
            <div>
              <strong>Overall Rating:</strong> ${review.overallRating} / 5
              <br/>
              <strong>Quietness:</strong> ${review.quietnessRating} / 5
              <br/>
              <strong>Wifi Quality:</strong> ${review.wifiQualityRating} / 5
              <br/>
              <strong>Crowdedness:</strong> ${review.crowdednessRating} / 5
              <br/>
              <strong>Power Outlets:</strong> ${review.powerOutletRating} / 5
              <br/>
              <strong>Amenities:</strong> ${review.amenitiesRating} / 5
            </div>
          </div>
        `) : html`<p>No reviews yet.</p>`}
          </section>
        </div>
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

      .gallery-preview {
        position: relative;
        /* are the below needed? */
        width: 100%; /* Full width */
        margin: 0 auto; /* Center aligning */
      }
      
      .featured-image {
        width: 100%;
        display: block;
        height: 300px;
        object-fit: cover;
      }
      
      .view-gallery-overlay {
        position: absolute;
        bottom: 0;
        left: 0; /* not needed? */
        width: 100%;
        background: linear-gradient(to top, rgba(0,0,0,0.8) 10%, transparent 90%);
        padding: 10px 20px;
      }
      
      .spot-title {
        color: white;
        font-size: 2rem;
      }
      
      .btn-view-gallery {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        bottom: 10px;
        right: 20px;
        color: #333;
        background-color: #fff;
        padding: 8px 16px;
        border-radius: var(--border-radius);
        text-decoration: none;
      }
      
      .btn-view-gallery img {
        height: 20px;
        width: auto;
        margin-right: 8px;
      }
      
      .btn-view-gallery:hover {
        filter: brightness(0.9);
      }
      
      .study-spot-actions {
        text-align: center;
        padding: 10px 0;
      }
      
      .btn-add-photo, .btn-write-review {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: var(--color-primary);
        color: white;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: var(--border-radius);
        margin: 0 10px;
      }
      
      .btn-add-photo:hover, .btn-write-review:hover, .feature-tag:hover {
        background-color: var(--color-links);
        cursor: pointer; /* prob not needed for tags once it can be clicked */
      }
      
      .btn-icon-white {
        height: 20px;
        width: auto;
        margin-right: 8px;
        filter: brightness(0) invert(1);
      }
      
      .details-reviews-container {
        display: flex;
        justify-content: space-between; /* might not need? */
        margin-top: 20px;
      }
      
      .feature-tag {
        display: inline-block;
        background-color: var(--color-tags);
        color: #fff;
        border-radius: var(--border-radius);
        padding: 5px 10px;
        margin: 2px;
        font-size: 0.875rem;
        text-transform: capitalize;
      }

      /* Details and Ratings Container Styles */
      .details-ratings {
        flex: 1;
        padding-right: 10px;
      }
      
      .details-ratings h3 {
        color: var(--color-primary);
      }
      
      .spot-details, .rating-breakdown {
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid #ccc;
      }
      
      /* .rating-breakdown {
        padding-top: 20px; /* Space at the top to separate from details *
      } */
      
      .overall-rating-image-container {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }
      
      .star-icon {
        width: 24px;
        height: auto;
        margin-right: 5px;
      }
      
      .rating-value {
        font-size: 1.5rem;
        color: var(--color-primary);
      }
      
      .rating-breakdown p {
        margin: 5px 0;
      }
      
      .rating-breakdown h3 {
        color: var(--color-primary);
      }
      
      /* User Reviews Styles */
      .user-reviews {
        flex: 2;
        padding-left: 10px;
      }
      
      .user-reviews h3 {
        color: var(--color-primary);
      }
      
      .review {
        background-color: var(--color-background-secondary);
        /* border: 1px solid #ddd; */
        box-shadow: var(--shadow-hover-small);
        margin-top: 20px;
        padding: 10px;
        border-radius: var(--border-radius);
      }
      
      .review ul {
        margin: 10px 0 0 15px;
      }
    
    `
  ];
}
