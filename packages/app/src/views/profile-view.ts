import {
  define,
  Form,
  History,
  View
} from "@calpoly/mustang";
import { css, html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { Profile } from "server/models";
import resetStyles from "../css/reset";
import { Msg } from "../messages";
import { Model } from "../model";

const gridStyles = css`
  slot[name="avatar"] {
    display: block;
    grid-row: 1 / span 2;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 20px;
  }
  nav {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 20px;
  }
  nav a {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: bold;
  }
`;

class ProfileViewer extends LitElement {
  @property()
  username?: string;

  render() {
    return html`
    <main>
      <section class="profile-container">
        <div class="profile-header">
          <slot name="avatar"></slot>
          <div>
            <h1><slot name="name"></slot></h1>
            <nav>
              <a href="${this.username}/edit" class="edit">Edit Profile</a>
            </nav>
          </div>
        </div>
        <div class="profile-section">
          <h2>General Information</h2>
          <dl>
            <dt>Username:</dt>
            <dd><slot name="userid"></slot></dd>
            <dt>Email:</dt>
            <dd><slot name="email"></slot></dd>
            <dt>Bio:</dt>
            <dd><slot name="bio"></slot></dd>
            <dt>Date Joined:</dt>
            <dd><slot name="dateJoined"></slot></dd>
          </dl>
        </div>
      </section>
    </main>
  `;
  }
  
  // TODO: Add reviews and favorite study spots sections
  // <div class="profile-section">
  //       <h2>Reviews</h2>
  //       <dl>
  //         <dt>Number of Reviews:</dt>
  //         <dd><slot name="reviewsCount"></slot></dd>
  //       </dl>
  //       <a href="/reviews/${this.username}" class="link-view-all">View All Reviews</a>
  //     </div>
  //     <div class="profile-section">
  //       <h2>Favorite Study Spots</h2>
  //       <dl>
  //         <dt>Favorite Study Spots:</dt>
  //         <dd><slot name="favSpots"></slot></dd>
  //       </dl>
  //       <a href="/favorites/${this.username}" class="link-view-all">View Favorite Spots</a>
  //     </div>


  static styles = [
    resetStyles,
    gridStyles,
    css`
      :host {
        padding: 20px;
      }

      main {
        padding: var(--space-regular);
        flex-grow: 1;
      }

      .profile-container {
        display: flex;
        flex-direction: column;
        background-color: var(--color-background-secondary);
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        max-width: 800px;
        margin: auto;
      }
      .profile-header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
      }
      h1 {
        color: var(--color-primary);
      }
      dl {
        display: grid;
        grid-template-columns: 1fr 3fr;
        gap: 10px;
      }
      dt {
        font-weight: bold;
        color: var(--color-primary);
        padding-right: 20px;
      }
      dd {
        padding-left: 20px;
      }
      .profile-section {
        background-color: var(--color-background-primary);
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        margin-bottom: 20px;
      }
      nav > a:hover {
        color: var(--color-secondary);
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

  connectedCallback() {
    super.connectedCallback();
    if (!this.init) {
      console.error("Profile data is not initialized.");
    } else {
      console.log("Profile data is initialized:", this.init);
    }
  }

  render() {
    return html`
      <main>
        <section class="profile-editor">
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
              <span>Avatar</span>
              <input name="avatar" />
              <!-- <input
              name="avatar"
              type="file"
              @change=${this._handleAvatarSelected} /> -->
            </label>
          </mu-form>
        </section>
      </main>
    `;
  }

  static styles = [
    resetStyles,
    gridStyles,
    css`
      main {
        padding: var(--space-regular);
        flex-grow: 1;
      }
      mu-form {
        grid-column: key / end;
      }
      mu-form input {
        grid-column: input;
      }
      .profile-editor {
        display: flex;
        flex-direction: column;
        padding: 20px;
        max-width: 600px;
        margin: auto;
      }
    `
  ];

  _handleAvatarSelected(ev: Event) {
    console.log("Avatar file selection triggered");
    const target = ev.target as HTMLInputElement;
    const selectedFile = (target.files as FileList)[0];

    const reader: Promise<string> = new Promise(
      (resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result as string);
        fr.onerror = (err) => reject(err);
        fr.readAsDataURL(selectedFile);
      }
    );

    reader.then((url: string) => {
      console.log("Dispatching new avatar URL:", url);
      this.dispatchEvent(
        new CustomEvent("profile:new-avatar", {
          bubbles: true,
          composed: true,
          detail: url
        })
      );
    });
  }
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

  @state()
  newAvatar?: string;
 
  constructor() {
    super("slostudyspots:model");
    // this.addEventListener("mu-form:submit", (event) =>
    //   this._handleSubmit(event as Form.SubmitEvent<Profile>)
    // );
    this.addEventListener("profile:new-avatar", (event: Event) => {
      const newAvatarURL = (event as CustomEvent).detail as string;
      console.log("New avatar URL received:", newAvatarURL);
      if (this.profile) {
        this.profile.avatar = newAvatarURL; // Update the avatar property directly if possible
        this.requestUpdate(); // Request an update to re-render the component
      }
    });
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
    // if (!this.profile) {
    //   return html`<p>Loading profile...</p>`;
    // }

    const {
      avatar,
      name,
      userid,
      email,
      bio,
      reviewsCount,
    } = this.profile || {};

    const fav_spots_html = this.profile?.favSpots?.map(s => html`<li>${s}</li>`) || html``;

    const formattedDate = this.profile?.dateJoined ? new Date(this.profile.dateJoined).toLocaleDateString() : 'Date unavailable';

    const avatarElement = this.newAvatar || avatar
      ? html`<img src=${this.newAvatar || avatar} alt="Profile Avatar" slot="avatar">`
      : html`<img slot="avatar" src="/icons/default-profile.svg">`;


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
          <span slot="email">${email || 'No email available'}</span>
          <span slot="bio">${bio || 'No bio available'}</span>
          <span slot="dateJoined">${formattedDate}</span>
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