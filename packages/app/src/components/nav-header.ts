import { LitElement, css, html } from "lit";
import { define, Events, Auth, Observer} from "@calpoly/mustang";
import { DropdownElement } from "./drop-down";
import { state } from "lit/decorators.js";
import resetCSS from "../css/reset";
import "../dark-mode";

export class HeaderElement extends LitElement {
  static uses = define({
    "drop-down": DropdownElement,
  });

  @state()
  username = "anonymous";

  @state()
  isDarkMode = localStorage.getItem("dark-mode") === "true";

  // @state()
  // user: Auth.Model["user"] | null = null;

  // constructor() {
  //   super();
  //   this._authObserver = new Observer<Auth.Model>(this, "slostudyspots:auth");
  // }

  // connectedCallback() {
  //   super.connectedCallback();
  //   this._authObserver.observe(({ user }) => {
  //     if (user && user.username !== this.username) {
  //       this.username = user.username;
  //       this.user = user;
  //     } else {
  //       this.user = null;
  //     }
  //   });
  // }
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

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem("dark-mode", this.isDarkMode.toString());
    document.body.classList.toggle("dark-mode", this.isDarkMode);
  }

  render() {
    return html`
      <header class="navbar">
        <div class="navbar-content">
          <a class="logo" href="/app">
            <img src="/icons/book.png" alt="SLOStudySpots Logo" />
            <h1>SLOStudySpots</h1>
          </a>

          <!--
          <div class="search-box">
            <form>
              <input type="search" placeholder="Search for study spots..." />
            </form>
          </div>
          -->

          <nav class="right-navbar-links">
            <img
              @click=${this.toggleDarkMode}
              src=${this.isDarkMode ? "/icons/dark-mode.svg" : "/icons/light-mode.svg"}
              alt="Dark mode"
              class="light-dark-icon"
            />
            ${this.username === "anonymous"
              ? html`
                 <!-- <a class="navbar-button" href="/app/login">Login</a>
                  <a class="navbar-button signup-button" href="/app/register">Sign Up</a>
                -->
                <drop-down>
                  <ul>
                    <li>
                      <a href="/app/login">
                        Login
                      </a>
                    </li>
                    <li>
                      <a href="/app/register">
                        Sign Up
                      </a>
                    </li>
                    <li>
                      <a href="/app/rankings">
                        Community Rankings
                      </a>
                    </li>
                  </ul>
                </drop-down>
                `
              : html`
                <drop-down>
                  <ul>
                    <li>
                      <a href="/app/account">
                        <img src="/icons/about-me.svg" alt="about-me-icon" class="navbar-icon"/>
                        About Me
                      </a>
                    </li>
                    <li>
                      <a href="/app/rankings">
                        <img src="/icons/ranking.svg" alt="ranking-icon" class="navbar-icon"/>
                        Community Rankings
                      </a>
                    </li>
                    <li>
                      <a href="/app/add-spot">
                        <img src="/icons/add-spot.svg" alt="add-spot-icon" class="navbar-icon"/>
                        Add a Spot
                      </a>
                    </li>
                    <li>
                      <a href="#" @click=${signOutUser}>
                        <img src="/icons/signout.svg" alt="signout-icon" class="navbar-icon"/>
                        Sign out
                      </a>
                    </li>
                  </ul>
                </drop-down>
              `}
          </nav>
        </div>
      </header>
    `;
  }
  
  static styles = [
    resetCSS,
    css`
    header.navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: var(--color-primary);
      /* background-color: var(--color-primary-transparent); */
      /* backdrop-filter: blur(10px); */
      padding: var(--space-small) var(--space-regular);
      position: sticky;
      top: 0; /* Ensures it sticks at the very top */
      z-index: 1000; /* Ensures the header stays on top of other content */
      position: fixed;
      width: 100%;
      /* width: 100vw; */
    }

    .navbar-content {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: space-between;
    }

    .logo {
      display: flex;
      align-items: center;
      text-decoration: none;
    }

    .logo img {
      height: 40px;
      margin-right: var(
        --space-small
      ); /* Space between the logo image and title */
    }

    .logo h1 {
      font-size: var(--font-size-large);
      /* color: var(--color-background-secondary); */
      color: #fff;
      margin: 0;
    }

    .search-box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(
        -50%,
        -50%
      ); /* Offset the search box to exactly center it */
      width: 100%;
      max-width: 470px;
      display: flex;
      justify-content: center;
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

    .right-navbar-links {
      display: flex;
      align-items: center;
    }

    .right-navbar-links .navbar-button {
      padding: 10px 15px;
      color: var(--color-background-primary);
      background-color: var(--color-text-secondary);
      border: none;
      border-radius: var(--border-radius);
      text-decoration: none;
      font-family: inherit;
      font-size: 1rem;
      cursor: pointer;
      margin-left: var(--space-small);
      transition: background-color 0.3s;
    }

    .right-navbar-links .navbar-button:hover {
      background-color: var(--color-secondary);
      color: white;
    }

    .right-navbar-links .signup-button {
      margin-left: var(--space-regular);
      background-color: var(--color-text-secondary);
    }

    .right-navbar-links .signup-button:hover {
      background-color: var(--color-secondary);
    }

    .right-navbar-links ul {
      /* list-style: none;
      display: flex;
      align-items: center;
      margin: 0;
      padding: 0; */

      list-style: none;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 0;
      margin: 0;
    }

    .right-navbar-links li {
      /* margin-left: var(--space-regular); */
      width: 100%; /* Full width */
    }

    .right-navbar-links li:hover {
      background-color: rgba(0, 0, 0, 0.1); /* Light gray background on hover */
      border-radius: var(--border-radius);
    }

    .right-navbar-links li a {
      color: var(--color-text-secondary);
      /* font-family: var(--font-family-display); */
      display: flex;
      align-items: center;
      text-decoration: none;
      padding: 10px;
      width: 100%; /* Ensure <a> takes full width of <li> */
      height: 100%; /* Ensure <a> takes full height of <li> */
    }

    /* .right-navbar-links a:hover {
      color: var(--color-links);
    } */

    .right-navbar-links img {
      height: 27px;
    }

    .light-dark-switch {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      font-size: 16px;
      color: var(--color-text-secondary);
    }

    .light-dark-switch input[type="checkbox"] {
      margin-right: 8px;
    }

    .light-dark-switch:hover {
      color: var(--color-links);
    }

    /* .dark-light-container {
      display: flex;
      align-items: center;
      padding: 10px;
    } */

    .light-dark-icon {
      padding-right: 15px;
      filter: var(--invert-black-to-white);
    }

    img:hover {
      cursor: pointer;
    }

    .navbar-icon {
      padding-right: 10px;
      filter: var(--invert-black-to-white);
    }
  `
  ];

  // _authObserver: Observer<Auth.Model>;
  _authObserver = new Observer<Auth.Model>(
    this,
    "slostudyspots:auth"
  );
}

// type Checkbox = HTMLInputElement & { checked: boolean };

// function toggleDarkMode(ev: InputEvent) {
//   const target = ev.target as Checkbox;
//   const checked = target.checked;

//   Events.relay(ev, "dark-mode", { checked });
//   document.body.classList.toggle("dark-mode", checked);
// }

// function toggleDarkMode(ev: InputEvent) {
//   Events.relay(ev, "dark-mode", {
//     checked: undefined,
//   });
// }

function signOutUser(ev: Event) {
  Events.relay(ev, "auth:message", ["auth/signout"]);
}