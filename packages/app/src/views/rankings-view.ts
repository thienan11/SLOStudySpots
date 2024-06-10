import { css, html, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { StudySpot } from 'server/models';
import { Msg } from '../messages';
import { Model } from '../model';
import { View } from '@calpoly/mustang';
import resetCSS from '../css/reset';

export class RankingsViewElement extends View<Model, Msg> {
  @state()
  get sortedStudySpots(): StudySpot[] {
    return [...(this.model.studySpotIndex || [])].sort((a, b) => b.ratings.overall - a.ratings.overall);
    // TODO: for tie breakers, sort by number of reviews
  }
 
  constructor() {
    super("slostudyspots:model");
  }

  connectedCallback() {
    super.connectedCallback();
    this.dispatchMessage(["study-spot/index"]);
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
    const renderItem = (s: StudySpot) => {
      const { name, ratings, reviewsCount} = s;
      const { _id } = s as unknown as { _id: string };

      return html`
      <a href="study-spot/${_id}">
        <li class="ranking">
          <div class="content">
            <h3>${name}</h3>
            <p><strong>Rating: </strong>${ratings.overall.toFixed(1)} ${this.renderStars(ratings.overall)} (${reviewsCount} reviews)</p>
          </div>
        </li>
      </a>
    `;
    };

    return html`
      <main>
        <section class="rankings-container">
          <h2>Top Rated Study Spots</h2>
          <ol>
            ${this.sortedStudySpots.map(renderItem)}
          </ol>
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

      .rankings-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: var(--space-regular);
      }
      
      .rankings-container h2 {
        color: var(--color-secondary);
        text-align: center;
      }
      
      ol {
        list-style-type: none;
      }

      .ranking {
        background-color: var(--color-background-secondary);
        border: 1px solid var(--color-primary);
        border-radius: var(--border-radius);
        padding: 20px;
        box-shadow: var(--shadow-hover-small);
        transition: transform 0.3s ease;
        cursor: pointer;
        position: relative; /* Position relative for numbering */
        margin-bottom: 16px; /* Increased space between items */
      }
      
      .ranking:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-hover-large);
      }
      
      .ranking h3 {
        color: var(--color-primary);
        margin-bottom: 10px;
      }
      
      .ranking p {
        line-height: 1.5;
        color: var(--color-text-primary);
      }
      
      .ranking p strong {
        font-weight: bold;
      }
      
      .content {
        padding-left: 30px; /* Space for the number inside the box */
      }

      ol {
        counter-reset: ranking; /* Create a counter */
      }

      .ranking:before {
        content: counter(ranking) ". "; /* Add number before the content */
        counter-increment: ranking; /* Increment the counter */
        position: absolute;
        left: 10px; /* Position the number inside the box */
        top: 20px; /* Adjust vertical alignment */
        font-size: 1.2em; /* Larger number font */
        color: var(--color-primary); /* Color for the numbers */
      }

      a {
        text-decoration: none;
      }
    `
  ];
}
