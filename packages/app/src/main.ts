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
import { HeaderElement } from "./components/study-spots-header";
import { ProfileViewElement } from "./views/profile-view";
import { LoginViewElement } from "./views/login-view";
import { RegisterViewElement } from "./views/register-view";

const routes = [
  // {
  //   path: "/app/study-spots/:id",
  //   view: (params: Switch.Params) => html`
  //     <study-spots-view spot-id=${params.id}></study-spots-view>
  //   `
  // },
  {
    path: "/app/profile/:id/edit",
    view: (params: Switch.Params) => html`
      <profile-view edit user-id=${params.id}></profile-view>
    `
  },
  {
    path: "/app/profile/:id",
    view: (params: Switch.Params) => html`
      <profile-view user-id=${params.id}></profile-view>
    `
  },
  {
    path: "/app",
    view: () => html`
      <landing-view></landing-view>
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
      super(routes, "slostudyspots:history");
    }
  },
  "study-spots-header": HeaderElement,
  "profile-view": ProfileViewElement,
  "login-view": LoginViewElement,
  "register-view": RegisterViewElement,
});