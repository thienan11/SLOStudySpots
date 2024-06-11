import { html, css } from "lit";
import { Model } from "../model";
import { Msg } from "../messages";
import { View, Auth, Observer, History } from "@calpoly/mustang";
import { property } from "lit/decorators.js";
import resetCSS from "../css/reset";

export class AddSpotViewElement extends View<Model, Msg> {
  @property({ type: String }) name: string = '';
  @property({ type: String }) address: string = '';
  @property({ type: String }) locationType: string = '';
  @property({ type: String }) customLocationType: string = '';
  @property({ type: String }) tags: string = '';
  @property({ type: String }) link: string = '';
  @property({ type: String }) createdBy: string = '';

  constructor() {
    super("slostudyspots:model");
  }

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe(({ user }) => {
    if (user) {
        this.createdBy = user.username;
      }
    });
  }

  render() {
    return html`
    <main>
      <section class="create-spot-container">
        <h2>Add a Study Spot</h2>
        <p>Note: Make sure it's a new study spot and not an already existing one!</p>
        </br>
            <form id="addSpotForm" autocomplete="off">
              <div class="form-group">
                <label for="name">Name of the Study Spot:</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  @change=${(e: any) => (this.name = e.target.value)}
                  required
                />
              </div>
              <div class="form-group">
                <label for="address">Address:</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  @change=${(e: any) => (this.address = e.target.value)}
                  required
                />
              </div>
              <div class="form-group">
                <label for="location-type">Location Type:</label>
                <select
                  name="location-type"
                  @change=${(e: any) => (this.locationType = e.target.value)}
                  required
                >
                  <option value="">Select a type</option>
                  <option value="Cafe">Cafe</option>
                  <option value="Library">Library</option>
                  <option value="Park">Park</option>
                  <option value="Other">Other</option>
                </select>
                ${this.locationType === 'Other' ? html`
                <div class="form-group">
                  <label for="customLocationType">Custom Location Type:</label>
                  <input
                    type="text"
                    id="customLocationType"
                    name="customLocationType"
                    placeholder="Enter custom location type"
                    @change="${(e: any) => this.customLocationType = e.target.value}"
                    .value="${this.customLocationType}"
                    required
                  />
                </div>` : ''}
              </div>
              <div class="form-group">
                <label for="tags">Tags</label>
                <input
                  type="text"
                  name="tags"
                  placeholder="Tags (comma separated)"
                  @change=${(e: any) => (this.tags = e.target.value)}
                />
              </div>
              <div class="form-group">
                <label for="website-link">Website (Optional):</label>
                <input
                  type="url"
                  name="link"
                  placeholder="http://example.com"
                  @change=${(e: any) => (this.link = e.target.value)}
                />
              </div>
              <button type="submit" @click=${this.onSubmit}>Submit</button>
            </form>
      </section>
    </main>
    `;
  }

  onSubmit(e: Event) {
    e.preventDefault();
    
    const allTags = this.tags.split(',').map(tag => tag.trim());
    // Ensure custom location type is included if set
    const finalLocationType = this.locationType === 'Other' ? this.customLocationType : this.locationType;
    if (finalLocationType) {
      allTags.push(finalLocationType);
    }

    this.dispatchMessage([
      "study-spot/add", {
        spot: {
          name: this.name,
          address: this.address,
          locationType: finalLocationType,
          tags: allTags,
          link: this.link,
          createdBy: this.createdBy,
          ratings: {
            overall: 0,
            quietness: 0,
            wifiQuality: 0,
            crowdedness: 0,
            powerOutlets: 0,
            amenities: 0
          },
          reviewsCount : 0,
          photos: [],
          hoursOfOperation: []
        },
        onSuccess: () => {
          console.log('Study spot saved successfully');
          alert('Study Spot saved successfully!');
          // window.location.pathname = "/app";
          History.dispatch(this, "history/navigate", {
            href: `/app`
          });
        },
        onFailure: (error: Error) => {
          console.error('Failed to save study spot:', error);
          alert('Failed to save study spot');
        }
      }
    ]);
  }

  _authObserver = new Observer<Auth.Model>(
    this,
    "slostudyspots:auth"
  );

  static styles = [
    resetCSS,
    css`
      main {
        padding: var(--space-regular);
        flex-grow: 1;
      }

      .create-spot-container {
        width: 90%;
        max-width: 960px;
        margin: 40px auto;
        padding: 40px;
        background-color: var(--color-background-secondary);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-hover-med);
      }
      
      .create-spot-container h2 {
        color: var(--color-secondary);
        text-align: center;
        margin-bottom: 20px;
      }
      
      .create-spot-container a {
        background-color: var(--color-primary);
        color: var(--color-background-primary);
        text-decoration: none;
        padding: 12px 24px;
        border: none;
        border-radius: var(--border-radius);
        font-size: 1rem;
        margin-top: 10px;
        display: block;
        text-align: center;
      }
      
      .create-spot-container a:hover {
        background-color: var(--color-links);
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
      
      .form-group input,
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

      button {
        background-color: var(--color-primary);
        color: var(--color-background-primary);
        border: none;
        border-radius: var(--border-radius);
        padding: 12px 24px;
        font-size: 1rem;
        cursor: pointer;
        display: block;
        margin: 20px auto 0;
      }

      .form-group select {
        width: 100%;
        padding: 12px;
        background-color: var(--color-background-primary);
        border: 2px solid var(--color-primary);
        border-radius: var(--border-radius);
        color: var(--color-text-primary);
        appearance: none; /* Removes default styling provided by the browser */
        background-repeat: no-repeat;
        background-position: right 12px center;
        cursor: pointer;
      }
      
      .form-group select:focus {
        border-color: var(--color-secondary);
        outline: none;
      }
    `
  ];
}
