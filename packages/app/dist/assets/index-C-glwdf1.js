(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();var He;class ut extends Error{}ut.prototype.name="InvalidTokenError";function lr(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let r=e.charCodeAt(0).toString(16).toUpperCase();return r.length<2&&(r="0"+r),"%"+r}))}function cr(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return lr(t)}catch{return atob(t)}}function ps(i,t){if(typeof i!="string")throw new ut("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,r=i.split(".")[e];if(typeof r!="string")throw new ut(`Invalid token specified: missing part #${e+1}`);let s;try{s=cr(r)}catch(o){throw new ut(`Invalid token specified: invalid base64 for part #${e+1} (${o.message})`)}try{return JSON.parse(s)}catch(o){throw new ut(`Invalid token specified: invalid json for part #${e+1} (${o.message})`)}}const hr="mu:context",he=`${hr}:change`;class dr{constructor(t,e){this._proxy=ur(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ve extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new dr(t,this),this.style.display="contents"}attach(t){return this.addEventListener(he,t),t}detach(t){this.removeEventListener(he,t)}}function ur(i,t){return new Proxy(i,{get:(r,s,o)=>{if(s==="then")return;const n=Reflect.get(r,s,o);return console.log(`Context['${s}'] => `,n),n},set:(r,s,o,n)=>{const l=i[s];console.log(`Context['${s.toString()}'] <= `,o);const a=Reflect.set(r,s,o,n);if(a){let f=new CustomEvent(he,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(f,{property:s,oldValue:l,value:o}),t.dispatchEvent(f)}else console.log(`Context['${s}] was not set to ${o}`);return a}})}function pr(i,t){const e=fs(t,i);return new Promise((r,s)=>{if(e){const o=e.localName;customElements.whenDefined(o).then(()=>r(e))}else s({context:t,reason:`No provider for this context "${t}:`})})}function fs(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const r=t.closest(e);if(r)return r;const s=t.getRootNode();if(s instanceof ShadowRoot)return fs(i,s.host)}class fr extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function gs(i="mu:message"){return(t,...e)=>t.dispatchEvent(new fr(e,i))}class ye{constructor(t,e,r="service:message",s=!0){this._pending=[],this._context=e,this._update=t,this._eventType=r,this._running=s}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const r=e.detail;this.consume(r)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function gr(i){return t=>({...t,...i})}const de="mu:auth:jwt",ms=class vs extends ye{constructor(t,e){super((r,s)=>this.update(r,s),t,vs.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:r,redirect:s}=t[1];return e(vr(r)),ie(s);case"auth/signout":return e(yr()),ie(this._redirectForLogin);case"auth/redirect":return ie(this._redirectForLogin,{next:window.location.href});default:const o=t[0];throw new Error(`Unhandled Auth message "${o}"`)}}};ms.EVENT_TYPE="auth:message";let ys=ms;const bs=gs(ys.EVENT_TYPE);function ie(i,t={}){if(!i)return;const e=window.location.href,r=new URL(i,e);return Object.entries(t).forEach(([s,o])=>r.searchParams.set(s,o)),()=>{console.log("Redirecting to ",i),window.location.assign(r)}}class mr extends ve{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){super({user:K.authenticateFromLocalStorage()})}connectedCallback(){new ys(this.context,this.redirect).attach(this)}}class G{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(de),t}}class K extends G{constructor(t){super();const e=ps(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new K(t);return localStorage.setItem(de,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(de);return t?K.authenticate(t):new G}}function vr(i){return gr({user:K.authenticate(i),token:i})}function yr(){return i=>{const t=i.user;return{user:t&&t.authenticated?G.deauthenticate(t):t,token:""}}}function br(i){return i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function _r(i){return i.authenticated?ps(i.token||""):{}}const nt=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:K,Provider:mr,User:G,dispatch:bs,headers:br,payload:_r},Symbol.toStringTag,{value:"Module"}));function jt(i,t,e){const r=i.target,s=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${i.type}:`,s),r.dispatchEvent(s),i.stopPropagation()}function ue(i,t="*"){return i.composedPath().find(r=>{const s=r;return s.tagName&&s.matches(t)})}const Qt=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:ue,relay:jt},Symbol.toStringTag,{value:"Module"})),$r=new DOMParser;function Et(i,...t){const e=i.map((n,l)=>l?[t[l-1],n]:[n]).flat().join(""),r=$r.parseFromString(e,"text/html"),s=r.head.childElementCount?r.head.children:r.body.children,o=new DocumentFragment;return o.replaceChildren(...s),o}function Gt(i){const t=i.firstElementChild,e=t&&t.tagName==="TEMPLATE"?t:void 0;return{attach:r};function r(s,o={mode:"open"}){const n=s.attachShadow(o);return e&&n.appendChild(e.content.cloneNode(!0)),n}}const _s=class $s extends HTMLElement{constructor(){super(),this._state={},Gt($s.template).attach(this),this.addEventListener("change",t=>{const e=t.target;if(e){const r=e.name,s=e.value;r&&(this._state[r]=s)}}),this.form&&this.form.addEventListener("submit",t=>{t.preventDefault(),jt(t,"mu-form:submit",this._state)})}set init(t){this._state=t||{},xr(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}};_s.template=Et`
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
  `;let wr=_s;function xr(i,t){const e=Object.entries(i);for(const[r,s]of e){const o=t.querySelector(`[name="${r}"]`);if(o){const n=o;switch(n.type){case"checkbox":const l=n;l.checked=!!s;break;case"date":n.value=s.toISOString().substr(0,10);break;default:n.value=s;break}}}return i}const Sr=Object.freeze(Object.defineProperty({__proto__:null,Element:wr},Symbol.toStringTag,{value:"Module"})),ws=class xs extends ye{constructor(t){super((e,r)=>this.update(e,r),t,xs.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:r,state:s}=t[1];e(Er(r,s));break}case"history/redirect":{const{href:r,state:s}=t[1];e(Pr(r,s));break}}}};ws.EVENT_TYPE="history:message";let be=ws;class De extends ve{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=Ar(t);if(e){const r=new URL(e.href);r.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),_e(e,"history/navigate",{href:r.pathname+r.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new be(this.context).attach(this)}}function Ar(i){const t=i.currentTarget,e=r=>r.tagName=="A"&&r.href;if(i.button===0)if(i.composed){const s=i.composedPath().find(e);return s||void 0}else{for(let r=i.target;r;r===t?null:r.parentElement)if(e(r))return r;return}}function Er(i,t={}){return history.pushState(t,"",i),()=>({location:document.location,state:history.state})}function Pr(i,t={}){return history.replaceState(t,"",i),()=>({location:document.location,state:history.state})}const _e=gs(be.EVENT_TYPE),Ss=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:De,Provider:De,Service:be,dispatch:_e},Symbol.toStringTag,{value:"Module"}));class Z{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,r)=>{if(this._provider){const s=new Fe(this._provider,t);this._effects.push(s),e(s)}else pr(this._target,this._contextLabel).then(s=>{const o=new Fe(s,t);this._provider=s,this._effects.push(o),s.attach(n=>this._handleChange(n)),e(o)}).catch(s=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,s))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),this._effects.forEach(e=>e.runEffect())}}class Fe{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const $e=class As extends HTMLElement{constructor(){super(),this._state={},this._user=new G,this._authObserver=new Z(this,"blazing:auth"),Gt(As.template).attach(this),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",r=this.isNew?"created":"updated",s=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;Cr(s,this._state,e,this.authorization).then(o=>lt(o,this)).then(o=>{const n=`mu-rest-form:${r}`,l=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,[r]:o,url:s}});this.dispatchEvent(l)}).catch(o=>{const n="mu-rest-form:error",l=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,error:o,url:s,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const r=e.name,s=e.value;r&&(this._state[r]=s)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},lt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&pe(this.src,this.authorization).then(e=>{this._state=e,lt(e,this)}))})}attributeChangedCallback(t,e,r){switch(t){case"src":this.src&&r&&r!==e&&!this.isNew&&pe(this.src,this.authorization).then(s=>{this._state=s,lt(s,this)});break;case"new":r&&(this._state={},lt({},this));break}}};$e.observedAttributes=["src","new","action"];$e.template=Et`
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
  `;let kr=$e;function pe(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function lt(i,t){const e=Object.entries(i);for(const[r,s]of e){const o=t.querySelector(`[name="${r}"]`);if(o){const n=o;switch(n.type){case"checkbox":const l=n;l.checked=!!s;break;default:n.value=s;break}}}return i}function Cr(i,t,e="PUT",r={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...r},body:JSON.stringify(t)}).then(s=>{if(s.status!=200&&s.status!=201)throw`Form submission failed: Status ${s.status}`;return s.json()})}const Es=Object.freeze(Object.defineProperty({__proto__:null,FormElement:kr,fetchData:pe},Symbol.toStringTag,{value:"Module"})),Ps=class ks extends ye{constructor(t,e){super(e,t,ks.EVENT_TYPE,!1)}};Ps.EVENT_TYPE="mu:message";let Cs=Ps;class Or extends ve{constructor(t,e,r){super(e),this._user=new G,this._updateFn=t,this._authObserver=new Z(this,r)}connectedCallback(){const t=new Cs(this.context,(e,r)=>this._updateFn(e,r,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const Rr=Object.freeze(Object.defineProperty({__proto__:null,Provider:Or,Service:Cs},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ut=globalThis,we=Ut.ShadowRoot&&(Ut.ShadyCSS===void 0||Ut.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,xe=Symbol(),qe=new WeakMap;let Os=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==xe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(we&&t===void 0){const r=e!==void 0&&e.length===1;r&&(t=qe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&qe.set(e,t))}return t}toString(){return this.cssText}};const Tr=i=>new Os(typeof i=="string"?i:i+"",void 0,xe),Ur=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((r,s,o)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[o+1],i[0]);return new Os(e,i,xe)},Nr=(i,t)=>{if(we)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const r=document.createElement("style"),s=Ut.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},Be=we?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return Tr(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:jr,defineProperty:Lr,getOwnPropertyDescriptor:Mr,getOwnPropertyNames:Ir,getOwnPropertySymbols:zr,getPrototypeOf:Hr}=Object,X=globalThis,We=X.trustedTypes,Dr=We?We.emptyScript:"",Ve=X.reactiveElementPolyfillSupport,pt=(i,t)=>i,Lt={toAttribute(i,t){switch(t){case Boolean:i=i?Dr:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Se=(i,t)=>!jr(i,t),Je={attribute:!0,type:String,converter:Lt,reflect:!1,hasChanged:Se};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),X.litPropertyMetadata??(X.litPropertyMetadata=new WeakMap);let J=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Je){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&Lr(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){const{get:s,set:o}=Mr(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get(){return s==null?void 0:s.call(this)},set(n){const l=s==null?void 0:s.call(this);o.call(this,n),this.requestUpdate(t,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Je}static _$Ei(){if(this.hasOwnProperty(pt("elementProperties")))return;const t=Hr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(pt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(pt("properties"))){const e=this.properties,r=[...Ir(e),...zr(e)];for(const s of r)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const s of r)e.unshift(Be(s))}else t!==void 0&&e.push(Be(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Nr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostConnected)==null?void 0:r.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostDisconnected)==null?void 0:r.call(e)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$EC(t,e){var r;const s=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,s);if(o!==void 0&&s.reflect===!0){const n=(((r=s.converter)==null?void 0:r.toAttribute)!==void 0?s.converter:Lt).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(t,e){var r;const s=this.constructor,o=s._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const n=s.getPropertyOptions(o),l=typeof n.converter=="function"?{fromAttribute:n.converter}:((r=n.converter)==null?void 0:r.fromAttribute)!==void 0?n.converter:Lt;this._$Em=o,this[o]=l.fromAttribute(e,n.type),this._$Em=null}}requestUpdate(t,e,r){if(t!==void 0){if(r??(r=this.constructor.getPropertyOptions(t)),!(r.hasChanged??Se)(this[t],e))return;this.P(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,r){this._$AL.has(t)||this._$AL.set(t,e),r.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[o,n]of s)n.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],n)}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),(t=this._$EO)==null||t.forEach(s=>{var o;return(o=s.hostUpdate)==null?void 0:o.call(s)}),this.update(r)):this._$EU()}catch(s){throw e=!1,this._$EU(),s}e&&this._$AE(r)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(r=>{var s;return(s=r.hostUpdated)==null?void 0:s.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};J.elementStyles=[],J.shadowRootOptions={mode:"open"},J[pt("elementProperties")]=new Map,J[pt("finalized")]=new Map,Ve==null||Ve({ReactiveElement:J}),(X.reactiveElementVersions??(X.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Mt=globalThis,It=Mt.trustedTypes,Ye=It?It.createPolicy("lit-html",{createHTML:i=>i}):void 0,Rs="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,Ts="?"+T,Fr=`<${Ts}>`,F=document,mt=()=>F.createComment(""),vt=i=>i===null||typeof i!="object"&&typeof i!="function",Us=Array.isArray,qr=i=>Us(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",oe=`[ 	
\f\r]`,ct=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Qe=/-->/g,Ge=/>/g,I=RegExp(`>|${oe}(?:([^\\s"'>=/]+)(${oe}*=${oe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ke=/'/g,Ze=/"/g,Ns=/^(?:script|style|textarea|title)$/i,Br=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),ht=Br(1),tt=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Xe=new WeakMap,H=F.createTreeWalker(F,129);function js(i,t){if(!Array.isArray(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ye!==void 0?Ye.createHTML(t):t}const Wr=(i,t)=>{const e=i.length-1,r=[];let s,o=t===2?"<svg>":"",n=ct;for(let l=0;l<e;l++){const a=i[l];let f,g,d=-1,c=0;for(;c<a.length&&(n.lastIndex=c,g=n.exec(a),g!==null);)c=n.lastIndex,n===ct?g[1]==="!--"?n=Qe:g[1]!==void 0?n=Ge:g[2]!==void 0?(Ns.test(g[2])&&(s=RegExp("</"+g[2],"g")),n=I):g[3]!==void 0&&(n=I):n===I?g[0]===">"?(n=s??ct,d=-1):g[1]===void 0?d=-2:(d=n.lastIndex-g[2].length,f=g[1],n=g[3]===void 0?I:g[3]==='"'?Ze:Ke):n===Ze||n===Ke?n=I:n===Qe||n===Ge?n=ct:(n=I,s=void 0);const h=n===I&&i[l+1].startsWith("/>")?" ":"";o+=n===ct?a+Fr:d>=0?(r.push(f),a.slice(0,d)+Rs+a.slice(d)+T+h):a+T+(d===-2?l:h)}return[js(i,o+(i[e]||"<?>")+(t===2?"</svg>":"")),r]};let fe=class Ls{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let o=0,n=0;const l=t.length-1,a=this.parts,[f,g]=Wr(t,e);if(this.el=Ls.createElement(f,r),H.currentNode=this.el.content,e===2){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=H.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const d of s.getAttributeNames())if(d.endsWith(Rs)){const c=g[n++],h=s.getAttribute(d).split(T),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:o,name:p[2],strings:h,ctor:p[1]==="."?Jr:p[1]==="?"?Yr:p[1]==="@"?Qr:Kt}),s.removeAttribute(d)}else d.startsWith(T)&&(a.push({type:6,index:o}),s.removeAttribute(d));if(Ns.test(s.tagName)){const d=s.textContent.split(T),c=d.length-1;if(c>0){s.textContent=It?It.emptyScript:"";for(let h=0;h<c;h++)s.append(d[h],mt()),H.nextNode(),a.push({type:2,index:++o});s.append(d[c],mt())}}}else if(s.nodeType===8)if(s.data===Ts)a.push({type:2,index:o});else{let d=-1;for(;(d=s.data.indexOf(T,d+1))!==-1;)a.push({type:7,index:o}),d+=T.length-1}o++}}static createElement(t,e){const r=F.createElement("template");return r.innerHTML=t,r}};function et(i,t,e=i,r){var s,o;if(t===tt)return t;let n=r!==void 0?(s=e._$Co)==null?void 0:s[r]:e._$Cl;const l=vt(t)?void 0:t._$litDirective$;return(n==null?void 0:n.constructor)!==l&&((o=n==null?void 0:n._$AO)==null||o.call(n,!1),l===void 0?n=void 0:(n=new l(i),n._$AT(i,e,r)),r!==void 0?(e._$Co??(e._$Co=[]))[r]=n:e._$Cl=n),n!==void 0&&(t=et(i,n._$AS(i,t.values),n,r)),t}let Vr=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,s=((t==null?void 0:t.creationScope)??F).importNode(e,!0);H.currentNode=s;let o=H.nextNode(),n=0,l=0,a=r[0];for(;a!==void 0;){if(n===a.index){let f;a.type===2?f=new Ae(o,o.nextSibling,this,t):a.type===1?f=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(f=new Gr(o,this,t)),this._$AV.push(f),a=r[++l]}n!==(a==null?void 0:a.index)&&(o=H.nextNode(),n++)}return H.currentNode=F,s}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}},Ae=class Ms{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,r,s){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=et(this,t,e),vt(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==tt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):qr(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==_&&vt(this._$AH)?this._$AA.nextSibling.data=t:this.T(F.createTextNode(t)),this._$AH=t}$(t){var e;const{values:r,_$litType$:s}=t,o=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=fe.createElement(js(s.h,s.h[0]),this.options)),s);if(((e=this._$AH)==null?void 0:e._$AD)===o)this._$AH.p(r);else{const n=new Vr(o,this),l=n.u(this.options);n.p(r),this.T(l),this._$AH=n}}_$AC(t){let e=Xe.get(t.strings);return e===void 0&&Xe.set(t.strings,e=new fe(t)),e}k(t){Us(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,s=0;for(const o of t)s===e.length?e.push(r=new Ms(this.S(mt()),this.S(mt()),this,this.options)):r=e[s],r._$AI(o),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},Kt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,o){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=_}_$AI(t,e=this,r,s){const o=this.strings;let n=!1;if(o===void 0)t=et(this,t,e,0),n=!vt(t)||t!==this._$AH&&t!==tt,n&&(this._$AH=t);else{const l=t;let a,f;for(t=o[0],a=0;a<o.length-1;a++)f=et(this,l[r+a],e,a),f===tt&&(f=this._$AH[a]),n||(n=!vt(f)||f!==this._$AH[a]),f===_?t=_:t!==_&&(t+=(f??"")+o[a+1]),this._$AH[a]=f}n&&!s&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Jr=class extends Kt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}},Yr=class extends Kt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}},Qr=class extends Kt{constructor(t,e,r,s,o){super(t,e,r,s,o),this.type=5}_$AI(t,e=this){if((t=et(this,t,e,0)??_)===tt)return;const r=this._$AH,s=t===_&&r!==_||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,o=t!==_&&(r===_||s);s&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},Gr=class{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){et(this,t)}};const ts=Mt.litHtmlPolyfillSupport;ts==null||ts(fe,Ae),(Mt.litHtmlVersions??(Mt.litHtmlVersions=[])).push("3.1.3");const Kr=(i,t,e)=>{const r=(e==null?void 0:e.renderBefore)??t;let s=r._$litPart$;if(s===void 0){const o=(e==null?void 0:e.renderBefore)??null;r._$litPart$=s=new Ae(t.insertBefore(mt(),o),o,void 0,e??{})}return s._$AI(i),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Q=class extends J{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Kr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return tt}};Q._$litElement$=!0,Q.finalized=!0,(He=globalThis.litElementHydrateSupport)==null||He.call(globalThis,{LitElement:Q});const es=globalThis.litElementPolyfillSupport;es==null||es({LitElement:Q});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Zr={attribute:!0,type:String,converter:Lt,reflect:!1,hasChanged:Se},Xr=(i=Zr,t,e)=>{const{kind:r,metadata:s}=e;let o=globalThis.litPropertyMetadata.get(s);if(o===void 0&&globalThis.litPropertyMetadata.set(s,o=new Map),o.set(e.name,i),r==="accessor"){const{name:n}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,i)},init(l){return l!==void 0&&this.P(n,void 0,i),l}}}if(r==="setter"){const{name:n}=e;return function(l){const a=this[n];t.call(this,l),this.requestUpdate(n,a,i)}}throw Error("Unsupported decorator location: "+r)};function Is(i){return(t,e)=>typeof e=="object"?Xr(i,t,e):((r,s,o)=>{const n=s.hasOwnProperty(o);return s.constructor.createProperty(o,n?{...r,wrapped:!0}:r),n?Object.getOwnPropertyDescriptor(s,o):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function zs(i){return Is({...i,state:!0,attribute:!1})}function ti(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function ei(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Hs={};(function(i){var t=function(){var e=function(d,c,h,p){for(h=h||{},p=d.length;p--;h[d[p]]=c);return h},r=[1,9],s=[1,10],o=[1,11],n=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,m,u,y,k){var w=y.length-1;switch(u){case 1:return new m.Root({},[y[w-1]]);case 2:return new m.Root({},[new m.Literal({value:""})]);case 3:this.$=new m.Concat({},[y[w-1],y[w]]);break;case 4:case 5:this.$=y[w];break;case 6:this.$=new m.Literal({value:y[w]});break;case 7:this.$=new m.Splat({name:y[w]});break;case 8:this.$=new m.Param({name:y[w]});break;case 9:this.$=new m.Optional({},[y[w-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:r,13:s,14:o,15:n},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:r,13:s,14:o,15:n},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:r,13:s,14:o,15:n},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:r,12:[1,16],13:s,14:o,15:n},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(m,u){this.message=m,this.hash=u};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],m=[null],u=[],y=this.table,k="",w=0,Ot=0,Xt=2,Ie=1,or=u.slice.call(arguments,1),b=Object.create(this.lexer),L={yy:{}};for(var te in this.yy)Object.prototype.hasOwnProperty.call(this.yy,te)&&(L.yy[te]=this.yy[te]);b.setInput(c,L.yy),L.yy.lexer=b,L.yy.parser=this,typeof b.yylloc>"u"&&(b.yylloc={});var ee=b.yylloc;u.push(ee);var nr=b.options&&b.options.ranges;typeof L.yy.parseError=="function"?this.parseError=L.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var ar=function(){var W;return W=b.lex()||Ie,typeof W!="number"&&(W=h.symbols_[W]||W),W},x,M,E,se,B={},Rt,C,ze,Tt;;){if(M=p[p.length-1],this.defaultActions[M]?E=this.defaultActions[M]:((x===null||typeof x>"u")&&(x=ar()),E=y[M]&&y[M][x]),typeof E>"u"||!E.length||!E[0]){var re="";Tt=[];for(Rt in y[M])this.terminals_[Rt]&&Rt>Xt&&Tt.push("'"+this.terminals_[Rt]+"'");b.showPosition?re="Parse error on line "+(w+1)+`:
`+b.showPosition()+`
Expecting `+Tt.join(", ")+", got '"+(this.terminals_[x]||x)+"'":re="Parse error on line "+(w+1)+": Unexpected "+(x==Ie?"end of input":"'"+(this.terminals_[x]||x)+"'"),this.parseError(re,{text:b.match,token:this.terminals_[x]||x,line:b.yylineno,loc:ee,expected:Tt})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+M+", token: "+x);switch(E[0]){case 1:p.push(x),m.push(b.yytext),u.push(b.yylloc),p.push(E[1]),x=null,Ot=b.yyleng,k=b.yytext,w=b.yylineno,ee=b.yylloc;break;case 2:if(C=this.productions_[E[1]][1],B.$=m[m.length-C],B._$={first_line:u[u.length-(C||1)].first_line,last_line:u[u.length-1].last_line,first_column:u[u.length-(C||1)].first_column,last_column:u[u.length-1].last_column},nr&&(B._$.range=[u[u.length-(C||1)].range[0],u[u.length-1].range[1]]),se=this.performAction.apply(B,[k,Ot,w,L.yy,E[1],m,u].concat(or)),typeof se<"u")return se;C&&(p=p.slice(0,-1*C*2),m=m.slice(0,-1*C),u=u.slice(0,-1*C)),p.push(this.productions_[E[1]][0]),m.push(B.$),u.push(B._$),ze=y[p[p.length-2]][p[p.length-1]],p.push(ze);break;case 3:return!0}}return!0}},f=function(){var d={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var m=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var u=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===m.length?this.yylloc.first_column:0)+m[m.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[u[0],u[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,m,u;if(this.options.backtrack_lexer&&(u={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(u.yylloc.range=this.yylloc.range.slice(0))),m=c[0].match(/(?:\r\n?|\n).*/g),m&&(this.yylineno+=m.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:m?m[m.length-1].length-m[m.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var y in u)this[y]=u[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,m;this._more||(this.yytext="",this.match="");for(var u=this._currentRules(),y=0;y<u.length;y++)if(p=this._input.match(this.rules[u[y]]),p&&(!h||p[0].length>h[0].length)){if(h=p,m=y,this.options.backtrack_lexer){if(c=this.test_match(p,u[y]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,u[m]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,m,u){switch(m){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return d}();a.lexer=f;function g(){this.yy={}}return g.prototype=a,a.Parser=g,new g}();typeof ei<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(Hs);function V(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var Ds={Root:V("Root"),Concat:V("Concat"),Literal:V("Literal"),Splat:V("Splat"),Param:V("Param"),Optional:V("Optional")},Fs=Hs.parser;Fs.yy=Ds;var si=Fs,ri=Object.keys(Ds);function ii(i){return ri.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var qs=ii,oi=qs,ni=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Bs(i){this.captures=i.captures,this.re=i.re}Bs.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(r,s){typeof t[s+1]>"u"?e[r]=void 0:e[r]=decodeURIComponent(t[s+1])}),e};var ai=oi({Concat:function(i){return i.children.reduce((function(t,e){var r=this.visit(e);return{re:t.re+r.re,captures:t.captures.concat(r.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(ni,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new Bs({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),li=ai,ci=qs,hi=ci({Concat:function(i,t){var e=i.children.map((function(r){return this.visit(r,t)}).bind(this));return e.some(function(r){return r===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),di=hi,ui=si,pi=li,fi=di;Pt.prototype=Object.create(null);Pt.prototype.match=function(i){var t=pi.visit(this.ast),e=t.match(i);return e||!1};Pt.prototype.reverse=function(i){return fi.visit(this.ast,i)};function Pt(i){var t;if(this?t=this:t=Object.create(Pt.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=ui.parse(i),t}var gi=Pt,mi=gi,vi=mi;const yi=ti(vi);var bi=Object.defineProperty,_i=Object.getOwnPropertyDescriptor,Ws=(i,t,e,r)=>{for(var s=r>1?void 0:r?_i(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=(r?n(t,e,s):n(s))||s);return r&&s&&bi(t,e,s),s};class yt extends Q{constructor(t,e,r=""){super(),this._cases=[],this._fallback=()=>ht`
      <h1>Not Found</h1>
    `,this._cases=t.map(s=>({...s,route:new yi(s.path)})),this._historyObserver=new Z(this,e),this._authObserver=new Z(this,r)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),ht`
      <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(bs(this,"auth/redirect"),ht`
              <h1>Redirecting for Login</h1>
            `):e.view(e.params||{}):ht`
              <h1>Authenticating</h1>
            `;if("redirect"in e){const r=e.redirect;if(typeof r=="string")return this.redirect(r),ht`
              <h1>Redirecting to ${r}…</h1>
            `}}return this._fallback({})})()}</main>
    `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:r}=t,s=new URLSearchParams(e),o=r+e;for(const n of this._cases){const l=n.route.match(o);if(l)return{...n,path:r,params:l,query:s}}}redirect(t){_e(this,"history/redirect",{href:t})}}yt.styles=Ur`
    :host,
    main {
      display: contents;
    }
  `;Ws([zs()],yt.prototype,"_user",2);Ws([zs()],yt.prototype,"_match",2);const $i=Object.freeze(Object.defineProperty({__proto__:null,Element:yt,Switch:yt},Symbol.toStringTag,{value:"Module"})),wi=class Vs extends HTMLElement{constructor(){if(super(),Gt(Vs.template).attach(this),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};wi.template=Et`
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
  `;const xi=class Js extends HTMLElement{constructor(){super(),this._array=[],Gt(Js.template).attach(this),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Ys("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const r=new Event("change",{bubbles:!0}),s=e.value,o=e.closest("label");if(o){const n=Array.from(this.children).indexOf(o);this._array[n]=s,this.dispatchEvent(r)}}}),this.addEventListener("click",t=>{ue(t,"button.add")?jt(t,"input-array:add"):ue(t,"button.remove")&&jt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],Si(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const r=Array.from(this.children).indexOf(e);this._array.splice(r,1),e.remove()}}};xi.template=Et`
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
  `;function Si(i,t){t.replaceChildren(),i.forEach((e,r)=>t.append(Ys(e)))}function Ys(i,t){const e=i===void 0?"":`value="${i}"`;return Et`
    <label>
      <input ${e} />
      <button class="remove" type="button">Remove</button>
    </label>
  `}function O(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var Ai=Object.defineProperty,Ei=Object.getOwnPropertyDescriptor,Pi=(i,t,e,r)=>{for(var s=r>1?void 0:r?Ei(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=(r?n(t,e,s):n(s))||s);return r&&s&&Ai(t,e,s),s};class kt extends Q{constructor(t){super(),this._pending=[],this._observer=new Z(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([r,s])=>{console.log("Dispatching queued event",s,r),r.dispatchEvent(s)}),e.setEffect(()=>{var r;if(console.log("View effect",this,e,(r=this._context)==null?void 0:r.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const r=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",r),e.dispatchEvent(r)):(console.log("Queueing message event",r),this._pending.push([e,r]))}ref(t){return this.model?this.model[t]:void 0}}Pi([Is()],kt.prototype,"model",1);/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Nt=globalThis,Ee=Nt.ShadowRoot&&(Nt.ShadyCSS===void 0||Nt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Pe=Symbol(),ss=new WeakMap;let Qs=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==Pe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Ee&&t===void 0){const r=e!==void 0&&e.length===1;r&&(t=ss.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&ss.set(e,t))}return t}toString(){return this.cssText}};const ki=i=>new Qs(typeof i=="string"?i:i+"",void 0,Pe),A=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((r,s,o)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[o+1],i[0]);return new Qs(e,i,Pe)},Ci=(i,t)=>{if(Ee)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const r=document.createElement("style"),s=Nt.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},rs=Ee?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return ki(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Oi,defineProperty:Ri,getOwnPropertyDescriptor:Ti,getOwnPropertyNames:Ui,getOwnPropertySymbols:Ni,getPrototypeOf:ji}=Object,N=globalThis,is=N.trustedTypes,Li=is?is.emptyScript:"",ne=N.reactiveElementPolyfillSupport,ft=(i,t)=>i,zt={toAttribute(i,t){switch(t){case Boolean:i=i?Li:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ke=(i,t)=>!Oi(i,t),os={attribute:!0,type:String,converter:zt,reflect:!1,hasChanged:ke};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),N.litPropertyMetadata??(N.litPropertyMetadata=new WeakMap);class Y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=os){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&Ri(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){const{get:s,set:o}=Ti(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get(){return s==null?void 0:s.call(this)},set(n){const l=s==null?void 0:s.call(this);o.call(this,n),this.requestUpdate(t,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??os}static _$Ei(){if(this.hasOwnProperty(ft("elementProperties")))return;const t=ji(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ft("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ft("properties"))){const e=this.properties,r=[...Ui(e),...Ni(e)];for(const s of r)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const s of r)e.unshift(rs(s))}else t!==void 0&&e.push(rs(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ci(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostConnected)==null?void 0:r.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostDisconnected)==null?void 0:r.call(e)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$EC(t,e){var o;const r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){const n=(((o=r.converter)==null?void 0:o.toAttribute)!==void 0?r.converter:zt).toAttribute(e,r.type);this._$Em=t,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){var o;const r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const n=r.getPropertyOptions(s),l=typeof n.converter=="function"?{fromAttribute:n.converter}:((o=n.converter)==null?void 0:o.fromAttribute)!==void 0?n.converter:zt;this._$Em=s,this[s]=l.fromAttribute(e,n.type),this._$Em=null}}requestUpdate(t,e,r){if(t!==void 0){if(r??(r=this.constructor.getPropertyOptions(t)),!(r.hasChanged??ke)(this[t],e))return;this.P(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,r){this._$AL.has(t)||this._$AL.set(t,e),r.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[o,n]of s)n.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],n)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(r=this._$EO)==null||r.forEach(s=>{var o;return(o=s.hostUpdate)==null?void 0:o.call(s)}),this.update(e)):this._$EU()}catch(s){throw t=!1,this._$EU(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(r=>{var s;return(s=r.hostUpdated)==null?void 0:s.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}Y.elementStyles=[],Y.shadowRootOptions={mode:"open"},Y[ft("elementProperties")]=new Map,Y[ft("finalized")]=new Map,ne==null||ne({ReactiveElement:Y}),(N.reactiveElementVersions??(N.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const gt=globalThis,Ht=gt.trustedTypes,ns=Ht?Ht.createPolicy("lit-html",{createHTML:i=>i}):void 0,Gs="$lit$",U=`lit$${Math.random().toFixed(9).slice(2)}$`,Ks="?"+U,Mi=`<${Ks}>`,q=document,bt=()=>q.createComment(""),_t=i=>i===null||typeof i!="object"&&typeof i!="function",Zs=Array.isArray,Ii=i=>Zs(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",ae=`[ 	
\f\r]`,dt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,as=/-->/g,ls=/>/g,z=RegExp(`>|${ae}(?:([^\\s"'>=/]+)(${ae}*=${ae}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),cs=/'/g,hs=/"/g,Xs=/^(?:script|style|textarea|title)$/i,zi=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),v=zi(1),st=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),ds=new WeakMap,D=q.createTreeWalker(q,129);function tr(i,t){if(!Array.isArray(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return ns!==void 0?ns.createHTML(t):t}const Hi=(i,t)=>{const e=i.length-1,r=[];let s,o=t===2?"<svg>":"",n=dt;for(let l=0;l<e;l++){const a=i[l];let f,g,d=-1,c=0;for(;c<a.length&&(n.lastIndex=c,g=n.exec(a),g!==null);)c=n.lastIndex,n===dt?g[1]==="!--"?n=as:g[1]!==void 0?n=ls:g[2]!==void 0?(Xs.test(g[2])&&(s=RegExp("</"+g[2],"g")),n=z):g[3]!==void 0&&(n=z):n===z?g[0]===">"?(n=s??dt,d=-1):g[1]===void 0?d=-2:(d=n.lastIndex-g[2].length,f=g[1],n=g[3]===void 0?z:g[3]==='"'?hs:cs):n===hs||n===cs?n=z:n===as||n===ls?n=dt:(n=z,s=void 0);const h=n===z&&i[l+1].startsWith("/>")?" ":"";o+=n===dt?a+Mi:d>=0?(r.push(f),a.slice(0,d)+Gs+a.slice(d)+U+h):a+U+(d===-2?l:h)}return[tr(i,o+(i[e]||"<?>")+(t===2?"</svg>":"")),r]};class $t{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let o=0,n=0;const l=t.length-1,a=this.parts,[f,g]=Hi(t,e);if(this.el=$t.createElement(f,r),D.currentNode=this.el.content,e===2){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=D.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const d of s.getAttributeNames())if(d.endsWith(Gs)){const c=g[n++],h=s.getAttribute(d).split(U),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:o,name:p[2],strings:h,ctor:p[1]==="."?Fi:p[1]==="?"?qi:p[1]==="@"?Bi:Zt}),s.removeAttribute(d)}else d.startsWith(U)&&(a.push({type:6,index:o}),s.removeAttribute(d));if(Xs.test(s.tagName)){const d=s.textContent.split(U),c=d.length-1;if(c>0){s.textContent=Ht?Ht.emptyScript:"";for(let h=0;h<c;h++)s.append(d[h],bt()),D.nextNode(),a.push({type:2,index:++o});s.append(d[c],bt())}}}else if(s.nodeType===8)if(s.data===Ks)a.push({type:2,index:o});else{let d=-1;for(;(d=s.data.indexOf(U,d+1))!==-1;)a.push({type:7,index:o}),d+=U.length-1}o++}}static createElement(t,e){const r=q.createElement("template");return r.innerHTML=t,r}}function rt(i,t,e=i,r){var n,l;if(t===st)return t;let s=r!==void 0?(n=e._$Co)==null?void 0:n[r]:e._$Cl;const o=_t(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==o&&((l=s==null?void 0:s._$AO)==null||l.call(s,!1),o===void 0?s=void 0:(s=new o(i),s._$AT(i,e,r)),r!==void 0?(e._$Co??(e._$Co=[]))[r]=s:e._$Cl=s),s!==void 0&&(t=rt(i,s._$AS(i,t.values),s,r)),t}class Di{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,s=((t==null?void 0:t.creationScope)??q).importNode(e,!0);D.currentNode=s;let o=D.nextNode(),n=0,l=0,a=r[0];for(;a!==void 0;){if(n===a.index){let f;a.type===2?f=new Ct(o,o.nextSibling,this,t):a.type===1?f=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(f=new Wi(o,this,t)),this._$AV.push(f),a=r[++l]}n!==(a==null?void 0:a.index)&&(o=D.nextNode(),n++)}return D.currentNode=q,s}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class Ct{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,r,s){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=rt(this,t,e),_t(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==st&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ii(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==$&&_t(this._$AH)?this._$AA.nextSibling.data=t:this.T(q.createTextNode(t)),this._$AH=t}$(t){var o;const{values:e,_$litType$:r}=t,s=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=$t.createElement(tr(r.h,r.h[0]),this.options)),r);if(((o=this._$AH)==null?void 0:o._$AD)===s)this._$AH.p(e);else{const n=new Di(s,this),l=n.u(this.options);n.p(e),this.T(l),this._$AH=n}}_$AC(t){let e=ds.get(t.strings);return e===void 0&&ds.set(t.strings,e=new $t(t)),e}k(t){Zs(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,s=0;for(const o of t)s===e.length?e.push(r=new Ct(this.S(bt()),this.S(bt()),this,this.options)):r=e[s],r._$AI(o),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Zt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,o){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=$}_$AI(t,e=this,r,s){const o=this.strings;let n=!1;if(o===void 0)t=rt(this,t,e,0),n=!_t(t)||t!==this._$AH&&t!==st,n&&(this._$AH=t);else{const l=t;let a,f;for(t=o[0],a=0;a<o.length-1;a++)f=rt(this,l[r+a],e,a),f===st&&(f=this._$AH[a]),n||(n=!_t(f)||f!==this._$AH[a]),f===$?t=$:t!==$&&(t+=(f??"")+o[a+1]),this._$AH[a]=f}n&&!s&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Fi extends Zt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class qi extends Zt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class Bi extends Zt{constructor(t,e,r,s,o){super(t,e,r,s,o),this.type=5}_$AI(t,e=this){if((t=rt(this,t,e,0)??$)===st)return;const r=this._$AH,s=t===$&&r!==$||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,o=t!==$&&(r===$||s);s&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Wi{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){rt(this,t)}}const le=gt.litHtmlPolyfillSupport;le==null||le($t,Ct),(gt.litHtmlVersions??(gt.litHtmlVersions=[])).push("3.1.3");const Vi=(i,t,e)=>{const r=(e==null?void 0:e.renderBefore)??t;let s=r._$litPart$;if(s===void 0){const o=(e==null?void 0:e.renderBefore)??null;r._$litPart$=s=new Ct(t.insertBefore(bt(),o),o,void 0,e??{})}return s._$AI(i),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class S extends Y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Vi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return st}}var us;S._$litElement$=!0,S.finalized=!0,(us=globalThis.litElementHydrateSupport)==null||us.call(globalThis,{LitElement:S});const ce=globalThis.litElementPolyfillSupport;ce==null||ce({LitElement:S});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");const Ji={};function Yi(i,t,e){switch(i[0]){case"profile/save":Qi(i[1],e).then(s=>t(o=>({...o,profile:s}))).then(()=>{const{onSuccess:s}=i[1];s&&s()}).catch(s=>{const{onFailure:o}=i[1];o&&o(s)});break;case"profile/select":Gi(i[1],e).then(s=>t(o=>({...o,profile:s})));break;case"study-spot/index":Ki().then(s=>t(o=>({...o,studySpotIndex:s}))).catch(s=>{console.error("Failed to fetch study spots",s)});break;case"study-spot/select":Zi(i[1]).then(s=>t(o=>({...o,studySpot:s})));break;case"review/load":fetch(`/reviews/spot/${i[1].spotId}`).then(s=>s.json()).then(s=>{t(o=>({...o,reviews:s}))}).catch(s=>console.error("Failed to load reviews",s));break;case"review/load-by-user":Xi(i[1].userId).then(s=>t(o=>({...o,reviews:s})));break;case"review/save":fetch("/reviews",{method:"POST",headers:{"Content-Type":"application/json",...nt.headers(e)},body:JSON.stringify(i[1].review)}).then(s=>s.json()).then(s=>{t(o=>{const n=o.reviews?[...o.reviews,s]:[s];return{...o,reviews:n}}),i[1].onSuccess&&i[1].onSuccess()}).catch(s=>{console.error("Failed to save review",s),i[1].onFailure&&i[1].onFailure(s)});break;default:const r=i[0];throw new Error(`Unhandled message "${r}"`)}}function Qi(i,t){return fetch(`/api/profiles/${i.userid}`,{method:"PUT",headers:{"Content-Type":"application/json",...nt.headers(t)},body:JSON.stringify(i.profile)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to save profile for ${i.userid}`)}).then(e=>{if(e)return e})}function Gi(i,t){return fetch(`/api/profiles/${i.userid}`,{headers:nt.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Profile:",e),e})}function Ki(){return fetch("/study-spots",{method:"GET",headers:{"Content-Type":"application/json"}}).then(i=>{if(i.status===200)return i.json();throw void 0}).then(i=>{if(i){const{data:t}=i;return t}})}function Zi(i){return fetch(`/study-spots/${i.spotid}`,{method:"GET"}).then(t=>{if(t.status===200)return t.json()}).then(t=>{if(t)return console.log("Study Spot:",t),t})}function Xi(i){return fetch(`/reviews/user/${i}`,{method:"GET",headers:{"Content-Type":"application/json"}}).then(t=>{if(t.status===200)return t.json();throw new Error(`Failed to fetch reviews for user ${i}`)}).then(t=>t||[])}const Oe=class Oe extends S{constructor(){super(...arguments),this._onClickAway=t=>{this.contains(t.target)||(this.removeAttribute("open"),window.removeEventListener("click",this._onClickAway))}}render(){return v`
      <slot name="actuator">
        <button @click="${this.toggle}">
          <img src="/icons/menu.svg" alt="Menu" id="menu-icon" />
        </button>
      </slot>
      <div id="panel">
        <slot></slot>
      </div>
    `}toggle(){this.hasAttribute("open")?(this.removeAttribute("open"),window.removeEventListener("click",this._onClickAway)):(this.setAttribute("open",""),setTimeout(()=>{window.addEventListener("click",this._onClickAway)},0))}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("click",this._onClickAway)}};Oe.styles=A`
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
  `;let Dt=Oe;customElements.define("drop-down",Dt);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const to={attribute:!0,type:String,converter:zt,reflect:!1,hasChanged:ke},eo=(i=to,t,e)=>{const{kind:r,metadata:s}=e;let o=globalThis.litPropertyMetadata.get(s);if(o===void 0&&globalThis.litPropertyMetadata.set(s,o=new Map),o.set(e.name,i),r==="accessor"){const{name:n}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,i)},init(l){return l!==void 0&&this.P(n,void 0,i),l}}}if(r==="setter"){const{name:n}=e;return function(l){const a=this[n];t.call(this,l),this.requestUpdate(n,a,i)}}throw Error("Unsupported decorator location: "+r)};function P(i){return(t,e)=>typeof e=="object"?eo(i,t,e):((r,s,o)=>{const n=s.hasOwnProperty(o);return s.constructor.createProperty(o,n?{...r,wrapped:!0}:r),n?Object.getOwnPropertyDescriptor(s,o):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function j(i){return P({...i,state:!0,attribute:!1})}const R=A`
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
`;var so=Object.defineProperty,ro=Object.getOwnPropertyDescriptor,io=(i,t,e,r)=>{for(var s=r>1?void 0:r?ro(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=(r?n(t,e,s):n(s))||s);return r&&s&&so(t,e,s),s};const Wt=class Wt extends S{constructor(){super(...arguments),this.username="anonymous",this._authObserver=new Z(this,"slostudyspots:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this.username=t.username)})}render(){return v`
      <header class="navbar">
        <div class="navbar-content">
          <a class="logo" href="/app">
            <img src="/icons/desk-lamp.svg" alt="SLOStudySpots Logo" />
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
                  <a class="navbar-menu" href="/app/profile/${this.username}">
                    <!-- <img src="icons/avatar.svg" alt="profile-icon" /> -->
                    Profile
                  </a>
                </li>
                <li>
                  <a class="group-icon" href="/app/rankings">
                    <!-- <img src="icons/ranking.svg" alt="ranking-icon" /> -->
                    Community Rankings
                  </a>
                </li>
                <li>
                  <a class="group-icon" href="/app/add-spot">
                    <!-- <img src="icons/create.svg" alt="create-icon" /> -->
                    Add a Spot
                  </a>
                </li>
                <li>
                  <label class="light-dark-switch" @change=${oo}>
                    <input type="checkbox" autocomplete="off" />
                    Dark mode
                  </label>
                </li>
                <li>
                  <a href="#" @click=${no}> Sign out </a>
                </li>
              </ul>
            </drop-down>
          </nav>
        </div>
      </header>
    `}};Wt.uses=O({"drop-down":Dt}),Wt.styles=[R,A`
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
  `];let Ft=Wt;io([j()],Ft.prototype,"username",2);function oo(i){const e=i.target.checked;Qt.relay(i,"dark-mode",{checked:e}),document.body.classList.toggle("dark-mode",e)}function no(i){Qt.relay(i,"auth:message",["auth/signout"])}var ao=Object.defineProperty,lo=Object.getOwnPropertyDescriptor,at=(i,t,e,r)=>{for(var s=r>1?void 0:r?lo(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=(r?n(t,e,s):n(s))||s);return r&&s&&ao(t,e,s),s};const er=A`
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
`,Re=class Re extends S{render(){return v`
    <section class="profile-container">
      <div class="profile-header">
        <slot name="avatar"></slot>
        <div>
          <h1><slot name="name"></slot></h1>
          <nav>
            <a href="${this.username}/edit" class="edit">Edit Profile</a>
          </nav>
        </div>
      </div>
      <div class="profile-section">
        <h2>General Information</h2>
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
      <div class="profile-section">
        <h2>Reviews</h2>
        <dl>
          <dt>Number of Reviews:</dt>
          <dd><slot name="reviewsCount"></slot></dd>
        </dl>
        <a href="/reviews/${this.username}" class="link-view-all">View All Reviews</a>
      </div>
      <div class="profile-section">
        <h2>Favorite Study Spots</h2>
        <dl>
          <dt>Favorite Study Spots:</dt>
          <dd><slot name="favSpots"></slot></dd>
        </dl>
        <a href="/favorites/${this.username}" class="link-view-all">View Favorite Spots</a>
      </div>
    </section>
  `}};Re.styles=[R,er,A`
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
      dl {
        display: grid;
        grid-template-columns: 1fr 3fr;
        gap: 10px;
      }
      dt {
        font-weight: bold;
        color: var(--color-primary);
        padding-right: 20px;
      }
      dd {
        padding-left: 20px;
      }
      .profile-section {
        background-color: var(--color-background-primary);
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        margin-bottom: 20px;
      }
      nav > a:hover {
        color: var(--color-secondary);
      }
    `];let qt=Re;at([P()],qt.prototype,"username",2);const Vt=class Vt extends S{render(){return v`
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
    `}};Vt.uses=O({"mu-form":Sr.Element}),Vt.styles=[R,er,A`
      mu-form {
        grid-column: key / end;
      }
      mu-form input {
        grid-column: input;
      }
    `];let wt=Vt;at([P()],wt.prototype,"username",2);at([P({attribute:!1})],wt.prototype,"init",2);const Jt=class Jt extends kt{constructor(){super("slostudyspots:model"),this.edit=!1,this.userid=""}get profile(){return this.model.profile}attributeChangedCallback(t,e,r){super.attributeChangedCallback(t,e,r),t==="user-id"&&e!==r&&r&&(console.log("Profiler Page:",r),this.dispatchMessage(["profile/select",{userid:r}]))}render(){var g,d,c;const{avatar:t,name:e,userid:r,email:s,bio:o,reviewsCount:n}=this.profile||{},l=((d=(g=this.profile)==null?void 0:g.favSpots)==null?void 0:d.map(h=>v`<li>${h}</li>`))||v``,a=(c=this.profile)!=null&&c.dateJoined?new Date(this.profile.dateJoined).toLocaleDateString():"Date unavailable",f=t?v`<img src=${t} alt="Profile Avatar" slot="avatar">`:v`<div slot="avatar">No Avatar</div>`;return this.edit?v`
        <profile-editor
          username=${r}
          .init=${this.profile}
          @mu-form:submit=${h=>this._handleSubmit(h)}>
          ${f}
        </profile-editor>
      `:v`
        <profile-viewer username=${r}>
          ${f}
          <span slot="name">${e}</span>
          <span slot="userid">${r}</span>
          <span slot="email">${s||"No email available"}</span>
          <span slot="bio">${o||"No bio available"}</span>
          <span slot="dateJoined">${a}</span>
          <span slot="reviewsCount">${n}</span>
          <ul slot="favSpots">${l}</ul>
        </profile-viewer>
      `}_handleSubmit(t){console.log("Handling submit of mu-form"),this.dispatchMessage(["profile/save",{userid:this.userid,profile:t.detail,onSuccess:()=>Ss.dispatch(this,"history/navigate",{href:`/app/profile/${this.userid}`}),onFailure:e=>console.log("ERROR:",e)}])}};Jt.uses=O({"profile-viewer":qt,"profile-editor":wt}),Jt.styles=[R];let it=Jt;at([P({type:Boolean,reflect:!0})],it.prototype,"edit",2);at([P({attribute:"user-id",reflect:!0})],it.prototype,"userid",2);at([j()],it.prototype,"profile",1);var co=Object.defineProperty,ho=Object.getOwnPropertyDescriptor,uo=(i,t,e,r)=>{for(var s=r>1?void 0:r?ho(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=(r?n(t,e,s):n(s))||s);return r&&s&&co(t,e,s),s};O({"restful-form":Es.FormElement});const Te=class Te extends S{constructor(){super(...arguments),this.message=""}render(){return v`
      <restful-form
        new
        .init=${{username:"",password:""}}
        src="/auth/login"
        @mu-rest-form:created=${this._handleSuccess}
        @mu-rest-form:error=${this._handleError}>
        <slot></slot>
      </restful-form>
      <p class="error">
        ${this.message?"Invalid Username or Password":""}
      </p>
      <pre>${this.message}</pre>
    `}get next(){return new URLSearchParams(document.location.search).get("next")}_handleSuccess(t){const e=t.detail,{token:r}=e.created,s=this.next||"/";console.log("Login successful",e,s),Qt.relay(t,"auth:message",["auth/signin",{token:r,redirect:s}])}_handleError(t){const{error:e}=t.detail;console.log("Login failed",t.detail),this.message=e.toString()}};Te.styles=A`
    .error {
      color: firebrick;
    }
  `;let Bt=Te;uo([P()],Bt.prototype,"message",2);O({"mu-auth":nt.Provider,"login-form":Bt});const Ue=class Ue extends S{render(){return v`
      <div class="login-register-container">
        <h2>User Login</h2>
        <main class="card">
          <p>
            <a href="/app">← Back to home</a>
          </p>
          <login-form>
            <label>
              <span>Username:</span>
              <input name="username" autocomplete="off" />
            </label>
            <label>
              <span>Password:</span>
              <input type="password" name="password" />
            </label>
          </login-form>
          <p>
            Or did you want to
            <a href="/app/register">Sign up as a new user</a>
            ?
          </p>
          <img src="/images/person-studying.svg" alt="Person Studying">
        </main>
      </div>
    `}};Ue.styles=[R,A`
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
    `];let ge=Ue;O({"restful-form":Es.FormElement});class po extends S{render(){return v`
      <restful-form new src="/auth/register">
        <slot></slot>
      </restful-form>
    `}get next(){return new URLSearchParams(document.location.search).get("next")}constructor(){super(),this.addEventListener("mu-rest-form:created",t=>{const e=t.detail,{token:r}=e.created,s=this.next||"/";console.log("Signup successful",e,s),Qt.relay(t,"auth:message",["auth/signin",{token:r,redirect:s}])})}}O({"mu-auth":nt.Provider,"register-form":po});const Ne=class Ne extends S{render(){return v`
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
        <img src="./images/person-studying.svg" alt="Person Studying">
      </main>
    </div>
  `}};Ne.styles=[R,A`
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
    `];let me=Ne;var fo=Object.defineProperty,go=Object.getOwnPropertyDescriptor,sr=(i,t,e,r)=>{for(var s=r>1?void 0:r?go(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=(r?n(t,e,s):n(s))||s);return r&&s&&fo(t,e,s),s};const je=class je extends S{constructor(){super(...arguments),this.open=!1,this.sort=!1}openPopup(){this.open=!0}closePopup(t){t.target.classList.contains("popup-overlay")&&(this.open=!1,document.body.style.overflow="",console.log("Closing popup..."))}triggerSort(){this.sort=!this.sort,this.dispatchEvent(new CustomEvent("sort-requested",{detail:this.sort}))}render(){return v`
  
        <button class="filter-container" @click="${this.openPopup}">
          <svg class="filter-icon">
            <use href="/icons/filter.svg#icon-filter" />
          </svg>
          <h4>Filter</h4>
        </button>

        ${this.open?v`
                <div class="popup-overlay" @click="${this.closePopup}">
                  <div class="popup">
                    <div class="filter-title">
                      <h3>Change Filters</h3>

                      <img
                        class="close"
                        src="/icons/close.svg"
                        alt="close"
                        class="close-button"
                        @click="${()=>this.open=!1}"
                        width="30px"
                      />
                    </div>

                    <button @click="${this.triggerSort}" class="sort-button">
                      Sort Alphabetically
                    </button>

                    <button @click="${this.triggerSort}" class="sort-button">
                      Sort By Highest Reviews
                    </button>

                  </div>
                </div>
              `:""}
      </div>
    `}};je.styles=A`
    * {
      margin: 0;
      padding: 0;
    }

    .popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5); /* Darkens the background */
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .popup {
      background-color: white;
      padding: 20px;
      height: 40vh;
      width: 40vw;
      border-radius: 5px;
      position: relative;
    }

    .filter-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      padding: 10px;
      border-radius: 10px;
      background-color: var(--color-main-bg);
      margin-left: 30px;
      border: 1px solid var(--color-light);
    }

    .filter-icon {
      display: inline;
      height: 25px;
      width: 25px;
      vertical-align: top;
      fill: var(--color-primary);
      stroke: var(--color-primary);
      transform: translate(1.5px, 1px);
      background-color: inherit;
    }

    .filter-container h4 {
      font-size: 15px;
      font-weight: 500;
      color: var(--color-primary);
      background-color: inherit;
    }

    .filter-container:hover {
      cursor: pointer;
      background-color: var(--color-links);
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
      background-color: white;
      border: 1px solid var(--color-light);
      padding: 10px 20px;
      border-radius: 5px;
      margin-top: 10px;
    }

    button:hover {
      background-color: rgb(230, 230, 230);
    }
    
  `;let xt=je;sr([P({reflect:!0,type:Boolean})],xt.prototype,"open",2);sr([j()],xt.prototype,"sort",2);var mo=Object.defineProperty,vo=Object.getOwnPropertyDescriptor,rr=(i,t,e,r)=>{for(var s=r>1?void 0:r?vo(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=(r?n(t,e,s):n(s))||s);return r&&s&&mo(t,e,s),s};const Yt=class Yt extends kt{constructor(){super("slostudyspots:model"),this.sortedStudySpots=[],this.sortedStudySpots=this.studySpotIndex}get studySpotIndex(){return this.model.studySpotIndex||[]}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["study-spot/index"])}firstUpdated(){this.addEventListener("sort-requested",this.handleSortRequested)}handleSortRequested(t){t.detail?this.sortedStudySpots=[...this.studySpotIndex].sort((r,s)=>r.name.localeCompare(s.name)):this.sortedStudySpots=this.studySpotIndex,this.requestUpdate()}render(){const t=e=>{var n;const{name:r}=e,{_id:s}=e,o=((n=e.photos)==null?void 0:n[0])||"/icons/default-photo.webp";return v`
      <li class="study-spot-container">
        <a href="/app/study-spots/${s}">
          <img src="${o}" alt="${r}" />
          <div class="study-spot-content">
            <h3>${r}</h3>
            <p> Reviews: 1 </p>
          </div>
        </a>
      </li>
    `};return v`
      <main>
        <section class="welcome-section">
          <h1>Welcome to SLOStudySpots</h1>
          <p>Find the best spots to study in San Luis Obispo!</p>
        </section>

        <section class="filter-section">
          <filter-popup></filter-popup>
        </section>

        <section class="featured-spots">
          <h2>Featured Study Spots</h2>
          <ul class="spots-list">
            ${this.studySpotIndex.map(t)}
          </ul>
        </section>
      </main>
    `}};Yt.uses=O({"filter-popup":xt}),Yt.styles=[R,A`
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

      .featured-spots {
        margin: var(--space-regular) 0;
      }
      
      .featured-spots h2 {
        font-size: var(--font-size-large);
        color: var(--color-secondary);
        margin-bottom: var(--space-small);
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

      .filter-section {
        display: flex;
        justify-content: flex-end;
        padding: 0;
        margin: 0;
      }

    `];let St=Yt;rr([j()],St.prototype,"studySpotIndex",1);rr([j()],St.prototype,"sortedStudySpots",2);var yo=Object.defineProperty,bo=Object.getOwnPropertyDescriptor,Ce=(i,t,e,r)=>{for(var s=r>1?void 0:r?bo(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=(r?n(t,e,s):n(s))||s);return r&&s&&yo(t,e,s),s};const Le=class Le extends kt{constructor(){super("slostudyspots:model"),this.spotid="",this.reviews=[]}get studySpot(){return this.model.studySpot}attributeChangedCallback(t,e,r){super.attributeChangedCallback(t,e,r),t==="spot-id"&&e!==r&&r&&(console.log("Study Spot Page:",r),this.dispatchMessage(["study-spot/select",{spotid:r}]),this.dispatchMessage(["review/load",{spotId:r}]))}render(){var d,c,h,p,m;const{name:t,address:e,hoursOfOperation:r,ratings:s,link:o}=this.studySpot||{},n=((c=(d=this.studySpot)==null?void 0:d.photos)==null?void 0:c[0])||"/icons/default-photo.webp",l=((p=(h=this.studySpot)==null?void 0:h.tags)==null?void 0:p.map(u=>v`<span class="feature-tag">${u}</span>`))||v``,a=this.model.reviews||[];function f(u){if(u===-1)return"Closed";const y=Math.floor(u/60),k=u%60,w=y>=12?"PM":"AM",Ot=y%12===0?12:y%12,Xt=k<10?`0${k}`:k;return`${Ot}:${Xt} ${w}`}function g(u){const y=f(u.open||0),k=f(u.close||0);return u.isOpen24Hours?"Open 24 Hours":`${y} - ${k}`}return v`
      <main>
        <section class="gallery-preview">
          <img src="${n}" alt="View of ${(m=this.studySpot)==null?void 0:m.name}" class="featured-image">
          <div class="view-gallery-overlay">
            <h2 class="spot-title">${t}</h2>
            <a href="" class="btn-view-gallery">
              <img src="/icons/default-photo.svg" alt="Gallery Icon">
              View Gallery
            </a>
          </div>
        </section>

        <section class="study-spot-actions">
          <a href="#" class="btn-add-photo">
            <img src="/icons/upload-photo.svg" alt="Add Photo Icon" class="btn-icon-white">
            Add Photo
          </a>
          <a href="app/study-spot/${this.spotid}/write-review" class="btn-write-review">
            <img src="/icons/create.svg" alt="Write Review Icon" class="btn-icon-white">
            Write Review
          </a>
        </section>

        <div class="details-reviews-container">
          <div class="details-ratings">
            <section class="spot-details">
              <h3>Details</h3>
              <p><strong>Address: </strong>${e}</p>
              <p><strong>Website Link:</strong> <a href="${o}" target="_blank">${o}</a></p>
              <p>
                <strong>Features:</strong>
                ${l}
              </p>
              <p>
              <strong>Hours of Operation:</strong>
                ${r==null?void 0:r.map(u=>v`
                  <div class="hours">
                    <span>${u.startDay} - ${u.endDay}: ${g(u)}</span>
                  </div>
                `)}
              </p>
            </section>
            <section class="rating-breakdown">
              <h3><strong>Overall Rating:</strong></h3>
              <div class="overall-rating-image-container">
                <img src="/icons/star-rating.svg" alt="Star Rating" class="star-icon"/>
                <h4 class="rating-value">${s==null?void 0:s.overall}</h4>
              </div>
              <h3>Rating Breakdown</h3>
              <p><strong>Quietness:</strong> ${s==null?void 0:s.quietness} / 5</p>
              <p><strong>Wifi Quality:</strong> ${s==null?void 0:s.wifiQuality} / 5</p>
              <p><strong>Crowdedness:</strong> ${s==null?void 0:s.crowdedness} / 5</p>
              <p><strong>Power Outlets:</strong> ${s==null?void 0:s.powerOutlets} / 5</p>
              <p><strong>Amenities:</strong> ${s==null?void 0:s.amenities} / 5</p>
            </section>
          </div>
          <section class="user-reviews">
            <h3>User Reviews</h3>
            ${a.length>0?a.map(u=>v`
          <div class="review">
            <h4>${u.userId.name}</h4>
            
            <br/>
            <p><strong>Comment: </strong>${u.comment}</p>
            <br/>
            <p><strong>Best Time to Go</strong>: ${u.bestTimeToGo}</p>
            <br/>
            <div>
              <strong>Overall Rating:</strong> ${u.overallRating} / 5
              <br/>
              <strong>Quietness:</strong> ${u.quietnessRating} / 5
              <br/>
              <strong>Wifi Quality:</strong> ${u.wifiQualityRating} / 5
              <br/>
              <strong>Crowdedness:</strong> ${u.crowdednessRating} / 5
              <br/>
              <strong>Power Outlets:</strong> ${u.powerOutletRating} / 5
              <br/>
              <strong>Amenities:</strong> ${u.amenitiesRating} / 5
            </div>
          </div>
        `):v`<p>No reviews yet.</p>`}
          </section>
        </div>
      </main>
    `}};Le.styles=[R,A`
      main {
        padding: var(--space-regular);
        flex-grow: 1;
      }

      .gallery-preview {
        position: relative;
        /* are the below needed? */
        width: 100%; /* Full width */
        margin: 0 auto; /* Center aligning */
      }
      
      .featured-image {
        width: 100%;
        display: block;
        height: 300px;
        object-fit: cover;
      }
      
      .view-gallery-overlay {
        position: absolute;
        bottom: 0;
        left: 0; /* not needed? */
        width: 100%;
        background: linear-gradient(to top, rgba(0,0,0,0.8) 10%, transparent 90%);
        padding: 10px 20px;
      }
      
      .spot-title {
        color: white;
        font-size: 2rem;
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
        justify-content: space-between; /* might not need? */
        margin-top: 20px;
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
      .details-ratings {
        flex: 1;
        padding-right: 10px;
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

      a {
        color: var(--color-secondary);
        text-decoration: none;
        transition: color 0.3s ease, text-decoration 0.3s ease;
      }
  
      a:hover {
        color: var(--color-links);
        text-decoration: underline;
      }
    `];let ot=Le;Ce([P({attribute:"spot-id",reflect:!0})],ot.prototype,"spotid",2);Ce([j()],ot.prototype,"studySpot",1);Ce([j()],ot.prototype,"reviews",2);var _o=Object.defineProperty,$o=Object.getOwnPropertyDescriptor,ir=(i,t,e,r)=>{for(var s=r>1?void 0:r?$o(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(s=(r?n(t,e,s):n(s))||s);return r&&s&&_o(t,e,s),s};const Me=class Me extends kt{constructor(){super("slostudyspots:model"),this.userId="",this.reviews=[]}attributeChangedCallback(t,e,r){super.attributeChangedCallback(t,e,r),t==="user-id"&&e!==r&&r&&this.dispatchMessage(["review/load-by-user",{userId:r}])}render(){const t=this.model.reviews||[];return console.log("Reviews:",t),v`
      <main>
        <section class="user-reviews">
          <h2>${this.userId} Reviews</h2>
          <ul class="reviews-list">
            ${t.length>0?t.map(e=>v`
                  <li class="review-item">
                    <h3>${e.spotId}</h3>
                    <p>${e.comment}</p>
                    <div class="review-ratings">
                      <p><strong>Overall Rating:</strong> ${e.overallRating} / 5</p>
                      <p><strong>Quietness:</strong> ${e.quietnessRating} / 5</p>
                      <p><strong>Wifi Quality:</strong> ${e.wifiQualityRating} / 5</p>
                      <p><strong>Crowdedness:</strong> ${e.crowdednessRating} / 5</p>
                      <p><strong>Power Outlets:</strong> ${e.powerOutletRating} / 5</p>
                      <p><strong>Amenities:</strong> ${e.amenitiesRating} / 5</p>
                    </div>
                  </li>
                `):v`<p>No reviews yet.</p>`}
          </ul>
        </section>
      </main>
    `}};Me.styles=[R,A`
      main {
        padding: var(--space-regular);
        flex-grow: 1;
      }

      .user-reviews {
        text-align: center;
        padding: var(--space-regular) 0;
      }

      .reviews-list {
        list-style: none;
        padding: 0;
      }

      .review-item {
        border: 1px solid var(--color-primary);
        border-radius: var(--border-radius);
        padding: var(--space-regular);
        margin-bottom: var(--space-small);
        background-color: var(--color-background-secondary);
      }

      .review-item h3 {
        margin: var(--space-small) 0;
        color: var(--color-primary);
      }

      .review-ratings p {
        margin: var(--space-small) 0;
      }
    `];let At=Me;ir([P({attribute:"user-id",reflect:!0})],At.prototype,"userId",2);ir([j()],At.prototype,"reviews",2);const wo=[{auth:"protected",path:"/app/profile/:id/edit",view:i=>v`
      <profile-view edit user-id=${i.id}></profile-view>
    `},{auth:"protected",path:"/app/profile/:id",view:i=>v`
      <profile-view user-id=${i.id}></profile-view>
    `},{path:"/app/study-spots/:id",view:i=>v`
      <study-spot-view spot-id=${i.id}></study-spot-view>
    `},{path:"/app/user-reviews/:id",view:i=>v`
      <user-review-view user-id=${i.id}></user-review-view>
    `},{path:"/app/login",view:()=>v` <login-view></login-view> `},{path:"/app/register",view:()=>v` <register-view></register-view> `},{path:"/app",view:()=>v`
      <home-view></home-view>
    `},{path:"/",redirect:"/app"}];O({"mu-auth":nt.Provider,"mu-history":Ss.Provider,"mu-store":class extends Rr.Provider{constructor(){super(Yi,Ji,"slostudyspots:auth")}},"mu-switch":class extends $i.Element{constructor(){super(wo,"slostudyspots:history","slostudyspots:auth")}},"nav-header":Ft,"profile-view":it,"login-view":ge,"register-view":me,"home-view":St,"study-spot-view":ot,"user-review-view":At});
