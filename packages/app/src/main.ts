import { Auth, Store, define } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model, init } from "./model";
import update from "./update";
import { HeaderElement } from "./components/studyspots-header";
import { ProfileViewElement } from "./views/profile-view";

define({
  "mu-auth": Auth.Provider,
  "mu-store": class AppStore extends Store.Provider<
    Model,
    Msg
  > {
    constructor() {
      super(update, init, "slostudyspots:auth");
    }
  },
  "studyspots-header": HeaderElement,
  "profile-view": ProfileViewElement,
});