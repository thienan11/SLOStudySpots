(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function e(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=e(r);fetch(r.href,o)}})();var Je;class $t extends Error{}$t.prototype.name="InvalidTokenError";function gs(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function ms(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return gs(t)}catch{return atob(t)}}function wr(i,t){if(typeof i!="string")throw new $t("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=i.split(".")[e];if(typeof s!="string")throw new $t(`Invalid token specified: missing part #${e+1}`);let r;try{r=ms(s)}catch(o){throw new $t(`Invalid token specified: invalid base64 for part #${e+1} (${o.message})`)}try{return JSON.parse(r)}catch(o){throw new $t(`Invalid token specified: invalid json for part #${e+1} (${o.message})`)}}const vs="mu:context",ve=`${vs}:change`;class ys{constructor(t,e){this._proxy=bs(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class Se extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new ys(t,this),this.style.display="contents"}attach(t){return this.addEventListener(ve,t),t}detach(t){this.removeEventListener(ve,t)}}function bs(i,t){return new Proxy(i,{get:(s,r,o)=>{if(r==="then")return;const n=Reflect.get(s,r,o);return console.log(`Context['${r}'] => `,n),n},set:(s,r,o,n)=>{const l=i[r];console.log(`Context['${r.toString()}'] <= `,o);const a=Reflect.set(s,r,o,n);if(a){let f=new CustomEvent(ve,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(f,{property:r,oldValue:l,value:o}),t.dispatchEvent(f)}else console.log(`Context['${r}] was not set to ${o}`);return a}})}function $s(i,t){const e=xr(t,i);return new Promise((s,r)=>{if(e){const o=e.localName;customElements.whenDefined(o).then(()=>s(e))}else r({context:t,reason:`No provider for this context "${t}:`})})}function xr(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const r=t.getRootNode();if(r instanceof ShadowRoot)return xr(i,r.host)}class _s extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function Sr(i="mu:message"){return(t,...e)=>t.dispatchEvent(new _s(e,i))}class Ae{constructor(t,e,s="service:message",r=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=r}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function ws(i){return t=>({...t,...i})}const ye="mu:auth:jwt",Ar=class kr extends Ae{constructor(t,e){super((s,r)=>this.update(s,r),t,kr.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:r}=t[1];return e(Ss(s)),he(r);case"auth/signout":return e(As()),he(this._redirectForLogin);case"auth/redirect":return he(this._redirectForLogin,{next:window.location.href});default:const o=t[0];throw new Error(`Unhandled Auth message "${o}"`)}}};Ar.EVENT_TYPE="auth:message";let Er=Ar;const Pr=Sr(Er.EVENT_TYPE);function he(i,t={}){if(!i)return;const e=window.location.href,s=new URL(i,e);return Object.entries(t).forEach(([r,o])=>s.searchParams.set(r,o)),()=>{console.log("Redirecting to ",i),window.location.assign(s)}}class xs extends Se{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){super({user:ct.authenticateFromLocalStorage()})}connectedCallback(){new Er(this.context,this.redirect).attach(this)}}class lt{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(ye),t}}class ct extends lt{constructor(t){super();const e=wr(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new ct(t);return localStorage.setItem(ye,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(ye);return t?ct.authenticate(t):new lt}}function Ss(i){return ws({user:ct.authenticate(i),token:i})}function As(){return i=>{const t=i.user;return{user:t&&t.authenticated?lt.deauthenticate(t):t,token:""}}}function ks(i){return i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function Es(i){return i.authenticated?wr(i.token||""):{}}const D=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:ct,Provider:xs,User:lt,dispatch:Pr,headers:ks,payload:Es},Symbol.toStringTag,{value:"Module"}));function Dt(i,t,e){const s=i.target,r=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${i.type}:`,r),s.dispatchEvent(r),i.stopPropagation()}function be(i,t="*"){return i.composedPath().find(s=>{const r=s;return r.tagName&&r.matches(t)})}const ee=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:be,relay:Dt},Symbol.toStringTag,{value:"Module"})),Ps=new DOMParser;function Tt(i,...t){const e=i.map((n,l)=>l?[t[l-1],n]:[n]).flat().join(""),s=Ps.parseFromString(e,"text/html"),r=s.head.childElementCount?s.head.children:s.body.children,o=new DocumentFragment;return o.replaceChildren(...r),o}function re(i){const t=i.firstElementChild,e=t&&t.tagName==="TEMPLATE"?t:void 0;return{attach:s};function s(r,o={mode:"open"}){const n=r.attachShadow(o);return e&&n.appendChild(e.content.cloneNode(!0)),n}}const Cr=class Or extends HTMLElement{constructor(){super(),this._state={},re(Or.template).attach(this),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}}),this.form&&this.form.addEventListener("submit",t=>{t.preventDefault(),Dt(t,"mu-form:submit",this._state)})}set init(t){this._state=t||{},Os(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}};Cr.template=Tt`
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
  `;let Cs=Cr;function Os(i,t){const e=Object.entries(i);for(const[s,r]of e){const o=t.querySelector(`[name="${s}"]`);if(o){const n=o;switch(n.type){case"checkbox":const l=n;l.checked=!!r;break;case"date":n.value=r.toISOString().substr(0,10);break;default:n.value=r;break}}}return i}const Rs=Object.freeze(Object.defineProperty({__proto__:null,Element:Cs},Symbol.toStringTag,{value:"Module"})),Rr=class Tr extends Ae{constructor(t){super((e,s)=>this.update(e,s),t,Tr.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:r}=t[1];e(Us(s,r));break}case"history/redirect":{const{href:s,state:r}=t[1];e(Ls(s,r));break}}}};Rr.EVENT_TYPE="history:message";let ke=Rr;class Ye extends Se{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=Ts(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),Ee(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new ke(this.context).attach(this)}}function Ts(i){const t=i.currentTarget,e=s=>s.tagName=="A"&&s.href;if(i.button===0)if(i.composed){const r=i.composedPath().find(e);return r||void 0}else{for(let s=i.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function Us(i,t={}){return history.pushState(t,"",i),()=>({location:document.location,state:history.state})}function Ls(i,t={}){return history.replaceState(t,"",i),()=>({location:document.location,state:history.state})}const Ee=Sr(ke.EVENT_TYPE),Ur=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Ye,Provider:Ye,Service:ke,dispatch:Ee},Symbol.toStringTag,{value:"Module"}));class I{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const r=new Ve(this._provider,t);this._effects.push(r),e(r)}else $s(this._target,this._contextLabel).then(r=>{const o=new Ve(r,t);this._provider=r,this._effects.push(o),r.attach(n=>this._handleChange(n)),e(o)}).catch(r=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,r))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),this._effects.forEach(e=>e.runEffect())}}class Ve{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const Pe=class Lr extends HTMLElement{constructor(){super(),this._state={},this._user=new lt,this._authObserver=new I(this,"blazing:auth"),re(Lr.template).attach(this),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",r=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;js(r,this._state,e,this.authorization).then(o=>mt(o,this)).then(o=>{const n=`mu-rest-form:${s}`,l=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,[s]:o,url:r}});this.dispatchEvent(l)}).catch(o=>{const n="mu-rest-form:error",l=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,error:o,url:r,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},mt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&$e(this.src,this.authorization).then(e=>{this._state=e,mt(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&$e(this.src,this.authorization).then(r=>{this._state=r,mt(r,this)});break;case"new":s&&(this._state={},mt({},this));break}}};Pe.observedAttributes=["src","new","action"];Pe.template=Tt`
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
  `;let Ns=Pe;function $e(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function mt(i,t){const e=Object.entries(i);for(const[s,r]of e){const o=t.querySelector(`[name="${s}"]`);if(o){const n=o;switch(n.type){case"checkbox":const l=n;l.checked=!!r;break;default:n.value=r;break}}}return i}function js(i,t,e="PUT",s={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(r=>{if(r.status!=200&&r.status!=201)throw`Form submission failed: Status ${r.status}`;return r.json()})}const Nr=Object.freeze(Object.defineProperty({__proto__:null,FormElement:Ns,fetchData:$e},Symbol.toStringTag,{value:"Module"})),jr=class Mr extends Ae{constructor(t,e){super(e,t,Mr.EVENT_TYPE,!1)}};jr.EVENT_TYPE="mu:message";let zr=jr;class Ms extends Se{constructor(t,e,s){super(e),this._user=new lt,this._updateFn=t,this._authObserver=new I(this,s)}connectedCallback(){const t=new zr(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const zs=Object.freeze(Object.defineProperty({__proto__:null,Provider:Ms,Service:zr},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const zt=globalThis,Ce=zt.ShadowRoot&&(zt.ShadyCSS===void 0||zt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Oe=Symbol(),Ke=new WeakMap;let Ir=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Oe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Ce&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Ke.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ke.set(e,t))}return t}toString(){return this.cssText}};const Is=i=>new Ir(typeof i=="string"?i:i+"",void 0,Oe),Ds=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new Ir(e,i,Oe)},Hs=(i,t)=>{if(Ce)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=zt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Ze=Ce?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Is(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Fs,defineProperty:qs,getOwnPropertyDescriptor:Bs,getOwnPropertyNames:Ws,getOwnPropertySymbols:Qs,getPrototypeOf:Gs}=Object,dt=globalThis,Xe=dt.trustedTypes,Js=Xe?Xe.emptyScript:"",tr=dt.reactiveElementPolyfillSupport,_t=(i,t)=>i,Ht={toAttribute(i,t){switch(t){case Boolean:i=i?Js:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Re=(i,t)=>!Fs(i,t),er={attribute:!0,type:String,converter:Ht,reflect:!1,hasChanged:Re};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),dt.litPropertyMetadata??(dt.litPropertyMetadata=new WeakMap);let ot=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=er){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&qs(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:o}=Bs(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get(){return r==null?void 0:r.call(this)},set(n){const l=r==null?void 0:r.call(this);o.call(this,n),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??er}static _$Ei(){if(this.hasOwnProperty(_t("elementProperties")))return;const t=Gs(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_t("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_t("properties"))){const e=this.properties,s=[...Ws(e),...Qs(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(Ze(r))}else t!==void 0&&e.push(Ze(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Hs(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const r=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,r);if(o!==void 0&&r.reflect===!0){const n=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:Ht).toAttribute(e,r.type);this._$Em=t,n==null?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(t,e){var s;const r=this.constructor,o=r._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const n=r.getPropertyOptions(o),l=typeof n.converter=="function"?{fromAttribute:n.converter}:((s=n.converter)==null?void 0:s.fromAttribute)!==void 0?n.converter:Ht;this._$Em=o,this[o]=l.fromAttribute(e,n.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??Re)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[o,n]of r)n.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],n)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(r=>{var o;return(o=r.hostUpdate)==null?void 0:o.call(r)}),this.update(s)):this._$EU()}catch(r){throw e=!1,this._$EU(),r}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};ot.elementStyles=[],ot.shadowRootOptions={mode:"open"},ot[_t("elementProperties")]=new Map,ot[_t("finalized")]=new Map,tr==null||tr({ReactiveElement:ot}),(dt.reactiveElementVersions??(dt.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ft=globalThis,qt=Ft.trustedTypes,rr=qt?qt.createPolicy("lit-html",{createHTML:i=>i}):void 0,Dr="$lit$",j=`lit$${Math.random().toFixed(9).slice(2)}$`,Hr="?"+j,Ys=`<${Hr}>`,J=document,St=()=>J.createComment(""),At=i=>i===null||typeof i!="object"&&typeof i!="function",Fr=Array.isArray,Vs=i=>Fr(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",pe=`[ 	
\f\r]`,vt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,sr=/-->/g,ir=/>/g,B=RegExp(`>|${pe}(?:([^\\s"'>=/]+)(${pe}*=${pe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),or=/'/g,nr=/"/g,qr=/^(?:script|style|textarea|title)$/i,Ks=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),yt=Ks(1),ht=Symbol.for("lit-noChange"),w=Symbol.for("lit-nothing"),ar=new WeakMap,Q=J.createTreeWalker(J,129);function Br(i,t){if(!Array.isArray(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return rr!==void 0?rr.createHTML(t):t}const Zs=(i,t)=>{const e=i.length-1,s=[];let r,o=t===2?"<svg>":"",n=vt;for(let l=0;l<e;l++){const a=i[l];let f,g,h=-1,c=0;for(;c<a.length&&(n.lastIndex=c,g=n.exec(a),g!==null);)c=n.lastIndex,n===vt?g[1]==="!--"?n=sr:g[1]!==void 0?n=ir:g[2]!==void 0?(qr.test(g[2])&&(r=RegExp("</"+g[2],"g")),n=B):g[3]!==void 0&&(n=B):n===B?g[0]===">"?(n=r??vt,h=-1):g[1]===void 0?h=-2:(h=n.lastIndex-g[2].length,f=g[1],n=g[3]===void 0?B:g[3]==='"'?nr:or):n===nr||n===or?n=B:n===sr||n===ir?n=vt:(n=B,r=void 0);const d=n===B&&i[l+1].startsWith("/>")?" ":"";o+=n===vt?a+Ys:h>=0?(s.push(f),a.slice(0,h)+Dr+a.slice(h)+j+d):a+j+(h===-2?l:d)}return[Br(i,o+(i[e]||"<?>")+(t===2?"</svg>":"")),s]};let _e=class Wr{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let o=0,n=0;const l=t.length-1,a=this.parts,[f,g]=Zs(t,e);if(this.el=Wr.createElement(f,s),Q.currentNode=this.el.content,e===2){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(r=Q.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const h of r.getAttributeNames())if(h.endsWith(Dr)){const c=g[n++],d=r.getAttribute(h).split(j),u=/([.?@])?(.*)/.exec(c);a.push({type:1,index:o,name:u[2],strings:d,ctor:u[1]==="."?ti:u[1]==="?"?ei:u[1]==="@"?ri:se}),r.removeAttribute(h)}else h.startsWith(j)&&(a.push({type:6,index:o}),r.removeAttribute(h));if(qr.test(r.tagName)){const h=r.textContent.split(j),c=h.length-1;if(c>0){r.textContent=qt?qt.emptyScript:"";for(let d=0;d<c;d++)r.append(h[d],St()),Q.nextNode(),a.push({type:2,index:++o});r.append(h[c],St())}}}else if(r.nodeType===8)if(r.data===Hr)a.push({type:2,index:o});else{let h=-1;for(;(h=r.data.indexOf(j,h+1))!==-1;)a.push({type:7,index:o}),h+=j.length-1}o++}}static createElement(t,e){const s=J.createElement("template");return s.innerHTML=t,s}};function pt(i,t,e=i,s){var r,o;if(t===ht)return t;let n=s!==void 0?(r=e._$Co)==null?void 0:r[s]:e._$Cl;const l=At(t)?void 0:t._$litDirective$;return(n==null?void 0:n.constructor)!==l&&((o=n==null?void 0:n._$AO)==null||o.call(n,!1),l===void 0?n=void 0:(n=new l(i),n._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=n:e._$Cl=n),n!==void 0&&(t=pt(i,n._$AS(i,t.values),n,s)),t}let Xs=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??J).importNode(e,!0);Q.currentNode=r;let o=Q.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let f;a.type===2?f=new Te(o,o.nextSibling,this,t):a.type===1?f=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(f=new si(o,this,t)),this._$AV.push(f),a=s[++l]}n!==(a==null?void 0:a.index)&&(o=Q.nextNode(),n++)}return Q.currentNode=J,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},Te=class Qr{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=w,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=pt(this,t,e),At(t)?t===w||t==null||t===""?(this._$AH!==w&&this._$AR(),this._$AH=w):t!==this._$AH&&t!==ht&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Vs(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==w&&At(this._$AH)?this._$AA.nextSibling.data=t:this.T(J.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:r}=t,o=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=_e.createElement(Br(r.h,r.h[0]),this.options)),r);if(((e=this._$AH)==null?void 0:e._$AD)===o)this._$AH.p(s);else{const n=new Xs(o,this),l=n.u(this.options);n.p(s),this.T(l),this._$AH=n}}_$AC(t){let e=ar.get(t.strings);return e===void 0&&ar.set(t.strings,e=new _e(t)),e}k(t){Fr(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const o of t)r===e.length?e.push(s=new Qr(this.S(St()),this.S(St()),this,this.options)):s=e[r],s._$AI(o),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},se=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,o){this.type=1,this._$AH=w,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=w}_$AI(t,e=this,s,r){const o=this.strings;let n=!1;if(o===void 0)t=pt(this,t,e,0),n=!At(t)||t!==this._$AH&&t!==ht,n&&(this._$AH=t);else{const l=t;let a,f;for(t=o[0],a=0;a<o.length-1;a++)f=pt(this,l[s+a],e,a),f===ht&&(f=this._$AH[a]),n||(n=!At(f)||f!==this._$AH[a]),f===w?t=w:t!==w&&(t+=(f??"")+o[a+1]),this._$AH[a]=f}n&&!r&&this.j(t)}j(t){t===w?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},ti=class extends se{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===w?void 0:t}},ei=class extends se{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==w)}},ri=class extends se{constructor(t,e,s,r,o){super(t,e,s,r,o),this.type=5}_$AI(t,e=this){if((t=pt(this,t,e,0)??w)===ht)return;const s=this._$AH,r=t===w&&s!==w||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==w&&(s===w||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},si=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){pt(this,t)}};const lr=Ft.litHtmlPolyfillSupport;lr==null||lr(_e,Te),(Ft.litHtmlVersions??(Ft.litHtmlVersions=[])).push("3.1.3");const ii=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const o=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new Te(t.insertBefore(St(),o),o,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let at=class extends ot{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ii(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return ht}};at._$litElement$=!0,at.finalized=!0,(Je=globalThis.litElementHydrateSupport)==null||Je.call(globalThis,{LitElement:at});const cr=globalThis.litElementPolyfillSupport;cr==null||cr({LitElement:at});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const oi={attribute:!0,type:String,converter:Ht,reflect:!1,hasChanged:Re},ni=(i=oi,t,e)=>{const{kind:s,metadata:r}=e;let o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),o.set(e.name,i),s==="accessor"){const{name:n}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,i)},init(l){return l!==void 0&&this.P(n,void 0,i),l}}}if(s==="setter"){const{name:n}=e;return function(l){const a=this[n];t.call(this,l),this.requestUpdate(n,a,i)}}throw Error("Unsupported decorator location: "+s)};function Gr(i){return(t,e)=>typeof e=="object"?ni(i,t,e):((s,r,o)=>{const n=r.hasOwnProperty(o);return r.constructor.createProperty(o,n?{...s,wrapped:!0}:s),n?Object.getOwnPropertyDescriptor(r,o):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Jr(i){return Gr({...i,state:!0,attribute:!1})}function ai(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function li(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Yr={};(function(i){var t=function(){var e=function(h,c,d,u){for(d=d||{},u=h.length;u--;d[h[u]]=c);return d},s=[1,9],r=[1,10],o=[1,11],n=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,d,u,v,m,b,et){var y=b.length-1;switch(m){case 1:return new v.Root({},[b[y-1]]);case 2:return new v.Root({},[new v.Literal({value:""})]);case 3:this.$=new v.Concat({},[b[y-1],b[y]]);break;case 4:case 5:this.$=b[y];break;case 6:this.$=new v.Literal({value:b[y]});break;case 7:this.$=new v.Splat({name:b[y]});break;case 8:this.$=new v.Param({name:b[y]});break;case 9:this.$=new v.Optional({},[b[y-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:o,15:n},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:r,14:o,15:n},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:o,15:n},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:r,14:o,15:n},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,d){if(d.recoverable)this.trace(c);else{let u=function(v,m){this.message=v,this.hash=m};throw u.prototype=Error,new u(c,d)}},parse:function(c){var d=this,u=[0],v=[null],m=[],b=this.table,et="",y=0,N=0,H=2,Nt=1,ne=m.slice.call(arguments,1),_=Object.create(this.lexer),F={yy:{}};for(var ae in this.yy)Object.prototype.hasOwnProperty.call(this.yy,ae)&&(F.yy[ae]=this.yy[ae]);_.setInput(c,F.yy),F.yy.lexer=_,F.yy.parser=this,typeof _.yylloc>"u"&&(_.yylloc={});var le=_.yylloc;m.push(le);var us=_.options&&_.options.ranges;typeof F.yy.parseError=="function"?this.parseError=F.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var fs=function(){var st;return st=_.lex()||Nt,typeof st!="number"&&(st=d.symbols_[st]||st),st},A,q,C,ce,rt={},jt,U,Ge,Mt;;){if(q=u[u.length-1],this.defaultActions[q]?C=this.defaultActions[q]:((A===null||typeof A>"u")&&(A=fs()),C=b[q]&&b[q][A]),typeof C>"u"||!C.length||!C[0]){var de="";Mt=[];for(jt in b[q])this.terminals_[jt]&&jt>H&&Mt.push("'"+this.terminals_[jt]+"'");_.showPosition?de="Parse error on line "+(y+1)+`:
`+_.showPosition()+`
Expecting `+Mt.join(", ")+", got '"+(this.terminals_[A]||A)+"'":de="Parse error on line "+(y+1)+": Unexpected "+(A==Nt?"end of input":"'"+(this.terminals_[A]||A)+"'"),this.parseError(de,{text:_.match,token:this.terminals_[A]||A,line:_.yylineno,loc:le,expected:Mt})}if(C[0]instanceof Array&&C.length>1)throw new Error("Parse Error: multiple actions possible at state: "+q+", token: "+A);switch(C[0]){case 1:u.push(A),v.push(_.yytext),m.push(_.yylloc),u.push(C[1]),A=null,N=_.yyleng,et=_.yytext,y=_.yylineno,le=_.yylloc;break;case 2:if(U=this.productions_[C[1]][1],rt.$=v[v.length-U],rt._$={first_line:m[m.length-(U||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(U||1)].first_column,last_column:m[m.length-1].last_column},us&&(rt._$.range=[m[m.length-(U||1)].range[0],m[m.length-1].range[1]]),ce=this.performAction.apply(rt,[et,N,y,F.yy,C[1],v,m].concat(ne)),typeof ce<"u")return ce;U&&(u=u.slice(0,-1*U*2),v=v.slice(0,-1*U),m=m.slice(0,-1*U)),u.push(this.productions_[C[1]][0]),v.push(rt.$),m.push(rt._$),Ge=b[u[u.length-2]][u[u.length-1]],u.push(Ge);break;case 3:return!0}}return!0}},f=function(){var h={EOF:1,parseError:function(d,u){if(this.yy.parser)this.yy.parser.parseError(d,u);else throw new Error(d)},setInput:function(c,d){return this.yy=d||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var d=c.match(/(?:\r\n?|\n).*/g);return d?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var d=c.length,u=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-d),this.offset-=d;var v=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),u.length-1&&(this.yylineno-=u.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:u?(u.length===v.length?this.yylloc.first_column:0)+v[v.length-u.length].length-u[0].length:this.yylloc.first_column-d},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-d]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),d=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+d+"^"},test_match:function(c,d){var u,v,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),v=c[0].match(/(?:\r\n?|\n).*/g),v&&(this.yylineno+=v.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:v?v[v.length-1].length-v[v.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],u=this.performAction.call(this,this.yy,this,d,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),u)return u;if(this._backtrack){for(var b in m)this[b]=m[b];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,d,u,v;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),b=0;b<m.length;b++)if(u=this._input.match(this.rules[m[b]]),u&&(!d||u[0].length>d[0].length)){if(d=u,v=b,this.options.backtrack_lexer){if(c=this.test_match(u,m[b]),c!==!1)return c;if(this._backtrack){d=!1;continue}else return!1}else if(!this.options.flex)break}return d?(c=this.test_match(d,m[v]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var d=this.next();return d||this.lex()},begin:function(d){this.conditionStack.push(d)},popState:function(){var d=this.conditionStack.length-1;return d>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(d){return d=this.conditionStack.length-1-Math.abs(d||0),d>=0?this.conditionStack[d]:"INITIAL"},pushState:function(d){this.begin(d)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(d,u,v,m){switch(v){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return h}();a.lexer=f;function g(){this.yy={}}return g.prototype=a,a.Parser=g,new g}();typeof li<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(Yr);function it(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var Vr={Root:it("Root"),Concat:it("Concat"),Literal:it("Literal"),Splat:it("Splat"),Param:it("Param"),Optional:it("Optional")},Kr=Yr.parser;Kr.yy=Vr;var ci=Kr,di=Object.keys(Vr);function hi(i){return di.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var Zr=hi,pi=Zr,ui=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Xr(i){this.captures=i.captures,this.re=i.re}Xr.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(s,r){typeof t[r+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[r+1])}),e};var fi=pi({Concat:function(i){return i.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(ui,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new Xr({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),gi=fi,mi=Zr,vi=mi({Concat:function(i,t){var e=i.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),yi=vi,bi=ci,$i=gi,_i=yi;Ut.prototype=Object.create(null);Ut.prototype.match=function(i){var t=$i.visit(this.ast),e=t.match(i);return e||!1};Ut.prototype.reverse=function(i){return _i.visit(this.ast,i)};function Ut(i){var t;if(this?t=this:t=Object.create(Ut.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=bi.parse(i),t}var wi=Ut,xi=wi,Si=xi;const Ai=ai(Si);var ki=Object.defineProperty,Ei=Object.getOwnPropertyDescriptor,ts=(i,t,e,s)=>{for(var r=s>1?void 0:s?Ei(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&ki(t,e,r),r};class kt extends at{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>yt`
      <h1>Not Found</h1>
    `,this._cases=t.map(r=>({...r,route:new Ai(r.path)})),this._historyObserver=new I(this,e),this._authObserver=new I(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),yt`
      <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(Pr(this,"auth/redirect"),yt`
              <h1>Redirecting for Login</h1>
            `):e.view(e.params||{}):yt`
              <h1>Authenticating</h1>
            `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),yt`
              <h1>Redirecting to ${s}…</h1>
            `}}return this._fallback({})})()}</main>
    `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,r=new URLSearchParams(e),o=s+e;for(const n of this._cases){const l=n.route.match(o);if(l)return{...n,path:s,params:l,query:r}}}redirect(t){Ee(this,"history/redirect",{href:t})}}kt.styles=Ds`
    :host,
    main {
      display: contents;
    }
  `;ts([Jr()],kt.prototype,"_user",2);ts([Jr()],kt.prototype,"_match",2);const Pi=Object.freeze(Object.defineProperty({__proto__:null,Element:kt,Switch:kt},Symbol.toStringTag,{value:"Module"})),Ci=class es extends HTMLElement{constructor(){if(super(),re(es.template).attach(this),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Ci.template=Tt`
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
  `;const Oi=class rs extends HTMLElement{constructor(){super(),this._array=[],re(rs.template).attach(this),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(ss("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),r=e.value,o=e.closest("label");if(o){const n=Array.from(this.children).indexOf(o);this._array[n]=r,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{be(t,"button.add")?Dt(t,"input-array:add"):be(t,"button.remove")&&Dt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],Ri(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};Oi.template=Tt`
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
  `;function Ri(i,t){t.replaceChildren(),i.forEach((e,s)=>t.append(ss(e)))}function ss(i,t){const e=i===void 0?"":`value="${i}"`;return Tt`
    <label>
      <input ${e} />
      <button class="remove" type="button">Remove</button>
    </label>
  `}function L(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var Ti=Object.defineProperty,Ui=Object.getOwnPropertyDescriptor,Li=(i,t,e,s)=>{for(var r=s>1?void 0:s?Ui(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&Ti(t,e,r),r};class Z extends at{constructor(t){super(),this._pending=[],this._observer=new I(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,r])=>{console.log("Dispatching queued event",r,s),s.dispatchEvent(r)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}Li([Gr()],Z.prototype,"model",1);/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const It=globalThis,Ue=It.ShadowRoot&&(It.ShadyCSS===void 0||It.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Le=Symbol(),dr=new WeakMap;let is=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Le)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Ue&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=dr.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&dr.set(e,t))}return t}toString(){return this.cssText}};const Ni=i=>new is(typeof i=="string"?i:i+"",void 0,Le),S=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new is(e,i,Le)},ji=(i,t)=>{if(Ue)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=It.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},hr=Ue?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Ni(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Mi,defineProperty:zi,getOwnPropertyDescriptor:Ii,getOwnPropertyNames:Di,getOwnPropertySymbols:Hi,getPrototypeOf:Fi}=Object,z=globalThis,pr=z.trustedTypes,qi=pr?pr.emptyScript:"",ue=z.reactiveElementPolyfillSupport,wt=(i,t)=>i,Bt={toAttribute(i,t){switch(t){case Boolean:i=i?qi:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Ne=(i,t)=>!Mi(i,t),ur={attribute:!0,type:String,converter:Bt,reflect:!1,hasChanged:Ne};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),z.litPropertyMetadata??(z.litPropertyMetadata=new WeakMap);class nt extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ur){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&zi(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:o}=Ii(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get(){return r==null?void 0:r.call(this)},set(n){const l=r==null?void 0:r.call(this);o.call(this,n),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ur}static _$Ei(){if(this.hasOwnProperty(wt("elementProperties")))return;const t=Fi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(wt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(wt("properties"))){const e=this.properties,s=[...Di(e),...Hi(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(hr(r))}else t!==void 0&&e.push(hr(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ji(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var o;const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){const n=(((o=s.converter)==null?void 0:o.toAttribute)!==void 0?s.converter:Bt).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(t,e){var o;const s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const n=s.getPropertyOptions(r),l=typeof n.converter=="function"?{fromAttribute:n.converter}:((o=n.converter)==null?void 0:o.fromAttribute)!==void 0?n.converter:Bt;this._$Em=r,this[r]=l.fromAttribute(e,n.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??Ne)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[o,n]of r)n.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],n)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(r=>{var o;return(o=r.hostUpdate)==null?void 0:o.call(r)}),this.update(e)):this._$EU()}catch(r){throw t=!1,this._$EU(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}nt.elementStyles=[],nt.shadowRootOptions={mode:"open"},nt[wt("elementProperties")]=new Map,nt[wt("finalized")]=new Map,ue==null||ue({ReactiveElement:nt}),(z.reactiveElementVersions??(z.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xt=globalThis,Wt=xt.trustedTypes,fr=Wt?Wt.createPolicy("lit-html",{createHTML:i=>i}):void 0,os="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,ns="?"+M,Bi=`<${ns}>`,Y=document,Et=()=>Y.createComment(""),Pt=i=>i===null||typeof i!="object"&&typeof i!="function",as=Array.isArray,Wi=i=>as(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",fe=`[ 	
\f\r]`,bt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,gr=/-->/g,mr=/>/g,W=RegExp(`>|${fe}(?:([^\\s"'>=/]+)(${fe}*=${fe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),vr=/'/g,yr=/"/g,ls=/^(?:script|style|textarea|title)$/i,Qi=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),p=Qi(1),ut=Symbol.for("lit-noChange"),x=Symbol.for("lit-nothing"),br=new WeakMap,G=Y.createTreeWalker(Y,129);function cs(i,t){if(!Array.isArray(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return fr!==void 0?fr.createHTML(t):t}const Gi=(i,t)=>{const e=i.length-1,s=[];let r,o=t===2?"<svg>":"",n=bt;for(let l=0;l<e;l++){const a=i[l];let f,g,h=-1,c=0;for(;c<a.length&&(n.lastIndex=c,g=n.exec(a),g!==null);)c=n.lastIndex,n===bt?g[1]==="!--"?n=gr:g[1]!==void 0?n=mr:g[2]!==void 0?(ls.test(g[2])&&(r=RegExp("</"+g[2],"g")),n=W):g[3]!==void 0&&(n=W):n===W?g[0]===">"?(n=r??bt,h=-1):g[1]===void 0?h=-2:(h=n.lastIndex-g[2].length,f=g[1],n=g[3]===void 0?W:g[3]==='"'?yr:vr):n===yr||n===vr?n=W:n===gr||n===mr?n=bt:(n=W,r=void 0);const d=n===W&&i[l+1].startsWith("/>")?" ":"";o+=n===bt?a+Bi:h>=0?(s.push(f),a.slice(0,h)+os+a.slice(h)+M+d):a+M+(h===-2?l:d)}return[cs(i,o+(i[e]||"<?>")+(t===2?"</svg>":"")),s]};class Ct{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let o=0,n=0;const l=t.length-1,a=this.parts,[f,g]=Gi(t,e);if(this.el=Ct.createElement(f,s),G.currentNode=this.el.content,e===2){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(r=G.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const h of r.getAttributeNames())if(h.endsWith(os)){const c=g[n++],d=r.getAttribute(h).split(M),u=/([.?@])?(.*)/.exec(c);a.push({type:1,index:o,name:u[2],strings:d,ctor:u[1]==="."?Yi:u[1]==="?"?Vi:u[1]==="@"?Ki:ie}),r.removeAttribute(h)}else h.startsWith(M)&&(a.push({type:6,index:o}),r.removeAttribute(h));if(ls.test(r.tagName)){const h=r.textContent.split(M),c=h.length-1;if(c>0){r.textContent=Wt?Wt.emptyScript:"";for(let d=0;d<c;d++)r.append(h[d],Et()),G.nextNode(),a.push({type:2,index:++o});r.append(h[c],Et())}}}else if(r.nodeType===8)if(r.data===ns)a.push({type:2,index:o});else{let h=-1;for(;(h=r.data.indexOf(M,h+1))!==-1;)a.push({type:7,index:o}),h+=M.length-1}o++}}static createElement(t,e){const s=Y.createElement("template");return s.innerHTML=t,s}}function ft(i,t,e=i,s){var n,l;if(t===ut)return t;let r=s!==void 0?(n=e._$Co)==null?void 0:n[s]:e._$Cl;const o=Pt(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==o&&((l=r==null?void 0:r._$AO)==null||l.call(r,!1),o===void 0?r=void 0:(r=new o(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=r:e._$Cl=r),r!==void 0&&(t=ft(i,r._$AS(i,t.values),r,s)),t}class Ji{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??Y).importNode(e,!0);G.currentNode=r;let o=G.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let f;a.type===2?f=new Lt(o,o.nextSibling,this,t):a.type===1?f=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(f=new Zi(o,this,t)),this._$AV.push(f),a=s[++l]}n!==(a==null?void 0:a.index)&&(o=G.nextNode(),n++)}return G.currentNode=Y,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Lt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=x,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ft(this,t,e),Pt(t)?t===x||t==null||t===""?(this._$AH!==x&&this._$AR(),this._$AH=x):t!==this._$AH&&t!==ut&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Wi(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==x&&Pt(this._$AH)?this._$AA.nextSibling.data=t:this.T(Y.createTextNode(t)),this._$AH=t}$(t){var o;const{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=Ct.createElement(cs(s.h,s.h[0]),this.options)),s);if(((o=this._$AH)==null?void 0:o._$AD)===r)this._$AH.p(e);else{const n=new Ji(r,this),l=n.u(this.options);n.p(e),this.T(l),this._$AH=n}}_$AC(t){let e=br.get(t.strings);return e===void 0&&br.set(t.strings,e=new Ct(t)),e}k(t){as(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const o of t)r===e.length?e.push(s=new Lt(this.S(Et()),this.S(Et()),this,this.options)):s=e[r],s._$AI(o),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class ie{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,o){this.type=1,this._$AH=x,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=x}_$AI(t,e=this,s,r){const o=this.strings;let n=!1;if(o===void 0)t=ft(this,t,e,0),n=!Pt(t)||t!==this._$AH&&t!==ut,n&&(this._$AH=t);else{const l=t;let a,f;for(t=o[0],a=0;a<o.length-1;a++)f=ft(this,l[s+a],e,a),f===ut&&(f=this._$AH[a]),n||(n=!Pt(f)||f!==this._$AH[a]),f===x?t=x:t!==x&&(t+=(f??"")+o[a+1]),this._$AH[a]=f}n&&!r&&this.j(t)}j(t){t===x?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Yi extends ie{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===x?void 0:t}}class Vi extends ie{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==x)}}class Ki extends ie{constructor(t,e,s,r,o){super(t,e,s,r,o),this.type=5}_$AI(t,e=this){if((t=ft(this,t,e,0)??x)===ut)return;const s=this._$AH,r=t===x&&s!==x||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==x&&(s===x||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Zi{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){ft(this,t)}}const ge=xt.litHtmlPolyfillSupport;ge==null||ge(Ct,Lt),(xt.litHtmlVersions??(xt.litHtmlVersions=[])).push("3.1.3");const Xi=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const o=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new Lt(t.insertBefore(Et(),o),o,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class E extends nt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Xi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return ut}}var _r;E._$litElement$=!0,E.finalized=!0,(_r=globalThis.litElementHydrateSupport)==null||_r.call(globalThis,{LitElement:E});const me=globalThis.litElementPolyfillSupport;me==null||me({LitElement:E});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");const to={};function eo(i,t,e){switch(i[0]){case"profile/save":ro(i[1],e).then(r=>t(o=>({...o,profile:r}))).then(()=>{const{onSuccess:r}=i[1];r&&r()}).catch(r=>{const{onFailure:o}=i[1];o&&o(r)});break;case"profile/select":so(i[1],e).then(r=>t(o=>({...o,profile:r})));break;case"study-spot/index":io().then(r=>t(o=>({...o,studySpotIndex:r}))).catch(r=>{console.error("Failed to fetch study spots",r)});break;case"study-spot/select":oo(i[1]).then(r=>t(o=>({...o,studySpot:r})));break;case"study-spot/add":no(i[1],e).then(r=>t(o=>({...o,studySpot:r}))).then(()=>{const{onSuccess:r}=i[1];r&&r()}).catch(r=>{const{onFailure:o}=i[1];o&&o(r)});break;case"study-spot/update":ao({spotid:i[1].spotid,ratings:i[1].rating,reviewsCount:i[1].reviewsCount},e).then(r=>t(o=>({...o,studySpot:r}))).then(()=>{const{onSuccess:r}=i[1];r&&r()}).catch(r=>{const{onFailure:o}=i[1];o&&o(r)});break;case"review/list-by-spot":lo(i[1].spotId).then(r=>t(o=>({...o,reviews:r})));break;case"review/list-by-user":ho(i[1].userId).then(r=>t(o=>({...o,reviews:r})));break;case"review/add":co(i[1],e).then(r=>{r&&t(o=>({...o,reviews:[...o.reviews??[],r]}))}).then(()=>{const{onSuccess:r}=i[1];r&&r()}).catch(r=>{const{onFailure:o}=i[1];o&&o(r)});break;case"review/clear":t(r=>({...r,reviews:[]}));break;default:const s=i[0];throw new Error(`Unhandled message "${s}"`)}}function ro(i,t){return fetch(`/api/profiles/${i.userid}`,{method:"PUT",headers:{"Content-Type":"application/json",...D.headers(t)},body:JSON.stringify(i.profile)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to save profile for ${i.userid}`)}).then(e=>{if(e)return e})}function so(i,t){return fetch(`/api/profiles/${i.userid}`,{headers:D.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Profile:",e),e})}function io(){return fetch("/study-spots",{method:"GET",headers:{"Content-Type":"application/json"}}).then(i=>{if(i.status===200)return i.json();throw void 0}).then(i=>{if(i){const{data:t}=i;return t}})}function oo(i){return fetch(`/study-spots/${i.spotid}`,{method:"GET"}).then(t=>{if(t.status===200)return t.json()}).then(t=>{if(t)return console.log("Study Spot:",t),t})}function no(i,t){return fetch("/study-spots",{method:"POST",headers:{"Content-Type":"application/json",...D.headers(t)},body:JSON.stringify(i.spot)}).then(e=>{if(e.status===201)return e.json();throw new Error("Failed to add study spot")}).then(e=>{if(e)return e})}function ao(i,t){return fetch(`/study-spots/${i.spotid}`,{method:"PUT",headers:{"Content-Type":"application/json",...D.headers(t)},body:JSON.stringify({ratings:i.ratings,reviewsCount:i.reviewsCount})}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to update study spot ${i.spotid}`)}).then(e=>{if(e)return e})}function lo(i){return fetch(`/reviews/spot/${i}`,{method:"GET",headers:{"Content-Type":"application/json"}}).then(t=>{if(t.status===200)return t.json();if(t.status===404)return console.log(`No reviews found for study spot ${i}`),[];throw new Error(`Failed to fetch reviews for study spot ${i}. Status: ${t.status}`)}).then(t=>t||[]).catch(t=>{throw console.error(t.message),t})}function co(i,t){return fetch("/reviews",{method:"POST",headers:{"Content-Type":"application/json",...D.headers(t)},body:JSON.stringify(i.review)}).then(e=>{if(e.status===201)return e.json();throw new Error("Failed to add review")}).then(e=>{if(e)return e})}function ho(i){return fetch(`/reviews/user/${i}`,{method:"GET",headers:{"Content-Type":"application/json"}}).then(t=>{if(t.status===200)return t.json();throw new Error(`Failed to fetch reviews for user ${i}`)}).then(t=>t||[])}const Me=class Me extends E{constructor(){super(...arguments),this._onClickAway=t=>{this.contains(t.target)||(this.removeAttribute("open"),window.removeEventListener("click",this._onClickAway))}}render(){return p`
      <slot name="actuator">
        <button @click="${this.toggle}">
          <img src="/icons/menu.svg" alt="Menu" id="menu-icon" />
        </button>
      </slot>
      <div id="panel">
        <slot></slot>
      </div>
    `}toggle(){this.hasAttribute("open")?(this.removeAttribute("open"),window.removeEventListener("click",this._onClickAway)):(this.setAttribute("open",""),setTimeout(()=>{window.addEventListener("click",this._onClickAway)},0))}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("click",this._onClickAway)}};Me.styles=S`
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
  `;let Qt=Me;customElements.define("drop-down",Qt);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const po={attribute:!0,type:String,converter:Bt,reflect:!1,hasChanged:Ne},uo=(i=po,t,e)=>{const{kind:s,metadata:r}=e;let o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),o.set(e.name,i),s==="accessor"){const{name:n}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,i)},init(l){return l!==void 0&&this.P(n,void 0,i),l}}}if(s==="setter"){const{name:n}=e;return function(l){const a=this[n];t.call(this,l),this.requestUpdate(n,a,i)}}throw Error("Unsupported decorator location: "+s)};function $(i){return(t,e)=>typeof e=="object"?uo(i,t,e):((s,r,o)=>{const n=r.hasOwnProperty(o);return r.constructor.createProperty(o,n?{...s,wrapped:!0}:s),n?Object.getOwnPropertyDescriptor(r,o):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function P(i){return $({...i,state:!0,attribute:!1})}const O=S`
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
`,fo=localStorage.getItem("dark-mode")==="true";function go(){document.body.classList.add("dark-mode"),localStorage.setItem("dark-mode","true")}function mo(){document.body.classList.remove("dark-mode"),localStorage.setItem("dark-mode","false")}function ds(i){i?go():mo()}ds(fo);document.body.addEventListener("dark-mode",()=>{const i=localStorage.getItem("dark-mode")==="true";ds(!i)});var vo=Object.defineProperty,yo=Object.getOwnPropertyDescriptor,bo=(i,t,e,s)=>{for(var r=s>1?void 0:s?yo(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&vo(t,e,r),r};const Kt=class Kt extends E{constructor(){super(...arguments),this.username="anonymous",this._authObserver=new I(this,"slostudyspots:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t?this.username=t.username:this.username="anonymous"})}render(){return p`
      <header class="navbar">
        <div class="navbar-content">
          <a class="logo" href="/app">
            <img src="/icons/desk-lamp.svg" alt="SLOStudySpots Logo" />
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
              @click=${$r}
              src="/icons/light-dark.svg"
              alt="Dark mode"
              class="light-dark-icon"
            />
            ${this.username==="anonymous"?p`
                 <!-- <a class="navbar-button" href="/app/login">Login</a>
                  <a class="navbar-button signup-button" href="/app/register">Sign Up</a>
                -->
                <drop-down>
                  <ul>
                    <li>
                      <a class="navbar-menu" href="/app/login">
                        Login
                      </a>
                    </li>
                    <li>
                      <a class="navbar-menu" href="/app/register">
                        Sign Up
                      </a>
                    </li>
                    <li>
                      <a class="group-icon" href="/app/rankings">
                        Community Rankings
                      </a>
                    </li>
                  </ul>
                `:p`
                <drop-down>
                  <ul>
                    <li>
                      <a class="navbar-menu" href="/app/profile/${this.username}">
                        Profile
                      </a>
                    </li>
                    <li>
                      <a class="group-icon" href="/app/rankings">
                        Community Rankings
                      </a>
                    </li>
                    <li>
                      <a class="group-icon" href="/app/add-spot">
                        Add a Spot
                      </a>
                    </li>
                    <!-- <li>
                      <label class="light-dark-switch" @change=${$r}>
                        <input type="checkbox" autocomplete="off" />
                        Dark mode
                      </label>
                    </li> -->
                    <li>
                      <a href="#" @click=${$o}>Sign out</a>
                    </li>
                  </ul>
                </drop-down>
              `}
          </nav>
        </div>
      </header>
    `}};Kt.uses=L({"drop-down":Qt}),Kt.styles=[O,S`
    header.navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: var(--color-primary);
      padding: var(--space-small) var(--space-regular);
      position: sticky;
      top: 0; /* Ensures it sticks at the very top */
      z-index: 1000; /* Ensures the header stays on top of other content */
      /* position: fixed;
      width: 100vw; */
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

    .light-dark-icon {
      padding-right: 15px;
    }

    img:hover {
      cursor: pointer;
    }
  `];let Gt=Kt;bo([P()],Gt.prototype,"username",2);function $r(i){ee.relay(i,"dark-mode",{checked:void 0})}function $o(i){ee.relay(i,"auth:message",["auth/signout"])}var _o=Object.defineProperty,wo=Object.getOwnPropertyDescriptor,X=(i,t,e,s)=>{for(var r=s>1?void 0:s?wo(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&_o(t,e,r),r};const hs=S`
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
`,ze=class ze extends E{render(){return p`
    <main>
      <section class="profile-container">
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
      </section>
    </main>
  `}};ze.styles=[O,hs,S`
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
    `];let Jt=ze;X([$()],Jt.prototype,"username",2);const Zt=class Zt extends E{constructor(){super(),this._handleAvatarSelected=this._handleAvatarSelected.bind(this)}render(){return p`
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
            </label>
            <slot name="avatar" class="avatar"></slot>
          </mu-form>
        </section>
      </main>
    `}_triggerFileInput(){var t,e;(e=(t=this.shadowRoot)==null?void 0:t.getElementById("avatarInput"))==null||e.click()}_handleAvatarSelected(t){var s;const e=(s=t.target)==null?void 0:s.files;if(e&&e.length>0){const r=e[0],o=new FileReader;o.onload=()=>{const n=o.result;console.log("Avatar Loaded:",n),this.dispatchEvent(new CustomEvent("profile:new-avatar",{bubbles:!0,composed:!0,detail:n}))},o.onerror=()=>console.error("Error loading file"),o.readAsDataURL(r)}}firstUpdated(){var e;const t=(e=this.shadowRoot)==null?void 0:e.getElementById("avatarInput");t==null||t.addEventListener("change",this._handleAvatarSelected)}disconnectedCallback(){var e;const t=(e=this.shadowRoot)==null?void 0:e.getElementById("avatarInput");t==null||t.removeEventListener("change",this._handleAvatarSelected),super.disconnectedCallback()}};Zt.uses=L({"mu-form":Rs.Element}),Zt.styles=[O,hs,S`
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
    `];let Ot=Zt;X([$()],Ot.prototype,"username",2);X([$({attribute:!1})],Ot.prototype,"init",2);const Xt=class Xt extends Z{constructor(){super("slostudyspots:model"),this.edit=!1,this.userid="",this.addEventListener("profile:new-avatar",t=>{this.newAvatar=t.detail})}get profile(){return this.model.profile}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="user-id"&&e!==s&&s&&(console.log("Profiler Page:",s),this.dispatchMessage(["profile/select",{userid:s}]))}render(){var g,h,c;const{avatar:t,name:e,userid:s,email:r,bio:o,reviewsCount:n}=this.profile||{},l=((h=(g=this.profile)==null?void 0:g.favSpots)==null?void 0:h.map(d=>p`<li>${d}</li>`))||p``,a=(c=this.profile)!=null&&c.dateJoined?new Date(this.profile.dateJoined).toLocaleDateString():"Date unavailable",f=this.newAvatar||t?p`<img src=${this.newAvatar||t} alt="Profile Avatar" slot="avatar">`:p`<img slot="avatar" src="/icons/default-profile.svg">`;return this.edit?p`
        <profile-editor
          username=${s}
          .init=${this.profile}
          @mu-form:submit=${d=>this._handleSubmit(d)}>
          ${f}
        </profile-editor>
      `:p`
        <profile-viewer username=${s}>
          ${f}
          <span slot="name">${e}</span>
          <span slot="userid">${s}</span>
          <span slot="email">${r||"No email available"}</span>
          <span slot="bio">${o||"No bio available"}</span>
          <span slot="dateJoined">${a}</span>
          <span slot="reviewsCount">${n}</span>
          <!-- <ul slot="favSpots">${l}</ul> -->
        </profile-viewer>
      `}_handleSubmit(t){console.log("Handling submit of mu-form");const e=this.newAvatar?{...t.detail,avatar:this.newAvatar}:t.detail;this.dispatchMessage(["profile/save",{userid:this.userid,profile:e,onSuccess:()=>Ur.dispatch(this,"history/navigate",{href:`/app/profile/${this.userid}`}),onFailure:s=>console.log("ERROR:",s)}])}};Xt.uses=L({"profile-viewer":Jt,"profile-editor":Ot}),Xt.styles=[O];let V=Xt;X([$({type:Boolean,reflect:!0})],V.prototype,"edit",2);X([$({attribute:"user-id",reflect:!0})],V.prototype,"userid",2);X([P()],V.prototype,"profile",1);X([P()],V.prototype,"newAvatar",2);var xo=Object.defineProperty,So=Object.getOwnPropertyDescriptor,Ao=(i,t,e,s)=>{for(var r=s>1?void 0:s?So(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&xo(t,e,r),r};L({"restful-form":Nr.FormElement});const Ie=class Ie extends E{constructor(){super(...arguments),this.message=""}render(){return p`
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
    `}get next(){return new URLSearchParams(document.location.search).get("next")}_handleSuccess(t){const e=t.detail,{token:s}=e.created,r=this.next||"/";console.log("Login successful",e,r),ee.relay(t,"auth:message",["auth/signin",{token:s,redirect:r}]),window.location.pathname="/app"}_handleError(t){const{error:e}=t.detail;console.log("Login failed",t.detail),this.message=e.toString()}};Ie.styles=S`
    .error {
      color: firebrick;
    }
  `;let Yt=Ie;Ao([$()],Yt.prototype,"message",2);L({"mu-auth":D.Provider,"login-form":Yt});const De=class De extends E{render(){return p`
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
    `}};De.styles=[O,S`
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
    `];let we=De;L({"restful-form":Nr.FormElement});class ko extends E{render(){return p`
      <restful-form new src="/auth/register">
        <slot></slot>
      </restful-form>
    `}get next(){return new URLSearchParams(document.location.search).get("next")}constructor(){super(),this.addEventListener("mu-rest-form:created",t=>{const e=t.detail,{token:s}=e.created,r=this.next||"/";console.log("Signup successful",e,r),ee.relay(t,"auth:message",["auth/signin",{token:s,redirect:r}])})}}L({"mu-auth":D.Provider,"register-form":ko});const He=class He extends E{render(){return p`
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
          <img src="/images/person-studying.svg" alt="Person Studying">
        </main>
      </div>
    `}};He.styles=[O,S`
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
    `];let xe=He;var Eo=Object.defineProperty,Po=Object.getOwnPropertyDescriptor,ps=(i,t,e,s)=>{for(var r=s>1?void 0:s?Po(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&Eo(t,e,r),r};const Fe=class Fe extends E{constructor(){super(...arguments),this.open=!1,this.sort=!1}openPopup(){this.open=!0}closePopup(t){t.target.classList.contains("popup-overlay")&&(this.open=!1)}triggerSort(t){this.dispatchEvent(new CustomEvent("sort-requested",{detail:{sortType:t}})),this.open=!1}render(){return p`
      <button class="filter-container" @click="${this.openPopup}">
        <svg class="filter-icon">
          <use href="/icons/filter.svg#icon-filter" />
        </svg>
        <h4>Filter</h4>
      </button>

      ${this.open?p`
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
    `}};Fe.styles=[O,S`
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
  `];let Rt=Fe;ps([$({type:Boolean})],Rt.prototype,"open",2);ps([P()],Rt.prototype,"sort",2);var Co=Object.defineProperty,Oo=Object.getOwnPropertyDescriptor,oe=(i,t,e,s)=>{for(var r=s>1?void 0:s?Oo(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&Co(t,e,r),r};const te=class te extends Z{constructor(){super("slostudyspots:model"),this.isPopupOpen=!1,this.filterTerm="",this.filteredStudySpots=[],this.updateFilteredStudySpots()}get studySpotIndex(){return this.model.studySpotIndex||[]}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["study-spot/index"])}togglePopup(){this.isPopupOpen=!this.isPopupOpen}updateFilteredStudySpots(){this.filteredStudySpots=this.studySpotIndex.filter(t=>t.name.toLowerCase().includes(this.filterTerm.toLowerCase()))}handleSortRequested(t){t.detail.sortType==="alphabetically"&&(this.studySpotIndex.sort((s,r)=>s.name.localeCompare(r.name)),this.filteredStudySpots=this.studySpotIndex.filter(s=>s.name.toLowerCase().includes(this.filterTerm.toLowerCase()))),this.isPopupOpen=!1}updateFilterTerm(t){const e=t.target;this.filterTerm=e.value,this.updateFilteredStudySpots()}renderStars(t){const e=Math.floor(t),s=t%1>=.5?1:0,r=5-e-s,o=[];for(let n=0;n<e;n++)o.push(p`<span class="star full"></span>`);s&&o.push(p`<span class="star half"></span>`);for(let n=0;n<r;n++)o.push(p`<span class="star empty"></span>`);return p`${o}`}render(){const t=s=>{var g;const{name:r,ratings:o,reviewsCount:n}=s,{_id:l}=s,a=((g=s.photos)==null?void 0:g[0])||"/icons/default-spot.webp",f=o.overall.toFixed(1);return p`
      <li class="study-spot-container">
        <a href="/app/study-spot/${l}">
          <img src="${a}" alt="${r}" />
          <div class="study-spot-content">
            <h3>${r}</h3>
            <div class="rating-container">
              <p class="overall-rating">${f}</p>
              <div class="stars">
                ${this.renderStars(o.overall)}
              </div>
              <p>(${n} reviews)</p>
            </div>
          </div>
        </a>
      </li>
    `},e=this.filteredStudySpots.length>0?this.filteredStudySpots:this.studySpotIndex;return p`
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
          <h2>Featured Study Spots</h2>
          <filter-popup .open="${this.isPopupOpen}" @sort-requested="${this.handleSortRequested}"></filter-popup>
          <ul class="spots-list">
            ${e.map(t)}
          </ul>
        </section>
      </main>
    `}};te.uses=L({"filter-popup":Rt}),te.styles=[O,S`
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

      .rating-container {
        display: flex;
        align-items: center;
      }
    
      .overall-rating {
        margin-right: var(--space-small);
        font-size: 1rem;
        color: var(--color-secondary);
      }
    
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

    `];let K=te;oe([P()],K.prototype,"studySpotIndex",1);oe([P()],K.prototype,"isPopupOpen",2);oe([P()],K.prototype,"filterTerm",2);oe([P()],K.prototype,"filteredStudySpots",2);var Ro=Object.defineProperty,To=Object.getOwnPropertyDescriptor,je=(i,t,e,s)=>{for(var r=s>1?void 0:s?To(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&Ro(t,e,r),r};const qe=class qe extends Z{constructor(){super("slostudyspots:model"),this.spotid=""}get studySpot(){return this.model.studySpot}get reviews(){return this.model.reviews||[]}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="spot-id"&&e!==s&&s&&(console.log("Study Spot Page:",s),this.dispatchMessage(["review/clear"]),this.dispatchMessage(["study-spot/select",{spotid:s}]),this.dispatchMessage(["review/list-by-spot",{spotId:s}]))}renderStars(t){const e=Math.floor(t),s=t%1>=.5?1:0,r=5-e-s,o=[];for(let n=0;n<e;n++)o.push(p`<span class="star full"></span>`);s&&o.push(p`<span class="star half"></span>`);for(let n=0;n<r;n++)o.push(p`<span class="star empty"></span>`);return p`${o}`}formatDate(t){return new Date(t).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}render(){var c,d,u,v,m,b,et;const{name:t,address:e,hoursOfOperation:s,ratings:r,link:o}=this.studySpot||{},n=((d=(c=this.studySpot)==null?void 0:c.photos)==null?void 0:d[0])||"/icons/default-spot.webp",l=((v=(u=this.studySpot)==null?void 0:u.tags)==null?void 0:v.map(y=>p`<span class="feature-tag">${y}</span>`))||p``,a=o?p`<a href="${o}" target="_blank" class="web-link">${o}</a>`:p`<span class="placeholder-text">Website not available</span>`,f=s&&s.length>0?s.map(y=>p`
      <div class="hours">
        <span>${y.startDay} - ${y.endDay}: ${h(y)}</span>
      </div>
    `):p`<span class="placeholder-text">Hours not available</span>`;function g(y){if(y===-1)return"Closed";const N=Math.floor(y/60),H=y%60,Nt=N>=12?"PM":"AM",ne=N%12===0?12:N%12,_=H<10?`0${H}`:H;return`${ne}:${_} ${Nt}`}function h(y){const N=g(y.open||0),H=g(y.close||0);return y.isOpen24Hours?"Open 24 Hours":`${N} - ${H}`}return p`
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
          <a href="../add-review/${this.spotid}" class="btn-write-review">
            <img src="/icons/create.svg" alt="Write Review Icon" class="btn-icon-white">
            Write Review
          </a>
        </section>

        <div class="details-reviews-container">
          <div class="details-ratings">
            <section class="spot-details">
              <h3>Details</h3>
              <p><strong>Address: </strong>${e}</p>
              <p><strong>Website Link:</strong> ${a}</p>
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
            <h3>${(b=this.studySpot)==null?void 0:b.reviewsCount} User Reviews</h3>
            ${this.reviews.length>0?this.reviews.map(y=>p`
            <div class="review-card">
              <div class="review-header">
                <h4 class="review-author">${y.userId.userid}</h4>
                <span class="review-date">${this.formatDate(y.createdAt.toString())}</span>
              </div>
              <div class="review-body">
                <div class="review-rating">
                  ${this.renderStars(y.overallRating)}
                  <span class="rating-text">${y.overallRating} / 5</span>
                </div>
                <p class="review-comment">${y.comment}</p>
              </div>
              <div class="review-footer">
                <span class="review-time-to-go">Best Time to Go: ${y.bestTimeToGo}</span>
              </div>
            </div>
        `):p`<p>No reviews yet. Be the first to review <strong>${(et=this.studySpot)==null?void 0:et.name}</strong>!</p>`}
          </section>
        </div>
      </main>
    `}};qe.styles=[O,S`
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
        background: linear-gradient(to top, rgba(0,0,0,0.8) 10%, transparent 90%);
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
      }

      .review-author, .review-date, .rating-text {
        font-size: 0.75rem; /* Smaller text for compact display */
      }
    }
    `];let gt=qe;je([$({attribute:"spot-id",reflect:!0})],gt.prototype,"spotid",2);je([P()],gt.prototype,"studySpot",1);je([P()],gt.prototype,"reviews",1);var Uo=Object.defineProperty,Lo=Object.getOwnPropertyDescriptor,tt=(i,t,e,s)=>{for(var r=s>1?void 0:s?Lo(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&Uo(t,e,r),r};const Be=class Be extends Z{constructor(){super("slostudyspots:model"),this.name="",this.address="",this.locationType="",this.customLocationType="",this.tags="",this.link="",this.createdBy="",this._authObserver=new I(this,"slostudyspots:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this.createdBy=t.username)})}render(){return p`
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
                ${this.locationType==="Other"?p`
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
    `}onSubmit(t){t.preventDefault();const e=this.tags.split(",").map(r=>r.trim()),s=this.locationType==="Other"?this.customLocationType:this.locationType;s&&e.push(s),this.dispatchMessage(["study-spot/add",{spot:{name:this.name,address:this.address,locationType:s,tags:e,link:this.link,createdBy:this.createdBy,ratings:{overall:0,quietness:0,wifiQuality:0,crowdedness:0,powerOutlets:0,amenities:0},reviewsCount:0,photos:[],hoursOfOperation:[]},onSuccess:()=>{console.log("Study spot saved successfully"),alert("Study Spot saved successfully!"),window.location.pathname="/app"},onFailure:r=>{console.error("Failed to save study spot:",r),alert("Failed to save study spot")}}])}};Be.styles=[O,S`
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
    `];let T=Be;tt([$({type:String})],T.prototype,"name",2);tt([$({type:String})],T.prototype,"address",2);tt([$({type:String})],T.prototype,"locationType",2);tt([$({type:String})],T.prototype,"customLocationType",2);tt([$({type:String})],T.prototype,"tags",2);tt([$({type:String})],T.prototype,"link",2);tt([$({type:String})],T.prototype,"createdBy",2);var No=Object.defineProperty,jo=Object.getOwnPropertyDescriptor,Mo=(i,t,e,s)=>{for(var r=s>1?void 0:s?jo(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&No(t,e,r),r};const We=class We extends Z{get sortedStudySpots(){return[...this.model.studySpotIndex||[]].sort((t,e)=>{const s=e.ratings.overall-t.ratings.overall;return s!==0?s:e.reviewsCount-t.reviewsCount})}constructor(){super("slostudyspots:model")}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["study-spot/index"])}renderStars(t){const e=Math.floor(t),s=t%1>=.5?1:0,r=5-e-s,o=[];for(let n=0;n<e;n++)o.push(p`<span class="star full"></span>`);s&&o.push(p`<span class="star half"></span>`);for(let n=0;n<r;n++)o.push(p`<span class="star empty"></span>`);return p`${o}`}render(){const t=e=>{const{name:s,ratings:r,reviewsCount:o}=e,{_id:n}=e;return p`
      <a href="study-spot/${n}">
        <li class="ranking">
          <div class="content">
            <h3>${s}</h3>
            <p><strong>Rating: </strong>${r.overall.toFixed(1)} ${this.renderStars(r.overall)} (${o} reviews)</p>
          </div>
        </li>
      </a>
    `};return p`
      <main>
        <section class="rankings-container">
          <h2>Top Rated Study Spots</h2>
          <ol>
            ${this.sortedStudySpots.map(t)}
          </ol>
        </section>
      </main>
    `}};We.styles=[O,S`
      main {
        padding: var(--space-regular);
        flex-grow: 1;
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
    `];let Vt=We;Mo([P()],Vt.prototype,"sortedStudySpots",1);var zo=Object.defineProperty,Io=Object.getOwnPropertyDescriptor,R=(i,t,e,s)=>{for(var r=s>1?void 0:s?Io(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&zo(t,e,r),r};const Qe=class Qe extends Z{constructor(){super("slostudyspots:model"),this.quietnessRating=0,this.wifiQualityRating=0,this.crowdednessRating=0,this.powerOutletRating=0,this.amenitiesRating=0,this.comment="",this.bestTimeToGo="",this.overallRating=0,this.spotid="",this._authObserver=new I(this,"slostudyspots:auth")}get profile(){return this.model.profile}get studySpot(){return this.model.studySpot}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="spot-id"&&e!==s&&s&&(console.log("Study spot being reviewed:",s),this.dispatchMessage(["study-spot/select",{spotid:s}]))}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this.profile||this.dispatchMessage(["profile/select",{userid:t.username}]))})}calculateOverallRating(){return(this.quietnessRating+this.wifiQualityRating+this.crowdednessRating+this.powerOutletRating+this.amenitiesRating)/5}render(){var t;return console.log("My Profile:",this.profile),console.log("Study Spot:",this.studySpot),p`
      <main>
        <section class="add-review">
          <h2>Add Your Review for ${(t=this.studySpot)==null?void 0:t.name}</h2>
            <form id="addReviewForm" autocomplete="off">
              <div class="star-form-group">
                <label><strong>Quietness:</strong> <small>(Rate how quiet the area is)</small></label>
                  <input
                    type="number"
                    name="quietnessRating"
                    placeholder="Quietness Rating (0-5)"
                    @change=${e=>this.quietnessRating=parseInt(e.target.value)}
                    required
                    min="0"
                    max="5"
                  />
              </div>
              <div class="star-form-group">
                <label><strong>Wifi Quality:</strong> <small>(Evaluate the reliability and speed of the WiFi)</small></label>
                <input
                  type="number"
                  name="wifiQualityRating"
                  placeholder="WiFi Quality Rating (0-5)"
                  @change=${e=>this.wifiQualityRating=parseInt(e.target.value)}
                  required
                  min="0"
                  max="5"
                />
              </div>
              <div class="star-form-group">
                <label><strong>Crowdedness:</strong> <small>(Rate how uncrowded the spot is)</small></label>
                <input
                  type="number"
                  name="crowdednessRating"
                  placeholder="Crowdedness Rating (0-5)"
                  @change=${e=>this.crowdednessRating=parseInt(e.target.value)}
                  required
                  min="0"
                  max="5"
                />
              </div>
              <div class="star-form-group">
                <label><strong>Power Outlets:</strong> <small>(Assess the availability of power outlets)</small></label>
                <input
                  type="number"
                  name="powerOutletRating"
                  placeholder="Power Outlet Rating (0-5)"
                  @change=${e=>this.powerOutletRating=parseInt(e.target.value)}
                  required
                  min="0"
                  max="5"
                />
              </div>
              <div class="star-form-group">
                <label><strong>Amenities:</strong> <small>(Evaluate the availability and quality of amenities)</small></label>
                <input
                  type="number"
                  name="amenitiesRating"
                  placeholder="Amenities Rating (0-5)"
                  @change=${e=>this.amenitiesRating=parseInt(e.target.value)}
                  required
                  min="0"
                  max="5"
                />
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
    `}onSubmit(t){if(t.preventDefault(),this.overallRating=this.calculateOverallRating(),!this.profile){console.error("Current user not found");return}const e={userId:this.profile,spotId:this.spotid,quietnessRating:this.quietnessRating,wifiQualityRating:this.wifiQualityRating,crowdednessRating:this.crowdednessRating,powerOutletRating:this.powerOutletRating,amenitiesRating:this.amenitiesRating,overallRating:this.overallRating,comment:this.comment,bestTimeToGo:this.bestTimeToGo,createdAt:new Date,likes:0,edited:!1};this.updateStudySpotRatings(e),this.dispatchMessage(["review/add",{review:e,onSuccess:()=>{console.log("Review saved successfully"),window.location.pathname=`/app/study-spot/${this.spotid}`},onFailure:s=>{console.error("Failed to save review:",s),alert("Failed to save study spot")}}])}updateStudySpotRatings(t){if(!this.studySpot){console.error("Study spot not found");return}const e=this.studySpot.ratings,s=this.studySpot.reviewsCount||0;e.quietness=(e.quietness*s+t.quietnessRating)/(s+1),e.wifiQuality=(e.wifiQuality*s+t.wifiQualityRating)/(s+1),e.crowdedness=(e.crowdedness*s+t.crowdednessRating)/(s+1),e.powerOutlets=(e.powerOutlets*s+t.powerOutletRating)/(s+1),e.amenities=(e.amenities*s+t.amenitiesRating)/(s+1),e.overall=(e.overall*s+t.overallRating)/(s+1),this.dispatchMessage(["study-spot/update",{spotid:this.spotid,rating:e,reviewsCount:s+1,onSuccess:()=>{console.log("Study spot ratings updated successfully")},onFailure:r=>{console.error("Failed to update study spot ratings:",r)}}])}};Qe.styles=[O,S`
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
        margin-bottom: 20px;
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
        font-size: 25px;
        color: #ccc;
        transition: all 0.3s ease;
        cursor: pointer;
      }
      
      .star-rating label:hover,
      .star-rating label:hover ~ label,
      .star-rating input[type='radio']:checked ~ label {
        /* color: #f5d315; */
        color: var(--color-links);
        transform: scale(1.2);
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

      /* Responsive adjustments */
      @media (max-width: 768px) {
        .star-form-group {
          flex-direction: column;
        }

        .star-form-group label {
          margin-bottom: 4px; /* Adds space between the label and input on smaller screens */
        }

        .add-review {
          padding: 10px;
        }

        .form-group input[type="text"],
        .form-group textarea {
          padding: 8px; /* Smaller padding on smaller screens */
        }

        .btn-large {
          font-size: 0.9rem; /* Smaller font size on smaller screens */
        }
      }
    `];let k=Qe;R([$({type:Number})],k.prototype,"quietnessRating",2);R([$({type:Number})],k.prototype,"wifiQualityRating",2);R([$({type:Number})],k.prototype,"crowdednessRating",2);R([$({type:Number})],k.prototype,"powerOutletRating",2);R([$({type:Number})],k.prototype,"amenitiesRating",2);R([$({type:String})],k.prototype,"comment",2);R([$({type:String})],k.prototype,"bestTimeToGo",2);R([$({type:Number})],k.prototype,"overallRating",2);R([P()],k.prototype,"profile",1);R([$({attribute:"spot-id",reflect:!0})],k.prototype,"spotid",2);R([P()],k.prototype,"studySpot",1);const Do=[{auth:"protected",path:"/app/profile/:id/edit",view:i=>p`
      <profile-view edit user-id=${i.id}></profile-view>
    `},{auth:"protected",path:"/app/profile/:id",view:i=>p`
      <profile-view user-id=${i.id}></profile-view>
    `},{path:"/app/study-spot/:id",view:i=>p`
      <study-spot-view spot-id=${i.id}></study-spot-view>
    `},{auth:"protected",path:"/app/add-spot",view:()=>p`
      <add-spot-view></add-spot-view>
    `},{auth:"protected",path:"/app/add-review/:id",view:i=>p`
      <add-review-view spot-id=${i.id}></add-review-view>
    `},{path:"/app/rankings",view:()=>p`
      <rankings-view></rankings-view>
    `},{path:"/app/login",view:()=>p` <login-view></login-view> `},{path:"/app/register",view:()=>p` <register-view></register-view> `},{path:"/app",view:()=>p`
      <home-view></home-view>
    `},{path:"/",redirect:"/app"}];L({"mu-auth":D.Provider,"mu-history":Ur.Provider,"mu-store":class extends zs.Provider{constructor(){super(eo,to,"slostudyspots:auth")}},"mu-switch":class extends Pi.Element{constructor(){super(Do,"slostudyspots:history","slostudyspots:auth")}},"nav-header":Gt,"profile-view":V,"login-view":we,"register-view":xe,"home-view":K,"study-spot-view":gt,"add-spot-view":T,"rankings-view":Vt,"add-review-view":k});
