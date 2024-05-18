import { prepareTemplate } from "./template.js";
import { loadJSON } from "./json-loader.js";
import { Auth, Observer } from "@calpoly/mustang";
import "./restful-form.js";

export class ProfileViewElement extends HTMLElement {
  static observedAttributes = ["src", "mode"];

  get src() {
    return this.getAttribute("src");
  }

  get srcCollection() {
    const path = this.src.split("/");
    const collection = path.slice(0, -1);
    return collection.join("/");
  }

  get mode() {
    return this.getAttribute("mode");
  }

  set mode(m) {
    return this.setAttribute("mode", m);
  }

  static styles = `
    :host {
      --display-new-button: inline-block;
      --display-edit-button: inline-block;
      --display-close-button: none;
      --display-delete-button: none;
      --display-profile-sections: block;
      --display-form: none;
      --input-background-color: #f5f5f5;
      --input-text-color: #333;
      --input-border-color: #ccc;
    }
    :host([mode="edit"]) {
      --display-new-button: none;
      --display-edit-button: none;
      --display-close-button: inline-block;
      --display-delete-button: inline-block;
      --display-profile-sections: none;
      --display-form: block;
    }
    :host([mode="new"]) {
      --display-new-button: none;
      --display-edit-button: none;
      --display-close-button: inline-block;
      --display-profile-sections: none;
      --display-form: block;
    }
    :host([mode="view"]) {
      --display-new-button: inline-block;
      --display-edit-button: inline-block;
      --display-close-button: none;
      --display-delete-button: none;
      --display-profile-sections: block;
      --display-form: none;
    }
    * {
      margin: 0;
      box-sizing: border-box;
    }
    section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--size-spacing-medium);
      background-color: var(--color-background-secondary);
      padding: var(--space-regular);
      margin: auto;
      max-width: 800px;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-hover-small);
    }
    h1 {
      margin: var(--space-small) 0;
      color: var(--color-primary);
      text-align: center;
    }
    slot[name="avatar"] {
      display: block;
      text-align: center;
      position: relative;
    }
    slot[name="avatar"]::slotted(*) {
      width: 100px;
      height: auto;
      border-radius: 50%;
      border: 2px solid var(--color-primary);
    }
    nav {
      display: flex;
      justify-content: center;
      gap: var(--size-spacing-medium);
      margin-top: var(--size-spacing-medium);
    }
    nav > .new {
      display: var(--display-new-button);
    }
    nav > .edit {
      display: var(--display-edit-button);
    }
    nav > .close {
      display: var(--display-close-button);
    }
    nav > .delete {
      display: var(--display-delete-button);
    }
    restful-form {
      display: var(--display-form);
      width: 100%;
    }
    restful-form input,
    restful-form textarea {
      width: 100%;
      box-sizing: border-box;
      margin-bottom: var(--space-small);
      padding: var(--space-small);
      background-color: var(--input-background-color);
      color: var(--input-text-color);
      border: 1px solid var(--input-border-color);
      border-radius: var(--border-radius);
    }
    restful-form label {
      display: block;
      margin-bottom: var(--space-small);
      font-weight: bold;
      color: var(--color-primary);
    }
    .profile-section {
      display: var(--display-profile-sections);
      width: 100%;
      padding: var(--space-small);
    }
    .profile-section:not(:last-child) {
      border-bottom: 1px solid var(--color-border);
      margin-bottom: var(--space-regular);
    }
    .profile-section h2 {
      margin-bottom: var(--space-small);
      color: var(--color-secondary);
      font-size: var(--font-size-large);
      border-bottom: 2px solid var(--color-primary);
      padding-bottom: var(--space-small);
    }
    dl {
      display: grid;
      grid-template-columns: 1fr 3fr;
      gap: var(--size-spacing-medium) var(--size-spacing-xlarge);
      align-items: baseline;
    }
    dt {
      font-weight: bold;
      color: var(--color-primary);
      font-family: var(--font-family-display);
      padding-right: var(--size-spacing-medium);
      border-right: 2px solid var(--color-border);
    }
    dd {
      color: var(--color-text-primary);
      padding-left: var(--size-spacing-medium);
      font-family: var(--font-family-body);
      text
    }
    ::slotted(ul) {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    ::slotted(ul > li) {
      padding: var(--size-spacing-small) 0;
      border-bottom: 1px solid var(--color-border);
      color: var(--color-text-primary);
    }
    .profile-actions {
      margin-top: var(--space-regular);
      text-align: center;
    }
    .profile-actions h3 {
      color: var(--color-secondary);
    }
    .profile-actions a {
      margin-top: var(--space-regular);
      background-color: var(--color-primary);
      color: var(--color-background-primary);
      padding: 10px 20px;
      border-radius: var(--border-radius);
      text-decoration: none;
      margin-right: var(--space-small);
      display: inline-block;
      transition: background-color 0.3s ease;
    }
    .profile-actions a:hover {
      background-color: var(--color-links);
      color: var(--color-background-primary);
    }
    button {
      grid-column: input;
      justify-self: start;
      width: 100%;
      padding: var(--space-small);
      background-color: var(--color-primary);
      color: var(--color-background-primary);
      border: none;
      border-radius: var(--border-radius);
      cursor: pointer;
      font-size: var(--font-size-body);
      margin-top: 20px;
      margin-bottom: 20px;
      margin-right: 20px;
    }
    button:hover {
      background-color: var(--color-links);
    }
  `;

