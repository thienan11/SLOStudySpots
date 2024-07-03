import { define, Events, Rest, History } from "@calpoly/mustang";
import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";

define({ "restful-form": Rest.FormElement });

export class LoginFormElement extends LitElement {
  @property()
  message = "";

  render() {
    const init = { username: "", password: "" };
    return html`
      <restful-form
        new
        .init=${init}
        src="/auth/login"
        @mu-rest-form:created=${this._handleSuccess}
        @mu-rest-form:error=${this._handleError}>
        <slot></slot>
        <slot slot="submit" name="submit" @click=${this._handleSubmit}></slot>
      </restful-form>
      <p class="error">
        ${this.message ? "Invalid Username or Password" : ""}
      </p>
      <pre>${this.message}</pre>
    `;
  }

  static styles = css`
    .error {
      color: firebrick;
    }
  `;

  get next() {
    let query = new URLSearchParams(document.location.search);
    return query.get("next");
  }

  firstUpdated() {
    this.injectStylesIntoRestfulForm();
  }

  injectStylesIntoRestfulForm() {
    const restfulForm = this.shadowRoot?.querySelector('restful-form');
    if (restfulForm && restfulForm.shadowRoot) {
      const style = document.createElement('style');
      style.textContent = `
        form {
          display: block; /* Override the grid display here */
        }
      `;
      restfulForm.shadowRoot.appendChild(style);
    }
  }

  _handleSubmit(event: Event) {
    event.preventDefault();
    const restfulForm = this.shadowRoot?.querySelector('restful-form') as Rest.FormElement;
    restfulForm?.form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  }

  _handleSuccess(event: CustomEvent) {
    const detail = event.detail;
    const { token } = detail.created;
    const redirect = this.next || "/";
    console.log("Login successful", detail, redirect);

    Events.relay(event, "auth:message", [
      "auth/signin",
      { token, redirect }
    ]);
    // window.location.pathname = "/app";
    History.dispatch(this, "history/navigate", {
      href: `/app`
    });
  }

  _handleError(event: CustomEvent) {
    const { error } = event.detail as { error: Error };
    console.log("Login failed", event.detail);
    this.message = error.toString();
  }
}