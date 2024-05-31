import {
  define,
  Form,
  History,
  View
} from "@calpoly/mustang";
import { css, html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { Profile } from "server/models";
// import { ProfileAvatarElement } from "../components/profile-avatar";
import resetStyles from "../css/reset";
import { Msg } from "../messages";
import { Model } from "../model";

const gridStyles = css`
  slot[name="avatar"] {
    display: block;
    grid-row: 1 / span 4;
  }
  nav {
    display: contents;
    text-align: right;
  }
  nav > * {
    grid-column: controls;
  }
`;

class ProfileViewer extends LitElement {
  @property()
  username?: string;

  render() {
    return html`
      <section>
        <slot name="avatar"></slot>
        <h1><slot name="name"></slot></h1>
        <nav>
          <a href="${this.username}/edit" class="edit">Edit</a>
        </nav>
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
    `;
  }

  static styles = [
    resetStyles,
    gridStyles,
    css`
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
    `
  ];
}

class ProfileEditor extends LitElement {
  static uses = define({
    "mu-form": Form.Element,
  });
  @property()
  username?: string;

  @property({ attribute: false })
  init?: Profile;

  render() {
    return html`
      <section>
        <slot name="avatar"></slot>
        <h1><slot name="name"></slot></h1>
        <nav>
          <a class="close" href="../${this.username}">Close</a>
          <button class="delete">Delete</button>
        </nav>
        <mu-form .init=${this.init}>
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
        </mu-form>
      </section>
    `;
  }

  static styles = [
    resetStyles,
    gridStyles,
    css`
      mu-form {
        grid-column: key / end;
      }
      mu-form input {
        grid-column: input;
      }
    `
  ];
}

export class ProfileViewElement extends View<Model, Msg> {
  static uses = define({
    "profile-viewer": ProfileViewer,
    "profile-editor": ProfileEditor,
    // "profile-avatar": ProfileAvatarElement
  });

  @property({ type: Boolean, reflect: true })
  edit = false;

  @property({ attribute: "user-id", reflect: true })
  userid = "";

  @state()
  get profile(): Profile | undefined {
    return this.model.profile;
  }

  constructor() {
    super("slostudyspots:model");
    // this.addEventListener("mu-form:submit", (event) =>
    //   this._handleSubmit(event as Form.SubmitEvent<Profile>)
    // );
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (
      name === "user-id" &&
      oldValue !== newValue &&
      newValue
    ) {
      console.log("Profiler Page:", newValue);
      this.dispatchMessage([
        "profile/select",
        { userid: newValue }
      ]);
    }
  }

  render() {
    if (!this.profile) {
      return html`<p>Loading profile...</p>`;
    }

    const {
      avatar,
      name,
      userid,
      email,
      bio,
      reviewsCount,
      favSpots,
      dateJoined
    } = this.profile || {};

    const fav_spots_html = favSpots.map(
      (s) =>
        html`
          <li>${s}</li>
        `
    );

    const avatarElement = avatar
    ? html`<img src=${avatar} alt="Profile Avatar" slot="avatar">`
      : html`<div slot="avatar">No Avatar</div>`;

    return this.edit
    ? html`
        <profile-editor
          username=${userid}
          .init=${this.profile}
          @mu-form:submit=${(
            event: Form.SubmitEvent<Profile>
          ) => this._handleSubmit(event)}>
          ${avatarElement}
        </profile-editor>
      `
    : html`
        <profile-viewer username=${userid}>
          ${avatarElement}
          <span slot="name">${name}</span>
          <span slot="userid">${userid}</span>
          <span slot="email">${email}</span>
          <span slot="bio">${bio || 'No bio available'}</span>
          <span slot="dateJoined">${dateJoined.toLocaleDateString()}</span>
          <span slot="reviewsCount">${reviewsCount}</span>
          <ul slot="favSpots">${fav_spots_html}</ul>
        </profile-viewer>
      `;
  }

  _handleSubmit(event: Form.SubmitEvent<Profile>) {
    console.log("Handling submit of mu-form");
    this.dispatchMessage([
      "profile/save",
      {
        userid: this.userid,
        profile: event.detail,
        onSuccess: () =>
          History.dispatch(this, "history/navigate", {
            href: `/app/profile/${this.userid}`
          }),
        onFailure: (error: Error) =>
          console.log("ERROR:", error)
      } as { userid: string; profile: Profile; onSuccess: () => void; }
    ]);
  }

  static styles = [resetStyles];
}