  static template = prepareTemplate(`
    <template>
      <section>
        <slot name="avatar"></slot>
        <h1><slot name="name"></slot></h1>
          <nav>
            <button class="new"
              onclick="relayEvent(event,'profile-view:new-mode')"
            >New…</button>
            <button class="edit"
              onclick="relayEvent(event,'profile-view:edit-mode')"
            >Edit</button>
            <button class="close"
              onclick="relayEvent(event,'profile-view:view-mode')"
            >Close</button>
            <button class="delete"
              onclick="relayEvent(event,'profile-view:delete')"
            >Delete</button>
          </nav>
          <restful-form>
            <label>
              <span>Username</span>
              <input name="userid"/>
            </label>
            <label>
              <span>Name</span>
              <input name="name"/>
            </label>
            <label>
              <span>Email</span>
              <input name="email">
            </label>
            <label>
              <span>Bio</span>
              <textarea name="bio"></textarea>
            </label>
            <label>
              <span>Favorite Study Spots</span>
              <input name="favSpots" />
            </label>
            <label>
              <span>Avatar</span>
              <input name="avatar" />
            </label>
          </restful-form>
        <div class="profile-section">
          <h2>General Information</h2>
          <dl>
            <dt>Username: </dt>
            <dd><slot name="userid"></slot></dd>
            <dt>Email: </dt>
            <dd><slot name="email"></slot></dd>
            <dt>Bio: </dt>
            <dd><slot name="bio"></slot></dd>
            <dt>Date Joined:</dt>
            <dd><slot name="dateJoined"></slot></dd>
          </dl>
        </div>
        <div class="profile-section">
          <h2>Reviews</h2>
          <dl>
            <dt>Number of Reviews:</dt>
            <dd><slot name="reviewsCount"></slot></dd>
            <dt>Reviews:</dt>
            <dd><slot name="reviews"></slot></dd>
          </dl>
        </div>
        <div class="profile-section">
          <h2>Favorite Study Spots</h2>
          <dl>
            <dt>Favorite Study Spots:</dt>
            <dd><slot name="favSpots"></slot></dd>
          </dl>
        </div>
        </section>
      <style>${ProfileViewElement.styles}</style>
    </template>
    `);

  get form() {
    return this.shadowRoot.querySelector("restful-form");
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" }).appendChild(
      ProfileViewElement.template.cloneNode(true)
    );

    this.addEventListener(
      "profile-view:edit-mode",
      (event) => (this.mode = "edit")
    );

    this.addEventListener(
      "profile-view:view-mode",
      (event) => (this.mode = "view")
    );

    this.addEventListener(
      "profile-view:new-mode",
      (event) => (this.mode = "new")
    );

    this.addEventListener("profile-view:delete", (event) => {
      event.stopPropagation();
      deleteResource(this.src).then(() => (this.mode = "new"));
    });

    this.addEventListener("restful-form:created", (event) => {
      console.log("Created a profile", event.detail);
      const userid = event.detail.created.userid;
      this.mode = "view";
      this.setAttribute(
        "src",
        `${this.srcCollection}/${userid}`
      );
    });

    this.addEventListener("restful-form:updated", (event) => {
      console.log("Updated a profile", event.detail);
      this.mode = "view";
      console.log("LOading JSON", this.authorization);
      loadJSON(this.src, this, renderSlots, this.authorization);
    });
  }

  _authObserver = new Observer(this, "slostudyspots:auth");

  get authorization() {
    console.log("Authorization for user, ", this._user);
    return (
      this._user?.authenticated && {
        Authorization: `Bearer ${this._user.token}`
      }
    );
  }

  connectedCallback() {
    this._authObserver.observe(({ user }) => {
      console.log("Setting user as effect of change", user);
      this._user = user;
      if (this.src) {
        console.log("LOading JSON", this.authorization);
        loadJSON(
          this.src,
          this,
          renderSlots,
          this.authorization
        ).catch((error) => {
          const { status } = error;
          if (status === 401) {
            const message = new CustomEvent("auth:message", {
              bubbles: true,
              composed: true,
              detail: ["auth/redirect"]
            });
            console.log("Dispatching", message);
            this.dispatchEvent(message);
          } else {
            console.log("Error:", error);
          }
        });
      }
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(
      `Atribute ${name} changed from ${oldValue} to`,
      newValue
    );
    switch (name) {
      case "src":
        if (
          newValue &&
          this.mode !== "new" &&
          this.authorization
        ) {
          console.log("Loading JSON", this.authorization);
          loadJSON(
            this.src,
            this,
            renderSlots,
            this.authorization
          );
        }
        break;
      case "mode":
        if (newValue === "edit" && this.src) {
          this.form.removeAttribute("new");
          this.form.setAttribute("src", this.src);
        }
        if (newValue === "view") {
          this.form.removeAttribute("new");
          this.form.removeAttribute("src");
        }
        if (newValue === "new") {
          const newSrc = `${this.srcCollection}/$new`;
          this.replaceChildren();
          this.form.setAttribute("new", "new");
          this.form.setAttribute("src", newSrc);
        }
        break;
    }
  }
}

customElements.define("profile-view", ProfileViewElement);

function renderSlots(json) {
  console.log("RenderingSlots:", json);
  const entries = Object.entries(json);
  const slot = ([key, value]) => {
    let type = typeof value;

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

function deleteResource(src) {
  return fetch(src, { method: "DELETE" })
    .then((res) => {
      if (res.status != 204)
        throw `Deletion failed: Status ${res.status}`;
    })
    .catch((err) =>
      console.log("Error deleting resource:", err)
    );
}

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
    // console.log("Avatar connected", this);
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