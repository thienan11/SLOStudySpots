import { css, html, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Auth, Observer, History } from "@calpoly/mustang";
import resetCSS from "../css/reset";

export class AccountViewElement extends LitElement {
  @state()
  username = "anonymous";

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe(({ user }) => {
      if (user) {
        this.username = user.username;
      } else {
        this.username = "anonymous";
      }
    });
  }

  render() {
    return html`
      <div class="profile-content">
        <div class="profile-header">
          <h2>Account</h2>
          <div class="inline"> 
            Hello,
            ${this.username ? html`<p>${this.username}</p>` : html``}
            <!-- <p>· Go to</p>
            <a class="link" href="/app/profile/${this.username}">Profile</a> -->
          </div>
        </div>

        <div class="profile-tabs">
          <div @click=${() => this.navigateTo("/app/profile/" + this.username)}>
            <img src="/icons/default-profile.png" alt="profile-icon" />
            <h3>My Personal Info</h3>
            <p>View your personal account information</p>
          </div>
          <div @click=${() => this.navigateTo("/app/my-reviews")}>
            <img src="/icons/review-icon.png" alt="review-icon" />
            <h3>My Reviews</h3>
            <p>View your reviews</p>
          </div>
          <div @click=${() => this.navigateTo("/app/my-fav-spots")}>
            <img src="/icons/favorite-icon.png" alt="fav-spot-icon" />
            <h3>My Favorite Spots</h3>
            <p>View your saved favorite spots</p>
          </div>
        </div>
      </div>
    `;
  }

  navigateTo(path: string) {
    History.dispatch(this, "history/navigate", {
      href: path
    });
  }

  static styles = [
    resetCSS,
    css`
      .inline {
        margin-top: 10px;
        display: flex;
        gap: 5px;
        color: var(--color-text-primary);
        justify-content: center;
      }

      .profile-content {
        margin: 40px;
      }

      .profile-header {
        margin-top: 50px;
        color: var(--color-primary);
      }

      .profile-header h2 {
        font-size: 25px;
        font-weight: 600;
        color: var(--color-secondary);
        text-align: center;
      }

      .profile-tabs {
        margin-top: 40px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 20px;
      }

      .profile-tabs h3 {
        font-size: 15px;
        font-weight: 600;
        color: var(--color-text-secondary);
        background-color: inherit;
      }

      .profile-tabs p {
        margin-top: 15px;
        font-size: 14px;
        font-weight: 300;
        color: var(--color-text-secondary);
        <!-- background-color: inherit; -->
      }

      .profile-tabs img {
        width: 40px;
        margin-bottom: 10px;
        filter: var(--invert-state);
      }

      @media screen and (max-width: 988px) {
        .profile-tabs {
          grid-template-columns: 1fr;
        }
        <!-- .profile-content {
          margin: 0px;
        } -->
      }

      .profile-tabs div {
        box-shadow: var(--shadow-hover-small);
        padding: 20px;
        text-decoration: none;
        background-color: var(--color-background-secondary);
        border-radius: var(--border-radius);
      }

      .profile-tabs div:hover {
        cursor: pointer;
        box-shadow: var(--shadow-hover-large);
      }

      .link {
        text-decoration: underline;
      }

      .link:hover {
        cursor: pointer;
      }
    `,
  ];

  _authObserver = new Observer<Auth.Model>(
    this,
    "slostudyspots:auth"
  );
}