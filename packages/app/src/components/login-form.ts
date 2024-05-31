import { define, Events, Rest } from "@calpoly/mustang";
import { css, html, LitElement } from "lit";

define({ "restful-form": Rest.FormElement });

export class LoginFormElement extends LitElement {
  static styles = css`
    restful-form form {
      gap: var(--size-spacing-medium);
      grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
      margin-right: 70px;
    }
    restful-form form ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    restful-form form input:focus {
      background-color: var(--color-input-focus-bg);
    }
    restful-form form button[type="submit"] {
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
    }
    restful-form form button[type="submit"]:hover {
      background-color: var(--color-links);
    }
  `;

  render() {
    return html`
      <restful-form new src="/auth/login">
        <slot></slot>
      </restful-form>
    `;
  }

  get next() {
    let query = new URLSearchParams(document.location.search);
    return query.get("next");
  }

  constructor() {
    super();

    this.addEventListener(
      "mu-rest-form:created",
      (event: Event) => {
        const detail = (event as CustomEvent).detail;
        const { token } = detail.created;
        const redirect = this.next || "/";
        console.log("Login successful", detail, redirect);

        Events.relay(event, "auth:message", [
          "auth/signin",
          { token, redirect }
        ]);
      }
    );
  }
}