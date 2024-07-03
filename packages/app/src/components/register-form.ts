import { define, Events, Rest } from "@calpoly/mustang";
import { html, LitElement } from "lit";

define({ "restful-form": Rest.FormElement });

export class RegisterFormElement extends LitElement {
  render() {
    return html`
      <restful-form new src="/auth/register">
        <slot></slot>
        <slot slot="submit" name="submit" @click=${this._handleSubmit}></slot>
      </restful-form>
    `;
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

  get next() {
    let query = new URLSearchParams(document.location.search);
    return query.get("next");
  }

  constructor() {
    super();

    this.addEventListener("mu-rest-form:created", (event: Event) => {
      const detail = (event as CustomEvent).detail;
      const { token } = detail.created;
      const redirect = this.next || "/";
      console.log("Signup successful", detail, redirect);

      Events.relay(event, "auth:message", ["auth/signin", { token, redirect }]);
    });
  }
}