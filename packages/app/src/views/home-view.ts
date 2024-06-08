import { define, View } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { state } from "lit/decorators.js";
import { StudySpot } from "server/models";
import resetCSS from "../css/reset";
import { Msg } from "../messages";
import { Model } from "../model";

export class HomeViewElement extends View<Model, Msg> {

  @state()
  get studySpotIndex(): StudySpot[] {
    return this.model.studySpotIndex || [];
  }

  @state()
  private isPopupOpen: boolean = false;

  @state()
  private filterTerm: string = '';

  constructor() {
    super("slostudyspots:model");
  }

  connectedCallback() {
    super.connectedCallback();
    this.dispatchMessage(["study-spot/index"]);
  }

  togglePopup() {
    this.isPopupOpen = !this.isPopupOpen;
  }

  sortAlphabetically() {
    this.studySpotIndex.sort((a, b) => a.name.localeCompare(b.name));
    this.isPopupOpen = false;
  }

  updateFilterTerm(e: Event) {
    const input = e.target as HTMLInputElement;
    this.filterTerm = input.value;
  }

  render(): TemplateResult {
    const renderItem = (s: StudySpot) => {
      const { name } = s;
      const { _id } = s as unknown as { _id: string };
      const photoURL = s.photos?.[0] || '/icons/default-spot.webp';

      return html`
      <li class="study-spot-container">
        <a href="/app/study-spots/${_id}">
          <img src="${photoURL}" alt="${name}" />
          <div class="study-spot-content">
            <h3>${name}</h3>
            <p> Reviews: 1 </p>
          </div>
        </a>
      </li>
    `;
    };
    // <p> ${this.renderRatings(spot.ratings.overall)} (${spot.ratings.overall} reviews)</p>

    const filteredStudySpots = this.studySpotIndex.filter(spot =>
      spot.name.toLowerCase().includes(this.filterTerm.toLowerCase())
    );

    return html`
      <main>
        <section class="welcome-section">
          <h1>Welcome to SLOStudySpots</h1>
          <p>Find the best spots to study in San Luis Obispo!</p>
        </section>

        <section class="featured-spots">
          <h2>Featured Study Spots</h2>
          <input type="text" @input="${this.updateFilterTerm}" placeholder="Search spots..." />
          <button @click="${this.togglePopup}">Filter</button>
          ${this.isPopupOpen ? html`
            <div class="popup">
              <button @click="${this.sortAlphabetically}">Sort Alphabetically</button>
            </div>
          ` : ''}
          <ul class="spots-list">
            ${filteredStudySpots.map(renderItem)}
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

      .welcome-section {
        text-align: center;
        padding: var(--space-regular) 0;
      }
      
      .welcome-section h1 {
        font-size: var(--font-size-large); /* can prob be removed*/
        color: var(--color-primary);
        padding-bottom: var(--space-small);
      }

      .featured-spots {
        margin: var(--space-regular) 0;
      }
      
      .featured-spots h2 {
        font-size: var(--font-size-large);
        color: var(--color-secondary);
        margin-bottom: var(--space-small);
      }
      
      .spots-list {
        list-style: none;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-gap: var(--space-regular);
      }
      
      .study-spot-container {
        border: 1px solid var(--color-primary);
        border-radius: var(--border-radius);
        overflow: hidden;
        transition: box-shadow 0.3s ease-in-out;
        background-color: var(--color-background-secondary);
      }
      
      .study-spot-container:hover {
        box-shadow: var(--shadow-hover-large);
      }
      
      .study-spot-container a {
        display: block;
        color: inherit;
        text-decoration: none;
      }
      
      .study-spot-container img {
        width: 100%;
        height: 200px;
        object-fit: cover;
      }
      
      .study-spot-content {
        padding: var(--space-small);
        /* background: var(--color-background-primary); */
      }
      
      .study-spot-container h3 {
        margin: var(--space-small) 0;
        color: var(--color-primary);
        font-size: 1.25rem;
      }
      
      .study-spot-container p {
        margin: 0;
        font-size: 0.875rem;
        color: var(--color-text-primary);
      }
      
      .popup {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border: 1px solid black;
      }

    `
  ];
}
