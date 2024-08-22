import { html, LitElement, css} from "lit";
import { define, Auth } from "@calpoly/mustang";
import { RegisterFormElement } from "../components/register-form";
import resetStyles from "../css/reset";

define({
  "mu-auth": Auth.Provider,
  "register-form": RegisterFormElement
});

export class RegisterViewElement extends LitElement {

  render() {
    return html`
      <div class="login-register-container">
        <p>
          <a href="/app">← Back to home</a>
        </p>
        <h1>Sign Up</h1>
        <main class="card">
          <register-form>
            <label>
              <input name="username" autocomplete="off" placeholder="Username"/>
            </label>
            <label>
              <input type="password" name="password" placeholder="Password"/>
            </label>
            <button slot="submit" id="submit-btn" type="submit">Register</button>
          </register-form>
          <p>
            Already signed up? Then you can
            <a href="/app/login">log in</a> instead
          </p>
          <img src="/images/login-register-img.svg" alt="People Studying">
        </main>
      </div>
    `;
  }

  static styles = [
    resetStyles,
    css`
      :host {
        --font-size-large: 1.5rem;
        --font-size-body: 1rem;
        --space-regular: 1rem;
        --space-medium: 1.5rem;
        --space-large: 2rem;
        --space-small: 0.5rem;
        --border-radius: 4px;
      }

      .login-register-container {
        background-color: var(--color-background-secondary);
        padding: var(--space-regular);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        height: 100vh;
        width: 100vw;
        position: fixed; /* Fixed position to cover the whole screen including any sticky headers */
        top: 0; /* Align to the top of the viewport */
        left: 0; /* Align to the left of the viewport */
        z-index: 1000; /* Ensure it sits above other content */
        box-sizing: border-box; /* Include padding and border in the element's total width and height */
        padding-top: 45px;
      }

      .login-register-container a {
        color: var(--color-links);
        text-decoration: none;
      }

      .login-register-container a:hover {
        text-decoration: underline;
      }

      .login-register-container h1 {
        color: var(--color-text-primary);
      }

      .login-register-container p {
        margin-bottom: var(--space-medium);
        /* align-self: flex-start; */
      }

      .login-register-container .card {
        background-color: var(--color-background-secondary);
        padding: var(--space-large);
        max-width: 500px;
        width: 100%;
        margin-top: var(--space-medium);
      }

      .login-register-container label {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        font-size: var(--font-size-body);
        color: var(--color-text-primary);
        margin-bottom: var(--space-medium);
      }

      .login-register-container input {
        width: 100%;
        padding: var(--space-small);
        margin-top: var(--space-small);
        border: 1px solid var(--color-primary);
        border-radius: var(--border-radius);
        font-size: var(--font-size-body);
      }

      .login-register-container input:focus {
        border-color: var(--color-secondary);
        outline: none;
      }

      .login-register-container button[slot="submit"] {
        margin-top: 20px;
        padding: 10px 20px;
        background-color: var(--color-primary);
        border: none;
        color: white;
        border-radius: 4px;
        cursor: pointer;
        margin-bottom: 16px;
        width: 100%;
      }

      .login-register-container button[slot="submit"]:hover {
        background-color: var(--color-links);
      }

      .login-register-container img {
        max-width: 100%;
        height: auto;
      }

      @media (max-width: 600px) {
        .login-register-container {
          padding: var(--space-small);
          padding-top: 20px; /* Adjust padding-top for smaller screens */
        }

        .login-register-container .card {
          padding: var(--space-medium);
        }

        .login-register-container input {
          font-size: var(--font-size-body); /* Ensure font size is readable on small screens */
        }

        .login-register-container button[slot="submit"] {
          padding: 8px 16px; /* Adjust button padding for better fit on mobile */
        }
      }
    `
  ];
}