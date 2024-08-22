(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(r){if(r.ep)return;r.ep=!0;const o=e(r);fetch(r.href,o)}})();var ur;class At extends Error{}At.prototype.name="InvalidTokenError";function Li(s){return decodeURIComponent(atob(s).replace(/(.)/g,(t,e)=>{let i=e.charCodeAt(0).toString(16).toUpperCase();return i.length<2&&(i="0"+i),"%"+i}))}function zi(s){let t=s.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Li(t)}catch{return atob(t)}}function Fr(s,t){if(typeof s!="string")throw new At("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,i=s.split(".")[e];if(typeof i!="string")throw new At(`Invalid token specified: missing part #${e+1}`);let r;try{r=zi(i)}catch(o){throw new At(`Invalid token specified: invalid base64 for part #${e+1} (${o.message})`)}try{return JSON.parse(r)}catch(o){throw new At(`Invalid token specified: invalid json for part #${e+1} (${o.message})`)}}const ji="mu:context",Ce=`${ji}:change`;class Mi{constructor(t,e){this._proxy=Ni(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class Ne extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Mi(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Ce,t),t}detach(t){this.removeEventListener(Ce,t)}}function Ni(s,t){return new Proxy(s,{get:(i,r,o)=>{if(r==="then")return;const a=Reflect.get(i,r,o);return console.log(`Context['${r}'] => `,a),a},set:(i,r,o,a)=>{const n=s[r];console.log(`Context['${r.toString()}'] <= `,o);const l=Reflect.set(i,r,o,a);if(l){let g=new CustomEvent(Ce,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(g,{property:r,oldValue:n,value:o}),t.dispatchEvent(g)}else console.log(`Context['${r}] was not set to ${o}`);return l}})}function Fi(s,t){const e=Dr(t,s);return new Promise((i,r)=>{if(e){const o=e.localName;customElements.whenDefined(o).then(()=>i(e))}else r({context:t,reason:`No provider for this context "${t}:`})})}function Dr(s,t){const e=`[provides="${s}"]`;if(!t||t===document.getRootNode())return;const i=t.closest(e);if(i)return i;const r=t.getRootNode();if(r instanceof ShadowRoot)return Dr(s,r.host)}class Di extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function qr(s="mu:message"){return(t,...e)=>t.dispatchEvent(new Di(e,s))}class Fe{constructor(t,e,i="service:message",r=!0){this._pending=[],this._context=e,this._update=t,this._eventType=i,this._running=r}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const i=e.detail;this.consume(i)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function qi(s){return t=>({...t,...s})}const Oe="mu:auth:jwt",Hr=class Br extends Fe{constructor(t,e){super((i,r)=>this.update(i,r),t,Br.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:i,redirect:r}=t[1];return e(Bi(i)),Se(r);case"auth/signout":return e(Qi()),Se(this._redirectForLogin);case"auth/redirect":return Se(this._redirectForLogin,{next:window.location.href});default:const o=t[0];throw new Error(`Unhandled Auth message "${o}"`)}}};Hr.EVENT_TYPE="auth:message";let Qr=Hr;const Wr=qr(Qr.EVENT_TYPE);function Se(s,t={}){if(!s)return;const e=window.location.href,i=new URL(s,e);return Object.entries(t).forEach(([r,o])=>i.searchParams.set(r,o)),()=>{console.log("Redirecting to ",s),window.location.assign(i)}}class Hi extends Ne{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){super({user:ut.authenticateFromLocalStorage()})}connectedCallback(){new Qr(this.context,this.redirect).attach(this)}}class ht{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(Oe),t}}class ut extends ht{constructor(t){super();const e=Fr(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new ut(t);return localStorage.setItem(Oe,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(Oe);return t?ut.authenticate(t):new ht}}function Bi(s){return qi({user:ut.authenticate(s),token:s})}function Qi(){return s=>{const t=s.user;return{user:t&&t.authenticated?ht.deauthenticate(t):t,token:""}}}function Wi(s){return s.authenticated?{Authorization:`Bearer ${s.token||"NO_TOKEN"}`}:{}}function Gi(s){return s.authenticated?Fr(s.token||""):{}}const M=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:ut,Provider:Hi,User:ht,dispatch:Wr,headers:Wi,payload:Gi},Symbol.toStringTag,{value:"Module"}));function Yt(s,t,e){const i=s.target,r=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${s.type}:`,r),i.dispatchEvent(r),s.stopPropagation()}function Te(s,t="*"){return s.composedPath().find(i=>{const r=i;return r.tagName&&r.matches(t)})}const De=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:Te,relay:Yt},Symbol.toStringTag,{value:"Module"})),Yi=new DOMParser;function Nt(s,...t){const e=s.map((a,n)=>n?[t[n-1],a]:[a]).flat().join(""),i=Yi.parseFromString(e,"text/html"),r=i.head.childElementCount?i.head.children:i.body.children,o=new DocumentFragment;return o.replaceChildren(...r),o}function pe(s){const t=s.firstElementChild,e=t&&t.tagName==="TEMPLATE"?t:void 0;return{attach:i};function i(r,o={mode:"open"}){const a=r.attachShadow(o);return e&&a.appendChild(e.content.cloneNode(!0)),a}}const Gr=class Yr extends HTMLElement{constructor(){super(),this._state={},pe(Yr.template).attach(this),this.addEventListener("change",t=>{const e=t.target;if(e){const i=e.name,r=e.value;i&&(this._state[i]=r)}}),this.form&&this.form.addEventListener("submit",t=>{t.preventDefault(),Yt(t,"mu-form:submit",this._state)})}set init(t){this._state=t||{},Ki(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}};Gr.template=Nt`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;let Ji=Gr;function Ki(s,t){const e=Object.entries(s);for(const[i,r]of e){const o=t.querySelector(`[name="${i}"]`);if(o){const a=o;switch(a.type){case"checkbox":const n=a;n.checked=!!r;break;case"date":a.value=r.toISOString().substr(0,10);break;default:a.value=r;break}}}return s}const Jr=Object.freeze(Object.defineProperty({__proto__:null,Element:Ji},Symbol.toStringTag,{value:"Module"})),Kr=class Zr extends Fe{constructor(t){super((e,i)=>this.update(e,i),t,Zr.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:i,state:r}=t[1];e(Xi(i,r));break}case"history/redirect":{const{href:i,state:r}=t[1];e(Vi(i,r));break}}}};Kr.EVENT_TYPE="history:message";let qe=Kr;class gr extends Ne{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=Zi(t);if(e){const i=new URL(e.href);i.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),He(e,"history/navigate",{href:i.pathname+i.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new qe(this.context).attach(this)}}function Zi(s){const t=s.currentTarget,e=i=>i.tagName=="A"&&i.href;if(s.button===0)if(s.composed){const r=s.composedPath().find(e);return r||void 0}else{for(let i=s.target;i;i===t?null:i.parentElement)if(e(i))return i;return}}function Xi(s,t={}){return history.pushState(t,"",s),()=>({location:document.location,state:history.state})}function Vi(s,t={}){return history.replaceState(t,"",s),()=>({location:document.location,state:history.state})}const He=qr(qe.EVENT_TYPE),it=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:gr,Provider:gr,Service:qe,dispatch:He},Symbol.toStringTag,{value:"Module"}));class T{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,i)=>{if(this._provider){const r=new fr(this._provider,t);this._effects.push(r),e(r)}else Fi(this._target,this._contextLabel).then(r=>{const o=new fr(r,t);this._provider=r,this._effects.push(o),r.attach(a=>this._handleChange(a)),e(o)}).catch(r=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,r))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),this._effects.forEach(e=>e.runEffect())}}class fr{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const Be=class Xr extends HTMLElement{constructor(){super(),this._state={},this._user=new ht,this._authObserver=new T(this,"blazing:auth"),pe(Xr.template).attach(this),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",i=this.isNew?"created":"updated",r=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;es(r,this._state,e,this.authorization).then(o=>$t(o,this)).then(o=>{const a=`mu-rest-form:${i}`,n=new CustomEvent(a,{bubbles:!0,composed:!0,detail:{method:e,[i]:o,url:r}});this.dispatchEvent(n)}).catch(o=>{const a="mu-rest-form:error",n=new CustomEvent(a,{bubbles:!0,composed:!0,detail:{method:e,error:o,url:r,request:this._state}});this.dispatchEvent(n)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const i=e.name,r=e.value;i&&(this._state[i]=r)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},$t(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Ue(this.src,this.authorization).then(e=>{this._state=e,$t(e,this)}))})}attributeChangedCallback(t,e,i){switch(t){case"src":this.src&&i&&i!==e&&!this.isNew&&Ue(this.src,this.authorization).then(r=>{this._state=r,$t(r,this)});break;case"new":i&&(this._state={},$t({},this));break}}};Be.observedAttributes=["src","new","action"];Be.template=Nt`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;let ts=Be;function Ue(s,t){return fetch(s,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${s}:`,e))}function $t(s,t){const e=Object.entries(s);for(const[i,r]of e){const o=t.querySelector(`[name="${i}"]`);if(o){const a=o;switch(a.type){case"checkbox":const n=a;n.checked=!!r;break;default:a.value=r;break}}}return s}function es(s,t,e="PUT",i={}){return fetch(s,{method:e,headers:{"Content-Type":"application/json",...i},body:JSON.stringify(t)}).then(r=>{if(r.status!=200&&r.status!=201)throw`Form submission failed: Status ${r.status}`;return r.json()})}const Vr=Object.freeze(Object.defineProperty({__proto__:null,FormElement:ts,fetchData:Ue},Symbol.toStringTag,{value:"Module"})),ti=class ei extends Fe{constructor(t,e){super(e,t,ei.EVENT_TYPE,!1)}};ti.EVENT_TYPE="mu:message";let ri=ti;class rs extends Ne{constructor(t,e,i){super(e),this._user=new ht,this._updateFn=t,this._authObserver=new T(this,i)}connectedCallback(){const t=new ri(this.context,(e,i)=>this._updateFn(e,i,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const is=Object.freeze(Object.defineProperty({__proto__:null,Provider:rs,Service:ri},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Wt=globalThis,Qe=Wt.ShadowRoot&&(Wt.ShadyCSS===void 0||Wt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,We=Symbol(),mr=new WeakMap;let ii=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==We)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Qe&&t===void 0){const i=e!==void 0&&e.length===1;i&&(t=mr.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&mr.set(e,t))}return t}toString(){return this.cssText}};const ss=s=>new ii(typeof s=="string"?s:s+"",void 0,We),os=(s,...t)=>{const e=s.length===1?s[0]:t.reduce((i,r,o)=>i+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+s[o+1],s[0]);return new ii(e,s,We)},as=(s,t)=>{if(Qe)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const i=document.createElement("style"),r=Wt.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=e.cssText,s.appendChild(i)}},vr=Qe?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return ss(e)})(s):s;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ns,defineProperty:ls,getOwnPropertyDescriptor:cs,getOwnPropertyNames:ds,getOwnPropertySymbols:ps,getPrototypeOf:hs}=Object,gt=globalThis,yr=gt.trustedTypes,us=yr?yr.emptyScript:"",br=gt.reactiveElementPolyfillSupport,Et=(s,t)=>s,Jt={toAttribute(s,t){switch(t){case Boolean:s=s?us:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},Ge=(s,t)=>!ns(s,t),wr={attribute:!0,type:String,converter:Jt,reflect:!1,hasChanged:Ge};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),gt.litPropertyMetadata??(gt.litPropertyMetadata=new WeakMap);let ct=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=wr){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(t,i,e);r!==void 0&&ls(this.prototype,t,r)}}static getPropertyDescriptor(t,e,i){const{get:r,set:o}=cs(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get(){return r==null?void 0:r.call(this)},set(a){const n=r==null?void 0:r.call(this);o.call(this,a),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??wr}static _$Ei(){if(this.hasOwnProperty(Et("elementProperties")))return;const t=hs(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Et("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Et("properties"))){const e=this.properties,i=[...ds(e),...ps(e)];for(const r of i)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[i,r]of e)this.elementProperties.set(i,r)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const r=this._$Eu(e,i);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const r of i)e.unshift(vr(r))}else t!==void 0&&e.push(vr(t));return e}static _$Eu(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return as(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostConnected)==null?void 0:i.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostDisconnected)==null?void 0:i.call(e)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EC(t,e){var i;const r=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,r);if(o!==void 0&&r.reflect===!0){const a=(((i=r.converter)==null?void 0:i.toAttribute)!==void 0?r.converter:Jt).toAttribute(e,r.type);this._$Em=t,a==null?this.removeAttribute(o):this.setAttribute(o,a),this._$Em=null}}_$AK(t,e){var i;const r=this.constructor,o=r._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const a=r.getPropertyOptions(o),n=typeof a.converter=="function"?{fromAttribute:a.converter}:((i=a.converter)==null?void 0:i.fromAttribute)!==void 0?a.converter:Jt;this._$Em=o,this[o]=n.fromAttribute(e,a.type),this._$Em=null}}requestUpdate(t,e,i){if(t!==void 0){if(i??(i=this.constructor.getPropertyOptions(t)),!(i.hasChanged??Ge)(this[t],e))return;this.P(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,i){this._$AL.has(t)||this._$AL.set(t,e),i.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,a]of this._$Ep)this[o]=a;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[o,a]of r)a.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],a)}let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),(t=this._$EO)==null||t.forEach(r=>{var o;return(o=r.hostUpdate)==null?void 0:o.call(r)}),this.update(i)):this._$EU()}catch(r){throw e=!1,this._$EU(),r}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(i=>{var r;return(r=i.hostUpdated)==null?void 0:r.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};ct.elementStyles=[],ct.shadowRootOptions={mode:"open"},ct[Et("elementProperties")]=new Map,ct[Et("finalized")]=new Map,br==null||br({ReactiveElement:ct}),(gt.reactiveElementVersions??(gt.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Kt=globalThis,Zt=Kt.trustedTypes,xr=Zt?Zt.createPolicy("lit-html",{createHTML:s=>s}):void 0,si="$lit$",F=`lit$${Math.random().toFixed(9).slice(2)}$`,oi="?"+F,gs=`<${oi}>`,K=document,Ct=()=>K.createComment(""),Ot=s=>s===null||typeof s!="object"&&typeof s!="function",ai=Array.isArray,fs=s=>ai(s)||typeof(s==null?void 0:s[Symbol.iterator])=="function",ke=`[ 	
\f\r]`,_t=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,$r=/-->/g,_r=/>/g,W=RegExp(`>|${ke}(?:([^\\s"'>=/]+)(${ke}*=${ke}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Sr=/'/g,kr=/"/g,ni=/^(?:script|style|textarea|title)$/i,ms=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),St=ms(1),ft=Symbol.for("lit-noChange"),k=Symbol.for("lit-nothing"),Ar=new WeakMap,Y=K.createTreeWalker(K,129);function li(s,t){if(!Array.isArray(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return xr!==void 0?xr.createHTML(t):t}const vs=(s,t)=>{const e=s.length-1,i=[];let r,o=t===2?"<svg>":"",a=_t;for(let n=0;n<e;n++){const l=s[n];let g,f,h=-1,c=0;for(;c<l.length&&(a.lastIndex=c,f=a.exec(l),f!==null);)c=a.lastIndex,a===_t?f[1]==="!--"?a=$r:f[1]!==void 0?a=_r:f[2]!==void 0?(ni.test(f[2])&&(r=RegExp("</"+f[2],"g")),a=W):f[3]!==void 0&&(a=W):a===W?f[0]===">"?(a=r??_t,h=-1):f[1]===void 0?h=-2:(h=a.lastIndex-f[2].length,g=f[1],a=f[3]===void 0?W:f[3]==='"'?kr:Sr):a===kr||a===Sr?a=W:a===$r||a===_r?a=_t:(a=W,r=void 0);const p=a===W&&s[n+1].startsWith("/>")?" ":"";o+=a===_t?l+gs:h>=0?(i.push(g),l.slice(0,h)+si+l.slice(h)+F+p):l+F+(h===-2?n:p)}return[li(s,o+(s[e]||"<?>")+(t===2?"</svg>":"")),i]};let Ie=class ci{constructor({strings:t,_$litType$:e},i){let r;this.parts=[];let o=0,a=0;const n=t.length-1,l=this.parts,[g,f]=vs(t,e);if(this.el=ci.createElement(g,i),Y.currentNode=this.el.content,e===2){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(r=Y.nextNode())!==null&&l.length<n;){if(r.nodeType===1){if(r.hasAttributes())for(const h of r.getAttributeNames())if(h.endsWith(si)){const c=f[a++],p=r.getAttribute(h).split(F),u=/([.?@])?(.*)/.exec(c);l.push({type:1,index:o,name:u[2],strings:p,ctor:u[1]==="."?bs:u[1]==="?"?ws:u[1]==="@"?xs:he}),r.removeAttribute(h)}else h.startsWith(F)&&(l.push({type:6,index:o}),r.removeAttribute(h));if(ni.test(r.tagName)){const h=r.textContent.split(F),c=h.length-1;if(c>0){r.textContent=Zt?Zt.emptyScript:"";for(let p=0;p<c;p++)r.append(h[p],Ct()),Y.nextNode(),l.push({type:2,index:++o});r.append(h[c],Ct())}}}else if(r.nodeType===8)if(r.data===oi)l.push({type:2,index:o});else{let h=-1;for(;(h=r.data.indexOf(F,h+1))!==-1;)l.push({type:7,index:o}),h+=F.length-1}o++}}static createElement(t,e){const i=K.createElement("template");return i.innerHTML=t,i}};function mt(s,t,e=s,i){var r,o;if(t===ft)return t;let a=i!==void 0?(r=e._$Co)==null?void 0:r[i]:e._$Cl;const n=Ot(t)?void 0:t._$litDirective$;return(a==null?void 0:a.constructor)!==n&&((o=a==null?void 0:a._$AO)==null||o.call(a,!1),n===void 0?a=void 0:(a=new n(s),a._$AT(s,e,i)),i!==void 0?(e._$Co??(e._$Co=[]))[i]=a:e._$Cl=a),a!==void 0&&(t=mt(s,a._$AS(s,t.values),a,i)),t}let ys=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,r=((t==null?void 0:t.creationScope)??K).importNode(e,!0);Y.currentNode=r;let o=Y.nextNode(),a=0,n=0,l=i[0];for(;l!==void 0;){if(a===l.index){let g;l.type===2?g=new Ye(o,o.nextSibling,this,t):l.type===1?g=new l.ctor(o,l.name,l.strings,this,t):l.type===6&&(g=new $s(o,this,t)),this._$AV.push(g),l=i[++n]}a!==(l==null?void 0:l.index)&&(o=Y.nextNode(),a++)}return Y.currentNode=K,r}p(t){let e=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},Ye=class di{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,i,r){this.type=2,this._$AH=k,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=mt(this,t,e),Ot(t)?t===k||t==null||t===""?(this._$AH!==k&&this._$AR(),this._$AH=k):t!==this._$AH&&t!==ft&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):fs(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==k&&Ot(this._$AH)?this._$AA.nextSibling.data=t:this.T(K.createTextNode(t)),this._$AH=t}$(t){var e;const{values:i,_$litType$:r}=t,o=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=Ie.createElement(li(r.h,r.h[0]),this.options)),r);if(((e=this._$AH)==null?void 0:e._$AD)===o)this._$AH.p(i);else{const a=new ys(o,this),n=a.u(this.options);a.p(i),this.T(n),this._$AH=a}}_$AC(t){let e=Ar.get(t.strings);return e===void 0&&Ar.set(t.strings,e=new Ie(t)),e}k(t){ai(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,r=0;for(const o of t)r===e.length?e.push(i=new di(this.S(Ct()),this.S(Ct()),this,this.options)):i=e[r],i._$AI(o),r++;r<e.length&&(this._$AR(i&&i._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},he=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,r,o){this.type=1,this._$AH=k,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=k}_$AI(t,e=this,i,r){const o=this.strings;let a=!1;if(o===void 0)t=mt(this,t,e,0),a=!Ot(t)||t!==this._$AH&&t!==ft,a&&(this._$AH=t);else{const n=t;let l,g;for(t=o[0],l=0;l<o.length-1;l++)g=mt(this,n[i+l],e,l),g===ft&&(g=this._$AH[l]),a||(a=!Ot(g)||g!==this._$AH[l]),g===k?t=k:t!==k&&(t+=(g??"")+o[l+1]),this._$AH[l]=g}a&&!r&&this.j(t)}j(t){t===k?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},bs=class extends he{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===k?void 0:t}},ws=class extends he{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==k)}},xs=class extends he{constructor(t,e,i,r,o){super(t,e,i,r,o),this.type=5}_$AI(t,e=this){if((t=mt(this,t,e,0)??k)===ft)return;const i=this._$AH,r=t===k&&i!==k||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==k&&(i===k||r);r&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},$s=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){mt(this,t)}};const Er=Kt.litHtmlPolyfillSupport;Er==null||Er(Ie,Ye),(Kt.litHtmlVersions??(Kt.litHtmlVersions=[])).push("3.1.3");const _s=(s,t,e)=>{const i=(e==null?void 0:e.renderBefore)??t;let r=i._$litPart$;if(r===void 0){const o=(e==null?void 0:e.renderBefore)??null;i._$litPart$=r=new Ye(t.insertBefore(Ct(),o),o,void 0,e??{})}return r._$AI(s),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let pt=class extends ct{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=_s(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return ft}};pt._$litElement$=!0,pt.finalized=!0,(ur=globalThis.litElementHydrateSupport)==null||ur.call(globalThis,{LitElement:pt});const Rr=globalThis.litElementPolyfillSupport;Rr==null||Rr({LitElement:pt});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ss={attribute:!0,type:String,converter:Jt,reflect:!1,hasChanged:Ge},ks=(s=Ss,t,e)=>{const{kind:i,metadata:r}=e;let o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),o.set(e.name,s),i==="accessor"){const{name:a}=e;return{set(n){const l=t.get.call(this);t.set.call(this,n),this.requestUpdate(a,l,s)},init(n){return n!==void 0&&this.P(a,void 0,s),n}}}if(i==="setter"){const{name:a}=e;return function(n){const l=this[a];t.call(this,n),this.requestUpdate(a,l,s)}}throw Error("Unsupported decorator location: "+i)};function pi(s){return(t,e)=>typeof e=="object"?ks(s,t,e):((i,r,o)=>{const a=r.hasOwnProperty(o);return r.constructor.createProperty(o,a?{...i,wrapped:!0}:i),a?Object.getOwnPropertyDescriptor(r,o):void 0})(s,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function hi(s){return pi({...s,state:!0,attribute:!1})}function As(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}function Es(s){throw new Error('Could not dynamically require "'+s+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var ui={};(function(s){var t=function(){var e=function(h,c,p,u){for(p=p||{},u=h.length;u--;p[h[u]]=c);return p},i=[1,9],r=[1,10],o=[1,11],a=[1,12],n=[5,11,12,13,14,15],l={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,p,u,v,m,b,x){var _=b.length-1;switch(m){case 1:return new v.Root({},[b[_-1]]);case 2:return new v.Root({},[new v.Literal({value:""})]);case 3:this.$=new v.Concat({},[b[_-1],b[_]]);break;case 4:case 5:this.$=b[_];break;case 6:this.$=new v.Literal({value:b[_]});break;case 7:this.$=new v.Splat({name:b[_]});break;case 8:this.$=new v.Param({name:b[_]});break;case 9:this.$=new v.Optional({},[b[_-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:i,13:r,14:o,15:a},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:i,13:r,14:o,15:a},{1:[2,2]},e(n,[2,4]),e(n,[2,5]),e(n,[2,6]),e(n,[2,7]),e(n,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:i,13:r,14:o,15:a},e(n,[2,10]),e(n,[2,11]),e(n,[2,12]),{1:[2,1]},e(n,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:i,12:[1,16],13:r,14:o,15:a},e(n,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,p){if(p.recoverable)this.trace(c);else{let u=function(v,m){this.message=v,this.hash=m};throw u.prototype=Error,new u(c,p)}},parse:function(c){var p=this,u=[0],v=[null],m=[],b=this.table,x="",_=0,N=0,ye=2,Ht=1,be=m.slice.call(arguments,1),S=Object.create(this.lexer),B={yy:{}};for(var we in this.yy)Object.prototype.hasOwnProperty.call(this.yy,we)&&(B.yy[we]=this.yy[we]);S.setInput(c,B.yy),B.yy.lexer=S,B.yy.parser=this,typeof S.yylloc>"u"&&(S.yylloc={});var xe=S.yylloc;m.push(xe);var Ui=S.options&&S.options.ranges;typeof B.yy.parseError=="function"?this.parseError=B.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Ii=function(){var nt;return nt=S.lex()||Ht,typeof nt!="number"&&(nt=p.symbols_[nt]||nt),nt},P,Q,O,$e,at={},Bt,j,hr,Qt;;){if(Q=u[u.length-1],this.defaultActions[Q]?O=this.defaultActions[Q]:((P===null||typeof P>"u")&&(P=Ii()),O=b[Q]&&b[Q][P]),typeof O>"u"||!O.length||!O[0]){var _e="";Qt=[];for(Bt in b[Q])this.terminals_[Bt]&&Bt>ye&&Qt.push("'"+this.terminals_[Bt]+"'");S.showPosition?_e="Parse error on line "+(_+1)+`:
`+S.showPosition()+`
Expecting `+Qt.join(", ")+", got '"+(this.terminals_[P]||P)+"'":_e="Parse error on line "+(_+1)+": Unexpected "+(P==Ht?"end of input":"'"+(this.terminals_[P]||P)+"'"),this.parseError(_e,{text:S.match,token:this.terminals_[P]||P,line:S.yylineno,loc:xe,expected:Qt})}if(O[0]instanceof Array&&O.length>1)throw new Error("Parse Error: multiple actions possible at state: "+Q+", token: "+P);switch(O[0]){case 1:u.push(P),v.push(S.yytext),m.push(S.yylloc),u.push(O[1]),P=null,N=S.yyleng,x=S.yytext,_=S.yylineno,xe=S.yylloc;break;case 2:if(j=this.productions_[O[1]][1],at.$=v[v.length-j],at._$={first_line:m[m.length-(j||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(j||1)].first_column,last_column:m[m.length-1].last_column},Ui&&(at._$.range=[m[m.length-(j||1)].range[0],m[m.length-1].range[1]]),$e=this.performAction.apply(at,[x,N,_,B.yy,O[1],v,m].concat(be)),typeof $e<"u")return $e;j&&(u=u.slice(0,-1*j*2),v=v.slice(0,-1*j),m=m.slice(0,-1*j)),u.push(this.productions_[O[1]][0]),v.push(at.$),m.push(at._$),hr=b[u[u.length-2]][u[u.length-1]],u.push(hr);break;case 3:return!0}}return!0}},g=function(){var h={EOF:1,parseError:function(p,u){if(this.yy.parser)this.yy.parser.parseError(p,u);else throw new Error(p)},setInput:function(c,p){return this.yy=p||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var p=c.match(/(?:\r\n?|\n).*/g);return p?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var p=c.length,u=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-p),this.offset-=p;var v=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),u.length-1&&(this.yylineno-=u.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:u?(u.length===v.length?this.yylloc.first_column:0)+v[v.length-u.length].length-u[0].length:this.yylloc.first_column-p},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-p]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),p=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+p+"^"},test_match:function(c,p){var u,v,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),v=c[0].match(/(?:\r\n?|\n).*/g),v&&(this.yylineno+=v.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:v?v[v.length-1].length-v[v.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],u=this.performAction.call(this,this.yy,this,p,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),u)return u;if(this._backtrack){for(var b in m)this[b]=m[b];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,p,u,v;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),b=0;b<m.length;b++)if(u=this._input.match(this.rules[m[b]]),u&&(!p||u[0].length>p[0].length)){if(p=u,v=b,this.options.backtrack_lexer){if(c=this.test_match(u,m[b]),c!==!1)return c;if(this._backtrack){p=!1;continue}else return!1}else if(!this.options.flex)break}return p?(c=this.test_match(p,m[v]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var p=this.next();return p||this.lex()},begin:function(p){this.conditionStack.push(p)},popState:function(){var p=this.conditionStack.length-1;return p>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(p){return p=this.conditionStack.length-1-Math.abs(p||0),p>=0?this.conditionStack[p]:"INITIAL"},pushState:function(p){this.begin(p)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(p,u,v,m){switch(v){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return h}();l.lexer=g;function f(){this.yy={}}return f.prototype=l,l.Parser=f,new f}();typeof Es<"u"&&(s.parser=t,s.Parser=t.Parser,s.parse=function(){return t.parse.apply(t,arguments)})})(ui);function lt(s){return function(t,e){return{displayName:s,props:t,children:e||[]}}}var gi={Root:lt("Root"),Concat:lt("Concat"),Literal:lt("Literal"),Splat:lt("Splat"),Param:lt("Param"),Optional:lt("Optional")},fi=ui.parser;fi.yy=gi;var Rs=fi,Ps=Object.keys(gi);function Cs(s){return Ps.forEach(function(t){if(typeof s[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:s}}var mi=Cs,Os=mi,Ts=/[\-{}\[\]+?.,\\\^$|#\s]/g;function vi(s){this.captures=s.captures,this.re=s.re}vi.prototype.match=function(s){var t=this.re.exec(s),e={};if(t)return this.captures.forEach(function(i,r){typeof t[r+1]>"u"?e[i]=void 0:e[i]=decodeURIComponent(t[r+1])}),e};var Us=Os({Concat:function(s){return s.children.reduce((function(t,e){var i=this.visit(e);return{re:t.re+i.re,captures:t.captures.concat(i.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(s){return{re:s.props.value.replace(Ts,"\\$&"),captures:[]}},Splat:function(s){return{re:"([^?]*?)",captures:[s.props.name]}},Param:function(s){return{re:"([^\\/\\?]+)",captures:[s.props.name]}},Optional:function(s){var t=this.visit(s.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(s){var t=this.visit(s.children[0]);return new vi({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Is=Us,Ls=mi,zs=Ls({Concat:function(s,t){var e=s.children.map((function(i){return this.visit(i,t)}).bind(this));return e.some(function(i){return i===!1})?!1:e.join("")},Literal:function(s){return decodeURI(s.props.value)},Splat:function(s,t){return t[s.props.name]?t[s.props.name]:!1},Param:function(s,t){return t[s.props.name]?t[s.props.name]:!1},Optional:function(s,t){var e=this.visit(s.children[0],t);return e||""},Root:function(s,t){t=t||{};var e=this.visit(s.children[0],t);return e?encodeURI(e):!1}}),js=zs,Ms=Rs,Ns=Is,Fs=js;Ft.prototype=Object.create(null);Ft.prototype.match=function(s){var t=Ns.visit(this.ast),e=t.match(s);return e||!1};Ft.prototype.reverse=function(s){return Fs.visit(this.ast,s)};function Ft(s){var t;if(this?t=this:t=Object.create(Ft.prototype),typeof s>"u")throw new Error("A route spec is required");return t.spec=s,t.ast=Ms.parse(s),t}var Ds=Ft,qs=Ds,Hs=qs;const Bs=As(Hs);var Qs=Object.defineProperty,yi=(s,t,e,i)=>{for(var r=void 0,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=a(t,e,r)||r);return r&&Qs(t,e,r),r};class Tt extends pt{constructor(t,e,i=""){super(),this._cases=[],this._fallback=()=>St`
      <h1>Not Found</h1>
    `,this._cases=t.map(r=>({...r,route:new Bs(r.path)})),this._historyObserver=new T(this,e),this._authObserver=new T(this,i)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),St`
      <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(Wr(this,"auth/redirect"),St`
              <h1>Redirecting for Login</h1>
            `):e.view(e.params||{}):St`
              <h1>Authenticating</h1>
            `;if("redirect"in e){const i=e.redirect;if(typeof i=="string")return this.redirect(i),St`
              <h1>Redirecting to ${i}…</h1>
            `}}return this._fallback({})})()}</main>
    `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:i}=t,r=new URLSearchParams(e),o=i+e;for(const a of this._cases){const n=a.route.match(o);if(n)return{...a,path:i,params:n,query:r}}}redirect(t){He(this,"history/redirect",{href:t})}}Tt.styles=os`
    :host,
    main {
      display: contents;
    }
  `;yi([hi()],Tt.prototype,"_user");yi([hi()],Tt.prototype,"_match");const Ws=Object.freeze(Object.defineProperty({__proto__:null,Element:Tt,Switch:Tt},Symbol.toStringTag,{value:"Module"})),Gs=class bi extends HTMLElement{constructor(){if(super(),pe(bi.template).attach(this),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Gs.template=Nt`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;const Ys=class wi extends HTMLElement{constructor(){super(),this._array=[],pe(wi.template).attach(this),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(xi("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const i=new Event("change",{bubbles:!0}),r=e.value,o=e.closest("label");if(o){const a=Array.from(this.children).indexOf(o);this._array[a]=r,this.dispatchEvent(i)}}}),this.addEventListener("click",t=>{Te(t,"button.add")?Yt(t,"input-array:add"):Te(t,"button.remove")&&Yt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],Js(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const i=Array.from(this.children).indexOf(e);this._array.splice(i,1),e.remove()}}};Ys.template=Nt`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style>
          :host {
            display: contents;
          }
          ul {
            display: contents;
          }
          button.add {
            grid-column: input / input-end;
          }
          ::slotted(label) {
            display: contents;
          }
        </style>
      </button>
    </template>
  `;function Js(s,t){t.replaceChildren(),s.forEach((e,i)=>t.append(xi(e)))}function xi(s,t){const e=s===void 0?"":`value="${s}"`;return Nt`
    <label>
      <input ${e} />
      <button class="remove" type="button">Remove</button>
    </label>
  `}function U(s){return Object.entries(s).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var Ks=Object.defineProperty,Zs=Object.getOwnPropertyDescriptor,Xs=(s,t,e,i)=>{for(var r=Zs(t,e),o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=a(t,e,r)||r);return r&&Ks(t,e,r),r};class I extends pt{constructor(t){super(),this._pending=[],this._observer=new T(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([i,r])=>{console.log("Dispatching queued event",r,i),i.dispatchEvent(r)}),e.setEffect(()=>{var i;if(console.log("View effect",this,e,(i=this._context)==null?void 0:i.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const i=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",i),e.dispatchEvent(i)):(console.log("Queueing message event",i),this._pending.push([e,i]))}ref(t){return this.model?this.model[t]:void 0}}Xs([pi()],I.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Gt=globalThis,Je=Gt.ShadowRoot&&(Gt.ShadyCSS===void 0||Gt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ke=Symbol(),Pr=new WeakMap;let $i=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==Ke)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Je&&t===void 0){const i=e!==void 0&&e.length===1;i&&(t=Pr.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Pr.set(e,t))}return t}toString(){return this.cssText}};const Vs=s=>new $i(typeof s=="string"?s:s+"",void 0,Ke),$=(s,...t)=>{const e=s.length===1?s[0]:t.reduce((i,r,o)=>i+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+s[o+1],s[0]);return new $i(e,s,Ke)},to=(s,t)=>{if(Je)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const i=document.createElement("style"),r=Gt.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=e.cssText,s.appendChild(i)}},Cr=Je?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return Vs(e)})(s):s;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:eo,defineProperty:ro,getOwnPropertyDescriptor:io,getOwnPropertyNames:so,getOwnPropertySymbols:oo,getPrototypeOf:ao}=Object,q=globalThis,Or=q.trustedTypes,no=Or?Or.emptyScript:"",Ae=q.reactiveElementPolyfillSupport,Rt=(s,t)=>s,Xt={toAttribute(s,t){switch(t){case Boolean:s=s?no:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},Ze=(s,t)=>!eo(s,t),Tr={attribute:!0,type:String,converter:Xt,reflect:!1,hasChanged:Ze};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),q.litPropertyMetadata??(q.litPropertyMetadata=new WeakMap);class dt extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Tr){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(t,i,e);r!==void 0&&ro(this.prototype,t,r)}}static getPropertyDescriptor(t,e,i){const{get:r,set:o}=io(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get(){return r==null?void 0:r.call(this)},set(a){const n=r==null?void 0:r.call(this);o.call(this,a),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Tr}static _$Ei(){if(this.hasOwnProperty(Rt("elementProperties")))return;const t=ao(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Rt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Rt("properties"))){const e=this.properties,i=[...so(e),...oo(e)];for(const r of i)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[i,r]of e)this.elementProperties.set(i,r)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const r=this._$Eu(e,i);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const r of i)e.unshift(Cr(r))}else t!==void 0&&e.push(Cr(t));return e}static _$Eu(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return to(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostConnected)==null?void 0:i.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostDisconnected)==null?void 0:i.call(e)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EC(t,e){var o;const i=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,i);if(r!==void 0&&i.reflect===!0){const a=(((o=i.converter)==null?void 0:o.toAttribute)!==void 0?i.converter:Xt).toAttribute(e,i.type);this._$Em=t,a==null?this.removeAttribute(r):this.setAttribute(r,a),this._$Em=null}}_$AK(t,e){var o;const i=this.constructor,r=i._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const a=i.getPropertyOptions(r),n=typeof a.converter=="function"?{fromAttribute:a.converter}:((o=a.converter)==null?void 0:o.fromAttribute)!==void 0?a.converter:Xt;this._$Em=r,this[r]=n.fromAttribute(e,a.type),this._$Em=null}}requestUpdate(t,e,i){if(t!==void 0){if(i??(i=this.constructor.getPropertyOptions(t)),!(i.hasChanged??Ze)(this[t],e))return;this.P(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,i){this._$AL.has(t)||this._$AL.set(t,e),i.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,a]of this._$Ep)this[o]=a;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[o,a]of r)a.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],a)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(i=this._$EO)==null||i.forEach(r=>{var o;return(o=r.hostUpdate)==null?void 0:o.call(r)}),this.update(e)):this._$EU()}catch(r){throw t=!1,this._$EU(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(i=>{var r;return(r=i.hostUpdated)==null?void 0:r.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}dt.elementStyles=[],dt.shadowRootOptions={mode:"open"},dt[Rt("elementProperties")]=new Map,dt[Rt("finalized")]=new Map,Ae==null||Ae({ReactiveElement:dt}),(q.reactiveElementVersions??(q.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pt=globalThis,Vt=Pt.trustedTypes,Ur=Vt?Vt.createPolicy("lit-html",{createHTML:s=>s}):void 0,_i="$lit$",D=`lit$${Math.random().toFixed(9).slice(2)}$`,Si="?"+D,lo=`<${Si}>`,Z=document,Ut=()=>Z.createComment(""),It=s=>s===null||typeof s!="object"&&typeof s!="function",ki=Array.isArray,co=s=>ki(s)||typeof(s==null?void 0:s[Symbol.iterator])=="function",Ee=`[ 	
\f\r]`,kt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ir=/-->/g,Lr=/>/g,G=RegExp(`>|${Ee}(?:([^\\s"'>=/]+)(${Ee}*=${Ee}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),zr=/'/g,jr=/"/g,Ai=/^(?:script|style|textarea|title)$/i,po=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),d=po(1),vt=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),Mr=new WeakMap,J=Z.createTreeWalker(Z,129);function Ei(s,t){if(!Array.isArray(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ur!==void 0?Ur.createHTML(t):t}const ho=(s,t)=>{const e=s.length-1,i=[];let r,o=t===2?"<svg>":"",a=kt;for(let n=0;n<e;n++){const l=s[n];let g,f,h=-1,c=0;for(;c<l.length&&(a.lastIndex=c,f=a.exec(l),f!==null);)c=a.lastIndex,a===kt?f[1]==="!--"?a=Ir:f[1]!==void 0?a=Lr:f[2]!==void 0?(Ai.test(f[2])&&(r=RegExp("</"+f[2],"g")),a=G):f[3]!==void 0&&(a=G):a===G?f[0]===">"?(a=r??kt,h=-1):f[1]===void 0?h=-2:(h=a.lastIndex-f[2].length,g=f[1],a=f[3]===void 0?G:f[3]==='"'?jr:zr):a===jr||a===zr?a=G:a===Ir||a===Lr?a=kt:(a=G,r=void 0);const p=a===G&&s[n+1].startsWith("/>")?" ":"";o+=a===kt?l+lo:h>=0?(i.push(g),l.slice(0,h)+_i+l.slice(h)+D+p):l+D+(h===-2?n:p)}return[Ei(s,o+(s[e]||"<?>")+(t===2?"</svg>":"")),i]};class Lt{constructor({strings:t,_$litType$:e},i){let r;this.parts=[];let o=0,a=0;const n=t.length-1,l=this.parts,[g,f]=ho(t,e);if(this.el=Lt.createElement(g,i),J.currentNode=this.el.content,e===2){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(r=J.nextNode())!==null&&l.length<n;){if(r.nodeType===1){if(r.hasAttributes())for(const h of r.getAttributeNames())if(h.endsWith(_i)){const c=f[a++],p=r.getAttribute(h).split(D),u=/([.?@])?(.*)/.exec(c);l.push({type:1,index:o,name:u[2],strings:p,ctor:u[1]==="."?go:u[1]==="?"?fo:u[1]==="@"?mo:ue}),r.removeAttribute(h)}else h.startsWith(D)&&(l.push({type:6,index:o}),r.removeAttribute(h));if(Ai.test(r.tagName)){const h=r.textContent.split(D),c=h.length-1;if(c>0){r.textContent=Vt?Vt.emptyScript:"";for(let p=0;p<c;p++)r.append(h[p],Ut()),J.nextNode(),l.push({type:2,index:++o});r.append(h[c],Ut())}}}else if(r.nodeType===8)if(r.data===Si)l.push({type:2,index:o});else{let h=-1;for(;(h=r.data.indexOf(D,h+1))!==-1;)l.push({type:7,index:o}),h+=D.length-1}o++}}static createElement(t,e){const i=Z.createElement("template");return i.innerHTML=t,i}}function yt(s,t,e=s,i){var a,n;if(t===vt)return t;let r=i!==void 0?(a=e._$Co)==null?void 0:a[i]:e._$Cl;const o=It(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==o&&((n=r==null?void 0:r._$AO)==null||n.call(r,!1),o===void 0?r=void 0:(r=new o(s),r._$AT(s,e,i)),i!==void 0?(e._$Co??(e._$Co=[]))[i]=r:e._$Cl=r),r!==void 0&&(t=yt(s,r._$AS(s,t.values),r,i)),t}class uo{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,r=((t==null?void 0:t.creationScope)??Z).importNode(e,!0);J.currentNode=r;let o=J.nextNode(),a=0,n=0,l=i[0];for(;l!==void 0;){if(a===l.index){let g;l.type===2?g=new Dt(o,o.nextSibling,this,t):l.type===1?g=new l.ctor(o,l.name,l.strings,this,t):l.type===6&&(g=new vo(o,this,t)),this._$AV.push(g),l=i[++n]}a!==(l==null?void 0:l.index)&&(o=J.nextNode(),a++)}return J.currentNode=Z,r}p(t){let e=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Dt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,i,r){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=yt(this,t,e),It(t)?t===A||t==null||t===""?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==vt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):co(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==A&&It(this._$AH)?this._$AA.nextSibling.data=t:this.T(Z.createTextNode(t)),this._$AH=t}$(t){var o;const{values:e,_$litType$:i}=t,r=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=Lt.createElement(Ei(i.h,i.h[0]),this.options)),i);if(((o=this._$AH)==null?void 0:o._$AD)===r)this._$AH.p(e);else{const a=new uo(r,this),n=a.u(this.options);a.p(e),this.T(n),this._$AH=a}}_$AC(t){let e=Mr.get(t.strings);return e===void 0&&Mr.set(t.strings,e=new Lt(t)),e}k(t){ki(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,r=0;for(const o of t)r===e.length?e.push(i=new Dt(this.S(Ut()),this.S(Ut()),this,this.options)):i=e[r],i._$AI(o),r++;r<e.length&&(this._$AR(i&&i._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class ue{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,r,o){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=A}_$AI(t,e=this,i,r){const o=this.strings;let a=!1;if(o===void 0)t=yt(this,t,e,0),a=!It(t)||t!==this._$AH&&t!==vt,a&&(this._$AH=t);else{const n=t;let l,g;for(t=o[0],l=0;l<o.length-1;l++)g=yt(this,n[i+l],e,l),g===vt&&(g=this._$AH[l]),a||(a=!It(g)||g!==this._$AH[l]),g===A?t=A:t!==A&&(t+=(g??"")+o[l+1]),this._$AH[l]=g}a&&!r&&this.j(t)}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class go extends ue{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===A?void 0:t}}class fo extends ue{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A)}}class mo extends ue{constructor(t,e,i,r,o){super(t,e,i,r,o),this.type=5}_$AI(t,e=this){if((t=yt(this,t,e,0)??A)===vt)return;const i=this._$AH,r=t===A&&i!==A||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==A&&(i===A||r);r&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class vo{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){yt(this,t)}}const Re=Pt.litHtmlPolyfillSupport;Re==null||Re(Lt,Dt),(Pt.litHtmlVersions??(Pt.litHtmlVersions=[])).push("3.1.3");const yo=(s,t,e)=>{const i=(e==null?void 0:e.renderBefore)??t;let r=i._$litPart$;if(r===void 0){const o=(e==null?void 0:e.renderBefore)??null;i._$litPart$=r=new Dt(t.insertBefore(Ut(),o),o,void 0,e??{})}return r._$AI(s),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class R extends dt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=yo(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return vt}}var Nr;R._$litElement$=!0,R.finalized=!0,(Nr=globalThis.litElementHydrateSupport)==null||Nr.call(globalThis,{LitElement:R});const Pe=globalThis.litElementPolyfillSupport;Pe==null||Pe({LitElement:R});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");const bo={};function wo(s,t,e){switch(s[0]){case"profile/save":xo(s[1],e).then(r=>t(o=>({...o,profile:r}))).then(()=>{const{onSuccess:r}=s[1];r&&r()}).catch(r=>{const{onFailure:o}=s[1];o&&o(r)});break;case"profile/select":$o(s[1],e).then(r=>t(o=>({...o,profile:r})));break;case"study-spot/index":_o().then(r=>t(o=>({...o,studySpotIndex:r}))).catch(r=>{console.error("Failed to fetch study spots",r)});break;case"study-spot/select":So(s[1]).then(r=>t(o=>({...o,studySpot:r})));break;case"study-spot/add":ko(s[1],e).then(r=>t(o=>({...o,studySpot:r}))).then(()=>{const{onSuccess:r}=s[1];r&&r()}).catch(r=>{const{onFailure:o}=s[1];o&&o(r)});break;case"study-spot/update":Ao({spotid:s[1].spotid,ratings:s[1].rating,reviewsCount:s[1].reviewsCount},e).then(r=>t(o=>({...o,studySpot:r}))).then(()=>{const{onSuccess:r}=s[1];r&&r()}).catch(r=>{const{onFailure:o}=s[1];o&&o(r)});break;case"review/list-by-spot":Eo(s[1].spotId).then(r=>t(o=>({...o,reviews:r})));break;case"review/list-by-user":To(s[1].userId).then(r=>t(o=>({...o,reviews:r})));break;case"review/add":Ro(s[1],e).then(r=>{r&&t(o=>({...o,reviews:[...o.reviews??[],r]}))}).then(()=>{const{onSuccess:r}=s[1];r&&r()}).catch(r=>{const{onFailure:o}=s[1];o&&o(r)});break;case"review/delete":Po(s[1].reviewId).then(()=>{t(r=>{var o;return{...r,reviews:(o=r.reviews)==null?void 0:o.filter(a=>a._id!==s[1].reviewId)}})}).then(()=>{const{onSuccess:r}=s[1];r&&r()}).catch(r=>{const{onFailure:o}=s[1];o&&o(r)});break;case"review/update":Co(s[1].review,e).then(r=>{r&&t(o=>{var a;return{...o,reviews:(a=o.reviews)==null?void 0:a.map(n=>n._id===r._id?r:n)}})}).then(()=>{const{onSuccess:r}=s[1];r&&r()}).catch(r=>{const{onFailure:o}=s[1];o&&o(r)});break;case"review/select":Oo(s[1]).then(r=>t(o=>({...o,review:r})));break;case"review/clear":t(r=>({...r,reviews:[]}));break;default:const i=s[0];throw new Error(`Unhandled message "${i}"`)}}function xo(s,t){return fetch(`/api/profiles/${s.userid}`,{method:"PUT",headers:{"Content-Type":"application/json",...M.headers(t)},body:JSON.stringify(s.profile)}).then(e=>{if(e.status===401)throw Ri(),new Error("Session expired");if(e.status===200)return e.json();throw new Error(`Failed to save profile for ${s.userid}`)}).then(e=>{if(e)return e})}function $o(s,t){return fetch(`/api/profiles/${s.userid}`,{headers:M.headers(t)}).then(e=>{if(e.status===401)throw Ri(),new Error("Session expired");if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Profile:",e),e})}function _o(){return fetch("/study-spots",{method:"GET",headers:{"Content-Type":"application/json"}}).then(s=>{if(s.status===200)return s.json();throw void 0}).then(s=>{if(s){const{data:t}=s;return t}})}function So(s){return fetch(`/study-spots/${s.spotid}`,{method:"GET"}).then(t=>{if(t.status===200)return t.json()}).then(t=>{if(t)return console.log("Study Spot:",t),t})}function ko(s,t){return fetch("/study-spots",{method:"POST",headers:{"Content-Type":"application/json",...M.headers(t)},body:JSON.stringify(s.spot)}).then(e=>{if(e.status===201)return e.json();throw new Error("Failed to add study spot")}).then(e=>{if(e)return e})}function Ao(s,t){return fetch(`/study-spots/${s.spotid}`,{method:"PUT",headers:{"Content-Type":"application/json",...M.headers(t)},body:JSON.stringify({ratings:s.ratings,reviewsCount:s.reviewsCount})}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to update study spot ${s.spotid}`)}).then(e=>{if(e)return e})}function Eo(s){return fetch(`/reviews/spot/${s}`,{method:"GET",headers:{"Content-Type":"application/json"}}).then(t=>{if(t.status===200)return t.json();if(t.status===404)return console.log(`No reviews found for study spot ${s}`),[];throw new Error(`Failed to fetch reviews for study spot ${s}. Status: ${t.status}`)}).then(t=>t||[]).catch(t=>{throw console.error(t.message),t})}function Ro(s,t){return fetch("/reviews",{method:"POST",headers:{"Content-Type":"application/json",...M.headers(t)},body:JSON.stringify(s.review)}).then(e=>{if(e.status===201)return e.json();throw new Error("Failed to add review")}).then(e=>{if(e)return e})}function Po(s){return fetch(`/reviews/${s}`,{method:"DELETE",headers:{"Content-Type":"application/json"}}).then(t=>{if(t.status!==204)if(t.status===404)console.log(`Review ${s} not found`);else throw new Error(`Failed to delete review ${s}`)})}function Co(s,t){return fetch(`/reviews/${s._id}`,{method:"PUT",headers:{"Content-Type":"application/json",...M.headers(t)},body:JSON.stringify(s)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to update review ${s._id}`)}).then(e=>{if(e)return e})}function Oo(s){return fetch(`/reviews/${s.reviewId}`,{method:"GET"}).then(t=>{if(t.status===200)return t.json()}).then(t=>{if(t)return console.log("Review Found:",t),t})}function To(s){return fetch(`/reviews/user/${s}`,{method:"GET",headers:{"Content-Type":"application/json"}}).then(t=>{if(t.status===200)return t.json();throw new Error(`Failed to fetch reviews for user ${s}`)}).then(t=>t||[])}function Ri(){console.log("Token expired, redirecting to login page."),window.location.href="/app/login"}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Uo={attribute:!0,type:String,converter:Xt,reflect:!1,hasChanged:Ze},Io=(s=Uo,t,e)=>{const{kind:i,metadata:r}=e;let o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),o.set(e.name,s),i==="accessor"){const{name:a}=e;return{set(n){const l=t.get.call(this);t.set.call(this,n),this.requestUpdate(a,l,s)},init(n){return n!==void 0&&this.P(a,void 0,s),n}}}if(i==="setter"){const{name:a}=e;return function(n){const l=this[a];t.call(this,n),this.requestUpdate(a,l,s)}}throw Error("Unsupported decorator location: "+i)};function y(s){return(t,e)=>typeof e=="object"?Io(s,t,e):((i,r,o)=>{const a=r.hasOwnProperty(o);return r.constructor.createProperty(o,a?{...i,wrapped:!0}:i),a?Object.getOwnPropertyDescriptor(r,o):void 0})(s,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function w(s){return y({...s,state:!0,attribute:!1})}var Lo=Object.defineProperty,zo=(s,t,e,i)=>{for(var r=void 0,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=a(t,e,r)||r);return r&&Lo(t,e,r),r};const Ve=class Ve extends R{constructor(){super(...arguments),this.iconSrc="/icons/menu.svg",this._onClickAway=t=>{this.contains(t.target)||(this.removeAttribute("open"),window.removeEventListener("click",this._onClickAway))}}render(){return d`
      <slot name="actuator">
        <button @click="${this.toggle}">
          <img src="${this.iconSrc}" alt="Menu" id="menu-icon" />
        </button>
      </slot>
      <div id="panel">
        <slot></slot>
      </div>
    `}toggle(){this.hasAttribute("open")?(this.removeAttribute("open"),window.removeEventListener("click",this._onClickAway)):(this.setAttribute("open",""),setTimeout(()=>{window.addEventListener("click",this._onClickAway)},0))}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("click",this._onClickAway)}};Ve.styles=$`
    :host {
      position: relative;
      font-family: var(--font-family-body);
      display: inline-block;
    }
    #panel {
      display: none;
      position: absolute;
      right: 0;
      /* margin-top: var(--space-small); */
      margin-top: 3px;
      width: max-content;
      padding: var(--space-small);
      border-radius: var(--border-radius);
      background: var(--color-background-secondary);
      color: var(--color-text);
      box-shadow: var(--shadow-hover-med);
      z-index: 1000;
    }
    :host([open]) #panel {
      display: block;
    }
    button {
      /* background: var(--color-primary); */
      background: inherit;
      border: none;
      padding: 8px;
      color: var(--color-text);
      cursor: pointer;
      border-radius: var(--border-radius);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.3s;
    }
    button:hover,
    :host([open]) button {
      background: var(--color-links);
    }
    #menu-icon {
      width: 24px;
      height: auto;
      transition: transform 0.3s ease;
      filter: var(--invert-black-to-white);
    }
  `;let bt=Ve;zo([y({type:String})],bt.prototype,"iconSrc");customElements.define("drop-down",bt);const E=$`
  * {
    margin: 0;
    box-sizing: border-box;
    padding: 0;
  }

  body {
    line-height: 1.5;
  }

  img {
    max-width: 100%;
  }
`,jo=localStorage.getItem("dark-mode")==="true";function Mo(){document.body.classList.add("dark-mode"),localStorage.setItem("dark-mode","true")}function No(){document.body.classList.remove("dark-mode"),localStorage.setItem("dark-mode","false")}function Pi(s){s?Mo():No()}Pi(jo);document.body.addEventListener("dark-mode",()=>{const s=localStorage.getItem("dark-mode")==="true";Pi(!s)});var Fo=Object.defineProperty,Ci=(s,t,e,i)=>{for(var r=void 0,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=a(t,e,r)||r);return r&&Fo(t,e,r),r};const se=class se extends R{constructor(){super(...arguments),this.username="anonymous",this.isDarkMode=localStorage.getItem("dark-mode")==="true",this._authObserver=new T(this,"slostudyspots:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t?this.username=t.username:this.username="anonymous"})}toggleDarkMode(){this.isDarkMode=!this.isDarkMode,localStorage.setItem("dark-mode",this.isDarkMode.toString()),document.body.classList.toggle("dark-mode",this.isDarkMode)}render(){return d`
      <header class="navbar">
        <div class="navbar-content">
          <a class="logo" href="/app">
            <img src="/icons/book.png" alt="SLOStudySpots Logo" />
            <h1>SLOStudySpots</h1>
          </a>

          <!--
          <div class="search-box">
            <form>
              <input type="search" placeholder="Search for study spots..." />
            </form>
          </div>
          -->

          <nav class="right-navbar-links">
            <img
              @click=${this.toggleDarkMode}
              src=${this.isDarkMode?"/icons/dark-mode.svg":"/icons/light-mode.svg"}
              alt="Dark mode"
              class="light-dark-icon"
            />
            ${this.username==="anonymous"?d`
                 <!-- <a class="navbar-button" href="/app/login">Login</a>
                  <a class="navbar-button signup-button" href="/app/register">Sign Up</a>
                -->
                <drop-down>
                  <ul>
                    <li>
                      <a href="/app/login">
                        <img src="/icons/avatar.svg" alt="login-icon" class="navbar-icon"/>
                        Login
                      </a>
                    </li>
                    <li>
                      <a href="/app/register">
                        <img src="/icons/register.svg" alt="register-icon" class="navbar-icon"/>
                        Sign Up
                      </a>
                    </li>
                    <li>
                      <a href="/app/rankings">
                        <img src="/icons/ranking.svg" alt="ranking-icon" class="navbar-icon"/>
                        Community Rankings
                      </a>
                    </li>
                  </ul>
                </drop-down>
                `:d`
                <drop-down>
                  <ul>
                    <li>
                      <a href="/app/account">
                        <img src="/icons/about-me.svg" alt="about-me-icon" class="navbar-icon"/>
                        About Me
                      </a>
                    </li>
                    <li>
                      <a href="/app/rankings">
                        <img src="/icons/ranking.svg" alt="ranking-icon" class="navbar-icon"/>
                        Community Rankings
                      </a>
                    </li>
                    <li>
                      <a href="/app/add-spot">
                        <img src="/icons/add-spot.svg" alt="add-spot-icon" class="navbar-icon"/>
                        Add a Spot
                      </a>
                    </li>
                    <li>
                      <a href="#" @click=${Do}>
                        <img src="/icons/signout.svg" alt="signout-icon" class="navbar-icon"/>
                        Sign out
                      </a>
                    </li>
                  </ul>
                </drop-down>
              `}
          </nav>
        </div>
      </header>
    `}};se.uses=U({"drop-down":bt}),se.styles=[E,$`
    header.navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: var(--color-primary);
      /* background-color: var(--color-primary-transparent); */
      /* backdrop-filter: blur(10px); */
      padding: var(--space-small) var(--space-regular);
      position: sticky;
      top: 0; /* Ensures it sticks at the very top */
      z-index: 1000; /* Ensures the header stays on top of other content */
      position: fixed;
      width: 100%;
      /* width: 100vw; */
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
      margin-right: var(
        --space-small
      ); /* Space between the logo image and title */
    }

    .logo h1 {
      font-size: var(--font-size-large);
      /* color: var(--color-background-secondary); */
      color: #fff;
      margin: 0;
    }

    .search-box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(
        -50%,
        -50%
      ); /* Offset the search box to exactly center it */
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

    .right-navbar-links {
      display: flex;
      align-items: center;
    }

    .right-navbar-links .navbar-button {
      padding: 10px 15px;
      color: var(--color-background-primary);
      background-color: var(--color-text-secondary);
      border: none;
      border-radius: var(--border-radius);
      text-decoration: none;
      font-family: inherit;
      font-size: 1rem;
      cursor: pointer;
      margin-left: var(--space-small);
      transition: background-color 0.3s;
    }

    .right-navbar-links .navbar-button:hover {
      background-color: var(--color-secondary);
      color: white;
    }

    .right-navbar-links .signup-button {
      margin-left: var(--space-regular);
      background-color: var(--color-text-secondary);
    }

    .right-navbar-links .signup-button:hover {
      background-color: var(--color-secondary);
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
      align-items: flex-start;
      padding: 0;
      margin: 0;
    }

    .right-navbar-links li {
      /* margin-left: var(--space-regular); */
      width: 100%; /* Full width */
    }

    .right-navbar-links li:hover {
      background-color: rgba(0, 0, 0, 0.1); /* Light gray background on hover */
      border-radius: var(--border-radius);
    }

    .right-navbar-links li a {
      color: var(--color-text-secondary);
      /* font-family: var(--font-family-display); */
      display: flex;
      align-items: center;
      text-decoration: none;
      padding: 10px;
      width: 100%; /* Ensure <a> takes full width of <li> */
      height: 100%; /* Ensure <a> takes full height of <li> */
    }

    /* .right-navbar-links a:hover {
      color: var(--color-links);
    } */

    .right-navbar-links img {
      height: 27px;
    }

    .light-dark-switch {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      font-size: 16px;
      color: var(--color-text-secondary);
    }

    .light-dark-switch input[type="checkbox"] {
      margin-right: 8px;
    }

    .light-dark-switch:hover {
      color: var(--color-links);
    }

    /* .dark-light-container {
      display: flex;
      align-items: center;
      padding: 10px;
    } */

    .light-dark-icon {
      padding-right: 15px;
      filter: var(--invert-black-to-white);
    }

    img:hover {
      cursor: pointer;
    }

    .navbar-icon {
      padding-right: 10px;
      filter: var(--invert-black-to-white);
    }
  `];let zt=se;Ci([w()],zt.prototype,"username");Ci([w()],zt.prototype,"isDarkMode");function Do(s){De.relay(s,"auth:message",["auth/signout"])}var qo=Object.defineProperty,Ho=Object.getOwnPropertyDescriptor,st=(s,t,e,i)=>{for(var r=i>1?void 0:i?Ho(t,e):t,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=(i?a(t,e,r):a(r))||r);return i&&r&&qo(t,e,r),r};const Oi=$`
  slot[name="avatar"] {
    display: block;
    grid-row: 1 / span 2;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 20px;
  }
  nav {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 20px;
  }
  nav a {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: bold;
  }

  .avatar, slot[name="avatar"]::slotted(img) {
    display: block;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 20px;
  }
`,Le="/icons/avatar.svg",tr=class tr extends R{render(){return d`
    <main>
      <section class="profile-container">
        <a href="/app/account" class="back">← Back to About Me</a>
        <div class="profile-header">
          <slot name="avatar" class="avatar"></slot>
          <div>
            <h1><slot name="name"></slot></h1>
            <nav>
              <a href="${this.username}/edit" class="edit">Edit Profile</a>
            </nav>
          </div>
        </div>
        <div class="profile-section">
          <dl>
            <dt>Username:</dt>
            <dd><slot name="userid"></slot></dd>
            <dt>Email:</dt>
            <dd><slot name="email"></slot></dd>
            <dt>Bio:</dt>
            <dd><slot name="bio"></slot></dd>
            <dt>Date Joined:</dt>
            <dd><slot name="dateJoined"></slot></dd>
          </dl>
        </div>
      </section>
    </main>
  `}};tr.styles=[E,Oi,$`
      :host {
        padding: 20px;
      }

      main {
        padding: var(--space-regular);
        flex-grow: 1;
      }

      .profile-container {
        display: flex;
        flex-direction: column;
        background-color: var(--color-background-secondary);
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        max-width: 800px;
        margin: auto;
      }
      .profile-header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
      }
      h1 {
        color: var(--color-primary);
      }
      h2 {
        margin-top: 15px;
      }
      dl {
        display: grid;
        grid-template-columns: 1fr 3fr;
        gap: 10px;
      }
      dt {
        font-weight: bold;
        color: var(--color-text-primary);
        padding-right: 20px;
      }
      dd {
        padding-left: 20px;
        color: var(--color-text-secondary);
      }
      .profile-section {
        /* background-color: var(--color-background-primary); */
        padding: 15px;
        border-radius: var(--border-radius);
        /* box-shadow: 0 2px 4px rgba(0,0,0,0.05); */
        border: 1px solid #E0E0E0;
        margin-bottom: 20px;
      }
      nav a {
        text-decoration: underline;
      }
      nav > a:hover {
        color: var(--color-links);
      }
      .back {
        color: var(--color-links);
        text-decoration: none;
        font-weight: bold;
        margin-bottom: 20px;
        display: inline-block;
      }
      .back:hover {
        text-decoration: underline;
      }
    `];let te=tr;st([y()],te.prototype,"username",2);const oe=class oe extends R{constructor(){super(),this._handleAvatarSelected=this._handleAvatarSelected.bind(this),this._clearAvatar=this._clearAvatar.bind(this)}render(){return d`
      <main>
        <section class="profile-editor">
          
          <h1><slot name="name"></slot></h1>
          <nav>
            <a class="close" href="../${this.username}">Close</a>
            <!-- <button class="delete">Delete</button> -->
          </nav>
          <mu-form .init=${this.init}>
            <label>
            <span>Username</span>
            <input disabled name="userid" />
            </label>
            <label>
              <span>Name</span>
              <input name="name"/>
            </label>
            <label>
              <span>Email</span>
              <input name="email">
            </label>
            <label>
              <span>Bio</span>
              <textarea name="bio"></textarea>
            </label>
            <label>
              <span>Avatar</span>
              <!-- <input name="avatar" /> -->
              <!-- <input
              name="avatar"
              type="file"
              @change=${this._handleAvatarSelected} /> -->
              <input id="avatarInput" type="file" style="display: none" />
              <button @click="${this._triggerFileInput}">Upload Avatar</button>
              <button @click="${this._clearAvatar}">Clear Avatar</button>
            </label>
            <slot name="avatar" class="avatar"></slot>
          </mu-form>
        </section>
      </main>
    `}_triggerFileInput(){var t,e;(e=(t=this.shadowRoot)==null?void 0:t.getElementById("avatarInput"))==null||e.click()}_handleAvatarSelected(t){var i;const e=(i=t.target)==null?void 0:i.files;if(e&&e.length>0){const r=e[0],o=new FileReader;o.onload=()=>{const a=o.result;console.log("Avatar Loaded:",a),this.dispatchEvent(new CustomEvent("profile:new-avatar",{bubbles:!0,composed:!0,detail:a}))},o.onerror=()=>console.error("Error loading file"),o.readAsDataURL(r)}}_clearAvatar(){this.dispatchEvent(new CustomEvent("profile:new-avatar",{bubbles:!0,composed:!0,detail:Le}))}firstUpdated(){var e;const t=(e=this.shadowRoot)==null?void 0:e.getElementById("avatarInput");t==null||t.addEventListener("change",this._handleAvatarSelected)}disconnectedCallback(){var e;const t=(e=this.shadowRoot)==null?void 0:e.getElementById("avatarInput");t==null||t.removeEventListener("change",this._handleAvatarSelected),super.disconnectedCallback()}};oe.uses=U({"mu-form":Jr.Element}),oe.styles=[E,Oi,$`
      main {
        padding: var(--space-regular);
        flex-grow: 1;
      }
      mu-form {
        grid-column: key / end;
      }
      mu-form input {
        grid-column: input;
      }
      mu-form label:has(input[type="file"]) {
        grid-row-end: span 4;
        padding-bottom: 20px;
      }
      .profile-editor {
        display: flex;
        flex-direction: column;
        padding: 20px;
        max-width: 600px;
        margin: auto;
      }
    `];let jt=oe;st([y()],jt.prototype,"username",2);st([y({attribute:!1})],jt.prototype,"init",2);const ae=class ae extends I{constructor(){super("slostudyspots:model"),this.edit=!1,this.userid="",this.addEventListener("profile:new-avatar",t=>{this.newAvatar=t.detail})}get profile(){return this.model.profile}attributeChangedCallback(t,e,i){super.attributeChangedCallback(t,e,i),t==="user-id"&&e!==i&&i&&(console.log("Profiler Page:",i),this.dispatchMessage(["profile/select",{userid:i}]))}render(){var h,c,p;const{avatar:t,name:e,userid:i,email:r,bio:o,reviewsCount:a}=this.profile||{},n=((c=(h=this.profile)==null?void 0:h.favSpots)==null?void 0:c.map(u=>d`<li>${u}</li>`))||d``,l=(p=this.profile)!=null&&p.dateJoined?new Date(this.profile.dateJoined).toLocaleDateString():"Date unavailable",g=this.newAvatar??t??Le,f=g===Le;return this.edit?d`
        <profile-editor
          username=${i}
          .init=${this.profile}
          @mu-form:submit=${u=>this._handleSubmit(u)}>
          <img slot="avatar" src="${g}" class="avatar ${f?"invert":""}">
        </profile-editor>
      `:d`
        <profile-viewer username=${i}>
          <img slot="avatar" src="${g}" class="avatar ${f?"invert":""}">
          <span slot="name">${e}</span>
          <span slot="userid">${i}</span>
          <span slot="email">${r||"No email available"}</span>
          <span slot="bio">${o||"No bio available"}</span>
          <span slot="dateJoined">${l}</span>
          <span slot="reviewsCount">${a}</span>
          <!-- <ul slot="favSpots">${n}</ul> -->
        </profile-viewer>
      `}_handleSubmit(t){console.log("Handling submit of mu-form");const e=this.newAvatar?{...t.detail,avatar:this.newAvatar}:t.detail;this.dispatchMessage(["profile/save",{userid:this.userid,profile:e,onSuccess:()=>it.dispatch(this,"history/navigate",{href:`/app/profile/${this.userid}`}),onFailure:i=>console.log("ERROR:",i)}])}};ae.uses=U({"profile-viewer":te,"profile-editor":jt}),ae.styles=[E,$`
      .invert {
        filter: var(--invert-black-to-white);
      }
    `];let X=ae;st([y({type:Boolean,reflect:!0})],X.prototype,"edit",2);st([y({attribute:"user-id",reflect:!0})],X.prototype,"userid",2);st([w()],X.prototype,"profile",1);st([w()],X.prototype,"newAvatar",2);var Bo=Object.defineProperty,Qo=(s,t,e,i)=>{for(var r=void 0,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=a(t,e,r)||r);return r&&Bo(t,e,r),r};U({"restful-form":Vr.FormElement});const er=class er extends R{constructor(){super(...arguments),this.message=""}render(){return d`
      <restful-form
        new
        .init=${{username:"",password:""}}
        src="/auth/login"
        @mu-rest-form:created=${this._handleSuccess}
        @mu-rest-form:error=${this._handleError}>
        <slot></slot>
        <slot slot="submit" name="submit" @click=${this._handleSubmit}></slot>
      </restful-form>
      <p class="error">
        ${this.message?"Invalid Username or Password":""}
      </p>
      <pre>${this.message}</pre>
    `}get next(){return new URLSearchParams(document.location.search).get("next")}firstUpdated(){this.injectStylesIntoRestfulForm()}injectStylesIntoRestfulForm(){var e;const t=(e=this.shadowRoot)==null?void 0:e.querySelector("restful-form");if(t&&t.shadowRoot){const i=document.createElement("style");i.textContent=`
        form {
          display: block; /* Override the grid display here */
        }
      `,t.shadowRoot.appendChild(i)}}_handleSubmit(t){var i,r;t.preventDefault();const e=(i=this.shadowRoot)==null?void 0:i.querySelector("restful-form");(r=e==null?void 0:e.form)==null||r.dispatchEvent(new Event("submit",{bubbles:!0,cancelable:!0}))}_handleSuccess(t){const e=t.detail,{token:i}=e.created,r=this.next||"/";console.log("Login successful",e,r),De.relay(t,"auth:message",["auth/signin",{token:i,redirect:r}]),it.dispatch(this,"history/navigate",{href:"/app"})}_handleError(t){const{error:e}=t.detail;console.log("Login failed",t.detail),this.message=e.toString()}};er.styles=$`
    .error {
      color: firebrick;
    }
  `;let ee=er;Qo([y()],ee.prototype,"message");U({"mu-auth":M.Provider,"login-form":ee});const rr=class rr extends R{render(){return d`
      <div class="login-register-container">
        <p>
          <a href="/app">← Back to home</a>
        </p>
        <h1>Log In</h1>
        <main class="card">
          <login-form>
            <label>
              <input name="username" autocomplete="off" placeholder="Username"/>
            </label>
            <label>
              <input type="password" name="password" placeholder="Password"/>
            </label>
            <button slot="submit" id="submit-btn" type="submit">Login</button>
          </login-form>
          <p>
            Don't have an account?
            <a href="/app/register">Sign up as a new user</a>
          </p>
          <img src="/images/login-register-img.svg" alt="People Studying">
        </main>
      </div>
    `}};rr.styles=[E,$`
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
    `];let ze=rr;U({"restful-form":Vr.FormElement});class Wo extends R{render(){return d`
      <restful-form new src="/auth/register">
        <slot></slot>
        <slot slot="submit" name="submit" @click=${this._handleSubmit}></slot>
      </restful-form>
    `}firstUpdated(){this.injectStylesIntoRestfulForm()}injectStylesIntoRestfulForm(){var e;const t=(e=this.shadowRoot)==null?void 0:e.querySelector("restful-form");if(t&&t.shadowRoot){const i=document.createElement("style");i.textContent=`
        form {
          display: block; /* Override the grid display here */
        }
      `,t.shadowRoot.appendChild(i)}}_handleSubmit(t){var i,r;t.preventDefault();const e=(i=this.shadowRoot)==null?void 0:i.querySelector("restful-form");(r=e==null?void 0:e.form)==null||r.dispatchEvent(new Event("submit",{bubbles:!0,cancelable:!0}))}get next(){return new URLSearchParams(document.location.search).get("next")}constructor(){super(),this.addEventListener("mu-rest-form:created",t=>{const e=t.detail,{token:i}=e.created,r=this.next||"/";console.log("Signup successful",e,r),De.relay(t,"auth:message",["auth/signin",{token:i,redirect:r}])})}}U({"mu-auth":M.Provider,"register-form":Wo});const ir=class ir extends R{render(){return d`
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
    `}};ir.styles=[E,$`
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
    `];let je=ir;const xt=$`
  .stars {
    display: flex;
  }

  .star {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background: lightgray;
    clip-path: polygon(
      50% 0%, 
      61% 35%, 
      98% 35%, 
      68% 57%, 
      79% 91%, 
      50% 70%, 
      21% 91%, 
      32% 57%, 
      2% 35%, 
      39% 35%
    );
  }
  
  .star.full {
    background: gold;
  }
  
  .star.half {
    background: linear-gradient(90deg, gold 50%, lightgray 50%);
  }

  .star.empty {
    background: lightgray;
  }
`;var Go=Object.defineProperty,Ti=(s,t,e,i)=>{for(var r=void 0,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=a(t,e,r)||r);return r&&Go(t,e,r),r};const sr=class sr extends R{constructor(){super(...arguments),this.open=!1,this.sort=!1}openPopup(){this.open=!0}closePopup(t){t.target.classList.contains("popup-overlay")&&(this.open=!1)}triggerSort(t){this.dispatchEvent(new CustomEvent("sort-requested",{detail:{sortType:t}})),this.open=!1}render(){return d`
      <button class="filter-container" @click="${this.openPopup}">
        <svg class="filter-icon">
          <use href="/icons/filter.svg#icon-filter" />
        </svg>
        <h4>Filter</h4>
      </button>

      ${this.open?d`
            <div class="popup-overlay" @click="${this.closePopup}">
              <div class="popup">
                <div class="filter-title">
                  <h3>Change Filters</h3>
                  <img
                    class="close"
                    src="/icons/close.svg"
                    alt="close"
                    @click="${()=>this.open=!1}"
                    width="30px"
                  />
                </div>

                <button @click="${()=>this.triggerSort("alphabetically")}">Sort Alphabetically</button>
              </div>
            </div>
          `:""}
    `}};sr.styles=[E,$`
    .popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .popup {
      background-color: white;
      padding: 20px;
      height: 25vh;
      width: 25vw;
      border-radius: 5px;
      position: relative;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .filter-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      padding: 10px;
      border-radius: 10px;
      background-color: var(--color-background-primary);
      cursor: pointer;
    }

    .filter-icon {
      height: 25px;
      width: 25px;
      fill: var(--color-primary);
      stroke: var(--color-primary);
      background-color: inherit;
    }

    .filter-container h4 {
      font-size: 15px;
      font-weight: 500;
      color: var(--color-primary);
      background-color: inherit;
    }

    .filter-container:hover {
      background-color: rgb(230, 230, 230);
    }

    .filter-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .close {
      cursor: pointer;
    }

    button {
      cursor: pointer;
      border: 1px solid var(--color-background-primary);
      padding: 10px 20px;
      border-radius: 5px;
      margin-top: 10px;
    }

    button:hover {
      background-color: var(--color-links);
    }

    @media (max-width: 600px) {
      .popup {
        width: 90vw; /* Full width for small screens */
        padding: 10px;
      }

      .filter-container {
        padding: 8px;
        gap: 8px;
      }

      .filter-icon {
        height: 20px;
        width: 20px;
      }

      .filter-container h4 {
        font-size: 14px;
      }

      .filter-title h3 {
        font-size: 18px; /* Adjust font size for smaller screens */
      }

      button {
        width: 100%; /* Full-width buttons on mobile */
        padding: 12px;
      }
    }
  `];let Mt=sr;Ti([y({type:Boolean})],Mt.prototype,"open");Ti([w()],Mt.prototype,"sort");var Yo=Object.defineProperty,Jo=Object.getOwnPropertyDescriptor,ge=(s,t,e,i)=>{for(var r=i>1?void 0:i?Jo(t,e):t,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=(i?a(t,e,r):a(r))||r);return i&&r&&Yo(t,e,r),r};const ne=class ne extends I{constructor(){super("slostudyspots:model"),this.isPopupOpen=!1,this.filterTerm="",this.filteredStudySpots=[],this.updateFilteredStudySpots()}get studySpotIndex(){return this.model.studySpotIndex||[]}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["study-spot/index"])}togglePopup(){this.isPopupOpen=!this.isPopupOpen}updateFilteredStudySpots(){this.filteredStudySpots=this.studySpotIndex.filter(t=>t.name.toLowerCase().includes(this.filterTerm.toLowerCase()))}handleSortRequested(t){t.detail.sortType==="alphabetically"&&(this.studySpotIndex.sort((i,r)=>i.name.localeCompare(r.name)),this.filteredStudySpots=this.studySpotIndex.filter(i=>i.name.toLowerCase().includes(this.filterTerm.toLowerCase()))),this.isPopupOpen=!1}updateFilterTerm(t){const e=t.target;this.filterTerm=e.value,this.updateFilteredStudySpots()}renderStars(t){const e=Math.floor(t),i=t%1>=.5?1:0,r=5-e-i,o=[];for(let a=0;a<e;a++)o.push(d`<span class="star full"></span>`);i&&o.push(d`<span class="star half"></span>`);for(let a=0;a<r;a++)o.push(d`<span class="star empty"></span>`);return d`${o}`}render(){const t=i=>{const{name:r,ratings:o,reviewsCount:a}=i,{_id:n}=i,l=i.photos&&i.photos.length>0?i.photos[0].url:"/icons/default-spot.png",g=o.overall.toFixed(1);return d`
      <li class="study-spot-container">
        <a href="/app/study-spot/${n}">
          <img src="${l}" alt="${r}" />
          <div class="study-spot-content">
            <h3>${r}</h3>
            <div class="rating-container">
              <p class="overall-rating">${g}</p>
              <div class="stars">
                ${this.renderStars(o.overall)}
              </div>
              <p>(${a} reviews)</p>
            </div>
          </div>
        </a>
      </li>
    `},e=this.filteredStudySpots.length>0?this.filteredStudySpots:this.studySpotIndex;return d`
      <main>
        <section class="welcome-section">
          <h1>Welcome to SLOStudySpots</h1>
          <p>Find the best spots to study in San Luis Obispo!</p>
          <div class="search-box">
            <form>
              <input type="search" @input="${this.updateFilterTerm}" placeholder="Search for study spots..." />
            </form>
          </div>
        </section>

        <section class="featured-spots">
          <div class="header-container">
            <h2>Featured Study Spots</h2>
            <filter-popup .open="${this.isPopupOpen}" @sort-requested="${this.handleSortRequested}"></filter-popup>
          </div>
          <ul class="spots-list">
            ${e.map(t)}
          </ul>
        </section>
      </main>
    `}};ne.uses=U({"filter-popup":Mt}),ne.styles=[E,xt,$`
      main {
        padding: var(--space-regular);
        flex-grow: 1;
      }

      .welcome-section {
        text-align: center;
        padding: var(--space-regular) 0;
      }
      
      .welcome-section h1 {
        font-size: var(--font-size-large); /* can prob be removed*/
        color: var(--color-primary);
        padding-bottom: var(--space-small);
      }

      .search-box {
        width: 100%;
        max-width: 470px;
        margin: 0 auto;
        padding-top: var(--space-regular);
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

      .featured-spots {
        margin: var(--space-regular) 0;
      }

      .featured-spots .header-container {
        display: flex;
        justify-content: space-between; /* Aligns heading and button on opposite sides */
        align-items: center; /* Vertically centers items */
        margin-bottom: var(--space-small); /* Space between heading/button and list */
      }
      
      .featured-spots h2 {
        font-size: var(--font-size-large);
        color: var(--color-secondary);
        margin: 0;
      }
      
      .spots-list {
        list-style: none;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-gap: var(--space-regular);
      }
      
      .study-spot-container {
        border: 1px solid var(--color-primary);
        border-radius: var(--border-radius);
        overflow: hidden;
        transition: box-shadow 0.3s ease-in-out;
        background-color: var(--color-background-secondary);
      }
      
      .study-spot-container:hover {
        box-shadow: var(--shadow-hover-large);
      }
      
      .study-spot-container a {
        display: block;
        color: inherit;
        text-decoration: none;
      }
      
      .study-spot-container img {
        width: 100%;
        height: 200px;
        object-fit: cover;
      }
      
      .study-spot-content {
        padding: var(--space-small);
        /* background: var(--color-background-primary); */
      }
      
      .study-spot-container h3 {
        margin: var(--space-small) 0;
        color: var(--color-primary);
        font-size: 1.25rem;
      }
      
      .study-spot-container p {
        margin: 0;
        font-size: 0.875rem;
        color: var(--color-text-primary);
      }

      .rating-container {
        display: flex;
        align-items: center;
      }
    
      .overall-rating {
        margin-right: var(--space-small);
        font-size: 1rem;
        color: var(--color-secondary);
      }
    `];let V=ne;ge([w()],V.prototype,"studySpotIndex",1);ge([w()],V.prototype,"isPopupOpen",2);ge([w()],V.prototype,"filterTerm",2);ge([w()],V.prototype,"filteredStudySpots",2);var Ko=Object.defineProperty,Zo=Object.getOwnPropertyDescriptor,fe=(s,t,e,i)=>{for(var r=i>1?void 0:i?Zo(t,e):t,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=(i?a(t,e,r):a(r))||r);return i&&r&&Ko(t,e,r),r};const or=class or extends I{constructor(){super("slostudyspots:model"),this.spotid="",this.loading=!0}get studySpot(){return this.model.studySpot}get reviews(){return this.model.reviews||[]}attributeChangedCallback(t,e,i){super.attributeChangedCallback(t,e,i),t==="spot-id"&&e!==i&&i&&(console.log("Study Spot Page:",i),this.loading=!0,this.dispatchMessage(["review/clear"]),this.dispatchMessage(["study-spot/select",{spotid:i}]),this.dispatchMessage(["review/list-by-spot",{spotId:i}]),setTimeout(()=>this.loading=!1,100))}renderStars(t){const e=Math.floor(t),i=t%1>=.5?1:0,r=5-e-i,o=[];for(let a=0;a<e;a++)o.push(d`<span class="star full"></span>`);i&&o.push(d`<span class="star half"></span>`);for(let a=0;a<r;a++)o.push(d`<span class="star empty"></span>`);return d`${o}`}formatDate(t){return new Date(t).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}render(){var p,u,v,m,b;if(this.loading)return d`<div class="loading-spinner"></div>`;const{name:t,address:e,hoursOfOperation:i,ratings:r,link:o,photos:a}=this.studySpot||{},n=a&&a.length>0?a[0].url:"/icons/default-spot.png",l=((u=(p=this.studySpot)==null?void 0:p.tags)==null?void 0:u.map(x=>d`<span class="feature-tag">${x}</span>`))||d``,g=o?d`<a href="${o}" target="_blank" class="web-link">${o}</a>`:d`<span class="placeholder-text">Website not available</span>`,f=i&&i.length>0?i.map(x=>d`
      <div class="hours">
        <span>${x.startDay} - ${x.endDay}: ${c(x)}</span>
      </div>
    `):d`<span class="placeholder-text">Hours not available</span>`;function h(x){if(x===-1)return"Closed";const _=Math.floor(x/60),N=x%60,ye=_>=12?"PM":"AM",Ht=_%12===0?12:_%12,be=N<10?`0${N}`:N;return`${Ht}:${be} ${ye}`}function c(x){const _=h(x.open||0),N=h(x.close||0);return x.isOpen24Hours?"Open 24 Hours":`${_} - ${N}`}return d`
      <main>
        <section class="gallery-preview">
          <img src="${n}" alt="View of ${(v=this.studySpot)==null?void 0:v.name}" class="featured-image">
          <div class="view-gallery-overlay">
            <h2 class="spot-title">${t}</h2>
            <a href="${this.spotid}/gallery" class="btn-view-gallery">
              <img src="/icons/default-photo.svg" alt="Gallery Icon">
              View Gallery
            </a>
          </div>
        </section>

        <section class="study-spot-actions">
          <!-- <a href="#" class="btn-add-photo">
            <img src="/icons/upload-photo.svg" alt="Add Photo Icon" class="btn-icon-white">
            Add Photo
          </a> -->
          <a href="/app/add-review/${this.spotid}" class="btn-write-review">
            <img src="/icons/create.svg" alt="Write Review Icon" class="btn-icon-white">
            Write Review
          </a>
        </section>

        <div class="details-reviews-container">
          <div class="details-ratings">
            <section class="spot-details">
              <h3>Details</h3>
              <p><strong>Address: </strong>${e}</p>
              <p><strong>Website Link:</strong> ${g}</p>
              <p>
                <strong>Features:</strong>
                ${l}
              </p>
              <p>
                <strong>Hours of Operation:</strong>
                ${f}
              </p>
            </section>
            <section class="rating-breakdown">
              <h3><strong>Overall Rating:</strong></h3>
              <div class="overall-rating-image-container">
                <img src="/icons/star-rating.svg" alt="Star Rating" class="star-icon"/>
                <h4 class="rating-value">${r==null?void 0:r.overall.toFixed(2)}</h4>
              </div>
              <h3>Rating Breakdown</h3>
              <p><strong>Quietness:</strong> ${this.renderStars((r==null?void 0:r.quietness)??0)} ${r==null?void 0:r.quietness.toFixed(2)}/ 5</p>
              <p><strong>Wifi Quality:</strong> ${this.renderStars((r==null?void 0:r.wifiQuality)??0)} ${r==null?void 0:r.wifiQuality.toFixed(2)} / 5</p>
              <p><strong>Crowdedness:</strong> ${this.renderStars((r==null?void 0:r.crowdedness)??0)} ${r==null?void 0:r.crowdedness.toFixed(2)}/ 5</p>
              <p><strong>Power Outlets:</strong> ${this.renderStars((r==null?void 0:r.powerOutlets)??0)} ${r==null?void 0:r.powerOutlets.toFixed(2)} / 5</p>
              <p><strong>Amenities:</strong> ${this.renderStars((r==null?void 0:r.amenities)??0)} ${r==null?void 0:r.amenities.toFixed(2)}/ 5</p>
            </section>
          </div>
          <section class="user-reviews">
            <h3>${(m=this.studySpot)==null?void 0:m.reviewsCount} User Reviews</h3>
            ${this.reviews.length>0?this.reviews.map(x=>d`
            <div class="review-card">
              <div class="review-header">
                <h4 class="review-author">${x.userId.userid}</h4>
                <span class="review-date">${this.formatDate(x.createdAt.toString())}</span>
              </div>
              <div class="review-body">
                <div class="review-rating">
                  ${this.renderStars(x.overallRating)}
                  <span class="rating-text">${x.overallRating} / 5</span>
                </div>
                <p class="review-comment">${x.comment}</p>
              </div>
              <div class="review-footer">
                <span class="review-time-to-go">Best Time to Go: ${x.bestTimeToGo}</span>
              </div>
            </div>
        `):d`<p>No reviews yet. Be the first to review <strong>${(b=this.studySpot)==null?void 0:b.name}</strong>!</p>`}
          </section>
        </div>
      </main>
    `}};or.styles=[E,xt,$`
      main {
        padding: var(--space-regular);
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      }

      .gallery-preview {
        position: relative;
        width: 100%;
      }

      .featured-image {
        width: 100%;
        height: auto; /* Changed to auto to maintain aspect ratio */
        max-height: 300px;
        object-fit: cover;
      }

      .view-gallery-overlay {
        position: absolute;
        bottom: 0;
        width: 100%;
        background: linear-gradient(to top, rgba(0,0,0,0.8) 30%, transparent 95%);
        padding: 10px 20px;
      }

      .spot-title {
        color: white;
        font-size: 1.8rem; /* Adjusted for smaller screens */
      }
      
      .btn-view-gallery {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        bottom: 10px;
        right: 20px;
        color: #333;
        background-color: #fff;
        padding: 8px 16px;
        border-radius: var(--border-radius);
        text-decoration: none;
      }
      
      .btn-view-gallery img {
        height: 20px;
        width: auto;
        margin-right: 8px;
      }
      
      .btn-view-gallery:hover {
        filter: brightness(0.9);
      }
      
      .study-spot-actions {
        text-align: center;
        padding: 10px 0;
      }
      
      .btn-add-photo, .btn-write-review {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: var(--color-primary);
        color: white;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: var(--border-radius);
        margin: 0 10px;
      }
      
      .btn-add-photo:hover, .btn-write-review:hover, .feature-tag:hover {
        background-color: var(--color-links);
        cursor: pointer; /* prob not needed for tags once it can be clicked */
      }
      
      .btn-icon-white {
        height: 20px;
        width: auto;
        margin-right: 8px;
        filter: brightness(0) invert(1);
      }
      
      .details-reviews-container {
        display: flex;
        flex-direction: column; /* Switch to column layout on smaller screens */
      }
      
      .feature-tag {
        display: inline-block;
        background-color: var(--color-tags);
        color: #fff;
        border-radius: var(--border-radius);
        padding: 5px 10px;
        margin: 2px;
        font-size: 0.875rem;
        text-transform: capitalize;
      }

      /* Details and Ratings Container Styles */
      .details-ratings, .user-reviews {
        flex: 1;
        padding: 10px;
      }
      
      .details-ratings h3 {
        color: var(--color-primary);
      }
      
      .spot-details, .rating-breakdown {
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid #ccc;
      }
      
      /* .rating-breakdown {
        padding-top: 20px; /* Space at the top to separate from details *
      } */
      
      .hours {
        margin-top: 10px;
      }

      .overall-rating-image-container {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }
      
      .star-icon {
        width: 24px;
        height: auto;
        margin-right: 5px;
      }
      
      .rating-value {
        font-size: 1.5rem;
        color: var(--color-primary);
      }
      
      .rating-breakdown p {
        margin: 5px 0;
      }
      
      .rating-breakdown h3 {
        color: var(--color-primary);
      }
      
      /* User Reviews Styles */
      .user-reviews {
        flex: 2;
        padding-left: 10px;
      }
      
      .user-reviews h3 {
        color: var(--color-primary);
      }
      
      .review {
        background-color: var(--color-background-secondary);
        /* border: 1px solid #ddd; */
        box-shadow: var(--shadow-hover-small);
        margin-top: 20px;
        padding: 10px;
        border-radius: var(--border-radius);
      }
      
      .review ul {
        margin: 10px 0 0 15px;
      }

      .web-link {
        color: var(--color-secondary);
        text-decoration: none;
        transition: color 0.3s ease, text-decoration 0.3s ease;
      }
  
      .web-link:hover {
        color: var(--color-links);
        text-decoration: underline;
      }

      .placeholder-text {
        color: var(--color-text-secondary);
      }

      .user-reviews {
        flex: 2;
        padding-left: 10px;
        display: flex;
        flex-direction: column;
        gap: 20px; /* space between reviews */
      }
      
      .review-card {
        background-color: var(--color-background-secondary);
        box-shadow: var(--shadow-hover-small);
        padding: 20px;
        border-radius: var(--border-radius);
        margin-top: 10px;
      }
      
      .review-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      
      .review-author {
        font-size: 1.25rem;
        color: var(--color-primary);
      }
      
      .review-date {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
      }
      
      .review-body {
        padding-bottom: 10px;
      }
      
      .review-rating {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
      }
      
      .rating-text {
        margin-left: 10px;
        font-size: 1rem;
        color: var(--color-secondary);
      }
      
      .review-comment {
        font-size: 1rem;
        color: var(--color-text-primary);
        white-space: pre-wrap; /* Ensures that whitespace in the comment is respected */
      }
      
      .review-footer {
        margin-top: 10px;
        font-size: 0.875rem;
        color: var(--color-text-secondary);
      }
      
      .review-time-to-go {
        display: block;
        font-size: 0.875rem;
        color: var(--color-secondary); /* Different color */
        background-color: var(--color-background-light); /* Light background */
        padding: 5px 10px;
        margin-top: 10px;
        border-radius: 15px; /* Rounded corners for a chip-like appearance */
        font-style: italic; /* Italicize text */
        display: flex;
        align-items: center; /* Center align if using icon */
      }

      .loading-spinner {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 8px solid var(--color-background-secondary);
        border-top: 8px solid var(--color-primary);
        border-radius: 50%;
        width: fit-content;
        height: fit-content;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* Media Queries for Responsive Adjustments */
      @media (min-width: 768px) {
        .details-reviews-container {
          flex-direction: row;
          justify-content: space-between;
        }

        .details-ratings, .user-reviews {
          padding: 10px;
        }

        .spot-title {
          font-size: 2rem; /* Larger font size for larger screens */
        }
      }

      @media (max-width: 480px) {
        .btn-view-gallery {
          font-size: 0.8rem; /* Smaller button text on very small screens */
          margin-top: 10px;
          position: relative;
          right: auto;
        }

        /* .review-author, .review-date, .rating-text {
          font-size: 0.75rem;
        } */
      }

      @media (max-width: 768px) {
        .featured-image {
          height: 250px; /* Adjust the height for smaller screens */
        }
      }
    `];let tt=or;fe([y({attribute:"spot-id",reflect:!0})],tt.prototype,"spotid",2);fe([w()],tt.prototype,"studySpot",1);fe([w()],tt.prototype,"reviews",1);fe([w()],tt.prototype,"loading",2);var Xo=Object.defineProperty,Vo=Object.getOwnPropertyDescriptor,qt=(s,t,e,i)=>{for(var r=i>1?void 0:i?Vo(t,e):t,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=(i?a(t,e,r):a(r))||r);return i&&r&&Xo(t,e,r),r};const le=class le extends I{constructor(){super("slostudyspots:model"),this.loading=!0,this.reviewsFetched=!1,this._authObserver=new T(this,"slostudyspots:auth")}get reviews(){return this.model.reviews||[]}get profile(){return this.model.profile}get studySpots(){return this.model.studySpotIndex||[]}get studySpotMap(){const t=new Map;return this.studySpots.forEach(e=>t.set(e._id,e)),t}fetchStudySpots(){this.dispatchMessage(["study-spot/index"])}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{if(t&&!this.reviewsFetched){console.log("Authenticated user:",t.username),this.loading=!0,this.dispatchMessage(["profile/select",{userid:t.username}]);const e=this.model.profile;e&&e._id?(console.log("Profile fetched with _id:",e._id),this.dispatchMessage(["review/list-by-user",{userId:e._id}]),this.fetchStudySpots(),this.reviewsFetched=!0):console.warn("Profile _id is not set. Review list message not dispatched."),setTimeout(()=>this.loading=!1,100)}})}formatDate(t){return new Date(t).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}renderStars(t){const e=Math.floor(t),i=t%1>=.5?1:0,r=5-e-i,o=[];for(let a=0;a<e;a++)o.push(d`<span class="star full"></span>`);i&&o.push(d`<span class="star half"></span>`);for(let a=0;a<r;a++)o.push(d`<span class="star empty"></span>`);return d`${o}`}renderSubratings(t){return d`
      <div class="subratings-container">
        <div class="subrating">
          <span class="subrating-label">Quietness:</span>
          <div class="stars">${this.renderStars(t.quietnessRating)}</div>
        </div>
        <div class="subrating">
          <span class="subrating-label">Wifi Quality:</span>
          <div class="stars">${this.renderStars(t.wifiQualityRating)}</div>
        </div>
        <div class="subrating">
          <span class="subrating-label">Crowdedness:</span>
          <div class="stars">${this.renderStars(t.crowdednessRating)}</div>
        </div>
        <div class="subrating">
          <span class="subrating-label">Power Outlets:</span>
          <div class="stars">${this.renderStars(t.powerOutletRating)}</div>
        </div>
        <div class="subrating">
          <span class="subrating-label">Amenities:</span>
          <div class="stars">${this.renderStars(t.amenitiesRating)}</div>
        </div>
      </div>
    `}render(){var t,e;return this.loading?d`<div class="loading-spinner"></div>`:d`
      <main>
        <section class="profile-header">
          <h1>${(t=this.profile)==null?void 0:t.userid}'s Reviews (${(e=this.profile)==null?void 0:e.reviewsCount})</h1>
        </section>
        <section class="reviews-list">
          ${this.reviews.length===0?d`<p class="no-review">No reviews available.</p>`:this.reviews.map(i=>this.renderReview(i))}
        </section>
      </main>
    `}renderReview(t){const{overallRating:e,comment:i,createdAt:r,bestTimeToGo:o}=t,a=new Date(r).toLocaleDateString(),n=this.studySpotMap.get(t.spotId);return d`
      <div class="review-container">
        <div class="review-header">
          <a href="/app/study-spot/${t.spotId}" class="review-link">
            ${n?n.name:"Unknown Spot"}
          </a>
          <div class="stars">${this.renderStars(e)}</div>
          <drop-down iconSrc="/icons/three-dots.svg">
            <div class="dropdown-container">
              <a class="dropdown-option" href="my-reviews/${t._id}">Update</a>
              <div class="dropdown-option" @click="${()=>this.deleteReview(t._id,t,this.profile)}">Delete</div>
            </div>
          </drop-down>
        </div>
        <p class="review-date">${a}</p>
        <p class="review-best-time">Best Time to Go: ${o}</p>
        ${this.renderSubratings(t)}
        <p class="review-comment">${i}</p>
      </div>
    `}deleteReview(t,e,i){var l,g;if(console.log("Delete review",t),!confirm("Are you sure you want to delete this review?"))return;const r=(l=this.model.reviews)==null?void 0:l.findIndex(f=>f._id===t);if(r===void 0||r===-1){console.error("Review not found");return}this.dispatchMessage(["review/delete",{reviewId:t}]),this.model.reviews=(g=this.model.reviews)==null?void 0:g.filter(f=>f._id!==t);const o=this.studySpotMap.get(e.spotId);if(!o){console.error("Study spot not found");return}const a=o.ratings,n=o.reviewsCount||0;n===1?(a.quietness=0,a.wifiQuality=0,a.crowdedness=0,a.powerOutlets=0,a.amenities=0,a.overall=0):(a.quietness=(a.quietness*n-e.quietnessRating)/(n-1),a.wifiQuality=(a.wifiQuality*n-e.wifiQualityRating)/(n-1),a.crowdedness=(a.crowdedness*n-e.crowdednessRating)/(n-1),a.powerOutlets=(a.powerOutlets*n-e.powerOutletRating)/(n-1),a.amenities=(a.amenities*n-e.amenitiesRating)/(n-1),a.overall=(a.overall*n-e.overallRating)/(n-1)),this.dispatchMessage(["study-spot/update",{spotid:e.spotId,rating:a,reviewsCount:n-1,onSuccess:()=>{console.log("Study spot ratings updated successfully")},onFailure:f=>{console.error("Failed to update study spot ratings:",f)}}]),i&&this.dispatchMessage(["profile/save",{userid:i.userid,profile:{...i,reviewsCount:i.reviewsCount-1},onSuccess:()=>{console.log("Profile updated successfully")},onFailure:f=>{console.error("Failed to update profile:",f)}}])}};le.uses=U({"drop-down":bt}),le.styles=[E,xt,$`
      main {
        padding: var(--space-regular);
        max-width: 1200px;
        margin: 0 auto;
      }

      .profile-header {
        text-align: center;
        margin-bottom: var(--space-regular);
      }

      .profile-header h1 {
        font-size: var(--font-size-large);
        color: var(--color-secondary);
        margin: 0;
        padding-bottom: var(--space-regular);
      }

      .reviews-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-gap: var(--space-regular);
      }

      .reviews-list .no-review {
        grid-column: 1 / -1;
        text-align: center;
        font-size: 1.1rem;
        color: var(--color-text-primary);
      }

      .review-container {
        border: 1px solid #ccc;
        border-radius: var(--border-radius);
        padding: var(--space-regular);
        background-color: var(--color-background-secondary);
        transition: box-shadow 0.3s ease-in-out, transform 0.3s ease;
        overflow: hidden; /* Prevents content from spilling out */
      }

      .review-container:hover {
        box-shadow: var(--shadow-hover-large);
        transform: translateY(-5px);
      }

      .review-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-small);
      }

      .review-link {
        color: var(--color-primary);
        text-decoration: none;
        font-weight: bold;
      }

      .review-link:hover {
        text-decoration: underline;
      }

      .review-date {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        margin-bottom: var(--space-small);
      }

      .review-best-time {
        font-size: 0.875rem;
        color: var(--color-accent);
        margin-bottom: var(--space-small);
        font-weight: bold;
        background-color: var(--color-background-highlight);
        padding: var(--space-small);
        border-radius: var(--border-radius);
      }

      .review-comment {
        font-size: 1rem;
        color: var(--color-text-primary);
        margin-top: var(--space-small);
        font-style: italic;
        background-color: var(--color-background-highlight);
        padding: var(--space-small);
        border-radius: var(--border-radius);
      }

      .subratings-container {
        margin-top: var(--space-small);
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--space-small);
      }

      .subrating {
        display: flex;
        align-items: center;
      }

      .subrating-label {
        margin-right: var(--space-small);
        font-size: 0.875rem;
        color: var(--color-text-primary);
        width: 6rem; /* To align stars in a column */
      }

      .dropdown-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }

      .dropdown-option {
        padding: var(--space-small);
        cursor: pointer;
        color: var(--color-text-primary);
        border-radius: var(--border-radius);
        transition: background-color 0.3s ease;
        text-decoration: none;
        margin: 0;
      }

      .dropdown-option:hover {
        background-color: var(--color-primary);
        color: var(--color-background-primary);
      }

      .loading-spinner {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 8px solid var(--color-background-secondary);
        border-top: 8px solid var(--color-primary);
        border-radius: 50%;
        width: fit-content;
        height: fit-content;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `];let H=le;qt([w()],H.prototype,"reviews",1);qt([w()],H.prototype,"profile",1);qt([w()],H.prototype,"studySpots",1);qt([w()],H.prototype,"studySpotMap",1);qt([w()],H.prototype,"loading",2);var ta=Object.defineProperty,ot=(s,t,e,i)=>{for(var r=void 0,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=a(t,e,r)||r);return r&&ta(t,e,r),r};const ar=class ar extends I{constructor(){super("slostudyspots:model"),this.name="",this.address="",this.locationType="",this.customLocationType="",this.tags="",this.link="",this.createdBy="",this._authObserver=new T(this,"slostudyspots:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this.createdBy=t.username)})}render(){return d`
    <main>
      <section class="create-spot-container">
        <h2>Add a Study Spot</h2>
        <p>Note: Make sure it's a new study spot and not an already existing one!</p>
        </br>
            <form id="addSpotForm" autocomplete="off">
              <div class="form-group">
                <label for="name">Name of the Study Spot:</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  @change=${t=>this.name=t.target.value}
                  required
                />
              </div>
              <div class="form-group">
                <label for="address">Address:</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  @change=${t=>this.address=t.target.value}
                  required
                />
              </div>
              <div class="form-group">
                <label for="location-type">Location Type:</label>
                <select
                  name="location-type"
                  @change=${t=>this.locationType=t.target.value}
                  required
                >
                  <option value="">Select a type</option>
                  <option value="Cafe">Cafe</option>
                  <option value="Library">Library</option>
                  <option value="Park">Park</option>
                  <option value="Other">Other</option>
                </select>
                ${this.locationType==="Other"?d`
                <div class="form-group">
                  <label for="customLocationType">Custom Location Type:</label>
                  <input
                    type="text"
                    id="customLocationType"
                    name="customLocationType"
                    placeholder="Enter custom location type"
                    @change="${t=>this.customLocationType=t.target.value}"
                    .value="${this.customLocationType}"
                    required
                  />
                </div>`:""}
              </div>
              <div class="form-group">
                <label for="tags">Tags</label>
                <input
                  type="text"
                  name="tags"
                  placeholder="Tags (comma separated)"
                  @change=${t=>this.tags=t.target.value}
                />
              </div>
              <div class="form-group">
                <label for="website-link">Website (Optional):</label>
                <input
                  type="url"
                  name="link"
                  placeholder="http://example.com"
                  @change=${t=>this.link=t.target.value}
                />
              </div>
              <button type="submit" @click=${this.onSubmit}>Submit</button>
            </form>
      </section>
    </main>
    `}onSubmit(t){t.preventDefault();const e=this.tags.split(",").map(r=>r.trim()),i=this.locationType==="Other"?this.customLocationType:this.locationType;i&&e.push(i),this.dispatchMessage(["study-spot/add",{spot:{name:this.name,address:this.address,locationType:i,tags:e,link:this.link,createdBy:this.createdBy,ratings:{overall:0,quietness:0,wifiQuality:0,crowdedness:0,powerOutlets:0,amenities:0},reviewsCount:0,photos:[],hoursOfOperation:[]},onSuccess:()=>{console.log("Study spot saved successfully"),alert("Study Spot saved successfully!"),it.dispatch(this,"history/navigate",{href:"/app"})},onFailure:r=>{console.error("Failed to save study spot:",r),alert("Failed to save study spot")}}])}};ar.styles=[E,$`
      main {
        padding: var(--space-regular);
        flex-grow: 1;
      }

      .create-spot-container {
        width: 90%;
        max-width: 960px;
        margin: 40px auto;
        padding: 40px;
        background-color: var(--color-background-secondary);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-hover-med);
      }
      
      .create-spot-container h2 {
        color: var(--color-secondary);
        text-align: center;
        margin-bottom: 20px;
      }
      
      .create-spot-container a {
        background-color: var(--color-primary);
        color: var(--color-background-primary);
        text-decoration: none;
        padding: 12px 24px;
        border: none;
        border-radius: var(--border-radius);
        font-size: 1rem;
        margin-top: 10px;
        display: block;
        text-align: center;
      }
      
      .create-spot-container a:hover {
        background-color: var(--color-links);
      }
      
      .form-group {
        margin-bottom: var(--space-regular);
      }
      
      .form-group label {
        display: block;
        margin-bottom: 8px;
        color: var(--color-text-primary);
        font-weight: bold;
      }
      
      .form-group input,
      .form-group textarea {
        width: 100%;
        padding: 12px;
        border: 2px solid var(--color-primary);
        border-radius: var(--border-radius);
        box-sizing: border-box;
        outline: none;
      }
      
      .form-group input[type="text"]:focus,
      .form-group textarea:focus {
        border-color: var(--color-secondary);
      }

      button {
        background-color: var(--color-primary);
        color: var(--color-background-primary);
        border: none;
        border-radius: var(--border-radius);
        padding: 12px 24px;
        font-size: 1rem;
        cursor: pointer;
        display: block;
        margin: 20px auto 0;
      }

      .form-group select {
        width: 100%;
        padding: 12px;
        background-color: var(--color-background-primary);
        border: 2px solid var(--color-primary);
        border-radius: var(--border-radius);
        color: var(--color-text-primary);
        appearance: none; /* Removes default styling provided by the browser */
        background-repeat: no-repeat;
        background-position: right 12px center;
        cursor: pointer;
      }
      
      .form-group select:focus {
        border-color: var(--color-secondary);
        outline: none;
      }
    `];let z=ar;ot([y({type:String})],z.prototype,"name");ot([y({type:String})],z.prototype,"address");ot([y({type:String})],z.prototype,"locationType");ot([y({type:String})],z.prototype,"customLocationType");ot([y({type:String})],z.prototype,"tags");ot([y({type:String})],z.prototype,"link");ot([y({type:String})],z.prototype,"createdBy");var ea=Object.defineProperty,ra=(s,t,e,i)=>{for(var r=void 0,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=a(t,e,r)||r);return r&&ea(t,e,r),r};const nr=class nr extends I{constructor(){super("slostudyspots:model"),this.itemsToShow=5}get sortedStudySpots(){return[...this.model.studySpotIndex||[]].sort((t,e)=>{const i=e.ratings.overall-t.ratings.overall;return i!==0?i:e.reviewsCount-t.reviewsCount})}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["study-spot/index"])}renderStars(t){const e=Math.floor(t),i=t%1>=.5?1:0,r=5-e-i,o=[];for(let a=0;a<e;a++)o.push(d`<span class="star full"></span>`);i&&o.push(d`<span class="star half"></span>`);for(let a=0;a<r;a++)o.push(d`<span class="star empty"></span>`);return d`${o}`}render(){const t=e=>{const{name:i,ratings:r,reviewsCount:o}=e,{_id:a}=e;return d`
      <a href="study-spot/${a}">
        <li class="ranking">
          <div class="content">
            <h3>${i}</h3>
            <p><strong>Rating: </strong>${r.overall.toFixed(1)} ${this.renderStars(r.overall)} (${o} reviews)</p>
          </div>
        </li>
      </a>
    `};return d`
      <main>
        <section class="rankings-container">
          <h2>Top Rated Study Spots</h2>
          <ol>
            ${this.sortedStudySpots.slice(0,this.itemsToShow).map(t)}
          </ol>
        </section>
      </main>
    `}};nr.styles=[E,xt,$`
      main {
        padding: var(--space-regular);
        flex-grow: 1;
      }

      .rankings-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: var(--space-regular);
      }
      
      .rankings-container h2 {
        color: var(--color-secondary);
        text-align: center;
      }
      
      ol {
        list-style-type: none;
      }

      .ranking {
        background-color: var(--color-background-secondary);
        border: 1px solid var(--color-primary);
        border-radius: var(--border-radius);
        padding: 20px;
        box-shadow: var(--shadow-hover-small);
        transition: transform 0.3s ease;
        cursor: pointer;
        position: relative; /* Position relative for numbering */
        margin-bottom: 16px; /* Increased space between items */
      }
      
      .ranking:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-hover-large);
      }
      
      .ranking h3 {
        color: var(--color-primary);
        margin-bottom: 10px;
      }
      
      .ranking p {
        line-height: 1.5;
        color: var(--color-text-primary);
      }
      
      .ranking p strong {
        font-weight: bold;
      }
      
      .content {
        padding-left: 30px; /* Space for the number inside the box */
      }

      ol {
        counter-reset: ranking; /* Create a counter */
      }

      .ranking:before {
        content: counter(ranking) ". "; /* Add number before the content */
        counter-increment: ranking; /* Increment the counter */
        position: absolute;
        left: 10px; /* Position the number inside the box */
        top: 20px; /* Adjust vertical alignment */
        font-size: 1.2em; /* Larger number font */
        color: var(--color-primary); /* Color for the numbers */
      }

      a {
        text-decoration: none;
      }

      @media (max-width: 768px) {
        .rankings-container {
          padding: var(--space-small);
        }

        .ranking {
          padding: 15px;
          margin-bottom: 12px;
        }

        .ranking h3 {
          font-size: 1.1em;
          margin-bottom: 8px;
        }

        .ranking p {
          font-size: 0.9em;
        }

        .content {
          padding-left: 20px; /* Adjust padding for smaller screens */
        }

        .ranking:before {
          left: 5px; /* Adjust position for the number */
          top: 15px;
          font-size: 1em; /* Adjust font size for the number */
        }
      }

      @media (max-width: 480px) {
        .ranking {
          padding: 10px;
          margin-bottom: 8px;
        }

        .ranking h3 {
          font-size: 1em;
        }

        .ranking p {
          font-size: 0.8em;
        }

        .content {
          padding-left: 15px; /* Adjust padding for smaller screens */
        }

        .ranking:before {
          left: 3px; /* Adjust position for the number */
          top: 12px;
          font-size: 0.9em; /* Adjust font size for the number */
        }
      }
    `];let re=nr;ra([w(),w()],re.prototype,"itemsToShow");var ia=Object.defineProperty,sa=Object.getOwnPropertyDescriptor,L=(s,t,e,i)=>{for(var r=i>1?void 0:i?sa(t,e):t,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=(i?a(t,e,r):a(r))||r);return i&&r&&ia(t,e,r),r};const lr=class lr extends I{constructor(){super("slostudyspots:model"),this.quietnessRating=0,this.wifiQualityRating=0,this.crowdednessRating=0,this.powerOutletRating=0,this.amenitiesRating=0,this.comment="",this.bestTimeToGo="",this.overallRating=0,this.spotid="",this._authObserver=new T(this,"slostudyspots:auth")}get profile(){return this.model.profile}get studySpot(){return this.model.studySpot}attributeChangedCallback(t,e,i){super.attributeChangedCallback(t,e,i),t==="spot-id"&&e!==i&&i&&(console.log("Study spot being reviewed:",i),this.dispatchMessage(["study-spot/select",{spotid:i}]))}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this.profile||this.dispatchMessage(["profile/select",{userid:t.username}]))})}calculateOverallRating(){return(this.quietnessRating+this.wifiQualityRating+this.crowdednessRating+this.powerOutletRating+this.amenitiesRating)/5}render(){var t;return console.log("My Profile:",this.profile),console.log("Study Spot:",this.studySpot),d`
      <main>
        <section class="add-review">
          <h2>Add Your Review for ${(t=this.studySpot)==null?void 0:t.name}</h2>
            <form id="addReviewForm" autocomplete="off">
              <div class="star-form-group">
                <div class="label-container">
                  <label><strong>Quietness:</strong></label>
                  <p><small>Consider how quiet the area is</small></p>
                </div>
                <div class="star-rating">
                  <input type="radio" id="star5-quietness" name="quietnessRating" value="5" @change=${e=>this.quietnessRating=parseInt(e.target.value)} />
                  <label for="star5-quietness" title="5 stars">★</label>
                  <input type="radio" id="star4-quietness" name="quietnessRating" value="4" @change=${e=>this.quietnessRating=parseInt(e.target.value)} />
                  <label for="star4-quietness" title="4 stars">★</label>
                  <input type="radio" id="star3-quietness" name="quietnessRating" value="3" @change=${e=>this.quietnessRating=parseInt(e.target.value)} />
                  <label for="star3-quietness" title="3 stars">★</label>
                  <input type="radio" id="star2-quietness" name="quietnessRating" value="2" @change=${e=>this.quietnessRating=parseInt(e.target.value)} />
                  <label for="star2-quietness" title="2 stars">★</label>
                  <input type="radio" id="star1-quietness" name="quietnessRating" value="1" @change=${e=>this.quietnessRating=parseInt(e.target.value)} />
                  <label for="star1-quietness" title="1 star">★</label>
                </div>
              </div>
              <div class="star-form-group">
                <div class="label-container">
                  <label><strong>Wifi Quality:</strong></label>
                  <p><small>Consider the reliability and speed of the WiFi</small></p>
                </div>
                <div class="star-rating">
                  <input type="radio" id="star5-wifi" name="wifiQualityRating" value="5" @change=${e=>this.wifiQualityRating=parseInt(e.target.value)} />
                  <label for="star5-wifi" title="5 stars">★</label>
                  <input type="radio" id="star4-wifi" name="wifiQualityRating" value="4" @change=${e=>this.wifiQualityRating=parseInt(e.target.value)} />
                  <label for="star4-wifi" title="4 stars">★</label>
                  <input type="radio" id="star3-wifi" name="wifiQualityRating" value="3" @change=${e=>this.wifiQualityRating=parseInt(e.target.value)} />
                  <label for="star3-wifi" title="3 stars">★</label>
                  <input type="radio" id="star2-wifi" name="wifiQualityRating" value="2" @change=${e=>this.wifiQualityRating=parseInt(e.target.value)} />
                  <label for="star2-wifi" title="2 stars">★</label>
                  <input type="radio" id="star1-wifi" name="wifiQualityRating" value="1" @change=${e=>this.wifiQualityRating=parseInt(e.target.value)} />
                  <label for="star1-wifi" title="1 star">★</label>
                </div>
              </div>
              <div class="star-form-group">
                <div class="label-container">
                  <label><strong>Crowdedness:</strong></label>
                  <p><small>Consider how uncrowded the spot is</small></p>
                </div>
                <div class="star-rating">
                  <input type="radio" id="star5-crowd" name="crowdednessRating" value="5" @change=${e=>this.crowdednessRating=parseInt(e.target.value)} />
                  <label for="star5-crowd" title="5 stars">★</label>
                  <input type="radio" id="star4-crowd" name="crowdednessRating" value="4" @change=${e=>this.crowdednessRating=parseInt(e.target.value)} />
                  <label for="star4-crowd" title="4 stars">★</label>
                  <input type="radio" id="star3-crowd" name="crowdednessRating" value="3" @change=${e=>this.crowdednessRating=parseInt(e.target.value)} />
                  <label for="star3-crowd" title="3 stars">★</label>
                  <input type="radio" id="star2-crowd" name="crowdednessRating" value="2" @change=${e=>this.crowdednessRating=parseInt(e.target.value)} />
                  <label for="star2-crowd" title="2 stars">★</label>
                  <input type="radio" id="star1-crowd" name="crowdednessRating" value="1" @change=${e=>this.crowdednessRating=parseInt(e.target.value)} />
                  <label for="star1-crowd" title="1 star">★</label>
                </div>
              </div>
              <div class="star-form-group">
                <div class="label-container">
                  <label><strong>Power Outlets:</strong></label>
                  <p><small>Consider the availability of power outlets</small></p>
                </div>
                <div class="star-rating">
                  <input type="radio" id="star5-power" name="powerOutletRating" value="5" @change=${e=>this.powerOutletRating=parseInt(e.target.value)} />
                  <label for="star5-power" title="5 stars">★</label>
                  <input type="radio" id="star4-power" name="powerOutletRating" value="4" @change=${e=>this.powerOutletRating=parseInt(e.target.value)} />
                  <label for="star4-power" title="4 stars">★</label>
                  <input type="radio" id="star3-power" name="powerOutletRating" value="3" @change=${e=>this.powerOutletRating=parseInt(e.target.value)} />
                  <label for="star3-power" title="3 stars">★</label>
                  <input type="radio" id="star2-power" name="powerOutletRating" value="2" @change=${e=>this.powerOutletRating=parseInt(e.target.value)} />
                  <label for="star2-power" title="2 stars">★</label>
                  <input type="radio" id="star1-power" name="powerOutletRating" value="1" @change=${e=>this.powerOutletRating=parseInt(e.target.value)} />
                  <label for="star1-power" title="1 star">★</label>
                </div>
              </div>
              <div class="star-form-group">
                <div class="label-container">
                  <label><strong>Amenities:</strong></label>
                  <p><small>Consider the availability and quality of amenities</small></p>
                </div>
                <div class="star-rating">
                  <input type="radio" id="star5-amenities" name="amenitiesRating" value="5" @change=${e=>this.amenitiesRating=parseInt(e.target.value)} />
                  <label for="star5-amenities" title="5 stars">★</label>
                  <input type="radio" id="star4-amenities" name="amenitiesRating" value="4" @change=${e=>this.amenitiesRating=parseInt(e.target.value)} />
                  <label for="star4-amenities" title="4 stars">★</label>
                  <input type="radio" id="star3-amenities" name="amenitiesRating" value="3" @change=${e=>this.amenitiesRating=parseInt(e.target.value)} />
                  <label for="star3-amenities" title="3 stars">★</label>
                  <input type="radio" id="star2-amenities" name="amenitiesRating" value="2" @change=${e=>this.amenitiesRating=parseInt(e.target.value)} />
                  <label for="star2-amenities" title="2 stars">★</label>
                  <input type="radio" id="star1-amenities" name="amenitiesRating" value="1" @change=${e=>this.amenitiesRating=parseInt(e.target.value)} />
                  <label for="star1-amenities" title="1 star">★</label>
                </div>
              </div>
              <div class="form-group">
                <label for="comment">Comment:</label>
                <textarea
                  name="comment"
                  id="comment"
                  rows="4"
                  cols="50"
                  @change=${e=>this.comment=e.target.value}
                  required
                ></textarea>
              </div>
              <div class="form-group">
                <label>Best Time to Go:</label>
                <input
                  type="text"
                  name="bestTimeToGo"
                  rows="4"
                  cols="50"
                  @change=${e=>this.bestTimeToGo=e.target.value}
                />
              </div>
              <button type="submit" @click=${this.onSubmit} class="btn-large">Submit</button>
            </form>
        </section>
      </main>
    `}onSubmit(t){if(t.preventDefault(),this.overallRating=this.calculateOverallRating(),!this.profile){console.error("Current user not found");return}const e={userId:this.profile,spotId:this.spotid,quietnessRating:this.quietnessRating,wifiQualityRating:this.wifiQualityRating,crowdednessRating:this.crowdednessRating,powerOutletRating:this.powerOutletRating,amenitiesRating:this.amenitiesRating,overallRating:this.overallRating,comment:this.comment,bestTimeToGo:this.bestTimeToGo,createdAt:new Date,likes:0,edited:!1};this.updateStudySpotRatings(e),this.dispatchMessage(["review/add",{review:e,onSuccess:()=>{console.log("Review saved successfully"),it.dispatch(this,"history/navigate",{href:`/app/study-spot/${this.spotid}`})},onFailure:i=>{console.error("Failed to save review:",i),alert("Failed to save review!")}}])}updateStudySpotRatings(t){if(!this.studySpot){console.error("Study spot not found");return}const e=this.studySpot.ratings,i=this.studySpot.reviewsCount||0;e.quietness=(e.quietness*i+t.quietnessRating)/(i+1),e.wifiQuality=(e.wifiQuality*i+t.wifiQualityRating)/(i+1),e.crowdedness=(e.crowdedness*i+t.crowdednessRating)/(i+1),e.powerOutlets=(e.powerOutlets*i+t.powerOutletRating)/(i+1),e.amenities=(e.amenities*i+t.amenitiesRating)/(i+1),e.overall=(e.overall*i+t.overallRating)/(i+1),this.dispatchMessage(["study-spot/update",{spotid:this.spotid,rating:e,reviewsCount:i+1,onSuccess:()=>{console.log("Study spot ratings updated successfully")},onFailure:r=>{console.error("Failed to update study spot ratings:",r)}}])}};lr.styles=[E,$`
      main {
        padding: var(--space-regular);
        flex-grow: 1;
      }

      .form-group {
        margin-bottom: var(--space-regular);
      }
      
      .form-group label {
        display: block;
        margin-bottom: 8px;
        color: var(--color-text-primary);
        font-weight: bold;
      }
      
      .form-group input[type="text"],
      .form-group textarea {
        width: 100%;
        padding: 12px;
        border: 2px solid var(--color-primary);
        border-radius: var(--border-radius);
        box-sizing: border-box;
        outline: none;
      }

      textarea {
        height: 100px;
        resize: vertical;
      }
      
      .form-group input[type="text"]:focus,
      .form-group textarea:focus {
        border-color: var(--color-secondary);
      }

      .add-review {
        background-color: var(--color-background-secondary);
        padding: 20px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-hover-small);
        margin: 20px auto;
        width: 90%;
        max-width: 800px;
      }
      
      .add-review h2 {
        text-align: center;
        color: var(--color-secondary);
        padding-bottom: 20px;
      }
      
      .star-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      
      .star-container label {
        margin-right: 20px;
        white-space: nowrap;
      }
      
      .star-form-group {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 20px;
        /* border-bottom: 2px solid var(--color-primary); */
        margin-bottom: 20px;
      }

      .label-container {
        display: flex;
        flex-direction: column;
        margin-bottom: 5px;
      }

      .label-container label {
        color: var(--color-text-primary);
        font-weight: bold;
      }

      .label-container small {
        color: var(--color-text-secondary, #666);
        font-size: 0.8em;
      }
      
      .star-form-group label {
        margin-right: 20px;
        white-space: nowrap; /* Prevents the label from breaking into multiple lines */
      }
      
      /* Star Rating Styles */
      /* .star-rating {
        display: inline-block; /* Aligns the stars horizontally *
      } */
      
      .star-rating input[type='radio'] {
        display: none; /* Hide radio buttons */
      }
      
      .star-rating label {
        float: right;
        padding: 5px;
        font-size: 30px;
        color: #ccc;
        transition: all 0.3s ease;
        cursor: pointer;
      }
      
      .star-rating label:hover,
      .star-rating label:hover ~ label,
      .star-rating input[type='radio']:checked ~ label {
        /* color: #f5d315; */
        color: var(--color-links);
        transform: scale(1.3);
      }

      .btn-large {
        width: 100%;
        padding: 12px;
        background-color: var(--color-primary);
        color: var(--color-background-primary);
        font-size: 1.1rem;
        border-radius: var(--border-radius);
        cursor: pointer;
        border: none;
        transition: background-color 0.3s ease;
      }

      .btn-large:hover {
        background-color: var(--color-links);
      }

      @media (max-width: 768px) {
        .star-form-group {
          flex-direction: column;
        }

        .label-container {
          text-align: center;
        }

        .star-form-group label {
          margin-bottom: 4px; /* Adds space between the label and input on smaller screens */
        }

        .add-review {
          padding: 10px;
          width: 100%;
        }

        .form-group input[type="text"],
        .form-group textarea {
          padding: 8px; /* Smaller padding on smaller screens */
        }

        .btn-large {
          font-size: 0.9rem; /* Smaller font size on smaller screens */
        }
      }
    `];let C=lr;L([y({type:Number})],C.prototype,"quietnessRating",2);L([y({type:Number})],C.prototype,"wifiQualityRating",2);L([y({type:Number})],C.prototype,"crowdednessRating",2);L([y({type:Number})],C.prototype,"powerOutletRating",2);L([y({type:Number})],C.prototype,"amenitiesRating",2);L([y({type:String})],C.prototype,"comment",2);L([y({type:String})],C.prototype,"bestTimeToGo",2);L([y({type:Number})],C.prototype,"overallRating",2);L([w()],C.prototype,"profile",1);L([y({attribute:"spot-id",reflect:!0})],C.prototype,"spotid",2);L([w()],C.prototype,"studySpot",1);var oa=Object.defineProperty,aa=(s,t,e,i)=>{for(var r=void 0,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=a(t,e,r)||r);return r&&oa(t,e,r),r};const cr=class cr extends R{constructor(){super(...arguments),this.username="anonymous",this._authObserver=new T(this,"slostudyspots:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t?this.username=t.username:this.username="anonymous"})}render(){return d`
      <div class="profile-content">
        <div class="profile-header">
          <h2>Account</h2>
          <div class="inline"> 
            Hello,
            ${this.username?d`<p>${this.username}</p>`:d``}
            <!-- <p>· Go to</p>
            <a class="link" href="/app/profile/${this.username}">Profile</a> -->
          </div>
        </div>

        <div class="profile-tabs">
          <div @click=${()=>this.navigateTo("/app/profile/"+this.username)}>
            <img src="/icons/avatar.svg" alt="profile-icon" />
            <h3>My Personal Info</h3>
            <p>View your personal account information</p>
          </div>
          <div @click=${()=>this.navigateTo("/app/my-reviews")}>
            <img src="/icons/review-icon.svg" alt="review-icon" />
            <h3>My Reviews</h3>
            <p>View your reviews</p>
          </div>
          <div @click=${()=>this.navigateTo("/app/my-fav-spots")}>
            <img src="/icons/favorite-icon.svg" alt="fav-spot-icon" />
            <h3>My Favorite Spots</h3>
            <p>View your saved favorite spots</p>
          </div>
        </div>
      </div>
    `}navigateTo(t){it.dispatch(this,"history/navigate",{href:t})}};cr.styles=[E,$`
      .inline {
        margin-top: 10px;
        display: flex;
        gap: 5px;
        color: var(--color-text-primary);
        justify-content: center;
      }

      .profile-content {
        margin: 40px;
      }

      .profile-header {
        margin-top: 50px;
        color: var(--color-primary);
      }

      .profile-header h2 {
        font-size: 25px;
        font-weight: 600;
        color: var(--color-secondary);
        text-align: center;
      }

      .profile-tabs {
        margin-top: 40px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 20px;
      }

      .profile-tabs h3 {
        font-size: 15px;
        font-weight: 600;
        color: var(--color-text-secondary);
        background-color: inherit;
      }

      .profile-tabs p {
        margin-top: 15px;
        font-size: 14px;
        font-weight: 300;
        color: var(--color-text-secondary);
        <!-- background-color: inherit; -->
      }

      .profile-tabs img {
        width: 40px;
        margin-bottom: 10px;
        filter: var(--invert-black-to-white);
      }

      @media screen and (max-width: 988px) {
        .profile-tabs {
          grid-template-columns: 1fr;
        }
        <!-- .profile-content {
          margin: 0px;
        } -->
      }

      .profile-tabs div {
        box-shadow: var(--shadow-hover-small);
        padding: 20px;
        text-decoration: none;
        background-color: var(--color-background-secondary);
        border-radius: var(--border-radius);
      }

      .profile-tabs div:hover {
        cursor: pointer;
        box-shadow: var(--shadow-hover-large);
      }

      .link {
        text-decoration: underline;
      }

      .link:hover {
        cursor: pointer;
      }
    `];let ie=cr;aa([w()],ie.prototype,"username");var na=Object.defineProperty,la=Object.getOwnPropertyDescriptor,Xe=(s,t,e,i)=>{for(var r=i>1?void 0:i?la(t,e):t,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=(i?a(t,e,r):a(r))||r);return i&&r&&na(t,e,r),r};const ce=class ce extends I{constructor(){super("slostudyspots:model"),this.reviewId="",this._authObserver=new T(this,"slostudyspots:auth"),this.addEventListener("mu-form:submit",t=>this._handleSubmit(t))}get review(){return this.model.review}get studySpot(){return this.model.studySpot}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&this.reviewId&&!this.review&&this.fetchReview(this.reviewId)})}attributeChangedCallback(t,e,i){super.attributeChangedCallback(t,e,i),t==="review-id"&&e!==i&&i&&!this.review&&(console.log("Update Review Page:",i),this.fetchReview(i))}fetchReview(t){this.dispatchMessage(["review/select",{reviewId:t}])}updated(t){super.updated(t),this.review&&!this.studySpot&&this.fetchStudySpot(this.review.spotId),this.review&&!this.oldReview&&(this.oldReview={...this.review},console.log("Old review set:",this.oldReview))}fetchStudySpot(t){this.dispatchMessage(["study-spot/select",{spotid:t}])}render(){return!this.review||!this.studySpot?d`<p>Loading...</p>`:d`
      <main>
        <a href="/app/my-reviews">← Back to my Reviews</a>
        <h1>Update Review for ${this.studySpot.name}</h1>
        <mu-form .init=${this.review}>
          <label>
            <span>Comment:</span>
            <textarea name="comment"></textarea>
          </label>
          <label>
            <span>Best Time to Go:</span>
            <input name="bestTimeToGo" type="text">
          </label>
          ${this.renderRatingInputs()}
        </mu-form>
      </main>
    `}renderRatingInputs(){return d`
      ${["quietnessRating","wifiQualityRating","crowdednessRating","powerOutletRating","amenitiesRating"].map(e=>d`
        <label>
          <span>${this.modifyField(e)}:</span>
          <input name="${e}" type="number" min="0" max="5" step="1">
        </label>
      `)}
    `}modifyField(t){return t=t.replace("Rating",""),t.charAt(0).toUpperCase()+t.slice(1)}_handleSubmit(t){console.log("Handling submit of mu-form"),console.log("Form values:",t.detail);const e={...this.review,...t.detail};e.quietnessRating=Number(e.quietnessRating),e.wifiQualityRating=Number(e.wifiQualityRating),e.crowdednessRating=Number(e.crowdednessRating),e.powerOutletRating=Number(e.powerOutletRating),e.amenitiesRating=Number(e.amenitiesRating),e.overallRating=0,console.log("UPDATED REVIEW (before):",e),e.edited=!0,e.overallRating=(e.quietnessRating+e.wifiQualityRating+e.crowdednessRating+e.powerOutletRating+e.amenitiesRating)/5,console.log("OVERALL RATING:",e.overallRating),console.log("UPDATED REVIEW (after):",e),this.dispatchMessage(["review/update",{review:e,onSuccess:()=>{this.updateStudySpotRatings(e),it.dispatch(this,"history/navigate",{href:"/app/my-reviews"})},onFailure:i=>console.log("ERROR:",i)}])}updateStudySpotRatings(t){var o;const e=this.studySpot;if(!e){console.error("Study spot not found");return}const i=e.ratings,r=e.reviewsCount;if(!this.oldReview){console.error("Old review not found");return}i.quietness=(i.quietness*r-this.oldReview.quietnessRating+t.quietnessRating)/r,i.wifiQuality=(i.wifiQuality*r-this.oldReview.wifiQualityRating+t.wifiQualityRating)/r,i.crowdedness=(i.crowdedness*r-this.oldReview.crowdednessRating+t.crowdednessRating)/r,i.powerOutlets=(i.powerOutlets*r-this.oldReview.powerOutletRating+t.powerOutletRating)/r,i.amenities=(i.amenities*r-this.oldReview.amenitiesRating+t.amenitiesRating)/r,i.overall=(i.overall*r-this.oldReview.overallRating+t.overallRating)/r,this.dispatchMessage(["study-spot/update",{spotid:((o=this.review)==null?void 0:o.spotId)||"",rating:i,reviewsCount:r,onSuccess:()=>{console.log("Study spot ratings updated successfully")},onFailure:a=>{console.error("Failed to update study spot ratings:",a)}}])}};ce.uses=U({"mu-form":Jr.Element}),ce.styles=[E,xt,$`
      main {
        padding: var(--space-regular);
        max-width: 900px;
        margin: 0 auto;
        text-align: center;
      }

      h1 {
        font-size: var(--font-size-large);
        color: var(--color-secondary);
        margin-bottom: var(--space-regular);
        text-align: center;
        padding-top: var(--space-regular);
      }

      mu-form {
        display: grid;
        gap: var(--space-regular);
      }

      label {
        display: grid;
        gap: var(--space-small);
      }

      span {
        font-weight: bold;
        color: var(--color-text-primary);
      }

      input[type="number"],
      input[type="text"],
      textarea {
        width: 100%;
        padding: var(--space-small);
        border: 1px solid #ccc;
        border-radius: var(--border-radius);
        font-size: var(--font-size-body);
      }

      textarea {
        height: 100px;
        resize: vertical;
      }

      button {
        background-color: var(--color-primary);
        color: var(--color-background-primary);
        border: none;
        padding: var(--space-small) var(--space-regular);
        border-radius: var(--border-radius);
        font-size: var(--font-size-body);
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      button:hover {
        background-color: var(--color-links);
      }

      a {
        color: var(--color-links);
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }
    `];let wt=ce;Xe([y({attribute:"review-id",reflect:!0})],wt.prototype,"reviewId",2);Xe([w()],wt.prototype,"review",1);Xe([w()],wt.prototype,"studySpot",1);var ca=Object.defineProperty,me=(s,t,e,i)=>{for(var r=void 0,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=a(t,e,r)||r);return r&&ca(t,e,r),r};const dr=class dr extends R{constructor(){super(...arguments),this.url="",this.uploadedBy="",this.uploadDate="",this.open=!1}_close(){this.open=!1;const t=new CustomEvent("close-popup",{detail:{closed:!0}});this.dispatchEvent(t)}_handleOverlayClick(t){t.target.classList.contains("overlay")&&this._close()}render(){return console.log("Rendering ImageViewer with URL:",this.url),d`
      <div class="overlay" @click=${this._handleOverlayClick}>
        <div class="popup">
          <img
            class="close-btn"
            src="/icons/close.svg"
            alt="close"
            width="30px"
            @click=${this._close}
          />
          <img src="${this.url}" alt="Image">
          <div class="details">
            <p>Uploaded by: ${this.uploadedBy}</p>
            <p>Upload date: ${new Date(this.uploadDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    `}};dr.styles=$`
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      visibility: hidden;
      opacity: 0;
      transition: opacity 0.3s, visibility 0.3s;
      z-index: 1000;
      overflow: auto;
    }

    :host([open]) {
      visibility: visible;
      opacity: 1;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .popup {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--color-background-secondary);
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      max-width: 90%;
      max-height: 90%;
      overflow: auto;
      box-sizing: border-box;
      z-index: 1001; /* Ensure it is above the overlay */
    }

    .popup img {
      max-width: 100%;
      height: auto;
      display: block;
      margin-bottom: 10px;
    }

    .popup .details {
      font-size: 14px;
      color: var(--color-text-secondary);
      display: flex;
      justify-content: space-between;
    }

    .popup .close-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: #ff0000;
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      cursor: pointer;
    }

    .close-btn:hover {
      transform: scale(1.1);
    }

    @media (max-width: 600px) {
      .popup {
        width: 95%;
        height: auto;
        padding: 10px;
      }

      .popup img {
        width: 100%;
        height: auto;
      }

      .popup .close-btn {
        width: 25px;
        height: 25px;
        font-size: 16px;
      }
    }

    @media (max-width: 400px) {
      .popup {
        width: 100%;
        height: auto;
        padding: 5px;
      }

      .popup img {
        width: 100%;
        height: auto;
      }

      .popup .close-btn {
        width: 20px;
        height: 20px;
        font-size: 14px;
      }
    }
  `;let et=dr;me([y({type:String})],et.prototype,"url");me([y({type:String})],et.prototype,"uploadedBy");me([y({type:String})],et.prototype,"uploadDate");me([y({type:Boolean,reflect:!0})],et.prototype,"open");var da=Object.defineProperty,pa=Object.getOwnPropertyDescriptor,ve=(s,t,e,i)=>{for(var r=i>1?void 0:i?pa(t,e):t,o=s.length-1,a;o>=0;o--)(a=s[o])&&(r=(i?a(t,e,r):a(r))||r);return i&&r&&da(t,e,r),r};const de=class de extends I{constructor(){super("slostudyspots:model"),this.spotid="",this.selectedPhoto=null,this.selectedFile=null,this.username="anonymous",this._authObserver=new T(this,"slostudyspots:auth")}get studySpot(){return this.model.studySpot}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t?this.username=t.username:this.username="anonymous"})}attributeChangedCallback(t,e,i){super.attributeChangedCallback(t,e,i),t==="spot-id"&&e!==i&&i&&(console.log("Study Spot Page:",i),this.dispatchMessage(["study-spot/select",{spotid:i}]))}_viewImage(t){console.log("Photo clicked:",t),this.selectedPhoto=t}_closeViewer(){this.selectedPhoto=null}goBack(){window.history.back()}render(){var e,i,r;const{photos:t}=this.studySpot||{};return console.log("PHOTOS",t),console.log("USERNAME",this.username),d`
      <main>
        <section class="photo-upload">
          <a href="/app/study-spot/${this.spotid}">← Back to ${(e=this.studySpot)==null?void 0:e.name}</a>
          <!-- <a href="#" @click=${this.goBack}>← Back to ${(i=this.studySpot)==null?void 0:i.name}</a> -->
          <h2>Upload Your Photos</h2>
          ${this.username==="anonymous"?d`
            <a href="/app/login">Please sign in to upload photos.</a>
          `:d`
            <form @submit=${this._handleFileUpload}>
              <input
                  type="file"
                  @change=${this._handleFileSelected} />
              <button type="submit" class="btn-add-photo">
                <img src="/icons/upload-photo.svg" alt="Add Photo Icon" class="btn-icon-white">
                Upload Photo
              </button>
            </form>
          `}
        </section>

        <section class="gallery">
          <h2>Photos for ${(r=this.studySpot)==null?void 0:r.name}</h2>
          ${t&&t.length>0?t.map(o=>d`
              <div class="photo" @click=${()=>this._viewImage(o)}>
                <img src="${o.url}">
                <!-- <div class="photo-details">
                  <p>Uploaded by: ${o.uploadedBy}</p>
                  <p>Upload date: ${new Date(o.uploadDate).toLocaleDateString()}</p>
                </div> -->
              </div>
            `):d`
            <p>No photos available.</p>
          `}
        </section>

        ${this.selectedPhoto?d`
          <image-viewer
            url="${this.selectedPhoto.url}"
            uploadedBy="${this.selectedPhoto.uploadedBy}"
            uploadDate="${this.selectedPhoto.uploadDate}"
            ?open="${!!this.selectedPhoto}"
            @close-popup=${this._closeViewer}
          ></image-viewer>
        `:""}
      </main>
    `}_handleFileSelected(t){const e=t.target;this.selectedFile=e.files[0]}_handleFileUpload(t){if(t.preventDefault(),this.username==="anonymous"){alert("Please sign in to upload photos.");return}!this.selectedFile||!this.spotid||this._readFileAsArrayBuffer(this.selectedFile).then(e=>{const{name:i,size:r,type:o}=this.selectedFile,a=new URLSearchParams({filename:i,studySpotId:this.spotid,username:this.username}),n=new URL("/photos",document.location.origin);n.search=a.toString(),console.log("Uploading file:",this.selectedFile),fetch(n,{method:"POST",headers:{"Content-Type":o,"Content-Length":r.toString()},body:e}).then(l=>{if(l.status===201)return l.json();throw new Error(`Upload failed with status: ${l.status}`)}).then(l=>{console.log("Image has been uploaded to",l.url),alert("Photo uploaded successfully!"),this.selectedFile=null,this.dispatchMessage(["study-spot/select",{spotid:this.spotid}])}).catch(l=>{console.log("Upload failed",l),alert("Upload failed. Please try again.")})}).catch(e=>{console.log("File reading failed",e),alert("File reading failed. Please try again.")})}_readFileAsArrayBuffer(t){return new Promise((e,i)=>{const r=new FileReader;r.onload=()=>e(r.result),r.onerror=o=>i(o),r.readAsArrayBuffer(t)})}};de.uses=U({"image-viewer":et}),de.styles=[E,$`
      .photo-upload {
        background-color: var(--color-background-primary);
        padding: 20px;
        border-radius: var(--border-radius);
        text-align: center;
        margin: var(--space-regular);
        /* box-shadow: var(--shadow-hover-small); */
      }

      .photo-upload h2 {
        color: var(--color-secondary);
        padding-top: var(--space-regular);
      }

      .photo-upload form {
        margin-top: 20px;
      }

      .photo-upload input[type="file"] {
        margin-bottom: 10px;
      }

      .btn-add-photo {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: var(--color-primary);
        color: white;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: var(--border-radius);
        margin: 0 10px;
        border: none;
      }
      
      .btn-add-photo:hover, .btn-write-review:hover, .feature-tag:hover {
        background-color: var(--color-links);
        cursor: pointer; /* prob not needed for tags once it can be clicked */
      }

      .btn-icon-white {
        height: 20px;
        width: auto;
        margin-right: 8px;
        filter: brightness(0) invert(1);
      }

      .gallery {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        grid-gap: 20px;
        padding: var(--space-regular);
      }

      .gallery h2 {
        grid-column: 1 / -1;
        text-align: center;
        color: var(--color-secondary);
      }

      .gallery p {
        grid-column: 1 / -1;
        text-align: center;
      }

      .photo {
        height: 200px;
        overflow: hidden;
        position: relative;
        cursor: pointer;
        background-color: #eee;
        border-radius: var(--border-radius);
      }

      .photo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .photo-upload {
        margin: var(--space-regular) 0;
      }

      .photo-upload a {
        color: var(--color-links);
        text-decoration: none;
      }

      .photo-upload a:hover {
        text-decoration: underline;
      }

      .photo-upload form {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .photo-upload button {
        margin-top: var(--space-small);
      }
    `];let rt=de;ve([y({attribute:"spot-id",reflect:!0})],rt.prototype,"spotid",2);ve([w()],rt.prototype,"studySpot",1);ve([y({type:Object})],rt.prototype,"selectedPhoto",2);ve([w()],rt.prototype,"username",2);const pr=class pr extends I{render(){return d`
      <div class="coming-soon-container">
        <div class="animation-container">
          <img src="/gifs/shooting-star.gif" alt="Gifer Animated Gif" />
        </div>
        <h1 class="coming-soon-title">Coming Soon</h1>
        <p class="coming-soon-message">
          This feature is currently under development. Check back later!
        </p>
      </div>
    `}};pr.styles=[E,xt,$`
      .coming-soon-container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 70vh;
        color: var(--color-text-primary);
        text-align: center;
        flex-direction: column;
        position: relative;
      }

      .coming-soon-title {
        font-size: 3rem;
        margin-bottom: 16px;
      }

      .coming-soon-message {
        font-size: 1.3rem;
      }

      .coming-soon-title, .coming-soon-message {
        animation: fadeIn 2s ease-in-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animation-container {
        animation: fadeIn 2s ease-in-out;
      }

      .animation-container img {
        max-width: 180px; /* Adjust size as needed */
      }
    `];let Me=pr;const ha=[{auth:"protected",path:"/app/profile/:id/edit",view:s=>d`
      <profile-view edit user-id=${s.id}></profile-view>
    `},{auth:"protected",path:"/app/profile/:id",view:s=>d`
      <profile-view user-id=${s.id}></profile-view>
    `},{auth:"protected",path:"/app/account",view:()=>d`
      <account-view></account-view>
    `},{path:"/app/study-spot/:id",view:s=>d`
      <study-spot-view spot-id=${s.id}></study-spot-view>
    `},{path:"/app/study-spot/:id/gallery",view:s=>d`
      <gallery-view spot-id=${s.id}></gallery-view>
    `},{auth:"protected",path:"/app/add-spot",view:()=>d`
      <add-spot-view></add-spot-view>
    `},{auth:"protected",path:"/app/add-review/:id",view:s=>d`
      <add-review-view spot-id=${s.id}></add-review-view>
    `},{path:"/app/rankings",view:()=>d`
      <rankings-view></rankings-view>
    `},{auth:"protected",path:"/app/my-reviews",view:()=>d`
      <user-review-view></user-review-view>
    `},{auth:"protected",path:"/app/my-reviews/:id",view:s=>d`
      <update-review-view review-id=${s.id}></update-review-view>
    `},{auth:"protected",path:"/app/my-fav-spots",view:()=>d`
      <favorite-spots-view></favorite-spots-view>
    `},{path:"/app/login",view:()=>d` <login-view></login-view> `},{path:"/app/register",view:()=>d` <register-view></register-view> `},{path:"/app",view:()=>d`
      <home-view></home-view>
    `},{path:"/",redirect:"/app"},{path:"/app/:path*",redirect:"/app"},{path:"/:path*",redirect:"/app"}];U({"mu-auth":M.Provider,"mu-history":it.Provider,"mu-store":class extends is.Provider{constructor(){super(wo,bo,"slostudyspots:auth")}},"mu-switch":class extends Ws.Element{constructor(){super(ha,"slostudyspots:history","slostudyspots:auth")}updated(t){super.updated(t),window.scrollTo(0,0)}},"nav-header":zt,"profile-view":X,"login-view":ze,"register-view":je,"home-view":V,"study-spot-view":tt,"add-spot-view":z,"rankings-view":re,"add-review-view":C,"user-review-view":H,"account-view":ie,"update-review-view":wt,"gallery-view":rt,"favorite-spots-view":Me});
