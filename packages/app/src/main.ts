import {
  Auth,
  History,
  Store,
  Switch,
  define
} from "@calpoly/mustang";
import { html } from "lit";
import { Msg } from "./messages";
import { Model, init } from "./model";
import update from "./update";
import { HeaderElement } from "./components/nav-header";
import { ProfileViewElement } from "./views/profile-view";
import { LoginViewElement } from "./views/login-view";
import { RegisterViewElement } from "./views/register-view";
import { HomeViewElement } from "./views/home-view";
import { StudySpotViewElement } from "./views/study-spot-view";
import { UserReviewViewElement } from "./views/user-review-view";
import { AddSpotViewElement } from "./views/add-spot-view";
import { RankingsViewElement } from "./views/rankings-view";
import { AddReviewViewElement } from "./views/add-review-view";
import { AccountViewElement } from "./views/account-view";

const routes: Switch.Route[] = [
  {
    auth: "protected",
    path: "/app/profile/:id/edit",
    view: (params: Switch.Params) => html`
      <profile-view edit user-id=${params.id}></profile-view>
    `
  },
  {
    auth: "protected",
    path: "/app/profile/:id",
    view: (params: Switch.Params) => html`
      <profile-view user-id=${params.id}></profile-view>
    `
  },
  {
    auth: "protected",
    path: "/app/account",
    view: () => html`
      <account-view></account-view>
    `
  },
  {
    path: "/app/study-spot/:id",
    view: (params: Switch.Params) => html`
      <study-spot-view spot-id=${params.id}></study-spot-view>
    `
  },
  {
    auth: "protected",
    path: "/app/add-spot",
    view: () => html`
      <add-spot-view></add-spot-view>
    `
  },
  {
    auth: "protected",
    path: "/app/add-review/:id",
    view: (params: Switch.Params) => html`
      <add-review-view spot-id=${params.id}></add-review-view>
    `
  },
  {
    path: "/app/rankings",
    view: () => html`
      <rankings-view></rankings-view>
    `
  },
  {
    auth: "protected",
    path: "/app/my-reviews",
    view: () => html`
      <user-review-view></user-review-view>
    `
  },
  {
    path: "/app/login",
    view: () => html` <login-view></login-view> `,
  },
  {
    path: "/app/register",
    view: () => html` <register-view></register-view> `,
  },
  {
    path: "/app",
    view: () => html`
      <home-view></home-view>
    `
  },
  {
    path: "/",
    redirect: "/app"
  }
];

define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "mu-store": class AppStore extends Store.Provider<
    Model,
    Msg
  > {
    constructor() {
      super(update, init, "slostudyspots:auth");
    }
  },
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "slostudyspots:history", "slostudyspots:auth");
    }

    // Scroll to top when the view updates
    updated(changedProperties: Map<PropertyKey, unknown>) {
      super.updated(changedProperties);
      window.scrollTo(0, 0);
    }
  },
  "nav-header": HeaderElement,
  "profile-view": ProfileViewElement,
  "login-view": LoginViewElement,
  "register-view": RegisterViewElement,
  "home-view": HomeViewElement,
  "study-spot-view": StudySpotViewElement,
  "add-spot-view": AddSpotViewElement,
  "rankings-view": RankingsViewElement,
  "add-review-view": AddReviewViewElement,
  "user-review-view": UserReviewViewElement,
  "account-view": AccountViewElement
});