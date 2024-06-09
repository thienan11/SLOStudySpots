import { define, View } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { state } from "lit/decorators.js";
import { StudySpot } from "server/models";
import resetCSS from "../css/reset";
import { Msg } from "../messages";
import { Model } from "../model";
import { FilterPopup } from "../components/filter-popup";

export class HomeViewElement extends View<Model, Msg> {
  static uses = define({
    "filter-popup": FilterPopup,
  })

  @state()
  get studySpotIndex(): StudySpot[] {
    return this.model.studySpotIndex || [];
  }

  @state()
  private isPopupOpen: boolean = false;

  @state()
  private filterTerm: string = '';

  @state()
  private filteredStudySpots: StudySpot[] = [];

  constructor() {
    super("slostudyspots:model");
    this.updateFilteredStudySpots();
  }

  connectedCallback() {
    super.connectedCallback();
    this.dispatchMessage(["study-spot/index"]);
  }

  togglePopup() {
    this.isPopupOpen = !this.isPopupOpen;
  }

  private updateFilteredStudySpots() {
    this.filteredStudySpots = this.studySpotIndex.filter(spot =>
      spot.name.toLowerCase().includes(this.filterTerm.toLowerCase())
    );
  }

  handleSortRequested(event: CustomEvent) {
    const sortType = event.detail.sortType;
    if (sortType === "alphabetically") {
      this.studySpotIndex.sort((a, b) => a.name.localeCompare(b.name));
      this.filteredStudySpots = this.studySpotIndex.filter(spot =>
        spot.name.toLowerCase().includes(this.filterTerm.toLowerCase())
      );
    }
    this.isPopupOpen = false;
  }

  updateFilterTerm(e: Event) {
    const input = e.target as HTMLInputElement;
    this.filterTerm = input.value;
    this.updateFilteredStudySpots(); // Update filtered study spots when filter term changes
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
      const { name, ratings} = s;
      const { _id } = s as unknown as { _id: string };
      const photoURL = s.photos?.[0] || '/icons/default-spot.webp';
      const overallRating = ratings.overall.toFixed(1);

      return html`
      <li class="study-spot-container">
        <a href="/app/study-spots/${_id}">
          <img src="${photoURL}" alt="${name}" />
          <div class="study-spot-content">
            <h3>${name}</h3>
            <div class="rating-container">
              <p class="overall-rating">${overallRating}</p>
              <div class="stars">
                ${this.renderStars(ratings.overall)}
              </div>
            </div>
          </div>
        </a>
      </li>
    `;
    };

    const spotsToRender = this.filteredStudySpots.length > 0 ? this.filteredStudySpots : this.studySpotIndex;

    return html`
      <main>
        <section class="welcome-section">
          <h1>Welcome to SLOStudySpots</h1>
          <p>Find the best spots to study in San Luis Obispo!</p>
          <div class="search-box">
            <form>
              <input type="search" @input="${this.updateFilterTerm}" placeholder="Search for study spots..." />
            </form>
          </div>
        </section>

        <section class="featured-spots">
          <h2>Featured Study Spots</h2>
          <filter-popup .open="${this.isPopupOpen}" @sort-requested="${this.handleSortRequested}"></filter-popup>
          <ul class="spots-list">
            ${spotsToRender.map(renderItem)}
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

      .search-box {
        width: 100%;
        max-width: 470px;
        margin: 0 auto;
        padding-top: var(--space-regular);
      }
  
      .search-box form {
        width: 100%;
        display: flex;
      }
  
      .search-box input[type="search"] {
        width: 100%;
        padding: 10px 15px;
        font-size: 1rem;
        border: 2px solid var(--color-primary);
        border-radius: var(--border-radius);
        outline: none;
        text-align: center;
        font-family: inherit;
      }
  
      .search-box input[type="search"]:focus {
        border-color: var(--color-secondary);
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

      .rating-container {
        display: flex;
        align-items: center;
      }
    
      .overall-rating {
        margin-right: var(--space-small);
        font-size: 1rem;
        color: var(--color-secondary);
      }
    
      .stars {
        display: flex;
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

    `
  ];
}
