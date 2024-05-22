import { LitElement, css, html } from "lit";
import { DropdownElement, define, Events} from "@calpoly/mustang";

export class HeaderElement extends LitElement {
  static uses = define({
    "drop-down": DropdownElement
  });

  render() {
    return html`
      <header class="navbar">
        <div class="navbar-content">
          <a class="logo" href="index.html">
            <img src="icons/desk-lamp.svg" alt="SLOStudySpots Logo" />
            <h1>SLOStudySpots</h1>
          </a>

          <div class="search-box">
            <form>
              <input
                type="search"
                placeholder="Search for study spots..."
              />
            </form>
          </div>

          <nav class="right-navbar-links">
            <drop-down>
              <ul>
                <li>
                  <a class="navbar-menu" href="profile.html">
                    <!-- <img src="icons/avatar.svg" alt="profile-icon" /> -->
                    Profile
                  </a>
                </li>
                <li>
                  <a class="group-icon" href="ranking.html">
                    <!-- <img src="icons/ranking.svg" alt="ranking-icon" /> -->
                    Community Rankings
                  </a>
                </li>
                <li>
                  <a class="group-icon" href="create.html">
                    <!-- <img src="icons/create.svg" alt="create-icon" /> -->
                    Add a Spot
                  </a>
                </li>
                <li>
                <label @change=${toggleDarkMode}>
                  <input type="checkbox" autocomplete="off" />
                  Dark mode
                </label>
                </li>
              </ul>
            </drop-down> 
          </nav>
        </div>
      </header>
    `;
  }

  static styles = css`
    header.navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: var(--color-primary);
      padding: var(--space-small) var(--space-regular);
      position: sticky;
      top: 0; /* Ensures it sticks at the very top */
      z-index: 1000; /* Ensures the header stays on top of other content */
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
      margin-right: var(--space-small); /* Space between the logo image and title */
    }
    
    .logo h1 {
      font-size: var(--font-size-large);
      color: var(--color-background-primary);
      margin: 0;
    }
    
    .search-box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%); /* Offset the search box to exactly center it */
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
    
    .right-navbar-links ul {
      /* list-style: none;
      display: flex;
      align-items: center;
      margin: 0;
      padding: 0; */
    
      list-style: none;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    
    .right-navbar-links li {
      /* margin-left: var(--space-regular); */
      padding: 10px;
    }
    
    .right-navbar-links a {
      color: var(--color-text-secondary);
      /* font-family: var(--font-family-display); */
      display: flex;
      align-items: center;
      text-decoration: none;
    }
    
    .right-navbar-links a:hover {
      color: var(--color-links);
    }
    
    .right-navbar-links img {
      height: 27px;
    }
  `;
  
}

type Checkbox = HTMLInputElement & { checked: boolean };

function toggleDarkMode(ev: InputEvent) {
  const target = ev.target as Checkbox;
  const checked = target.checked;

  // Events.relay(ev, "dark-mode", { checked });

  document.body.classList.toggle('dark-mode', checked);
}