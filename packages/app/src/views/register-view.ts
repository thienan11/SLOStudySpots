import { html, LitElement } from "lit";
import { define, Auth } from "@calpoly/mustang";
import { RegisterFormElement } from "../components/register-form";

define({
  "mu-auth": Auth.Provider,
  "register-form": RegisterFormElement
});

export class RegisterViewElement extends LitElement {
  render() {
    return html`
      <div class="center">
        <div class="container">
          <h2>Register</h2>
          <main class="card">
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
          </main>
          <p>
            Or did you want to
            <a href="/app/login">Login as a returning user</a>
            ?
          </p>
        </div>
      </div>`;
  }
}