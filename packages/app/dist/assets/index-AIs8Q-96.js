(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=e(r);fetch(r.href,n)}})();var Oe;class at extends Error{}at.prototype.name="InvalidTokenError";function Zs(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function Qs(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Zs(t)}catch{return atob(t)}}function rs(i,t){if(typeof i!="string")throw new at("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=i.split(".")[e];if(typeof s!="string")throw new at(`Invalid token specified: missing part #${e+1}`);let r;try{r=Qs(s)}catch(n){throw new at(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(r)}catch(n){throw new at(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const Xs="mu:context",se=`${Xs}:change`;class tr{constructor(t,e){this._proxy=er(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class le extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new tr(t,this),this.style.display="contents"}attach(t){return this.addEventListener(se,t),t}detach(t){this.removeEventListener(se,t)}}function er(i,t){return new Proxy(i,{get:(s,r,n)=>{if(r==="then")return;const o=Reflect.get(s,r,n);return console.log(`Context['${r}'] => `,o),o},set:(s,r,n,o)=>{const l=i[r];console.log(`Context['${r.toString()}'] <= `,n);const a=Reflect.set(s,r,n,o);if(a){let p=new CustomEvent(se,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(p,{property:r,oldValue:l,value:n}),t.dispatchEvent(p)}else console.log(`Context['${r}] was not set to ${n}`);return a}})}function sr(i,t){const e=is(t,i);return new Promise((s,r)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else r({context:t,reason:`No provider for this context "${t}:`})})}function is(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const r=t.getRootNode();if(r instanceof ShadowRoot)return is(i,r.host)}class rr extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function ns(i="mu:message"){return(t,...e)=>t.dispatchEvent(new rr(e,i))}class ce{constructor(t,e,s="service:message",r=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=r}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function ir(i){return t=>({...t,...i})}const re="mu:auth:jwt",os=class as extends ce{constructor(t,e){super((s,r)=>this.update(s,r),t,as.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:r}=t[1];return e(or(s)),Gt(r);case"auth/signout":return e(ar()),Gt(this._redirectForLogin);case"auth/redirect":return Gt(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};os.EVENT_TYPE="auth:message";let ls=os;const cs=ns(ls.EVENT_TYPE);function Gt(i,t={}){if(!i)return;const e=window.location.href,s=new URL(i,e);return Object.entries(t).forEach(([r,n])=>s.searchParams.set(r,n)),()=>{console.log("Redirecting to ",i),window.location.assign(s)}}class nr extends le{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){super({user:Y.authenticateFromLocalStorage()})}connectedCallback(){new ls(this.context,this.redirect).attach(this)}}class J{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(re),t}}class Y extends J{constructor(t){super();const e=rs(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new Y(t);return localStorage.setItem(re,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(re);return t?Y.authenticate(t):new J}}function or(i){return ir({user:Y.authenticate(i),token:i})}function ar(){return i=>{const t=i.user;return{user:t&&t.authenticated?J.deauthenticate(t):t,token:""}}}function lr(i){return i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function cr(i){return i.authenticated?rs(i.token||""):{}}const _t=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:Y,Provider:nr,User:J,dispatch:cs,headers:lr,payload:cr},Symbol.toStringTag,{value:"Module"}));function kt(i,t,e){const s=i.target,r=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${i.type}:`,r),s.dispatchEvent(r),i.stopPropagation()}function ie(i,t="*"){return i.composedPath().find(s=>{const r=s;return r.tagName&&r.matches(t)})}const he=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:ie,relay:kt},Symbol.toStringTag,{value:"Module"})),hr=new DOMParser;function $t(i,...t){const e=i.map((o,l)=>l?[t[l-1],o]:[o]).flat().join(""),s=hr.parseFromString(e,"text/html"),r=s.head.childElementCount?s.head.children:s.body.children,n=new DocumentFragment;return n.replaceChildren(...r),n}function Dt(i){const t=i.firstElementChild,e=t&&t.tagName==="TEMPLATE"?t:void 0;return{attach:s};function s(r,n={mode:"open"}){const o=r.attachShadow(n);return e&&o.appendChild(e.content.cloneNode(!0)),o}}const hs=class us extends HTMLElement{constructor(){super(),this._state={},Dt(us.template).attach(this),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}}),this.form&&this.form.addEventListener("submit",t=>{t.preventDefault(),kt(t,"mu-form:submit",this._state)})}set init(t){this._state=t||{},dr(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}};hs.template=$t`
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
  `;let ur=hs;function dr(i,t){const e=Object.entries(i);for(const[s,r]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!r;break;case"date":o.value=r.toISOString().substr(0,10);break;default:o.value=r;break}}}return i}const pr=Object.freeze(Object.defineProperty({__proto__:null,Element:ur},Symbol.toStringTag,{value:"Module"})),ds=class ps extends ce{constructor(t){super((e,s)=>this.update(e,s),t,ps.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:r}=t[1];e(mr(s,r));break}case"history/redirect":{const{href:s,state:r}=t[1];e(gr(s,r));break}}}};ds.EVENT_TYPE="history:message";let ue=ds;class Te extends le{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=fr(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),de(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new ue(this.context).attach(this)}}function fr(i){const t=i.currentTarget,e=s=>s.tagName=="A"&&s.href;if(i.button===0)if(i.composed){const r=i.composedPath().find(e);return r||void 0}else{for(let s=i.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function mr(i,t={}){return history.pushState(t,"",i),()=>({location:document.location,state:history.state})}function gr(i,t={}){return history.replaceState(t,"",i),()=>({location:document.location,state:history.state})}const de=ns(ue.EVENT_TYPE),fs=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Te,Provider:Te,Service:ue,dispatch:de},Symbol.toStringTag,{value:"Module"}));class K{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const r=new Re(this._provider,t);this._effects.push(r),e(r)}else sr(this._target,this._contextLabel).then(r=>{const n=new Re(r,t);this._provider=r,this._effects.push(n),r.attach(o=>this._handleChange(o)),e(n)}).catch(r=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,r))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),this._effects.forEach(e=>e.runEffect())}}class Re{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const pe=class ms extends HTMLElement{constructor(){super(),this._state={},this._user=new J,this._authObserver=new K(this,"blazing:auth"),Dt(ms.template).attach(this),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",r=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;yr(r,this._state,e,this.authorization).then(n=>rt(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:r}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:r,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},rt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&ne(this.src,this.authorization).then(e=>{this._state=e,rt(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&ne(this.src,this.authorization).then(r=>{this._state=r,rt(r,this)});break;case"new":s&&(this._state={},rt({},this));break}}};pe.observedAttributes=["src","new","action"];pe.template=$t`
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
  `;let vr=pe;function ne(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function rt(i,t){const e=Object.entries(i);for(const[s,r]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!r;break;default:o.value=r;break}}}return i}function yr(i,t,e="PUT",s={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(r=>{if(r.status!=200&&r.status!=201)throw`Form submission failed: Status ${r.status}`;return r.json()})}const gs=Object.freeze(Object.defineProperty({__proto__:null,FormElement:vr,fetchData:ne},Symbol.toStringTag,{value:"Module"})),vs=class ys extends ce{constructor(t,e){super(e,t,ys.EVENT_TYPE,!1)}};vs.EVENT_TYPE="mu:message";let _s=vs;class _r extends le{constructor(t,e,s){super(e),this._user=new J,this._updateFn=t,this._authObserver=new K(this,s)}connectedCallback(){const t=new _s(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const $r=Object.freeze(Object.defineProperty({__proto__:null,Provider:_r,Service:_s},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xt=globalThis,fe=xt.ShadowRoot&&(xt.ShadyCSS===void 0||xt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,me=Symbol(),Ue=new WeakMap;let $s=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==me)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(fe&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Ue.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ue.set(e,t))}return t}toString(){return this.cssText}};const br=i=>new $s(typeof i=="string"?i:i+"",void 0,me),wr=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new $s(e,i,me)},Ar=(i,t)=>{if(fe)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=xt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Ne=fe?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return br(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Er,defineProperty:Sr,getOwnPropertyDescriptor:xr,getOwnPropertyNames:Pr,getOwnPropertySymbols:kr,getPrototypeOf:Cr}=Object,G=globalThis,Le=G.trustedTypes,Or=Le?Le.emptyScript:"",Me=G.reactiveElementPolyfillSupport,lt=(i,t)=>i,Ct={toAttribute(i,t){switch(t){case Boolean:i=i?Or:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ge=(i,t)=>!Er(i,t),je={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:ge};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),G.litPropertyMetadata??(G.litPropertyMetadata=new WeakMap);let q=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=je){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Sr(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=xr(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return r==null?void 0:r.call(this)},set(o){const l=r==null?void 0:r.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??je}static _$Ei(){if(this.hasOwnProperty(lt("elementProperties")))return;const t=Cr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(lt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(lt("properties"))){const e=this.properties,s=[...Pr(e),...kr(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(Ne(r))}else t!==void 0&&e.push(Ne(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ar(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const r=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,r);if(n!==void 0&&r.reflect===!0){const o=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:Ct).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s;const r=this.constructor,n=r._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=r.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:Ct;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??ge)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(s)):this._$EU()}catch(r){throw e=!1,this._$EU(),r}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};q.elementStyles=[],q.shadowRootOptions={mode:"open"},q[lt("elementProperties")]=new Map,q[lt("finalized")]=new Map,Me==null||Me({ReactiveElement:q}),(G.reactiveElementVersions??(G.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ot=globalThis,Tt=Ot.trustedTypes,He=Tt?Tt.createPolicy("lit-html",{createHTML:i=>i}):void 0,bs="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,ws="?"+k,Tr=`<${ws}>`,H=document,ut=()=>H.createComment(""),dt=i=>i===null||typeof i!="object"&&typeof i!="function",As=Array.isArray,Rr=i=>As(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Zt=`[ 	
\f\r]`,it=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ie=/-->/g,ze=/>/g,N=RegExp(`>|${Zt}(?:([^\\s"'>=/]+)(${Zt}*=${Zt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),De=/'/g,Fe=/"/g,Es=/^(?:script|style|textarea|title)$/i,Ur=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),nt=Ur(1),Z=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Be=new WeakMap,M=H.createTreeWalker(H,129);function Ss(i,t){if(!Array.isArray(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return He!==void 0?He.createHTML(t):t}const Nr=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":"",o=it;for(let l=0;l<e;l++){const a=i[l];let p,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===it?f[1]==="!--"?o=Ie:f[1]!==void 0?o=ze:f[2]!==void 0?(Es.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=N):f[3]!==void 0&&(o=N):o===N?f[0]===">"?(o=r??it,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,p=f[1],o=f[3]===void 0?N:f[3]==='"'?Fe:De):o===Fe||o===De?o=N:o===Ie||o===ze?o=it:(o=N,r=void 0);const h=o===N&&i[l+1].startsWith("/>")?" ":"";n+=o===it?a+Tr:u>=0?(s.push(p),a.slice(0,u)+bs+a.slice(u)+k+h):a+k+(u===-2?l:h)}return[Ss(i,n+(i[e]||"<?>")+(t===2?"</svg>":"")),s]};let oe=class xs{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[p,f]=Nr(t,e);if(this.el=xs.createElement(p,s),M.currentNode=this.el.content,e===2){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=M.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(bs)){const c=f[o++],h=r.getAttribute(u).split(k),d=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:d[2],strings:h,ctor:d[1]==="."?Mr:d[1]==="?"?jr:d[1]==="@"?Hr:Ft}),r.removeAttribute(u)}else u.startsWith(k)&&(a.push({type:6,index:n}),r.removeAttribute(u));if(Es.test(r.tagName)){const u=r.textContent.split(k),c=u.length-1;if(c>0){r.textContent=Tt?Tt.emptyScript:"";for(let h=0;h<c;h++)r.append(u[h],ut()),M.nextNode(),a.push({type:2,index:++n});r.append(u[c],ut())}}}else if(r.nodeType===8)if(r.data===ws)a.push({type:2,index:n});else{let u=-1;for(;(u=r.data.indexOf(k,u+1))!==-1;)a.push({type:7,index:n}),u+=k.length-1}n++}}static createElement(t,e){const s=H.createElement("template");return s.innerHTML=t,s}};function Q(i,t,e=i,s){var r,n;if(t===Z)return t;let o=s!==void 0?(r=e._$Co)==null?void 0:r[s]:e._$Cl;const l=dt(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(i),o._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=o:e._$Cl=o),o!==void 0&&(t=Q(i,o._$AS(i,t.values),o,s)),t}let Lr=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??H).importNode(e,!0);M.currentNode=r;let n=M.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let p;a.type===2?p=new ve(n,n.nextSibling,this,t):a.type===1?p=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(p=new Ir(n,this,t)),this._$AV.push(p),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=M.nextNode(),o++)}return M.currentNode=H,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},ve=class Ps{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),dt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==Z&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Rr(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==$&&dt(this._$AH)?this._$AA.nextSibling.data=t:this.T(H.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:r}=t,n=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=oe.createElement(Ss(r.h,r.h[0]),this.options)),r);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new Lr(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=Be.get(t.strings);return e===void 0&&Be.set(t.strings,e=new oe(t)),e}k(t){As(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new Ps(this.S(ut()),this.S(ut()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},Ft=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=Q(this,t,e,0),o=!dt(t)||t!==this._$AH&&t!==Z,o&&(this._$AH=t);else{const l=t;let a,p;for(t=n[0],a=0;a<n.length-1;a++)p=Q(this,l[s+a],e,a),p===Z&&(p=this._$AH[a]),o||(o=!dt(p)||p!==this._$AH[a]),p===$?t=$:t!==$&&(t+=(p??"")+n[a+1]),this._$AH[a]=p}o&&!r&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Mr=class extends Ft{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}},jr=class extends Ft{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}},Hr=class extends Ft{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??$)===Z)return;const s=this._$AH,r=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==$&&(s===$||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},Ir=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}};const qe=Ot.litHtmlPolyfillSupport;qe==null||qe(oe,ve),(Ot.litHtmlVersions??(Ot.litHtmlVersions=[])).push("3.1.3");const zr=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new ve(t.insertBefore(ut(),n),n,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let W=class extends q{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=zr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return Z}};W._$litElement$=!0,W.finalized=!0,(Oe=globalThis.litElementHydrateSupport)==null||Oe.call(globalThis,{LitElement:W});const Ve=globalThis.litElementPolyfillSupport;Ve==null||Ve({LitElement:W});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Dr={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:ge},Fr=(i=Dr,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.P(o,void 0,i),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+s)};function ks(i){return(t,e)=>typeof e=="object"?Fr(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Cs(i){return ks({...i,state:!0,attribute:!1})}function Br(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function qr(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Os={};(function(i){var t=function(){var e=function(u,c,h,d){for(h=h||{},d=u.length;d--;h[u[d]]=c);return h},s=[1,9],r=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,d,g,m,v,Vt){var A=v.length-1;switch(m){case 1:return new g.Root({},[v[A-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[v[A-1],v[A]]);break;case 4:case 5:this.$=v[A];break;case 6:this.$=new g.Literal({value:v[A]});break;case 7:this.$=new g.Splat({name:v[A]});break;case 8:this.$=new g.Param({name:v[A]});break;case 9:this.$=new g.Optional({},[v[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:r,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let d=function(g,m){this.message=g,this.hash=m};throw d.prototype=Error,new d(c,h)}},parse:function(c){var h=this,d=[0],g=[null],m=[],v=this.table,Vt="",A=0,Pe=0,Js=2,ke=1,Ys=m.slice.call(arguments,1),_=Object.create(this.lexer),R={yy:{}};for(var Wt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Wt)&&(R.yy[Wt]=this.yy[Wt]);_.setInput(c,R.yy),R.yy.lexer=_,R.yy.parser=this,typeof _.yylloc>"u"&&(_.yylloc={});var Jt=_.yylloc;m.push(Jt);var Ks=_.options&&_.options.ranges;typeof R.yy.parseError=="function"?this.parseError=R.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Gs=function(){var F;return F=_.lex()||ke,typeof F!="number"&&(F=h.symbols_[F]||F),F},w,U,E,Yt,D={},Et,x,Ce,St;;){if(U=d[d.length-1],this.defaultActions[U]?E=this.defaultActions[U]:((w===null||typeof w>"u")&&(w=Gs()),E=v[U]&&v[U][w]),typeof E>"u"||!E.length||!E[0]){var Kt="";St=[];for(Et in v[U])this.terminals_[Et]&&Et>Js&&St.push("'"+this.terminals_[Et]+"'");_.showPosition?Kt="Parse error on line "+(A+1)+`:
`+_.showPosition()+`
Expecting `+St.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Kt="Parse error on line "+(A+1)+": Unexpected "+(w==ke?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Kt,{text:_.match,token:this.terminals_[w]||w,line:_.yylineno,loc:Jt,expected:St})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+U+", token: "+w);switch(E[0]){case 1:d.push(w),g.push(_.yytext),m.push(_.yylloc),d.push(E[1]),w=null,Pe=_.yyleng,Vt=_.yytext,A=_.yylineno,Jt=_.yylloc;break;case 2:if(x=this.productions_[E[1]][1],D.$=g[g.length-x],D._$={first_line:m[m.length-(x||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(x||1)].first_column,last_column:m[m.length-1].last_column},Ks&&(D._$.range=[m[m.length-(x||1)].range[0],m[m.length-1].range[1]]),Yt=this.performAction.apply(D,[Vt,Pe,A,R.yy,E[1],g,m].concat(Ys)),typeof Yt<"u")return Yt;x&&(d=d.slice(0,-1*x*2),g=g.slice(0,-1*x),m=m.slice(0,-1*x)),d.push(this.productions_[E[1]][0]),g.push(D.$),m.push(D._$),Ce=v[d[d.length-2]][d[d.length-1]],d.push(Ce);break;case 3:return!0}}return!0}},p=function(){var u={EOF:1,parseError:function(h,d){if(this.yy.parser)this.yy.parser.parseError(h,d);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,d=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),d.length-1&&(this.yylineno-=d.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:d?(d.length===g.length?this.yylloc.first_column:0)+g[g.length-d.length].length-d[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var d,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=c[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],d=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),d)return d;if(this._backtrack){for(var v in m)this[v]=m[v];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,d,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),v=0;v<m.length;v++)if(d=this._input.match(this.rules[m[v]]),d&&(!h||d[0].length>h[0].length)){if(h=d,g=v,this.options.backtrack_lexer){if(c=this.test_match(d,m[v]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,m[g]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,d,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=p;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof qr<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(Os);function B(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var Ts={Root:B("Root"),Concat:B("Concat"),Literal:B("Literal"),Splat:B("Splat"),Param:B("Param"),Optional:B("Optional")},Rs=Os.parser;Rs.yy=Ts;var Vr=Rs,Wr=Object.keys(Ts);function Jr(i){return Wr.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var Us=Jr,Yr=Us,Kr=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Ns(i){this.captures=i.captures,this.re=i.re}Ns.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(s,r){typeof t[r+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[r+1])}),e};var Gr=Yr({Concat:function(i){return i.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(Kr,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new Ns({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Zr=Gr,Qr=Us,Xr=Qr({Concat:function(i,t){var e=i.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),ti=Xr,ei=Vr,si=Zr,ri=ti;bt.prototype=Object.create(null);bt.prototype.match=function(i){var t=si.visit(this.ast),e=t.match(i);return e||!1};bt.prototype.reverse=function(i){return ri.visit(this.ast,i)};function bt(i){var t;if(this?t=this:t=Object.create(bt.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=ei.parse(i),t}var ii=bt,ni=ii,oi=ni;const ai=Br(oi);var li=Object.defineProperty,ci=Object.getOwnPropertyDescriptor,Ls=(i,t,e,s)=>{for(var r=s>1?void 0:s?ci(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&li(t,e,r),r};class pt extends W{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>nt`
      <h1>Not Found</h1>
    `,this._cases=t.map(r=>({...r,route:new ai(r.path)})),this._historyObserver=new K(this,e),this._authObserver=new K(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),nt`
      <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(cs(this,"auth/redirect"),nt`
              <h1>Redirecting for Login</h1>
            `):e.view(e.params||{}):nt`
              <h1>Authenticating</h1>
            `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),nt`
              <h1>Redirecting to ${s}…</h1>
            `}}return this._fallback({})})()}</main>
    `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,r=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:r}}}redirect(t){de(this,"history/redirect",{href:t})}}pt.styles=wr`
    :host,
    main {
      display: contents;
    }
  `;Ls([Cs()],pt.prototype,"_user",2);Ls([Cs()],pt.prototype,"_match",2);const hi=Object.freeze(Object.defineProperty({__proto__:null,Element:pt,Switch:pt},Symbol.toStringTag,{value:"Module"})),ui=class Ms extends HTMLElement{constructor(){if(super(),Dt(Ms.template).attach(this),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};ui.template=$t`
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
  `;const di=class js extends HTMLElement{constructor(){super(),this._array=[],Dt(js.template).attach(this),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Hs("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),r=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=r,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{ie(t,"button.add")?kt(t,"input-array:add"):ie(t,"button.remove")&&kt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],pi(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};di.template=$t`
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
  `;function pi(i,t){t.replaceChildren(),i.forEach((e,s)=>t.append(Hs(e)))}function Hs(i,t){const e=i===void 0?"":`value="${i}"`;return $t`
    <label>
      <input ${e} />
      <button class="remove" type="button">Remove</button>
    </label>
  `}function T(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var fi=Object.defineProperty,mi=Object.getOwnPropertyDescriptor,gi=(i,t,e,s)=>{for(var r=s>1?void 0:s?mi(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&fi(t,e,r),r};class ye extends W{constructor(t){super(),this._pending=[],this._observer=new K(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,r])=>{console.log("Dispatching queued event",r,s),s.dispatchEvent(r)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}gi([ks()],ye.prototype,"model",1);/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pt=globalThis,_e=Pt.ShadowRoot&&(Pt.ShadyCSS===void 0||Pt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,$e=Symbol(),We=new WeakMap;let Is=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==$e)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(_e&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=We.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&We.set(e,t))}return t}toString(){return this.cssText}};const vi=i=>new Is(typeof i=="string"?i:i+"",void 0,$e),P=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new Is(e,i,$e)},yi=(i,t)=>{if(_e)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=Pt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Je=_e?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return vi(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:_i,defineProperty:$i,getOwnPropertyDescriptor:bi,getOwnPropertyNames:wi,getOwnPropertySymbols:Ai,getPrototypeOf:Ei}=Object,O=globalThis,Ye=O.trustedTypes,Si=Ye?Ye.emptyScript:"",Qt=O.reactiveElementPolyfillSupport,ct=(i,t)=>i,Rt={toAttribute(i,t){switch(t){case Boolean:i=i?Si:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},be=(i,t)=>!_i(i,t),Ke={attribute:!0,type:String,converter:Rt,reflect:!1,hasChanged:be};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),O.litPropertyMetadata??(O.litPropertyMetadata=new WeakMap);class V extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ke){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&$i(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=bi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return r==null?void 0:r.call(this)},set(o){const l=r==null?void 0:r.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ke}static _$Ei(){if(this.hasOwnProperty(ct("elementProperties")))return;const t=Ei(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ct("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ct("properties"))){const e=this.properties,s=[...wi(e),...Ai(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(Je(r))}else t!==void 0&&e.push(Je(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return yi(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var n;const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:Rt).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){var n;const s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const o=s.getPropertyOptions(r),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((n=o.converter)==null?void 0:n.fromAttribute)!==void 0?o.converter:Rt;this._$Em=r,this[r]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??be)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(e)):this._$EU()}catch(r){throw t=!1,this._$EU(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}V.elementStyles=[],V.shadowRootOptions={mode:"open"},V[ct("elementProperties")]=new Map,V[ct("finalized")]=new Map,Qt==null||Qt({ReactiveElement:V}),(O.reactiveElementVersions??(O.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ht=globalThis,Ut=ht.trustedTypes,Ge=Ut?Ut.createPolicy("lit-html",{createHTML:i=>i}):void 0,zs="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,Ds="?"+C,xi=`<${Ds}>`,I=document,ft=()=>I.createComment(""),mt=i=>i===null||typeof i!="object"&&typeof i!="function",Fs=Array.isArray,Pi=i=>Fs(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Xt=`[ 	
\f\r]`,ot=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ze=/-->/g,Qe=/>/g,L=RegExp(`>|${Xt}(?:([^\\s"'>=/]+)(${Xt}*=${Xt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Xe=/'/g,ts=/"/g,Bs=/^(?:script|style|textarea|title)$/i,ki=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),y=ki(1),X=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),es=new WeakMap,j=I.createTreeWalker(I,129);function qs(i,t){if(!Array.isArray(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ge!==void 0?Ge.createHTML(t):t}const Ci=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":"",o=ot;for(let l=0;l<e;l++){const a=i[l];let p,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===ot?f[1]==="!--"?o=Ze:f[1]!==void 0?o=Qe:f[2]!==void 0?(Bs.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=L):f[3]!==void 0&&(o=L):o===L?f[0]===">"?(o=r??ot,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,p=f[1],o=f[3]===void 0?L:f[3]==='"'?ts:Xe):o===ts||o===Xe?o=L:o===Ze||o===Qe?o=ot:(o=L,r=void 0);const h=o===L&&i[l+1].startsWith("/>")?" ":"";n+=o===ot?a+xi:u>=0?(s.push(p),a.slice(0,u)+zs+a.slice(u)+C+h):a+C+(u===-2?l:h)}return[qs(i,n+(i[e]||"<?>")+(t===2?"</svg>":"")),s]};class gt{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[p,f]=Ci(t,e);if(this.el=gt.createElement(p,s),j.currentNode=this.el.content,e===2){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=j.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(zs)){const c=f[o++],h=r.getAttribute(u).split(C),d=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:d[2],strings:h,ctor:d[1]==="."?Ti:d[1]==="?"?Ri:d[1]==="@"?Ui:Bt}),r.removeAttribute(u)}else u.startsWith(C)&&(a.push({type:6,index:n}),r.removeAttribute(u));if(Bs.test(r.tagName)){const u=r.textContent.split(C),c=u.length-1;if(c>0){r.textContent=Ut?Ut.emptyScript:"";for(let h=0;h<c;h++)r.append(u[h],ft()),j.nextNode(),a.push({type:2,index:++n});r.append(u[c],ft())}}}else if(r.nodeType===8)if(r.data===Ds)a.push({type:2,index:n});else{let u=-1;for(;(u=r.data.indexOf(C,u+1))!==-1;)a.push({type:7,index:n}),u+=C.length-1}n++}}static createElement(t,e){const s=I.createElement("template");return s.innerHTML=t,s}}function tt(i,t,e=i,s){var o,l;if(t===X)return t;let r=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=mt(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==n&&((l=r==null?void 0:r._$AO)==null||l.call(r,!1),n===void 0?r=void 0:(r=new n(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=r:e._$Cl=r),r!==void 0&&(t=tt(i,r._$AS(i,t.values),r,s)),t}class Oi{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??I).importNode(e,!0);j.currentNode=r;let n=j.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let p;a.type===2?p=new wt(n,n.nextSibling,this,t):a.type===1?p=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(p=new Ni(n,this,t)),this._$AV.push(p),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=j.nextNode(),o++)}return j.currentNode=I,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class wt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=tt(this,t,e),mt(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==X&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Pi(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==b&&mt(this._$AH)?this._$AA.nextSibling.data=t:this.T(I.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=gt.createElement(qs(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===r)this._$AH.p(e);else{const o=new Oi(r,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=es.get(t.strings);return e===void 0&&es.set(t.strings,e=new gt(t)),e}k(t){Fs(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new wt(this.S(ft()),this.S(ft()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Bt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=b}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=tt(this,t,e,0),o=!mt(t)||t!==this._$AH&&t!==X,o&&(this._$AH=t);else{const l=t;let a,p;for(t=n[0],a=0;a<n.length-1;a++)p=tt(this,l[s+a],e,a),p===X&&(p=this._$AH[a]),o||(o=!mt(p)||p!==this._$AH[a]),p===b?t=b:t!==b&&(t+=(p??"")+n[a+1]),this._$AH[a]=p}o&&!r&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ti extends Bt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}}class Ri extends Bt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}}class Ui extends Bt{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=tt(this,t,e,0)??b)===X)return;const s=this._$AH,r=t===b&&s!==b||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==b&&(s===b||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Ni{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){tt(this,t)}}const te=ht.litHtmlPolyfillSupport;te==null||te(gt,wt),(ht.litHtmlVersions??(ht.litHtmlVersions=[])).push("3.1.3");const Li=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new wt(t.insertBefore(ft(),n),n,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class S extends V{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Li(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return X}}var ss;S._$litElement$=!0,S.finalized=!0,(ss=globalThis.litElementHydrateSupport)==null||ss.call(globalThis,{LitElement:S});const ee=globalThis.litElementPolyfillSupport;ee==null||ee({LitElement:S});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");const Mi={};function ji(i,t,e){switch(i[0]){case"profile/save":Hi(i[1],e).then(r=>t(n=>({...n,profile:r}))).then(()=>{const{onSuccess:r}=i[1];r&&r()}).catch(r=>{const{onFailure:n}=i[1];n&&n(r)});break;case"profile/select":Ii(i[1],e).then(r=>t(n=>({...n,profile:r})));break;case"study-spot/index":zi().then(r=>t(n=>({...n,studySpotIndex:r}))).catch(r=>{console.error("Failed to fetch study spots",r)});break;case"study-spot/select":Di(i[1]).then(r=>t(n=>({...n,studySpot:r})));break;default:const s=i[0];throw new Error(`Unhandled message "${s}"`)}}function Hi(i,t){return fetch(`/api/profiles/${i.userid}`,{method:"PUT",headers:{"Content-Type":"application/json",..._t.headers(t)},body:JSON.stringify(i.profile)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to save profile for ${i.userid}`)}).then(e=>{if(e)return e})}function Ii(i,t){return fetch(`/api/profiles/${i.userid}`,{headers:_t.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Profile:",e),e})}function zi(){return fetch("/study-spots",{method:"GET"}).then(i=>{if(i.status===200)return i.json();throw"Failed to get study spots"}).then(i=>{if(i)return console.log("Study Spots:",i),i})}function Di(i){return fetch(`/study-spots/${i.spotid}`,{method:"GET"}).then(t=>{if(t.status===200)return t.json()}).then(t=>{if(t)return console.log("Study Spot:",t),t})}const we=class we extends S{constructor(){super(...arguments),this._onClickAway=t=>{this.contains(t.target)||(this.removeAttribute("open"),window.removeEventListener("click",this._onClickAway))}}render(){return y`
      <slot name="actuator">
        <button @click="${this.toggle}">
          <img src="/icons/menu.svg" alt="Menu" id="menu-icon" />
        </button>
      </slot>
      <div id="panel">
        <slot></slot>
      </div>
    `}toggle(){this.hasAttribute("open")?(this.removeAttribute("open"),window.removeEventListener("click",this._onClickAway)):(this.setAttribute("open",""),setTimeout(()=>{window.addEventListener("click",this._onClickAway)},0))}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("click",this._onClickAway)}};we.styles=P`
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
  `;let Nt=we;customElements.define("drop-down",Nt);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Fi={attribute:!0,type:String,converter:Rt,reflect:!1,hasChanged:be},Bi=(i=Fi,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.P(o,void 0,i),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+s)};function z(i){return(t,e)=>typeof e=="object"?Bi(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function qt(i){return z({...i,state:!0,attribute:!1})}var qi=Object.defineProperty,Vi=Object.getOwnPropertyDescriptor,Vs=(i,t,e,s)=>{for(var r=s>1?void 0:s?Vi(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&qi(t,e,r),r};const Ht=class Ht extends S{constructor(){super(),this.username="anonymous",this.user=null,this._authObserver=new K(this,"slostudyspots:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&t.username!==this.username?(this.username=t.username,this.user=t):this.user=null})}render(){return y`
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
                  <label class="light-dark-switch" @change=${Wi}>
                    <input type="checkbox" autocomplete="off" />
                    Dark mode
                  </label>
                </li>
                <li>
                  <a href="#" @click=${Ji}> Sign out </a>
                </li>
              </ul>
            </drop-down>
          </nav>
        </div>
      </header>
    `}};Ht.uses=T({"drop-down":Nt}),Ht.styles=P`
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
  `;let vt=Ht;Vs([qt()],vt.prototype,"username",2);Vs([qt()],vt.prototype,"user",2);function Wi(i){const e=i.target.checked;document.body.classList.toggle("dark-mode",e)}function Ji(i){he.relay(i,"auth:message",["auth/signout"])}const At=P`
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
`;var Yi=Object.defineProperty,Ki=Object.getOwnPropertyDescriptor,st=(i,t,e,s)=>{for(var r=s>1?void 0:s?Ki(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&Yi(t,e,r),r};const Ws=P`
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
`,Ae=class Ae extends S{render(){return y`
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
  `}};Ae.styles=[At,Ws,P`
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
    `];let Lt=Ae;st([z()],Lt.prototype,"username",2);const It=class It extends S{render(){return y`
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
    `}};It.uses=T({"mu-form":pr.Element}),It.styles=[At,Ws,P`
      mu-form {
        grid-column: key / end;
      }
      mu-form input {
        grid-column: input;
      }
    `];let yt=It;st([z()],yt.prototype,"username",2);st([z({attribute:!1})],yt.prototype,"init",2);const zt=class zt extends ye{constructor(){super("slostudyspots:model"),this.edit=!1,this.userid=""}get profile(){return this.model.profile}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="user-id"&&e!==s&&s&&(console.log("Profiler Page:",s),this.dispatchMessage(["profile/select",{userid:s}]))}render(){var f,u,c;const{avatar:t,name:e,userid:s,email:r,bio:n,reviewsCount:o}=this.profile||{},l=((u=(f=this.profile)==null?void 0:f.favSpots)==null?void 0:u.map(h=>y`<li>${h}</li>`))||y``,a=(c=this.profile)!=null&&c.dateJoined?new Date(this.profile.dateJoined).toLocaleDateString():"Date unavailable",p=t?y`<img src=${t} alt="Profile Avatar" slot="avatar">`:y`<div slot="avatar">No Avatar</div>`;return this.edit?y`
        <profile-editor
          username=${s}
          .init=${this.profile}
          @mu-form:submit=${h=>this._handleSubmit(h)}>
          ${p}
        </profile-editor>
      `:y`
        <profile-viewer username=${s}>
          ${p}
          <span slot="name">${e}</span>
          <span slot="userid">${s}</span>
          <span slot="email">${r}</span>
          <span slot="bio">${n||"No bio available"}</span>
          <span slot="dateJoined">${a}</span>
          <span slot="reviewsCount">${o}</span>
          <ul slot="favSpots">${l}</ul>
        </profile-viewer>
      `}_handleSubmit(t){console.log("Handling submit of mu-form"),this.dispatchMessage(["profile/save",{userid:this.userid,profile:t.detail,onSuccess:()=>fs.dispatch(this,"history/navigate",{href:`/app/profile/${this.userid}`}),onFailure:e=>console.log("ERROR:",e)}])}};zt.uses=T({"profile-viewer":Lt,"profile-editor":yt}),zt.styles=[At];let et=zt;st([z({type:Boolean,reflect:!0})],et.prototype,"edit",2);st([z({attribute:"user-id",reflect:!0})],et.prototype,"userid",2);st([qt()],et.prototype,"profile",1);var Gi=Object.defineProperty,Zi=Object.getOwnPropertyDescriptor,Qi=(i,t,e,s)=>{for(var r=s>1?void 0:s?Zi(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&Gi(t,e,r),r};T({"restful-form":gs.FormElement});const Ee=class Ee extends S{constructor(){super(...arguments),this.message=""}render(){return y`
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
    `}get next(){return new URLSearchParams(document.location.search).get("next")}_handleSuccess(t){const e=t.detail,{token:s}=e.created,r=this.next||"/";console.log("Login successful",e,r),he.relay(t,"auth:message",["auth/signin",{token:s,redirect:r}])}_handleError(t){const{error:e}=t.detail;console.log("Login failed",t.detail),this.message=e.toString()}};Ee.styles=P`
    .error {
      color: firebrick;
    }
  `;let Mt=Ee;Qi([z()],Mt.prototype,"message",2);T({"mu-auth":_t.Provider,"login-form":Mt});const Se=class Se extends S{render(){return y`
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
    `}};Se.styles=[At,P`
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
    `];let ae=Se;T({"restful-form":gs.FormElement});class Xi extends S{render(){return y`
      <restful-form new src="/auth/register">
        <slot></slot>
      </restful-form>
    `}get next(){return new URLSearchParams(document.location.search).get("next")}constructor(){super(),this.addEventListener("mu-rest-form:created",t=>{const e=t.detail,{token:s}=e.created,r=this.next||"/";console.log("Signup successful",e,r),he.relay(t,"auth:message",["auth/signin",{token:s,redirect:r}])})}}T({"mu-auth":_t.Provider,"register-form":Xi});class tn extends S{render(){return y`
      <div class="center">
        <div class="container">
          <h2>Register</h2>
          <main class="card">
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
          </main>
          <p>
            Or did you want to
            <a href="/app/login">Login as a returning user</a>
            ?
          </p>
        </div>
      </div>`}}var en=Object.defineProperty,sn=Object.getOwnPropertyDescriptor,rn=(i,t,e,s)=>{for(var r=s>1?void 0:s?sn(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&en(t,e,r),r};const xe=class xe extends ye{get studySpotIndex(){return this.model.studySpotIndex||[]}constructor(){super("slostudyspots:model")}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["study-spot/index"])}render(){const t=e=>{const{name:s}=e,{_id:r}=e;return y`
      <li class="study-spot-container">
        <a href="/app/study-spots/${r}">
          <img src="../public/icons/default-spot.webp" alt="${s}" />
          <div class="study-spot-content">
            <h3>${s}</h3>
            <p> Reviews: 5 </p>
          </div>
        </a>
      </li>
    `};return y`
      <main class="page">
        <section class="welcome-section">
          <h1>Welcome to SLOStudySpots</h1>
          <p>Find the best spots to study in San Luis Obispo!</p>
        </section>

        <section class="featured-spots">
          <h2>Featured Study Spots</h2>
          <ul class="spots-list">
            ${this.studySpotIndex.map(t)}
          </ul>
        </section>
      </main>
    `}};xe.styles=[At,P`
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
    `];let jt=xe;rn([qt()],jt.prototype,"studySpotIndex",1);const nn=[{auth:"protected",path:"/app/profile/:id/edit",view:i=>y`
      <profile-view edit user-id=${i.id}></profile-view>
    `},{auth:"protected",path:"/app/profile/:id",view:i=>y`
      <profile-view user-id=${i.id}></profile-view>
    `},{path:"/app",view:()=>y`
      <home-view></home-view>
    `},{path:"/app/login",view:()=>y` <login-view></login-view> `},{path:"/app/register",view:()=>y` <register-view></register-view> `},{path:"/",redirect:"/app"}];T({"mu-auth":_t.Provider,"mu-history":fs.Provider,"mu-store":class extends $r.Provider{constructor(){super(ji,Mi,"slostudyspots:auth")}},"mu-switch":class extends hi.Element{constructor(){super(nn,"slostudyspots:history","slostudyspots:auth")}},"study-spots-header":vt,"profile-view":et,"login-view":ae,"register-view":tn,"home-view":jt});
