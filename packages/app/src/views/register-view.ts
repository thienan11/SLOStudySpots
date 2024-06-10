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
        <h2>Signup as a new User</h2>
        <main class="card">
          <p>
            <a href="/app">← Back to home</a>
          </p>
          <register-form>
            <label>
              <span>Username:</span>
              <input name="username" autocomplete="off" />
            </label>
            <label>
              <span>Password:</span>
              <input type="password" name="password" />
            </label>
          </register-form>
          <p>
            Already signed up? Then you can
            <a href="/app/login">log in</a> instead.
          </p>
          <img src="/images/person-studying.svg" alt="Person Studying">
        </main>
      </div>
    `;
  }

  static styles = [
    resetStyles,
    css`
      :host {
        --color-background-secondary: #f9f9f9;
        --color-links: #0066cc;
        --color-primary: #333;
        --color-secondary: #555;
        --color-text-primary: #000;
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
      }

      .login-register-container a {
        color: var(--color-links);
      }

      .login-register-container h2 {
        margin-bottom: var(--space-medium);
        font-size: var(--font-size-large);
        color: var(--color-primary);
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
    `
  ];
}