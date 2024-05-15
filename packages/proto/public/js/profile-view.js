import { prepareTemplate } from "./template.js";
import { loadJSON } from "./json-loader.js";

export class ProfileViewElement extends HTMLElement {
  static styles = `
    * {
      margin: 0;
      box-sizing: border-box;
    }
    section {
      display: grid;
      grid-template-columns: [key] 1fr [value] 2fr [end];
      gap: var(--size-spacing-xlarge);
      align-items: end;
    }
    dl {
      display: grid;
      grid-column: key / end;
      grid-template-columns: subgrid;
      gap: 0 var(--size-spacing-xlarge);
      align-items: baseline;
    }
    dt {
      grid-column: key;
      justify-self: end;
      color: var(--color-accent);
      font-family: var(--font-family-display);
    }
    dd {
      grid-column: value;
    }
    ::slotted(ul) {
      list-style: none;
      display: flex;
      gap: var(--size-spacing-medium);
    }
  `;
  static template = prepareTemplate(`
    <template>
    <section>
      <slot name="avatar"></slot>
      <h1><slot name="name"></slot></h1>
      <dl>
        <dt>Username: </dt>
        <dd><slot name="userid"></slot></dd>
        <dt>Email: </dt>
        <dd><slot name="email"></slot></dd>
        <dt>Bio: </dt>
        <dd><slot name="bio"></slot></dd>
        <dt>Number of Reviews: </dt>
        <dd><slot name="reviewsCount"></slot></dd>
        <dt>Reviews: </dt>
        <dd><slot name="reviews"></slot></dd>
        <dt>Favorite Study Spots: </dt>
        <dd><slot name="favSpots"></slot></dd>
        <dt>Date Joined: </dt>
        <dd><slot name="dateJoined"></slot></dd>
      </dl>
    </section>
    <style>${ProfileViewElement.styles}</style>
    </template>
    `);

  constructor() {
    super();

    this.attachShadow({ mode: "open" }).appendChild(
      ProfileViewElement.template.cloneNode(true)
    );
  }

  connectedCallback() {
    const src = this.getAttribute("src");

    if (src) loadJSON(src, this, renderSlots);
  }
}

function renderSlots(json) {
  const entries = Object.entries(json);
  const slot = ([key, value]) => {
    let type = typeof value;
    console.log(`Slot name=${key} of type ${type}`);

    if (type === "object") {
      if (Array.isArray(value)) type = "array";
    }

    if (key === "avatar") {
      type = "avatar";
    }

    switch (type) {
      case "array":
        return `<ul slot="${key}">
          ${value.map((s) => `<li>${s}</li>`).join("")}
          </ul>`;
      case "avatar":
        return `<profile-avatar slot="${key}"
          color="${json.color}"
          src="${value}">
        </profile-avatar>`;
      default:
        return `<span slot="${key}">${value}</span>`;
    }
  };

  return entries.map(slot).join("\n");
}

customElements.define("profile-view", ProfileViewElement);

export class ProfileAvatarElement extends HTMLElement {
  get src() {
    return this.getAttribute("src");
  }

  get color() {
    return this.getAttribute("color");
  }

  get avatar() {
    return this.shadowRoot.querySelector(".avatar");
  }

  static template = prepareTemplate(`
    <template>
      <div class="avatar">
      </div>
      <style>
      :host {
        display: contents;
        --avatar-backgroundColor: var(--color-accent);
        --avatar-size: 100px;
      }
      .avatar {
        grid-column: key;
        justify-self: end;
        position: relative;
        width: var(--avatar-size);
        aspect-ratio: 1;
        background-color: var(--avatar-backgroundColor);
        background-size: cover;
        border-radius: 50%;
        text-align: center;
        line-height: var(--avatar-size);
        font-size: calc(0.66 * var(--avatar-size));
        font-family: var(--font-family-display);
        color: var(--color-link-inverted);
        overflow: hidden;
      }
      </style>
    </template>
    `);

  constructor() {
    super();

    this.attachShadow({ mode: "open" }).appendChild(
      ProfileAvatarElement.template.cloneNode(true)
    );
  }

  connectedCallback() {
    console.log("Avatar connected", this);
    this.style.setProperty(
      "--avatar-backgroundColor",
      this.color
    );
    this.avatar.style.setProperty(
      "background-image",
      `url('${this.src}')`
    );
  }

  attributeChangedCallback(name, from, to) {
    switch (name) {
      case "color":
        this.style.setProperty("--avatar-backgroundColor", to);
        break;
      case "src":
        this.avatar.style.setProperty(
          "background-image",
          `url(${to})`
        );
        break;
    }
  }
}

customElements.define("profile-avatar", ProfileAvatarElement);