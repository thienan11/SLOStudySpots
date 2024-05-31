(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();var ye;class rt extends Error{}rt.prototype.name="InvalidTokenError";function Hs(r){return decodeURIComponent(atob(r).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function js(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Hs(t)}catch{return atob(t)}}function Ye(r,t){if(typeof r!="string")throw new rt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=r.split(".")[e];if(typeof s!="string")throw new rt(`Invalid token specified: missing part #${e+1}`);let i;try{i=js(s)}catch(n){throw new rt(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(i)}catch(n){throw new rt(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const Is="mu:context",Kt=`${Is}:change`;class zs{constructor(t,e){this._proxy=Ds(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class te extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new zs(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Kt,t),t}detach(t){this.removeEventListener(Kt,t)}}function Ds(r,t){return new Proxy(r,{get:(s,i,n)=>{if(i==="then")return;const o=Reflect.get(s,i,n);return console.log(`Context['${i}'] => `,o),o},set:(s,i,n,o)=>{const l=r[i];console.log(`Context['${i.toString()}'] <= `,n);const a=Reflect.set(s,i,n,o);if(a){let p=new CustomEvent(Kt,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(p,{property:i,oldValue:l,value:n}),t.dispatchEvent(p)}else console.log(`Context['${i}] was not set to ${n}`);return a}})}function Fs(r,t){const e=Ke(t,r);return new Promise((s,i)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else i({context:t,reason:`No provider for this context "${t}:`})})}function Ke(r,t){const e=`[provides="${r}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const i=t.getRootNode();if(i instanceof ShadowRoot)return Ke(r,i.host)}class Vs extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function Ze(r="mu:message"){return(t,...e)=>t.dispatchEvent(new Vs(e,r))}class ee{constructor(t,e,s="service:message",i=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=i}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function Bs(r){return t=>({...t,...r})}const Zt="mu:auth:jwt",bt=class Ge extends ee{constructor(t,e){super((s,i)=>this.update(s,i),t,Ge.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:i}=t[1];return e(Js(s)),Ft(i);case"auth/signout":return e(_e()),Ft(this._redirectForLogin);case"auth/redirect":return e(_e()),Ft(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};bt.EVENT_TYPE="auth:message";bt.dispatch=Ze(bt.EVENT_TYPE);let qs=bt;function Ft(r,t={}){if(!r)return;const e=window.location.href,s=new URL(r,e);return Object.entries(t).forEach(([i,n])=>s.searchParams.set(i,n)),()=>{console.log("Redirecting to ",r),window.location.assign(s)}}class Ws extends te{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){super({user:q.authenticateFromLocalStorage()})}connectedCallback(){new qs(this.context,this.redirect).attach(this)}}class B{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(Zt),t}}class q extends B{constructor(t){super();const e=Ye(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new q(t);return localStorage.setItem(Zt,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(Zt);return t?q.authenticate(t):new B}}function Js(r){return Bs({user:q.authenticate(r),token:r})}function _e(){return r=>{const t=r.user;return{user:t&&t.authenticated?B.deauthenticate(t):t,token:""}}}function Ys(r){return r.authenticated?{Authorization:`Bearer ${r.token||"NO_TOKEN"}`}:{}}function Ks(r){return r.authenticated?Ye(r.token||""):{}}const se=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:q,Provider:Ws,User:B,headers:Ys,payload:Ks},Symbol.toStringTag,{value:"Module"}));function Gt(r,t,e){const s=r.target,i=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${r.type}:`,i),s.dispatchEvent(i),r.stopPropagation()}function $e(r,t="*"){return r.composedPath().find(s=>{const i=s;return i.tagName&&i.matches(t)})}const Zs=new DOMParser;function ft(r,...t){const e=r.map((o,l)=>l?[t[l-1],o]:[o]).flat().join(""),s=Zs.parseFromString(e,"text/html"),i=s.head.childElementCount?s.head.children:s.body.children,n=new DocumentFragment;return n.replaceChildren(...i),n}function Rt(r){const t=r.firstElementChild,e=t&&t.tagName==="TEMPLATE"?t:void 0;return{attach:s};function s(i,n={mode:"open"}){const o=i.attachShadow(n);return e&&o.appendChild(e.content.cloneNode(!0)),o}}const Qe=class Xe extends HTMLElement{constructor(){super(),this._state={},Rt(Xe.template).attach(this),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}}),this.form&&this.form.addEventListener("submit",t=>{t.preventDefault(),Gt(t,"mu-form:submit",this._state)})}set init(t){this._state=t||{},Qs(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}};Qe.template=ft`
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
  `;let Gs=Qe;function Qs(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;case"date":o.value=i.toISOString().substr(0,10);break;default:o.value=i;break}}}return r}const Xs=Object.freeze(Object.defineProperty({__proto__:null,Element:Gs},Symbol.toStringTag,{value:"Module"})),ts=class es extends ee{constructor(t){super((e,s)=>this.update(e,s),t,es.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:i}=t[1];e(ei(s,i));break}case"history/redirect":{const{href:s,state:i}=t[1];e(si(s,i));break}}}};ts.EVENT_TYPE="history:message";let ie=ts;class be extends te{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=ti(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),re(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new ie(this.context).attach(this)}}function ti(r){const t=r.currentTarget,e=s=>s.tagName=="A"&&s.href;if(r.button===0)if(r.composed){const i=r.composedPath().find(e);return i||void 0}else{for(let s=r.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function ei(r,t={}){return history.pushState(t,"",r),()=>({location:document.location,state:history.state})}function si(r,t={}){return history.replaceState(t,"",r),()=>({location:document.location,state:history.state})}const re=Ze(ie.EVENT_TYPE),ii=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:be,Provider:be,Service:ie,dispatch:re},Symbol.toStringTag,{value:"Module"}));class Ut{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const i=new Ae(this._provider,t);this._effects.push(i),e(i)}else Fs(this._target,this._contextLabel).then(i=>{const n=new Ae(i,t);this._provider=i,this._effects.push(n),i.attach(o=>this._handleChange(o)),e(n)}).catch(i=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,i))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),this._effects.forEach(e=>e.runEffect())}}class Ae{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const ss=class is extends HTMLElement{constructor(){super(),this._state={},this._user=new B,this._authObserver=new Ut(this,"blazing:auth"),Rt(is.template).attach(this),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;ri(i,this._state,e,this.authorization).then(n=>et(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:i}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:i,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},et(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Ee(this.src,this.authorization).then(e=>{this._state=e,et(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&Ee(this.src,this.authorization).then(i=>{this._state=i,et(i,this)});break;case"new":s&&(this._state={},et({},this));break}}};ss.observedAttributes=["src","new","action"];ss.template=ft`
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
  `;function Ee(r,t){return fetch(r,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${r}:`,e))}function et(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;default:o.value=i;break}}}return r}function ri(r,t,e="PUT",s={}){return fetch(r,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()})}const rs=class ns extends ee{constructor(t,e){super(e,t,ns.EVENT_TYPE,!1)}};rs.EVENT_TYPE="mu:message";let os=rs;class ni extends te{constructor(t,e,s){super(e),this._user=new B,this._updateFn=t,this._authObserver=new Ut(this,s)}connectedCallback(){const t=new os(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const oi=Object.freeze(Object.defineProperty({__proto__:null,Provider:ni,Service:os},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const _t=globalThis,ne=_t.ShadowRoot&&(_t.ShadyCSS===void 0||_t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,oe=Symbol(),we=new WeakMap;let as=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==oe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ne&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=we.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&we.set(e,t))}return t}toString(){return this.cssText}};const ai=r=>new as(typeof r=="string"?r:r+"",void 0,oe),li=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new as(e,r,oe)},ci=(r,t)=>{if(ne)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=_t.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Se=ne?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return ai(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:hi,defineProperty:ui,getOwnPropertyDescriptor:di,getOwnPropertyNames:pi,getOwnPropertySymbols:fi,getPrototypeOf:mi}=Object,W=globalThis,xe=W.trustedTypes,gi=xe?xe.emptyScript:"",Pe=W.reactiveElementPolyfillSupport,nt=(r,t)=>r,At={toAttribute(r,t){switch(t){case Boolean:r=r?gi:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},ae=(r,t)=>!hi(r,t),ke={attribute:!0,type:String,converter:At,reflect:!1,hasChanged:ae};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),W.litPropertyMetadata??(W.litPropertyMetadata=new WeakMap);let D=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ke){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&ui(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=di(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ke}static _$Ei(){if(this.hasOwnProperty(nt("elementProperties")))return;const t=mi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(nt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(nt("properties"))){const e=this.properties,s=[...pi(e),...fi(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Se(i))}else t!==void 0&&e.push(Se(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ci(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(n!==void 0&&i.reflect===!0){const o=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:At).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s;const i=this.constructor,n=i._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=i.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:At;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??ae)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(s)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};D.elementStyles=[],D.shadowRootOptions={mode:"open"},D[nt("elementProperties")]=new Map,D[nt("finalized")]=new Map,Pe==null||Pe({ReactiveElement:D}),(W.reactiveElementVersions??(W.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Et=globalThis,wt=Et.trustedTypes,Ce=wt?wt.createPolicy("lit-html",{createHTML:r=>r}):void 0,ls="$lit$",x=`lit$${Math.random().toFixed(9).slice(2)}$`,cs="?"+x,vi=`<${cs}>`,M=document,lt=()=>M.createComment(""),ct=r=>r===null||typeof r!="object"&&typeof r!="function",hs=Array.isArray,yi=r=>hs(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Vt=`[ 	
\f\r]`,st=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Oe=/-->/g,Te=/>/g,R=RegExp(`>|${Vt}(?:([^\\s"'>=/]+)(${Vt}*=${Vt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Re=/'/g,Ue=/"/g,us=/^(?:script|style|textarea|title)$/i,_i=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),Bt=_i(1),J=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Ne=new WeakMap,N=M.createTreeWalker(M,129);function ds(r,t){if(!Array.isArray(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ce!==void 0?Ce.createHTML(t):t}const $i=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":"",o=st;for(let l=0;l<e;l++){const a=r[l];let p,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===st?f[1]==="!--"?o=Oe:f[1]!==void 0?o=Te:f[2]!==void 0?(us.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=R):f[3]!==void 0&&(o=R):o===R?f[0]===">"?(o=i??st,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,p=f[1],o=f[3]===void 0?R:f[3]==='"'?Ue:Re):o===Ue||o===Re?o=R:o===Oe||o===Te?o=st:(o=R,i=void 0);const h=o===R&&r[l+1].startsWith("/>")?" ":"";n+=o===st?a+vi:u>=0?(s.push(p),a.slice(0,u)+ls+a.slice(u)+x+h):a+x+(u===-2?l:h)}return[ds(r,n+(r[e]||"<?>")+(t===2?"</svg>":"")),s]};let Qt=class ps{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[p,f]=$i(t,e);if(this.el=ps.createElement(p,s),N.currentNode=this.el.content,e===2){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=N.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(ls)){const c=f[o++],h=i.getAttribute(u).split(x),d=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:d[2],strings:h,ctor:d[1]==="."?Ai:d[1]==="?"?Ei:d[1]==="@"?wi:Nt}),i.removeAttribute(u)}else u.startsWith(x)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(us.test(i.tagName)){const u=i.textContent.split(x),c=u.length-1;if(c>0){i.textContent=wt?wt.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],lt()),N.nextNode(),a.push({type:2,index:++n});i.append(u[c],lt())}}}else if(i.nodeType===8)if(i.data===cs)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(x,u+1))!==-1;)a.push({type:7,index:n}),u+=x.length-1}n++}}static createElement(t,e){const s=M.createElement("template");return s.innerHTML=t,s}};function Y(r,t,e=r,s){var i,n;if(t===J)return t;let o=s!==void 0?(i=e._$Co)==null?void 0:i[s]:e._$Cl;const l=ct(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(r),o._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=o:e._$Cl=o),o!==void 0&&(t=Y(r,o._$AS(r,t.values),o,s)),t}let bi=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??M).importNode(e,!0);N.currentNode=i;let n=N.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let p;a.type===2?p=new le(n,n.nextSibling,this,t):a.type===1?p=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(p=new Si(n,this,t)),this._$AV.push(p),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=N.nextNode(),o++)}return N.currentNode=M,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},le=class fs{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),ct(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==J&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):yi(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==_&&ct(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,n=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=Qt.createElement(ds(i.h,i.h[0]),this.options)),i);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new bi(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=Ne.get(t.strings);return e===void 0&&Ne.set(t.strings,e=new Qt(t)),e}k(t){hs(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new fs(this.S(lt()),this.S(lt()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},Nt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=Y(this,t,e,0),o=!ct(t)||t!==this._$AH&&t!==J,o&&(this._$AH=t);else{const l=t;let a,p;for(t=n[0],a=0;a<n.length-1;a++)p=Y(this,l[s+a],e,a),p===J&&(p=this._$AH[a]),o||(o=!ct(p)||p!==this._$AH[a]),p===_?t=_:t!==_&&(t+=(p??"")+n[a+1]),this._$AH[a]=p}o&&!i&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Ai=class extends Nt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}},Ei=class extends Nt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}},wi=class extends Nt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??_)===J)return;const s=this._$AH,i=t===_&&s!==_||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==_&&(s===_||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},Si=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}};const Le=Et.litHtmlPolyfillSupport;Le==null||Le(Qt,le),(Et.litHtmlVersions??(Et.litHtmlVersions=[])).push("3.1.3");const xi=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new le(t.insertBefore(lt(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let V=class extends D{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=xi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return J}};V._$litElement$=!0,V.finalized=!0,(ye=globalThis.litElementHydrateSupport)==null||ye.call(globalThis,{LitElement:V});const Me=globalThis.litElementPolyfillSupport;Me==null||Me({LitElement:V});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pi={attribute:!0,type:String,converter:At,reflect:!1,hasChanged:ae},ki=(r=Pi,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function ms(r){return(t,e)=>typeof e=="object"?ki(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}function Ci(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}function Oi(r){throw new Error('Could not dynamically require "'+r+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var gs={};(function(r){var t=function(){var e=function(u,c,h,d){for(h=h||{},d=u.length;d--;h[u[d]]=c);return h},s=[1,9],i=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,d,g,m,v,Ht){var A=v.length-1;switch(m){case 1:return new g.Root({},[v[A-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[v[A-1],v[A]]);break;case 4:case 5:this.$=v[A];break;case 6:this.$=new g.Literal({value:v[A]});break;case 7:this.$=new g.Splat({name:v[A]});break;case 8:this.$=new g.Param({name:v[A]});break;case 9:this.$=new g.Optional({},[v[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:i,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let d=function(g,m){this.message=g,this.hash=m};throw d.prototype=Error,new d(c,h)}},parse:function(c){var h=this,d=[0],g=[null],m=[],v=this.table,Ht="",A=0,me=0,Us=2,ge=1,Ns=m.slice.call(arguments,1),y=Object.create(this.lexer),O={yy:{}};for(var jt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,jt)&&(O.yy[jt]=this.yy[jt]);y.setInput(c,O.yy),O.yy.lexer=y,O.yy.parser=this,typeof y.yylloc>"u"&&(y.yylloc={});var It=y.yylloc;m.push(It);var Ls=y.options&&y.options.ranges;typeof O.yy.parseError=="function"?this.parseError=O.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Ms=function(){var I;return I=y.lex()||ge,typeof I!="number"&&(I=h.symbols_[I]||I),I},b,T,E,zt,j={},vt,S,ve,yt;;){if(T=d[d.length-1],this.defaultActions[T]?E=this.defaultActions[T]:((b===null||typeof b>"u")&&(b=Ms()),E=v[T]&&v[T][b]),typeof E>"u"||!E.length||!E[0]){var Dt="";yt=[];for(vt in v[T])this.terminals_[vt]&&vt>Us&&yt.push("'"+this.terminals_[vt]+"'");y.showPosition?Dt="Parse error on line "+(A+1)+`:
`+y.showPosition()+`
Expecting `+yt.join(", ")+", got '"+(this.terminals_[b]||b)+"'":Dt="Parse error on line "+(A+1)+": Unexpected "+(b==ge?"end of input":"'"+(this.terminals_[b]||b)+"'"),this.parseError(Dt,{text:y.match,token:this.terminals_[b]||b,line:y.yylineno,loc:It,expected:yt})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+T+", token: "+b);switch(E[0]){case 1:d.push(b),g.push(y.yytext),m.push(y.yylloc),d.push(E[1]),b=null,me=y.yyleng,Ht=y.yytext,A=y.yylineno,It=y.yylloc;break;case 2:if(S=this.productions_[E[1]][1],j.$=g[g.length-S],j._$={first_line:m[m.length-(S||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(S||1)].first_column,last_column:m[m.length-1].last_column},Ls&&(j._$.range=[m[m.length-(S||1)].range[0],m[m.length-1].range[1]]),zt=this.performAction.apply(j,[Ht,me,A,O.yy,E[1],g,m].concat(Ns)),typeof zt<"u")return zt;S&&(d=d.slice(0,-1*S*2),g=g.slice(0,-1*S),m=m.slice(0,-1*S)),d.push(this.productions_[E[1]][0]),g.push(j.$),m.push(j._$),ve=v[d[d.length-2]][d[d.length-1]],d.push(ve);break;case 3:return!0}}return!0}},p=function(){var u={EOF:1,parseError:function(h,d){if(this.yy.parser)this.yy.parser.parseError(h,d);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,d=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),d.length-1&&(this.yylineno-=d.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:d?(d.length===g.length?this.yylloc.first_column:0)+g[g.length-d.length].length-d[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var d,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=c[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],d=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),d)return d;if(this._backtrack){for(var v in m)this[v]=m[v];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,d,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),v=0;v<m.length;v++)if(d=this._input.match(this.rules[m[v]]),d&&(!h||d[0].length>h[0].length)){if(h=d,g=v,this.options.backtrack_lexer){if(c=this.test_match(d,m[v]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,m[g]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,d,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=p;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Oi<"u"&&(r.parser=t,r.Parser=t.Parser,r.parse=function(){return t.parse.apply(t,arguments)})})(gs);function z(r){return function(t,e){return{displayName:r,props:t,children:e||[]}}}var vs={Root:z("Root"),Concat:z("Concat"),Literal:z("Literal"),Splat:z("Splat"),Param:z("Param"),Optional:z("Optional")},ys=gs.parser;ys.yy=vs;var Ti=ys,Ri=Object.keys(vs);function Ui(r){return Ri.forEach(function(t){if(typeof r[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:r}}var _s=Ui,Ni=_s,Li=/[\-{}\[\]+?.,\\\^$|#\s]/g;function $s(r){this.captures=r.captures,this.re=r.re}$s.prototype.match=function(r){var t=this.re.exec(r),e={};if(t)return this.captures.forEach(function(s,i){typeof t[i+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[i+1])}),e};var Mi=Ni({Concat:function(r){return r.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(r){return{re:r.props.value.replace(Li,"\\$&"),captures:[]}},Splat:function(r){return{re:"([^?]*?)",captures:[r.props.name]}},Param:function(r){return{re:"([^\\/\\?]+)",captures:[r.props.name]}},Optional:function(r){var t=this.visit(r.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(r){var t=this.visit(r.children[0]);return new $s({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Hi=Mi,ji=_s,Ii=ji({Concat:function(r,t){var e=r.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(r){return decodeURI(r.props.value)},Splat:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Param:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Optional:function(r,t){var e=this.visit(r.children[0],t);return e||""},Root:function(r,t){t=t||{};var e=this.visit(r.children[0],t);return e?encodeURI(e):!1}}),zi=Ii,Di=Ti,Fi=Hi,Vi=zi;mt.prototype=Object.create(null);mt.prototype.match=function(r){var t=Fi.visit(this.ast),e=t.match(r);return e||!1};mt.prototype.reverse=function(r){return Vi.visit(this.ast,r)};function mt(r){var t;if(this?t=this:t=Object.create(mt.prototype),typeof r>"u")throw new Error("A route spec is required");return t.spec=r,t.ast=Di.parse(r),t}var Bi=mt,qi=Bi,Wi=qi;const Ji=Ci(Wi);var Yi=Object.defineProperty,Ki=Object.getOwnPropertyDescriptor,Zi=(r,t,e,s)=>{for(var i=s>1?void 0:s?Ki(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&Yi(t,e,i),i};class bs extends V{constructor(t,e){super(),this._cases=[],this._fallback=()=>Bt`
      <h1>Not Found</h1>
    `,this._cases=t.map(s=>({...s,route:new Ji(s.path)})),this._historyObserver=new Ut(this,e)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match),Bt`
      <main>${(()=>{if(this._match){if("view"in this._match)return this._match.view(this._match.params||{});if("redirect"in this._match){const e=this._match.redirect;if(typeof e=="string")return this.redirect(e),Bt`
              <h1>Redirecting to ${e}…</h1>
            `}}return this._fallback({})})()}</main>
    `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,i=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:i}}}redirect(t){re(this,"history/redirect",{href:t})}}bs.styles=li`
    :host,
    main {
      display: contents;
    }
  `;Zi([ms()],bs.prototype,"_match",2);const Gi=class As extends HTMLElement{constructor(){if(super(),Rt(As.template).attach(this),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Gi.template=ft`
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
  `;const Qi=class Es extends HTMLElement{constructor(){super(),this._array=[],Rt(Es.template).attach(this),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(ws("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),i=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=i,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{$e(t,"button.add")?Gt(t,"input-array:add"):$e(t,"button.remove")&&Gt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],Xi(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};Qi.template=ft`
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
  `;function Xi(r,t){t.replaceChildren(),r.forEach((e,s)=>t.append(ws(e)))}function ws(r,t){const e=r===void 0?"":`value="${r}"`;return ft`
    <label>
      <input ${e} />
      <button class="remove" type="button">Remove</button>
    </label>
  `}function Lt(r){return Object.entries(r).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var tr=Object.defineProperty,er=Object.getOwnPropertyDescriptor,sr=(r,t,e,s)=>{for(var i=s>1?void 0:s?er(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&tr(t,e,i),i};class Ss extends V{constructor(t){super(),this._pending=[],this._observer=new Ut(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,i])=>{console.log("Dispatching queued event",i,s),s.dispatchEvent(i)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}sr([ms()],Ss.prototype,"model",1);const ir={};function rr(r,t,e){switch(r[0]){case"profile/save":nr(r[1],e).then(i=>t(n=>({...n,profile:i})));break;case"profile/select":or(r[1],e).then(i=>t(n=>({...n,profile:i})));break;default:const s=r[0];throw new Error(`Unhandled Auth message "${s}"`)}}function nr(r,t){return fetch(`/api/profiles/${r.userid}`,{method:"PUT",headers:{"Content-Type":"application/json",...se.headers(t)},body:JSON.stringify(r.profile)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return e})}function or(r,t){return fetch(`/api/profiles/${r.userid}`,{headers:se.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Profile:",e),e})}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const $t=globalThis,ce=$t.ShadowRoot&&($t.ShadyCSS===void 0||$t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,he=Symbol(),He=new WeakMap;let xs=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==he)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ce&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=He.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&He.set(e,t))}return t}toString(){return this.cssText}};const ar=r=>new xs(typeof r=="string"?r:r+"",void 0,he),Q=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new xs(e,r,he)},lr=(r,t)=>{if(ce)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=$t.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},je=ce?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return ar(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:cr,defineProperty:hr,getOwnPropertyDescriptor:ur,getOwnPropertyNames:dr,getOwnPropertySymbols:pr,getPrototypeOf:fr}=Object,k=globalThis,Ie=k.trustedTypes,mr=Ie?Ie.emptyScript:"",qt=k.reactiveElementPolyfillSupport,ot=(r,t)=>r,St={toAttribute(r,t){switch(t){case Boolean:r=r?mr:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},ue=(r,t)=>!cr(r,t),ze={attribute:!0,type:String,converter:St,reflect:!1,hasChanged:ue};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),k.litPropertyMetadata??(k.litPropertyMetadata=new WeakMap);class F extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ze){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&hr(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=ur(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ze}static _$Ei(){if(this.hasOwnProperty(ot("elementProperties")))return;const t=fr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ot("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ot("properties"))){const e=this.properties,s=[...dr(e),...pr(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(je(i))}else t!==void 0&&e.push(je(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return lr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var n;const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:St).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){var n;const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const o=s.getPropertyOptions(i),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((n=o.converter)==null?void 0:n.fromAttribute)!==void 0?o.converter:St;this._$Em=i,this[i]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??ue)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(e)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}F.elementStyles=[],F.shadowRootOptions={mode:"open"},F[ot("elementProperties")]=new Map,F[ot("finalized")]=new Map,qt==null||qt({ReactiveElement:F}),(k.reactiveElementVersions??(k.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const at=globalThis,xt=at.trustedTypes,De=xt?xt.createPolicy("lit-html",{createHTML:r=>r}):void 0,Ps="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,ks="?"+P,gr=`<${ks}>`,H=document,ht=()=>H.createComment(""),ut=r=>r===null||typeof r!="object"&&typeof r!="function",Cs=Array.isArray,vr=r=>Cs(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Wt=`[ 	
\f\r]`,it=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Fe=/-->/g,Ve=/>/g,U=RegExp(`>|${Wt}(?:([^\\s"'>=/]+)(${Wt}*=${Wt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Be=/'/g,qe=/"/g,Os=/^(?:script|style|textarea|title)$/i,yr=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),w=yr(1),K=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),We=new WeakMap,L=H.createTreeWalker(H,129);function Ts(r,t){if(!Array.isArray(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return De!==void 0?De.createHTML(t):t}const _r=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":"",o=it;for(let l=0;l<e;l++){const a=r[l];let p,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===it?f[1]==="!--"?o=Fe:f[1]!==void 0?o=Ve:f[2]!==void 0?(Os.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=U):f[3]!==void 0&&(o=U):o===U?f[0]===">"?(o=i??it,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,p=f[1],o=f[3]===void 0?U:f[3]==='"'?qe:Be):o===qe||o===Be?o=U:o===Fe||o===Ve?o=it:(o=U,i=void 0);const h=o===U&&r[l+1].startsWith("/>")?" ":"";n+=o===it?a+gr:u>=0?(s.push(p),a.slice(0,u)+Ps+a.slice(u)+P+h):a+P+(u===-2?l:h)}return[Ts(r,n+(r[e]||"<?>")+(t===2?"</svg>":"")),s]};class dt{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[p,f]=_r(t,e);if(this.el=dt.createElement(p,s),L.currentNode=this.el.content,e===2){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=L.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(Ps)){const c=f[o++],h=i.getAttribute(u).split(P),d=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:d[2],strings:h,ctor:d[1]==="."?br:d[1]==="?"?Ar:d[1]==="@"?Er:Mt}),i.removeAttribute(u)}else u.startsWith(P)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(Os.test(i.tagName)){const u=i.textContent.split(P),c=u.length-1;if(c>0){i.textContent=xt?xt.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],ht()),L.nextNode(),a.push({type:2,index:++n});i.append(u[c],ht())}}}else if(i.nodeType===8)if(i.data===ks)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(P,u+1))!==-1;)a.push({type:7,index:n}),u+=P.length-1}n++}}static createElement(t,e){const s=H.createElement("template");return s.innerHTML=t,s}}function Z(r,t,e=r,s){var o,l;if(t===K)return t;let i=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=ut(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=Z(r,i._$AS(r,t.values),i,s)),t}class $r{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??H).importNode(e,!0);L.currentNode=i;let n=L.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let p;a.type===2?p=new gt(n,n.nextSibling,this,t):a.type===1?p=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(p=new wr(n,this,t)),this._$AV.push(p),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=L.nextNode(),o++)}return L.currentNode=H,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class gt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),ut(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==K&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):vr(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==$&&ut(this._$AH)?this._$AA.nextSibling.data=t:this.T(H.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=dt.createElement(Ts(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(e);else{const o=new $r(i,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=We.get(t.strings);return e===void 0&&We.set(t.strings,e=new dt(t)),e}k(t){Cs(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new gt(this.S(ht()),this.S(ht()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Mt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=Z(this,t,e,0),o=!ut(t)||t!==this._$AH&&t!==K,o&&(this._$AH=t);else{const l=t;let a,p;for(t=n[0],a=0;a<n.length-1;a++)p=Z(this,l[s+a],e,a),p===K&&(p=this._$AH[a]),o||(o=!ut(p)||p!==this._$AH[a]),p===$?t=$:t!==$&&(t+=(p??"")+n[a+1]),this._$AH[a]=p}o&&!i&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class br extends Mt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class Ar extends Mt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class Er extends Mt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??$)===K)return;const s=this._$AH,i=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==$&&(s===$||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class wr{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const Jt=at.litHtmlPolyfillSupport;Jt==null||Jt(dt,gt),(at.litHtmlVersions??(at.litHtmlVersions=[])).push("3.1.3");const Sr=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new gt(t.insertBefore(ht(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class C extends F{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Sr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return K}}var Je;C._$litElement$=!0,C.finalized=!0,(Je=globalThis.litElementHydrateSupport)==null||Je.call(globalThis,{LitElement:C});const Yt=globalThis.litElementPolyfillSupport;Yt==null||Yt({LitElement:C});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");const pe=class pe extends C{constructor(){super(...arguments),this._onClickAway=t=>{this.contains(t.target)||(this.removeAttribute("open"),window.removeEventListener("click",this._onClickAway))}}render(){return w`
      <slot name="actuator">
        <button @click="${this.toggle}">
          <img src="../icons/menu.svg" alt="Menu" id="menu-icon" />
        </button>
      </slot>
      <div id="panel">
        <slot></slot>
      </div>
    `}toggle(){this.hasAttribute("open")?(this.removeAttribute("open"),window.removeEventListener("click",this._onClickAway)):(this.setAttribute("open",""),setTimeout(()=>{window.addEventListener("click",this._onClickAway)},0))}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("click",this._onClickAway)}};pe.styles=Q`
    :host {
      position: relative;
      font-family: var(--font-family-body);
      display: inline-block;
    }
    #panel {
      display: none;
      position: absolute;
      right: 0;
      margin-top: var(--space-small);
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
      background: var(--color-primary);
      border: none;
      padding: 8px;
      color: var(--color-text);
      cursor: pointer;
      border-radius: var(--border-radius);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    button:hover {
      background: var(--color-links);
    }
    #menu-icon {
      width: 24px;
      height: auto;
      transition: transform 0.3s ease;
    }
  `;let Pt=pe;customElements.define("drop-down",Pt);const Ct=class Ct extends C{render(){return w`
      <header class="navbar">
        <div class="navbar-content">
          <a class="logo" href="index.html">
            <img src="icons/desk-lamp.svg" alt="SLOStudySpots Logo" />
            <h1>SLOStudySpots</h1>
          </a>

          <div class="search-box">
            <form>
              <input type="search" placeholder="Search for study spots..." />
            </form>
          </div>

          <nav class="right-navbar-links">
            <drop-down>
              <ul>
                <li>
                  <a class="navbar-menu" href="profile.html">
                    <!-- <img src="icons/avatar.svg" alt="profile-icon" /> -->
                    Profile
                  </a>
                </li>
                <li>
                  <a class="group-icon" href="ranking.html">
                    <!-- <img src="icons/ranking.svg" alt="ranking-icon" /> -->
                    Community Rankings
                  </a>
                </li>
                <li>
                  <a class="group-icon" href="create.html">
                    <!-- <img src="icons/create.svg" alt="create-icon" /> -->
                    Add a Spot
                  </a>
                </li>
                <li>
                  <label class="light-dark-switch" @change=${xr}>
                    <input type="checkbox" autocomplete="off" />
                    Dark mode
                  </label>
                </li>
              </ul>
            </drop-down>
          </nav>
        </div>
      </header>
    `}};Ct.uses=Lt({"drop-down":Pt}),Ct.styles=Q`
    * {
      margin: 0;
      box-sizing: border-box;
      padding: 0;
    }

    header.navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: var(--color-primary);
      padding: var(--space-small) var(--space-regular);
      position: sticky;
      top: 0; /* Ensures it sticks at the very top */
      z-index: 1000; /* Ensures the header stays on top of other content */
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
      color: var(--color-background-primary);
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

    .right-navbar-links ul {
      /* list-style: none;
      display: flex;
      align-items: center;
      margin: 0;
      padding: 0; */

      list-style: none;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .right-navbar-links li {
      /* margin-left: var(--space-regular); */
      padding: 10px;
    }

    .right-navbar-links a {
      color: var(--color-text-secondary);
      /* font-family: var(--font-family-display); */
      display: flex;
      align-items: center;
      text-decoration: none;
    }

    .right-navbar-links a:hover {
      color: var(--color-links);
    }

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
  `;let Xt=Ct;function xr(r){const e=r.target.checked;document.body.classList.toggle("dark-mode",e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pr={attribute:!0,type:String,converter:St,reflect:!1,hasChanged:ue},kr=(r=Pr,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function X(r){return(t,e)=>typeof e=="object"?kr(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Cr(r){return X({...r,state:!0,attribute:!1})}const de=Q`
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
`;var Or=Object.defineProperty,Tr=Object.getOwnPropertyDescriptor,tt=(r,t,e,s)=>{for(var i=s>1?void 0:s?Tr(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&Or(t,e,i),i};const Rs=Q`
  slot[name="avatar"] {
    display: block;
    grid-row: 1 / span 4;
  }
  nav {
    display: contents;
    text-align: right;
  }
  nav > * {
    grid-column: controls;
  }
`,fe=class fe extends C{render(){return w`
      <section>
        <slot name="avatar"></slot>
        <h1><slot name="name"></slot></h1>
        <nav>
          <a href="${this.username}/edit" class="edit">Edit</a>
        </nav>
        <div class="profile-section">
          <h2>General Information</h2>
          <dl>
            <dt>Username: </dt>
            <dd><slot name="userid"></slot></dd>
            <dt>Email: </dt>
            <dd><slot name="email"></slot></dd>
            <dt>Bio: </dt>
            <dd><slot name="bio"></slot></dd>
            <dt>Date Joined:</dt>
            <dd><slot name="dateJoined"></slot></dd>
          </dl>
        </div>
        <div class="profile-section">
          <h2>Reviews</h2>
          <dl>
            <dt>Number of Reviews:</dt>
            <dd><slot name="reviewsCount"></slot></dd>
          </dl>
        </div>
        <div class="profile-section">
          <h2>Favorite Study Spots</h2>
          <dl>
            <dt>Favorite Study Spots:</dt>
            <dd><slot name="favSpots"></slot></dd>
          </dl>
        </div>
      </section>
    `}};fe.styles=[de,Rs,Q`
      * {
        margin: 0;
        box-sizing: border-box;
      }
      section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--size-spacing-medium);
        background-color: var(--color-background-secondary);
        padding: var(--space-regular);
        margin: auto;
        max-width: 800px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-hover-small);
      }
      h1 {
        margin: var(--space-small) 0;
        color: var(--color-primary);
        text-align: center;
      }
      dl {
        display: grid;
        grid-template-columns: 1fr 3fr;
        gap: var(--size-spacing-medium) var(--size-spacing-xlarge);
        align-items: baseline;
      }
      dt {
        font-weight: bold;
        color: var(--color-primary);
        font-family: var(--font-family-display);
        padding-right: var(--size-spacing-medium);
        border-right: 2px solid var(--color-border);
      }
      dd {
        color: var(--color-text-primary);
        padding-left: var(--size-spacing-medium);
        font-family: var(--font-family-body);
        text
      }
      ::slotted(ul) {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      ::slotted(ul > li) {
        padding: var(--size-spacing-small) 0;
        border-bottom: 1px solid var(--color-border);
        color: var(--color-text-primary);
      }
      .profile-actions {
        margin-top: var(--space-regular);
        text-align: center;
      }
      .profile-actions h3 {
        color: var(--color-secondary);
      }
      .profile-actions a {
        margin-top: var(--space-regular);
        background-color: var(--color-primary);
        color: var(--color-background-primary);
        padding: 10px 20px;
        border-radius: var(--border-radius);
        text-decoration: none;
        margin-right: var(--space-small);
        display: inline-block;
        transition: background-color 0.3s ease;
      }
      .profile-actions a:hover {
        background-color: var(--color-links);
        color: var(--color-background-primary);
      }
      button {
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
        margin-right: 20px;
      }
      button:hover {
        background-color: var(--color-links);
      }
    `];let kt=fe;tt([X()],kt.prototype,"username",2);const Ot=class Ot extends C{render(){return w`
      <section>
        <slot name="avatar"></slot>
        <h1><slot name="name"></slot></h1>
        <nav>
          <a class="close" href="../${this.username}">Close</a>
          <button class="delete">Delete</button>
        </nav>
        <mu-form .init=${this.init}>
          <label>
          <span>Username</span>
          <input name="userid"/>
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
            <span>Favorite Study Spots</span>
            <input name="favSpots" />
          </label>
          <label>
            <span>Avatar</span>
            <input name="avatar" />
          </label>
        </mu-form>
      </section>
    `}};Ot.uses=Lt({"mu-form":Xs.Element}),Ot.styles=[de,Rs,Q`
      mu-form {
        grid-column: key / end;
      }
      mu-form input {
        grid-column: input;
      }
    `];let pt=Ot;tt([X()],pt.prototype,"username",2);tt([X({attribute:!1})],pt.prototype,"init",2);const Tt=class Tt extends Ss{constructor(){super("slostudyspots:model"),this.edit=!1,this.userid=""}get profile(){return this.model.profile}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="user-id"&&e!==s&&s&&(console.log("Profiler Page:",s),this.dispatchMessage(["profile/select",{userid:s}]))}render(){var f,u,c;const{avatar:t,name:e,userid:s,email:i,bio:n,reviewsCount:o}=this.profile||{},l=((u=(f=this.profile)==null?void 0:f.favSpots)==null?void 0:u.map(h=>w`<li>${h}</li>`))||w``,a=(c=this.profile)!=null&&c.dateJoined?new Date(this.profile.dateJoined).toLocaleDateString():"Date unavailable",p=t?w`<img src=${t} alt="Profile Avatar" slot="avatar">`:w`<div slot="avatar">No Avatar</div>`;return this.edit?w`
        <profile-editor
          username=${s}
          .init=${this.profile}
          @mu-form:submit=${h=>this._handleSubmit(h)}>
          ${p}
        </profile-editor>
      `:w`
        <profile-viewer username=${s}>
          ${p}
          <span slot="name">${e}</span>
          <span slot="userid">${s}</span>
          <span slot="email">${i}</span>
          <span slot="bio">${n||"No bio available"}</span>
          <span slot="dateJoined">${a}</span>
          <span slot="reviewsCount">${o}</span>
          <ul slot="favSpots">${l}</ul>
        </profile-viewer>
      `}_handleSubmit(t){console.log("Handling submit of mu-form"),this.dispatchMessage(["profile/save",{userid:this.userid,profile:t.detail,onSuccess:()=>ii.dispatch(this,"history/navigate",{href:`/app/profile/${this.userid}`}),onFailure:e=>console.log("ERROR:",e)}])}};Tt.uses=Lt({"profile-viewer":kt,"profile-editor":pt}),Tt.styles=[de];let G=Tt;tt([X({type:Boolean,reflect:!0})],G.prototype,"edit",2);tt([X({attribute:"user-id",reflect:!0})],G.prototype,"userid",2);tt([Cr()],G.prototype,"profile",1);Lt({"mu-auth":se.Provider,"mu-store":class extends oi.Provider{constructor(){super(rr,ir,"slostudyspots:auth")}},"studyspots-header":Xt,"profile-view":G});
