import { View } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import resetCSS from "../css/reset";
import {
  StudySpot,
  Review,
  OperatingHours
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
    if (
      name === "spot-id" &&
      oldValue !== newValue &&
      newValue
    ) {
      console.log("Study Spot Page:", newValue);
      
      // Clear reviews in the model when changing study spots
      this.dispatchMessage(["review/clear"]);

      this.dispatchMessage([
        "study-spot/select",
        { spotid: newValue }
      ]);
      this.dispatchMessage(["review/list-by-spot", { spotId: newValue }]);
    }
  }

  // formatDate(date: Date): string {
  //   return `${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;
  // }

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
  
  

  render(): TemplateResult {
    const {
      name,
      address,
      hoursOfOperation,
      ratings,
      link,
    } = this.studySpot || {};
    
    const photo_URL = this.studySpot?.photos?.[0] || '/icons/default-spot.webp';

    const tags_html = this.studySpot?.tags?.map(s => html`<span class="feature-tag">${s}</span>`) || html``;

    // const reviews = this.model.reviews || [];

    const websiteLink_html = link ? html`<a href="${link}" target="_blank" class="web-link">${link}</a>` : html`<span class="placeholder-text">Website not available</span>`;

    const hoursOfOperation_html = hoursOfOperation && hoursOfOperation.length > 0 ? hoursOfOperation.map(hour => html`
      <div class="hours">
        <span>${hour.startDay} - ${hour.endDay}: ${formatOperatingHours(hour)}</span>
      </div>
    `) : html`<span class="placeholder-text">Hours not available</span>`;

    function formatTime(minutes: number): string {
      if (minutes === -1) return "Closed";
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const period = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
      const formattedMins = mins < 10 ? `0${mins}` : mins;
      return `${formattedHours}:${formattedMins} ${period}`;
    }
    
    function formatOperatingHours(hours: OperatingHours): string {
      const openTime = formatTime(hours.open || 0);
      const closeTime = formatTime(hours.close || 0);
      return hours.isOpen24Hours ? "Open 24 Hours" : `${openTime} - ${closeTime}`;
    }
    
    return html`
      <main>
        <section class="gallery-preview">
          <img src="${photo_URL}" alt="View of ${this.studySpot?.name}" class="featured-image">
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
          <a href="../add-review/${this.spotid}" class="btn-write-review">
            <img src="/icons/create.svg" alt="Write Review Icon" class="btn-icon-white">
            Write Review
          </a>
        </section>

        <div class="details-reviews-container">
          <div class="details-ratings">
            <section class="spot-details">
              <h3>Details</h3>
              <p><strong>Address: </strong>${address}</p>
              <p><strong>Website Link:</strong> ${websiteLink_html}</p>
              <p>
                <strong>Features:</strong>
                ${tags_html}
              </p>
              <p>
                <strong>Hours of Operation:</strong>
                ${hoursOfOperation_html}
              </p>
            </section>
            <section class="rating-breakdown">
              <h3><strong>Overall Rating:</strong></h3>
              <div class="overall-rating-image-container">
                <img src="/icons/star-rating.svg" alt="Star Rating" class="star-icon"/>
                <h4 class="rating-value">${ratings?.overall.toFixed(2)}</h4>
              </div>
              <h3>Rating Breakdown</h3>
              <p><strong>Quietness:</strong> ${this.renderStars(ratings?.quietness ?? 0)} ${ratings?.quietness.toFixed(2)}/ 5</p>
              <p><strong>Wifi Quality:</strong> ${this.renderStars(ratings?.wifiQuality ?? 0)} ${ratings?.wifiQuality.toFixed(2)} / 5</p>
              <p><strong>Crowdedness:</strong> ${this.renderStars(ratings?.crowdedness ?? 0)} ${ratings?.crowdedness.toFixed(2)}/ 5</p>
              <p><strong>Power Outlets:</strong> ${this.renderStars(ratings?.powerOutlets ?? 0)} ${ratings?.powerOutlets.toFixed(2)} / 5</p>
              <p><strong>Amenities:</strong> ${this.renderStars(ratings?.amenities ?? 0)} ${ratings?.amenities.toFixed(2)}/ 5</p>
            </section>
          </div>
          <section class="user-reviews">
            <h3>User Reviews</h3>
            ${this.reviews.length > 0 ? this.reviews.map(review => html`
            <div class="review-card">
              <div class="review-header">
                <h4 class="review-author">${review.userId.userid}</h4>
                <span class="review-date">${this.formatDate(review.createdAt.toString())}</span>
              </div>
              <div class="review-body">
                <div class="review-rating">
                  ${this.renderStars(review.overallRating)}
                  <span class="rating-text">${review.overallRating} / 5</span>
                </div>
                <p class="review-comment">${review.comment}</p>
              </div>
              <div class="review-footer">
                <span class="review-time-to-go">Best Time to Go: ${review.bestTimeToGo}</span>
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
      
      .hours {
        margin-top: 10px;
      }

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

      .web-link {
        color: var(--color-secondary);
        text-decoration: none;
        transition: color 0.3s ease, text-decoration 0.3s ease;
      }
  
      .web-link:hover {
        color: var(--color-links);
        text-decoration: underline;
      }

      .placeholder-text {
        color: var(--color-text-secondary);
      }

      .star {
        display: inline-block;
        width: 1rem;
        height: 1rem;
        background: lightgray;
        clip-path: polygon(
          50% 0%, 
          61% 35%, 
          98% 35%, 
          68% 57%, 
          79% 91%, 
          50% 70%, 
          21% 91%, 
          32% 57%, 
          2% 35%, 
          39% 35%
        );
      }
      
      .star.full {
        background: gold;
      }
      
      .star.half {
        background: linear-gradient(90deg, gold 50%, lightgray 50%);
      }
      
      .star.empty {
        background: lightgray;
      }

      .user-reviews {
        flex: 2;
        padding-left: 10px;
        display: flex;
        flex-direction: column;
        gap: 20px; /* space between reviews */
      }
      
      .review-card {
        background-color: var(--color-background-secondary);
        box-shadow: var(--shadow-hover-small);
        padding: 20px;
        border-radius: var(--border-radius);
        margin-top: 10px;
      }
      
      .review-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      
      .review-author {
        font-size: 1.25rem;
        color: var(--color-primary);
      }
      
      .review-date {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
      }
      
      .review-body {
        padding-bottom: 10px;
      }
      
      .review-rating {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
      }
      
      .rating-text {
        margin-left: 10px;
        font-size: 1rem;
        color: var(--color-secondary);
      }
      
      .review-comment {
        font-size: 1rem;
        color: var(--color-text-primary);
        white-space: pre-wrap; /* Ensures that whitespace in the comment is respected */
      }
      
      .review-footer {
        margin-top: 10px;
        font-size: 0.875rem;
        color: var(--color-text-secondary);
      }
      
      .review-time-to-go {
      display: block;
      font-size: 0.875rem;
      color: var(--color-secondary); /* Different color */
      background-color: var(--color-background-light); /* Light background */
      padding: 5px 10px;
      margin-top: 10px;
      border-radius: 15px; /* Rounded corners for a chip-like appearance */
      font-style: italic; /* Italicize text */
      display: flex;
      align-items: center; /* Center align if using icon */
    }
    `
  ];
}
