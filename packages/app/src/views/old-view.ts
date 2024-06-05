import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { StudySpot } from "server/models";
import { StudySpotGrid } from "../components/study-spot-grid.ts";
import { Msg } from "../messages.ts";
import { Model } from "../model.ts";
import { define, History, View} from "@calpoly/mustang";

export class HomeViewElement extends View<Model, Msg> {
  static uses = define({
    "study-spot-grid": StudySpotGrid,
  })

  @property({ reflect: true, type: Boolean })
  open: boolean = false;

  @state()
  studySpotList: StudySpot[] = [];
  sort: boolean = false;


  handleSort(event: CustomEvent) {
    let result = event.detail;
    this.sort = result;
    this.requestUpdate();
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
      console.log("Home Page:", newValue);
      this.dispatchMessage([
        "study-spot/select",
        { spotid: newValue }
      ]);
    }
  }

  render() {
    return html`
      <section class="featured-spots">
        <h2>Featured Study Spots</h2>
          <study-spot-grid
            .studySpotList=${this.studySpotList}
            .sort=${this.sort}
          >
          </study-spot-grid>
      </section>
    `;
  }

  static styles = css`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .featured-spots {
      margin: var(--space-regular) 0;
    }
    
    .featured-spots h2 {
      font-size: var(--font-size-large);
      color: var(--color-secondary);
      margin-bottom: var(--space-small);
    }
  `;
}