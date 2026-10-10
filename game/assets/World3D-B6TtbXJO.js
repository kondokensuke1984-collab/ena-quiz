var sp=Object.defineProperty;var op=(n,e,t)=>e in n?sp(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var Te=(n,e,t)=>op(n,typeof e!="symbol"?e+"":e,t);import{r as Yt,M as $i,B as Kc,D as jo,S as Zc,F as cs,p as ap,a as lp,b as Jc,c as ei,d as cr,e as lo,h as cp,j as Gn,P as up,f as hp,g as fp,i as dp,k as pp,K as mp,E as gp,I as _p}from"./index-WOZD5Kwd.js";var Er={};/**
 * @license React
 * react-dom-server-legacy.browser.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var hf=Yt;function We(n){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+n,t=1;t<arguments.length;t++)e+="&args[]="+encodeURIComponent(arguments[t]);return"Minified React error #"+n+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var rn=Object.prototype.hasOwnProperty,vp=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Qc={},eu={};function ff(n){return rn.call(eu,n)?!0:rn.call(Qc,n)?!1:vp.test(n)?eu[n]=!0:(Qc[n]=!0,!1)}function Jt(n,e,t,i,r,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=t,this.propertyName=n,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var Vt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){Vt[n]=new Jt(n,0,!1,n,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var e=n[0];Vt[e]=new Jt(e,1,!1,n[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(n){Vt[n]=new Jt(n,2,!1,n.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){Vt[n]=new Jt(n,2,!1,n,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){Vt[n]=new Jt(n,3,!1,n.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(n){Vt[n]=new Jt(n,3,!0,n,null,!1,!1)});["capture","download"].forEach(function(n){Vt[n]=new Jt(n,4,!1,n,null,!1,!1)});["cols","rows","size","span"].forEach(function(n){Vt[n]=new Jt(n,6,!1,n,null,!1,!1)});["rowSpan","start"].forEach(function(n){Vt[n]=new Jt(n,5,!1,n.toLowerCase(),null,!1,!1)});var ec=/[\-:]([a-z])/g;function tc(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var e=n.replace(ec,tc);Vt[e]=new Jt(e,1,!1,n,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var e=n.replace(ec,tc);Vt[e]=new Jt(e,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(n){var e=n.replace(ec,tc);Vt[e]=new Jt(e,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(n){Vt[n]=new Jt(n,1,!1,n.toLowerCase(),null,!1,!1)});Vt.xlinkHref=new Jt("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(n){Vt[n]=new Jt(n,1,!1,n.toLowerCase(),null,!0,!0)});var Xs={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},xp=["Webkit","ms","Moz","O"];Object.keys(Xs).forEach(function(n){xp.forEach(function(e){e=e+n.charAt(0).toUpperCase()+n.substring(1),Xs[e]=Xs[n]})});var yp=/["'&<>]/;function Kt(n){if(typeof n=="boolean"||typeof n=="number")return""+n;n=""+n;var e=yp.exec(n);if(e){var t="",i,r=0;for(i=e.index;i<n.length;i++){switch(n.charCodeAt(i)){case 34:e="&quot;";break;case 38:e="&amp;";break;case 39:e="&#x27;";break;case 60:e="&lt;";break;case 62:e="&gt;";break;default:continue}r!==i&&(t+=n.substring(r,i)),r=i+1,t+=e}n=r!==i?t+n.substring(r,i):t}return n}var Sp=/([A-Z])/g,Mp=/^ms-/,Ka=Array.isArray;function On(n,e){return{insertionMode:n,selectedValue:e}}function Ep(n,e,t){switch(e){case"select":return On(1,t.value!=null?t.value:t.defaultValue);case"svg":return On(2,null);case"math":return On(3,null);case"foreignObject":return On(1,null);case"table":return On(4,null);case"thead":case"tbody":case"tfoot":return On(5,null);case"colgroup":return On(7,null);case"tr":return On(6,null)}return 4<=n.insertionMode||n.insertionMode===0?On(1,null):n}var tu=new Map;function df(n,e,t){if(typeof t!="object")throw Error(We(62));e=!0;for(var i in t)if(rn.call(t,i)){var r=t[i];if(r!=null&&typeof r!="boolean"&&r!==""){if(i.indexOf("--")===0){var s=Kt(i);r=Kt((""+r).trim())}else{s=i;var o=tu.get(s);o!==void 0||(o=Kt(s.replace(Sp,"-$1").toLowerCase().replace(Mp,"-ms-")),tu.set(s,o)),s=o,r=typeof r=="number"?r===0||rn.call(Xs,i)?""+r:r+"px":Kt((""+r).trim())}e?(e=!1,n.push(' style="',s,":",r)):n.push(";",s,":",r)}}e||n.push('"')}function fn(n,e,t,i){switch(t){case"style":df(n,e,i);return;case"defaultValue":case"defaultChecked":case"innerHTML":case"suppressContentEditableWarning":case"suppressHydrationWarning":return}if(!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N"){if(e=Vt.hasOwnProperty(t)?Vt[t]:null,e!==null){switch(typeof i){case"function":case"symbol":return;case"boolean":if(!e.acceptsBooleans)return}switch(t=e.attributeName,e.type){case 3:i&&n.push(" ",t,'=""');break;case 4:i===!0?n.push(" ",t,'=""'):i!==!1&&n.push(" ",t,'="',Kt(i),'"');break;case 5:isNaN(i)||n.push(" ",t,'="',Kt(i),'"');break;case 6:!isNaN(i)&&1<=i&&n.push(" ",t,'="',Kt(i),'"');break;default:e.sanitizeURL&&(i=""+i),n.push(" ",t,'="',Kt(i),'"')}}else if(ff(t)){switch(typeof i){case"function":case"symbol":return;case"boolean":if(e=t.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-")return}n.push(" ",t,'="',Kt(i),'"')}}}function $s(n,e,t){if(e!=null){if(t!=null)throw Error(We(60));if(typeof e!="object"||!("__html"in e))throw Error(We(61));e=e.__html,e!=null&&n.push(""+e)}}function wp(n){var e="";return hf.Children.forEach(n,function(t){t!=null&&(e+=t)}),e}function Ko(n,e,t,i){n.push(Rn(t));var r=t=null,s;for(s in e)if(rn.call(e,s)){var o=e[s];if(o!=null)switch(s){case"children":t=o;break;case"dangerouslySetInnerHTML":r=o;break;default:fn(n,i,s,o)}}return n.push(">"),$s(n,r,t),typeof t=="string"?(n.push(Kt(t)),null):t}var bp=/^[a-zA-Z][a-zA-Z:_\.\-\d]*$/,nu=new Map;function Rn(n){var e=nu.get(n);if(e===void 0){if(!bp.test(n))throw Error(We(65,n));e="<"+n,nu.set(n,e)}return e}function Tp(n,e,t,i,r){switch(e){case"select":n.push(Rn("select"));var s=null,o=null;for(u in t)if(rn.call(t,u)){var a=t[u];if(a!=null)switch(u){case"children":s=a;break;case"dangerouslySetInnerHTML":o=a;break;case"defaultValue":case"value":break;default:fn(n,i,u,a)}}return n.push(">"),$s(n,o,s),s;case"option":o=r.selectedValue,n.push(Rn("option"));var l=a=null,c=null,u=null;for(s in t)if(rn.call(t,s)){var h=t[s];if(h!=null)switch(s){case"children":a=h;break;case"selected":c=h;break;case"dangerouslySetInnerHTML":u=h;break;case"value":l=h;default:fn(n,i,s,h)}}if(o!=null)if(t=l!==null?""+l:wp(a),Ka(o)){for(i=0;i<o.length;i++)if(""+o[i]===t){n.push(' selected=""');break}}else""+o===t&&n.push(' selected=""');else c&&n.push(' selected=""');return n.push(">"),$s(n,u,a),a;case"textarea":n.push(Rn("textarea")),u=o=s=null;for(a in t)if(rn.call(t,a)&&(l=t[a],l!=null))switch(a){case"children":u=l;break;case"value":s=l;break;case"defaultValue":o=l;break;case"dangerouslySetInnerHTML":throw Error(We(91));default:fn(n,i,a,l)}if(s===null&&o!==null&&(s=o),n.push(">"),u!=null){if(s!=null)throw Error(We(92));if(Ka(u)&&1<u.length)throw Error(We(93));s=""+u}return typeof s=="string"&&s[0]===`
`&&n.push(`
`),s!==null&&n.push(Kt(""+s)),null;case"input":n.push(Rn("input")),l=u=a=s=null;for(o in t)if(rn.call(t,o)&&(c=t[o],c!=null))switch(o){case"children":case"dangerouslySetInnerHTML":throw Error(We(399,"input"));case"defaultChecked":l=c;break;case"defaultValue":a=c;break;case"checked":u=c;break;case"value":s=c;break;default:fn(n,i,o,c)}return u!==null?fn(n,i,"checked",u):l!==null&&fn(n,i,"checked",l),s!==null?fn(n,i,"value",s):a!==null&&fn(n,i,"value",a),n.push("/>"),null;case"menuitem":n.push(Rn("menuitem"));for(var p in t)if(rn.call(t,p)&&(s=t[p],s!=null))switch(p){case"children":case"dangerouslySetInnerHTML":throw Error(We(400));default:fn(n,i,p,s)}return n.push(">"),null;case"title":n.push(Rn("title")),s=null;for(h in t)if(rn.call(t,h)&&(o=t[h],o!=null))switch(h){case"children":s=o;break;case"dangerouslySetInnerHTML":throw Error(We(434));default:fn(n,i,h,o)}return n.push(">"),s;case"listing":case"pre":n.push(Rn(e)),o=s=null;for(l in t)if(rn.call(t,l)&&(a=t[l],a!=null))switch(l){case"children":s=a;break;case"dangerouslySetInnerHTML":o=a;break;default:fn(n,i,l,a)}if(n.push(">"),o!=null){if(s!=null)throw Error(We(60));if(typeof o!="object"||!("__html"in o))throw Error(We(61));t=o.__html,t!=null&&(typeof t=="string"&&0<t.length&&t[0]===`
`?n.push(`
`,t):n.push(""+t))}return typeof s=="string"&&s[0]===`
`&&n.push(`
`),s;case"area":case"base":case"br":case"col":case"embed":case"hr":case"img":case"keygen":case"link":case"meta":case"param":case"source":case"track":case"wbr":n.push(Rn(e));for(var f in t)if(rn.call(t,f)&&(s=t[f],s!=null))switch(f){case"children":case"dangerouslySetInnerHTML":throw Error(We(399,e));default:fn(n,i,f,s)}return n.push("/>"),null;case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return Ko(n,t,e,i);case"html":return r.insertionMode===0&&n.push("<!DOCTYPE html>"),Ko(n,t,e,i);default:if(e.indexOf("-")===-1&&typeof t.is!="string")return Ko(n,t,e,i);n.push(Rn(e)),o=s=null;for(c in t)if(rn.call(t,c)&&(a=t[c],a!=null))switch(c){case"children":s=a;break;case"dangerouslySetInnerHTML":o=a;break;case"style":df(n,i,a);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":break;default:ff(c)&&typeof a!="function"&&typeof a!="symbol"&&n.push(" ",c,'="',Kt(a),'"')}return n.push(">"),$s(n,o,s),s}}function iu(n,e,t){if(n.push('<!--$?--><template id="'),t===null)throw Error(We(395));return n.push(t),n.push('"></template>')}function Ap(n,e,t,i){switch(t.insertionMode){case 0:case 1:return n.push('<div hidden id="'),n.push(e.segmentPrefix),e=i.toString(16),n.push(e),n.push('">');case 2:return n.push('<svg aria-hidden="true" style="display:none" id="'),n.push(e.segmentPrefix),e=i.toString(16),n.push(e),n.push('">');case 3:return n.push('<math aria-hidden="true" style="display:none" id="'),n.push(e.segmentPrefix),e=i.toString(16),n.push(e),n.push('">');case 4:return n.push('<table hidden id="'),n.push(e.segmentPrefix),e=i.toString(16),n.push(e),n.push('">');case 5:return n.push('<table hidden><tbody id="'),n.push(e.segmentPrefix),e=i.toString(16),n.push(e),n.push('">');case 6:return n.push('<table hidden><tr id="'),n.push(e.segmentPrefix),e=i.toString(16),n.push(e),n.push('">');case 7:return n.push('<table hidden><colgroup id="'),n.push(e.segmentPrefix),e=i.toString(16),n.push(e),n.push('">');default:throw Error(We(397))}}function Cp(n,e){switch(e.insertionMode){case 0:case 1:return n.push("</div>");case 2:return n.push("</svg>");case 3:return n.push("</math>");case 4:return n.push("</table>");case 5:return n.push("</tbody></table>");case 6:return n.push("</tr></table>");case 7:return n.push("</colgroup></table>");default:throw Error(We(397))}}var Rp=/[<\u2028\u2029]/g;function Zo(n){return JSON.stringify(n).replace(Rp,function(e){switch(e){case"<":return"\\u003c";case"\u2028":return"\\u2028";case"\u2029":return"\\u2029";default:throw Error("escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React")}})}function Pp(n,e){return e=e===void 0?"":e,{bootstrapChunks:[],startInlineScript:"<script>",placeholderPrefix:e+"P:",segmentPrefix:e+"S:",boundaryPrefix:e+"B:",idPrefix:e,nextSuspenseID:0,sentCompleteSegmentFunction:!1,sentCompleteBoundaryFunction:!1,sentClientRenderFunction:!1,generateStaticMarkup:n}}function ru(n,e,t,i){return t.generateStaticMarkup?(n.push(Kt(e)),!1):(e===""?n=i:(i&&n.push("<!-- -->"),n.push(Kt(e)),n=!0),n)}var qr=Object.assign,Lp=Symbol.for("react.element"),pf=Symbol.for("react.portal"),mf=Symbol.for("react.fragment"),gf=Symbol.for("react.strict_mode"),_f=Symbol.for("react.profiler"),vf=Symbol.for("react.provider"),xf=Symbol.for("react.context"),yf=Symbol.for("react.forward_ref"),Sf=Symbol.for("react.suspense"),Mf=Symbol.for("react.suspense_list"),Ef=Symbol.for("react.memo"),nc=Symbol.for("react.lazy"),Ip=Symbol.for("react.scope"),Dp=Symbol.for("react.debug_trace_mode"),Up=Symbol.for("react.legacy_hidden"),Np=Symbol.for("react.default_value"),su=Symbol.iterator;function Za(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case mf:return"Fragment";case pf:return"Portal";case _f:return"Profiler";case gf:return"StrictMode";case Sf:return"Suspense";case Mf:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case xf:return(n.displayName||"Context")+".Consumer";case vf:return(n._context.displayName||"Context")+".Provider";case yf:var e=n.render;return n=n.displayName,n||(n=e.displayName||e.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case Ef:return e=n.displayName||null,e!==null?e:Za(n.type)||"Memo";case nc:e=n._payload,n=n._init;try{return Za(n(e))}catch{}}return null}var wf={};function ou(n,e){if(n=n.contextTypes,!n)return wf;var t={},i;for(i in n)t[i]=e[i];return t}var Fi=null;function Po(n,e){if(n!==e){n.context._currentValue2=n.parentValue,n=n.parent;var t=e.parent;if(n===null){if(t!==null)throw Error(We(401))}else{if(t===null)throw Error(We(401));Po(n,t)}e.context._currentValue2=e.value}}function bf(n){n.context._currentValue2=n.parentValue,n=n.parent,n!==null&&bf(n)}function Tf(n){var e=n.parent;e!==null&&Tf(e),n.context._currentValue2=n.value}function Af(n,e){if(n.context._currentValue2=n.parentValue,n=n.parent,n===null)throw Error(We(402));n.depth===e.depth?Po(n,e):Af(n,e)}function Cf(n,e){var t=e.parent;if(t===null)throw Error(We(402));n.depth===t.depth?Po(n,t):Cf(n,t),e.context._currentValue2=e.value}function co(n){var e=Fi;e!==n&&(e===null?Tf(n):n===null?bf(e):e.depth===n.depth?Po(e,n):e.depth>n.depth?Af(e,n):Cf(e,n),Fi=n)}var au={isMounted:function(){return!1},enqueueSetState:function(n,e){n=n._reactInternals,n.queue!==null&&n.queue.push(e)},enqueueReplaceState:function(n,e){n=n._reactInternals,n.replace=!0,n.queue=[e]},enqueueForceUpdate:function(){}};function lu(n,e,t,i){var r=n.state!==void 0?n.state:null;n.updater=au,n.props=t,n.state=r;var s={queue:[],replace:!1};n._reactInternals=s;var o=e.contextType;if(n.context=typeof o=="object"&&o!==null?o._currentValue2:i,o=e.getDerivedStateFromProps,typeof o=="function"&&(o=o(t,r),r=o==null?r:qr({},r,o),n.state=r),typeof e.getDerivedStateFromProps!="function"&&typeof n.getSnapshotBeforeUpdate!="function"&&(typeof n.UNSAFE_componentWillMount=="function"||typeof n.componentWillMount=="function"))if(e=n.state,typeof n.componentWillMount=="function"&&n.componentWillMount(),typeof n.UNSAFE_componentWillMount=="function"&&n.UNSAFE_componentWillMount(),e!==n.state&&au.enqueueReplaceState(n,n.state,null),s.queue!==null&&0<s.queue.length)if(e=s.queue,o=s.replace,s.queue=null,s.replace=!1,o&&e.length===1)n.state=e[0];else{for(s=o?e[0]:n.state,r=!0,o=o?1:0;o<e.length;o++){var a=e[o];a=typeof a=="function"?a.call(n,s,t,i):a,a!=null&&(r?(r=!1,s=qr({},s,a)):qr(s,a))}n.state=s}else s.queue=null}var Fp={id:1,overflow:""};function Ja(n,e,t){var i=n.id;n=n.overflow;var r=32-qs(i)-1;i&=~(1<<r),t+=1;var s=32-qs(e)+r;if(30<s){var o=r-r%5;return s=(i&(1<<o)-1).toString(32),i>>=o,r-=o,{id:1<<32-qs(e)+r|t<<r|i,overflow:s+n}}return{id:1<<s|t<<r|i,overflow:n}}var qs=Math.clz32?Math.clz32:zp,Op=Math.log,Bp=Math.LN2;function zp(n){return n>>>=0,n===0?32:31-(Op(n)/Bp|0)|0}function kp(n,e){return n===e&&(n!==0||1/n===1/e)||n!==n&&e!==e}var Hp=typeof Object.is=="function"?Object.is:kp,Yn=null,ic=null,Ys=null,pt=null,Vr=!1,uo=!1,Zr=0,pi=null,Lo=0;function Li(){if(Yn===null)throw Error(We(321));return Yn}function cu(){if(0<Lo)throw Error(We(312));return{memoizedState:null,queue:null,next:null}}function rc(){return pt===null?Ys===null?(Vr=!1,Ys=pt=cu()):(Vr=!0,pt=Ys):pt.next===null?(Vr=!1,pt=pt.next=cu()):(Vr=!0,pt=pt.next),pt}function sc(){ic=Yn=null,uo=!1,Ys=null,Lo=0,pt=pi=null}function Rf(n,e){return typeof e=="function"?e(n):e}function uu(n,e,t){if(Yn=Li(),pt=rc(),Vr){var i=pt.queue;if(e=i.dispatch,pi!==null&&(t=pi.get(i),t!==void 0)){pi.delete(i),i=pt.memoizedState;do i=n(i,t.action),t=t.next;while(t!==null);return pt.memoizedState=i,[i,e]}return[pt.memoizedState,e]}return n=n===Rf?typeof e=="function"?e():e:t!==void 0?t(e):e,pt.memoizedState=n,n=pt.queue={last:null,dispatch:null},n=n.dispatch=Vp.bind(null,Yn,n),[pt.memoizedState,n]}function hu(n,e){if(Yn=Li(),pt=rc(),e=e===void 0?null:e,pt!==null){var t=pt.memoizedState;if(t!==null&&e!==null){var i=t[1];e:if(i===null)i=!1;else{for(var r=0;r<i.length&&r<e.length;r++)if(!Hp(e[r],i[r])){i=!1;break e}i=!0}if(i)return t[0]}}return n=n(),pt.memoizedState=[n,e],n}function Vp(n,e,t){if(25<=Lo)throw Error(We(301));if(n===Yn)if(uo=!0,n={action:t,next:null},pi===null&&(pi=new Map),t=pi.get(e),t===void 0)pi.set(e,n);else{for(e=t;e.next!==null;)e=e.next;e.next=n}}function Gp(){throw Error(We(394))}function us(){}var fu={readContext:function(n){return n._currentValue2},useContext:function(n){return Li(),n._currentValue2},useMemo:hu,useReducer:uu,useRef:function(n){Yn=Li(),pt=rc();var e=pt.memoizedState;return e===null?(n={current:n},pt.memoizedState=n):e},useState:function(n){return uu(Rf,n)},useInsertionEffect:us,useLayoutEffect:function(){},useCallback:function(n,e){return hu(function(){return n},e)},useImperativeHandle:us,useEffect:us,useDebugValue:us,useDeferredValue:function(n){return Li(),n},useTransition:function(){return Li(),[!1,Gp]},useId:function(){var n=ic.treeContext,e=n.overflow;n=n.id,n=(n&~(1<<32-qs(n)-1)).toString(32)+e;var t=js;if(t===null)throw Error(We(404));return e=Zr++,n=":"+t.idPrefix+"R"+n,0<e&&(n+="H"+e.toString(32)),n+":"},useMutableSource:function(n,e){return Li(),e(n._source)},useSyncExternalStore:function(n,e,t){if(t===void 0)throw Error(We(407));return t()}},js=null,Jo=hf.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher;function Wp(n){return console.error(n),null}function Gr(){}function Xp(n,e,t,i,r,s,o,a,l){var c=[],u=new Set;return e={destination:null,responseState:e,progressiveChunkSize:i===void 0?12800:i,status:0,fatalError:null,nextSegmentId:0,allPendingTasks:0,pendingRootTasks:0,completedRootSegment:null,abortableTasks:u,pingedTasks:c,clientRenderedBoundaries:[],completedBoundaries:[],partialBoundaries:[],onError:r===void 0?Wp:r,onAllReady:Gr,onShellReady:o===void 0?Gr:o,onShellError:Gr,onFatalError:Gr},t=ho(e,0,null,t,!1,!1),t.parentFlushed=!0,n=oc(e,n,null,t,u,wf,null,Fp),c.push(n),e}function oc(n,e,t,i,r,s,o,a){n.allPendingTasks++,t===null?n.pendingRootTasks++:t.pendingTasks++;var l={node:e,ping:function(){var c=n.pingedTasks;c.push(l),c.length===1&&If(n)},blockedBoundary:t,blockedSegment:i,abortSet:r,legacyContext:s,context:o,treeContext:a};return r.add(l),l}function ho(n,e,t,i,r,s){return{status:0,id:-1,index:e,parentFlushed:!1,chunks:[],children:[],formatContext:i,boundary:t,lastPushedText:r,textEmbedded:s}}function Jr(n,e){if(n=n.onError(e),n!=null&&typeof n!="string")throw Error('onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "'+typeof n+'" instead');return n}function fo(n,e){var t=n.onShellError;t(e),t=n.onFatalError,t(e),n.destination!==null?(n.status=2,n.destination.destroy(e)):(n.status=1,n.fatalError=e)}function du(n,e,t,i,r){for(Yn={},ic=e,Zr=0,n=t(i,r);uo;)uo=!1,Zr=0,Lo+=1,pt=null,n=t(i,r);return sc(),n}function pu(n,e,t,i){var r=t.render(),s=i.childContextTypes;if(s!=null){var o=e.legacyContext;if(typeof t.getChildContext!="function")i=o;else{t=t.getChildContext();for(var a in t)if(!(a in s))throw Error(We(108,Za(i)||"Unknown",a));i=qr({},o,t)}e.legacyContext=i,pn(n,e,r),e.legacyContext=o}else pn(n,e,r)}function mu(n,e){if(n&&n.defaultProps){e=qr({},e),n=n.defaultProps;for(var t in n)e[t]===void 0&&(e[t]=n[t]);return e}return e}function Qa(n,e,t,i,r){if(typeof t=="function")if(t.prototype&&t.prototype.isReactComponent){r=ou(t,e.legacyContext);var s=t.contextType;s=new t(i,typeof s=="object"&&s!==null?s._currentValue2:r),lu(s,t,i,r),pu(n,e,s,t)}else{s=ou(t,e.legacyContext),r=du(n,e,t,i,s);var o=Zr!==0;if(typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0)lu(r,t,i,s),pu(n,e,r,t);else if(o){i=e.treeContext,e.treeContext=Ja(i,1,0);try{pn(n,e,r)}finally{e.treeContext=i}}else pn(n,e,r)}else if(typeof t=="string"){switch(r=e.blockedSegment,s=Tp(r.chunks,t,i,n.responseState,r.formatContext),r.lastPushedText=!1,o=r.formatContext,r.formatContext=Ep(o,t,i),el(n,e,s),r.formatContext=o,t){case"area":case"base":case"br":case"col":case"embed":case"hr":case"img":case"input":case"keygen":case"link":case"meta":case"param":case"source":case"track":case"wbr":break;default:r.chunks.push("</",t,">")}r.lastPushedText=!1}else{switch(t){case Up:case Dp:case gf:case _f:case mf:pn(n,e,i.children);return;case Mf:pn(n,e,i.children);return;case Ip:throw Error(We(343));case Sf:e:{t=e.blockedBoundary,r=e.blockedSegment,s=i.fallback,i=i.children,o=new Set;var a={id:null,rootSegmentID:-1,parentFlushed:!1,pendingTasks:0,forceClientRender:!1,completedSegments:[],byteSize:0,fallbackAbortableTasks:o,errorDigest:null},l=ho(n,r.chunks.length,a,r.formatContext,!1,!1);r.children.push(l),r.lastPushedText=!1;var c=ho(n,0,null,r.formatContext,!1,!1);c.parentFlushed=!0,e.blockedBoundary=a,e.blockedSegment=c;try{if(el(n,e,i),n.responseState.generateStaticMarkup||c.lastPushedText&&c.textEmbedded&&c.chunks.push("<!-- -->"),c.status=1,po(a,c),a.pendingTasks===0)break e}catch(u){c.status=4,a.forceClientRender=!0,a.errorDigest=Jr(n,u)}finally{e.blockedBoundary=t,e.blockedSegment=r}e=oc(n,s,t,l,o,e.legacyContext,e.context,e.treeContext),n.pingedTasks.push(e)}return}if(typeof t=="object"&&t!==null)switch(t.$$typeof){case yf:if(i=du(n,e,t.render,i,r),Zr!==0){t=e.treeContext,e.treeContext=Ja(t,1,0);try{pn(n,e,i)}finally{e.treeContext=t}}else pn(n,e,i);return;case Ef:t=t.type,i=mu(t,i),Qa(n,e,t,i,r);return;case vf:if(r=i.children,t=t._context,i=i.value,s=t._currentValue2,t._currentValue2=i,o=Fi,Fi=i={parent:o,depth:o===null?0:o.depth+1,context:t,parentValue:s,value:i},e.context=i,pn(n,e,r),n=Fi,n===null)throw Error(We(403));i=n.parentValue,n.context._currentValue2=i===Np?n.context._defaultValue:i,n=Fi=n.parent,e.context=n;return;case xf:i=i.children,i=i(t._currentValue2),pn(n,e,i);return;case nc:r=t._init,t=r(t._payload),i=mu(t,i),Qa(n,e,t,i,void 0);return}throw Error(We(130,t==null?t:typeof t,""))}}function pn(n,e,t){if(e.node=t,typeof t=="object"&&t!==null){switch(t.$$typeof){case Lp:Qa(n,e,t.type,t.props,t.ref);return;case pf:throw Error(We(257));case nc:var i=t._init;t=i(t._payload),pn(n,e,t);return}if(Ka(t)){gu(n,e,t);return}if(t===null||typeof t!="object"?i=null:(i=su&&t[su]||t["@@iterator"],i=typeof i=="function"?i:null),i&&(i=i.call(t))){if(t=i.next(),!t.done){var r=[];do r.push(t.value),t=i.next();while(!t.done);gu(n,e,r)}return}throw n=Object.prototype.toString.call(t),Error(We(31,n==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":n))}typeof t=="string"?(i=e.blockedSegment,i.lastPushedText=ru(e.blockedSegment.chunks,t,n.responseState,i.lastPushedText)):typeof t=="number"&&(i=e.blockedSegment,i.lastPushedText=ru(e.blockedSegment.chunks,""+t,n.responseState,i.lastPushedText))}function gu(n,e,t){for(var i=t.length,r=0;r<i;r++){var s=e.treeContext;e.treeContext=Ja(s,i,r);try{el(n,e,t[r])}finally{e.treeContext=s}}}function el(n,e,t){var i=e.blockedSegment.formatContext,r=e.legacyContext,s=e.context;try{return pn(n,e,t)}catch(l){if(sc(),typeof l=="object"&&l!==null&&typeof l.then=="function"){t=l;var o=e.blockedSegment,a=ho(n,o.chunks.length,null,o.formatContext,o.lastPushedText,!0);o.children.push(a),o.lastPushedText=!1,n=oc(n,e.node,e.blockedBoundary,a,e.abortSet,e.legacyContext,e.context,e.treeContext).ping,t.then(n,n),e.blockedSegment.formatContext=i,e.legacyContext=r,e.context=s,co(s)}else throw e.blockedSegment.formatContext=i,e.legacyContext=r,e.context=s,co(s),l}}function $p(n){var e=n.blockedBoundary;n=n.blockedSegment,n.status=3,Lf(this,e,n)}function Pf(n,e,t){var i=n.blockedBoundary;n.blockedSegment.status=3,i===null?(e.allPendingTasks--,e.status!==2&&(e.status=2,e.destination!==null&&e.destination.push(null))):(i.pendingTasks--,i.forceClientRender||(i.forceClientRender=!0,n=t===void 0?Error(We(432)):t,i.errorDigest=e.onError(n),i.parentFlushed&&e.clientRenderedBoundaries.push(i)),i.fallbackAbortableTasks.forEach(function(r){return Pf(r,e,t)}),i.fallbackAbortableTasks.clear(),e.allPendingTasks--,e.allPendingTasks===0&&(i=e.onAllReady,i()))}function po(n,e){if(e.chunks.length===0&&e.children.length===1&&e.children[0].boundary===null){var t=e.children[0];t.id=e.id,t.parentFlushed=!0,t.status===1&&po(n,t)}else n.completedSegments.push(e)}function Lf(n,e,t){if(e===null){if(t.parentFlushed){if(n.completedRootSegment!==null)throw Error(We(389));n.completedRootSegment=t}n.pendingRootTasks--,n.pendingRootTasks===0&&(n.onShellError=Gr,e=n.onShellReady,e())}else e.pendingTasks--,e.forceClientRender||(e.pendingTasks===0?(t.parentFlushed&&t.status===1&&po(e,t),e.parentFlushed&&n.completedBoundaries.push(e),e.fallbackAbortableTasks.forEach($p,n),e.fallbackAbortableTasks.clear()):t.parentFlushed&&t.status===1&&(po(e,t),e.completedSegments.length===1&&e.parentFlushed&&n.partialBoundaries.push(e)));n.allPendingTasks--,n.allPendingTasks===0&&(n=n.onAllReady,n())}function If(n){if(n.status!==2){var e=Fi,t=Jo.current;Jo.current=fu;var i=js;js=n.responseState;try{var r=n.pingedTasks,s;for(s=0;s<r.length;s++){var o=r[s],a=n,l=o.blockedSegment;if(l.status===0){co(o.context);try{pn(a,o,o.node),a.responseState.generateStaticMarkup||l.lastPushedText&&l.textEmbedded&&l.chunks.push("<!-- -->"),o.abortSet.delete(o),l.status=1,Lf(a,o.blockedBoundary,l)}catch(g){if(sc(),typeof g=="object"&&g!==null&&typeof g.then=="function"){var c=o.ping;g.then(c,c)}else{o.abortSet.delete(o),l.status=4;var u=o.blockedBoundary,h=g,p=Jr(a,h);if(u===null?fo(a,h):(u.pendingTasks--,u.forceClientRender||(u.forceClientRender=!0,u.errorDigest=p,u.parentFlushed&&a.clientRenderedBoundaries.push(u))),a.allPendingTasks--,a.allPendingTasks===0){var f=a.onAllReady;f()}}}finally{}}}r.splice(0,s),n.destination!==null&&ac(n,n.destination)}catch(g){Jr(n,g),fo(n,g)}finally{js=i,Jo.current=t,t===fu&&co(e)}}}function hs(n,e,t){switch(t.parentFlushed=!0,t.status){case 0:var i=t.id=n.nextSegmentId++;return t.lastPushedText=!1,t.textEmbedded=!1,n=n.responseState,e.push('<template id="'),e.push(n.placeholderPrefix),n=i.toString(16),e.push(n),e.push('"></template>');case 1:t.status=2;var r=!0;i=t.chunks;var s=0;t=t.children;for(var o=0;o<t.length;o++){for(r=t[o];s<r.index;s++)e.push(i[s]);r=Io(n,e,r)}for(;s<i.length-1;s++)e.push(i[s]);return s<i.length&&(r=e.push(i[s])),r;default:throw Error(We(390))}}function Io(n,e,t){var i=t.boundary;if(i===null)return hs(n,e,t);if(i.parentFlushed=!0,i.forceClientRender)return n.responseState.generateStaticMarkup||(i=i.errorDigest,e.push("<!--$!-->"),e.push("<template"),i&&(e.push(' data-dgst="'),i=Kt(i),e.push(i),e.push('"')),e.push("></template>")),hs(n,e,t),n=n.responseState.generateStaticMarkup?!0:e.push("<!--/$-->"),n;if(0<i.pendingTasks){i.rootSegmentID=n.nextSegmentId++,0<i.completedSegments.length&&n.partialBoundaries.push(i);var r=n.responseState,s=r.nextSuspenseID++;return r=r.boundaryPrefix+s.toString(16),i=i.id=r,iu(e,n.responseState,i),hs(n,e,t),e.push("<!--/$-->")}if(i.byteSize>n.progressiveChunkSize)return i.rootSegmentID=n.nextSegmentId++,n.completedBoundaries.push(i),iu(e,n.responseState,i.id),hs(n,e,t),e.push("<!--/$-->");if(n.responseState.generateStaticMarkup||e.push("<!--$-->"),t=i.completedSegments,t.length!==1)throw Error(We(391));return Io(n,e,t[0]),n=n.responseState.generateStaticMarkup?!0:e.push("<!--/$-->"),n}function _u(n,e,t){return Ap(e,n.responseState,t.formatContext,t.id),Io(n,e,t),Cp(e,t.formatContext)}function vu(n,e,t){for(var i=t.completedSegments,r=0;r<i.length;r++)Df(n,e,t,i[r]);if(i.length=0,n=n.responseState,i=t.id,t=t.rootSegmentID,e.push(n.startInlineScript),n.sentCompleteBoundaryFunction?e.push('$RC("'):(n.sentCompleteBoundaryFunction=!0,e.push('function $RC(a,b){a=document.getElementById(a);b=document.getElementById(b);b.parentNode.removeChild(b);if(a){a=a.previousSibling;var f=a.parentNode,c=a.nextSibling,e=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d)if(0===e)break;else e--;else"$"!==d&&"$?"!==d&&"$!"!==d||e++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;b.firstChild;)f.insertBefore(b.firstChild,c);a.data="$";a._reactRetry&&a._reactRetry()}};$RC("')),i===null)throw Error(We(395));return t=t.toString(16),e.push(i),e.push('","'),e.push(n.segmentPrefix),e.push(t),e.push('")<\/script>')}function Df(n,e,t,i){if(i.status===2)return!0;var r=i.id;if(r===-1){if((i.id=t.rootSegmentID)===-1)throw Error(We(392));return _u(n,e,i)}return _u(n,e,i),n=n.responseState,e.push(n.startInlineScript),n.sentCompleteSegmentFunction?e.push('$RS("'):(n.sentCompleteSegmentFunction=!0,e.push('function $RS(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS("')),e.push(n.segmentPrefix),r=r.toString(16),e.push(r),e.push('","'),e.push(n.placeholderPrefix),e.push(r),e.push('")<\/script>')}function ac(n,e){try{var t=n.completedRootSegment;if(t!==null&&n.pendingRootTasks===0){Io(n,e,t),n.completedRootSegment=null;var i=n.responseState.bootstrapChunks;for(t=0;t<i.length-1;t++)e.push(i[t]);t<i.length&&e.push(i[t])}var r=n.clientRenderedBoundaries,s;for(s=0;s<r.length;s++){var o=r[s];i=e;var a=n.responseState,l=o.id,c=o.errorDigest,u=o.errorMessage,h=o.errorComponentStack;if(i.push(a.startInlineScript),a.sentClientRenderFunction?i.push('$RX("'):(a.sentClientRenderFunction=!0,i.push('function $RX(b,c,d,e){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),b._reactRetry&&b._reactRetry())};$RX("')),l===null)throw Error(We(395));if(i.push(l),i.push('"'),c||u||h){i.push(",");var p=Zo(c||"");i.push(p)}if(u||h){i.push(",");var f=Zo(u||"");i.push(f)}if(h){i.push(",");var g=Zo(h);i.push(g)}if(!i.push(")<\/script>")){n.destination=null,s++,r.splice(0,s);return}}r.splice(0,s);var _=n.completedBoundaries;for(s=0;s<_.length;s++)if(!vu(n,e,_[s])){n.destination=null,s++,_.splice(0,s);return}_.splice(0,s);var d=n.partialBoundaries;for(s=0;s<d.length;s++){var m=d[s];e:{r=n,o=e;var v=m.completedSegments;for(a=0;a<v.length;a++)if(!Df(r,o,m,v[a])){a++,v.splice(0,a);var x=!1;break e}v.splice(0,a),x=!0}if(!x){n.destination=null,s++,d.splice(0,s);return}}d.splice(0,s);var S=n.completedBoundaries;for(s=0;s<S.length;s++)if(!vu(n,e,S[s])){n.destination=null,s++,S.splice(0,s);return}S.splice(0,s)}finally{n.allPendingTasks===0&&n.pingedTasks.length===0&&n.clientRenderedBoundaries.length===0&&n.completedBoundaries.length===0&&e.push(null)}}function qp(n,e){try{var t=n.abortableTasks;t.forEach(function(i){return Pf(i,n,e)}),t.clear(),n.destination!==null&&ac(n,n.destination)}catch(i){Jr(n,i),fo(n,i)}}function Yp(){}function Uf(n,e,t,i){var r=!1,s=null,o="",a={push:function(c){return c!==null&&(o+=c),!0},destroy:function(c){r=!0,s=c}},l=!1;if(n=Xp(n,Pp(t,e?e.identifierPrefix:void 0),{insertionMode:1,selectedValue:null},1/0,Yp,void 0,function(){l=!0}),If(n),qp(n,i),n.status===1)n.status=2,a.destroy(n.fatalError);else if(n.status!==2&&n.destination===null){n.destination=a;try{ac(n,a)}catch(c){Jr(n,c),fo(n,c)}}if(r)throw s;if(!l)throw Error(We(426));return o}Er.renderToNodeStream=function(){throw Error(We(207))};Er.renderToStaticMarkup=function(n,e){return Uf(n,e,!0,'The server used "renderToStaticMarkup" which does not support Suspense. If you intended to have the server wait for the suspended component please switch to "renderToReadableStream" which supports Suspense on the server')};Er.renderToStaticNodeStream=function(){throw Error(We(208))};Er.renderToString=function(n,e){return Uf(n,e,!1,'The server used "renderToString" which does not support Suspense. If you intended for this Suspense boundary to render the fallback content on the server consider throwing an Error somewhere within the Suspense boundary. If you intended to have the server wait for the suspended component please switch to "renderToReadableStream" which supports Suspense on the server')};Er.version="18.3.1";var lc={};/**
 * @license React
 * react-dom-server.browser.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Nf=Yt;function je(n){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+n,t=1;t<arguments.length;t++)e+="&args[]="+encodeURIComponent(arguments[t]);return"Minified React error #"+n+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var mn=null,gn=0;function Ae(n,e){if(e.length!==0)if(512<e.length)0<gn&&(n.enqueue(new Uint8Array(mn.buffer,0,gn)),mn=new Uint8Array(512),gn=0),n.enqueue(e);else{var t=mn.length-gn;t<e.length&&(t===0?n.enqueue(mn):(mn.set(e.subarray(0,t),gn),n.enqueue(mn),e=e.subarray(t)),mn=new Uint8Array(512),gn=0),mn.set(e,gn),gn+=e.length}}function xt(n,e){return Ae(n,e),!0}function xu(n){mn&&0<gn&&(n.enqueue(new Uint8Array(mn.buffer,0,gn)),mn=null,gn=0)}var Ff=new TextEncoder;function Ze(n){return Ff.encode(n)}function me(n){return Ff.encode(n)}function Of(n,e){typeof n.error=="function"?n.error(e):n.close()}var sn=Object.prototype.hasOwnProperty,jp=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,yu={},Su={};function Bf(n){return sn.call(Su,n)?!0:sn.call(yu,n)?!1:jp.test(n)?Su[n]=!0:(yu[n]=!0,!1)}function Qt(n,e,t,i,r,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=t,this.propertyName=n,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var Gt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){Gt[n]=new Qt(n,0,!1,n,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var e=n[0];Gt[e]=new Qt(e,1,!1,n[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(n){Gt[n]=new Qt(n,2,!1,n.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){Gt[n]=new Qt(n,2,!1,n,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){Gt[n]=new Qt(n,3,!1,n.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(n){Gt[n]=new Qt(n,3,!0,n,null,!1,!1)});["capture","download"].forEach(function(n){Gt[n]=new Qt(n,4,!1,n,null,!1,!1)});["cols","rows","size","span"].forEach(function(n){Gt[n]=new Qt(n,6,!1,n,null,!1,!1)});["rowSpan","start"].forEach(function(n){Gt[n]=new Qt(n,5,!1,n.toLowerCase(),null,!1,!1)});var cc=/[\-:]([a-z])/g;function uc(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var e=n.replace(cc,uc);Gt[e]=new Qt(e,1,!1,n,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var e=n.replace(cc,uc);Gt[e]=new Qt(e,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(n){var e=n.replace(cc,uc);Gt[e]=new Qt(e,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(n){Gt[n]=new Qt(n,1,!1,n.toLowerCase(),null,!1,!1)});Gt.xlinkHref=new Qt("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(n){Gt[n]=new Qt(n,1,!1,n.toLowerCase(),null,!0,!0)});var Ks={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Kp=["Webkit","ms","Moz","O"];Object.keys(Ks).forEach(function(n){Kp.forEach(function(e){e=e+n.charAt(0).toUpperCase()+n.substring(1),Ks[e]=Ks[n]})});var Zp=/["'&<>]/;function zt(n){if(typeof n=="boolean"||typeof n=="number")return""+n;n=""+n;var e=Zp.exec(n);if(e){var t="",i,r=0;for(i=e.index;i<n.length;i++){switch(n.charCodeAt(i)){case 34:e="&quot;";break;case 38:e="&amp;";break;case 39:e="&#x27;";break;case 60:e="&lt;";break;case 62:e="&gt;";break;default:continue}r!==i&&(t+=n.substring(r,i)),r=i+1,t+=e}n=r!==i?t+n.substring(r,i):t}return n}var Jp=/([A-Z])/g,Qp=/^ms-/,tl=Array.isArray,em=me("<script>"),tm=me("<\/script>"),nm=me('<script src="'),im=me('<script type="module" src="'),Mu=me('" async=""><\/script>'),rm=/(<\/|<)(s)(cript)/gi;function sm(n,e,t,i){return""+e+(t==="s"?"\\u0073":"\\u0053")+i}function om(n,e,t,i,r){n=n===void 0?"":n,e=e===void 0?em:me('<script nonce="'+zt(e)+'">');var s=[];if(t!==void 0&&s.push(e,Ze((""+t).replace(rm,sm)),tm),i!==void 0)for(t=0;t<i.length;t++)s.push(nm,Ze(zt(i[t])),Mu);if(r!==void 0)for(i=0;i<r.length;i++)s.push(im,Ze(zt(r[i])),Mu);return{bootstrapChunks:s,startInlineScript:e,placeholderPrefix:me(n+"P:"),segmentPrefix:me(n+"S:"),boundaryPrefix:n+"B:",idPrefix:n,nextSuspenseID:0,sentCompleteSegmentFunction:!1,sentCompleteBoundaryFunction:!1,sentClientRenderFunction:!1}}function Pn(n,e){return{insertionMode:n,selectedValue:e}}function am(n){return Pn(n==="http://www.w3.org/2000/svg"?2:n==="http://www.w3.org/1998/Math/MathML"?3:0,null)}function lm(n,e,t){switch(e){case"select":return Pn(1,t.value!=null?t.value:t.defaultValue);case"svg":return Pn(2,null);case"math":return Pn(3,null);case"foreignObject":return Pn(1,null);case"table":return Pn(4,null);case"thead":case"tbody":case"tfoot":return Pn(5,null);case"colgroup":return Pn(7,null);case"tr":return Pn(6,null)}return 4<=n.insertionMode||n.insertionMode===0?Pn(1,null):n}var hc=me("<!-- -->");function Eu(n,e,t,i){return e===""?i:(i&&n.push(hc),n.push(Ze(zt(e))),!0)}var wu=new Map,cm=me(' style="'),bu=me(":"),um=me(";");function zf(n,e,t){if(typeof t!="object")throw Error(je(62));e=!0;for(var i in t)if(sn.call(t,i)){var r=t[i];if(r!=null&&typeof r!="boolean"&&r!==""){if(i.indexOf("--")===0){var s=Ze(zt(i));r=Ze(zt((""+r).trim()))}else{s=i;var o=wu.get(s);o!==void 0||(o=me(zt(s.replace(Jp,"-$1").toLowerCase().replace(Qp,"-ms-"))),wu.set(s,o)),s=o,r=typeof r=="number"?r===0||sn.call(Ks,i)?Ze(""+r):Ze(r+"px"):Ze(zt((""+r).trim()))}e?(e=!1,n.push(cm,s,bu,r)):n.push(um,s,bu,r)}}e||n.push(Ii)}var ui=me(" "),lr=me('="'),Ii=me('"'),Tu=me('=""');function dn(n,e,t,i){switch(t){case"style":zf(n,e,i);return;case"defaultValue":case"defaultChecked":case"innerHTML":case"suppressContentEditableWarning":case"suppressHydrationWarning":return}if(!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N"){if(e=Gt.hasOwnProperty(t)?Gt[t]:null,e!==null){switch(typeof i){case"function":case"symbol":return;case"boolean":if(!e.acceptsBooleans)return}switch(t=Ze(e.attributeName),e.type){case 3:i&&n.push(ui,t,Tu);break;case 4:i===!0?n.push(ui,t,Tu):i!==!1&&n.push(ui,t,lr,Ze(zt(i)),Ii);break;case 5:isNaN(i)||n.push(ui,t,lr,Ze(zt(i)),Ii);break;case 6:!isNaN(i)&&1<=i&&n.push(ui,t,lr,Ze(zt(i)),Ii);break;default:e.sanitizeURL&&(i=""+i),n.push(ui,t,lr,Ze(zt(i)),Ii)}}else if(Bf(t)){switch(typeof i){case"function":case"symbol":return;case"boolean":if(e=t.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-")return}n.push(ui,Ze(t),lr,Ze(zt(i)),Ii)}}}var hi=me(">"),Au=me("/>");function Zs(n,e,t){if(e!=null){if(t!=null)throw Error(je(60));if(typeof e!="object"||!("__html"in e))throw Error(je(61));e=e.__html,e!=null&&n.push(Ze(""+e))}}function hm(n){var e="";return Nf.Children.forEach(n,function(t){t!=null&&(e+=t)}),e}var Qo=me(' selected=""');function ea(n,e,t,i){n.push(Ln(t));var r=t=null,s;for(s in e)if(sn.call(e,s)){var o=e[s];if(o!=null)switch(s){case"children":t=o;break;case"dangerouslySetInnerHTML":r=o;break;default:dn(n,i,s,o)}}return n.push(hi),Zs(n,r,t),typeof t=="string"?(n.push(Ze(zt(t))),null):t}var ta=me(`
`),fm=/^[a-zA-Z][a-zA-Z:_\.\-\d]*$/,Cu=new Map;function Ln(n){var e=Cu.get(n);if(e===void 0){if(!fm.test(n))throw Error(je(65,n));e=me("<"+n),Cu.set(n,e)}return e}var dm=me("<!DOCTYPE html>");function pm(n,e,t,i,r){switch(e){case"select":n.push(Ln("select"));var s=null,o=null;for(u in t)if(sn.call(t,u)){var a=t[u];if(a!=null)switch(u){case"children":s=a;break;case"dangerouslySetInnerHTML":o=a;break;case"defaultValue":case"value":break;default:dn(n,i,u,a)}}return n.push(hi),Zs(n,o,s),s;case"option":o=r.selectedValue,n.push(Ln("option"));var l=a=null,c=null,u=null;for(s in t)if(sn.call(t,s)){var h=t[s];if(h!=null)switch(s){case"children":a=h;break;case"selected":c=h;break;case"dangerouslySetInnerHTML":u=h;break;case"value":l=h;default:dn(n,i,s,h)}}if(o!=null)if(t=l!==null?""+l:hm(a),tl(o)){for(i=0;i<o.length;i++)if(""+o[i]===t){n.push(Qo);break}}else""+o===t&&n.push(Qo);else c&&n.push(Qo);return n.push(hi),Zs(n,u,a),a;case"textarea":n.push(Ln("textarea")),u=o=s=null;for(a in t)if(sn.call(t,a)&&(l=t[a],l!=null))switch(a){case"children":u=l;break;case"value":s=l;break;case"defaultValue":o=l;break;case"dangerouslySetInnerHTML":throw Error(je(91));default:dn(n,i,a,l)}if(s===null&&o!==null&&(s=o),n.push(hi),u!=null){if(s!=null)throw Error(je(92));if(tl(u)&&1<u.length)throw Error(je(93));s=""+u}return typeof s=="string"&&s[0]===`
`&&n.push(ta),s!==null&&n.push(Ze(zt(""+s))),null;case"input":n.push(Ln("input")),l=u=a=s=null;for(o in t)if(sn.call(t,o)&&(c=t[o],c!=null))switch(o){case"children":case"dangerouslySetInnerHTML":throw Error(je(399,"input"));case"defaultChecked":l=c;break;case"defaultValue":a=c;break;case"checked":u=c;break;case"value":s=c;break;default:dn(n,i,o,c)}return u!==null?dn(n,i,"checked",u):l!==null&&dn(n,i,"checked",l),s!==null?dn(n,i,"value",s):a!==null&&dn(n,i,"value",a),n.push(Au),null;case"menuitem":n.push(Ln("menuitem"));for(var p in t)if(sn.call(t,p)&&(s=t[p],s!=null))switch(p){case"children":case"dangerouslySetInnerHTML":throw Error(je(400));default:dn(n,i,p,s)}return n.push(hi),null;case"title":n.push(Ln("title")),s=null;for(h in t)if(sn.call(t,h)&&(o=t[h],o!=null))switch(h){case"children":s=o;break;case"dangerouslySetInnerHTML":throw Error(je(434));default:dn(n,i,h,o)}return n.push(hi),s;case"listing":case"pre":n.push(Ln(e)),o=s=null;for(l in t)if(sn.call(t,l)&&(a=t[l],a!=null))switch(l){case"children":s=a;break;case"dangerouslySetInnerHTML":o=a;break;default:dn(n,i,l,a)}if(n.push(hi),o!=null){if(s!=null)throw Error(je(60));if(typeof o!="object"||!("__html"in o))throw Error(je(61));t=o.__html,t!=null&&(typeof t=="string"&&0<t.length&&t[0]===`
`?n.push(ta,Ze(t)):n.push(Ze(""+t)))}return typeof s=="string"&&s[0]===`
`&&n.push(ta),s;case"area":case"base":case"br":case"col":case"embed":case"hr":case"img":case"keygen":case"link":case"meta":case"param":case"source":case"track":case"wbr":n.push(Ln(e));for(var f in t)if(sn.call(t,f)&&(s=t[f],s!=null))switch(f){case"children":case"dangerouslySetInnerHTML":throw Error(je(399,e));default:dn(n,i,f,s)}return n.push(Au),null;case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return ea(n,t,e,i);case"html":return r.insertionMode===0&&n.push(dm),ea(n,t,e,i);default:if(e.indexOf("-")===-1&&typeof t.is!="string")return ea(n,t,e,i);n.push(Ln(e)),o=s=null;for(c in t)if(sn.call(t,c)&&(a=t[c],a!=null))switch(c){case"children":s=a;break;case"dangerouslySetInnerHTML":o=a;break;case"style":zf(n,i,a);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":break;default:Bf(c)&&typeof a!="function"&&typeof a!="symbol"&&n.push(ui,Ze(c),lr,Ze(zt(a)),Ii)}return n.push(hi),Zs(n,o,s),s}}var mm=me("</"),gm=me(">"),_m=me('<template id="'),vm=me('"></template>'),xm=me("<!--$-->"),ym=me('<!--$?--><template id="'),Sm=me('"></template>'),Mm=me("<!--$!-->"),Em=me("<!--/$-->"),wm=me("<template"),bm=me('"'),Tm=me(' data-dgst="');me(' data-msg="');me(' data-stck="');var Am=me("></template>");function Ru(n,e,t){if(Ae(n,ym),t===null)throw Error(je(395));return Ae(n,t),xt(n,Sm)}var Cm=me('<div hidden id="'),Rm=me('">'),Pm=me("</div>"),Lm=me('<svg aria-hidden="true" style="display:none" id="'),Im=me('">'),Dm=me("</svg>"),Um=me('<math aria-hidden="true" style="display:none" id="'),Nm=me('">'),Fm=me("</math>"),Om=me('<table hidden id="'),Bm=me('">'),zm=me("</table>"),km=me('<table hidden><tbody id="'),Hm=me('">'),Vm=me("</tbody></table>"),Gm=me('<table hidden><tr id="'),Wm=me('">'),Xm=me("</tr></table>"),$m=me('<table hidden><colgroup id="'),qm=me('">'),Ym=me("</colgroup></table>");function jm(n,e,t,i){switch(t.insertionMode){case 0:case 1:return Ae(n,Cm),Ae(n,e.segmentPrefix),Ae(n,Ze(i.toString(16))),xt(n,Rm);case 2:return Ae(n,Lm),Ae(n,e.segmentPrefix),Ae(n,Ze(i.toString(16))),xt(n,Im);case 3:return Ae(n,Um),Ae(n,e.segmentPrefix),Ae(n,Ze(i.toString(16))),xt(n,Nm);case 4:return Ae(n,Om),Ae(n,e.segmentPrefix),Ae(n,Ze(i.toString(16))),xt(n,Bm);case 5:return Ae(n,km),Ae(n,e.segmentPrefix),Ae(n,Ze(i.toString(16))),xt(n,Hm);case 6:return Ae(n,Gm),Ae(n,e.segmentPrefix),Ae(n,Ze(i.toString(16))),xt(n,Wm);case 7:return Ae(n,$m),Ae(n,e.segmentPrefix),Ae(n,Ze(i.toString(16))),xt(n,qm);default:throw Error(je(397))}}function Km(n,e){switch(e.insertionMode){case 0:case 1:return xt(n,Pm);case 2:return xt(n,Dm);case 3:return xt(n,Fm);case 4:return xt(n,zm);case 5:return xt(n,Vm);case 6:return xt(n,Xm);case 7:return xt(n,Ym);default:throw Error(je(397))}}var Zm=me('function $RS(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS("'),Jm=me('$RS("'),Qm=me('","'),eg=me('")<\/script>'),tg=me('function $RC(a,b){a=document.getElementById(a);b=document.getElementById(b);b.parentNode.removeChild(b);if(a){a=a.previousSibling;var f=a.parentNode,c=a.nextSibling,e=0;do{if(c&&8===c.nodeType){var d=c.data;if("/$"===d)if(0===e)break;else e--;else"$"!==d&&"$?"!==d&&"$!"!==d||e++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;b.firstChild;)f.insertBefore(b.firstChild,c);a.data="$";a._reactRetry&&a._reactRetry()}};$RC("'),ng=me('$RC("'),ig=me('","'),rg=me('")<\/script>'),sg=me('function $RX(b,c,d,e){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data="$!",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),b._reactRetry&&b._reactRetry())};$RX("'),og=me('$RX("'),ag=me('"'),lg=me(")<\/script>"),na=me(","),cg=/[<\u2028\u2029]/g;function ia(n){return JSON.stringify(n).replace(cg,function(e){switch(e){case"<":return"\\u003c";case"\u2028":return"\\u2028";case"\u2029":return"\\u2029";default:throw Error("escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React")}})}var Yr=Object.assign,ug=Symbol.for("react.element"),kf=Symbol.for("react.portal"),Hf=Symbol.for("react.fragment"),Vf=Symbol.for("react.strict_mode"),Gf=Symbol.for("react.profiler"),Wf=Symbol.for("react.provider"),Xf=Symbol.for("react.context"),$f=Symbol.for("react.forward_ref"),qf=Symbol.for("react.suspense"),Yf=Symbol.for("react.suspense_list"),jf=Symbol.for("react.memo"),fc=Symbol.for("react.lazy"),hg=Symbol.for("react.scope"),fg=Symbol.for("react.debug_trace_mode"),dg=Symbol.for("react.legacy_hidden"),pg=Symbol.for("react.default_value"),Pu=Symbol.iterator;function nl(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case Hf:return"Fragment";case kf:return"Portal";case Gf:return"Profiler";case Vf:return"StrictMode";case qf:return"Suspense";case Yf:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case Xf:return(n.displayName||"Context")+".Consumer";case Wf:return(n._context.displayName||"Context")+".Provider";case $f:var e=n.render;return n=n.displayName,n||(n=e.displayName||e.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case jf:return e=n.displayName||null,e!==null?e:nl(n.type)||"Memo";case fc:e=n._payload,n=n._init;try{return nl(n(e))}catch{}}return null}var Kf={};function Lu(n,e){if(n=n.contextTypes,!n)return Kf;var t={},i;for(i in n)t[i]=e[i];return t}var Oi=null;function Do(n,e){if(n!==e){n.context._currentValue=n.parentValue,n=n.parent;var t=e.parent;if(n===null){if(t!==null)throw Error(je(401))}else{if(t===null)throw Error(je(401));Do(n,t)}e.context._currentValue=e.value}}function Zf(n){n.context._currentValue=n.parentValue,n=n.parent,n!==null&&Zf(n)}function Jf(n){var e=n.parent;e!==null&&Jf(e),n.context._currentValue=n.value}function Qf(n,e){if(n.context._currentValue=n.parentValue,n=n.parent,n===null)throw Error(je(402));n.depth===e.depth?Do(n,e):Qf(n,e)}function ed(n,e){var t=e.parent;if(t===null)throw Error(je(402));n.depth===t.depth?Do(n,t):ed(n,t),e.context._currentValue=e.value}function mo(n){var e=Oi;e!==n&&(e===null?Jf(n):n===null?Zf(e):e.depth===n.depth?Do(e,n):e.depth>n.depth?Qf(e,n):ed(e,n),Oi=n)}var Iu={isMounted:function(){return!1},enqueueSetState:function(n,e){n=n._reactInternals,n.queue!==null&&n.queue.push(e)},enqueueReplaceState:function(n,e){n=n._reactInternals,n.replace=!0,n.queue=[e]},enqueueForceUpdate:function(){}};function Du(n,e,t,i){var r=n.state!==void 0?n.state:null;n.updater=Iu,n.props=t,n.state=r;var s={queue:[],replace:!1};n._reactInternals=s;var o=e.contextType;if(n.context=typeof o=="object"&&o!==null?o._currentValue:i,o=e.getDerivedStateFromProps,typeof o=="function"&&(o=o(t,r),r=o==null?r:Yr({},r,o),n.state=r),typeof e.getDerivedStateFromProps!="function"&&typeof n.getSnapshotBeforeUpdate!="function"&&(typeof n.UNSAFE_componentWillMount=="function"||typeof n.componentWillMount=="function"))if(e=n.state,typeof n.componentWillMount=="function"&&n.componentWillMount(),typeof n.UNSAFE_componentWillMount=="function"&&n.UNSAFE_componentWillMount(),e!==n.state&&Iu.enqueueReplaceState(n,n.state,null),s.queue!==null&&0<s.queue.length)if(e=s.queue,o=s.replace,s.queue=null,s.replace=!1,o&&e.length===1)n.state=e[0];else{for(s=o?e[0]:n.state,r=!0,o=o?1:0;o<e.length;o++){var a=e[o];a=typeof a=="function"?a.call(n,s,t,i):a,a!=null&&(r?(r=!1,s=Yr({},s,a)):Yr(s,a))}n.state=s}else s.queue=null}var mg={id:1,overflow:""};function il(n,e,t){var i=n.id;n=n.overflow;var r=32-Js(i)-1;i&=~(1<<r),t+=1;var s=32-Js(e)+r;if(30<s){var o=r-r%5;return s=(i&(1<<o)-1).toString(32),i>>=o,r-=o,{id:1<<32-Js(e)+r|t<<r|i,overflow:s+n}}return{id:1<<s|t<<r|i,overflow:n}}var Js=Math.clz32?Math.clz32:vg,gg=Math.log,_g=Math.LN2;function vg(n){return n>>>=0,n===0?32:31-(gg(n)/_g|0)|0}function xg(n,e){return n===e&&(n!==0||1/n===1/e)||n!==n&&e!==e}var yg=typeof Object.is=="function"?Object.is:xg,jn=null,dc=null,Qs=null,mt=null,Wr=!1,go=!1,Qr=0,mi=null,Uo=0;function Di(){if(jn===null)throw Error(je(321));return jn}function Uu(){if(0<Uo)throw Error(je(312));return{memoizedState:null,queue:null,next:null}}function pc(){return mt===null?Qs===null?(Wr=!1,Qs=mt=Uu()):(Wr=!0,mt=Qs):mt.next===null?(Wr=!1,mt=mt.next=Uu()):(Wr=!0,mt=mt.next),mt}function mc(){dc=jn=null,go=!1,Qs=null,Uo=0,mt=mi=null}function td(n,e){return typeof e=="function"?e(n):e}function Nu(n,e,t){if(jn=Di(),mt=pc(),Wr){var i=mt.queue;if(e=i.dispatch,mi!==null&&(t=mi.get(i),t!==void 0)){mi.delete(i),i=mt.memoizedState;do i=n(i,t.action),t=t.next;while(t!==null);return mt.memoizedState=i,[i,e]}return[mt.memoizedState,e]}return n=n===td?typeof e=="function"?e():e:t!==void 0?t(e):e,mt.memoizedState=n,n=mt.queue={last:null,dispatch:null},n=n.dispatch=Sg.bind(null,jn,n),[mt.memoizedState,n]}function Fu(n,e){if(jn=Di(),mt=pc(),e=e===void 0?null:e,mt!==null){var t=mt.memoizedState;if(t!==null&&e!==null){var i=t[1];e:if(i===null)i=!1;else{for(var r=0;r<i.length&&r<e.length;r++)if(!yg(e[r],i[r])){i=!1;break e}i=!0}if(i)return t[0]}}return n=n(),mt.memoizedState=[n,e],n}function Sg(n,e,t){if(25<=Uo)throw Error(je(301));if(n===jn)if(go=!0,n={action:t,next:null},mi===null&&(mi=new Map),t=mi.get(e),t===void 0)mi.set(e,n);else{for(e=t;e.next!==null;)e=e.next;e.next=n}}function Mg(){throw Error(je(394))}function fs(){}var Ou={readContext:function(n){return n._currentValue},useContext:function(n){return Di(),n._currentValue},useMemo:Fu,useReducer:Nu,useRef:function(n){jn=Di(),mt=pc();var e=mt.memoizedState;return e===null?(n={current:n},mt.memoizedState=n):e},useState:function(n){return Nu(td,n)},useInsertionEffect:fs,useLayoutEffect:function(){},useCallback:function(n,e){return Fu(function(){return n},e)},useImperativeHandle:fs,useEffect:fs,useDebugValue:fs,useDeferredValue:function(n){return Di(),n},useTransition:function(){return Di(),[!1,Mg]},useId:function(){var n=dc.treeContext,e=n.overflow;n=n.id,n=(n&~(1<<32-Js(n)-1)).toString(32)+e;var t=eo;if(t===null)throw Error(je(404));return e=Qr++,n=":"+t.idPrefix+"R"+n,0<e&&(n+="H"+e.toString(32)),n+":"},useMutableSource:function(n,e){return Di(),e(n._source)},useSyncExternalStore:function(n,e,t){if(t===void 0)throw Error(je(407));return t()}},eo=null,ra=Nf.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher;function Eg(n){return console.error(n),null}function Xr(){}function wg(n,e,t,i,r,s,o,a,l){var c=[],u=new Set;return e={destination:null,responseState:e,progressiveChunkSize:i===void 0?12800:i,status:0,fatalError:null,nextSegmentId:0,allPendingTasks:0,pendingRootTasks:0,completedRootSegment:null,abortableTasks:u,pingedTasks:c,clientRenderedBoundaries:[],completedBoundaries:[],partialBoundaries:[],onError:r===void 0?Eg:r,onAllReady:s===void 0?Xr:s,onShellReady:o===void 0?Xr:o,onShellError:a===void 0?Xr:a,onFatalError:l===void 0?Xr:l},t=_o(e,0,null,t,!1,!1),t.parentFlushed=!0,n=gc(e,n,null,t,u,Kf,null,mg),c.push(n),e}function gc(n,e,t,i,r,s,o,a){n.allPendingTasks++,t===null?n.pendingRootTasks++:t.pendingTasks++;var l={node:e,ping:function(){var c=n.pingedTasks;c.push(l),c.length===1&&rd(n)},blockedBoundary:t,blockedSegment:i,abortSet:r,legacyContext:s,context:o,treeContext:a};return r.add(l),l}function _o(n,e,t,i,r,s){return{status:0,id:-1,index:e,parentFlushed:!1,chunks:[],children:[],formatContext:i,boundary:t,lastPushedText:r,textEmbedded:s}}function es(n,e){if(n=n.onError(e),n!=null&&typeof n!="string")throw Error('onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "'+typeof n+'" instead');return n}function vo(n,e){var t=n.onShellError;t(e),t=n.onFatalError,t(e),n.destination!==null?(n.status=2,Of(n.destination,e)):(n.status=1,n.fatalError=e)}function Bu(n,e,t,i,r){for(jn={},dc=e,Qr=0,n=t(i,r);go;)go=!1,Qr=0,Uo+=1,mt=null,n=t(i,r);return mc(),n}function zu(n,e,t,i){var r=t.render(),s=i.childContextTypes;if(s!=null){var o=e.legacyContext;if(typeof t.getChildContext!="function")i=o;else{t=t.getChildContext();for(var a in t)if(!(a in s))throw Error(je(108,nl(i)||"Unknown",a));i=Yr({},o,t)}e.legacyContext=i,_n(n,e,r),e.legacyContext=o}else _n(n,e,r)}function ku(n,e){if(n&&n.defaultProps){e=Yr({},e),n=n.defaultProps;for(var t in n)e[t]===void 0&&(e[t]=n[t]);return e}return e}function rl(n,e,t,i,r){if(typeof t=="function")if(t.prototype&&t.prototype.isReactComponent){r=Lu(t,e.legacyContext);var s=t.contextType;s=new t(i,typeof s=="object"&&s!==null?s._currentValue:r),Du(s,t,i,r),zu(n,e,s,t)}else{s=Lu(t,e.legacyContext),r=Bu(n,e,t,i,s);var o=Qr!==0;if(typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0)Du(r,t,i,s),zu(n,e,r,t);else if(o){i=e.treeContext,e.treeContext=il(i,1,0);try{_n(n,e,r)}finally{e.treeContext=i}}else _n(n,e,r)}else if(typeof t=="string"){switch(r=e.blockedSegment,s=pm(r.chunks,t,i,n.responseState,r.formatContext),r.lastPushedText=!1,o=r.formatContext,r.formatContext=lm(o,t,i),sl(n,e,s),r.formatContext=o,t){case"area":case"base":case"br":case"col":case"embed":case"hr":case"img":case"input":case"keygen":case"link":case"meta":case"param":case"source":case"track":case"wbr":break;default:r.chunks.push(mm,Ze(t),gm)}r.lastPushedText=!1}else{switch(t){case dg:case fg:case Vf:case Gf:case Hf:_n(n,e,i.children);return;case Yf:_n(n,e,i.children);return;case hg:throw Error(je(343));case qf:e:{t=e.blockedBoundary,r=e.blockedSegment,s=i.fallback,i=i.children,o=new Set;var a={id:null,rootSegmentID:-1,parentFlushed:!1,pendingTasks:0,forceClientRender:!1,completedSegments:[],byteSize:0,fallbackAbortableTasks:o,errorDigest:null},l=_o(n,r.chunks.length,a,r.formatContext,!1,!1);r.children.push(l),r.lastPushedText=!1;var c=_o(n,0,null,r.formatContext,!1,!1);c.parentFlushed=!0,e.blockedBoundary=a,e.blockedSegment=c;try{if(sl(n,e,i),c.lastPushedText&&c.textEmbedded&&c.chunks.push(hc),c.status=1,xo(a,c),a.pendingTasks===0)break e}catch(u){c.status=4,a.forceClientRender=!0,a.errorDigest=es(n,u)}finally{e.blockedBoundary=t,e.blockedSegment=r}e=gc(n,s,t,l,o,e.legacyContext,e.context,e.treeContext),n.pingedTasks.push(e)}return}if(typeof t=="object"&&t!==null)switch(t.$$typeof){case $f:if(i=Bu(n,e,t.render,i,r),Qr!==0){t=e.treeContext,e.treeContext=il(t,1,0);try{_n(n,e,i)}finally{e.treeContext=t}}else _n(n,e,i);return;case jf:t=t.type,i=ku(t,i),rl(n,e,t,i,r);return;case Wf:if(r=i.children,t=t._context,i=i.value,s=t._currentValue,t._currentValue=i,o=Oi,Oi=i={parent:o,depth:o===null?0:o.depth+1,context:t,parentValue:s,value:i},e.context=i,_n(n,e,r),n=Oi,n===null)throw Error(je(403));i=n.parentValue,n.context._currentValue=i===pg?n.context._defaultValue:i,n=Oi=n.parent,e.context=n;return;case Xf:i=i.children,i=i(t._currentValue),_n(n,e,i);return;case fc:r=t._init,t=r(t._payload),i=ku(t,i),rl(n,e,t,i,void 0);return}throw Error(je(130,t==null?t:typeof t,""))}}function _n(n,e,t){if(e.node=t,typeof t=="object"&&t!==null){switch(t.$$typeof){case ug:rl(n,e,t.type,t.props,t.ref);return;case kf:throw Error(je(257));case fc:var i=t._init;t=i(t._payload),_n(n,e,t);return}if(tl(t)){Hu(n,e,t);return}if(t===null||typeof t!="object"?i=null:(i=Pu&&t[Pu]||t["@@iterator"],i=typeof i=="function"?i:null),i&&(i=i.call(t))){if(t=i.next(),!t.done){var r=[];do r.push(t.value),t=i.next();while(!t.done);Hu(n,e,r)}return}throw n=Object.prototype.toString.call(t),Error(je(31,n==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":n))}typeof t=="string"?(i=e.blockedSegment,i.lastPushedText=Eu(e.blockedSegment.chunks,t,n.responseState,i.lastPushedText)):typeof t=="number"&&(i=e.blockedSegment,i.lastPushedText=Eu(e.blockedSegment.chunks,""+t,n.responseState,i.lastPushedText))}function Hu(n,e,t){for(var i=t.length,r=0;r<i;r++){var s=e.treeContext;e.treeContext=il(s,i,r);try{sl(n,e,t[r])}finally{e.treeContext=s}}}function sl(n,e,t){var i=e.blockedSegment.formatContext,r=e.legacyContext,s=e.context;try{return _n(n,e,t)}catch(l){if(mc(),typeof l=="object"&&l!==null&&typeof l.then=="function"){t=l;var o=e.blockedSegment,a=_o(n,o.chunks.length,null,o.formatContext,o.lastPushedText,!0);o.children.push(a),o.lastPushedText=!1,n=gc(n,e.node,e.blockedBoundary,a,e.abortSet,e.legacyContext,e.context,e.treeContext).ping,t.then(n,n),e.blockedSegment.formatContext=i,e.legacyContext=r,e.context=s,mo(s)}else throw e.blockedSegment.formatContext=i,e.legacyContext=r,e.context=s,mo(s),l}}function bg(n){var e=n.blockedBoundary;n=n.blockedSegment,n.status=3,id(this,e,n)}function nd(n,e,t){var i=n.blockedBoundary;n.blockedSegment.status=3,i===null?(e.allPendingTasks--,e.status!==2&&(e.status=2,e.destination!==null&&e.destination.close())):(i.pendingTasks--,i.forceClientRender||(i.forceClientRender=!0,n=t===void 0?Error(je(432)):t,i.errorDigest=e.onError(n),i.parentFlushed&&e.clientRenderedBoundaries.push(i)),i.fallbackAbortableTasks.forEach(function(r){return nd(r,e,t)}),i.fallbackAbortableTasks.clear(),e.allPendingTasks--,e.allPendingTasks===0&&(i=e.onAllReady,i()))}function xo(n,e){if(e.chunks.length===0&&e.children.length===1&&e.children[0].boundary===null){var t=e.children[0];t.id=e.id,t.parentFlushed=!0,t.status===1&&xo(n,t)}else n.completedSegments.push(e)}function id(n,e,t){if(e===null){if(t.parentFlushed){if(n.completedRootSegment!==null)throw Error(je(389));n.completedRootSegment=t}n.pendingRootTasks--,n.pendingRootTasks===0&&(n.onShellError=Xr,e=n.onShellReady,e())}else e.pendingTasks--,e.forceClientRender||(e.pendingTasks===0?(t.parentFlushed&&t.status===1&&xo(e,t),e.parentFlushed&&n.completedBoundaries.push(e),e.fallbackAbortableTasks.forEach(bg,n),e.fallbackAbortableTasks.clear()):t.parentFlushed&&t.status===1&&(xo(e,t),e.completedSegments.length===1&&e.parentFlushed&&n.partialBoundaries.push(e)));n.allPendingTasks--,n.allPendingTasks===0&&(n=n.onAllReady,n())}function rd(n){if(n.status!==2){var e=Oi,t=ra.current;ra.current=Ou;var i=eo;eo=n.responseState;try{var r=n.pingedTasks,s;for(s=0;s<r.length;s++){var o=r[s],a=n,l=o.blockedSegment;if(l.status===0){mo(o.context);try{_n(a,o,o.node),l.lastPushedText&&l.textEmbedded&&l.chunks.push(hc),o.abortSet.delete(o),l.status=1,id(a,o.blockedBoundary,l)}catch(g){if(mc(),typeof g=="object"&&g!==null&&typeof g.then=="function"){var c=o.ping;g.then(c,c)}else{o.abortSet.delete(o),l.status=4;var u=o.blockedBoundary,h=g,p=es(a,h);if(u===null?vo(a,h):(u.pendingTasks--,u.forceClientRender||(u.forceClientRender=!0,u.errorDigest=p,u.parentFlushed&&a.clientRenderedBoundaries.push(u))),a.allPendingTasks--,a.allPendingTasks===0){var f=a.onAllReady;f()}}}finally{}}}r.splice(0,s),n.destination!==null&&_c(n,n.destination)}catch(g){es(n,g),vo(n,g)}finally{eo=i,ra.current=t,t===Ou&&mo(e)}}}function ds(n,e,t){switch(t.parentFlushed=!0,t.status){case 0:var i=t.id=n.nextSegmentId++;return t.lastPushedText=!1,t.textEmbedded=!1,n=n.responseState,Ae(e,_m),Ae(e,n.placeholderPrefix),n=Ze(i.toString(16)),Ae(e,n),xt(e,vm);case 1:t.status=2;var r=!0;i=t.chunks;var s=0;t=t.children;for(var o=0;o<t.length;o++){for(r=t[o];s<r.index;s++)Ae(e,i[s]);r=No(n,e,r)}for(;s<i.length-1;s++)Ae(e,i[s]);return s<i.length&&(r=xt(e,i[s])),r;default:throw Error(je(390))}}function No(n,e,t){var i=t.boundary;if(i===null)return ds(n,e,t);if(i.parentFlushed=!0,i.forceClientRender)i=i.errorDigest,xt(e,Mm),Ae(e,wm),i&&(Ae(e,Tm),Ae(e,Ze(zt(i))),Ae(e,bm)),xt(e,Am),ds(n,e,t);else if(0<i.pendingTasks){i.rootSegmentID=n.nextSegmentId++,0<i.completedSegments.length&&n.partialBoundaries.push(i);var r=n.responseState,s=r.nextSuspenseID++;r=me(r.boundaryPrefix+s.toString(16)),i=i.id=r,Ru(e,n.responseState,i),ds(n,e,t)}else if(i.byteSize>n.progressiveChunkSize)i.rootSegmentID=n.nextSegmentId++,n.completedBoundaries.push(i),Ru(e,n.responseState,i.id),ds(n,e,t);else{if(xt(e,xm),t=i.completedSegments,t.length!==1)throw Error(je(391));No(n,e,t[0])}return xt(e,Em)}function Vu(n,e,t){return jm(e,n.responseState,t.formatContext,t.id),No(n,e,t),Km(e,t.formatContext)}function Gu(n,e,t){for(var i=t.completedSegments,r=0;r<i.length;r++)sd(n,e,t,i[r]);if(i.length=0,n=n.responseState,i=t.id,t=t.rootSegmentID,Ae(e,n.startInlineScript),n.sentCompleteBoundaryFunction?Ae(e,ng):(n.sentCompleteBoundaryFunction=!0,Ae(e,tg)),i===null)throw Error(je(395));return t=Ze(t.toString(16)),Ae(e,i),Ae(e,ig),Ae(e,n.segmentPrefix),Ae(e,t),xt(e,rg)}function sd(n,e,t,i){if(i.status===2)return!0;var r=i.id;if(r===-1){if((i.id=t.rootSegmentID)===-1)throw Error(je(392));return Vu(n,e,i)}return Vu(n,e,i),n=n.responseState,Ae(e,n.startInlineScript),n.sentCompleteSegmentFunction?Ae(e,Jm):(n.sentCompleteSegmentFunction=!0,Ae(e,Zm)),Ae(e,n.segmentPrefix),r=Ze(r.toString(16)),Ae(e,r),Ae(e,Qm),Ae(e,n.placeholderPrefix),Ae(e,r),xt(e,eg)}function _c(n,e){mn=new Uint8Array(512),gn=0;try{var t=n.completedRootSegment;if(t!==null&&n.pendingRootTasks===0){No(n,e,t),n.completedRootSegment=null;var i=n.responseState.bootstrapChunks;for(t=0;t<i.length-1;t++)Ae(e,i[t]);t<i.length&&xt(e,i[t])}var r=n.clientRenderedBoundaries,s;for(s=0;s<r.length;s++){var o=r[s];i=e;var a=n.responseState,l=o.id,c=o.errorDigest,u=o.errorMessage,h=o.errorComponentStack;if(Ae(i,a.startInlineScript),a.sentClientRenderFunction?Ae(i,og):(a.sentClientRenderFunction=!0,Ae(i,sg)),l===null)throw Error(je(395));Ae(i,l),Ae(i,ag),(c||u||h)&&(Ae(i,na),Ae(i,Ze(ia(c||"")))),(u||h)&&(Ae(i,na),Ae(i,Ze(ia(u||"")))),h&&(Ae(i,na),Ae(i,Ze(ia(h)))),xt(i,lg)}r.splice(0,s);var p=n.completedBoundaries;for(s=0;s<p.length;s++)Gu(n,e,p[s]);p.splice(0,s),xu(e),mn=new Uint8Array(512),gn=0;var f=n.partialBoundaries;for(s=0;s<f.length;s++){var g=f[s];e:{r=n,o=e;var _=g.completedSegments;for(a=0;a<_.length;a++)if(!sd(r,o,g,_[a])){a++,_.splice(0,a);var d=!1;break e}_.splice(0,a),d=!0}if(!d){n.destination=null,s++,f.splice(0,s);return}}f.splice(0,s);var m=n.completedBoundaries;for(s=0;s<m.length;s++)Gu(n,e,m[s]);m.splice(0,s)}finally{xu(e),n.allPendingTasks===0&&n.pingedTasks.length===0&&n.clientRenderedBoundaries.length===0&&n.completedBoundaries.length===0&&e.close()}}function Wu(n,e){try{var t=n.abortableTasks;t.forEach(function(i){return nd(i,n,e)}),t.clear(),n.destination!==null&&_c(n,n.destination)}catch(i){es(n,i),vo(n,i)}}lc.renderToReadableStream=function(n,e){return new Promise(function(t,i){var r,s,o=new Promise(function(u,h){s=u,r=h}),a=wg(n,om(e?e.identifierPrefix:void 0,e?e.nonce:void 0,e?e.bootstrapScriptContent:void 0,e?e.bootstrapScripts:void 0,e?e.bootstrapModules:void 0),am(e?e.namespaceURI:void 0),e?e.progressiveChunkSize:void 0,e?e.onError:void 0,s,function(){var u=new ReadableStream({type:"bytes",pull:function(h){if(a.status===1)a.status=2,Of(h,a.fatalError);else if(a.status!==2&&a.destination===null){a.destination=h;try{_c(a,h)}catch(p){es(a,p),vo(a,p)}}},cancel:function(){Wu(a)}},{highWaterMark:0});u.allReady=o,t(u)},function(u){o.catch(function(){}),i(u)},r);if(e&&e.signal){var l=e.signal,c=function(){Wu(a,l.reason),l.removeEventListener("abort",c)};l.addEventListener("abort",c)}rd(a)})};lc.version="18.3.1";var wr,od;wr=Er,od=lc;wr.version;wr.renderToString;var ol=wr.renderToStaticMarkup;wr.renderToNodeStream;wr.renderToStaticNodeStream;od.renderToReadableStream;/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const vc="169",Tg=0,Xu=1,Ag=2,ad=1,Cg=2,Wn=3,xi=0,$t=1,kt=2,gi=0,fr=1,yo=2,$u=3,qu=4,Rg=5,Ui=100,Pg=101,Lg=102,Ig=103,Dg=104,Ug=200,Ng=201,Fg=202,Og=203,al=204,ll=205,Bg=206,zg=207,kg=208,Hg=209,Vg=210,Gg=211,Wg=212,Xg=213,$g=214,cl=0,ul=1,hl=2,gr=3,fl=4,dl=5,pl=6,ml=7,ld=0,qg=1,Yg=2,_i=0,jg=1,Kg=2,Zg=3,Jg=4,Qg=5,e0=6,t0=7,cd=300,_r=301,vr=302,gl=303,_l=304,Fo=306,vl=1e3,Bi=1001,xl=1002,Zt=1003,n0=1004,ps=1005,Tn=1006,sa=1007,zi=1008,Kn=1009,ud=1010,hd=1011,ts=1012,xc=1013,ki=1014,Un=1015,ss=1016,yc=1017,Sc=1018,xr=1020,fd=35902,dd=1021,pd=1022,Cn=1023,md=1024,gd=1025,dr=1026,yr=1027,Oo=1028,Mc=1029,_d=1030,Ec=1031,wc=1033,to=33776,no=33777,io=33778,ro=33779,yl=35840,Sl=35841,Ml=35842,El=35843,wl=36196,bl=37492,Tl=37496,Al=37808,Cl=37809,Rl=37810,Pl=37811,Ll=37812,Il=37813,Dl=37814,Ul=37815,Nl=37816,Fl=37817,Ol=37818,Bl=37819,zl=37820,kl=37821,so=36492,Hl=36494,Vl=36495,vd=36283,Gl=36284,Wl=36285,Xl=36286,i0=3200,r0=3201,xd=0,s0=1,fi="",Ot="srgb",yi="srgb-linear",bc="display-p3",Bo="display-p3-linear",So="linear",vt="srgb",Mo="rec709",Eo="p3",qi=7680,Yu=519,o0=512,a0=513,l0=514,yd=515,c0=516,u0=517,h0=518,f0=519,ju=35044,Ku="300 es",Xn=2e3,wo=2001;class br{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const Wt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],oa=Math.PI/180,$l=180/Math.PI;function Tr(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Wt[n&255]+Wt[n>>8&255]+Wt[n>>16&255]+Wt[n>>24&255]+"-"+Wt[e&255]+Wt[e>>8&255]+"-"+Wt[e>>16&15|64]+Wt[e>>24&255]+"-"+Wt[t&63|128]+Wt[t>>8&255]+"-"+Wt[t>>16&255]+Wt[t>>24&255]+Wt[i&255]+Wt[i>>8&255]+Wt[i>>16&255]+Wt[i>>24&255]).toLowerCase()}function Bt(n,e,t){return Math.max(e,Math.min(t,n))}function d0(n,e){return(n%e+e)%e}function aa(n,e,t){return(1-t)*n+t*e}function Pr(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function nn(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}class se{constructor(e=0,t=0){se.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Bt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class qe{constructor(e,t,i,r,s,o,a,l,c){qe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c)}set(e,t,i,r,s,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=t,u[4]=s,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],h=i[7],p=i[2],f=i[5],g=i[8],_=r[0],d=r[3],m=r[6],v=r[1],x=r[4],S=r[7],R=r[2],b=r[5],A=r[8];return s[0]=o*_+a*v+l*R,s[3]=o*d+a*x+l*b,s[6]=o*m+a*S+l*A,s[1]=c*_+u*v+h*R,s[4]=c*d+u*x+h*b,s[7]=c*m+u*S+h*A,s[2]=p*_+f*v+g*R,s[5]=p*d+f*x+g*b,s[8]=p*m+f*S+g*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-i*s*u+i*a*l+r*s*c-r*o*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=u*o-a*c,p=a*l-u*s,f=c*s-o*l,g=t*h+i*p+r*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=h*_,e[1]=(r*c-u*i)*_,e[2]=(a*i-r*o)*_,e[3]=p*_,e[4]=(u*t-r*l)*_,e[5]=(r*s-a*t)*_,e[6]=f*_,e[7]=(i*l-c*t)*_,e[8]=(o*t-i*s)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(la.makeScale(e,t)),this}rotate(e){return this.premultiply(la.makeRotation(-e)),this}translate(e,t){return this.premultiply(la.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const la=new qe;function Sd(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function bo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function p0(){const n=bo("canvas");return n.style.display="block",n}const Zu={};function oo(n){n in Zu||(Zu[n]=!0,console.warn(n))}function m0(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}function g0(n){const e=n.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function _0(n){const e=n.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Ju=new qe().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Qu=new qe().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Lr={[yi]:{transfer:So,primaries:Mo,luminanceCoefficients:[.2126,.7152,.0722],toReference:n=>n,fromReference:n=>n},[Ot]:{transfer:vt,primaries:Mo,luminanceCoefficients:[.2126,.7152,.0722],toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[Bo]:{transfer:So,primaries:Eo,luminanceCoefficients:[.2289,.6917,.0793],toReference:n=>n.applyMatrix3(Qu),fromReference:n=>n.applyMatrix3(Ju)},[bc]:{transfer:vt,primaries:Eo,luminanceCoefficients:[.2289,.6917,.0793],toReference:n=>n.convertSRGBToLinear().applyMatrix3(Qu),fromReference:n=>n.applyMatrix3(Ju).convertLinearToSRGB()}},v0=new Set([yi,Bo]),ht={enabled:!0,_workingColorSpace:yi,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!v0.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,e,t){if(this.enabled===!1||e===t||!e||!t)return n;const i=Lr[e].toReference,r=Lr[t].fromReference;return r(i(n))},fromWorkingColorSpace:function(n,e){return this.convert(n,this._workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this._workingColorSpace)},getPrimaries:function(n){return Lr[n].primaries},getTransfer:function(n){return n===fi?So:Lr[n].transfer},getLuminanceCoefficients:function(n,e=this._workingColorSpace){return n.fromArray(Lr[e].luminanceCoefficients)}};function pr(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function ca(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Yi;class x0{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Yi===void 0&&(Yi=bo("canvas")),Yi.width=e.width,Yi.height=e.height;const i=Yi.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=Yi}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=bo("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=pr(s[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(pr(t[i]/255)*255):t[i]=pr(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let y0=0;class Md{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:y0++}),this.uuid=Tr(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(ua(r[o].image)):s.push(ua(r[o]))}else s=ua(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function ua(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?x0.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let S0=0;class qt extends br{constructor(e=qt.DEFAULT_IMAGE,t=qt.DEFAULT_MAPPING,i=Bi,r=Bi,s=Tn,o=zi,a=Cn,l=Kn,c=qt.DEFAULT_ANISOTROPY,u=fi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:S0++}),this.uuid=Tr(),this.name="",this.source=new Md(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new se(0,0),this.repeat=new se(1,1),this.center=new se(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new qe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==cd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case vl:e.x=e.x-Math.floor(e.x);break;case Bi:e.x=e.x<0?0:1;break;case xl:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case vl:e.y=e.y-Math.floor(e.y);break;case Bi:e.y=e.y<0?0:1;break;case xl:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}qt.DEFAULT_IMAGE=null;qt.DEFAULT_MAPPING=cd;qt.DEFAULT_ANISOTROPY=1;class gt{constructor(e=0,t=0,i=0,r=1){gt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const l=e.elements,c=l[0],u=l[4],h=l[8],p=l[1],f=l[5],g=l[9],_=l[2],d=l[6],m=l[10];if(Math.abs(u-p)<.01&&Math.abs(h-_)<.01&&Math.abs(g-d)<.01){if(Math.abs(u+p)<.1&&Math.abs(h+_)<.1&&Math.abs(g+d)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const x=(c+1)/2,S=(f+1)/2,R=(m+1)/2,b=(u+p)/4,A=(h+_)/4,L=(g+d)/4;return x>S&&x>R?x<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(x),r=b/i,s=A/i):S>R?S<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(S),i=b/r,s=L/r):R<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(R),i=A/s,r=L/s),this.set(i,r,s,t),this}let v=Math.sqrt((d-g)*(d-g)+(h-_)*(h-_)+(p-u)*(p-u));return Math.abs(v)<.001&&(v=1),this.x=(d-g)/v,this.y=(h-_)/v,this.z=(p-u)/v,this.w=Math.acos((c+f+m-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class M0 extends br{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new gt(0,0,e,t),this.scissorTest=!1,this.viewport=new gt(0,0,e,t);const r={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Tn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new qt(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Md(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Hi extends M0{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Ed extends qt{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Zt,this.minFilter=Zt,this.wrapR=Bi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class E0 extends qt{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Zt,this.minFilter=Zt,this.wrapR=Bi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ar{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,o,a){let l=i[r+0],c=i[r+1],u=i[r+2],h=i[r+3];const p=s[o+0],f=s[o+1],g=s[o+2],_=s[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h;return}if(a===1){e[t+0]=p,e[t+1]=f,e[t+2]=g,e[t+3]=_;return}if(h!==_||l!==p||c!==f||u!==g){let d=1-a;const m=l*p+c*f+u*g+h*_,v=m>=0?1:-1,x=1-m*m;if(x>Number.EPSILON){const R=Math.sqrt(x),b=Math.atan2(R,m*v);d=Math.sin(d*b)/R,a=Math.sin(a*b)/R}const S=a*v;if(l=l*d+p*S,c=c*d+f*S,u=u*d+g*S,h=h*d+_*S,d===1-a){const R=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=R,c*=R,u*=R,h*=R}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,r,s,o){const a=i[r],l=i[r+1],c=i[r+2],u=i[r+3],h=s[o],p=s[o+1],f=s[o+2],g=s[o+3];return e[t]=a*g+u*h+l*f-c*p,e[t+1]=l*g+u*p+c*h-a*f,e[t+2]=c*g+u*f+a*p-l*h,e[t+3]=u*g-a*h-l*p-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(r/2),h=a(s/2),p=l(i/2),f=l(r/2),g=l(s/2);switch(o){case"XYZ":this._x=p*u*h+c*f*g,this._y=c*f*h-p*u*g,this._z=c*u*g+p*f*h,this._w=c*u*h-p*f*g;break;case"YXZ":this._x=p*u*h+c*f*g,this._y=c*f*h-p*u*g,this._z=c*u*g-p*f*h,this._w=c*u*h+p*f*g;break;case"ZXY":this._x=p*u*h-c*f*g,this._y=c*f*h+p*u*g,this._z=c*u*g+p*f*h,this._w=c*u*h-p*f*g;break;case"ZYX":this._x=p*u*h-c*f*g,this._y=c*f*h+p*u*g,this._z=c*u*g-p*f*h,this._w=c*u*h+p*f*g;break;case"YZX":this._x=p*u*h+c*f*g,this._y=c*f*h+p*u*g,this._z=c*u*g-p*f*h,this._w=c*u*h-p*f*g;break;case"XZY":this._x=p*u*h-c*f*g,this._y=c*f*h-p*u*g,this._z=c*u*g+p*f*h,this._w=c*u*h+p*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],h=t[10],p=i+a+h;if(p>0){const f=.5/Math.sqrt(p+1);this._w=.25/f,this._x=(u-l)*f,this._y=(s-c)*f,this._z=(o-r)*f}else if(i>a&&i>h){const f=2*Math.sqrt(1+i-a-h);this._w=(u-l)/f,this._x=.25*f,this._y=(r+o)/f,this._z=(s+c)/f}else if(a>h){const f=2*Math.sqrt(1+a-i-h);this._w=(s-c)/f,this._x=(r+o)/f,this._y=.25*f,this._z=(l+u)/f}else{const f=2*Math.sqrt(1+h-i-a);this._w=(o-r)/f,this._x=(s+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Bt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-i*c,this._z=s*u+o*c+i*l-r*a,this._w=o*u-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-t;return this._w=f*o+t*this._w,this._x=f*i+t*this._x,this._y=f*r+t*this._y,this._z=f*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-t)*u)/c,p=Math.sin(t*u)/c;return this._w=o*h+this._w*p,this._x=i*h+this._x*p,this._y=r*h+this._y*p,this._z=s*h+this._z*p,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,i=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(eh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(eh.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),u=2*(a*t-s*r),h=2*(s*i-o*t);return this.x=t+l*c+o*h-a*u,this.y=i+l*u+a*c-s*h,this.z=r+l*h+s*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return ha.copy(this).projectOnVector(e),this.sub(ha)}reflect(e){return this.sub(ha.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Bt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ha=new P,eh=new Ar;class Si{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(En.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(En.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=En.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,En):En.fromBufferAttribute(s,o),En.applyMatrix4(e.matrixWorld),this.expandByPoint(En);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ms.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ms.copy(i.boundingBox)),ms.applyMatrix4(e.matrixWorld),this.union(ms)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,En),En.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ir),gs.subVectors(this.max,Ir),ji.subVectors(e.a,Ir),Ki.subVectors(e.b,Ir),Zi.subVectors(e.c,Ir),ti.subVectors(Ki,ji),ni.subVectors(Zi,Ki),Ei.subVectors(ji,Zi);let t=[0,-ti.z,ti.y,0,-ni.z,ni.y,0,-Ei.z,Ei.y,ti.z,0,-ti.x,ni.z,0,-ni.x,Ei.z,0,-Ei.x,-ti.y,ti.x,0,-ni.y,ni.x,0,-Ei.y,Ei.x,0];return!fa(t,ji,Ki,Zi,gs)||(t=[1,0,0,0,1,0,0,0,1],!fa(t,ji,Ki,Zi,gs))?!1:(_s.crossVectors(ti,ni),t=[_s.x,_s.y,_s.z],fa(t,ji,Ki,Zi,gs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,En).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(En).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Bn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Bn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Bn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Bn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Bn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Bn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Bn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Bn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Bn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Bn=[new P,new P,new P,new P,new P,new P,new P,new P],En=new P,ms=new Si,ji=new P,Ki=new P,Zi=new P,ti=new P,ni=new P,Ei=new P,Ir=new P,gs=new P,_s=new P,wi=new P;function fa(n,e,t,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){wi.fromArray(n,s);const a=r.x*Math.abs(wi.x)+r.y*Math.abs(wi.y)+r.z*Math.abs(wi.z),l=e.dot(wi),c=t.dot(wi),u=i.dot(wi);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const w0=new Si,Dr=new P,da=new P;class Gi{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):w0.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Dr.subVectors(e,this.center);const t=Dr.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(Dr,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(da.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Dr.copy(e.center).add(da)),this.expandByPoint(Dr.copy(e.center).sub(da))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const zn=new P,pa=new P,vs=new P,ii=new P,ma=new P,xs=new P,ga=new P;class Tc{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,zn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=zn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(zn.copy(this.origin).addScaledVector(this.direction,t),zn.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){pa.copy(e).add(t).multiplyScalar(.5),vs.copy(t).sub(e).normalize(),ii.copy(this.origin).sub(pa);const s=e.distanceTo(t)*.5,o=-this.direction.dot(vs),a=ii.dot(this.direction),l=-ii.dot(vs),c=ii.lengthSq(),u=Math.abs(1-o*o);let h,p,f,g;if(u>0)if(h=o*l-a,p=o*a-l,g=s*u,h>=0)if(p>=-g)if(p<=g){const _=1/u;h*=_,p*=_,f=h*(h+o*p+2*a)+p*(o*h+p+2*l)+c}else p=s,h=Math.max(0,-(o*p+a)),f=-h*h+p*(p+2*l)+c;else p=-s,h=Math.max(0,-(o*p+a)),f=-h*h+p*(p+2*l)+c;else p<=-g?(h=Math.max(0,-(-o*s+a)),p=h>0?-s:Math.min(Math.max(-s,-l),s),f=-h*h+p*(p+2*l)+c):p<=g?(h=0,p=Math.min(Math.max(-s,-l),s),f=p*(p+2*l)+c):(h=Math.max(0,-(o*s+a)),p=h>0?s:Math.min(Math.max(-s,-l),s),f=-h*h+p*(p+2*l)+c);else p=o>0?-s:s,h=Math.max(0,-(o*p+a)),f=-h*h+p*(p+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(pa).addScaledVector(vs,p),f}intersectSphere(e,t){zn.subVectors(e.center,this.origin);const i=zn.dot(this.direction),r=zn.dot(zn)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,p=this.origin;return c>=0?(i=(e.min.x-p.x)*c,r=(e.max.x-p.x)*c):(i=(e.max.x-p.x)*c,r=(e.min.x-p.x)*c),u>=0?(s=(e.min.y-p.y)*u,o=(e.max.y-p.y)*u):(s=(e.max.y-p.y)*u,o=(e.min.y-p.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(e.min.z-p.z)*h,l=(e.max.z-p.z)*h):(a=(e.max.z-p.z)*h,l=(e.min.z-p.z)*h),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,zn)!==null}intersectTriangle(e,t,i,r,s){ma.subVectors(t,e),xs.subVectors(i,e),ga.crossVectors(ma,xs);let o=this.direction.dot(ga),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ii.subVectors(this.origin,e);const l=a*this.direction.dot(xs.crossVectors(ii,xs));if(l<0)return null;const c=a*this.direction.dot(ma.cross(ii));if(c<0||l+c>o)return null;const u=-a*ii.dot(ga);return u<0?null:this.at(u/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class rt{constructor(e,t,i,r,s,o,a,l,c,u,h,p,f,g,_,d){rt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c,u,h,p,f,g,_,d)}set(e,t,i,r,s,o,a,l,c,u,h,p,f,g,_,d){const m=this.elements;return m[0]=e,m[4]=t,m[8]=i,m[12]=r,m[1]=s,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=u,m[10]=h,m[14]=p,m[3]=f,m[7]=g,m[11]=_,m[15]=d,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new rt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/Ji.setFromMatrixColumn(e,0).length(),s=1/Ji.setFromMatrixColumn(e,1).length(),o=1/Ji.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const p=o*u,f=o*h,g=a*u,_=a*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=f+g*c,t[5]=p-_*c,t[9]=-a*l,t[2]=_-p*c,t[6]=g+f*c,t[10]=o*l}else if(e.order==="YXZ"){const p=l*u,f=l*h,g=c*u,_=c*h;t[0]=p+_*a,t[4]=g*a-f,t[8]=o*c,t[1]=o*h,t[5]=o*u,t[9]=-a,t[2]=f*a-g,t[6]=_+p*a,t[10]=o*l}else if(e.order==="ZXY"){const p=l*u,f=l*h,g=c*u,_=c*h;t[0]=p-_*a,t[4]=-o*h,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*u,t[9]=_-p*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const p=o*u,f=o*h,g=a*u,_=a*h;t[0]=l*u,t[4]=g*c-f,t[8]=p*c+_,t[1]=l*h,t[5]=_*c+p,t[9]=f*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const p=o*l,f=o*c,g=a*l,_=a*c;t[0]=l*u,t[4]=_-p*h,t[8]=g*h+f,t[1]=h,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=f*h+g,t[10]=p-_*h}else if(e.order==="XZY"){const p=o*l,f=o*c,g=a*l,_=a*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=p*h+_,t[5]=o*u,t[9]=f*h-g,t[2]=g*h-f,t[6]=a*u,t[10]=_*h+p}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(b0,e,T0)}lookAt(e,t,i){const r=this.elements;return un.subVectors(e,t),un.lengthSq()===0&&(un.z=1),un.normalize(),ri.crossVectors(i,un),ri.lengthSq()===0&&(Math.abs(i.z)===1?un.x+=1e-4:un.z+=1e-4,un.normalize(),ri.crossVectors(i,un)),ri.normalize(),ys.crossVectors(un,ri),r[0]=ri.x,r[4]=ys.x,r[8]=un.x,r[1]=ri.y,r[5]=ys.y,r[9]=un.y,r[2]=ri.z,r[6]=ys.z,r[10]=un.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],h=i[5],p=i[9],f=i[13],g=i[2],_=i[6],d=i[10],m=i[14],v=i[3],x=i[7],S=i[11],R=i[15],b=r[0],A=r[4],L=r[8],G=r[12],y=r[1],E=r[5],F=r[9],O=r[13],H=r[2],j=r[6],B=r[10],X=r[14],V=r[3],re=r[7],oe=r[11],le=r[15];return s[0]=o*b+a*y+l*H+c*V,s[4]=o*A+a*E+l*j+c*re,s[8]=o*L+a*F+l*B+c*oe,s[12]=o*G+a*O+l*X+c*le,s[1]=u*b+h*y+p*H+f*V,s[5]=u*A+h*E+p*j+f*re,s[9]=u*L+h*F+p*B+f*oe,s[13]=u*G+h*O+p*X+f*le,s[2]=g*b+_*y+d*H+m*V,s[6]=g*A+_*E+d*j+m*re,s[10]=g*L+_*F+d*B+m*oe,s[14]=g*G+_*O+d*X+m*le,s[3]=v*b+x*y+S*H+R*V,s[7]=v*A+x*E+S*j+R*re,s[11]=v*L+x*F+S*B+R*oe,s[15]=v*G+x*O+S*X+R*le,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],h=e[6],p=e[10],f=e[14],g=e[3],_=e[7],d=e[11],m=e[15];return g*(+s*l*h-r*c*h-s*a*p+i*c*p+r*a*f-i*l*f)+_*(+t*l*f-t*c*p+s*o*p-r*o*f+r*c*u-s*l*u)+d*(+t*c*h-t*a*f-s*o*h+i*o*f+s*a*u-i*c*u)+m*(-r*a*u-t*l*h+t*a*p+r*o*h-i*o*p+i*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=e[9],p=e[10],f=e[11],g=e[12],_=e[13],d=e[14],m=e[15],v=h*d*c-_*p*c+_*l*f-a*d*f-h*l*m+a*p*m,x=g*p*c-u*d*c-g*l*f+o*d*f+u*l*m-o*p*m,S=u*_*c-g*h*c+g*a*f-o*_*f-u*a*m+o*h*m,R=g*h*l-u*_*l-g*a*p+o*_*p+u*a*d-o*h*d,b=t*v+i*x+r*S+s*R;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/b;return e[0]=v*A,e[1]=(_*p*s-h*d*s-_*r*f+i*d*f+h*r*m-i*p*m)*A,e[2]=(a*d*s-_*l*s+_*r*c-i*d*c-a*r*m+i*l*m)*A,e[3]=(h*l*s-a*p*s-h*r*c+i*p*c+a*r*f-i*l*f)*A,e[4]=x*A,e[5]=(u*d*s-g*p*s+g*r*f-t*d*f-u*r*m+t*p*m)*A,e[6]=(g*l*s-o*d*s-g*r*c+t*d*c+o*r*m-t*l*m)*A,e[7]=(o*p*s-u*l*s+u*r*c-t*p*c-o*r*f+t*l*f)*A,e[8]=S*A,e[9]=(g*h*s-u*_*s-g*i*f+t*_*f+u*i*m-t*h*m)*A,e[10]=(o*_*s-g*a*s+g*i*c-t*_*c-o*i*m+t*a*m)*A,e[11]=(u*a*s-o*h*s-u*i*c+t*h*c+o*i*f-t*a*f)*A,e[12]=R*A,e[13]=(u*_*r-g*h*r+g*i*p-t*_*p-u*i*d+t*h*d)*A,e[14]=(g*a*r-o*_*r-g*i*l+t*_*l+o*i*d-t*a*d)*A,e[15]=(o*h*r-u*a*r+u*i*l-t*h*l-o*i*p+t*a*p)*A,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+i,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,u=o+o,h=a+a,p=s*c,f=s*u,g=s*h,_=o*u,d=o*h,m=a*h,v=l*c,x=l*u,S=l*h,R=i.x,b=i.y,A=i.z;return r[0]=(1-(_+m))*R,r[1]=(f+S)*R,r[2]=(g-x)*R,r[3]=0,r[4]=(f-S)*b,r[5]=(1-(p+m))*b,r[6]=(d+v)*b,r[7]=0,r[8]=(g+x)*A,r[9]=(d-v)*A,r[10]=(1-(p+_))*A,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let s=Ji.set(r[0],r[1],r[2]).length();const o=Ji.set(r[4],r[5],r[6]).length(),a=Ji.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],wn.copy(this);const c=1/s,u=1/o,h=1/a;return wn.elements[0]*=c,wn.elements[1]*=c,wn.elements[2]*=c,wn.elements[4]*=u,wn.elements[5]*=u,wn.elements[6]*=u,wn.elements[8]*=h,wn.elements[9]*=h,wn.elements[10]*=h,t.setFromRotationMatrix(wn),i.x=s,i.y=o,i.z=a,this}makePerspective(e,t,i,r,s,o,a=Xn){const l=this.elements,c=2*s/(t-e),u=2*s/(i-r),h=(t+e)/(t-e),p=(i+r)/(i-r);let f,g;if(a===Xn)f=-(o+s)/(o-s),g=-2*o*s/(o-s);else if(a===wo)f=-o/(o-s),g=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,s,o,a=Xn){const l=this.elements,c=1/(t-e),u=1/(i-r),h=1/(o-s),p=(t+e)*c,f=(i+r)*u;let g,_;if(a===Xn)g=(o+s)*h,_=-2*h;else if(a===wo)g=s*h,_=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-p,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Ji=new P,wn=new rt,b0=new P(0,0,0),T0=new P(1,1,1),ri=new P,ys=new P,un=new P,th=new rt,nh=new Ar;class Zn{constructor(e=0,t=0,i=0,r=Zn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],h=r[2],p=r[6],f=r[10];switch(t){case"XYZ":this._y=Math.asin(Bt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(p,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Bt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(Bt(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Bt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(p,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Bt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Bt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(p,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return th.makeRotationFromQuaternion(e),this.setFromRotationMatrix(th,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return nh.setFromEuler(this),this.setFromQuaternion(nh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Zn.DEFAULT_ORDER="XYZ";class wd{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let A0=0;const ih=new P,Qi=new Ar,kn=new rt,Ss=new P,Ur=new P,C0=new P,R0=new Ar,rh=new P(1,0,0),sh=new P(0,1,0),oh=new P(0,0,1),ah={type:"added"},P0={type:"removed"},er={type:"childadded",child:null},_a={type:"childremoved",child:null};class Et extends br{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:A0++}),this.uuid=Tr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Et.DEFAULT_UP.clone();const e=new P,t=new Zn,i=new Ar,r=new P(1,1,1);function s(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new rt},normalMatrix:{value:new qe}}),this.matrix=new rt,this.matrixWorld=new rt,this.matrixAutoUpdate=Et.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Et.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new wd,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Qi.setFromAxisAngle(e,t),this.quaternion.multiply(Qi),this}rotateOnWorldAxis(e,t){return Qi.setFromAxisAngle(e,t),this.quaternion.premultiply(Qi),this}rotateX(e){return this.rotateOnAxis(rh,e)}rotateY(e){return this.rotateOnAxis(sh,e)}rotateZ(e){return this.rotateOnAxis(oh,e)}translateOnAxis(e,t){return ih.copy(e).applyQuaternion(this.quaternion),this.position.add(ih.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(rh,e)}translateY(e){return this.translateOnAxis(sh,e)}translateZ(e){return this.translateOnAxis(oh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(kn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Ss.copy(e):Ss.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),Ur.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?kn.lookAt(Ur,Ss,this.up):kn.lookAt(Ss,Ur,this.up),this.quaternion.setFromRotationMatrix(kn),r&&(kn.extractRotation(r.matrixWorld),Qi.setFromRotationMatrix(kn),this.quaternion.premultiply(Qi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ah),er.child=e,this.dispatchEvent(er),er.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(P0),_a.child=e,this.dispatchEvent(_a),_a.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),kn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),kn.multiply(e.parent.matrixWorld)),e.applyMatrix4(kn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ah),er.child=e,this.dispatchEvent(er),er.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ur,e,C0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ur,R0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),h=o(e.shapes),p=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),p.length>0&&(i.skeletons=p),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=r,i;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Et.DEFAULT_UP=new P(0,1,0);Et.DEFAULT_MATRIX_AUTO_UPDATE=!0;Et.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const bn=new P,Hn=new P,va=new P,Vn=new P,tr=new P,nr=new P,lh=new P,xa=new P,ya=new P,Sa=new P,Ma=new gt,Ea=new gt,wa=new gt;class An{constructor(e=new P,t=new P,i=new P){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),bn.subVectors(e,t),r.cross(bn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){bn.subVectors(r,t),Hn.subVectors(i,t),va.subVectors(e,t);const o=bn.dot(bn),a=bn.dot(Hn),l=bn.dot(va),c=Hn.dot(Hn),u=Hn.dot(va),h=o*c-a*a;if(h===0)return s.set(0,0,0),null;const p=1/h,f=(c*l-a*u)*p,g=(o*u-a*l)*p;return s.set(1-f-g,g,f)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,Vn)===null?!1:Vn.x>=0&&Vn.y>=0&&Vn.x+Vn.y<=1}static getInterpolation(e,t,i,r,s,o,a,l){return this.getBarycoord(e,t,i,r,Vn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Vn.x),l.addScaledVector(o,Vn.y),l.addScaledVector(a,Vn.z),l)}static getInterpolatedAttribute(e,t,i,r,s,o){return Ma.setScalar(0),Ea.setScalar(0),wa.setScalar(0),Ma.fromBufferAttribute(e,t),Ea.fromBufferAttribute(e,i),wa.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(Ma,s.x),o.addScaledVector(Ea,s.y),o.addScaledVector(wa,s.z),o}static isFrontFacing(e,t,i,r){return bn.subVectors(i,t),Hn.subVectors(e,t),bn.cross(Hn).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return bn.subVectors(this.c,this.b),Hn.subVectors(this.a,this.b),bn.cross(Hn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return An.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return An.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return An.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return An.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return An.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let o,a;tr.subVectors(r,i),nr.subVectors(s,i),xa.subVectors(e,i);const l=tr.dot(xa),c=nr.dot(xa);if(l<=0&&c<=0)return t.copy(i);ya.subVectors(e,r);const u=tr.dot(ya),h=nr.dot(ya);if(u>=0&&h<=u)return t.copy(r);const p=l*h-u*c;if(p<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(i).addScaledVector(tr,o);Sa.subVectors(e,s);const f=tr.dot(Sa),g=nr.dot(Sa);if(g>=0&&f<=g)return t.copy(s);const _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(i).addScaledVector(nr,a);const d=u*g-f*h;if(d<=0&&h-u>=0&&f-g>=0)return lh.subVectors(s,r),a=(h-u)/(h-u+(f-g)),t.copy(r).addScaledVector(lh,a);const m=1/(d+_+p);return o=_*m,a=p*m,t.copy(i).addScaledVector(tr,o).addScaledVector(nr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const bd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},si={h:0,s:0,l:0},Ms={h:0,s:0,l:0};function ba(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class ze{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ot){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ht.toWorkingColorSpace(this,t),this}setRGB(e,t,i,r=ht.workingColorSpace){return this.r=e,this.g=t,this.b=i,ht.toWorkingColorSpace(this,r),this}setHSL(e,t,i,r=ht.workingColorSpace){if(e=d0(e,1),t=Bt(t,0,1),i=Bt(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,o=2*i-s;this.r=ba(o,s,e+1/3),this.g=ba(o,s,e),this.b=ba(o,s,e-1/3)}return ht.toWorkingColorSpace(this,r),this}setStyle(e,t=Ot){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ot){const i=bd[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=pr(e.r),this.g=pr(e.g),this.b=pr(e.b),this}copyLinearToSRGB(e){return this.r=ca(e.r),this.g=ca(e.g),this.b=ca(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ot){return ht.fromWorkingColorSpace(Xt.copy(this),e),Math.round(Bt(Xt.r*255,0,255))*65536+Math.round(Bt(Xt.g*255,0,255))*256+Math.round(Bt(Xt.b*255,0,255))}getHexString(e=Ot){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ht.workingColorSpace){ht.fromWorkingColorSpace(Xt.copy(this),t);const i=Xt.r,r=Xt.g,s=Xt.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=ht.workingColorSpace){return ht.fromWorkingColorSpace(Xt.copy(this),t),e.r=Xt.r,e.g=Xt.g,e.b=Xt.b,e}getStyle(e=Ot){ht.fromWorkingColorSpace(Xt.copy(this),e);const t=Xt.r,i=Xt.g,r=Xt.b;return e!==Ot?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(si),this.setHSL(si.h+e,si.s+t,si.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(si),e.getHSL(Ms);const i=aa(si.h,Ms.h,t),r=aa(si.s,Ms.s,t),s=aa(si.l,Ms.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Xt=new ze;ze.NAMES=bd;let L0=0;class Wi extends br{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:L0++}),this.uuid=Tr(),this.name="",this.type="Material",this.blending=fr,this.side=xi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=al,this.blendDst=ll,this.blendEquation=Ui,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ze(0,0,0),this.blendAlpha=0,this.depthFunc=gr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Yu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=qi,this.stencilZFail=qi,this.stencilZPass=qi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==fr&&(i.blending=this.blending),this.side!==xi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==al&&(i.blendSrc=this.blendSrc),this.blendDst!==ll&&(i.blendDst=this.blendDst),this.blendEquation!==Ui&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==gr&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Yu&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==qi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==qi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==qi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(t){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class on extends Wi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Zn,this.combine=ld,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ct=new P,Es=new se;class Ht{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=ju,this.updateRanges=[],this.gpuType=Un,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Es.fromBufferAttribute(this,t),Es.applyMatrix3(e),this.setXY(t,Es.x,Es.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix3(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix4(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.applyNormalMatrix(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.transformDirection(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Pr(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=nn(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Pr(t,this.array)),t}setX(e,t){return this.normalized&&(t=nn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Pr(t,this.array)),t}setY(e,t){return this.normalized&&(t=nn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Pr(t,this.array)),t}setZ(e,t){return this.normalized&&(t=nn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Pr(t,this.array)),t}setW(e,t){return this.normalized&&(t=nn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=nn(t,this.array),i=nn(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=nn(t,this.array),i=nn(i,this.array),r=nn(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=nn(t,this.array),i=nn(i,this.array),r=nn(r,this.array),s=nn(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ju&&(e.usage=this.usage),e}}class Td extends Ht{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Ad extends Ht{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class at extends Ht{constructor(e,t,i){super(new Float32Array(e),t,i)}}let I0=0;const xn=new rt,Ta=new Et,ir=new P,hn=new Si,Nr=new Si,Nt=new P;class Tt extends br{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:I0++}),this.uuid=Tr(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Sd(e)?Ad:Td)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new qe().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return xn.makeRotationFromQuaternion(e),this.applyMatrix4(xn),this}rotateX(e){return xn.makeRotationX(e),this.applyMatrix4(xn),this}rotateY(e){return xn.makeRotationY(e),this.applyMatrix4(xn),this}rotateZ(e){return xn.makeRotationZ(e),this.applyMatrix4(xn),this}translate(e,t,i){return xn.makeTranslation(e,t,i),this.applyMatrix4(xn),this}scale(e,t,i){return xn.makeScale(e,t,i),this.applyMatrix4(xn),this}lookAt(e){return Ta.lookAt(e),Ta.updateMatrix(),this.applyMatrix4(Ta.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ir).negate(),this.translate(ir.x,ir.y,ir.z),this}setFromPoints(e){const t=[];for(let i=0,r=e.length;i<r;i++){const s=e[i];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new at(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Si);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];hn.setFromBufferAttribute(s),this.morphTargetsRelative?(Nt.addVectors(this.boundingBox.min,hn.min),this.boundingBox.expandByPoint(Nt),Nt.addVectors(this.boundingBox.max,hn.max),this.boundingBox.expandByPoint(Nt)):(this.boundingBox.expandByPoint(hn.min),this.boundingBox.expandByPoint(hn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Gi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){const i=this.boundingSphere.center;if(hn.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const a=t[s];Nr.setFromBufferAttribute(a),this.morphTargetsRelative?(Nt.addVectors(hn.min,Nr.min),hn.expandByPoint(Nt),Nt.addVectors(hn.max,Nr.max),hn.expandByPoint(Nt)):(hn.expandByPoint(Nr.min),hn.expandByPoint(Nr.max))}hn.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)Nt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Nt));if(t)for(let s=0,o=t.length;s<o;s++){const a=t[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Nt.fromBufferAttribute(a,c),l&&(ir.fromBufferAttribute(e,c),Nt.add(ir)),r=Math.max(r,i.distanceToSquared(Nt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ht(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let L=0;L<i.count;L++)a[L]=new P,l[L]=new P;const c=new P,u=new P,h=new P,p=new se,f=new se,g=new se,_=new P,d=new P;function m(L,G,y){c.fromBufferAttribute(i,L),u.fromBufferAttribute(i,G),h.fromBufferAttribute(i,y),p.fromBufferAttribute(s,L),f.fromBufferAttribute(s,G),g.fromBufferAttribute(s,y),u.sub(c),h.sub(c),f.sub(p),g.sub(p);const E=1/(f.x*g.y-g.x*f.y);isFinite(E)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(h,-f.y).multiplyScalar(E),d.copy(h).multiplyScalar(f.x).addScaledVector(u,-g.x).multiplyScalar(E),a[L].add(_),a[G].add(_),a[y].add(_),l[L].add(d),l[G].add(d),l[y].add(d))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let L=0,G=v.length;L<G;++L){const y=v[L],E=y.start,F=y.count;for(let O=E,H=E+F;O<H;O+=3)m(e.getX(O+0),e.getX(O+1),e.getX(O+2))}const x=new P,S=new P,R=new P,b=new P;function A(L){R.fromBufferAttribute(r,L),b.copy(R);const G=a[L];x.copy(G),x.sub(R.multiplyScalar(R.dot(G))).normalize(),S.crossVectors(b,G);const E=S.dot(l[L])<0?-1:1;o.setXYZW(L,x.x,x.y,x.z,E)}for(let L=0,G=v.length;L<G;++L){const y=v[L],E=y.start,F=y.count;for(let O=E,H=E+F;O<H;O+=3)A(e.getX(O+0)),A(e.getX(O+1)),A(e.getX(O+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Ht(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let p=0,f=i.count;p<f;p++)i.setXYZ(p,0,0,0);const r=new P,s=new P,o=new P,a=new P,l=new P,c=new P,u=new P,h=new P;if(e)for(let p=0,f=e.count;p<f;p+=3){const g=e.getX(p+0),_=e.getX(p+1),d=e.getX(p+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,_),o.fromBufferAttribute(t,d),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),a.fromBufferAttribute(i,g),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,d),a.add(u),l.add(u),c.add(u),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(d,c.x,c.y,c.z)}else for(let p=0,f=t.count;p<f;p+=3)r.fromBufferAttribute(t,p+0),s.fromBufferAttribute(t,p+1),o.fromBufferAttribute(t,p+2),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),i.setXYZ(p+0,u.x,u.y,u.z),i.setXYZ(p+1,u.x,u.y,u.z),i.setXYZ(p+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Nt.fromBufferAttribute(e,t),Nt.normalize(),e.setXYZ(t,Nt.x,Nt.y,Nt.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,h=a.normalized,p=new c.constructor(l.length*u);let f=0,g=0;for(let _=0,d=l.length;_<d;_++){a.isInterleavedBufferAttribute?f=l[_]*a.data.stride+a.offset:f=l[_]*u;for(let m=0;m<u;m++)p[g++]=c[f++]}return new Ht(p,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Tt,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=e(l,i);t.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let u=0,h=c.length;u<h;u++){const p=c[u],f=e(p,i);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,p=c.length;h<p;h++){const f=c[h];u.push(f.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(t))}const s=e.morphAttributes;for(const c in s){const u=[],h=s[c];for(let p=0,f=h.length;p<f;p++)u.push(h[p].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ch=new rt,bi=new Tc,ws=new Gi,uh=new P,bs=new P,Ts=new P,As=new P,Aa=new P,Cs=new P,hh=new P,Rs=new P;class Je extends Et{constructor(e=new Tt,t=new on){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){Cs.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=a[l],h=s[l];u!==0&&(Aa.fromBufferAttribute(h,e),o?Cs.addScaledVector(Aa,u):Cs.addScaledVector(Aa.sub(t),u))}t.add(Cs)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),ws.copy(i.boundingSphere),ws.applyMatrix4(s),bi.copy(e.ray).recast(e.near),!(ws.containsPoint(bi.origin)===!1&&(bi.intersectSphere(ws,uh)===null||bi.origin.distanceToSquared(uh)>(e.far-e.near)**2))&&(ch.copy(s).invert(),bi.copy(e.ray).applyMatrix4(ch),!(i.boundingBox!==null&&bi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,bi)))}_computeIntersections(e,t,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,p=s.groups,f=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=p.length;g<_;g++){const d=p[g],m=o[d.materialIndex],v=Math.max(d.start,f.start),x=Math.min(a.count,Math.min(d.start+d.count,f.start+f.count));for(let S=v,R=x;S<R;S+=3){const b=a.getX(S),A=a.getX(S+1),L=a.getX(S+2);r=Ps(this,m,e,i,c,u,h,b,A,L),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=d.materialIndex,t.push(r))}}else{const g=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let d=g,m=_;d<m;d+=3){const v=a.getX(d),x=a.getX(d+1),S=a.getX(d+2);r=Ps(this,o,e,i,c,u,h,v,x,S),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=p.length;g<_;g++){const d=p[g],m=o[d.materialIndex],v=Math.max(d.start,f.start),x=Math.min(l.count,Math.min(d.start+d.count,f.start+f.count));for(let S=v,R=x;S<R;S+=3){const b=S,A=S+1,L=S+2;r=Ps(this,m,e,i,c,u,h,b,A,L),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=d.materialIndex,t.push(r))}}else{const g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let d=g,m=_;d<m;d+=3){const v=d,x=d+1,S=d+2;r=Ps(this,o,e,i,c,u,h,v,x,S),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}}function D0(n,e,t,i,r,s,o,a){let l;if(e.side===$t?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===xi,a),l===null)return null;Rs.copy(a),Rs.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Rs);return c<t.near||c>t.far?null:{distance:c,point:Rs.clone(),object:n}}function Ps(n,e,t,i,r,s,o,a,l,c){n.getVertexPosition(a,bs),n.getVertexPosition(l,Ts),n.getVertexPosition(c,As);const u=D0(n,e,t,i,bs,Ts,As,hh);if(u){const h=new P;An.getBarycoord(hh,bs,Ts,As,h),r&&(u.uv=An.getInterpolatedAttribute(r,a,l,c,h,new se)),s&&(u.uv1=An.getInterpolatedAttribute(s,a,l,c,h,new se)),o&&(u.normal=An.getInterpolatedAttribute(o,a,l,c,h,new P),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const p={a,b:l,c,normal:new P,materialIndex:0};An.getNormal(bs,Ts,As,p.normal),u.face=p,u.barycoord=h}return u}class Cr extends Tt{constructor(e=1,t=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],u=[],h=[];let p=0,f=0;g("z","y","x",-1,-1,i,t,e,o,s,0),g("z","y","x",1,-1,i,t,-e,o,s,1),g("x","z","y",1,1,e,i,t,r,o,2),g("x","z","y",1,-1,e,i,-t,r,o,3),g("x","y","z",1,-1,e,t,i,r,s,4),g("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new at(c,3)),this.setAttribute("normal",new at(u,3)),this.setAttribute("uv",new at(h,2));function g(_,d,m,v,x,S,R,b,A,L,G){const y=S/A,E=R/L,F=S/2,O=R/2,H=b/2,j=A+1,B=L+1;let X=0,V=0;const re=new P;for(let oe=0;oe<B;oe++){const le=oe*E-O;for(let Xe=0;Xe<j;Xe++){const et=Xe*y-F;re[_]=et*v,re[d]=le*x,re[m]=H,c.push(re.x,re.y,re.z),re[_]=0,re[d]=0,re[m]=b>0?1:-1,u.push(re.x,re.y,re.z),h.push(Xe/A),h.push(1-oe/L),X+=1}}for(let oe=0;oe<L;oe++)for(let le=0;le<A;le++){const Xe=p+le+j*oe,et=p+le+j*(oe+1),$=p+(le+1)+j*(oe+1),ee=p+(le+1)+j*oe;l.push(Xe,et,ee),l.push(et,$,ee),V+=6}a.addGroup(f,V,G),f+=V,p+=X}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Cr(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Sr(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function jt(n){const e={};for(let t=0;t<n.length;t++){const i=Sr(n[t]);for(const r in i)e[r]=i[r]}return e}function U0(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Cd(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ht.workingColorSpace}const N0={clone:Sr,merge:jt};var F0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,O0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Jn extends Wi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=F0,this.fragmentShader=O0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Sr(e.uniforms),this.uniformsGroups=U0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Rd extends Et{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new rt,this.projectionMatrix=new rt,this.projectionMatrixInverse=new rt,this.coordinateSystem=Xn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const oi=new P,fh=new se,dh=new se;class yn extends Rd{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=$l*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(oa*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return $l*2*Math.atan(Math.tan(oa*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){oi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(oi.x,oi.y).multiplyScalar(-e/oi.z),oi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(oi.x,oi.y).multiplyScalar(-e/oi.z)}getViewSize(e,t){return this.getViewBounds(e,fh,dh),t.subVectors(dh,fh)}setViewOffset(e,t,i,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(oa*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,t-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const rr=-90,sr=1;class B0 extends Et{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new yn(rr,sr,e,t);r.layers=this.layers,this.add(r);const s=new yn(rr,sr,e,t);s.layers=this.layers,this.add(s);const o=new yn(rr,sr,e,t);o.layers=this.layers,this.add(o);const a=new yn(rr,sr,e,t);a.layers=this.layers,this.add(a);const l=new yn(rr,sr,e,t);l.layers=this.layers,this.add(l);const c=new yn(rr,sr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,o,a,l]=t;for(const c of t)this.remove(c);if(e===Xn)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===wo)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,u]=this.children,h=e.getRenderTarget(),p=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,o),e.setRenderTarget(i,2,r),e.render(t,a),e.setRenderTarget(i,3,r),e.render(t,l),e.setRenderTarget(i,4,r),e.render(t,c),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,r),e.render(t,u),e.setRenderTarget(h,p,f),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Pd extends qt{constructor(e,t,i,r,s,o,a,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:_r,super(e,t,i,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class z0 extends Hi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Pd(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Tn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Cr(5,5,5),s=new Jn({name:"CubemapFromEquirect",uniforms:Sr(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:$t,blending:gi});s.uniforms.tEquirect.value=t;const o=new Je(r,s),a=t.minFilter;return t.minFilter===zi&&(t.minFilter=Tn),new B0(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,i,r){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(s)}}const Ca=new P,k0=new P,H0=new qe;class Ri{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=Ca.subVectors(i,t).cross(k0.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Ca),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||H0.getNormalMatrix(e),r=this.coplanarPoint(Ca).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ti=new Gi,Ls=new P;class Ac{constructor(e=new Ri,t=new Ri,i=new Ri,r=new Ri,s=new Ri,o=new Ri){this.planes=[e,t,i,r,s,o]}set(e,t,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Xn){const i=this.planes,r=e.elements,s=r[0],o=r[1],a=r[2],l=r[3],c=r[4],u=r[5],h=r[6],p=r[7],f=r[8],g=r[9],_=r[10],d=r[11],m=r[12],v=r[13],x=r[14],S=r[15];if(i[0].setComponents(l-s,p-c,d-f,S-m).normalize(),i[1].setComponents(l+s,p+c,d+f,S+m).normalize(),i[2].setComponents(l+o,p+u,d+g,S+v).normalize(),i[3].setComponents(l-o,p-u,d-g,S-v).normalize(),i[4].setComponents(l-a,p-h,d-_,S-x).normalize(),t===Xn)i[5].setComponents(l+a,p+h,d+_,S+x).normalize();else if(t===wo)i[5].setComponents(a,h,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ti.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ti.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ti)}intersectsSprite(e){return Ti.center.set(0,0,0),Ti.radius=.7071067811865476,Ti.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ti)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(Ls.x=r.normal.x>0?e.max.x:e.min.x,Ls.y=r.normal.y>0?e.max.y:e.min.y,Ls.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Ls)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Ld(){let n=null,e=!1,t=null,i=null;function r(s,o){t(s,o),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function V0(n){const e=new WeakMap;function t(a,l){const c=a.array,u=a.usage,h=c.byteLength,p=n.createBuffer();n.bindBuffer(l,p),n.bufferData(l,c,u),a.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:p,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function i(a,l,c){const u=l.array,h=l.updateRanges;if(n.bindBuffer(c,a),h.length===0)n.bufferSubData(c,0,u);else{h.sort((f,g)=>f.start-g.start);let p=0;for(let f=1;f<h.length;f++){const g=h[p],_=h[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++p,h[p]=_)}h.length=p+1;for(let f=0,g=h.length;f<g;f++){const _=h[f];n.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(n.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}class It extends Tt{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,o=t/2,a=Math.floor(i),l=Math.floor(r),c=a+1,u=l+1,h=e/a,p=t/l,f=[],g=[],_=[],d=[];for(let m=0;m<u;m++){const v=m*p-o;for(let x=0;x<c;x++){const S=x*h-s;g.push(S,-v,0),_.push(0,0,1),d.push(x/a),d.push(1-m/l)}}for(let m=0;m<l;m++)for(let v=0;v<a;v++){const x=v+c*m,S=v+c*(m+1),R=v+1+c*(m+1),b=v+1+c*m;f.push(x,S,b),f.push(S,R,b)}this.setIndex(f),this.setAttribute("position",new at(g,3)),this.setAttribute("normal",new at(_,3)),this.setAttribute("uv",new at(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new It(e.width,e.height,e.widthSegments,e.heightSegments)}}var G0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,W0=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,X0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,$0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,q0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Y0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,j0=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,K0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Z0=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,J0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Q0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,e_=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,t_=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,n_=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,i_=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,r_=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,s_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,o_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,a_=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,l_=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,c_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,u_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,h_=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,f_=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,d_=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,p_=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,m_=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,g_=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,__=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,v_=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,x_="gl_FragColor = linearToOutputTexel( gl_FragColor );",y_=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,S_=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,M_=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,E_=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,w_=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,b_=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,T_=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,A_=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,C_=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,R_=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,P_=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,L_=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,I_=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,D_=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,U_=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,N_=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,F_=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,O_=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,B_=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,z_=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,k_=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,H_=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,V_=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,G_=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,W_=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,X_=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,$_=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,q_=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Y_=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,j_=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,K_=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Z_=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,J_=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Q_=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ev=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,tv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,nv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,iv=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,rv=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,sv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ov=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,av=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,lv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,cv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,uv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,hv=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,fv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,dv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,pv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,mv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,gv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,_v=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,vv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,xv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,yv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Sv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Mv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ev=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,wv=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,bv=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Tv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Av=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Cv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Rv=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Pv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Lv=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Iv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Dv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Uv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Nv=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Fv=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Ov=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Bv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,zv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,kv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Hv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Vv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Gv=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Xv=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$v=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,qv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Yv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,jv=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Kv=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Zv=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Jv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Qv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ex=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,tx=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,nx=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,ix=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rx=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,sx=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ox=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,ax=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lx=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,cx=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,ux=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,hx=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fx=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,dx=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,px=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,mx=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gx=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,_x=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,vx=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,xx=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,yx=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Sx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,$e={alphahash_fragment:G0,alphahash_pars_fragment:W0,alphamap_fragment:X0,alphamap_pars_fragment:$0,alphatest_fragment:q0,alphatest_pars_fragment:Y0,aomap_fragment:j0,aomap_pars_fragment:K0,batching_pars_vertex:Z0,batching_vertex:J0,begin_vertex:Q0,beginnormal_vertex:e_,bsdfs:t_,iridescence_fragment:n_,bumpmap_pars_fragment:i_,clipping_planes_fragment:r_,clipping_planes_pars_fragment:s_,clipping_planes_pars_vertex:o_,clipping_planes_vertex:a_,color_fragment:l_,color_pars_fragment:c_,color_pars_vertex:u_,color_vertex:h_,common:f_,cube_uv_reflection_fragment:d_,defaultnormal_vertex:p_,displacementmap_pars_vertex:m_,displacementmap_vertex:g_,emissivemap_fragment:__,emissivemap_pars_fragment:v_,colorspace_fragment:x_,colorspace_pars_fragment:y_,envmap_fragment:S_,envmap_common_pars_fragment:M_,envmap_pars_fragment:E_,envmap_pars_vertex:w_,envmap_physical_pars_fragment:N_,envmap_vertex:b_,fog_vertex:T_,fog_pars_vertex:A_,fog_fragment:C_,fog_pars_fragment:R_,gradientmap_pars_fragment:P_,lightmap_pars_fragment:L_,lights_lambert_fragment:I_,lights_lambert_pars_fragment:D_,lights_pars_begin:U_,lights_toon_fragment:F_,lights_toon_pars_fragment:O_,lights_phong_fragment:B_,lights_phong_pars_fragment:z_,lights_physical_fragment:k_,lights_physical_pars_fragment:H_,lights_fragment_begin:V_,lights_fragment_maps:G_,lights_fragment_end:W_,logdepthbuf_fragment:X_,logdepthbuf_pars_fragment:$_,logdepthbuf_pars_vertex:q_,logdepthbuf_vertex:Y_,map_fragment:j_,map_pars_fragment:K_,map_particle_fragment:Z_,map_particle_pars_fragment:J_,metalnessmap_fragment:Q_,metalnessmap_pars_fragment:ev,morphinstance_vertex:tv,morphcolor_vertex:nv,morphnormal_vertex:iv,morphtarget_pars_vertex:rv,morphtarget_vertex:sv,normal_fragment_begin:ov,normal_fragment_maps:av,normal_pars_fragment:lv,normal_pars_vertex:cv,normal_vertex:uv,normalmap_pars_fragment:hv,clearcoat_normal_fragment_begin:fv,clearcoat_normal_fragment_maps:dv,clearcoat_pars_fragment:pv,iridescence_pars_fragment:mv,opaque_fragment:gv,packing:_v,premultiplied_alpha_fragment:vv,project_vertex:xv,dithering_fragment:yv,dithering_pars_fragment:Sv,roughnessmap_fragment:Mv,roughnessmap_pars_fragment:Ev,shadowmap_pars_fragment:wv,shadowmap_pars_vertex:bv,shadowmap_vertex:Tv,shadowmask_pars_fragment:Av,skinbase_vertex:Cv,skinning_pars_vertex:Rv,skinning_vertex:Pv,skinnormal_vertex:Lv,specularmap_fragment:Iv,specularmap_pars_fragment:Dv,tonemapping_fragment:Uv,tonemapping_pars_fragment:Nv,transmission_fragment:Fv,transmission_pars_fragment:Ov,uv_pars_fragment:Bv,uv_pars_vertex:zv,uv_vertex:kv,worldpos_vertex:Hv,background_vert:Vv,background_frag:Gv,backgroundCube_vert:Wv,backgroundCube_frag:Xv,cube_vert:$v,cube_frag:qv,depth_vert:Yv,depth_frag:jv,distanceRGBA_vert:Kv,distanceRGBA_frag:Zv,equirect_vert:Jv,equirect_frag:Qv,linedashed_vert:ex,linedashed_frag:tx,meshbasic_vert:nx,meshbasic_frag:ix,meshlambert_vert:rx,meshlambert_frag:sx,meshmatcap_vert:ox,meshmatcap_frag:ax,meshnormal_vert:lx,meshnormal_frag:cx,meshphong_vert:ux,meshphong_frag:hx,meshphysical_vert:fx,meshphysical_frag:dx,meshtoon_vert:px,meshtoon_frag:mx,points_vert:gx,points_frag:_x,shadow_vert:vx,shadow_frag:xx,sprite_vert:yx,sprite_frag:Sx},pe={common:{diffuse:{value:new ze(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new qe}},envmap:{envMap:{value:null},envMapRotation:{value:new qe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new qe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new qe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new qe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new qe},normalScale:{value:new se(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new qe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new qe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new qe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new qe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ze(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ze(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0},uvTransform:{value:new qe}},sprite:{diffuse:{value:new ze(16777215)},opacity:{value:1},center:{value:new se(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}}},In={basic:{uniforms:jt([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.fog]),vertexShader:$e.meshbasic_vert,fragmentShader:$e.meshbasic_frag},lambert:{uniforms:jt([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new ze(0)}}]),vertexShader:$e.meshlambert_vert,fragmentShader:$e.meshlambert_frag},phong:{uniforms:jt([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new ze(0)},specular:{value:new ze(1118481)},shininess:{value:30}}]),vertexShader:$e.meshphong_vert,fragmentShader:$e.meshphong_frag},standard:{uniforms:jt([pe.common,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.roughnessmap,pe.metalnessmap,pe.fog,pe.lights,{emissive:{value:new ze(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag},toon:{uniforms:jt([pe.common,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.gradientmap,pe.fog,pe.lights,{emissive:{value:new ze(0)}}]),vertexShader:$e.meshtoon_vert,fragmentShader:$e.meshtoon_frag},matcap:{uniforms:jt([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,{matcap:{value:null}}]),vertexShader:$e.meshmatcap_vert,fragmentShader:$e.meshmatcap_frag},points:{uniforms:jt([pe.points,pe.fog]),vertexShader:$e.points_vert,fragmentShader:$e.points_frag},dashed:{uniforms:jt([pe.common,pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$e.linedashed_vert,fragmentShader:$e.linedashed_frag},depth:{uniforms:jt([pe.common,pe.displacementmap]),vertexShader:$e.depth_vert,fragmentShader:$e.depth_frag},normal:{uniforms:jt([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,{opacity:{value:1}}]),vertexShader:$e.meshnormal_vert,fragmentShader:$e.meshnormal_frag},sprite:{uniforms:jt([pe.sprite,pe.fog]),vertexShader:$e.sprite_vert,fragmentShader:$e.sprite_frag},background:{uniforms:{uvTransform:{value:new qe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$e.background_vert,fragmentShader:$e.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new qe}},vertexShader:$e.backgroundCube_vert,fragmentShader:$e.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$e.cube_vert,fragmentShader:$e.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$e.equirect_vert,fragmentShader:$e.equirect_frag},distanceRGBA:{uniforms:jt([pe.common,pe.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$e.distanceRGBA_vert,fragmentShader:$e.distanceRGBA_frag},shadow:{uniforms:jt([pe.lights,pe.fog,{color:{value:new ze(0)},opacity:{value:1}}]),vertexShader:$e.shadow_vert,fragmentShader:$e.shadow_frag}};In.physical={uniforms:jt([In.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new qe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new qe},clearcoatNormalScale:{value:new se(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new qe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new qe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new qe},sheen:{value:0},sheenColor:{value:new ze(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new qe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new qe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new qe},transmissionSamplerSize:{value:new se},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new qe},attenuationDistance:{value:0},attenuationColor:{value:new ze(0)},specularColor:{value:new ze(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new qe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new qe},anisotropyVector:{value:new se},anisotropyMap:{value:null},anisotropyMapTransform:{value:new qe}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag};const Is={r:0,b:0,g:0},Ai=new Zn,Mx=new rt;function Ex(n,e,t,i,r,s,o){const a=new ze(0);let l=s===!0?0:1,c,u,h=null,p=0,f=null;function g(v){let x=v.isScene===!0?v.background:null;return x&&x.isTexture&&(x=(v.backgroundBlurriness>0?t:e).get(x)),x}function _(v){let x=!1;const S=g(v);S===null?m(a,l):S&&S.isColor&&(m(S,1),x=!0);const R=n.xr.getEnvironmentBlendMode();R==="additive"?i.buffers.color.setClear(0,0,0,1,o):R==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function d(v,x){const S=g(x);S&&(S.isCubeTexture||S.mapping===Fo)?(u===void 0&&(u=new Je(new Cr(1,1,1),new Jn({name:"BackgroundCubeMaterial",uniforms:Sr(In.backgroundCube.uniforms),vertexShader:In.backgroundCube.vertexShader,fragmentShader:In.backgroundCube.fragmentShader,side:$t,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(R,b,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),Ai.copy(x.backgroundRotation),Ai.x*=-1,Ai.y*=-1,Ai.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(Ai.y*=-1,Ai.z*=-1),u.material.uniforms.envMap.value=S,u.material.uniforms.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Mx.makeRotationFromEuler(Ai)),u.material.toneMapped=ht.getTransfer(S.colorSpace)!==vt,(h!==S||p!==S.version||f!==n.toneMapping)&&(u.material.needsUpdate=!0,h=S,p=S.version,f=n.toneMapping),u.layers.enableAll(),v.unshift(u,u.geometry,u.material,0,0,null)):S&&S.isTexture&&(c===void 0&&(c=new Je(new It(2,2),new Jn({name:"BackgroundMaterial",uniforms:Sr(In.background.uniforms),vertexShader:In.background.vertexShader,fragmentShader:In.background.fragmentShader,side:xi,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=S,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=ht.getTransfer(S.colorSpace)!==vt,S.matrixAutoUpdate===!0&&S.updateMatrix(),c.material.uniforms.uvTransform.value.copy(S.matrix),(h!==S||p!==S.version||f!==n.toneMapping)&&(c.material.needsUpdate=!0,h=S,p=S.version,f=n.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function m(v,x){v.getRGB(Is,Cd(n)),i.buffers.color.setClear(Is.r,Is.g,Is.b,x,o)}return{getClearColor:function(){return a},setClearColor:function(v,x=1){a.set(v),l=x,m(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(v){l=v,m(a,l)},render:_,addToRenderList:d}}function wx(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=p(null);let s=r,o=!1;function a(y,E,F,O,H){let j=!1;const B=h(O,F,E);s!==B&&(s=B,c(s.object)),j=f(y,O,F,H),j&&g(y,O,F,H),H!==null&&e.update(H,n.ELEMENT_ARRAY_BUFFER),(j||o)&&(o=!1,S(y,E,F,O),H!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function l(){return n.createVertexArray()}function c(y){return n.bindVertexArray(y)}function u(y){return n.deleteVertexArray(y)}function h(y,E,F){const O=F.wireframe===!0;let H=i[y.id];H===void 0&&(H={},i[y.id]=H);let j=H[E.id];j===void 0&&(j={},H[E.id]=j);let B=j[O];return B===void 0&&(B=p(l()),j[O]=B),B}function p(y){const E=[],F=[],O=[];for(let H=0;H<t;H++)E[H]=0,F[H]=0,O[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:E,enabledAttributes:F,attributeDivisors:O,object:y,attributes:{},index:null}}function f(y,E,F,O){const H=s.attributes,j=E.attributes;let B=0;const X=F.getAttributes();for(const V in X)if(X[V].location>=0){const oe=H[V];let le=j[V];if(le===void 0&&(V==="instanceMatrix"&&y.instanceMatrix&&(le=y.instanceMatrix),V==="instanceColor"&&y.instanceColor&&(le=y.instanceColor)),oe===void 0||oe.attribute!==le||le&&oe.data!==le.data)return!0;B++}return s.attributesNum!==B||s.index!==O}function g(y,E,F,O){const H={},j=E.attributes;let B=0;const X=F.getAttributes();for(const V in X)if(X[V].location>=0){let oe=j[V];oe===void 0&&(V==="instanceMatrix"&&y.instanceMatrix&&(oe=y.instanceMatrix),V==="instanceColor"&&y.instanceColor&&(oe=y.instanceColor));const le={};le.attribute=oe,oe&&oe.data&&(le.data=oe.data),H[V]=le,B++}s.attributes=H,s.attributesNum=B,s.index=O}function _(){const y=s.newAttributes;for(let E=0,F=y.length;E<F;E++)y[E]=0}function d(y){m(y,0)}function m(y,E){const F=s.newAttributes,O=s.enabledAttributes,H=s.attributeDivisors;F[y]=1,O[y]===0&&(n.enableVertexAttribArray(y),O[y]=1),H[y]!==E&&(n.vertexAttribDivisor(y,E),H[y]=E)}function v(){const y=s.newAttributes,E=s.enabledAttributes;for(let F=0,O=E.length;F<O;F++)E[F]!==y[F]&&(n.disableVertexAttribArray(F),E[F]=0)}function x(y,E,F,O,H,j,B){B===!0?n.vertexAttribIPointer(y,E,F,H,j):n.vertexAttribPointer(y,E,F,O,H,j)}function S(y,E,F,O){_();const H=O.attributes,j=F.getAttributes(),B=E.defaultAttributeValues;for(const X in j){const V=j[X];if(V.location>=0){let re=H[X];if(re===void 0&&(X==="instanceMatrix"&&y.instanceMatrix&&(re=y.instanceMatrix),X==="instanceColor"&&y.instanceColor&&(re=y.instanceColor)),re!==void 0){const oe=re.normalized,le=re.itemSize,Xe=e.get(re);if(Xe===void 0)continue;const et=Xe.buffer,$=Xe.type,ee=Xe.bytesPerElement,ve=$===n.INT||$===n.UNSIGNED_INT||re.gpuType===xc;if(re.isInterleavedBufferAttribute){const he=re.data,Ne=he.stride,De=re.offset;if(he.isInstancedInterleavedBuffer){for(let Ve=0;Ve<V.locationSize;Ve++)m(V.location+Ve,he.meshPerAttribute);y.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=he.meshPerAttribute*he.count)}else for(let Ve=0;Ve<V.locationSize;Ve++)d(V.location+Ve);n.bindBuffer(n.ARRAY_BUFFER,et);for(let Ve=0;Ve<V.locationSize;Ve++)x(V.location+Ve,le/V.locationSize,$,oe,Ne*ee,(De+le/V.locationSize*Ve)*ee,ve)}else{if(re.isInstancedBufferAttribute){for(let he=0;he<V.locationSize;he++)m(V.location+he,re.meshPerAttribute);y.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let he=0;he<V.locationSize;he++)d(V.location+he);n.bindBuffer(n.ARRAY_BUFFER,et);for(let he=0;he<V.locationSize;he++)x(V.location+he,le/V.locationSize,$,oe,le*ee,le/V.locationSize*he*ee,ve)}}else if(B!==void 0){const oe=B[X];if(oe!==void 0)switch(oe.length){case 2:n.vertexAttrib2fv(V.location,oe);break;case 3:n.vertexAttrib3fv(V.location,oe);break;case 4:n.vertexAttrib4fv(V.location,oe);break;default:n.vertexAttrib1fv(V.location,oe)}}}}v()}function R(){L();for(const y in i){const E=i[y];for(const F in E){const O=E[F];for(const H in O)u(O[H].object),delete O[H];delete E[F]}delete i[y]}}function b(y){if(i[y.id]===void 0)return;const E=i[y.id];for(const F in E){const O=E[F];for(const H in O)u(O[H].object),delete O[H];delete E[F]}delete i[y.id]}function A(y){for(const E in i){const F=i[E];if(F[y.id]===void 0)continue;const O=F[y.id];for(const H in O)u(O[H].object),delete O[H];delete F[y.id]}}function L(){G(),o=!0,s!==r&&(s=r,c(s.object))}function G(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:L,resetDefaultState:G,dispose:R,releaseStatesOfGeometry:b,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:d,disableUnusedAttributes:v}}function bx(n,e,t){let i;function r(c){i=c}function s(c,u){n.drawArrays(i,c,u),t.update(u,i,1)}function o(c,u,h){h!==0&&(n.drawArraysInstanced(i,c,u,h),t.update(u,i,h))}function a(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,h);let f=0;for(let g=0;g<h;g++)f+=u[g];t.update(f,i,1)}function l(c,u,h,p){if(h===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)o(c[g],u[g],p[g]);else{f.multiDrawArraysInstancedWEBGL(i,c,0,u,0,p,0,h);let g=0;for(let _=0;_<h;_++)g+=u[_];for(let _=0;_<p.length;_++)t.update(g,i,p[_])}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Tx(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(A){return!(A!==Cn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){const L=A===ss&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Kn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Un&&!L)}function l(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=t.logarithmicDepthBuffer===!0,p=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control");if(p===!0){const A=e.get("EXT_clip_control");A.clipControlEXT(A.LOWER_LEFT_EXT,A.ZERO_TO_ONE_EXT)}const f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),d=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),m=n.getParameter(n.MAX_VERTEX_ATTRIBS),v=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),S=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),R=g>0,b=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reverseDepthBuffer:p,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:d,maxAttributes:m,maxVertexUniforms:v,maxVaryings:x,maxFragmentUniforms:S,vertexTextures:R,maxSamples:b}}function Ax(n){const e=this;let t=null,i=0,r=!1,s=!1;const o=new Ri,a=new qe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,p){const f=h.length!==0||p||i!==0||r;return r=p,i=h.length,f},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,p){t=u(h,p,0)},this.setState=function(h,p,f){const g=h.clippingPlanes,_=h.clipIntersection,d=h.clipShadows,m=n.get(h);if(!r||g===null||g.length===0||s&&!d)s?u(null):c();else{const v=s?0:i,x=v*4;let S=m.clippingState||null;l.value=S,S=u(g,p,x,f);for(let R=0;R!==x;++R)S[R]=t[R];m.clippingState=S,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,p,f,g){const _=h!==null?h.length:0;let d=null;if(_!==0){if(d=l.value,g!==!0||d===null){const m=f+_*4,v=p.matrixWorldInverse;a.getNormalMatrix(v),(d===null||d.length<m)&&(d=new Float32Array(m));for(let x=0,S=f;x!==_;++x,S+=4)o.copy(h[x]).applyMatrix4(v,a),o.normal.toArray(d,S),d[S+3]=o.constant}l.value=d,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,d}}function Cx(n){let e=new WeakMap;function t(o,a){return a===gl?o.mapping=_r:a===_l&&(o.mapping=vr),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===gl||a===_l)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new z0(l.height);return c.fromEquirectangularTexture(n,o),e.set(o,c),o.addEventListener("dispose",r),t(c.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class Id extends Rd{constructor(e=-1,t=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const ur=4,ph=[.125,.215,.35,.446,.526,.582],Ni=20,Ra=new Id,mh=new ze;let Pa=null,La=0,Ia=0,Da=!1;const Pi=(1+Math.sqrt(5))/2,or=1/Pi,gh=[new P(-Pi,or,0),new P(Pi,or,0),new P(-or,0,Pi),new P(or,0,Pi),new P(0,Pi,-or),new P(0,Pi,or),new P(-1,1,-1),new P(1,1,-1),new P(-1,1,1),new P(1,1,1)];class _h{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100){Pa=this._renderer.getRenderTarget(),La=this._renderer.getActiveCubeFace(),Ia=this._renderer.getActiveMipmapLevel(),Da=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=yh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=xh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Pa,La,Ia),this._renderer.xr.enabled=Da,e.scissorTest=!1,Ds(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===_r||e.mapping===vr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Pa=this._renderer.getRenderTarget(),La=this._renderer.getActiveCubeFace(),Ia=this._renderer.getActiveMipmapLevel(),Da=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Tn,minFilter:Tn,generateMipmaps:!1,type:ss,format:Cn,colorSpace:yi,depthBuffer:!1},r=vh(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=vh(e,t,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Rx(s)),this._blurMaterial=Px(s,e,t)}return r}_compileMaterial(e){const t=new Je(this._lodPlanes[0],e);this._renderer.compile(t,Ra)}_sceneToCubeUV(e,t,i,r){const a=new yn(90,1,t,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,p=u.toneMapping;u.getClearColor(mh),u.toneMapping=_i,u.autoClear=!1;const f=new on({name:"PMREM.Background",side:$t,depthWrite:!1,depthTest:!1}),g=new Je(new Cr,f);let _=!1;const d=e.background;d?d.isColor&&(f.color.copy(d),e.background=null,_=!0):(f.color.copy(mh),_=!0);for(let m=0;m<6;m++){const v=m%3;v===0?(a.up.set(0,l[m],0),a.lookAt(c[m],0,0)):v===1?(a.up.set(0,0,l[m]),a.lookAt(0,c[m],0)):(a.up.set(0,l[m],0),a.lookAt(0,0,c[m]));const x=this._cubeSize;Ds(r,v*x,m>2?x:0,x,x),u.setRenderTarget(r),_&&u.render(g,a),u.render(e,a)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=p,u.autoClear=h,e.background=d}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===_r||e.mapping===vr;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=yh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=xh());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new Je(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;Ds(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,Ra)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=gh[(r-s-1)%gh.length];this._blur(e,s-1,s,o,a)}t.autoClear=i}_blur(e,t,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new Je(this._lodPlanes[r],c),p=c.uniforms,f=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*Ni-1),_=s/g,d=isFinite(s)?1+Math.floor(u*_):Ni;d>Ni&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${d} samples when the maximum is set to ${Ni}`);const m=[];let v=0;for(let A=0;A<Ni;++A){const L=A/_,G=Math.exp(-L*L/2);m.push(G),A===0?v+=G:A<d&&(v+=2*G)}for(let A=0;A<m.length;A++)m[A]=m[A]/v;p.envMap.value=e.texture,p.samples.value=d,p.weights.value=m,p.latitudinal.value=o==="latitudinal",a&&(p.poleAxis.value=a);const{_lodMax:x}=this;p.dTheta.value=g,p.mipInt.value=x-i;const S=this._sizeLods[r],R=3*S*(r>x-ur?r-x+ur:0),b=4*(this._cubeSize-S);Ds(t,R,b,3*S,2*S),l.setRenderTarget(t),l.render(h,Ra)}}function Rx(n){const e=[],t=[],i=[];let r=n;const s=n-ur+1+ph.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);t.push(a);let l=1/a;o>n-ur?l=ph[o-n+ur-1]:o===0&&(l=0),i.push(l);const c=1/(a-2),u=-c,h=1+c,p=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,g=6,_=3,d=2,m=1,v=new Float32Array(_*g*f),x=new Float32Array(d*g*f),S=new Float32Array(m*g*f);for(let b=0;b<f;b++){const A=b%3*2/3-1,L=b>2?0:-1,G=[A,L,0,A+2/3,L,0,A+2/3,L+1,0,A,L,0,A+2/3,L+1,0,A,L+1,0];v.set(G,_*g*b),x.set(p,d*g*b);const y=[b,b,b,b,b,b];S.set(y,m*g*b)}const R=new Tt;R.setAttribute("position",new Ht(v,_)),R.setAttribute("uv",new Ht(x,d)),R.setAttribute("faceIndex",new Ht(S,m)),e.push(R),r>ur&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function vh(n,e,t){const i=new Hi(n,e,t);return i.texture.mapping=Fo,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ds(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function Px(n,e,t){const i=new Float32Array(Ni),r=new P(0,1,0);return new Jn({name:"SphericalGaussianBlur",defines:{n:Ni,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Cc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:gi,depthTest:!1,depthWrite:!1})}function xh(){return new Jn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Cc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:gi,depthTest:!1,depthWrite:!1})}function yh(){return new Jn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Cc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:gi,depthTest:!1,depthWrite:!1})}function Cc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Lx(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){const l=a.mapping,c=l===gl||l===_l,u=l===_r||l===vr;if(c||u){let h=e.get(a);const p=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==p)return t===null&&(t=new _h(n)),h=c?t.fromEquirectangular(a,h):t.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{const f=a.image;return c&&f&&f.height>0||u&&f&&r(f)?(t===null&&(t=new _h(n)),h=c?t.fromEquirectangular(a):t.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",s),h.texture):null}}}return a}function r(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function Ix(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&oo("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function Dx(n,e,t,i){const r={},s=new WeakMap;function o(h){const p=h.target;p.index!==null&&e.remove(p.index);for(const g in p.attributes)e.remove(p.attributes[g]);for(const g in p.morphAttributes){const _=p.morphAttributes[g];for(let d=0,m=_.length;d<m;d++)e.remove(_[d])}p.removeEventListener("dispose",o),delete r[p.id];const f=s.get(p);f&&(e.remove(f),s.delete(p)),i.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function a(h,p){return r[p.id]===!0||(p.addEventListener("dispose",o),r[p.id]=!0,t.memory.geometries++),p}function l(h){const p=h.attributes;for(const g in p)e.update(p[g],n.ARRAY_BUFFER);const f=h.morphAttributes;for(const g in f){const _=f[g];for(let d=0,m=_.length;d<m;d++)e.update(_[d],n.ARRAY_BUFFER)}}function c(h){const p=[],f=h.index,g=h.attributes.position;let _=0;if(f!==null){const v=f.array;_=f.version;for(let x=0,S=v.length;x<S;x+=3){const R=v[x+0],b=v[x+1],A=v[x+2];p.push(R,b,b,A,A,R)}}else if(g!==void 0){const v=g.array;_=g.version;for(let x=0,S=v.length/3-1;x<S;x+=3){const R=x+0,b=x+1,A=x+2;p.push(R,b,b,A,A,R)}}else return;const d=new(Sd(p)?Ad:Td)(p,1);d.version=_;const m=s.get(h);m&&e.remove(m),s.set(h,d)}function u(h){const p=s.get(h);if(p){const f=h.index;f!==null&&p.version<f.version&&c(h)}else c(h);return s.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function Ux(n,e,t){let i;function r(p){i=p}let s,o;function a(p){s=p.type,o=p.bytesPerElement}function l(p,f){n.drawElements(i,f,s,p*o),t.update(f,i,1)}function c(p,f,g){g!==0&&(n.drawElementsInstanced(i,f,s,p*o,g),t.update(f,i,g))}function u(p,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,s,p,0,g);let d=0;for(let m=0;m<g;m++)d+=f[m];t.update(d,i,1)}function h(p,f,g,_){if(g===0)return;const d=e.get("WEBGL_multi_draw");if(d===null)for(let m=0;m<p.length;m++)c(p[m]/o,f[m],_[m]);else{d.multiDrawElementsInstancedWEBGL(i,f,0,s,p,0,_,0,g);let m=0;for(let v=0;v<g;v++)m+=f[v];for(let v=0;v<_.length;v++)t.update(m,i,_[v])}}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function Nx(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(s/3);break;case n.LINES:t.lines+=a*(s/2);break;case n.LINE_STRIP:t.lines+=a*(s-1);break;case n.LINE_LOOP:t.lines+=a*s;break;case n.POINTS:t.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function Fx(n,e,t){const i=new WeakMap,r=new gt;function s(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let p=i.get(a);if(p===void 0||p.count!==h){let G=function(){A.dispose(),i.delete(a),a.removeEventListener("dispose",G)};p!==void 0&&p.texture.dispose();const f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,d=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],v=a.morphAttributes.color||[];let x=0;f===!0&&(x=1),g===!0&&(x=2),_===!0&&(x=3);let S=a.attributes.position.count*x,R=1;S>e.maxTextureSize&&(R=Math.ceil(S/e.maxTextureSize),S=e.maxTextureSize);const b=new Float32Array(S*R*4*h),A=new Ed(b,S,R,h);A.type=Un,A.needsUpdate=!0;const L=x*4;for(let y=0;y<h;y++){const E=d[y],F=m[y],O=v[y],H=S*R*4*y;for(let j=0;j<E.count;j++){const B=j*L;f===!0&&(r.fromBufferAttribute(E,j),b[H+B+0]=r.x,b[H+B+1]=r.y,b[H+B+2]=r.z,b[H+B+3]=0),g===!0&&(r.fromBufferAttribute(F,j),b[H+B+4]=r.x,b[H+B+5]=r.y,b[H+B+6]=r.z,b[H+B+7]=0),_===!0&&(r.fromBufferAttribute(O,j),b[H+B+8]=r.x,b[H+B+9]=r.y,b[H+B+10]=r.z,b[H+B+11]=O.itemSize===4?r.w:1)}}p={count:h,texture:A,size:new se(S,R)},i.set(a,p),a.addEventListener("dispose",G)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];const g=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(n,"morphTargetBaseInfluence",g),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",p.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",p.size)}return{update:s}}function Ox(n,e,t,i){let r=new WeakMap;function s(l){const c=i.render.frame,u=l.geometry,h=e.get(l,u);if(r.get(h)!==c&&(e.update(h),r.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const p=l.skeleton;r.get(p)!==c&&(p.update(),r.set(p,c))}return h}function o(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:o}}class Dd extends qt{constructor(e,t,i,r,s,o,a,l,c,u=dr){if(u!==dr&&u!==yr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===dr&&(i=ki),i===void 0&&u===yr&&(i=xr),super(null,r,s,o,a,l,u,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Zt,this.minFilter=l!==void 0?l:Zt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Ud=new qt,Sh=new Dd(1,1),Nd=new Ed,Fd=new E0,Od=new Pd,Mh=[],Eh=[],wh=new Float32Array(16),bh=new Float32Array(9),Th=new Float32Array(4);function Rr(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=Mh[r];if(s===void 0&&(s=new Float32Array(r),Mh[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(s,a)}return s}function Dt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Ut(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function zo(n,e){let t=Eh[e];t===void 0&&(t=new Int32Array(e),Eh[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function Bx(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function zx(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;n.uniform2fv(this.addr,e),Ut(t,e)}}function kx(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Dt(t,e))return;n.uniform3fv(this.addr,e),Ut(t,e)}}function Hx(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;n.uniform4fv(this.addr,e),Ut(t,e)}}function Vx(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Dt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Ut(t,e)}else{if(Dt(t,i))return;Th.set(i),n.uniformMatrix2fv(this.addr,!1,Th),Ut(t,i)}}function Gx(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Dt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Ut(t,e)}else{if(Dt(t,i))return;bh.set(i),n.uniformMatrix3fv(this.addr,!1,bh),Ut(t,i)}}function Wx(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Dt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Ut(t,e)}else{if(Dt(t,i))return;wh.set(i),n.uniformMatrix4fv(this.addr,!1,wh),Ut(t,i)}}function Xx(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function $x(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;n.uniform2iv(this.addr,e),Ut(t,e)}}function qx(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Dt(t,e))return;n.uniform3iv(this.addr,e),Ut(t,e)}}function Yx(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;n.uniform4iv(this.addr,e),Ut(t,e)}}function jx(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Kx(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;n.uniform2uiv(this.addr,e),Ut(t,e)}}function Zx(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Dt(t,e))return;n.uniform3uiv(this.addr,e),Ut(t,e)}}function Jx(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;n.uniform4uiv(this.addr,e),Ut(t,e)}}function Qx(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(Sh.compareFunction=yd,s=Sh):s=Ud,t.setTexture2D(e||s,r)}function ey(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||Fd,r)}function ty(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||Od,r)}function ny(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||Nd,r)}function iy(n){switch(n){case 5126:return Bx;case 35664:return zx;case 35665:return kx;case 35666:return Hx;case 35674:return Vx;case 35675:return Gx;case 35676:return Wx;case 5124:case 35670:return Xx;case 35667:case 35671:return $x;case 35668:case 35672:return qx;case 35669:case 35673:return Yx;case 5125:return jx;case 36294:return Kx;case 36295:return Zx;case 36296:return Jx;case 35678:case 36198:case 36298:case 36306:case 35682:return Qx;case 35679:case 36299:case 36307:return ey;case 35680:case 36300:case 36308:case 36293:return ty;case 36289:case 36303:case 36311:case 36292:return ny}}function ry(n,e){n.uniform1fv(this.addr,e)}function sy(n,e){const t=Rr(e,this.size,2);n.uniform2fv(this.addr,t)}function oy(n,e){const t=Rr(e,this.size,3);n.uniform3fv(this.addr,t)}function ay(n,e){const t=Rr(e,this.size,4);n.uniform4fv(this.addr,t)}function ly(n,e){const t=Rr(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function cy(n,e){const t=Rr(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function uy(n,e){const t=Rr(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function hy(n,e){n.uniform1iv(this.addr,e)}function fy(n,e){n.uniform2iv(this.addr,e)}function dy(n,e){n.uniform3iv(this.addr,e)}function py(n,e){n.uniform4iv(this.addr,e)}function my(n,e){n.uniform1uiv(this.addr,e)}function gy(n,e){n.uniform2uiv(this.addr,e)}function _y(n,e){n.uniform3uiv(this.addr,e)}function vy(n,e){n.uniform4uiv(this.addr,e)}function xy(n,e,t){const i=this.cache,r=e.length,s=zo(t,r);Dt(i,s)||(n.uniform1iv(this.addr,s),Ut(i,s));for(let o=0;o!==r;++o)t.setTexture2D(e[o]||Ud,s[o])}function yy(n,e,t){const i=this.cache,r=e.length,s=zo(t,r);Dt(i,s)||(n.uniform1iv(this.addr,s),Ut(i,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||Fd,s[o])}function Sy(n,e,t){const i=this.cache,r=e.length,s=zo(t,r);Dt(i,s)||(n.uniform1iv(this.addr,s),Ut(i,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||Od,s[o])}function My(n,e,t){const i=this.cache,r=e.length,s=zo(t,r);Dt(i,s)||(n.uniform1iv(this.addr,s),Ut(i,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||Nd,s[o])}function Ey(n){switch(n){case 5126:return ry;case 35664:return sy;case 35665:return oy;case 35666:return ay;case 35674:return ly;case 35675:return cy;case 35676:return uy;case 5124:case 35670:return hy;case 35667:case 35671:return fy;case 35668:case 35672:return dy;case 35669:case 35673:return py;case 5125:return my;case 36294:return gy;case 36295:return _y;case 36296:return vy;case 35678:case 36198:case 36298:case 36306:case 35682:return xy;case 35679:case 36299:case 36307:return yy;case 35680:case 36300:case 36308:case 36293:return Sy;case 36289:case 36303:case 36311:case 36292:return My}}class wy{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=iy(t.type)}}class by{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Ey(t.type)}}class Ty{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,t[a.id],i)}}}const Ua=/(\w+)(\])?(\[|\.)?/g;function Ah(n,e){n.seq.push(e),n.map[e.id]=e}function Ay(n,e,t){const i=n.name,r=i.length;for(Ua.lastIndex=0;;){const s=Ua.exec(i),o=Ua.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){Ah(t,c===void 0?new wy(a,n,e):new by(a,n,e));break}else{let h=t.map[a];h===void 0&&(h=new Ty(a),Ah(t,h)),t=h}}}class ao{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(t,r),o=e.getUniformLocation(t,s.name);Ay(s,o,this)}}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,o=t.length;s!==o;++s){const a=t[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in t&&i.push(o)}return i}}function Ch(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Cy=37297;let Ry=0;function Py(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}function Ly(n){const e=ht.getPrimaries(ht.workingColorSpace),t=ht.getPrimaries(n);let i;switch(e===t?i="":e===Eo&&t===Mo?i="LinearDisplayP3ToLinearSRGB":e===Mo&&t===Eo&&(i="LinearSRGBToLinearDisplayP3"),n){case yi:case Bo:return[i,"LinearTransferOETF"];case Ot:case bc:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[i,"LinearTransferOETF"]}}function Rh(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=n.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+Py(n.getShaderSource(e),o)}else return r}function Iy(n,e){const t=Ly(e);return`vec4 ${n}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function Dy(n,e){let t;switch(e){case jg:t="Linear";break;case Kg:t="Reinhard";break;case Zg:t="Cineon";break;case Jg:t="ACESFilmic";break;case e0:t="AgX";break;case t0:t="Neutral";break;case Qg:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Us=new P;function Uy(){ht.getLuminanceCoefficients(Us);const n=Us.x.toFixed(4),e=Us.y.toFixed(4),t=Us.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Ny(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter($r).join(`
`)}function Fy(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Oy(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),o=s.name;let a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function $r(n){return n!==""}function Ph(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Lh(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const By=/^[ \t]*#include +<([\w\d./]+)>/gm;function ql(n){return n.replace(By,ky)}const zy=new Map;function ky(n,e){let t=$e[e];if(t===void 0){const i=zy.get(e);if(i!==void 0)t=$e[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return ql(t)}const Hy=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ih(n){return n.replace(Hy,Vy)}function Vy(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Dh(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Gy(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===ad?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===Cg?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Wn&&(e="SHADOWMAP_TYPE_VSM"),e}function Wy(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case _r:case vr:e="ENVMAP_TYPE_CUBE";break;case Fo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Xy(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case vr:e="ENVMAP_MODE_REFRACTION";break}return e}function $y(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case ld:e="ENVMAP_BLENDING_MULTIPLY";break;case qg:e="ENVMAP_BLENDING_MIX";break;case Yg:e="ENVMAP_BLENDING_ADD";break}return e}function qy(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function Yy(n,e,t,i){const r=n.getContext(),s=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=Gy(t),c=Wy(t),u=Xy(t),h=$y(t),p=qy(t),f=Ny(t),g=Fy(s),_=r.createProgram();let d,m,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter($r).join(`
`),d.length>0&&(d+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter($r).join(`
`),m.length>0&&(m+=`
`)):(d=[Dh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter($r).join(`
`),m=[Dh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==_i?"#define TONE_MAPPING":"",t.toneMapping!==_i?$e.tonemapping_pars_fragment:"",t.toneMapping!==_i?Dy("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",$e.colorspace_pars_fragment,Iy("linearToOutputTexel",t.outputColorSpace),Uy(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter($r).join(`
`)),o=ql(o),o=Ph(o,t),o=Lh(o,t),a=ql(a),a=Ph(a,t),a=Lh(a,t),o=Ih(o),a=Ih(a),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,d=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+d,m=["#define varying in",t.glslVersion===Ku?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ku?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const x=v+d+o,S=v+m+a,R=Ch(r,r.VERTEX_SHADER,x),b=Ch(r,r.FRAGMENT_SHADER,S);r.attachShader(_,R),r.attachShader(_,b),t.index0AttributeName!==void 0?r.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function A(E){if(n.debug.checkShaderErrors){const F=r.getProgramInfoLog(_).trim(),O=r.getShaderInfoLog(R).trim(),H=r.getShaderInfoLog(b).trim();let j=!0,B=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(j=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,_,R,b);else{const X=Rh(r,R,"vertex"),V=Rh(r,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+E.name+`
Material Type: `+E.type+`

Program Info Log: `+F+`
`+X+`
`+V)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(O===""||H==="")&&(B=!1);B&&(E.diagnostics={runnable:j,programLog:F,vertexShader:{log:O,prefix:d},fragmentShader:{log:H,prefix:m}})}r.deleteShader(R),r.deleteShader(b),L=new ao(r,_),G=Oy(r,_)}let L;this.getUniforms=function(){return L===void 0&&A(this),L};let G;this.getAttributes=function(){return G===void 0&&A(this),G};let y=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=r.getProgramParameter(_,Cy)),y},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Ry++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=R,this.fragmentShader=b,this}let jy=0;class Ky{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Zy(e),t.set(e,i)),i}}class Zy{constructor(e){this.id=jy++,this.code=e,this.usedTimes=0}}function Jy(n,e,t,i,r,s,o){const a=new wd,l=new Ky,c=new Set,u=[],h=r.logarithmicDepthBuffer,p=r.reverseDepthBuffer,f=r.vertexTextures;let g=r.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function d(y){return c.add(y),y===0?"uv":`uv${y}`}function m(y,E,F,O,H){const j=O.fog,B=H.geometry,X=y.isMeshStandardMaterial?O.environment:null,V=(y.isMeshStandardMaterial?t:e).get(y.envMap||X),re=V&&V.mapping===Fo?V.image.height:null,oe=_[y.type];y.precision!==null&&(g=r.getMaxPrecision(y.precision),g!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",g,"instead."));const le=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,Xe=le!==void 0?le.length:0;let et=0;B.morphAttributes.position!==void 0&&(et=1),B.morphAttributes.normal!==void 0&&(et=2),B.morphAttributes.color!==void 0&&(et=3);let $,ee,ve,he;if(oe){const tn=In[oe];$=tn.vertexShader,ee=tn.fragmentShader}else $=y.vertexShader,ee=y.fragmentShader,l.update(y),ve=l.getVertexShaderID(y),he=l.getFragmentShaderID(y);const Ne=n.getRenderTarget(),De=H.isInstancedMesh===!0,Ve=H.isBatchedMesh===!0,Ke=!!y.map,K=!!y.matcap,C=!!V,ue=!!y.aoMap,ce=!!y.lightMap,te=!!y.bumpMap,fe=!!y.normalMap,Le=!!y.displacementMap,xe=!!y.emissiveMap,T=!!y.metalnessMap,M=!!y.roughnessMap,N=y.anisotropy>0,q=y.clearcoat>0,Z=y.dispersion>0,Y=y.iridescence>0,Ce=y.sheen>0,de=y.transmission>0,Me=N&&!!y.anisotropyMap,nt=q&&!!y.clearcoatMap,ne=q&&!!y.clearcoatNormalMap,Ee=q&&!!y.clearcoatRoughnessMap,ke=Y&&!!y.iridescenceMap,He=Y&&!!y.iridescenceThicknessMap,we=Ce&&!!y.sheenColorMap,it=Ce&&!!y.sheenRoughnessMap,Ge=!!y.specularMap,dt=!!y.specularColorMap,I=!!y.specularIntensityMap,ye=de&&!!y.transmissionMap,W=de&&!!y.thicknessMap,J=!!y.gradientMap,ge=!!y.alphaMap,Se=y.alphaTest>0,st=!!y.alphaHash,At=!!y.extensions;let en=_i;y.toneMapped&&(Ne===null||Ne.isXRRenderTarget===!0)&&(en=n.toneMapping);const lt={shaderID:oe,shaderType:y.type,shaderName:y.name,vertexShader:$,fragmentShader:ee,defines:y.defines,customVertexShaderID:ve,customFragmentShaderID:he,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:g,batching:Ve,batchingColor:Ve&&H._colorsTexture!==null,instancing:De,instancingColor:De&&H.instanceColor!==null,instancingMorph:De&&H.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:Ne===null?n.outputColorSpace:Ne.isXRRenderTarget===!0?Ne.texture.colorSpace:yi,alphaToCoverage:!!y.alphaToCoverage,map:Ke,matcap:K,envMap:C,envMapMode:C&&V.mapping,envMapCubeUVHeight:re,aoMap:ue,lightMap:ce,bumpMap:te,normalMap:fe,displacementMap:f&&Le,emissiveMap:xe,normalMapObjectSpace:fe&&y.normalMapType===s0,normalMapTangentSpace:fe&&y.normalMapType===xd,metalnessMap:T,roughnessMap:M,anisotropy:N,anisotropyMap:Me,clearcoat:q,clearcoatMap:nt,clearcoatNormalMap:ne,clearcoatRoughnessMap:Ee,dispersion:Z,iridescence:Y,iridescenceMap:ke,iridescenceThicknessMap:He,sheen:Ce,sheenColorMap:we,sheenRoughnessMap:it,specularMap:Ge,specularColorMap:dt,specularIntensityMap:I,transmission:de,transmissionMap:ye,thicknessMap:W,gradientMap:J,opaque:y.transparent===!1&&y.blending===fr&&y.alphaToCoverage===!1,alphaMap:ge,alphaTest:Se,alphaHash:st,combine:y.combine,mapUv:Ke&&d(y.map.channel),aoMapUv:ue&&d(y.aoMap.channel),lightMapUv:ce&&d(y.lightMap.channel),bumpMapUv:te&&d(y.bumpMap.channel),normalMapUv:fe&&d(y.normalMap.channel),displacementMapUv:Le&&d(y.displacementMap.channel),emissiveMapUv:xe&&d(y.emissiveMap.channel),metalnessMapUv:T&&d(y.metalnessMap.channel),roughnessMapUv:M&&d(y.roughnessMap.channel),anisotropyMapUv:Me&&d(y.anisotropyMap.channel),clearcoatMapUv:nt&&d(y.clearcoatMap.channel),clearcoatNormalMapUv:ne&&d(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ee&&d(y.clearcoatRoughnessMap.channel),iridescenceMapUv:ke&&d(y.iridescenceMap.channel),iridescenceThicknessMapUv:He&&d(y.iridescenceThicknessMap.channel),sheenColorMapUv:we&&d(y.sheenColorMap.channel),sheenRoughnessMapUv:it&&d(y.sheenRoughnessMap.channel),specularMapUv:Ge&&d(y.specularMap.channel),specularColorMapUv:dt&&d(y.specularColorMap.channel),specularIntensityMapUv:I&&d(y.specularIntensityMap.channel),transmissionMapUv:ye&&d(y.transmissionMap.channel),thicknessMapUv:W&&d(y.thicknessMap.channel),alphaMapUv:ge&&d(y.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(fe||N),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,pointsUvs:H.isPoints===!0&&!!B.attributes.uv&&(Ke||ge),fog:!!j,useFog:y.fog===!0,fogExp2:!!j&&j.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:p,skinning:H.isSkinnedMesh===!0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:Xe,morphTextureStride:et,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:y.dithering,shadowMapEnabled:n.shadowMap.enabled&&F.length>0,shadowMapType:n.shadowMap.type,toneMapping:en,decodeVideoTexture:Ke&&y.map.isVideoTexture===!0&&ht.getTransfer(y.map.colorSpace)===vt,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===kt,flipSided:y.side===$t,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:At&&y.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(At&&y.extensions.multiDraw===!0||Ve)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return lt.vertexUv1s=c.has(1),lt.vertexUv2s=c.has(2),lt.vertexUv3s=c.has(3),c.clear(),lt}function v(y){const E=[];if(y.shaderID?E.push(y.shaderID):(E.push(y.customVertexShaderID),E.push(y.customFragmentShaderID)),y.defines!==void 0)for(const F in y.defines)E.push(F),E.push(y.defines[F]);return y.isRawShaderMaterial===!1&&(x(E,y),S(E,y),E.push(n.outputColorSpace)),E.push(y.customProgramCacheKey),E.join()}function x(y,E){y.push(E.precision),y.push(E.outputColorSpace),y.push(E.envMapMode),y.push(E.envMapCubeUVHeight),y.push(E.mapUv),y.push(E.alphaMapUv),y.push(E.lightMapUv),y.push(E.aoMapUv),y.push(E.bumpMapUv),y.push(E.normalMapUv),y.push(E.displacementMapUv),y.push(E.emissiveMapUv),y.push(E.metalnessMapUv),y.push(E.roughnessMapUv),y.push(E.anisotropyMapUv),y.push(E.clearcoatMapUv),y.push(E.clearcoatNormalMapUv),y.push(E.clearcoatRoughnessMapUv),y.push(E.iridescenceMapUv),y.push(E.iridescenceThicknessMapUv),y.push(E.sheenColorMapUv),y.push(E.sheenRoughnessMapUv),y.push(E.specularMapUv),y.push(E.specularColorMapUv),y.push(E.specularIntensityMapUv),y.push(E.transmissionMapUv),y.push(E.thicknessMapUv),y.push(E.combine),y.push(E.fogExp2),y.push(E.sizeAttenuation),y.push(E.morphTargetsCount),y.push(E.morphAttributeCount),y.push(E.numDirLights),y.push(E.numPointLights),y.push(E.numSpotLights),y.push(E.numSpotLightMaps),y.push(E.numHemiLights),y.push(E.numRectAreaLights),y.push(E.numDirLightShadows),y.push(E.numPointLightShadows),y.push(E.numSpotLightShadows),y.push(E.numSpotLightShadowsWithMaps),y.push(E.numLightProbes),y.push(E.shadowMapType),y.push(E.toneMapping),y.push(E.numClippingPlanes),y.push(E.numClipIntersection),y.push(E.depthPacking)}function S(y,E){a.disableAll(),E.supportsVertexTextures&&a.enable(0),E.instancing&&a.enable(1),E.instancingColor&&a.enable(2),E.instancingMorph&&a.enable(3),E.matcap&&a.enable(4),E.envMap&&a.enable(5),E.normalMapObjectSpace&&a.enable(6),E.normalMapTangentSpace&&a.enable(7),E.clearcoat&&a.enable(8),E.iridescence&&a.enable(9),E.alphaTest&&a.enable(10),E.vertexColors&&a.enable(11),E.vertexAlphas&&a.enable(12),E.vertexUv1s&&a.enable(13),E.vertexUv2s&&a.enable(14),E.vertexUv3s&&a.enable(15),E.vertexTangents&&a.enable(16),E.anisotropy&&a.enable(17),E.alphaHash&&a.enable(18),E.batching&&a.enable(19),E.dispersion&&a.enable(20),E.batchingColor&&a.enable(21),y.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reverseDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.alphaToCoverage&&a.enable(20),y.push(a.mask)}function R(y){const E=_[y.type];let F;if(E){const O=In[E];F=N0.clone(O.uniforms)}else F=y.uniforms;return F}function b(y,E){let F;for(let O=0,H=u.length;O<H;O++){const j=u[O];if(j.cacheKey===E){F=j,++F.usedTimes;break}}return F===void 0&&(F=new Yy(n,E,y,s),u.push(F)),F}function A(y){if(--y.usedTimes===0){const E=u.indexOf(y);u[E]=u[u.length-1],u.pop(),y.destroy()}}function L(y){l.remove(y)}function G(){l.dispose()}return{getParameters:m,getProgramCacheKey:v,getUniforms:R,acquireProgram:b,releaseProgram:A,releaseShaderCache:L,programs:u,dispose:G}}function Qy(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function r(o,a,l){n.get(o)[a]=l}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function eS(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Uh(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Nh(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function o(h,p,f,g,_,d){let m=n[e];return m===void 0?(m={id:h.id,object:h,geometry:p,material:f,groupOrder:g,renderOrder:h.renderOrder,z:_,group:d},n[e]=m):(m.id=h.id,m.object=h,m.geometry=p,m.material=f,m.groupOrder=g,m.renderOrder=h.renderOrder,m.z=_,m.group=d),e++,m}function a(h,p,f,g,_,d){const m=o(h,p,f,g,_,d);f.transmission>0?i.push(m):f.transparent===!0?r.push(m):t.push(m)}function l(h,p,f,g,_,d){const m=o(h,p,f,g,_,d);f.transmission>0?i.unshift(m):f.transparent===!0?r.unshift(m):t.unshift(m)}function c(h,p){t.length>1&&t.sort(h||eS),i.length>1&&i.sort(p||Uh),r.length>1&&r.sort(p||Uh)}function u(){for(let h=e,p=n.length;h<p;h++){const f=n[h];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:a,unshift:l,finish:u,sort:c}}function tS(){let n=new WeakMap;function e(i,r){const s=n.get(i);let o;return s===void 0?(o=new Nh,n.set(i,[o])):r>=s.length?(o=new Nh,s.push(o)):o=s[r],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function nS(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new ze};break;case"SpotLight":t={position:new P,direction:new P,color:new ze,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new ze,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new ze,groundColor:new ze};break;case"RectAreaLight":t={color:new ze,position:new P,halfWidth:new P,halfHeight:new P};break}return n[e.id]=t,t}}}function iS(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new se};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new se};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new se,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let rS=0;function sS(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function oS(n){const e=new nS,t=iS(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new P);const r=new P,s=new rt,o=new rt;function a(c){let u=0,h=0,p=0;for(let G=0;G<9;G++)i.probe[G].set(0,0,0);let f=0,g=0,_=0,d=0,m=0,v=0,x=0,S=0,R=0,b=0,A=0;c.sort(sS);for(let G=0,y=c.length;G<y;G++){const E=c[G],F=E.color,O=E.intensity,H=E.distance,j=E.shadow&&E.shadow.map?E.shadow.map.texture:null;if(E.isAmbientLight)u+=F.r*O,h+=F.g*O,p+=F.b*O;else if(E.isLightProbe){for(let B=0;B<9;B++)i.probe[B].addScaledVector(E.sh.coefficients[B],O);A++}else if(E.isDirectionalLight){const B=e.get(E);if(B.color.copy(E.color).multiplyScalar(E.intensity),E.castShadow){const X=E.shadow,V=t.get(E);V.shadowIntensity=X.intensity,V.shadowBias=X.bias,V.shadowNormalBias=X.normalBias,V.shadowRadius=X.radius,V.shadowMapSize=X.mapSize,i.directionalShadow[f]=V,i.directionalShadowMap[f]=j,i.directionalShadowMatrix[f]=E.shadow.matrix,v++}i.directional[f]=B,f++}else if(E.isSpotLight){const B=e.get(E);B.position.setFromMatrixPosition(E.matrixWorld),B.color.copy(F).multiplyScalar(O),B.distance=H,B.coneCos=Math.cos(E.angle),B.penumbraCos=Math.cos(E.angle*(1-E.penumbra)),B.decay=E.decay,i.spot[_]=B;const X=E.shadow;if(E.map&&(i.spotLightMap[R]=E.map,R++,X.updateMatrices(E),E.castShadow&&b++),i.spotLightMatrix[_]=X.matrix,E.castShadow){const V=t.get(E);V.shadowIntensity=X.intensity,V.shadowBias=X.bias,V.shadowNormalBias=X.normalBias,V.shadowRadius=X.radius,V.shadowMapSize=X.mapSize,i.spotShadow[_]=V,i.spotShadowMap[_]=j,S++}_++}else if(E.isRectAreaLight){const B=e.get(E);B.color.copy(F).multiplyScalar(O),B.halfWidth.set(E.width*.5,0,0),B.halfHeight.set(0,E.height*.5,0),i.rectArea[d]=B,d++}else if(E.isPointLight){const B=e.get(E);if(B.color.copy(E.color).multiplyScalar(E.intensity),B.distance=E.distance,B.decay=E.decay,E.castShadow){const X=E.shadow,V=t.get(E);V.shadowIntensity=X.intensity,V.shadowBias=X.bias,V.shadowNormalBias=X.normalBias,V.shadowRadius=X.radius,V.shadowMapSize=X.mapSize,V.shadowCameraNear=X.camera.near,V.shadowCameraFar=X.camera.far,i.pointShadow[g]=V,i.pointShadowMap[g]=j,i.pointShadowMatrix[g]=E.shadow.matrix,x++}i.point[g]=B,g++}else if(E.isHemisphereLight){const B=e.get(E);B.skyColor.copy(E.color).multiplyScalar(O),B.groundColor.copy(E.groundColor).multiplyScalar(O),i.hemi[m]=B,m++}}d>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=pe.LTC_FLOAT_1,i.rectAreaLTC2=pe.LTC_FLOAT_2):(i.rectAreaLTC1=pe.LTC_HALF_1,i.rectAreaLTC2=pe.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=p;const L=i.hash;(L.directionalLength!==f||L.pointLength!==g||L.spotLength!==_||L.rectAreaLength!==d||L.hemiLength!==m||L.numDirectionalShadows!==v||L.numPointShadows!==x||L.numSpotShadows!==S||L.numSpotMaps!==R||L.numLightProbes!==A)&&(i.directional.length=f,i.spot.length=_,i.rectArea.length=d,i.point.length=g,i.hemi.length=m,i.directionalShadow.length=v,i.directionalShadowMap.length=v,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=S,i.spotShadowMap.length=S,i.directionalShadowMatrix.length=v,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=S+R-b,i.spotLightMap.length=R,i.numSpotLightShadowsWithMaps=b,i.numLightProbes=A,L.directionalLength=f,L.pointLength=g,L.spotLength=_,L.rectAreaLength=d,L.hemiLength=m,L.numDirectionalShadows=v,L.numPointShadows=x,L.numSpotShadows=S,L.numSpotMaps=R,L.numLightProbes=A,i.version=rS++)}function l(c,u){let h=0,p=0,f=0,g=0,_=0;const d=u.matrixWorldInverse;for(let m=0,v=c.length;m<v;m++){const x=c[m];if(x.isDirectionalLight){const S=i.directional[h];S.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(d),h++}else if(x.isSpotLight){const S=i.spot[f];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(d),S.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(d),f++}else if(x.isRectAreaLight){const S=i.rectArea[g];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(d),o.identity(),s.copy(x.matrixWorld),s.premultiply(d),o.extractRotation(s),S.halfWidth.set(x.width*.5,0,0),S.halfHeight.set(0,x.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),g++}else if(x.isPointLight){const S=i.point[p];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(d),p++}else if(x.isHemisphereLight){const S=i.hemi[_];S.direction.setFromMatrixPosition(x.matrixWorld),S.direction.transformDirection(d),_++}}}return{setup:a,setupView:l,state:i}}function Fh(n){const e=new oS(n),t=[],i=[];function r(u){c.camera=u,t.length=0,i.length=0}function s(u){t.push(u)}function o(u){i.push(u)}function a(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function aS(n){let e=new WeakMap;function t(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new Fh(n),e.set(r,[a])):s>=o.length?(a=new Fh(n),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:t,dispose:i}}class lS extends Wi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=i0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class cS extends Wi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const uS=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,hS=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function fS(n,e,t){let i=new Ac;const r=new se,s=new se,o=new gt,a=new lS({depthPacking:r0}),l=new cS,c={},u=t.maxTextureSize,h={[xi]:$t,[$t]:xi,[kt]:kt},p=new Jn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new se},radius:{value:4}},vertexShader:uS,fragmentShader:hS}),f=p.clone();f.defines.HORIZONTAL_PASS=1;const g=new Tt;g.setAttribute("position",new Ht(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Je(g,p),d=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ad;let m=this.type;this.render=function(b,A,L){if(d.enabled===!1||d.autoUpdate===!1&&d.needsUpdate===!1||b.length===0)return;const G=n.getRenderTarget(),y=n.getActiveCubeFace(),E=n.getActiveMipmapLevel(),F=n.state;F.setBlending(gi),F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const O=m!==Wn&&this.type===Wn,H=m===Wn&&this.type!==Wn;for(let j=0,B=b.length;j<B;j++){const X=b[j],V=X.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",X,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;r.copy(V.mapSize);const re=V.getFrameExtents();if(r.multiply(re),s.copy(V.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/re.x),r.x=s.x*re.x,V.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/re.y),r.y=s.y*re.y,V.mapSize.y=s.y)),V.map===null||O===!0||H===!0){const le=this.type!==Wn?{minFilter:Zt,magFilter:Zt}:{};V.map!==null&&V.map.dispose(),V.map=new Hi(r.x,r.y,le),V.map.texture.name=X.name+".shadowMap",V.camera.updateProjectionMatrix()}n.setRenderTarget(V.map),n.clear();const oe=V.getViewportCount();for(let le=0;le<oe;le++){const Xe=V.getViewport(le);o.set(s.x*Xe.x,s.y*Xe.y,s.x*Xe.z,s.y*Xe.w),F.viewport(o),V.updateMatrices(X,le),i=V.getFrustum(),S(A,L,V.camera,X,this.type)}V.isPointLightShadow!==!0&&this.type===Wn&&v(V,L),V.needsUpdate=!1}m=this.type,d.needsUpdate=!1,n.setRenderTarget(G,y,E)};function v(b,A){const L=e.update(_);p.defines.VSM_SAMPLES!==b.blurSamples&&(p.defines.VSM_SAMPLES=b.blurSamples,f.defines.VSM_SAMPLES=b.blurSamples,p.needsUpdate=!0,f.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new Hi(r.x,r.y)),p.uniforms.shadow_pass.value=b.map.texture,p.uniforms.resolution.value=b.mapSize,p.uniforms.radius.value=b.radius,n.setRenderTarget(b.mapPass),n.clear(),n.renderBufferDirect(A,null,L,p,_,null),f.uniforms.shadow_pass.value=b.mapPass.texture,f.uniforms.resolution.value=b.mapSize,f.uniforms.radius.value=b.radius,n.setRenderTarget(b.map),n.clear(),n.renderBufferDirect(A,null,L,f,_,null)}function x(b,A,L,G){let y=null;const E=L.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(E!==void 0)y=E;else if(y=L.isPointLight===!0?l:a,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const F=y.uuid,O=A.uuid;let H=c[F];H===void 0&&(H={},c[F]=H);let j=H[O];j===void 0&&(j=y.clone(),H[O]=j,A.addEventListener("dispose",R)),y=j}if(y.visible=A.visible,y.wireframe=A.wireframe,G===Wn?y.side=A.shadowSide!==null?A.shadowSide:A.side:y.side=A.shadowSide!==null?A.shadowSide:h[A.side],y.alphaMap=A.alphaMap,y.alphaTest=A.alphaTest,y.map=A.map,y.clipShadows=A.clipShadows,y.clippingPlanes=A.clippingPlanes,y.clipIntersection=A.clipIntersection,y.displacementMap=A.displacementMap,y.displacementScale=A.displacementScale,y.displacementBias=A.displacementBias,y.wireframeLinewidth=A.wireframeLinewidth,y.linewidth=A.linewidth,L.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const F=n.properties.get(y);F.light=L}return y}function S(b,A,L,G,y){if(b.visible===!1)return;if(b.layers.test(A.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&y===Wn)&&(!b.frustumCulled||i.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,b.matrixWorld);const O=e.update(b),H=b.material;if(Array.isArray(H)){const j=O.groups;for(let B=0,X=j.length;B<X;B++){const V=j[B],re=H[V.materialIndex];if(re&&re.visible){const oe=x(b,re,G,y);b.onBeforeShadow(n,b,A,L,O,oe,V),n.renderBufferDirect(L,null,O,oe,b,V),b.onAfterShadow(n,b,A,L,O,oe,V)}}}else if(H.visible){const j=x(b,H,G,y);b.onBeforeShadow(n,b,A,L,O,j,null),n.renderBufferDirect(L,null,O,j,b,null),b.onAfterShadow(n,b,A,L,O,j,null)}}const F=b.children;for(let O=0,H=F.length;O<H;O++)S(F[O],A,L,G,y)}function R(b){b.target.removeEventListener("dispose",R);for(const L in c){const G=c[L],y=b.target.uuid;y in G&&(G[y].dispose(),delete G[y])}}}const dS={[cl]:ul,[hl]:pl,[fl]:ml,[gr]:dl,[ul]:cl,[pl]:hl,[ml]:fl,[dl]:gr};function pS(n){function e(){let I=!1;const ye=new gt;let W=null;const J=new gt(0,0,0,0);return{setMask:function(ge){W!==ge&&!I&&(n.colorMask(ge,ge,ge,ge),W=ge)},setLocked:function(ge){I=ge},setClear:function(ge,Se,st,At,en){en===!0&&(ge*=At,Se*=At,st*=At),ye.set(ge,Se,st,At),J.equals(ye)===!1&&(n.clearColor(ge,Se,st,At),J.copy(ye))},reset:function(){I=!1,W=null,J.set(-1,0,0,0)}}}function t(){let I=!1,ye=!1,W=null,J=null,ge=null;return{setReversed:function(Se){ye=Se},setTest:function(Se){Se?ve(n.DEPTH_TEST):he(n.DEPTH_TEST)},setMask:function(Se){W!==Se&&!I&&(n.depthMask(Se),W=Se)},setFunc:function(Se){if(ye&&(Se=dS[Se]),J!==Se){switch(Se){case cl:n.depthFunc(n.NEVER);break;case ul:n.depthFunc(n.ALWAYS);break;case hl:n.depthFunc(n.LESS);break;case gr:n.depthFunc(n.LEQUAL);break;case fl:n.depthFunc(n.EQUAL);break;case dl:n.depthFunc(n.GEQUAL);break;case pl:n.depthFunc(n.GREATER);break;case ml:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}J=Se}},setLocked:function(Se){I=Se},setClear:function(Se){ge!==Se&&(n.clearDepth(Se),ge=Se)},reset:function(){I=!1,W=null,J=null,ge=null}}}function i(){let I=!1,ye=null,W=null,J=null,ge=null,Se=null,st=null,At=null,en=null;return{setTest:function(lt){I||(lt?ve(n.STENCIL_TEST):he(n.STENCIL_TEST))},setMask:function(lt){ye!==lt&&!I&&(n.stencilMask(lt),ye=lt)},setFunc:function(lt,tn,Fn){(W!==lt||J!==tn||ge!==Fn)&&(n.stencilFunc(lt,tn,Fn),W=lt,J=tn,ge=Fn)},setOp:function(lt,tn,Fn){(Se!==lt||st!==tn||At!==Fn)&&(n.stencilOp(lt,tn,Fn),Se=lt,st=tn,At=Fn)},setLocked:function(lt){I=lt},setClear:function(lt){en!==lt&&(n.clearStencil(lt),en=lt)},reset:function(){I=!1,ye=null,W=null,J=null,ge=null,Se=null,st=null,At=null,en=null}}}const r=new e,s=new t,o=new i,a=new WeakMap,l=new WeakMap;let c={},u={},h=new WeakMap,p=[],f=null,g=!1,_=null,d=null,m=null,v=null,x=null,S=null,R=null,b=new ze(0,0,0),A=0,L=!1,G=null,y=null,E=null,F=null,O=null;const H=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let j=!1,B=0;const X=n.getParameter(n.VERSION);X.indexOf("WebGL")!==-1?(B=parseFloat(/^WebGL (\d)/.exec(X)[1]),j=B>=1):X.indexOf("OpenGL ES")!==-1&&(B=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),j=B>=2);let V=null,re={};const oe=n.getParameter(n.SCISSOR_BOX),le=n.getParameter(n.VIEWPORT),Xe=new gt().fromArray(oe),et=new gt().fromArray(le);function $(I,ye,W,J){const ge=new Uint8Array(4),Se=n.createTexture();n.bindTexture(I,Se),n.texParameteri(I,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(I,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let st=0;st<W;st++)I===n.TEXTURE_3D||I===n.TEXTURE_2D_ARRAY?n.texImage3D(ye,0,n.RGBA,1,1,J,0,n.RGBA,n.UNSIGNED_BYTE,ge):n.texImage2D(ye+st,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ge);return Se}const ee={};ee[n.TEXTURE_2D]=$(n.TEXTURE_2D,n.TEXTURE_2D,1),ee[n.TEXTURE_CUBE_MAP]=$(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ee[n.TEXTURE_2D_ARRAY]=$(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ee[n.TEXTURE_3D]=$(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),s.setClear(1),o.setClear(0),ve(n.DEPTH_TEST),s.setFunc(gr),ce(!1),te(Xu),ve(n.CULL_FACE),C(gi);function ve(I){c[I]!==!0&&(n.enable(I),c[I]=!0)}function he(I){c[I]!==!1&&(n.disable(I),c[I]=!1)}function Ne(I,ye){return u[I]!==ye?(n.bindFramebuffer(I,ye),u[I]=ye,I===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=ye),I===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=ye),!0):!1}function De(I,ye){let W=p,J=!1;if(I){W=h.get(ye),W===void 0&&(W=[],h.set(ye,W));const ge=I.textures;if(W.length!==ge.length||W[0]!==n.COLOR_ATTACHMENT0){for(let Se=0,st=ge.length;Se<st;Se++)W[Se]=n.COLOR_ATTACHMENT0+Se;W.length=ge.length,J=!0}}else W[0]!==n.BACK&&(W[0]=n.BACK,J=!0);J&&n.drawBuffers(W)}function Ve(I){return f!==I?(n.useProgram(I),f=I,!0):!1}const Ke={[Ui]:n.FUNC_ADD,[Pg]:n.FUNC_SUBTRACT,[Lg]:n.FUNC_REVERSE_SUBTRACT};Ke[Ig]=n.MIN,Ke[Dg]=n.MAX;const K={[Ug]:n.ZERO,[Ng]:n.ONE,[Fg]:n.SRC_COLOR,[al]:n.SRC_ALPHA,[Vg]:n.SRC_ALPHA_SATURATE,[kg]:n.DST_COLOR,[Bg]:n.DST_ALPHA,[Og]:n.ONE_MINUS_SRC_COLOR,[ll]:n.ONE_MINUS_SRC_ALPHA,[Hg]:n.ONE_MINUS_DST_COLOR,[zg]:n.ONE_MINUS_DST_ALPHA,[Gg]:n.CONSTANT_COLOR,[Wg]:n.ONE_MINUS_CONSTANT_COLOR,[Xg]:n.CONSTANT_ALPHA,[$g]:n.ONE_MINUS_CONSTANT_ALPHA};function C(I,ye,W,J,ge,Se,st,At,en,lt){if(I===gi){g===!0&&(he(n.BLEND),g=!1);return}if(g===!1&&(ve(n.BLEND),g=!0),I!==Rg){if(I!==_||lt!==L){if((d!==Ui||x!==Ui)&&(n.blendEquation(n.FUNC_ADD),d=Ui,x=Ui),lt)switch(I){case fr:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case yo:n.blendFunc(n.ONE,n.ONE);break;case $u:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case qu:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case fr:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case yo:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case $u:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case qu:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}m=null,v=null,S=null,R=null,b.set(0,0,0),A=0,_=I,L=lt}return}ge=ge||ye,Se=Se||W,st=st||J,(ye!==d||ge!==x)&&(n.blendEquationSeparate(Ke[ye],Ke[ge]),d=ye,x=ge),(W!==m||J!==v||Se!==S||st!==R)&&(n.blendFuncSeparate(K[W],K[J],K[Se],K[st]),m=W,v=J,S=Se,R=st),(At.equals(b)===!1||en!==A)&&(n.blendColor(At.r,At.g,At.b,en),b.copy(At),A=en),_=I,L=!1}function ue(I,ye){I.side===kt?he(n.CULL_FACE):ve(n.CULL_FACE);let W=I.side===$t;ye&&(W=!W),ce(W),I.blending===fr&&I.transparent===!1?C(gi):C(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),s.setFunc(I.depthFunc),s.setTest(I.depthTest),s.setMask(I.depthWrite),r.setMask(I.colorWrite);const J=I.stencilWrite;o.setTest(J),J&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),Le(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?ve(n.SAMPLE_ALPHA_TO_COVERAGE):he(n.SAMPLE_ALPHA_TO_COVERAGE)}function ce(I){G!==I&&(I?n.frontFace(n.CW):n.frontFace(n.CCW),G=I)}function te(I){I!==Tg?(ve(n.CULL_FACE),I!==y&&(I===Xu?n.cullFace(n.BACK):I===Ag?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):he(n.CULL_FACE),y=I}function fe(I){I!==E&&(j&&n.lineWidth(I),E=I)}function Le(I,ye,W){I?(ve(n.POLYGON_OFFSET_FILL),(F!==ye||O!==W)&&(n.polygonOffset(ye,W),F=ye,O=W)):he(n.POLYGON_OFFSET_FILL)}function xe(I){I?ve(n.SCISSOR_TEST):he(n.SCISSOR_TEST)}function T(I){I===void 0&&(I=n.TEXTURE0+H-1),V!==I&&(n.activeTexture(I),V=I)}function M(I,ye,W){W===void 0&&(V===null?W=n.TEXTURE0+H-1:W=V);let J=re[W];J===void 0&&(J={type:void 0,texture:void 0},re[W]=J),(J.type!==I||J.texture!==ye)&&(V!==W&&(n.activeTexture(W),V=W),n.bindTexture(I,ye||ee[I]),J.type=I,J.texture=ye)}function N(){const I=re[V];I!==void 0&&I.type!==void 0&&(n.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function q(){try{n.compressedTexImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Z(){try{n.compressedTexImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Y(){try{n.texSubImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ce(){try{n.texSubImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function de(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Me(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function nt(){try{n.texStorage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ne(){try{n.texStorage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ee(){try{n.texImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ke(){try{n.texImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function He(I){Xe.equals(I)===!1&&(n.scissor(I.x,I.y,I.z,I.w),Xe.copy(I))}function we(I){et.equals(I)===!1&&(n.viewport(I.x,I.y,I.z,I.w),et.copy(I))}function it(I,ye){let W=l.get(ye);W===void 0&&(W=new WeakMap,l.set(ye,W));let J=W.get(I);J===void 0&&(J=n.getUniformBlockIndex(ye,I.name),W.set(I,J))}function Ge(I,ye){const J=l.get(ye).get(I);a.get(ye)!==J&&(n.uniformBlockBinding(ye,J,I.__bindingPointIndex),a.set(ye,J))}function dt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),c={},V=null,re={},u={},h=new WeakMap,p=[],f=null,g=!1,_=null,d=null,m=null,v=null,x=null,S=null,R=null,b=new ze(0,0,0),A=0,L=!1,G=null,y=null,E=null,F=null,O=null,Xe.set(0,0,n.canvas.width,n.canvas.height),et.set(0,0,n.canvas.width,n.canvas.height),r.reset(),s.reset(),o.reset()}return{buffers:{color:r,depth:s,stencil:o},enable:ve,disable:he,bindFramebuffer:Ne,drawBuffers:De,useProgram:Ve,setBlending:C,setMaterial:ue,setFlipSided:ce,setCullFace:te,setLineWidth:fe,setPolygonOffset:Le,setScissorTest:xe,activeTexture:T,bindTexture:M,unbindTexture:N,compressedTexImage2D:q,compressedTexImage3D:Z,texImage2D:Ee,texImage3D:ke,updateUBOMapping:it,uniformBlockBinding:Ge,texStorage2D:nt,texStorage3D:ne,texSubImage2D:Y,texSubImage3D:Ce,compressedTexSubImage2D:de,compressedTexSubImage3D:Me,scissor:He,viewport:we,reset:dt}}function Oh(n,e,t,i){const r=mS(i);switch(t){case dd:return n*e;case md:return n*e;case gd:return n*e*2;case Oo:return n*e/r.components*r.byteLength;case Mc:return n*e/r.components*r.byteLength;case _d:return n*e*2/r.components*r.byteLength;case Ec:return n*e*2/r.components*r.byteLength;case pd:return n*e*3/r.components*r.byteLength;case Cn:return n*e*4/r.components*r.byteLength;case wc:return n*e*4/r.components*r.byteLength;case to:case no:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case io:case ro:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Sl:case El:return Math.max(n,16)*Math.max(e,8)/4;case yl:case Ml:return Math.max(n,8)*Math.max(e,8)/2;case wl:case bl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Tl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Al:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Cl:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Rl:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Pl:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Ll:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Il:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Dl:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Ul:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Nl:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Fl:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Ol:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Bl:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case zl:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case kl:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case so:case Hl:case Vl:return Math.ceil(n/4)*Math.ceil(e/4)*16;case vd:case Gl:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Wl:case Xl:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function mS(n){switch(n){case Kn:case ud:return{byteLength:1,components:1};case ts:case hd:case ss:return{byteLength:2,components:1};case yc:case Sc:return{byteLength:2,components:4};case ki:case xc:case Un:return{byteLength:4,components:1};case fd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function gS(n,e,t,i,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new se,u=new WeakMap;let h;const p=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,M){return f?new OffscreenCanvas(T,M):bo("canvas")}function _(T,M,N){let q=1;const Z=xe(T);if((Z.width>N||Z.height>N)&&(q=N/Math.max(Z.width,Z.height)),q<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const Y=Math.floor(q*Z.width),Ce=Math.floor(q*Z.height);h===void 0&&(h=g(Y,Ce));const de=M?g(Y,Ce):h;return de.width=Y,de.height=Ce,de.getContext("2d").drawImage(T,0,0,Y,Ce),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+Y+"x"+Ce+")."),de}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),T;return T}function d(T){return T.generateMipmaps&&T.minFilter!==Zt&&T.minFilter!==Tn}function m(T){n.generateMipmap(T)}function v(T,M,N,q,Z=!1){if(T!==null){if(n[T]!==void 0)return n[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let Y=M;if(M===n.RED&&(N===n.FLOAT&&(Y=n.R32F),N===n.HALF_FLOAT&&(Y=n.R16F),N===n.UNSIGNED_BYTE&&(Y=n.R8)),M===n.RED_INTEGER&&(N===n.UNSIGNED_BYTE&&(Y=n.R8UI),N===n.UNSIGNED_SHORT&&(Y=n.R16UI),N===n.UNSIGNED_INT&&(Y=n.R32UI),N===n.BYTE&&(Y=n.R8I),N===n.SHORT&&(Y=n.R16I),N===n.INT&&(Y=n.R32I)),M===n.RG&&(N===n.FLOAT&&(Y=n.RG32F),N===n.HALF_FLOAT&&(Y=n.RG16F),N===n.UNSIGNED_BYTE&&(Y=n.RG8)),M===n.RG_INTEGER&&(N===n.UNSIGNED_BYTE&&(Y=n.RG8UI),N===n.UNSIGNED_SHORT&&(Y=n.RG16UI),N===n.UNSIGNED_INT&&(Y=n.RG32UI),N===n.BYTE&&(Y=n.RG8I),N===n.SHORT&&(Y=n.RG16I),N===n.INT&&(Y=n.RG32I)),M===n.RGB_INTEGER&&(N===n.UNSIGNED_BYTE&&(Y=n.RGB8UI),N===n.UNSIGNED_SHORT&&(Y=n.RGB16UI),N===n.UNSIGNED_INT&&(Y=n.RGB32UI),N===n.BYTE&&(Y=n.RGB8I),N===n.SHORT&&(Y=n.RGB16I),N===n.INT&&(Y=n.RGB32I)),M===n.RGBA_INTEGER&&(N===n.UNSIGNED_BYTE&&(Y=n.RGBA8UI),N===n.UNSIGNED_SHORT&&(Y=n.RGBA16UI),N===n.UNSIGNED_INT&&(Y=n.RGBA32UI),N===n.BYTE&&(Y=n.RGBA8I),N===n.SHORT&&(Y=n.RGBA16I),N===n.INT&&(Y=n.RGBA32I)),M===n.RGB&&N===n.UNSIGNED_INT_5_9_9_9_REV&&(Y=n.RGB9_E5),M===n.RGBA){const Ce=Z?So:ht.getTransfer(q);N===n.FLOAT&&(Y=n.RGBA32F),N===n.HALF_FLOAT&&(Y=n.RGBA16F),N===n.UNSIGNED_BYTE&&(Y=Ce===vt?n.SRGB8_ALPHA8:n.RGBA8),N===n.UNSIGNED_SHORT_4_4_4_4&&(Y=n.RGBA4),N===n.UNSIGNED_SHORT_5_5_5_1&&(Y=n.RGB5_A1)}return(Y===n.R16F||Y===n.R32F||Y===n.RG16F||Y===n.RG32F||Y===n.RGBA16F||Y===n.RGBA32F)&&e.get("EXT_color_buffer_float"),Y}function x(T,M){let N;return T?M===null||M===ki||M===xr?N=n.DEPTH24_STENCIL8:M===Un?N=n.DEPTH32F_STENCIL8:M===ts&&(N=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===ki||M===xr?N=n.DEPTH_COMPONENT24:M===Un?N=n.DEPTH_COMPONENT32F:M===ts&&(N=n.DEPTH_COMPONENT16),N}function S(T,M){return d(T)===!0||T.isFramebufferTexture&&T.minFilter!==Zt&&T.minFilter!==Tn?Math.log2(Math.max(M.width,M.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?M.mipmaps.length:1}function R(T){const M=T.target;M.removeEventListener("dispose",R),A(M),M.isVideoTexture&&u.delete(M)}function b(T){const M=T.target;M.removeEventListener("dispose",b),G(M)}function A(T){const M=i.get(T);if(M.__webglInit===void 0)return;const N=T.source,q=p.get(N);if(q){const Z=q[M.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&L(T),Object.keys(q).length===0&&p.delete(N)}i.remove(T)}function L(T){const M=i.get(T);n.deleteTexture(M.__webglTexture);const N=T.source,q=p.get(N);delete q[M.__cacheKey],o.memory.textures--}function G(T){const M=i.get(T);if(T.depthTexture&&T.depthTexture.dispose(),T.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(M.__webglFramebuffer[q]))for(let Z=0;Z<M.__webglFramebuffer[q].length;Z++)n.deleteFramebuffer(M.__webglFramebuffer[q][Z]);else n.deleteFramebuffer(M.__webglFramebuffer[q]);M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer[q])}else{if(Array.isArray(M.__webglFramebuffer))for(let q=0;q<M.__webglFramebuffer.length;q++)n.deleteFramebuffer(M.__webglFramebuffer[q]);else n.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&n.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let q=0;q<M.__webglColorRenderbuffer.length;q++)M.__webglColorRenderbuffer[q]&&n.deleteRenderbuffer(M.__webglColorRenderbuffer[q]);M.__webglDepthRenderbuffer&&n.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const N=T.textures;for(let q=0,Z=N.length;q<Z;q++){const Y=i.get(N[q]);Y.__webglTexture&&(n.deleteTexture(Y.__webglTexture),o.memory.textures--),i.remove(N[q])}i.remove(T)}let y=0;function E(){y=0}function F(){const T=y;return T>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+r.maxTextures),y+=1,T}function O(T){const M=[];return M.push(T.wrapS),M.push(T.wrapT),M.push(T.wrapR||0),M.push(T.magFilter),M.push(T.minFilter),M.push(T.anisotropy),M.push(T.internalFormat),M.push(T.format),M.push(T.type),M.push(T.generateMipmaps),M.push(T.premultiplyAlpha),M.push(T.flipY),M.push(T.unpackAlignment),M.push(T.colorSpace),M.join()}function H(T,M){const N=i.get(T);if(T.isVideoTexture&&fe(T),T.isRenderTargetTexture===!1&&T.version>0&&N.__version!==T.version){const q=T.image;if(q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{et(N,T,M);return}}t.bindTexture(n.TEXTURE_2D,N.__webglTexture,n.TEXTURE0+M)}function j(T,M){const N=i.get(T);if(T.version>0&&N.__version!==T.version){et(N,T,M);return}t.bindTexture(n.TEXTURE_2D_ARRAY,N.__webglTexture,n.TEXTURE0+M)}function B(T,M){const N=i.get(T);if(T.version>0&&N.__version!==T.version){et(N,T,M);return}t.bindTexture(n.TEXTURE_3D,N.__webglTexture,n.TEXTURE0+M)}function X(T,M){const N=i.get(T);if(T.version>0&&N.__version!==T.version){$(N,T,M);return}t.bindTexture(n.TEXTURE_CUBE_MAP,N.__webglTexture,n.TEXTURE0+M)}const V={[vl]:n.REPEAT,[Bi]:n.CLAMP_TO_EDGE,[xl]:n.MIRRORED_REPEAT},re={[Zt]:n.NEAREST,[n0]:n.NEAREST_MIPMAP_NEAREST,[ps]:n.NEAREST_MIPMAP_LINEAR,[Tn]:n.LINEAR,[sa]:n.LINEAR_MIPMAP_NEAREST,[zi]:n.LINEAR_MIPMAP_LINEAR},oe={[o0]:n.NEVER,[f0]:n.ALWAYS,[a0]:n.LESS,[yd]:n.LEQUAL,[l0]:n.EQUAL,[h0]:n.GEQUAL,[c0]:n.GREATER,[u0]:n.NOTEQUAL};function le(T,M){if(M.type===Un&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===Tn||M.magFilter===sa||M.magFilter===ps||M.magFilter===zi||M.minFilter===Tn||M.minFilter===sa||M.minFilter===ps||M.minFilter===zi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(T,n.TEXTURE_WRAP_S,V[M.wrapS]),n.texParameteri(T,n.TEXTURE_WRAP_T,V[M.wrapT]),(T===n.TEXTURE_3D||T===n.TEXTURE_2D_ARRAY)&&n.texParameteri(T,n.TEXTURE_WRAP_R,V[M.wrapR]),n.texParameteri(T,n.TEXTURE_MAG_FILTER,re[M.magFilter]),n.texParameteri(T,n.TEXTURE_MIN_FILTER,re[M.minFilter]),M.compareFunction&&(n.texParameteri(T,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(T,n.TEXTURE_COMPARE_FUNC,oe[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===Zt||M.minFilter!==ps&&M.minFilter!==zi||M.type===Un&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||i.get(M).__currentAnisotropy){const N=e.get("EXT_texture_filter_anisotropic");n.texParameterf(T,N.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,r.getMaxAnisotropy())),i.get(M).__currentAnisotropy=M.anisotropy}}}function Xe(T,M){let N=!1;T.__webglInit===void 0&&(T.__webglInit=!0,M.addEventListener("dispose",R));const q=M.source;let Z=p.get(q);Z===void 0&&(Z={},p.set(q,Z));const Y=O(M);if(Y!==T.__cacheKey){Z[Y]===void 0&&(Z[Y]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,N=!0),Z[Y].usedTimes++;const Ce=Z[T.__cacheKey];Ce!==void 0&&(Z[T.__cacheKey].usedTimes--,Ce.usedTimes===0&&L(M)),T.__cacheKey=Y,T.__webglTexture=Z[Y].texture}return N}function et(T,M,N){let q=n.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(q=n.TEXTURE_2D_ARRAY),M.isData3DTexture&&(q=n.TEXTURE_3D);const Z=Xe(T,M),Y=M.source;t.bindTexture(q,T.__webglTexture,n.TEXTURE0+N);const Ce=i.get(Y);if(Y.version!==Ce.__version||Z===!0){t.activeTexture(n.TEXTURE0+N);const de=ht.getPrimaries(ht.workingColorSpace),Me=M.colorSpace===fi?null:ht.getPrimaries(M.colorSpace),nt=M.colorSpace===fi||de===Me?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,nt);let ne=_(M.image,!1,r.maxTextureSize);ne=Le(M,ne);const Ee=s.convert(M.format,M.colorSpace),ke=s.convert(M.type);let He=v(M.internalFormat,Ee,ke,M.colorSpace,M.isVideoTexture);le(q,M);let we;const it=M.mipmaps,Ge=M.isVideoTexture!==!0,dt=Ce.__version===void 0||Z===!0,I=Y.dataReady,ye=S(M,ne);if(M.isDepthTexture)He=x(M.format===yr,M.type),dt&&(Ge?t.texStorage2D(n.TEXTURE_2D,1,He,ne.width,ne.height):t.texImage2D(n.TEXTURE_2D,0,He,ne.width,ne.height,0,Ee,ke,null));else if(M.isDataTexture)if(it.length>0){Ge&&dt&&t.texStorage2D(n.TEXTURE_2D,ye,He,it[0].width,it[0].height);for(let W=0,J=it.length;W<J;W++)we=it[W],Ge?I&&t.texSubImage2D(n.TEXTURE_2D,W,0,0,we.width,we.height,Ee,ke,we.data):t.texImage2D(n.TEXTURE_2D,W,He,we.width,we.height,0,Ee,ke,we.data);M.generateMipmaps=!1}else Ge?(dt&&t.texStorage2D(n.TEXTURE_2D,ye,He,ne.width,ne.height),I&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ne.width,ne.height,Ee,ke,ne.data)):t.texImage2D(n.TEXTURE_2D,0,He,ne.width,ne.height,0,Ee,ke,ne.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Ge&&dt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ye,He,it[0].width,it[0].height,ne.depth);for(let W=0,J=it.length;W<J;W++)if(we=it[W],M.format!==Cn)if(Ee!==null)if(Ge){if(I)if(M.layerUpdates.size>0){const ge=Oh(we.width,we.height,M.format,M.type);for(const Se of M.layerUpdates){const st=we.data.subarray(Se*ge/we.data.BYTES_PER_ELEMENT,(Se+1)*ge/we.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,W,0,0,Se,we.width,we.height,1,Ee,st,0,0)}M.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,W,0,0,0,we.width,we.height,ne.depth,Ee,we.data,0,0)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,W,He,we.width,we.height,ne.depth,0,we.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ge?I&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,W,0,0,0,we.width,we.height,ne.depth,Ee,ke,we.data):t.texImage3D(n.TEXTURE_2D_ARRAY,W,He,we.width,we.height,ne.depth,0,Ee,ke,we.data)}else{Ge&&dt&&t.texStorage2D(n.TEXTURE_2D,ye,He,it[0].width,it[0].height);for(let W=0,J=it.length;W<J;W++)we=it[W],M.format!==Cn?Ee!==null?Ge?I&&t.compressedTexSubImage2D(n.TEXTURE_2D,W,0,0,we.width,we.height,Ee,we.data):t.compressedTexImage2D(n.TEXTURE_2D,W,He,we.width,we.height,0,we.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ge?I&&t.texSubImage2D(n.TEXTURE_2D,W,0,0,we.width,we.height,Ee,ke,we.data):t.texImage2D(n.TEXTURE_2D,W,He,we.width,we.height,0,Ee,ke,we.data)}else if(M.isDataArrayTexture)if(Ge){if(dt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ye,He,ne.width,ne.height,ne.depth),I)if(M.layerUpdates.size>0){const W=Oh(ne.width,ne.height,M.format,M.type);for(const J of M.layerUpdates){const ge=ne.data.subarray(J*W/ne.data.BYTES_PER_ELEMENT,(J+1)*W/ne.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,J,ne.width,ne.height,1,Ee,ke,ge)}M.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,Ee,ke,ne.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,He,ne.width,ne.height,ne.depth,0,Ee,ke,ne.data);else if(M.isData3DTexture)Ge?(dt&&t.texStorage3D(n.TEXTURE_3D,ye,He,ne.width,ne.height,ne.depth),I&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,Ee,ke,ne.data)):t.texImage3D(n.TEXTURE_3D,0,He,ne.width,ne.height,ne.depth,0,Ee,ke,ne.data);else if(M.isFramebufferTexture){if(dt)if(Ge)t.texStorage2D(n.TEXTURE_2D,ye,He,ne.width,ne.height);else{let W=ne.width,J=ne.height;for(let ge=0;ge<ye;ge++)t.texImage2D(n.TEXTURE_2D,ge,He,W,J,0,Ee,ke,null),W>>=1,J>>=1}}else if(it.length>0){if(Ge&&dt){const W=xe(it[0]);t.texStorage2D(n.TEXTURE_2D,ye,He,W.width,W.height)}for(let W=0,J=it.length;W<J;W++)we=it[W],Ge?I&&t.texSubImage2D(n.TEXTURE_2D,W,0,0,Ee,ke,we):t.texImage2D(n.TEXTURE_2D,W,He,Ee,ke,we);M.generateMipmaps=!1}else if(Ge){if(dt){const W=xe(ne);t.texStorage2D(n.TEXTURE_2D,ye,He,W.width,W.height)}I&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,Ee,ke,ne)}else t.texImage2D(n.TEXTURE_2D,0,He,Ee,ke,ne);d(M)&&m(q),Ce.__version=Y.version,M.onUpdate&&M.onUpdate(M)}T.__version=M.version}function $(T,M,N){if(M.image.length!==6)return;const q=Xe(T,M),Z=M.source;t.bindTexture(n.TEXTURE_CUBE_MAP,T.__webglTexture,n.TEXTURE0+N);const Y=i.get(Z);if(Z.version!==Y.__version||q===!0){t.activeTexture(n.TEXTURE0+N);const Ce=ht.getPrimaries(ht.workingColorSpace),de=M.colorSpace===fi?null:ht.getPrimaries(M.colorSpace),Me=M.colorSpace===fi||Ce===de?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Me);const nt=M.isCompressedTexture||M.image[0].isCompressedTexture,ne=M.image[0]&&M.image[0].isDataTexture,Ee=[];for(let J=0;J<6;J++)!nt&&!ne?Ee[J]=_(M.image[J],!0,r.maxCubemapSize):Ee[J]=ne?M.image[J].image:M.image[J],Ee[J]=Le(M,Ee[J]);const ke=Ee[0],He=s.convert(M.format,M.colorSpace),we=s.convert(M.type),it=v(M.internalFormat,He,we,M.colorSpace),Ge=M.isVideoTexture!==!0,dt=Y.__version===void 0||q===!0,I=Z.dataReady;let ye=S(M,ke);le(n.TEXTURE_CUBE_MAP,M);let W;if(nt){Ge&&dt&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ye,it,ke.width,ke.height);for(let J=0;J<6;J++){W=Ee[J].mipmaps;for(let ge=0;ge<W.length;ge++){const Se=W[ge];M.format!==Cn?He!==null?Ge?I&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,ge,0,0,Se.width,Se.height,He,Se.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,ge,it,Se.width,Se.height,0,Se.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ge?I&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,ge,0,0,Se.width,Se.height,He,we,Se.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,ge,it,Se.width,Se.height,0,He,we,Se.data)}}}else{if(W=M.mipmaps,Ge&&dt){W.length>0&&ye++;const J=xe(Ee[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,ye,it,J.width,J.height)}for(let J=0;J<6;J++)if(ne){Ge?I&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,Ee[J].width,Ee[J].height,He,we,Ee[J].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,it,Ee[J].width,Ee[J].height,0,He,we,Ee[J].data);for(let ge=0;ge<W.length;ge++){const st=W[ge].image[J].image;Ge?I&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,ge+1,0,0,st.width,st.height,He,we,st.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,ge+1,it,st.width,st.height,0,He,we,st.data)}}else{Ge?I&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,He,we,Ee[J]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,it,He,we,Ee[J]);for(let ge=0;ge<W.length;ge++){const Se=W[ge];Ge?I&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,ge+1,0,0,He,we,Se.image[J]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,ge+1,it,He,we,Se.image[J])}}}d(M)&&m(n.TEXTURE_CUBE_MAP),Y.__version=Z.version,M.onUpdate&&M.onUpdate(M)}T.__version=M.version}function ee(T,M,N,q,Z,Y){const Ce=s.convert(N.format,N.colorSpace),de=s.convert(N.type),Me=v(N.internalFormat,Ce,de,N.colorSpace);if(!i.get(M).__hasExternalTextures){const ne=Math.max(1,M.width>>Y),Ee=Math.max(1,M.height>>Y);Z===n.TEXTURE_3D||Z===n.TEXTURE_2D_ARRAY?t.texImage3D(Z,Y,Me,ne,Ee,M.depth,0,Ce,de,null):t.texImage2D(Z,Y,Me,ne,Ee,0,Ce,de,null)}t.bindFramebuffer(n.FRAMEBUFFER,T),te(M)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,q,Z,i.get(N).__webglTexture,0,ce(M)):(Z===n.TEXTURE_2D||Z>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,q,Z,i.get(N).__webglTexture,Y),t.bindFramebuffer(n.FRAMEBUFFER,null)}function ve(T,M,N){if(n.bindRenderbuffer(n.RENDERBUFFER,T),M.depthBuffer){const q=M.depthTexture,Z=q&&q.isDepthTexture?q.type:null,Y=x(M.stencilBuffer,Z),Ce=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,de=ce(M);te(M)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,de,Y,M.width,M.height):N?n.renderbufferStorageMultisample(n.RENDERBUFFER,de,Y,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,Y,M.width,M.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Ce,n.RENDERBUFFER,T)}else{const q=M.textures;for(let Z=0;Z<q.length;Z++){const Y=q[Z],Ce=s.convert(Y.format,Y.colorSpace),de=s.convert(Y.type),Me=v(Y.internalFormat,Ce,de,Y.colorSpace),nt=ce(M);N&&te(M)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,nt,Me,M.width,M.height):te(M)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,nt,Me,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,Me,M.width,M.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function he(T,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,T),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(M.depthTexture).__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),H(M.depthTexture,0);const q=i.get(M.depthTexture).__webglTexture,Z=ce(M);if(M.depthTexture.format===dr)te(M)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,q,0,Z):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,q,0);else if(M.depthTexture.format===yr)te(M)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,q,0,Z):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,q,0);else throw new Error("Unknown depthTexture format")}function Ne(T){const M=i.get(T),N=T.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==T.depthTexture){const q=T.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),q){const Z=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,q.removeEventListener("dispose",Z)};q.addEventListener("dispose",Z),M.__depthDisposeCallback=Z}M.__boundDepthTexture=q}if(T.depthTexture&&!M.__autoAllocateDepthBuffer){if(N)throw new Error("target.depthTexture not supported in Cube render targets");he(M.__webglFramebuffer,T)}else if(N){M.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[q]),M.__webglDepthbuffer[q]===void 0)M.__webglDepthbuffer[q]=n.createRenderbuffer(),ve(M.__webglDepthbuffer[q],T,!1);else{const Z=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Y=M.__webglDepthbuffer[q];n.bindRenderbuffer(n.RENDERBUFFER,Y),n.framebufferRenderbuffer(n.FRAMEBUFFER,Z,n.RENDERBUFFER,Y)}}else if(t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=n.createRenderbuffer(),ve(M.__webglDepthbuffer,T,!1);else{const q=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Z=M.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,Z),n.framebufferRenderbuffer(n.FRAMEBUFFER,q,n.RENDERBUFFER,Z)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function De(T,M,N){const q=i.get(T);M!==void 0&&ee(q.__webglFramebuffer,T,T.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),N!==void 0&&Ne(T)}function Ve(T){const M=T.texture,N=i.get(T),q=i.get(M);T.addEventListener("dispose",b);const Z=T.textures,Y=T.isWebGLCubeRenderTarget===!0,Ce=Z.length>1;if(Ce||(q.__webglTexture===void 0&&(q.__webglTexture=n.createTexture()),q.__version=M.version,o.memory.textures++),Y){N.__webglFramebuffer=[];for(let de=0;de<6;de++)if(M.mipmaps&&M.mipmaps.length>0){N.__webglFramebuffer[de]=[];for(let Me=0;Me<M.mipmaps.length;Me++)N.__webglFramebuffer[de][Me]=n.createFramebuffer()}else N.__webglFramebuffer[de]=n.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){N.__webglFramebuffer=[];for(let de=0;de<M.mipmaps.length;de++)N.__webglFramebuffer[de]=n.createFramebuffer()}else N.__webglFramebuffer=n.createFramebuffer();if(Ce)for(let de=0,Me=Z.length;de<Me;de++){const nt=i.get(Z[de]);nt.__webglTexture===void 0&&(nt.__webglTexture=n.createTexture(),o.memory.textures++)}if(T.samples>0&&te(T)===!1){N.__webglMultisampledFramebuffer=n.createFramebuffer(),N.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let de=0;de<Z.length;de++){const Me=Z[de];N.__webglColorRenderbuffer[de]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,N.__webglColorRenderbuffer[de]);const nt=s.convert(Me.format,Me.colorSpace),ne=s.convert(Me.type),Ee=v(Me.internalFormat,nt,ne,Me.colorSpace,T.isXRRenderTarget===!0),ke=ce(T);n.renderbufferStorageMultisample(n.RENDERBUFFER,ke,Ee,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+de,n.RENDERBUFFER,N.__webglColorRenderbuffer[de])}n.bindRenderbuffer(n.RENDERBUFFER,null),T.depthBuffer&&(N.__webglDepthRenderbuffer=n.createRenderbuffer(),ve(N.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(Y){t.bindTexture(n.TEXTURE_CUBE_MAP,q.__webglTexture),le(n.TEXTURE_CUBE_MAP,M);for(let de=0;de<6;de++)if(M.mipmaps&&M.mipmaps.length>0)for(let Me=0;Me<M.mipmaps.length;Me++)ee(N.__webglFramebuffer[de][Me],T,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+de,Me);else ee(N.__webglFramebuffer[de],T,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+de,0);d(M)&&m(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ce){for(let de=0,Me=Z.length;de<Me;de++){const nt=Z[de],ne=i.get(nt);t.bindTexture(n.TEXTURE_2D,ne.__webglTexture),le(n.TEXTURE_2D,nt),ee(N.__webglFramebuffer,T,nt,n.COLOR_ATTACHMENT0+de,n.TEXTURE_2D,0),d(nt)&&m(n.TEXTURE_2D)}t.unbindTexture()}else{let de=n.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(de=T.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(de,q.__webglTexture),le(de,M),M.mipmaps&&M.mipmaps.length>0)for(let Me=0;Me<M.mipmaps.length;Me++)ee(N.__webglFramebuffer[Me],T,M,n.COLOR_ATTACHMENT0,de,Me);else ee(N.__webglFramebuffer,T,M,n.COLOR_ATTACHMENT0,de,0);d(M)&&m(de),t.unbindTexture()}T.depthBuffer&&Ne(T)}function Ke(T){const M=T.textures;for(let N=0,q=M.length;N<q;N++){const Z=M[N];if(d(Z)){const Y=T.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,Ce=i.get(Z).__webglTexture;t.bindTexture(Y,Ce),m(Y),t.unbindTexture()}}}const K=[],C=[];function ue(T){if(T.samples>0){if(te(T)===!1){const M=T.textures,N=T.width,q=T.height;let Z=n.COLOR_BUFFER_BIT;const Y=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ce=i.get(T),de=M.length>1;if(de)for(let Me=0;Me<M.length;Me++)t.bindFramebuffer(n.FRAMEBUFFER,Ce.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Me,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Ce.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Me,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Ce.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ce.__webglFramebuffer);for(let Me=0;Me<M.length;Me++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(Z|=n.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(Z|=n.STENCIL_BUFFER_BIT)),de){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Ce.__webglColorRenderbuffer[Me]);const nt=i.get(M[Me]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,nt,0)}n.blitFramebuffer(0,0,N,q,0,0,N,q,Z,n.NEAREST),l===!0&&(K.length=0,C.length=0,K.push(n.COLOR_ATTACHMENT0+Me),T.depthBuffer&&T.resolveDepthBuffer===!1&&(K.push(Y),C.push(Y),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,C)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,K))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),de)for(let Me=0;Me<M.length;Me++){t.bindFramebuffer(n.FRAMEBUFFER,Ce.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Me,n.RENDERBUFFER,Ce.__webglColorRenderbuffer[Me]);const nt=i.get(M[Me]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Ce.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Me,n.TEXTURE_2D,nt,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ce.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){const M=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[M])}}}function ce(T){return Math.min(r.maxSamples,T.samples)}function te(T){const M=i.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function fe(T){const M=o.render.frame;u.get(T)!==M&&(u.set(T,M),T.update())}function Le(T,M){const N=T.colorSpace,q=T.format,Z=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||N!==yi&&N!==fi&&(ht.getTransfer(N)===vt?(q!==Cn||Z!==Kn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",N)),M}function xe(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=F,this.resetTextureUnits=E,this.setTexture2D=H,this.setTexture2DArray=j,this.setTexture3D=B,this.setTextureCube=X,this.rebindTextures=De,this.setupRenderTarget=Ve,this.updateRenderTargetMipmap=Ke,this.updateMultisampleRenderTarget=ue,this.setupDepthRenderbuffer=Ne,this.setupFrameBufferTexture=ee,this.useMultisampledRTT=te}function _S(n,e){function t(i,r=fi){let s;const o=ht.getTransfer(r);if(i===Kn)return n.UNSIGNED_BYTE;if(i===yc)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Sc)return n.UNSIGNED_SHORT_5_5_5_1;if(i===fd)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===ud)return n.BYTE;if(i===hd)return n.SHORT;if(i===ts)return n.UNSIGNED_SHORT;if(i===xc)return n.INT;if(i===ki)return n.UNSIGNED_INT;if(i===Un)return n.FLOAT;if(i===ss)return n.HALF_FLOAT;if(i===dd)return n.ALPHA;if(i===pd)return n.RGB;if(i===Cn)return n.RGBA;if(i===md)return n.LUMINANCE;if(i===gd)return n.LUMINANCE_ALPHA;if(i===dr)return n.DEPTH_COMPONENT;if(i===yr)return n.DEPTH_STENCIL;if(i===Oo)return n.RED;if(i===Mc)return n.RED_INTEGER;if(i===_d)return n.RG;if(i===Ec)return n.RG_INTEGER;if(i===wc)return n.RGBA_INTEGER;if(i===to||i===no||i===io||i===ro)if(o===vt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===to)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===no)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===io)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===ro)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===to)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===no)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===io)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===ro)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===yl||i===Sl||i===Ml||i===El)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===yl)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Sl)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Ml)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===El)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===wl||i===bl||i===Tl)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===wl||i===bl)return o===vt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Tl)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Al||i===Cl||i===Rl||i===Pl||i===Ll||i===Il||i===Dl||i===Ul||i===Nl||i===Fl||i===Ol||i===Bl||i===zl||i===kl)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Al)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Cl)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Rl)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Pl)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ll)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Il)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Dl)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Ul)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Nl)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Fl)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Ol)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Bl)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===zl)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===kl)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===so||i===Hl||i===Vl)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===so)return o===vt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Hl)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Vl)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===vd||i===Gl||i===Wl||i===Xl)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===so)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Gl)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Wl)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Xl)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===xr?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}class vS extends yn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Be extends Et{constructor(){super(),this.isGroup=!0,this.type="Group"}}const xS={type:"move"};class Na{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Be,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Be,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Be,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const _ of e.hand.values()){const d=t.getJointPose(_,i),m=this._getHandJoint(c,_);d!==null&&(m.matrix.fromArray(d.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=d.radius),m.visible=d!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],p=u.position.distanceTo(h.position),f=.02,g=.005;c.inputState.pinching&&p>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&p<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(xS)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Be;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const yS=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,SS=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class MS{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){const r=new qt,s=e.properties.get(r);s.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Jn({vertexShader:yS,fragmentShader:SS,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Je(new It(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class ES extends br{constructor(e,t){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,p=null,f=null,g=null;const _=new MS,d=t.getContextAttributes();let m=null,v=null;const x=[],S=[],R=new se;let b=null;const A=new yn;A.layers.enable(1),A.viewport=new gt;const L=new yn;L.layers.enable(2),L.viewport=new gt;const G=[A,L],y=new vS;y.layers.enable(1),y.layers.enable(2);let E=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let ee=x[$];return ee===void 0&&(ee=new Na,x[$]=ee),ee.getTargetRaySpace()},this.getControllerGrip=function($){let ee=x[$];return ee===void 0&&(ee=new Na,x[$]=ee),ee.getGripSpace()},this.getHand=function($){let ee=x[$];return ee===void 0&&(ee=new Na,x[$]=ee),ee.getHandSpace()};function O($){const ee=S.indexOf($.inputSource);if(ee===-1)return;const ve=x[ee];ve!==void 0&&(ve.update($.inputSource,$.frame,c||o),ve.dispatchEvent({type:$.type,data:$.inputSource}))}function H(){r.removeEventListener("select",O),r.removeEventListener("selectstart",O),r.removeEventListener("selectend",O),r.removeEventListener("squeeze",O),r.removeEventListener("squeezestart",O),r.removeEventListener("squeezeend",O),r.removeEventListener("end",H),r.removeEventListener("inputsourceschange",j);for(let $=0;$<x.length;$++){const ee=S[$];ee!==null&&(S[$]=null,x[$].disconnect(ee))}E=null,F=null,_.reset(),e.setRenderTarget(m),f=null,p=null,h=null,r=null,v=null,et.stop(),i.isPresenting=!1,e.setPixelRatio(b),e.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){s=$,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){a=$,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return p!==null?p:f},this.getBinding=function(){return h},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function($){if(r=$,r!==null){if(m=e.getRenderTarget(),r.addEventListener("select",O),r.addEventListener("selectstart",O),r.addEventListener("selectend",O),r.addEventListener("squeeze",O),r.addEventListener("squeezestart",O),r.addEventListener("squeezeend",O),r.addEventListener("end",H),r.addEventListener("inputsourceschange",j),d.xrCompatible!==!0&&await t.makeXRCompatible(),b=e.getPixelRatio(),e.getSize(R),r.renderState.layers===void 0){const ee={antialias:d.antialias,alpha:!0,depth:d.depth,stencil:d.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,t,ee),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new Hi(f.framebufferWidth,f.framebufferHeight,{format:Cn,type:Kn,colorSpace:e.outputColorSpace,stencilBuffer:d.stencil})}else{let ee=null,ve=null,he=null;d.depth&&(he=d.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ee=d.stencil?yr:dr,ve=d.stencil?xr:ki);const Ne={colorFormat:t.RGBA8,depthFormat:he,scaleFactor:s};h=new XRWebGLBinding(r,t),p=h.createProjectionLayer(Ne),r.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),v=new Hi(p.textureWidth,p.textureHeight,{format:Cn,type:Kn,depthTexture:new Dd(p.textureWidth,p.textureHeight,ve,void 0,void 0,void 0,void 0,void 0,void 0,ee),stencilBuffer:d.stencil,colorSpace:e.outputColorSpace,samples:d.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),et.setContext(r),et.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function j($){for(let ee=0;ee<$.removed.length;ee++){const ve=$.removed[ee],he=S.indexOf(ve);he>=0&&(S[he]=null,x[he].disconnect(ve))}for(let ee=0;ee<$.added.length;ee++){const ve=$.added[ee];let he=S.indexOf(ve);if(he===-1){for(let De=0;De<x.length;De++)if(De>=S.length){S.push(ve),he=De;break}else if(S[De]===null){S[De]=ve,he=De;break}if(he===-1)break}const Ne=x[he];Ne&&Ne.connect(ve)}}const B=new P,X=new P;function V($,ee,ve){B.setFromMatrixPosition(ee.matrixWorld),X.setFromMatrixPosition(ve.matrixWorld);const he=B.distanceTo(X),Ne=ee.projectionMatrix.elements,De=ve.projectionMatrix.elements,Ve=Ne[14]/(Ne[10]-1),Ke=Ne[14]/(Ne[10]+1),K=(Ne[9]+1)/Ne[5],C=(Ne[9]-1)/Ne[5],ue=(Ne[8]-1)/Ne[0],ce=(De[8]+1)/De[0],te=Ve*ue,fe=Ve*ce,Le=he/(-ue+ce),xe=Le*-ue;if(ee.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(xe),$.translateZ(Le),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),Ne[10]===-1)$.projectionMatrix.copy(ee.projectionMatrix),$.projectionMatrixInverse.copy(ee.projectionMatrixInverse);else{const T=Ve+Le,M=Ke+Le,N=te-xe,q=fe+(he-xe),Z=K*Ke/M*T,Y=C*Ke/M*T;$.projectionMatrix.makePerspective(N,q,Z,Y,T,M),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function re($,ee){ee===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(ee.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(r===null)return;let ee=$.near,ve=$.far;_.texture!==null&&(_.depthNear>0&&(ee=_.depthNear),_.depthFar>0&&(ve=_.depthFar)),y.near=L.near=A.near=ee,y.far=L.far=A.far=ve,(E!==y.near||F!==y.far)&&(r.updateRenderState({depthNear:y.near,depthFar:y.far}),E=y.near,F=y.far);const he=$.parent,Ne=y.cameras;re(y,he);for(let De=0;De<Ne.length;De++)re(Ne[De],he);Ne.length===2?V(y,A,L):y.projectionMatrix.copy(A.projectionMatrix),oe($,y,he)};function oe($,ee,ve){ve===null?$.matrix.copy(ee.matrixWorld):($.matrix.copy(ve.matrixWorld),$.matrix.invert(),$.matrix.multiply(ee.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(ee.projectionMatrix),$.projectionMatrixInverse.copy(ee.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=$l*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(p===null&&f===null))return l},this.setFoveation=function($){l=$,p!==null&&(p.fixedFoveation=$),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=$)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(y)};let le=null;function Xe($,ee){if(u=ee.getViewerPose(c||o),g=ee,u!==null){const ve=u.views;f!==null&&(e.setRenderTargetFramebuffer(v,f.framebuffer),e.setRenderTarget(v));let he=!1;ve.length!==y.cameras.length&&(y.cameras.length=0,he=!0);for(let De=0;De<ve.length;De++){const Ve=ve[De];let Ke=null;if(f!==null)Ke=f.getViewport(Ve);else{const C=h.getViewSubImage(p,Ve);Ke=C.viewport,De===0&&(e.setRenderTargetTextures(v,C.colorTexture,p.ignoreDepthValues?void 0:C.depthStencilTexture),e.setRenderTarget(v))}let K=G[De];K===void 0&&(K=new yn,K.layers.enable(De),K.viewport=new gt,G[De]=K),K.matrix.fromArray(Ve.transform.matrix),K.matrix.decompose(K.position,K.quaternion,K.scale),K.projectionMatrix.fromArray(Ve.projectionMatrix),K.projectionMatrixInverse.copy(K.projectionMatrix).invert(),K.viewport.set(Ke.x,Ke.y,Ke.width,Ke.height),De===0&&(y.matrix.copy(K.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),he===!0&&y.cameras.push(K)}const Ne=r.enabledFeatures;if(Ne&&Ne.includes("depth-sensing")){const De=h.getDepthInformation(ve[0]);De&&De.isValid&&De.texture&&_.init(e,De,r.renderState)}}for(let ve=0;ve<x.length;ve++){const he=S[ve],Ne=x[ve];he!==null&&Ne!==void 0&&Ne.update(he,ee,c||o)}le&&le($,ee),ee.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ee}),g=null}const et=new Ld;et.setAnimationLoop(Xe),this.setAnimationLoop=function($){le=$},this.dispose=function(){}}}const Ci=new Zn,wS=new rt;function bS(n,e){function t(d,m){d.matrixAutoUpdate===!0&&d.updateMatrix(),m.value.copy(d.matrix)}function i(d,m){m.color.getRGB(d.fogColor.value,Cd(n)),m.isFog?(d.fogNear.value=m.near,d.fogFar.value=m.far):m.isFogExp2&&(d.fogDensity.value=m.density)}function r(d,m,v,x,S){m.isMeshBasicMaterial||m.isMeshLambertMaterial?s(d,m):m.isMeshToonMaterial?(s(d,m),h(d,m)):m.isMeshPhongMaterial?(s(d,m),u(d,m)):m.isMeshStandardMaterial?(s(d,m),p(d,m),m.isMeshPhysicalMaterial&&f(d,m,S)):m.isMeshMatcapMaterial?(s(d,m),g(d,m)):m.isMeshDepthMaterial?s(d,m):m.isMeshDistanceMaterial?(s(d,m),_(d,m)):m.isMeshNormalMaterial?s(d,m):m.isLineBasicMaterial?(o(d,m),m.isLineDashedMaterial&&a(d,m)):m.isPointsMaterial?l(d,m,v,x):m.isSpriteMaterial?c(d,m):m.isShadowMaterial?(d.color.value.copy(m.color),d.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function s(d,m){d.opacity.value=m.opacity,m.color&&d.diffuse.value.copy(m.color),m.emissive&&d.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(d.map.value=m.map,t(m.map,d.mapTransform)),m.alphaMap&&(d.alphaMap.value=m.alphaMap,t(m.alphaMap,d.alphaMapTransform)),m.bumpMap&&(d.bumpMap.value=m.bumpMap,t(m.bumpMap,d.bumpMapTransform),d.bumpScale.value=m.bumpScale,m.side===$t&&(d.bumpScale.value*=-1)),m.normalMap&&(d.normalMap.value=m.normalMap,t(m.normalMap,d.normalMapTransform),d.normalScale.value.copy(m.normalScale),m.side===$t&&d.normalScale.value.negate()),m.displacementMap&&(d.displacementMap.value=m.displacementMap,t(m.displacementMap,d.displacementMapTransform),d.displacementScale.value=m.displacementScale,d.displacementBias.value=m.displacementBias),m.emissiveMap&&(d.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,d.emissiveMapTransform)),m.specularMap&&(d.specularMap.value=m.specularMap,t(m.specularMap,d.specularMapTransform)),m.alphaTest>0&&(d.alphaTest.value=m.alphaTest);const v=e.get(m),x=v.envMap,S=v.envMapRotation;x&&(d.envMap.value=x,Ci.copy(S),Ci.x*=-1,Ci.y*=-1,Ci.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Ci.y*=-1,Ci.z*=-1),d.envMapRotation.value.setFromMatrix4(wS.makeRotationFromEuler(Ci)),d.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,d.reflectivity.value=m.reflectivity,d.ior.value=m.ior,d.refractionRatio.value=m.refractionRatio),m.lightMap&&(d.lightMap.value=m.lightMap,d.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,d.lightMapTransform)),m.aoMap&&(d.aoMap.value=m.aoMap,d.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,d.aoMapTransform))}function o(d,m){d.diffuse.value.copy(m.color),d.opacity.value=m.opacity,m.map&&(d.map.value=m.map,t(m.map,d.mapTransform))}function a(d,m){d.dashSize.value=m.dashSize,d.totalSize.value=m.dashSize+m.gapSize,d.scale.value=m.scale}function l(d,m,v,x){d.diffuse.value.copy(m.color),d.opacity.value=m.opacity,d.size.value=m.size*v,d.scale.value=x*.5,m.map&&(d.map.value=m.map,t(m.map,d.uvTransform)),m.alphaMap&&(d.alphaMap.value=m.alphaMap,t(m.alphaMap,d.alphaMapTransform)),m.alphaTest>0&&(d.alphaTest.value=m.alphaTest)}function c(d,m){d.diffuse.value.copy(m.color),d.opacity.value=m.opacity,d.rotation.value=m.rotation,m.map&&(d.map.value=m.map,t(m.map,d.mapTransform)),m.alphaMap&&(d.alphaMap.value=m.alphaMap,t(m.alphaMap,d.alphaMapTransform)),m.alphaTest>0&&(d.alphaTest.value=m.alphaTest)}function u(d,m){d.specular.value.copy(m.specular),d.shininess.value=Math.max(m.shininess,1e-4)}function h(d,m){m.gradientMap&&(d.gradientMap.value=m.gradientMap)}function p(d,m){d.metalness.value=m.metalness,m.metalnessMap&&(d.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,d.metalnessMapTransform)),d.roughness.value=m.roughness,m.roughnessMap&&(d.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,d.roughnessMapTransform)),m.envMap&&(d.envMapIntensity.value=m.envMapIntensity)}function f(d,m,v){d.ior.value=m.ior,m.sheen>0&&(d.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),d.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(d.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,d.sheenColorMapTransform)),m.sheenRoughnessMap&&(d.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,d.sheenRoughnessMapTransform))),m.clearcoat>0&&(d.clearcoat.value=m.clearcoat,d.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(d.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,d.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(d.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,d.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(d.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,d.clearcoatNormalMapTransform),d.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===$t&&d.clearcoatNormalScale.value.negate())),m.dispersion>0&&(d.dispersion.value=m.dispersion),m.iridescence>0&&(d.iridescence.value=m.iridescence,d.iridescenceIOR.value=m.iridescenceIOR,d.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],d.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(d.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,d.iridescenceMapTransform)),m.iridescenceThicknessMap&&(d.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,d.iridescenceThicknessMapTransform))),m.transmission>0&&(d.transmission.value=m.transmission,d.transmissionSamplerMap.value=v.texture,d.transmissionSamplerSize.value.set(v.width,v.height),m.transmissionMap&&(d.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,d.transmissionMapTransform)),d.thickness.value=m.thickness,m.thicknessMap&&(d.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,d.thicknessMapTransform)),d.attenuationDistance.value=m.attenuationDistance,d.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(d.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(d.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,d.anisotropyMapTransform))),d.specularIntensity.value=m.specularIntensity,d.specularColor.value.copy(m.specularColor),m.specularColorMap&&(d.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,d.specularColorMapTransform)),m.specularIntensityMap&&(d.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,d.specularIntensityMapTransform))}function g(d,m){m.matcap&&(d.matcap.value=m.matcap)}function _(d,m){const v=e.get(m).light;d.referencePosition.value.setFromMatrixPosition(v.matrixWorld),d.nearDistance.value=v.shadow.camera.near,d.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function TS(n,e,t,i){let r={},s={},o=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,x){const S=x.program;i.uniformBlockBinding(v,S)}function c(v,x){let S=r[v.id];S===void 0&&(g(v),S=u(v),r[v.id]=S,v.addEventListener("dispose",d));const R=x.program;i.updateUBOMapping(v,R);const b=e.render.frame;s[v.id]!==b&&(p(v),s[v.id]=b)}function u(v){const x=h();v.__bindingPointIndex=x;const S=n.createBuffer(),R=v.__size,b=v.usage;return n.bindBuffer(n.UNIFORM_BUFFER,S),n.bufferData(n.UNIFORM_BUFFER,R,b),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,S),S}function h(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(v){const x=r[v.id],S=v.uniforms,R=v.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let b=0,A=S.length;b<A;b++){const L=Array.isArray(S[b])?S[b]:[S[b]];for(let G=0,y=L.length;G<y;G++){const E=L[G];if(f(E,b,G,R)===!0){const F=E.__offset,O=Array.isArray(E.value)?E.value:[E.value];let H=0;for(let j=0;j<O.length;j++){const B=O[j],X=_(B);typeof B=="number"||typeof B=="boolean"?(E.__data[0]=B,n.bufferSubData(n.UNIFORM_BUFFER,F+H,E.__data)):B.isMatrix3?(E.__data[0]=B.elements[0],E.__data[1]=B.elements[1],E.__data[2]=B.elements[2],E.__data[3]=0,E.__data[4]=B.elements[3],E.__data[5]=B.elements[4],E.__data[6]=B.elements[5],E.__data[7]=0,E.__data[8]=B.elements[6],E.__data[9]=B.elements[7],E.__data[10]=B.elements[8],E.__data[11]=0):(B.toArray(E.__data,H),H+=X.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,F,E.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(v,x,S,R){const b=v.value,A=x+"_"+S;if(R[A]===void 0)return typeof b=="number"||typeof b=="boolean"?R[A]=b:R[A]=b.clone(),!0;{const L=R[A];if(typeof b=="number"||typeof b=="boolean"){if(L!==b)return R[A]=b,!0}else if(L.equals(b)===!1)return L.copy(b),!0}return!1}function g(v){const x=v.uniforms;let S=0;const R=16;for(let A=0,L=x.length;A<L;A++){const G=Array.isArray(x[A])?x[A]:[x[A]];for(let y=0,E=G.length;y<E;y++){const F=G[y],O=Array.isArray(F.value)?F.value:[F.value];for(let H=0,j=O.length;H<j;H++){const B=O[H],X=_(B),V=S%R,re=V%X.boundary,oe=V+re;S+=re,oe!==0&&R-oe<X.storage&&(S+=R-oe),F.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=S,S+=X.storage}}}const b=S%R;return b>0&&(S+=R-b),v.__size=S,v.__cache={},this}function _(v){const x={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(x.boundary=4,x.storage=4):v.isVector2?(x.boundary=8,x.storage=8):v.isVector3||v.isColor?(x.boundary=16,x.storage=12):v.isVector4?(x.boundary=16,x.storage=16):v.isMatrix3?(x.boundary=48,x.storage=48):v.isMatrix4?(x.boundary=64,x.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),x}function d(v){const x=v.target;x.removeEventListener("dispose",d);const S=o.indexOf(x.__bindingPointIndex);o.splice(S,1),n.deleteBuffer(r[x.id]),delete r[x.id],delete s[x.id]}function m(){for(const v in r)n.deleteBuffer(r[v]);o=[],r={},s={}}return{bind:l,update:c,dispose:m}}class AS{constructor(e={}){const{canvas:t=p0(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=o;const f=new Uint32Array(4),g=new Int32Array(4);let _=null,d=null;const m=[],v=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ot,this.toneMapping=_i,this.toneMappingExposure=1;const x=this;let S=!1,R=0,b=0,A=null,L=-1,G=null;const y=new gt,E=new gt;let F=null;const O=new ze(0);let H=0,j=t.width,B=t.height,X=1,V=null,re=null;const oe=new gt(0,0,j,B),le=new gt(0,0,j,B);let Xe=!1;const et=new Ac;let $=!1,ee=!1;const ve=new rt,he=new rt,Ne=new P,De=new gt,Ve={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ke=!1;function K(){return A===null?X:1}let C=i;function ue(w,D){return t.getContext(w,D)}try{const w={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${vc}`),t.addEventListener("webglcontextlost",J,!1),t.addEventListener("webglcontextrestored",ge,!1),t.addEventListener("webglcontextcreationerror",Se,!1),C===null){const D="webgl2";if(C=ue(D,w),C===null)throw ue(D)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let ce,te,fe,Le,xe,T,M,N,q,Z,Y,Ce,de,Me,nt,ne,Ee,ke,He,we,it,Ge,dt,I;function ye(){ce=new Ix(C),ce.init(),Ge=new _S(C,ce),te=new Tx(C,ce,e,Ge),fe=new pS(C),te.reverseDepthBuffer&&fe.buffers.depth.setReversed(!0),Le=new Nx(C),xe=new Qy,T=new gS(C,ce,fe,xe,te,Ge,Le),M=new Cx(x),N=new Lx(x),q=new V0(C),dt=new wx(C,q),Z=new Dx(C,q,Le,dt),Y=new Ox(C,Z,q,Le),He=new Fx(C,te,T),ne=new Ax(xe),Ce=new Jy(x,M,N,ce,te,dt,ne),de=new bS(x,xe),Me=new tS,nt=new aS(ce),ke=new Ex(x,M,N,fe,Y,p,l),Ee=new fS(x,Y,te),I=new TS(C,Le,te,fe),we=new bx(C,ce,Le),it=new Ux(C,ce,Le),Le.programs=Ce.programs,x.capabilities=te,x.extensions=ce,x.properties=xe,x.renderLists=Me,x.shadowMap=Ee,x.state=fe,x.info=Le}ye();const W=new ES(x,C);this.xr=W,this.getContext=function(){return C},this.getContextAttributes=function(){return C.getContextAttributes()},this.forceContextLoss=function(){const w=ce.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=ce.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return X},this.setPixelRatio=function(w){w!==void 0&&(X=w,this.setSize(j,B,!1))},this.getSize=function(w){return w.set(j,B)},this.setSize=function(w,D,z=!0){if(W.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}j=w,B=D,t.width=Math.floor(w*X),t.height=Math.floor(D*X),z===!0&&(t.style.width=w+"px",t.style.height=D+"px"),this.setViewport(0,0,w,D)},this.getDrawingBufferSize=function(w){return w.set(j*X,B*X).floor()},this.setDrawingBufferSize=function(w,D,z){j=w,B=D,X=z,t.width=Math.floor(w*z),t.height=Math.floor(D*z),this.setViewport(0,0,w,D)},this.getCurrentViewport=function(w){return w.copy(y)},this.getViewport=function(w){return w.copy(oe)},this.setViewport=function(w,D,z,k){w.isVector4?oe.set(w.x,w.y,w.z,w.w):oe.set(w,D,z,k),fe.viewport(y.copy(oe).multiplyScalar(X).round())},this.getScissor=function(w){return w.copy(le)},this.setScissor=function(w,D,z,k){w.isVector4?le.set(w.x,w.y,w.z,w.w):le.set(w,D,z,k),fe.scissor(E.copy(le).multiplyScalar(X).round())},this.getScissorTest=function(){return Xe},this.setScissorTest=function(w){fe.setScissorTest(Xe=w)},this.setOpaqueSort=function(w){V=w},this.setTransparentSort=function(w){re=w},this.getClearColor=function(w){return w.copy(ke.getClearColor())},this.setClearColor=function(){ke.setClearColor.apply(ke,arguments)},this.getClearAlpha=function(){return ke.getClearAlpha()},this.setClearAlpha=function(){ke.setClearAlpha.apply(ke,arguments)},this.clear=function(w=!0,D=!0,z=!0){let k=0;if(w){let U=!1;if(A!==null){const ae=A.texture.format;U=ae===wc||ae===Ec||ae===Mc}if(U){const ae=A.texture.type,_e=ae===Kn||ae===ki||ae===ts||ae===xr||ae===yc||ae===Sc,be=ke.getClearColor(),Re=ke.getClearAlpha(),Fe=be.r,Oe=be.g,Pe=be.b;_e?(f[0]=Fe,f[1]=Oe,f[2]=Pe,f[3]=Re,C.clearBufferuiv(C.COLOR,0,f)):(g[0]=Fe,g[1]=Oe,g[2]=Pe,g[3]=Re,C.clearBufferiv(C.COLOR,0,g))}else k|=C.COLOR_BUFFER_BIT}D&&(k|=C.DEPTH_BUFFER_BIT,C.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),z&&(k|=C.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),C.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",J,!1),t.removeEventListener("webglcontextrestored",ge,!1),t.removeEventListener("webglcontextcreationerror",Se,!1),Me.dispose(),nt.dispose(),xe.dispose(),M.dispose(),N.dispose(),Y.dispose(),dt.dispose(),I.dispose(),Ce.dispose(),W.dispose(),W.removeEventListener("sessionstart",Vc),W.removeEventListener("sessionend",Gc),Mi.stop()};function J(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),S=!0}function ge(){console.log("THREE.WebGLRenderer: Context Restored."),S=!1;const w=Le.autoReset,D=Ee.enabled,z=Ee.autoUpdate,k=Ee.needsUpdate,U=Ee.type;ye(),Le.autoReset=w,Ee.enabled=D,Ee.autoUpdate=z,Ee.needsUpdate=k,Ee.type=U}function Se(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function st(w){const D=w.target;D.removeEventListener("dispose",st),At(D)}function At(w){en(w),xe.remove(w)}function en(w){const D=xe.get(w).programs;D!==void 0&&(D.forEach(function(z){Ce.releaseProgram(z)}),w.isShaderMaterial&&Ce.releaseShaderCache(w))}this.renderBufferDirect=function(w,D,z,k,U,ae){D===null&&(D=Ve);const _e=U.isMesh&&U.matrixWorld.determinant()<0,be=tp(w,D,z,k,U);fe.setMaterial(k,_e);let Re=z.index,Fe=1;if(k.wireframe===!0){if(Re=Z.getWireframeAttribute(z),Re===void 0)return;Fe=2}const Oe=z.drawRange,Pe=z.attributes.position;let ft=Oe.start*Fe,_t=(Oe.start+Oe.count)*Fe;ae!==null&&(ft=Math.max(ft,ae.start*Fe),_t=Math.min(_t,(ae.start+ae.count)*Fe)),Re!==null?(ft=Math.max(ft,0),_t=Math.min(_t,Re.count)):Pe!=null&&(ft=Math.max(ft,0),_t=Math.min(_t,Pe.count));const St=_t-ft;if(St<0||St===1/0)return;dt.setup(U,k,be,z,Re);let ln,ct=we;if(Re!==null&&(ln=q.get(Re),ct=it,ct.setIndex(ln)),U.isMesh)k.wireframe===!0?(fe.setLineWidth(k.wireframeLinewidth*K()),ct.setMode(C.LINES)):ct.setMode(C.TRIANGLES);else if(U.isLine){let Ie=k.linewidth;Ie===void 0&&(Ie=1),fe.setLineWidth(Ie*K()),U.isLineSegments?ct.setMode(C.LINES):U.isLineLoop?ct.setMode(C.LINE_LOOP):ct.setMode(C.LINE_STRIP)}else U.isPoints?ct.setMode(C.POINTS):U.isSprite&&ct.setMode(C.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)ct.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(ce.get("WEBGL_multi_draw"))ct.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const Ie=U._multiDrawStarts,Ft=U._multiDrawCounts,ut=U._multiDrawCount,Mn=Re?q.get(Re).bytesPerElement:1,Xi=xe.get(k).currentProgram.getUniforms();for(let cn=0;cn<ut;cn++)Xi.setValue(C,"_gl_DrawID",cn),ct.render(Ie[cn]/Mn,Ft[cn])}else if(U.isInstancedMesh)ct.renderInstances(ft,St,U.count);else if(z.isInstancedBufferGeometry){const Ie=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,Ft=Math.min(z.instanceCount,Ie);ct.renderInstances(ft,St,Ft)}else ct.render(ft,St)};function lt(w,D,z){w.transparent===!0&&w.side===kt&&w.forceSinglePass===!1?(w.side=$t,w.needsUpdate=!0,ls(w,D,z),w.side=xi,w.needsUpdate=!0,ls(w,D,z),w.side=kt):ls(w,D,z)}this.compile=function(w,D,z=null){z===null&&(z=w),d=nt.get(z),d.init(D),v.push(d),z.traverseVisible(function(U){U.isLight&&U.layers.test(D.layers)&&(d.pushLight(U),U.castShadow&&d.pushShadow(U))}),w!==z&&w.traverseVisible(function(U){U.isLight&&U.layers.test(D.layers)&&(d.pushLight(U),U.castShadow&&d.pushShadow(U))}),d.setupLights();const k=new Set;return w.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const ae=U.material;if(ae)if(Array.isArray(ae))for(let _e=0;_e<ae.length;_e++){const be=ae[_e];lt(be,z,U),k.add(be)}else lt(ae,z,U),k.add(ae)}),v.pop(),d=null,k},this.compileAsync=function(w,D,z=null){const k=this.compile(w,D,z);return new Promise(U=>{function ae(){if(k.forEach(function(_e){xe.get(_e).currentProgram.isReady()&&k.delete(_e)}),k.size===0){U(w);return}setTimeout(ae,10)}ce.get("KHR_parallel_shader_compile")!==null?ae():setTimeout(ae,10)})};let tn=null;function Fn(w){tn&&tn(w)}function Vc(){Mi.stop()}function Gc(){Mi.start()}const Mi=new Ld;Mi.setAnimationLoop(Fn),typeof self<"u"&&Mi.setContext(self),this.setAnimationLoop=function(w){tn=w,W.setAnimationLoop(w),w===null?Mi.stop():Mi.start()},W.addEventListener("sessionstart",Vc),W.addEventListener("sessionend",Gc),this.render=function(w,D){if(D!==void 0&&D.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(S===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),W.enabled===!0&&W.isPresenting===!0&&(W.cameraAutoUpdate===!0&&W.updateCamera(D),D=W.getCamera()),w.isScene===!0&&w.onBeforeRender(x,w,D,A),d=nt.get(w,v.length),d.init(D),v.push(d),he.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),et.setFromProjectionMatrix(he),ee=this.localClippingEnabled,$=ne.init(this.clippingPlanes,ee),_=Me.get(w,m.length),_.init(),m.push(_),W.enabled===!0&&W.isPresenting===!0){const ae=x.xr.getDepthSensingMesh();ae!==null&&Xo(ae,D,-1/0,x.sortObjects)}Xo(w,D,0,x.sortObjects),_.finish(),x.sortObjects===!0&&_.sort(V,re),Ke=W.enabled===!1||W.isPresenting===!1||W.hasDepthSensing()===!1,Ke&&ke.addToRenderList(_,w),this.info.render.frame++,$===!0&&ne.beginShadows();const z=d.state.shadowsArray;Ee.render(z,w,D),$===!0&&ne.endShadows(),this.info.autoReset===!0&&this.info.reset();const k=_.opaque,U=_.transmissive;if(d.setupLights(),D.isArrayCamera){const ae=D.cameras;if(U.length>0)for(let _e=0,be=ae.length;_e<be;_e++){const Re=ae[_e];Xc(k,U,w,Re)}Ke&&ke.render(w);for(let _e=0,be=ae.length;_e<be;_e++){const Re=ae[_e];Wc(_,w,Re,Re.viewport)}}else U.length>0&&Xc(k,U,w,D),Ke&&ke.render(w),Wc(_,w,D);A!==null&&(T.updateMultisampleRenderTarget(A),T.updateRenderTargetMipmap(A)),w.isScene===!0&&w.onAfterRender(x,w,D),dt.resetDefaultState(),L=-1,G=null,v.pop(),v.length>0?(d=v[v.length-1],$===!0&&ne.setGlobalState(x.clippingPlanes,d.state.camera)):d=null,m.pop(),m.length>0?_=m[m.length-1]:_=null};function Xo(w,D,z,k){if(w.visible===!1)return;if(w.layers.test(D.layers)){if(w.isGroup)z=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(D);else if(w.isLight)d.pushLight(w),w.castShadow&&d.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||et.intersectsSprite(w)){k&&De.setFromMatrixPosition(w.matrixWorld).applyMatrix4(he);const _e=Y.update(w),be=w.material;be.visible&&_.push(w,_e,be,z,De.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||et.intersectsObject(w))){const _e=Y.update(w),be=w.material;if(k&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),De.copy(w.boundingSphere.center)):(_e.boundingSphere===null&&_e.computeBoundingSphere(),De.copy(_e.boundingSphere.center)),De.applyMatrix4(w.matrixWorld).applyMatrix4(he)),Array.isArray(be)){const Re=_e.groups;for(let Fe=0,Oe=Re.length;Fe<Oe;Fe++){const Pe=Re[Fe],ft=be[Pe.materialIndex];ft&&ft.visible&&_.push(w,_e,ft,z,De.z,Pe)}}else be.visible&&_.push(w,_e,be,z,De.z,null)}}const ae=w.children;for(let _e=0,be=ae.length;_e<be;_e++)Xo(ae[_e],D,z,k)}function Wc(w,D,z,k){const U=w.opaque,ae=w.transmissive,_e=w.transparent;d.setupLightsView(z),$===!0&&ne.setGlobalState(x.clippingPlanes,z),k&&fe.viewport(y.copy(k)),U.length>0&&as(U,D,z),ae.length>0&&as(ae,D,z),_e.length>0&&as(_e,D,z),fe.buffers.depth.setTest(!0),fe.buffers.depth.setMask(!0),fe.buffers.color.setMask(!0),fe.setPolygonOffset(!1)}function Xc(w,D,z,k){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[k.id]===void 0&&(d.state.transmissionRenderTarget[k.id]=new Hi(1,1,{generateMipmaps:!0,type:ce.has("EXT_color_buffer_half_float")||ce.has("EXT_color_buffer_float")?ss:Kn,minFilter:zi,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ht.workingColorSpace}));const ae=d.state.transmissionRenderTarget[k.id],_e=k.viewport||y;ae.setSize(_e.z,_e.w);const be=x.getRenderTarget();x.setRenderTarget(ae),x.getClearColor(O),H=x.getClearAlpha(),H<1&&x.setClearColor(16777215,.5),x.clear(),Ke&&ke.render(z);const Re=x.toneMapping;x.toneMapping=_i;const Fe=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),d.setupLightsView(k),$===!0&&ne.setGlobalState(x.clippingPlanes,k),as(w,z,k),T.updateMultisampleRenderTarget(ae),T.updateRenderTargetMipmap(ae),ce.has("WEBGL_multisampled_render_to_texture")===!1){let Oe=!1;for(let Pe=0,ft=D.length;Pe<ft;Pe++){const _t=D[Pe],St=_t.object,ln=_t.geometry,ct=_t.material,Ie=_t.group;if(ct.side===kt&&St.layers.test(k.layers)){const Ft=ct.side;ct.side=$t,ct.needsUpdate=!0,$c(St,z,k,ln,ct,Ie),ct.side=Ft,ct.needsUpdate=!0,Oe=!0}}Oe===!0&&(T.updateMultisampleRenderTarget(ae),T.updateRenderTargetMipmap(ae))}x.setRenderTarget(be),x.setClearColor(O,H),Fe!==void 0&&(k.viewport=Fe),x.toneMapping=Re}function as(w,D,z){const k=D.isScene===!0?D.overrideMaterial:null;for(let U=0,ae=w.length;U<ae;U++){const _e=w[U],be=_e.object,Re=_e.geometry,Fe=k===null?_e.material:k,Oe=_e.group;be.layers.test(z.layers)&&$c(be,D,z,Re,Fe,Oe)}}function $c(w,D,z,k,U,ae){w.onBeforeRender(x,D,z,k,U,ae),w.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),U.onBeforeRender(x,D,z,k,w,ae),U.transparent===!0&&U.side===kt&&U.forceSinglePass===!1?(U.side=$t,U.needsUpdate=!0,x.renderBufferDirect(z,D,k,U,w,ae),U.side=xi,U.needsUpdate=!0,x.renderBufferDirect(z,D,k,U,w,ae),U.side=kt):x.renderBufferDirect(z,D,k,U,w,ae),w.onAfterRender(x,D,z,k,U,ae)}function ls(w,D,z){D.isScene!==!0&&(D=Ve);const k=xe.get(w),U=d.state.lights,ae=d.state.shadowsArray,_e=U.state.version,be=Ce.getParameters(w,U.state,ae,D,z),Re=Ce.getProgramCacheKey(be);let Fe=k.programs;k.environment=w.isMeshStandardMaterial?D.environment:null,k.fog=D.fog,k.envMap=(w.isMeshStandardMaterial?N:M).get(w.envMap||k.environment),k.envMapRotation=k.environment!==null&&w.envMap===null?D.environmentRotation:w.envMapRotation,Fe===void 0&&(w.addEventListener("dispose",st),Fe=new Map,k.programs=Fe);let Oe=Fe.get(Re);if(Oe!==void 0){if(k.currentProgram===Oe&&k.lightsStateVersion===_e)return Yc(w,be),Oe}else be.uniforms=Ce.getUniforms(w),w.onBeforeCompile(be,x),Oe=Ce.acquireProgram(be,Re),Fe.set(Re,Oe),k.uniforms=be.uniforms;const Pe=k.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Pe.clippingPlanes=ne.uniform),Yc(w,be),k.needsLights=ip(w),k.lightsStateVersion=_e,k.needsLights&&(Pe.ambientLightColor.value=U.state.ambient,Pe.lightProbe.value=U.state.probe,Pe.directionalLights.value=U.state.directional,Pe.directionalLightShadows.value=U.state.directionalShadow,Pe.spotLights.value=U.state.spot,Pe.spotLightShadows.value=U.state.spotShadow,Pe.rectAreaLights.value=U.state.rectArea,Pe.ltc_1.value=U.state.rectAreaLTC1,Pe.ltc_2.value=U.state.rectAreaLTC2,Pe.pointLights.value=U.state.point,Pe.pointLightShadows.value=U.state.pointShadow,Pe.hemisphereLights.value=U.state.hemi,Pe.directionalShadowMap.value=U.state.directionalShadowMap,Pe.directionalShadowMatrix.value=U.state.directionalShadowMatrix,Pe.spotShadowMap.value=U.state.spotShadowMap,Pe.spotLightMatrix.value=U.state.spotLightMatrix,Pe.spotLightMap.value=U.state.spotLightMap,Pe.pointShadowMap.value=U.state.pointShadowMap,Pe.pointShadowMatrix.value=U.state.pointShadowMatrix),k.currentProgram=Oe,k.uniformsList=null,Oe}function qc(w){if(w.uniformsList===null){const D=w.currentProgram.getUniforms();w.uniformsList=ao.seqWithValue(D.seq,w.uniforms)}return w.uniformsList}function Yc(w,D){const z=xe.get(w);z.outputColorSpace=D.outputColorSpace,z.batching=D.batching,z.batchingColor=D.batchingColor,z.instancing=D.instancing,z.instancingColor=D.instancingColor,z.instancingMorph=D.instancingMorph,z.skinning=D.skinning,z.morphTargets=D.morphTargets,z.morphNormals=D.morphNormals,z.morphColors=D.morphColors,z.morphTargetsCount=D.morphTargetsCount,z.numClippingPlanes=D.numClippingPlanes,z.numIntersection=D.numClipIntersection,z.vertexAlphas=D.vertexAlphas,z.vertexTangents=D.vertexTangents,z.toneMapping=D.toneMapping}function tp(w,D,z,k,U){D.isScene!==!0&&(D=Ve),T.resetTextureUnits();const ae=D.fog,_e=k.isMeshStandardMaterial?D.environment:null,be=A===null?x.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:yi,Re=(k.isMeshStandardMaterial?N:M).get(k.envMap||_e),Fe=k.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,Oe=!!z.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),Pe=!!z.morphAttributes.position,ft=!!z.morphAttributes.normal,_t=!!z.morphAttributes.color;let St=_i;k.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(St=x.toneMapping);const ln=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,ct=ln!==void 0?ln.length:0,Ie=xe.get(k),Ft=d.state.lights;if($===!0&&(ee===!0||w!==G)){const vn=w===G&&k.id===L;ne.setState(k,w,vn)}let ut=!1;k.version===Ie.__version?(Ie.needsLights&&Ie.lightsStateVersion!==Ft.state.version||Ie.outputColorSpace!==be||U.isBatchedMesh&&Ie.batching===!1||!U.isBatchedMesh&&Ie.batching===!0||U.isBatchedMesh&&Ie.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&Ie.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&Ie.instancing===!1||!U.isInstancedMesh&&Ie.instancing===!0||U.isSkinnedMesh&&Ie.skinning===!1||!U.isSkinnedMesh&&Ie.skinning===!0||U.isInstancedMesh&&Ie.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&Ie.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&Ie.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&Ie.instancingMorph===!1&&U.morphTexture!==null||Ie.envMap!==Re||k.fog===!0&&Ie.fog!==ae||Ie.numClippingPlanes!==void 0&&(Ie.numClippingPlanes!==ne.numPlanes||Ie.numIntersection!==ne.numIntersection)||Ie.vertexAlphas!==Fe||Ie.vertexTangents!==Oe||Ie.morphTargets!==Pe||Ie.morphNormals!==ft||Ie.morphColors!==_t||Ie.toneMapping!==St||Ie.morphTargetsCount!==ct)&&(ut=!0):(ut=!0,Ie.__version=k.version);let Mn=Ie.currentProgram;ut===!0&&(Mn=ls(k,D,U));let Xi=!1,cn=!1,$o=!1;const wt=Mn.getUniforms(),Qn=Ie.uniforms;if(fe.useProgram(Mn.program)&&(Xi=!0,cn=!0,$o=!0),k.id!==L&&(L=k.id,cn=!0),Xi||G!==w){te.reverseDepthBuffer?(ve.copy(w.projectionMatrix),g0(ve),_0(ve),wt.setValue(C,"projectionMatrix",ve)):wt.setValue(C,"projectionMatrix",w.projectionMatrix),wt.setValue(C,"viewMatrix",w.matrixWorldInverse);const vn=wt.map.cameraPosition;vn!==void 0&&vn.setValue(C,Ne.setFromMatrixPosition(w.matrixWorld)),te.logarithmicDepthBuffer&&wt.setValue(C,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&wt.setValue(C,"isOrthographic",w.isOrthographicCamera===!0),G!==w&&(G=w,cn=!0,$o=!0)}if(U.isSkinnedMesh){wt.setOptional(C,U,"bindMatrix"),wt.setOptional(C,U,"bindMatrixInverse");const vn=U.skeleton;vn&&(vn.boneTexture===null&&vn.computeBoneTexture(),wt.setValue(C,"boneTexture",vn.boneTexture,T))}U.isBatchedMesh&&(wt.setOptional(C,U,"batchingTexture"),wt.setValue(C,"batchingTexture",U._matricesTexture,T),wt.setOptional(C,U,"batchingIdTexture"),wt.setValue(C,"batchingIdTexture",U._indirectTexture,T),wt.setOptional(C,U,"batchingColorTexture"),U._colorsTexture!==null&&wt.setValue(C,"batchingColorTexture",U._colorsTexture,T));const qo=z.morphAttributes;if((qo.position!==void 0||qo.normal!==void 0||qo.color!==void 0)&&He.update(U,z,Mn),(cn||Ie.receiveShadow!==U.receiveShadow)&&(Ie.receiveShadow=U.receiveShadow,wt.setValue(C,"receiveShadow",U.receiveShadow)),k.isMeshGouraudMaterial&&k.envMap!==null&&(Qn.envMap.value=Re,Qn.flipEnvMap.value=Re.isCubeTexture&&Re.isRenderTargetTexture===!1?-1:1),k.isMeshStandardMaterial&&k.envMap===null&&D.environment!==null&&(Qn.envMapIntensity.value=D.environmentIntensity),cn&&(wt.setValue(C,"toneMappingExposure",x.toneMappingExposure),Ie.needsLights&&np(Qn,$o),ae&&k.fog===!0&&de.refreshFogUniforms(Qn,ae),de.refreshMaterialUniforms(Qn,k,X,B,d.state.transmissionRenderTarget[w.id]),ao.upload(C,qc(Ie),Qn,T)),k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(ao.upload(C,qc(Ie),Qn,T),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&wt.setValue(C,"center",U.center),wt.setValue(C,"modelViewMatrix",U.modelViewMatrix),wt.setValue(C,"normalMatrix",U.normalMatrix),wt.setValue(C,"modelMatrix",U.matrixWorld),k.isShaderMaterial||k.isRawShaderMaterial){const vn=k.uniformsGroups;for(let Yo=0,rp=vn.length;Yo<rp;Yo++){const jc=vn[Yo];I.update(jc,Mn),I.bind(jc,Mn)}}return Mn}function np(w,D){w.ambientLightColor.needsUpdate=D,w.lightProbe.needsUpdate=D,w.directionalLights.needsUpdate=D,w.directionalLightShadows.needsUpdate=D,w.pointLights.needsUpdate=D,w.pointLightShadows.needsUpdate=D,w.spotLights.needsUpdate=D,w.spotLightShadows.needsUpdate=D,w.rectAreaLights.needsUpdate=D,w.hemisphereLights.needsUpdate=D}function ip(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return b},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(w,D,z){xe.get(w.texture).__webglTexture=D,xe.get(w.depthTexture).__webglTexture=z;const k=xe.get(w);k.__hasExternalTextures=!0,k.__autoAllocateDepthBuffer=z===void 0,k.__autoAllocateDepthBuffer||ce.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),k.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(w,D){const z=xe.get(w);z.__webglFramebuffer=D,z.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(w,D=0,z=0){A=w,R=D,b=z;let k=!0,U=null,ae=!1,_e=!1;if(w){const Re=xe.get(w);if(Re.__useDefaultFramebuffer!==void 0)fe.bindFramebuffer(C.FRAMEBUFFER,null),k=!1;else if(Re.__webglFramebuffer===void 0)T.setupRenderTarget(w);else if(Re.__hasExternalTextures)T.rebindTextures(w,xe.get(w.texture).__webglTexture,xe.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const Pe=w.depthTexture;if(Re.__boundDepthTexture!==Pe){if(Pe!==null&&xe.has(Pe)&&(w.width!==Pe.image.width||w.height!==Pe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");T.setupDepthRenderbuffer(w)}}const Fe=w.texture;(Fe.isData3DTexture||Fe.isDataArrayTexture||Fe.isCompressedArrayTexture)&&(_e=!0);const Oe=xe.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Oe[D])?U=Oe[D][z]:U=Oe[D],ae=!0):w.samples>0&&T.useMultisampledRTT(w)===!1?U=xe.get(w).__webglMultisampledFramebuffer:Array.isArray(Oe)?U=Oe[z]:U=Oe,y.copy(w.viewport),E.copy(w.scissor),F=w.scissorTest}else y.copy(oe).multiplyScalar(X).floor(),E.copy(le).multiplyScalar(X).floor(),F=Xe;if(fe.bindFramebuffer(C.FRAMEBUFFER,U)&&k&&fe.drawBuffers(w,U),fe.viewport(y),fe.scissor(E),fe.setScissorTest(F),ae){const Re=xe.get(w.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_CUBE_MAP_POSITIVE_X+D,Re.__webglTexture,z)}else if(_e){const Re=xe.get(w.texture),Fe=D||0;C.framebufferTextureLayer(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,Re.__webglTexture,z||0,Fe)}L=-1},this.readRenderTargetPixels=function(w,D,z,k,U,ae,_e){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let be=xe.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&_e!==void 0&&(be=be[_e]),be){fe.bindFramebuffer(C.FRAMEBUFFER,be);try{const Re=w.texture,Fe=Re.format,Oe=Re.type;if(!te.textureFormatReadable(Fe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!te.textureTypeReadable(Oe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=w.width-k&&z>=0&&z<=w.height-U&&C.readPixels(D,z,k,U,Ge.convert(Fe),Ge.convert(Oe),ae)}finally{const Re=A!==null?xe.get(A).__webglFramebuffer:null;fe.bindFramebuffer(C.FRAMEBUFFER,Re)}}},this.readRenderTargetPixelsAsync=async function(w,D,z,k,U,ae,_e){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let be=xe.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&_e!==void 0&&(be=be[_e]),be){const Re=w.texture,Fe=Re.format,Oe=Re.type;if(!te.textureFormatReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!te.textureTypeReadable(Oe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(D>=0&&D<=w.width-k&&z>=0&&z<=w.height-U){fe.bindFramebuffer(C.FRAMEBUFFER,be);const Pe=C.createBuffer();C.bindBuffer(C.PIXEL_PACK_BUFFER,Pe),C.bufferData(C.PIXEL_PACK_BUFFER,ae.byteLength,C.STREAM_READ),C.readPixels(D,z,k,U,Ge.convert(Fe),Ge.convert(Oe),0);const ft=A!==null?xe.get(A).__webglFramebuffer:null;fe.bindFramebuffer(C.FRAMEBUFFER,ft);const _t=C.fenceSync(C.SYNC_GPU_COMMANDS_COMPLETE,0);return C.flush(),await m0(C,_t,4),C.bindBuffer(C.PIXEL_PACK_BUFFER,Pe),C.getBufferSubData(C.PIXEL_PACK_BUFFER,0,ae),C.deleteBuffer(Pe),C.deleteSync(_t),ae}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(w,D=null,z=0){w.isTexture!==!0&&(oo("WebGLRenderer: copyFramebufferToTexture function signature has changed."),D=arguments[0]||null,w=arguments[1]);const k=Math.pow(2,-z),U=Math.floor(w.image.width*k),ae=Math.floor(w.image.height*k),_e=D!==null?D.x:0,be=D!==null?D.y:0;T.setTexture2D(w,0),C.copyTexSubImage2D(C.TEXTURE_2D,z,0,0,_e,be,U,ae),fe.unbindTexture()},this.copyTextureToTexture=function(w,D,z=null,k=null,U=0){w.isTexture!==!0&&(oo("WebGLRenderer: copyTextureToTexture function signature has changed."),k=arguments[0]||null,w=arguments[1],D=arguments[2],U=arguments[3]||0,z=null);let ae,_e,be,Re,Fe,Oe;z!==null?(ae=z.max.x-z.min.x,_e=z.max.y-z.min.y,be=z.min.x,Re=z.min.y):(ae=w.image.width,_e=w.image.height,be=0,Re=0),k!==null?(Fe=k.x,Oe=k.y):(Fe=0,Oe=0);const Pe=Ge.convert(D.format),ft=Ge.convert(D.type);T.setTexture2D(D,0),C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,D.flipY),C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),C.pixelStorei(C.UNPACK_ALIGNMENT,D.unpackAlignment);const _t=C.getParameter(C.UNPACK_ROW_LENGTH),St=C.getParameter(C.UNPACK_IMAGE_HEIGHT),ln=C.getParameter(C.UNPACK_SKIP_PIXELS),ct=C.getParameter(C.UNPACK_SKIP_ROWS),Ie=C.getParameter(C.UNPACK_SKIP_IMAGES),Ft=w.isCompressedTexture?w.mipmaps[U]:w.image;C.pixelStorei(C.UNPACK_ROW_LENGTH,Ft.width),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,Ft.height),C.pixelStorei(C.UNPACK_SKIP_PIXELS,be),C.pixelStorei(C.UNPACK_SKIP_ROWS,Re),w.isDataTexture?C.texSubImage2D(C.TEXTURE_2D,U,Fe,Oe,ae,_e,Pe,ft,Ft.data):w.isCompressedTexture?C.compressedTexSubImage2D(C.TEXTURE_2D,U,Fe,Oe,Ft.width,Ft.height,Pe,Ft.data):C.texSubImage2D(C.TEXTURE_2D,U,Fe,Oe,ae,_e,Pe,ft,Ft),C.pixelStorei(C.UNPACK_ROW_LENGTH,_t),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,St),C.pixelStorei(C.UNPACK_SKIP_PIXELS,ln),C.pixelStorei(C.UNPACK_SKIP_ROWS,ct),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Ie),U===0&&D.generateMipmaps&&C.generateMipmap(C.TEXTURE_2D),fe.unbindTexture()},this.copyTextureToTexture3D=function(w,D,z=null,k=null,U=0){w.isTexture!==!0&&(oo("WebGLRenderer: copyTextureToTexture3D function signature has changed."),z=arguments[0]||null,k=arguments[1]||null,w=arguments[2],D=arguments[3],U=arguments[4]||0);let ae,_e,be,Re,Fe,Oe,Pe,ft,_t;const St=w.isCompressedTexture?w.mipmaps[U]:w.image;z!==null?(ae=z.max.x-z.min.x,_e=z.max.y-z.min.y,be=z.max.z-z.min.z,Re=z.min.x,Fe=z.min.y,Oe=z.min.z):(ae=St.width,_e=St.height,be=St.depth,Re=0,Fe=0,Oe=0),k!==null?(Pe=k.x,ft=k.y,_t=k.z):(Pe=0,ft=0,_t=0);const ln=Ge.convert(D.format),ct=Ge.convert(D.type);let Ie;if(D.isData3DTexture)T.setTexture3D(D,0),Ie=C.TEXTURE_3D;else if(D.isDataArrayTexture||D.isCompressedArrayTexture)T.setTexture2DArray(D,0),Ie=C.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,D.flipY),C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),C.pixelStorei(C.UNPACK_ALIGNMENT,D.unpackAlignment);const Ft=C.getParameter(C.UNPACK_ROW_LENGTH),ut=C.getParameter(C.UNPACK_IMAGE_HEIGHT),Mn=C.getParameter(C.UNPACK_SKIP_PIXELS),Xi=C.getParameter(C.UNPACK_SKIP_ROWS),cn=C.getParameter(C.UNPACK_SKIP_IMAGES);C.pixelStorei(C.UNPACK_ROW_LENGTH,St.width),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,St.height),C.pixelStorei(C.UNPACK_SKIP_PIXELS,Re),C.pixelStorei(C.UNPACK_SKIP_ROWS,Fe),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Oe),w.isDataTexture||w.isData3DTexture?C.texSubImage3D(Ie,U,Pe,ft,_t,ae,_e,be,ln,ct,St.data):D.isCompressedArrayTexture?C.compressedTexSubImage3D(Ie,U,Pe,ft,_t,ae,_e,be,ln,St.data):C.texSubImage3D(Ie,U,Pe,ft,_t,ae,_e,be,ln,ct,St),C.pixelStorei(C.UNPACK_ROW_LENGTH,Ft),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,ut),C.pixelStorei(C.UNPACK_SKIP_PIXELS,Mn),C.pixelStorei(C.UNPACK_SKIP_ROWS,Xi),C.pixelStorei(C.UNPACK_SKIP_IMAGES,cn),U===0&&D.generateMipmaps&&C.generateMipmap(Ie),fe.unbindTexture()},this.initRenderTarget=function(w){xe.get(w).__webglFramebuffer===void 0&&T.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?T.setTextureCube(w,0):w.isData3DTexture?T.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?T.setTexture2DArray(w,0):T.setTexture2D(w,0),fe.unbindTexture()},this.resetState=function(){R=0,b=0,A=null,fe.reset(),dt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Xn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===bc?"display-p3":"srgb",t.unpackColorSpace=ht.workingColorSpace===Bo?"display-p3":"srgb"}}class Rc{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new ze(e),this.near=t,this.far=i}clone(){return new Rc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class CS extends Et{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Zn,this.environmentIntensity=1,this.environmentRotation=new Zn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Bd extends qt{constructor(e=null,t=1,i=1,r,s,o,a,l,c=Zt,u=Zt,h,p){super(null,o,a,l,c,u,r,s,h,p),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Bh extends Ht{constructor(e,t,i,r=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const ar=new rt,zh=new rt,Ns=[],kh=new Si,RS=new rt,Fr=new Je,Or=new Gi;class mr extends Je{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Bh(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,RS)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Si),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,ar),kh.copy(e.boundingBox).applyMatrix4(ar),this.boundingBox.union(kh)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Gi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,ar),Or.copy(e.boundingSphere).applyMatrix4(ar),this.boundingSphere.union(Or)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,r=this.morphTexture.source.data.data,s=i.length+1,o=e*s+1;for(let a=0;a<i.length;a++)i[a]=r[o+a]}raycast(e,t){const i=this.matrixWorld,r=this.count;if(Fr.geometry=this.geometry,Fr.material=this.material,Fr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Or.copy(this.boundingSphere),Or.applyMatrix4(i),e.ray.intersectsSphere(Or)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,ar),zh.multiplyMatrices(i,ar),Fr.matrixWorld=zh,Fr.raycast(e,Ns);for(let o=0,a=Ns.length;o<a;o++){const l=Ns[o];l.instanceId=s,l.object=this,t.push(l)}Ns.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Bh(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const i=t.morphTargetInfluences,r=i.length+1;this.morphTexture===null&&(this.morphTexture=new Bd(new Float32Array(r*this.count),r,this.count,Oo,Un));const s=this.morphTexture.source.data.data;let o=0;for(let c=0;c<i.length;c++)o+=i[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=r*e;s[l]=a,s.set(i,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Pc extends Wi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ze(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const To=new P,Ao=new P,Hh=new rt,Br=new Tc,Fs=new Gi,Fa=new P,Vh=new P;class zd extends Et{constructor(e=new Tt,t=new Pc){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let r=1,s=t.count;r<s;r++)To.fromBufferAttribute(t,r-1),Ao.fromBufferAttribute(t,r),i[r]=i[r-1],i[r]+=To.distanceTo(Ao);e.setAttribute("lineDistance",new at(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Fs.copy(i.boundingSphere),Fs.applyMatrix4(r),Fs.radius+=s,e.ray.intersectsSphere(Fs)===!1)return;Hh.copy(r).invert(),Br.copy(e.ray).applyMatrix4(Hh);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=i.index,p=i.attributes.position;if(u!==null){const f=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let _=f,d=g-1;_<d;_+=c){const m=u.getX(_),v=u.getX(_+1),x=Os(this,e,Br,l,m,v);x&&t.push(x)}if(this.isLineLoop){const _=u.getX(g-1),d=u.getX(f),m=Os(this,e,Br,l,_,d);m&&t.push(m)}}else{const f=Math.max(0,o.start),g=Math.min(p.count,o.start+o.count);for(let _=f,d=g-1;_<d;_+=c){const m=Os(this,e,Br,l,_,_+1);m&&t.push(m)}if(this.isLineLoop){const _=Os(this,e,Br,l,g-1,f);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Os(n,e,t,i,r,s){const o=n.geometry.attributes.position;if(To.fromBufferAttribute(o,r),Ao.fromBufferAttribute(o,s),t.distanceSqToSegment(To,Ao,Fa,Vh)>i)return;Fa.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(Fa);if(!(l<e.near||l>e.far))return{distance:l,point:Vh.clone().applyMatrix4(n.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:n}}const Gh=new P,Wh=new P;class PS extends zd{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let r=0,s=t.count;r<s;r+=2)Gh.fromBufferAttribute(t,r),Wh.fromBufferAttribute(t,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+Gh.distanceTo(Wh);e.setAttribute("lineDistance",new at(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class kd extends Wi{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ze(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Xh=new rt,Yl=new Tc,Bs=new Gi,zs=new P;class LS extends Et{constructor(e=new Tt,t=new kd){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Bs.copy(i.boundingSphere),Bs.applyMatrix4(r),Bs.radius+=s,e.ray.intersectsSphere(Bs)===!1)return;Xh.copy(r).invert(),Yl.copy(e.ray).applyMatrix4(Xh);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=i.index,h=i.attributes.position;if(c!==null){const p=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let g=p,_=f;g<_;g++){const d=c.getX(g);zs.fromBufferAttribute(h,d),$h(zs,d,l,r,e,t,this)}}else{const p=Math.max(0,o.start),f=Math.min(h.count,o.start+o.count);for(let g=p,_=f;g<_;g++)zs.fromBufferAttribute(h,g),$h(zs,g,l,r,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function $h(n,e,t,i,r,s,o){const a=Yl.distanceSqToPoint(n);if(a<t){const l=new P;Yl.closestPointToPoint(n,l),l.applyMatrix4(i);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class qn extends qt{constructor(e,t,i,r,s,o,a,l,c){super(e,t,i,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Nn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,r=this.getPoint(0),s=0;t.push(0);for(let o=1;o<=e;o++)i=this.getPoint(o/e),s+=i.distanceTo(r),t.push(s),r=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const i=this.getLengths();let r=0;const s=i.length;let o;t?o=t:o=e*i[s-1];let a=0,l=s-1,c;for(;a<=l;)if(r=Math.floor(a+(l-a)/2),c=i[r]-o,c<0)a=r+1;else if(c>0)l=r-1;else{l=r;break}if(r=l,i[r]===o)return r/(s-1);const u=i[r],p=i[r+1]-u,f=(o-u)/p;return(r+f)/(s-1)}getTangent(e,t){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);const o=this.getPoint(r),a=this.getPoint(s),l=t||(o.isVector2?new se:new P);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t){const i=new P,r=[],s=[],o=[],a=new P,l=new rt;for(let f=0;f<=e;f++){const g=f/e;r[f]=this.getTangentAt(g,new P)}s[0]=new P,o[0]=new P;let c=Number.MAX_VALUE;const u=Math.abs(r[0].x),h=Math.abs(r[0].y),p=Math.abs(r[0].z);u<=c&&(c=u,i.set(1,0,0)),h<=c&&(c=h,i.set(0,1,0)),p<=c&&i.set(0,0,1),a.crossVectors(r[0],i).normalize(),s[0].crossVectors(r[0],a),o[0].crossVectors(r[0],s[0]);for(let f=1;f<=e;f++){if(s[f]=s[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(r[f-1],r[f]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(Bt(r[f-1].dot(r[f]),-1,1));s[f].applyMatrix4(l.makeRotationAxis(a,g))}o[f].crossVectors(r[f],s[f])}if(t===!0){let f=Math.acos(Bt(s[0].dot(s[e]),-1,1));f/=e,r[0].dot(a.crossVectors(s[0],s[e]))>0&&(f=-f);for(let g=1;g<=e;g++)s[g].applyMatrix4(l.makeRotationAxis(r[g],f*g)),o[g].crossVectors(r[g],s[g])}return{tangents:r,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Lc extends Nn{constructor(e=0,t=0,i=1,r=1,s=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new se){const i=t,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(o?s=0:s=r),this.aClockwise===!0&&!o&&(s===r?s=-r:s=s-r);const a=this.aStartAngle+e*s;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),p=l-this.aX,f=c-this.aY;l=p*u-f*h+this.aX,c=p*h+f*u+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class IS extends Lc{constructor(e,t,i,r,s,o){super(e,t,i,i,r,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Ic(){let n=0,e=0,t=0,i=0;function r(s,o,a,l){n=s,e=a,t=-3*s+3*o-2*a-l,i=2*s-2*o+a+l}return{initCatmullRom:function(s,o,a,l,c){r(o,a,c*(a-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,a,l,c,u,h){let p=(o-s)/c-(a-s)/(c+u)+(a-o)/u,f=(a-o)/u-(l-o)/(u+h)+(l-a)/h;p*=u,f*=u,r(o,a,p,f)},calc:function(s){const o=s*s,a=o*s;return n+e*s+t*o+i*a}}}const ks=new P,Oa=new Ic,Ba=new Ic,za=new Ic;class DS extends Nn{constructor(e=[],t=!1,i="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=r}getPoint(e,t=new P){const i=t,r=this.points,s=r.length,o=(s-(this.closed?0:1))*e;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:l===0&&a===s-1&&(a=s-2,l=1);let c,u;this.closed||a>0?c=r[(a-1)%s]:(ks.subVectors(r[0],r[1]).add(r[0]),c=ks);const h=r[a%s],p=r[(a+1)%s];if(this.closed||a+2<s?u=r[(a+2)%s]:(ks.subVectors(r[s-1],r[s-2]).add(r[s-1]),u=ks),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(h),f),_=Math.pow(h.distanceToSquared(p),f),d=Math.pow(p.distanceToSquared(u),f);_<1e-4&&(_=1),g<1e-4&&(g=_),d<1e-4&&(d=_),Oa.initNonuniformCatmullRom(c.x,h.x,p.x,u.x,g,_,d),Ba.initNonuniformCatmullRom(c.y,h.y,p.y,u.y,g,_,d),za.initNonuniformCatmullRom(c.z,h.z,p.z,u.z,g,_,d)}else this.curveType==="catmullrom"&&(Oa.initCatmullRom(c.x,h.x,p.x,u.x,this.tension),Ba.initCatmullRom(c.y,h.y,p.y,u.y,this.tension),za.initCatmullRom(c.z,h.z,p.z,u.z,this.tension));return i.set(Oa.calc(l),Ba.calc(l),za.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(new P().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function qh(n,e,t,i,r){const s=(i-e)*.5,o=(r-t)*.5,a=n*n,l=n*a;return(2*t-2*i+s+o)*l+(-3*t+3*i-2*s-o)*a+s*n+t}function US(n,e){const t=1-n;return t*t*e}function NS(n,e){return 2*(1-n)*n*e}function FS(n,e){return n*n*e}function jr(n,e,t,i){return US(n,e)+NS(n,t)+FS(n,i)}function OS(n,e){const t=1-n;return t*t*t*e}function BS(n,e){const t=1-n;return 3*t*t*n*e}function zS(n,e){return 3*(1-n)*n*n*e}function kS(n,e){return n*n*n*e}function Kr(n,e,t,i,r){return OS(n,e)+BS(n,t)+zS(n,i)+kS(n,r)}class Hd extends Nn{constructor(e=new se,t=new se,i=new se,r=new se){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new se){const i=t,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return i.set(Kr(e,r.x,s.x,o.x,a.x),Kr(e,r.y,s.y,o.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class HS extends Nn{constructor(e=new P,t=new P,i=new P,r=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new P){const i=t,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return i.set(Kr(e,r.x,s.x,o.x,a.x),Kr(e,r.y,s.y,o.y,a.y),Kr(e,r.z,s.z,o.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Vd extends Nn{constructor(e=new se,t=new se){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new se){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new se){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class VS extends Nn{constructor(e=new P,t=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new P){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new P){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Gd extends Nn{constructor(e=new se,t=new se,i=new se){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new se){const i=t,r=this.v0,s=this.v1,o=this.v2;return i.set(jr(e,r.x,s.x,o.x),jr(e,r.y,s.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class GS extends Nn{constructor(e=new P,t=new P,i=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new P){const i=t,r=this.v0,s=this.v1,o=this.v2;return i.set(jr(e,r.x,s.x,o.x),jr(e,r.y,s.y,o.y),jr(e,r.z,s.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Wd extends Nn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new se){const i=t,r=this.points,s=(r.length-1)*e,o=Math.floor(s),a=s-o,l=r[o===0?o:o-1],c=r[o],u=r[o>r.length-2?r.length-1:o+1],h=r[o>r.length-3?r.length-1:o+2];return i.set(qh(a,l.x,c.x,u.x,h.x),qh(a,l.y,c.y,u.y,h.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const r=this.points[t];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(new se().fromArray(r))}return this}}var jl=Object.freeze({__proto__:null,ArcCurve:IS,CatmullRomCurve3:DS,CubicBezierCurve:Hd,CubicBezierCurve3:HS,EllipseCurve:Lc,LineCurve:Vd,LineCurve3:VS,QuadraticBezierCurve:Gd,QuadraticBezierCurve3:GS,SplineCurve:Wd});class WS extends Nn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new jl[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),r=this.getCurveLengths();let s=0;for(;s<r.length;){if(r[s]>=i){const o=r[s]-i,a=this.curves[s],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}s++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,r=this.curves.length;i<r;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let r=0,s=this.curves;r<s.length;r++){const o=s[r],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){const u=l[c];i&&i.equals(u)||(t.push(u),i=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const r=e.curves[t];this.curves.push(r.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const r=this.curves[t];e.curves.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const r=e.curves[t];this.curves.push(new jl[r.type]().fromJSON(r))}return this}}class Kl extends WS{constructor(e){super(),this.type="Path",this.currentPoint=new se,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new Vd(this.currentPoint.clone(),new se(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,r){const s=new Gd(this.currentPoint.clone(),new se(e,t),new se(i,r));return this.curves.push(s),this.currentPoint.set(i,r),this}bezierCurveTo(e,t,i,r,s,o){const a=new Hd(this.currentPoint.clone(),new se(e,t),new se(i,r),new se(s,o));return this.curves.push(a),this.currentPoint.set(s,o),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new Wd(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,r,s,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,i,r,s,o),this}absarc(e,t,i,r,s,o){return this.absellipse(e,t,i,i,r,s,o),this}ellipse(e,t,i,r,s,o,a,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+c,t+u,i,r,s,o,a,l),this}absellipse(e,t,i,r,s,o,a,l){const c=new Lc(e,t,i,r,s,o,a,l);if(this.curves.length>0){const h=c.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Dc extends Tt{constructor(e=[new se(0,-.5),new se(.5,0),new se(0,.5)],t=12,i=0,r=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:i,phiLength:r},t=Math.floor(t),r=Bt(r,0,Math.PI*2);const s=[],o=[],a=[],l=[],c=[],u=1/t,h=new P,p=new se,f=new P,g=new P,_=new P;let d=0,m=0;for(let v=0;v<=e.length-1;v++)switch(v){case 0:d=e[v+1].x-e[v].x,m=e[v+1].y-e[v].y,f.x=m*1,f.y=-d,f.z=m*0,_.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case e.length-1:l.push(_.x,_.y,_.z);break;default:d=e[v+1].x-e[v].x,m=e[v+1].y-e[v].y,f.x=m*1,f.y=-d,f.z=m*0,g.copy(f),f.x+=_.x,f.y+=_.y,f.z+=_.z,f.normalize(),l.push(f.x,f.y,f.z),_.copy(g)}for(let v=0;v<=t;v++){const x=i+v*u*r,S=Math.sin(x),R=Math.cos(x);for(let b=0;b<=e.length-1;b++){h.x=e[b].x*S,h.y=e[b].y,h.z=e[b].x*R,o.push(h.x,h.y,h.z),p.x=v/t,p.y=b/(e.length-1),a.push(p.x,p.y);const A=l[3*b+0]*S,L=l[3*b+1],G=l[3*b+0]*R;c.push(A,L,G)}}for(let v=0;v<t;v++)for(let x=0;x<e.length-1;x++){const S=x+v*e.length,R=S,b=S+e.length,A=S+e.length+1,L=S+1;s.push(R,b,L),s.push(A,L,b)}this.setIndex(s),this.setAttribute("position",new at(o,3)),this.setAttribute("uv",new at(a,2)),this.setAttribute("normal",new at(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Dc(e.points,e.segments,e.phiStart,e.phiLength)}}class Uc extends Dc{constructor(e=1,t=1,i=4,r=8){const s=new Kl;s.absarc(0,-t/2,e,Math.PI*1.5,0),s.absarc(0,t/2,e,0,Math.PI*.5),super(s.getPoints(i),r),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:i,radialSegments:r}}static fromJSON(e){return new Uc(e.radius,e.length,e.capSegments,e.radialSegments)}}class Nc extends Tt{constructor(e=1,t=32,i=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:r},t=Math.max(3,t);const s=[],o=[],a=[],l=[],c=new P,u=new se;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let h=0,p=3;h<=t;h++,p+=3){const f=i+h/t*r;c.x=e*Math.cos(f),c.y=e*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),u.x=(o[p]/e+1)/2,u.y=(o[p+1]/e+1)/2,l.push(u.x,u.y)}for(let h=1;h<=t;h++)s.push(h,h+1,0);this.setIndex(s),this.setAttribute("position",new at(o,3)),this.setAttribute("normal",new at(a,3)),this.setAttribute("uv",new at(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Nc(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Ye extends Tt{constructor(e=1,t=1,i=1,r=32,s=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const u=[],h=[],p=[],f=[];let g=0;const _=[],d=i/2;let m=0;v(),o===!1&&(e>0&&x(!0),t>0&&x(!1)),this.setIndex(u),this.setAttribute("position",new at(h,3)),this.setAttribute("normal",new at(p,3)),this.setAttribute("uv",new at(f,2));function v(){const S=new P,R=new P;let b=0;const A=(t-e)/i;for(let L=0;L<=s;L++){const G=[],y=L/s,E=y*(t-e)+e;for(let F=0;F<=r;F++){const O=F/r,H=O*l+a,j=Math.sin(H),B=Math.cos(H);R.x=E*j,R.y=-y*i+d,R.z=E*B,h.push(R.x,R.y,R.z),S.set(j,A,B).normalize(),p.push(S.x,S.y,S.z),f.push(O,1-y),G.push(g++)}_.push(G)}for(let L=0;L<r;L++)for(let G=0;G<s;G++){const y=_[G][L],E=_[G+1][L],F=_[G+1][L+1],O=_[G][L+1];e>0&&(u.push(y,E,O),b+=3),t>0&&(u.push(E,F,O),b+=3)}c.addGroup(m,b,0),m+=b}function x(S){const R=g,b=new se,A=new P;let L=0;const G=S===!0?e:t,y=S===!0?1:-1;for(let F=1;F<=r;F++)h.push(0,d*y,0),p.push(0,y,0),f.push(.5,.5),g++;const E=g;for(let F=0;F<=r;F++){const H=F/r*l+a,j=Math.cos(H),B=Math.sin(H);A.x=G*B,A.y=d*y,A.z=G*j,h.push(A.x,A.y,A.z),p.push(0,y,0),b.x=j*.5+.5,b.y=B*.5*y+.5,f.push(b.x,b.y),g++}for(let F=0;F<r;F++){const O=R+F,H=E+F;S===!0?u.push(H,H+1,O):u.push(H+1,H,O),L+=3}c.addGroup(m,L,S===!0?1:2),m+=L}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ye(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Sn extends Ye{constructor(e=1,t=1,i=32,r=1,s=!1,o=0,a=Math.PI*2){super(0,e,t,i,r,s,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:r,openEnded:s,thetaStart:o,thetaLength:a}}static fromJSON(e){return new Sn(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class os extends Tt{constructor(e=[],t=[],i=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:r};const s=[],o=[];a(r),c(i),u(),this.setAttribute("position",new at(s,3)),this.setAttribute("normal",new at(s.slice(),3)),this.setAttribute("uv",new at(o,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function a(v){const x=new P,S=new P,R=new P;for(let b=0;b<t.length;b+=3)f(t[b+0],x),f(t[b+1],S),f(t[b+2],R),l(x,S,R,v)}function l(v,x,S,R){const b=R+1,A=[];for(let L=0;L<=b;L++){A[L]=[];const G=v.clone().lerp(S,L/b),y=x.clone().lerp(S,L/b),E=b-L;for(let F=0;F<=E;F++)F===0&&L===b?A[L][F]=G:A[L][F]=G.clone().lerp(y,F/E)}for(let L=0;L<b;L++)for(let G=0;G<2*(b-L)-1;G++){const y=Math.floor(G/2);G%2===0?(p(A[L][y+1]),p(A[L+1][y]),p(A[L][y])):(p(A[L][y+1]),p(A[L+1][y+1]),p(A[L+1][y]))}}function c(v){const x=new P;for(let S=0;S<s.length;S+=3)x.x=s[S+0],x.y=s[S+1],x.z=s[S+2],x.normalize().multiplyScalar(v),s[S+0]=x.x,s[S+1]=x.y,s[S+2]=x.z}function u(){const v=new P;for(let x=0;x<s.length;x+=3){v.x=s[x+0],v.y=s[x+1],v.z=s[x+2];const S=d(v)/2/Math.PI+.5,R=m(v)/Math.PI+.5;o.push(S,1-R)}g(),h()}function h(){for(let v=0;v<o.length;v+=6){const x=o[v+0],S=o[v+2],R=o[v+4],b=Math.max(x,S,R),A=Math.min(x,S,R);b>.9&&A<.1&&(x<.2&&(o[v+0]+=1),S<.2&&(o[v+2]+=1),R<.2&&(o[v+4]+=1))}}function p(v){s.push(v.x,v.y,v.z)}function f(v,x){const S=v*3;x.x=e[S+0],x.y=e[S+1],x.z=e[S+2]}function g(){const v=new P,x=new P,S=new P,R=new P,b=new se,A=new se,L=new se;for(let G=0,y=0;G<s.length;G+=9,y+=6){v.set(s[G+0],s[G+1],s[G+2]),x.set(s[G+3],s[G+4],s[G+5]),S.set(s[G+6],s[G+7],s[G+8]),b.set(o[y+0],o[y+1]),A.set(o[y+2],o[y+3]),L.set(o[y+4],o[y+5]),R.copy(v).add(x).add(S).divideScalar(3);const E=d(R);_(b,y+0,v,E),_(A,y+2,x,E),_(L,y+4,S,E)}}function _(v,x,S,R){R<0&&v.x===1&&(o[x]=v.x-1),S.x===0&&S.z===0&&(o[x]=R/2/Math.PI+.5)}function d(v){return Math.atan2(v.z,-v.x)}function m(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new os(e.vertices,e.indices,e.radius,e.details)}}class Fc extends os{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,r=1/i,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-r,-i,0,-r,i,0,r,-i,0,r,i,-r,-i,0,-r,i,0,r,-i,0,r,i,0,-i,0,-r,i,0,-r,-i,0,r,i,0,r],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,o,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Fc(e.radius,e.detail)}}class ko extends Kl{constructor(e){super(e),this.uuid=Tr(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,r=this.holes.length;i<r;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const r=e.holes[t];this.holes.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const r=this.holes[t];e.holes.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const r=e.holes[t];this.holes.push(new Kl().fromJSON(r))}return this}}const XS={triangulate:function(n,e,t=2){const i=e&&e.length,r=i?e[0]*t:n.length;let s=Xd(n,0,r,t,!0);const o=[];if(!s||s.next===s.prev)return o;let a,l,c,u,h,p,f;if(i&&(s=KS(n,e,s,t)),n.length>80*t){a=c=n[0],l=u=n[1];for(let g=t;g<r;g+=t)h=n[g],p=n[g+1],h<a&&(a=h),p<l&&(l=p),h>c&&(c=h),p>u&&(u=p);f=Math.max(c-a,u-l),f=f!==0?32767/f:0}return ns(s,o,t,a,l,f,0),o}};function Xd(n,e,t,i,r){let s,o;if(r===aM(n,e,t,i)>0)for(s=e;s<t;s+=i)o=Yh(s,n[s],n[s+1],o);else for(s=t-i;s>=e;s-=i)o=Yh(s,n[s],n[s+1],o);return o&&Ho(o,o.next)&&(rs(o),o=o.next),o}function Vi(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(Ho(t,t.next)||yt(t.prev,t,t.next)===0)){if(rs(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function ns(n,e,t,i,r,s,o){if(!n)return;!o&&s&&tM(n,i,r,s);let a=n,l,c;for(;n.prev!==n.next;){if(l=n.prev,c=n.next,s?qS(n,i,r,s):$S(n)){e.push(l.i/t|0),e.push(n.i/t|0),e.push(c.i/t|0),rs(n),n=c.next,a=c.next;continue}if(n=c,n===a){o?o===1?(n=YS(Vi(n),e,t),ns(n,e,t,i,r,s,2)):o===2&&jS(n,e,t,i,r,s):ns(Vi(n),e,t,i,r,s,1);break}}}function $S(n){const e=n.prev,t=n,i=n.next;if(yt(e,t,i)>=0)return!1;const r=e.x,s=t.x,o=i.x,a=e.y,l=t.y,c=i.y,u=r<s?r<o?r:o:s<o?s:o,h=a<l?a<c?a:c:l<c?l:c,p=r>s?r>o?r:o:s>o?s:o,f=a>l?a>c?a:c:l>c?l:c;let g=i.next;for(;g!==e;){if(g.x>=u&&g.x<=p&&g.y>=h&&g.y<=f&&hr(r,a,s,l,o,c,g.x,g.y)&&yt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function qS(n,e,t,i){const r=n.prev,s=n,o=n.next;if(yt(r,s,o)>=0)return!1;const a=r.x,l=s.x,c=o.x,u=r.y,h=s.y,p=o.y,f=a<l?a<c?a:c:l<c?l:c,g=u<h?u<p?u:p:h<p?h:p,_=a>l?a>c?a:c:l>c?l:c,d=u>h?u>p?u:p:h>p?h:p,m=Zl(f,g,e,t,i),v=Zl(_,d,e,t,i);let x=n.prevZ,S=n.nextZ;for(;x&&x.z>=m&&S&&S.z<=v;){if(x.x>=f&&x.x<=_&&x.y>=g&&x.y<=d&&x!==r&&x!==o&&hr(a,u,l,h,c,p,x.x,x.y)&&yt(x.prev,x,x.next)>=0||(x=x.prevZ,S.x>=f&&S.x<=_&&S.y>=g&&S.y<=d&&S!==r&&S!==o&&hr(a,u,l,h,c,p,S.x,S.y)&&yt(S.prev,S,S.next)>=0))return!1;S=S.nextZ}for(;x&&x.z>=m;){if(x.x>=f&&x.x<=_&&x.y>=g&&x.y<=d&&x!==r&&x!==o&&hr(a,u,l,h,c,p,x.x,x.y)&&yt(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;S&&S.z<=v;){if(S.x>=f&&S.x<=_&&S.y>=g&&S.y<=d&&S!==r&&S!==o&&hr(a,u,l,h,c,p,S.x,S.y)&&yt(S.prev,S,S.next)>=0)return!1;S=S.nextZ}return!0}function YS(n,e,t){let i=n;do{const r=i.prev,s=i.next.next;!Ho(r,s)&&$d(r,i,i.next,s)&&is(r,s)&&is(s,r)&&(e.push(r.i/t|0),e.push(i.i/t|0),e.push(s.i/t|0),rs(i),rs(i.next),i=n=s),i=i.next}while(i!==n);return Vi(i)}function jS(n,e,t,i,r,s){let o=n;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&rM(o,a)){let l=qd(o,a);o=Vi(o,o.next),l=Vi(l,l.next),ns(o,e,t,i,r,s,0),ns(l,e,t,i,r,s,0);return}a=a.next}o=o.next}while(o!==n)}function KS(n,e,t,i){const r=[];let s,o,a,l,c;for(s=0,o=e.length;s<o;s++)a=e[s]*i,l=s<o-1?e[s+1]*i:n.length,c=Xd(n,a,l,i,!1),c===c.next&&(c.steiner=!0),r.push(iM(c));for(r.sort(ZS),s=0;s<r.length;s++)t=JS(r[s],t);return t}function ZS(n,e){return n.x-e.x}function JS(n,e){const t=QS(n,e);if(!t)return e;const i=qd(t,n);return Vi(i,i.next),Vi(t,t.next)}function QS(n,e){let t=e,i=-1/0,r;const s=n.x,o=n.y;do{if(o<=t.y&&o>=t.next.y&&t.next.y!==t.y){const p=t.x+(o-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(p<=s&&p>i&&(i=p,r=t.x<t.next.x?t:t.next,p===s))return r}t=t.next}while(t!==e);if(!r)return null;const a=r,l=r.x,c=r.y;let u=1/0,h;t=r;do s>=t.x&&t.x>=l&&s!==t.x&&hr(o<c?s:i,o,l,c,o<c?i:s,o,t.x,t.y)&&(h=Math.abs(o-t.y)/(s-t.x),is(t,n)&&(h<u||h===u&&(t.x>r.x||t.x===r.x&&eM(r,t)))&&(r=t,u=h)),t=t.next;while(t!==a);return r}function eM(n,e){return yt(n.prev,n,e.prev)<0&&yt(e.next,n,n.next)<0}function tM(n,e,t,i){let r=n;do r.z===0&&(r.z=Zl(r.x,r.y,e,t,i)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==n);r.prevZ.nextZ=null,r.prevZ=null,nM(r)}function nM(n){let e,t,i,r,s,o,a,l,c=1;do{for(t=n,n=null,s=null,o=0;t;){for(o++,i=t,a=0,e=0;e<c&&(a++,i=i.nextZ,!!i);e++);for(l=c;a>0||l>0&&i;)a!==0&&(l===0||!i||t.z<=i.z)?(r=t,t=t.nextZ,a--):(r=i,i=i.nextZ,l--),s?s.nextZ=r:n=r,r.prevZ=s,s=r;t=i}s.nextZ=null,c*=2}while(o>1);return n}function Zl(n,e,t,i,r){return n=(n-t)*r|0,e=(e-i)*r|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function iM(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function hr(n,e,t,i,r,s,o,a){return(r-o)*(e-a)>=(n-o)*(s-a)&&(n-o)*(i-a)>=(t-o)*(e-a)&&(t-o)*(s-a)>=(r-o)*(i-a)}function rM(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!sM(n,e)&&(is(n,e)&&is(e,n)&&oM(n,e)&&(yt(n.prev,n,e.prev)||yt(n,e.prev,e))||Ho(n,e)&&yt(n.prev,n,n.next)>0&&yt(e.prev,e,e.next)>0)}function yt(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function Ho(n,e){return n.x===e.x&&n.y===e.y}function $d(n,e,t,i){const r=Vs(yt(n,e,t)),s=Vs(yt(n,e,i)),o=Vs(yt(t,i,n)),a=Vs(yt(t,i,e));return!!(r!==s&&o!==a||r===0&&Hs(n,t,e)||s===0&&Hs(n,i,e)||o===0&&Hs(t,n,i)||a===0&&Hs(t,e,i))}function Hs(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function Vs(n){return n>0?1:n<0?-1:0}function sM(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&$d(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function is(n,e){return yt(n.prev,n,n.next)<0?yt(n,e,n.next)>=0&&yt(n,n.prev,e)>=0:yt(n,e,n.prev)<0||yt(n,n.next,e)<0}function oM(n,e){let t=n,i=!1;const r=(n.x+e.x)/2,s=(n.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&r<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function qd(n,e){const t=new Jl(n.i,n.x,n.y),i=new Jl(e.i,e.x,e.y),r=n.next,s=e.prev;return n.next=e,e.prev=n,t.next=r,r.prev=t,i.next=t,t.prev=i,s.next=i,i.prev=s,i}function Yh(n,e,t,i){const r=new Jl(n,e,t);return i?(r.next=i.next,r.prev=i,i.next.prev=r,i.next=r):(r.prev=r,r.next=r),r}function rs(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Jl(n,e,t){this.i=n,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function aM(n,e,t,i){let r=0;for(let s=e,o=t-i;s<t;s+=i)r+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return r}class vi{static area(e){const t=e.length;let i=0;for(let r=t-1,s=0;s<t;r=s++)i+=e[r].x*e[s].y-e[s].x*e[r].y;return i*.5}static isClockWise(e){return vi.area(e)<0}static triangulateShape(e,t){const i=[],r=[],s=[];jh(e),Kh(i,e);let o=e.length;t.forEach(jh);for(let l=0;l<t.length;l++)r.push(o),o+=t[l].length,Kh(i,t[l]);const a=XS.triangulate(i,r);for(let l=0;l<a.length;l+=3)s.push(a.slice(l,l+3));return s}}function jh(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function Kh(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class Oc extends Tt{constructor(e=new ko([new se(.5,.5),new se(-.5,.5),new se(-.5,-.5),new se(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const i=this,r=[],s=[];for(let a=0,l=e.length;a<l;a++){const c=e[a];o(c)}this.setAttribute("position",new at(r,3)),this.setAttribute("uv",new at(s,2)),this.computeVertexNormals();function o(a){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,u=t.steps!==void 0?t.steps:1,h=t.depth!==void 0?t.depth:1;let p=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:f-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,d=t.bevelSegments!==void 0?t.bevelSegments:3;const m=t.extrudePath,v=t.UVGenerator!==void 0?t.UVGenerator:lM;let x,S=!1,R,b,A,L;m&&(x=m.getSpacedPoints(u),S=!0,p=!1,R=m.computeFrenetFrames(u,!1),b=new P,A=new P,L=new P),p||(d=0,f=0,g=0,_=0);const G=a.extractPoints(c);let y=G.shape;const E=G.holes;if(!vi.isClockWise(y)){y=y.reverse();for(let K=0,C=E.length;K<C;K++){const ue=E[K];vi.isClockWise(ue)&&(E[K]=ue.reverse())}}const O=vi.triangulateShape(y,E),H=y;for(let K=0,C=E.length;K<C;K++){const ue=E[K];y=y.concat(ue)}function j(K,C,ue){return C||console.error("THREE.ExtrudeGeometry: vec does not exist"),K.clone().addScaledVector(C,ue)}const B=y.length,X=O.length;function V(K,C,ue){let ce,te,fe;const Le=K.x-C.x,xe=K.y-C.y,T=ue.x-K.x,M=ue.y-K.y,N=Le*Le+xe*xe,q=Le*M-xe*T;if(Math.abs(q)>Number.EPSILON){const Z=Math.sqrt(N),Y=Math.sqrt(T*T+M*M),Ce=C.x-xe/Z,de=C.y+Le/Z,Me=ue.x-M/Y,nt=ue.y+T/Y,ne=((Me-Ce)*M-(nt-de)*T)/(Le*M-xe*T);ce=Ce+Le*ne-K.x,te=de+xe*ne-K.y;const Ee=ce*ce+te*te;if(Ee<=2)return new se(ce,te);fe=Math.sqrt(Ee/2)}else{let Z=!1;Le>Number.EPSILON?T>Number.EPSILON&&(Z=!0):Le<-Number.EPSILON?T<-Number.EPSILON&&(Z=!0):Math.sign(xe)===Math.sign(M)&&(Z=!0),Z?(ce=-xe,te=Le,fe=Math.sqrt(N)):(ce=Le,te=xe,fe=Math.sqrt(N/2))}return new se(ce/fe,te/fe)}const re=[];for(let K=0,C=H.length,ue=C-1,ce=K+1;K<C;K++,ue++,ce++)ue===C&&(ue=0),ce===C&&(ce=0),re[K]=V(H[K],H[ue],H[ce]);const oe=[];let le,Xe=re.concat();for(let K=0,C=E.length;K<C;K++){const ue=E[K];le=[];for(let ce=0,te=ue.length,fe=te-1,Le=ce+1;ce<te;ce++,fe++,Le++)fe===te&&(fe=0),Le===te&&(Le=0),le[ce]=V(ue[ce],ue[fe],ue[Le]);oe.push(le),Xe=Xe.concat(le)}for(let K=0;K<d;K++){const C=K/d,ue=f*Math.cos(C*Math.PI/2),ce=g*Math.sin(C*Math.PI/2)+_;for(let te=0,fe=H.length;te<fe;te++){const Le=j(H[te],re[te],ce);he(Le.x,Le.y,-ue)}for(let te=0,fe=E.length;te<fe;te++){const Le=E[te];le=oe[te];for(let xe=0,T=Le.length;xe<T;xe++){const M=j(Le[xe],le[xe],ce);he(M.x,M.y,-ue)}}}const et=g+_;for(let K=0;K<B;K++){const C=p?j(y[K],Xe[K],et):y[K];S?(A.copy(R.normals[0]).multiplyScalar(C.x),b.copy(R.binormals[0]).multiplyScalar(C.y),L.copy(x[0]).add(A).add(b),he(L.x,L.y,L.z)):he(C.x,C.y,0)}for(let K=1;K<=u;K++)for(let C=0;C<B;C++){const ue=p?j(y[C],Xe[C],et):y[C];S?(A.copy(R.normals[K]).multiplyScalar(ue.x),b.copy(R.binormals[K]).multiplyScalar(ue.y),L.copy(x[K]).add(A).add(b),he(L.x,L.y,L.z)):he(ue.x,ue.y,h/u*K)}for(let K=d-1;K>=0;K--){const C=K/d,ue=f*Math.cos(C*Math.PI/2),ce=g*Math.sin(C*Math.PI/2)+_;for(let te=0,fe=H.length;te<fe;te++){const Le=j(H[te],re[te],ce);he(Le.x,Le.y,h+ue)}for(let te=0,fe=E.length;te<fe;te++){const Le=E[te];le=oe[te];for(let xe=0,T=Le.length;xe<T;xe++){const M=j(Le[xe],le[xe],ce);S?he(M.x,M.y+x[u-1].y,x[u-1].x+ue):he(M.x,M.y,h+ue)}}}$(),ee();function $(){const K=r.length/3;if(p){let C=0,ue=B*C;for(let ce=0;ce<X;ce++){const te=O[ce];Ne(te[2]+ue,te[1]+ue,te[0]+ue)}C=u+d*2,ue=B*C;for(let ce=0;ce<X;ce++){const te=O[ce];Ne(te[0]+ue,te[1]+ue,te[2]+ue)}}else{for(let C=0;C<X;C++){const ue=O[C];Ne(ue[2],ue[1],ue[0])}for(let C=0;C<X;C++){const ue=O[C];Ne(ue[0]+B*u,ue[1]+B*u,ue[2]+B*u)}}i.addGroup(K,r.length/3-K,0)}function ee(){const K=r.length/3;let C=0;ve(H,C),C+=H.length;for(let ue=0,ce=E.length;ue<ce;ue++){const te=E[ue];ve(te,C),C+=te.length}i.addGroup(K,r.length/3-K,1)}function ve(K,C){let ue=K.length;for(;--ue>=0;){const ce=ue;let te=ue-1;te<0&&(te=K.length-1);for(let fe=0,Le=u+d*2;fe<Le;fe++){const xe=B*fe,T=B*(fe+1),M=C+ce+xe,N=C+te+xe,q=C+te+T,Z=C+ce+T;De(M,N,q,Z)}}}function he(K,C,ue){l.push(K),l.push(C),l.push(ue)}function Ne(K,C,ue){Ve(K),Ve(C),Ve(ue);const ce=r.length/3,te=v.generateTopUV(i,r,ce-3,ce-2,ce-1);Ke(te[0]),Ke(te[1]),Ke(te[2])}function De(K,C,ue,ce){Ve(K),Ve(C),Ve(ce),Ve(C),Ve(ue),Ve(ce);const te=r.length/3,fe=v.generateSideWallUV(i,r,te-6,te-3,te-2,te-1);Ke(fe[0]),Ke(fe[1]),Ke(fe[3]),Ke(fe[1]),Ke(fe[2]),Ke(fe[3])}function Ve(K){r.push(l[K*3+0]),r.push(l[K*3+1]),r.push(l[K*3+2])}function Ke(K){s.push(K.x),s.push(K.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return cM(t,i,e)}static fromJSON(e,t){const i=[];for(let s=0,o=e.shapes.length;s<o;s++){const a=t[e.shapes[s]];i.push(a)}const r=e.options.extrudePath;return r!==void 0&&(e.options.extrudePath=new jl[r.type]().fromJSON(r)),new Oc(i,e.options)}}const lM={generateTopUV:function(n,e,t,i,r){const s=e[t*3],o=e[t*3+1],a=e[i*3],l=e[i*3+1],c=e[r*3],u=e[r*3+1];return[new se(s,o),new se(a,l),new se(c,u)]},generateSideWallUV:function(n,e,t,i,r,s){const o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[i*3],u=e[i*3+1],h=e[i*3+2],p=e[r*3],f=e[r*3+1],g=e[r*3+2],_=e[s*3],d=e[s*3+1],m=e[s*3+2];return Math.abs(a-u)<Math.abs(o-c)?[new se(o,1-l),new se(c,1-h),new se(p,1-g),new se(_,1-m)]:[new se(a,1-l),new se(u,1-h),new se(f,1-g),new se(d,1-m)]}};function cM(n,e,t){if(t.shapes=[],Array.isArray(n))for(let i=0,r=n.length;i<r;i++){const s=n[i];t.shapes.push(s.uuid)}else t.shapes.push(n.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class di extends os{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,r=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(r,s,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new di(e.radius,e.detail)}}class Bc extends os{constructor(e=1,t=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],r=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,r,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Bc(e.radius,e.detail)}}class zc extends Tt{constructor(e=new ko([new se(0,.5),new se(-.5,-.5),new se(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const i=[],r=[],s=[],o=[];let a=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let u=0;u<e.length;u++)c(e[u]),this.addGroup(a,l,u),a+=l,l=0;this.setIndex(i),this.setAttribute("position",new at(r,3)),this.setAttribute("normal",new at(s,3)),this.setAttribute("uv",new at(o,2));function c(u){const h=r.length/3,p=u.extractPoints(t);let f=p.shape;const g=p.holes;vi.isClockWise(f)===!1&&(f=f.reverse());for(let d=0,m=g.length;d<m;d++){const v=g[d];vi.isClockWise(v)===!0&&(g[d]=v.reverse())}const _=vi.triangulateShape(f,g);for(let d=0,m=g.length;d<m;d++){const v=g[d];f=f.concat(v)}for(let d=0,m=f.length;d<m;d++){const v=f[d];r.push(v.x,v.y,0),s.push(0,0,1),o.push(v.x,v.y)}for(let d=0,m=_.length;d<m;d++){const v=_[d],x=v[0]+h,S=v[1]+h,R=v[2]+h;i.push(x,S,R),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return uM(t,e)}static fromJSON(e,t){const i=[];for(let r=0,s=e.shapes.length;r<s;r++){const o=t[e.shapes[r]];i.push(o)}return new zc(i,e.curveSegments)}}function uM(n,e){if(e.shapes=[],Array.isArray(n))for(let t=0,i=n.length;t<i;t++){const r=n[t];e.shapes.push(r.uuid)}else e.shapes.push(n.uuid);return e}class Lt extends Tt{constructor(e=1,t=32,i=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(o+a,Math.PI);let c=0;const u=[],h=new P,p=new P,f=[],g=[],_=[],d=[];for(let m=0;m<=i;m++){const v=[],x=m/i;let S=0;m===0&&o===0?S=.5/t:m===i&&l===Math.PI&&(S=-.5/t);for(let R=0;R<=t;R++){const b=R/t;h.x=-e*Math.cos(r+b*s)*Math.sin(o+x*a),h.y=e*Math.cos(o+x*a),h.z=e*Math.sin(r+b*s)*Math.sin(o+x*a),g.push(h.x,h.y,h.z),p.copy(h).normalize(),_.push(p.x,p.y,p.z),d.push(b+S,1-x),v.push(c++)}u.push(v)}for(let m=0;m<i;m++)for(let v=0;v<t;v++){const x=u[m][v+1],S=u[m][v],R=u[m+1][v],b=u[m+1][v+1];(m!==0||o>0)&&f.push(x,S,b),(m!==i-1||l<Math.PI)&&f.push(S,R,b)}this.setIndex(f),this.setAttribute("position",new at(g,3)),this.setAttribute("normal",new at(_,3)),this.setAttribute("uv",new at(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Lt(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class kc extends Tt{constructor(e=1,t=.4,i=12,r=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:r,arc:s},i=Math.floor(i),r=Math.floor(r);const o=[],a=[],l=[],c=[],u=new P,h=new P,p=new P;for(let f=0;f<=i;f++)for(let g=0;g<=r;g++){const _=g/r*s,d=f/i*Math.PI*2;h.x=(e+t*Math.cos(d))*Math.cos(_),h.y=(e+t*Math.cos(d))*Math.sin(_),h.z=t*Math.sin(d),a.push(h.x,h.y,h.z),u.x=e*Math.cos(_),u.y=e*Math.sin(_),p.subVectors(h,u).normalize(),l.push(p.x,p.y,p.z),c.push(g/r),c.push(f/i)}for(let f=1;f<=i;f++)for(let g=1;g<=r;g++){const _=(r+1)*f+g-1,d=(r+1)*(f-1)+g-1,m=(r+1)*(f-1)+g,v=(r+1)*f+g;o.push(_,d,v),o.push(d,m,v)}this.setIndex(o),this.setAttribute("position",new at(a,3)),this.setAttribute("normal",new at(l,3)),this.setAttribute("uv",new at(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new kc(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Mr extends Wi{constructor(e){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new ze(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ze(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xd,this.normalScale=new se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.gradientMap=e.gradientMap,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}class hM extends Pc{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}class Yd extends Et{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ze(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class fM extends Yd{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ze(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const ka=new rt,Zh=new P,Jh=new P;class dM{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new se(512,512),this.map=null,this.mapPass=null,this.matrix=new rt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ac,this._frameExtents=new se(1,1),this._viewportCount=1,this._viewports=[new gt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Zh.setFromMatrixPosition(e.matrixWorld),t.position.copy(Zh),Jh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Jh),t.updateMatrixWorld(),ka.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ka),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(ka)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class pM extends dM{constructor(){super(new Id(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class mM extends Yd{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.target=new Et,this.shadow=new pM}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:vc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=vc);function gM(n,e=!1){const t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),r=new Set(Object.keys(n[0].morphAttributes)),s={},o={},a=n[0].morphTargetsRelative,l=new Tt;let c=0;for(let u=0;u<n.length;++u){const h=n[u];let p=0;if(t!==(h.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in h.attributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;s[f]===void 0&&(s[f]=[]),s[f].push(h.attributes[f]),p++}if(p!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(a!==h.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in h.morphAttributes){if(!r.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(h.morphAttributes[f])}if(e){let f;if(t)f=h.index.count;else if(h.attributes.position!==void 0)f=h.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,u),c+=f}}if(t){let u=0;const h=[];for(let p=0;p<n.length;++p){const f=n[p].index;for(let g=0;g<f.count;++g)h.push(f.getX(g)+u);u+=n[p].attributes.position.count}l.setIndex(h)}for(const u in s){const h=Qh(s[u]);if(!h)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;l.setAttribute(u,h)}for(const u in o){const h=o[u][0].length;if(h===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[u]=[];for(let p=0;p<h;++p){const f=[];for(let _=0;_<o[u].length;++_)f.push(o[u][_][p]);const g=Qh(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;l.morphAttributes[u].push(g)}}return l}function Qh(n){let e,t,i,r=-1,s=0;for(let c=0;c<n.length;++c){const u=n[c];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=u.normalized),i!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=u.gpuType),r!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=u.count*t}const o=new e(s),a=new Ht(o,t,i);let l=0;for(let c=0;c<n.length;++c){const u=n[c];if(u.isInterleavedBufferAttribute){const h=l/t;for(let p=0,f=u.count;p<f;p++)for(let g=0;g<t;g++){const _=u.getComponent(p,g);a.setComponent(p+h,g,_)}}else o.set(u.array,l);l+=u.count*t}return r!==void 0&&(a.gpuType=r),a}const Pt=.1,Rt=n=>n.x*100,Mt=n=>n.y*75,Ha=(n,e)=>({x:n/100,y:e/75}),ot=1.2,$n={cx:$i.cx*Pt,cz:$i.cy*Pt,grx:$i.grassRx*Pt,grz:$i.grassRy*Pt,srx:$i.sandRx*Pt,srz:$i.sandRy*Pt},Ue=$n;function jd(n,e){return Math.hypot((n-$n.cx)/$n.grx,(e-$n.cz)/$n.grz)}function Kd(n,e){return Math.hypot((n-$n.cx)/$n.srx,(e-$n.cz)/$n.srz)}const ef=(n,e,t)=>{const i=Math.min(1,Math.max(0,(t-n)/(e-n)));return i*i*(3-2*i)};function zr(n,e){const t=jd(n,e);if(t<=.972)return ot;const i=Kd(n,e),r=1-ef(.972,1,t),s=.5-.62*ef(.93,1,i),o=i>1?-.12-Math.min(4,(i-1)*28):0;return s*(1-r)+ot*r+o}const Vo={value:.0024},_M=`
  mvPosition.y -= uCurve * mvPosition.z * mvPosition.z;
  gl_Position = projectionMatrix * mvPosition;
`,Zd={value:new gt(-9999,-9999,0,0)};function bt(n,e=!1){return n.onBeforeCompile=t=>{t.uniforms.uCurve=Vo,t.vertexShader=`uniform float uCurve;
varying float vSeeDepth;
`+t.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>
`+_M+`  vSeeDepth = -mvPosition.z;
`),e&&(t.uniforms.uSee=Zd,t.fragmentShader=`uniform vec4 uSee;
varying float vSeeDepth;
`+t.fragmentShader.replace("void main() {",`void main() {
          vec2 dd = (gl_FragCoord.xy - uSee.xy) / vec2(uSee.w * 0.8, uSee.w * 1.15);
          if (vSeeDepth < uSee.z - 2.0 && dot(dd, dd) < 1.0) {
            float k = 1.0 - dot(dd, dd);
            float g = mod(floor(gl_FragCoord.x * 0.5) + floor(gl_FragCoord.y * 0.5), 2.0);
            if (k > 0.25 || g < 1.0) discard;
          }`))},n.customProgramCacheKey=()=>"curved"+(e?"S":""),n}const ai=new P;function kr(n,e,t,i){ai.copy(n).applyMatrix4(e.matrixWorldInverse),ai.y-=Vo.value*ai.z*ai.z;const r=-ai.z;return ai.applyMatrix4(e.projectionMatrix),{x:(ai.x*.5+.5)*t,y:(-ai.y*.5+.5)*i,z:r}}const Go=(()=>{const n=new Uint8Array([120,190,255]),e=new Bd(n,3,1,Oo);return e.minFilter=e.magFilter=Zt,e.needsUpdate=!0,e})(),tf=new Map;function Q(n,e={}){const t=n+":"+(e.emissive??0)+":"+!!e.flat;let i=tf.get(t);return i||(i=bt(new Mr({color:n,gradientMap:Go,emissive:e.emissive??0}),!0),tf.set(t,i)),i}function Dn(n,e={},t=!0){return bt(new Mr({color:n,gradientMap:Go,...e}),t)}const Hc=bt(new Mr({color:12248829,gradientMap:Go,emissive:16763213,emissiveIntensity:0}),!0),Jd=bt(new Mr({color:16639626,gradientMap:Go,emissive:16765803,emissiveIntensity:.25}),!0),vM=3873400,Qd=bt(new on({color:vM,side:$t}),!0);function ep(n,e=.14){const t=n.geometry;t.boundingBox||t.computeBoundingBox();const i=t.boundingBox,r=new P,s=new P;i.getSize(r),i.getCenter(s);const o=new Je(t,Qd),a=new P(1+2*e/Math.max(r.x,.05),1+2*e/Math.max(r.y,.05),1+2*e/Math.max(r.z,.05));return o.scale.copy(a),o.position.set(s.x*(1-a.x),s.y*(1-a.y),s.z*(1-a.z)),o.raycast=()=>{},n.add(o),n}function ie(n,e,t=0,i=0,r=0,s=.14){const o=new Je(n,e);return o.position.set(t,i,r),s!==!1&&ep(o,s),o}const Qe=(n,e,t)=>new Cr(n,e,t);function xM(n,e,t){const i=new ko;i.moveTo(-n/2,0),i.lineTo(n/2,0),i.lineTo(0,e),i.closePath();const r=new Oc(i,{depth:t,bevelEnabled:!1});return r.translate(0,0,-t/2),r}let Va=null;function yM(){if(!Va){const n=document.createElement("canvas");n.width=n.height=64;const e=n.getContext("2d"),t=e.createRadialGradient(32,32,0,32,32,32);t.addColorStop(0,"rgba(20,30,60,0.42)"),t.addColorStop(.6,"rgba(20,30,60,0.22)"),t.addColorStop(1,"rgba(20,30,60,0)"),e.fillStyle=t,e.fillRect(0,0,64,64),Va=new qn(n)}return bt(new on({map:Va,transparent:!0,depthWrite:!1}))}let Ga=null;const SM=new It(1,1).rotateX(-Math.PI/2);function an(n,e=n*.6){Ga||(Ga=yM());const t=new Je(SM,Ga);return t.scale.set(n*2,1,e*2),t.renderOrder=1,t.raycast=()=>{},t.userData.noHit=!0,t}let Wa=null;function MM(n=16766315){if(!Wa){const e=document.createElement("canvas");e.width=e.height=64;const t=e.getContext("2d"),i=t.createRadialGradient(32,32,0,32,32,32);i.addColorStop(0,"rgba(255,255,255,0.9)"),i.addColorStop(.35,"rgba(255,255,255,0.35)"),i.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=i,t.fillRect(0,0,64,64),Wa=new qn(e)}return bt(new on({map:Wa,color:n,transparent:!0,depthWrite:!1,blending:yo}))}function Xa(n){let e=n>>>0;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function nf(n){var o;n.updateMatrixWorld(!0);const e=new rt().copy(n.matrixWorld).invert(),t=new Map,i=[],r=new rt,s=a=>{if(a.userData.dyn||!a.visible)return;const l=a;if(l.isMesh&&!l.isInstancedMesh&&!Array.isArray(l.material)){let c=l.geometry.clone();c.applyMatrix4(r.multiplyMatrices(e,l.matrixWorld)),c.index&&(c=c.toNonIndexed());for(const h of Object.keys(c.attributes))h!=="position"&&h!=="normal"&&h!=="uv"&&!(h==="color"&&l.material.vertexColors)&&c.deleteAttribute(h);c.attributes.uv||c.setAttribute("uv",new Ht(new Float32Array(c.attributes.position.count*2),2)),c.morphAttributes={},(t.get(l.material)??t.set(l.material,[]).get(l.material)).push(c),i.push(l)}a.children.forEach(s)};n.children.forEach(s);for(const a of i)(o=a.parent)==null||o.remove(a);for(const[a,l]of t){const c=gM(l,!1);if(!c)continue;const u=new Je(c,a);u.renderOrder=l.length&&a.transparent?1:0,u.raycast=()=>{},n.add(u)}}const rf=new Map;let Hr=null;function EM(){return Hr||(Hr=document.createElement("div"),Hr.style.cssText="position:fixed;left:-10000px;top:0;width:400px;height:400px;overflow:hidden;visibility:hidden;pointer-events:none",document.body.appendChild(Hr)),Hr}const wM=/<ellipse[^>]*fill="rgba\(0,\s*0,\s*0,\s*0?\.\d+\)"[^>]*\/?>(<\/ellipse>)?/g;let sf=Promise.resolve();function bM(n){const e=n.key+"@"+n.unit.toFixed(4),t=rf.get(e);if(t)return t;const i=sf=sf.then(()=>TM(n)).catch(()=>null);return rf.set(e,i),i}async function TM(n){var y;const e=n.svg.replace(wM,""),t=EM();t.innerHTML=e;const i=t.querySelector("svg");if(!i)return null;let r;try{r=i.getBBox()}catch{return null}if(!r.width||!r.height)return null;const s=i.innerHTML;t.innerHTML="";const o=4,a=Math.max(n.anchorX-r.x,r.x+r.width-n.anchorX)+o,l=n.anchorX-a,c=a*2,u=r.y+r.height,h=r.y-o,p=u+o-h,f=n.maxPx??300,g=Math.min(f/p,1024/c),_=Math.max(2,Math.round(c*g)),d=Math.max(2,Math.round(p*g)),m=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${_}" height="${d}" viewBox="${l} ${h} ${c} ${p}">${s}</svg>`,v=new Image;v.decoding="async",v.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(m);try{await v.decode()}catch{return null}const x=document.createElement("canvas");x.width=_,x.height=d;const S=x.getContext("2d");if(!S)return null;S.drawImage(v,0,0,_,d),(y=n.extra)==null||y.call(n,S,(E,F)=>[(E-l)*g,(F-h)*g],g);const R=new qn(x);R.colorSpace=Ot,R.anisotropy=4;const b=c*n.unit,A=p*n.unit,L=o*n.unit,G=new It(b,A);return G.translate(0,A/2-L,0),{tex:R,geo:G,w:b,h:A}}function Gs(n,e={}){const t="sign:"+n+JSON.stringify(e),i=Co.get(t);if(i)return i;const r=44,s=document.createElement("canvas"),o=`900 ${r}px "Hiragino Maru Gothic ProN", "M PLUS Rounded 1c", system-ui, sans-serif`,a=s.getContext("2d");a.font=o;const l=Math.ceil(a.measureText(n).width);s.width=l+48,s.height=r+36;const c=s.getContext("2d");c.font=o;const u=16;c.fillStyle=e.bg??"#fef3c7",c.strokeStyle=e.border??"#4c1d95",c.lineWidth=6,c.beginPath(),c.roundRect(4,4,s.width-8,s.height-8,u),c.fill(),c.stroke(),c.fillStyle=e.fg??"#7c2d12",c.textAlign="center",c.textBaseline="middle",c.fillText(n,s.width/2,s.height/2+2);const h=new qn(s);h.colorSpace=Ot,h.anisotropy=4;const p=(e.size??1)*.045,f=s.width*p,g=s.height*p,_=new It(f,g);_.translate(0,g/2,0);const d={tex:h,geo:_,w:f,h:g};return Co.set(t,d),d}const Co=new Map;function $a(n,e=3){const t="emoji:"+n+e,i=Co.get(t);if(i)return i;const r=document.createElement("canvas");r.width=r.height=128;const s=r.getContext("2d");s.font='100px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',s.textAlign="center",s.textBaseline="middle",s.fillText(n,64,70);const o=new qn(r);o.colorSpace=Ot;const a=new It(e,e);a.translate(0,e/2,0);const l={tex:o,geo:a,w:e,h:e};return Co.set(t,l),l}const tt={ink:4988309,cream:16708551,red:16281969,redDeep:15680580,door:10576391,wood:9584654,woodDark:7877903,yellow:16639626,gold:16569165,blue:6333946,white:16777215,lav:14739455,lav2:13095678,indigo:6514417,purple:10980346,purple2:12891645,stone:11051678};function Ql(n,e,t,i,r){const s=new Be;return s.add(ie(Qe(n+.4,e+.4,.2),Q(tt.white),t,i,r)),s.add(ie(Qe(n,e,.3),Hc,t,i,r+.05,!1)),s.add(ie(Qe(.14,e,.34),Q(tt.white),t,i,r+.06,!1)),s}function Wo(n,e,t,i=tt.door){const r=new Be;return r.add(ie(Qe(n,e,.3),Q(i),0,e/2,t)),r.add(ie(new Lt(.18,8,6),Q(tt.yellow),n*.28,e*.48,t+.2,!1)),r}function AM(){const n=new Be,e=10,t=7,i=8;n.add(ie(Qe(e,t,i),Q(tt.cream),0,t/2,-i/2)),n.add(ie(Qe(e+.6,.6,i+.6),Q(14078929),0,.3,-i/2));const r=ie(xM(e+2.4,5.2,i+1.4),Q(tt.red),0,t,-i/2);n.add(r),n.add(ie(Qe(1.4,3.2,1.4),Q(16557477),2.8,t+3.4,-i/2-1.2)),n.add(Wo(2.8,3.8,.02)),n.add(Ql(2.2,1.8,-3.1,4.9,.02)),n.add(Ql(2.2,1.8,3.1,4.9,.02));for(const s of[-3.1,3.1]){n.add(ie(Qe(2.6,.6,.7),Q(tt.wood),s,3.6,.35));for(let o=0;o<3;o++)n.add(ie(new Lt(.32,8,6),Q([16020150,16436245,10980346][o]),s-.8+o*.8,4.05,.35,!1))}return n.add(an(7,6).translateZ(-i/2)),{obj:n,glows:[{p:new P(-3.1,4.9,.6),r:4},{p:new P(3.1,4.9,.6),r:4}]}}function CM(){const n=new Be,e=ie(new Ye(1.9,3,14,20),Q(tt.white),0,7,-3);n.add(e);for(const[c,u]of[[4.7,2.5],[10,2.2]]){const h=3-c/14*1.1;n.add(ie(new Ye(h-u/14*1.1+.05,h+.05,u,20),Q(tt.redDeep),0,c,-3,!1))}n.add(ie(new Ye(2.6,2.6,.4,20),Q(tt.wood),0,14.2,-3));const t=ie(new Ye(1.5,1.5,2.2,16),Jd,0,15.5,-3);n.add(t),n.add(ie(new Sn(2,2.2,16),Q(tt.redDeep),0,17.7,-3)),n.add(ie(new Lt(.35,8,6),Q(tt.yellow),0,18.9,-3,!1)),n.add(Wo(1.6,2.4,-.1));const i=new Be;i.userData.noHit=!0,i.userData.dyn=!0,i.position.set(0,15.5,-3);const r=new Sn(2.4,20,16,4,!0),s=r.attributes.position,o=new Float32Array(s.count*3);for(let c=0;c<s.count;c++){const h=1-Math.max(0,Math.min(1,.5-s.getY(c)/20))*.92;o[c*3]=h,o[c*3+1]=h*.95,o[c*3+2]=h*.7}r.setAttribute("color",new Ht(o,3));const a=bt(new on({vertexColors:!0,transparent:!0,opacity:0,depthWrite:!1,blending:yo,side:kt})),l=new Je(r,a);return l.rotation.z=Math.PI/2,l.position.x=10,i.add(l),n.add(i),n.add(an(4.5,3.4).translateZ(-3)),{obj:n,tick:c=>{i.rotation.y=c*1.5},glows:[{p:new P(0,15.5,-1),r:6}],nightOnly:[i]}}function RM(){const n=new Be,e=16,t=7.2,i=9;n.add(ie(Qe(e+.6,.6,i+.6),Q(14078929),0,.3,-i/2)),n.add(ie(Qe(e,t,i),Q(tt.yellow),0,t/2,-i/2)),n.add(ie(Qe(e+.8,.6,i+.8),Q(16096779),0,t+.3,-i/2)),n.add(ie(Qe(5.2,4.6,5),Q(tt.gold),0,t+.6+2.3,-i/2+.5));const r=ie(new Sn(4.6,3.2,4),Q(tt.blue),0,t+.6+4.6+1.6,-i/2+.5);r.rotation.y=Math.PI/4,n.add(r);const s=new Be;s.position.set(0,t+.6+2.3,-i/2+3.05),s.add(ie(new Ye(1.25,1.25,.2,24).rotateX(Math.PI/2),Q(tt.white)));const o=ie(Qe(.16,.85,.1),Q(tt.ink),0,.42,.15,!1),a=ie(Qe(.6,.16,.1),Q(tt.ink),.3,0,.16,!1);s.add(o,a),n.add(s);for(const c of[-6.2,-3.8,3.4,5.8])n.add(Ql(1.8,1.8,c,4.8,.02));n.add(Wo(2.6,3.6,.02)),n.add(ie(new Ye(.12,.12,4,6),Q(tt.ink),4,t+.6+2,-i/2-1.5,!1));const l=ie(new It(2.2,1.4).translate(1.1,0,0),Dn(tt.red,{side:kt}),4.1,t+.6+3.3,-i/2-1.5,!1);return l.userData.dyn=!0,n.add(l),n.add(an(10,7).translateZ(-i/2)),{obj:n,tick:c=>{l.rotation.y=Math.sin(c*2.2)*.35},glows:[-6.2,-3.8,3.4,5.8].map(c=>({p:new P(c,4.8,.6),r:3.4}))}}function PM(){const n=new Be,e=9.6,t=7.4,i=Q(tt.ink);for(const a of[-1,1])for(const l of[-1.2,1.2]){const c=Math.hypot(4.6,e),u=ie(new Ye(.25,.3,c,8),i,a*2.3,e/2,l-2,!1);u.rotation.z=a*Math.atan2(4.6,e),n.add(u)}const r=new Be;r.userData.dyn=!0,r.position.set(0,e,-2),r.add(new Je(new kc(t,.28,8,48),Q(tt.purple)));const s=[],o=[16281969,16498468,3462041,6333946];for(let a=0;a<8;a++){const l=a/8*Math.PI*2,c=new Je(new Ye(.1,.1,t,6),Q(tt.purple2));c.position.set(Math.cos(l)*t/2,Math.sin(l)*t/2,0),c.rotation.z=l-Math.PI/2,r.add(c);const u=new Be;u.position.set(Math.cos(l)*t,Math.sin(l)*t,0),u.add(ie(new Lt(1,12,10),Q(o[a%4]),0,-.9,0)),u.add(ie(new Ye(.06,.06,.9,4),Q(tt.ink),0,-.2,0,!1)),r.add(u),s.push(u)}return r.add(ie(new Lt(.9,12,10),Q(tt.yellow))),n.add(r),n.add(an(6.5,3.5).translateZ(-2)),{obj:n,tick:a=>{r.rotation.z=a*.26;for(const l of s)l.rotation.z=-r.rotation.z},glows:[{p:new P(0,e,-1),r:5}]}}function LM(){const n=new Be,e=9.6,t=5.6,i=8;n.add(ie(Qe(e,t,i),Q(tt.lav),0,t/2,-i/2));const r=ie(new Lt(5,24,12,0,Math.PI*2,0,Math.PI/2),Q(tt.lav2),0,t,-i/2);n.add(r),n.add(ie(Qe(1.4,5.2,4.6),Q(3223169),0,t+2.2,-i/2+1.6,!1));const s=ie(new Ye(.6,.75,4.6,12),Q(tt.indigo),0,t+4.2,-i/2+2);s.rotation.x=.75,n.add(s),n.add(Wo(2.4,3.2,.02));for(const o of[-3,3])n.add(ie(new Ye(.7,.7,.3,16).rotateX(Math.PI/2),Hc,o,3,.1));return n.add(an(6.5,5).translateZ(-i/2)),{obj:n,glows:[{p:new P(-3,3,.6),r:2.6},{p:new P(3,3,.6),r:2.6}]}}function IM(){const n=new Be;n.add(ie(Qe(8,.6,3.6),Q(11817737),0,2,-1.8));for(const i of[-3.2,3.2])for(const r of[-3,-.6])n.add(ie(Qe(.4,1.8,.4),Q(tt.woodDark),i,.9,r,!1));n.add(ie(new Ye(1.2,1.6,1,4).rotateY(Math.PI/4),Q(tt.cream),0,2.8,-1.8));const e=Q(16777215),t=[[-.6,3.75,-2.2],[.6,3.75,-2.2],[-.6,3.75,-1.2],[.6,3.75,-1.2],[0,4.6,-1.7]];for(const[i,r,s]of t)n.add(ie(new Lt(.62,12,10),e,i,r,s,.08));for(let i=0;i<4;i++){const r=new Be;r.position.set(-4.4-i%2*.6,0,-2.4+i*.4),r.rotation.z=.12-i*.07,r.add(ie(new Ye(.06,.08,7,5),Q(13273604),0,3.5,0,!1)),r.add(ie(new Sn(.35,2.2,6),Q(16639626),0,7.2,0,!1)),n.add(r)}return n.add(an(5,2.6).translateZ(-1.8)),{obj:n}}function DM(n){switch(n){case"bd_house":return AM();case"bd_light":return CM();case"bd_school":return RM();case"bd_wheel":return PM();case"bd_observ":return LM();case"bd_moon":return IM();default:return null}}function UM(){const n=new Be;n.userData.dyn=!0,n.add(ie(Qe(.8,4,.8),Q(tt.wood),0,2,0)),n.add(ie(new Uc(1.4,2,4,12).rotateZ(Math.PI/2),Q(tt.redDeep),0,4.8,0)),n.add(ie(Qe(1.8,.3,.2),Q(8330525),0,5.1,1.42,!1));const e=new Be;e.position.set(2.1,4.4,0),e.add(ie(Qe(.18,2.4,.18),Q(tt.ink),0,1.2,0,!1));const t=ie(Qe(1.4,.9,.12),Q(16638023),.7,2,0);return e.add(t),n.add(e),n.add(an(2.2,1.4)),{obj:n,setFlag(i){e.rotation.z=i?0:-Math.PI/2,t.material=Q(i?16638023:9741240)}}}function NM(){const n=new Be;n.userData.dyn=!0;const e=new Be;e.add(ie(Qe(4.6,2.8,3),Q(11817737),0,1.4,0)),e.add(ie(new Ye(1.5,1.5,4.6,16,1,!1,0,Math.PI).rotateZ(Math.PI/2).rotateX(Math.PI/2),Q(14251782),0,2.8,0)),e.add(ie(Qe(.9,1.3,.3),Q(16638023),0,2.7,1.55));for(const t of[-1.6,1.6])e.add(ie(Qe(.4,2.9,3.1),Q(16569165),t,1.45,0,!1));return n.add(e),n.add(an(3,2)),{obj:n,tick:t=>{e.position.y=Math.abs(Math.sin(t*2.4))*.35,e.rotation.z=Math.sin(t*2.4)*.05}}}function FM(n,e){if(n===10||n===11){const r=[[16347926,16486972],[14427686,15680580],[15381256,16436245],[1483594,2278750]][e%(n===11?3:4)];return{a:r[0],b:r[1],snow:!1}}return n===3||n===4?e%3===0?{a:16361684,b:16502760,snow:!1}:{a:2278750,b:4906624,snow:!1}:{a:1483594,b:2278750,snow:n===12||n===1||n===2}}function of(n,e){const t=new Be,i=[],r=new Et,s=bt(new on({color:2757728,side:$t}),!0),o={},a=(f,g,_,d,m,v,x)=>{const S=o[f]??(o[f]={geo:g(),mat:_(),mats:[],colors:m!==void 0?[]:void 0,outline:v,sway:x});S.mats.push(d),m!==void 0&&S.colors.push(new ze(m))},l=(f,g,_,d,m=d,v=d,x=0,S=0)=>(r.position.set(f,g,_),r.scale.set(d,m,v),r.rotation.set(0,x,S),r.updateMatrix(),r.matrix.clone()),c=()=>Dn(16777215);n.forEach((f,g)=>{const _=FM(e,g),d=f.s;if(f.kind==="round")a("trunk",()=>new Ye(.45,.65,1,8).translate(0,.5,0),()=>Q(tt.woodDark),l(f.x,f.y,f.z,d,3.2*d,d),void 0,.12),a("ball",()=>new di(1,2),c,l(f.x,f.y+5*d,f.z,3*d,2.6*d,3*d),f.color??_.a,.16,!0),a("ball",()=>new di(1,2),c,l(f.x-1.3*d,f.y+4.1*d,f.z+.9*d,2*d),_.b,.16,!0),a("ball",()=>new di(1,2),c,l(f.x+1.4*d,f.y+4.4*d,f.z+.6*d,2.1*d),_.b,.16,!0),_.snow&&a("snow",()=>new Lt(1,12,6,0,Math.PI*2,0,Math.PI/2.6),()=>Q(16317180),l(f.x,f.y+6.5*d,f.z,2.5*d,1.4*d,2.5*d));else if(f.kind==="pine"){a("trunk",()=>new Ye(.45,.65,1,8).translate(0,.5,0),()=>Q(tt.woodDark),l(f.x,f.y,f.z,d*.9,2.2*d,d*.9),void 0,.12);for(let m=0;m<3;m++)a("cone",()=>new Sn(1,1,9),c,l(f.x,f.y+(3+m*2.1)*d,f.z,(2.9-m*.75)*d,3*d,(2.9-m*.75)*d,m*.6),m%2?1467700:1409085,.16,!0);_.snow&&a("snowc",()=>new Sn(1,1,9),()=>Q(16317180),l(f.x,f.y+8*d,f.z,1*d,1.1*d,1*d))}else if(f.kind==="palm"){for(let v=0;v<5;v++)a("ptrunk",()=>new Ye(.42,.52,1.6,8),()=>Q(10576391),l(f.x+v*v*.06*d,f.y+(.8+v*1.5)*d,f.z,d,d,d,0,-.08*v),void 0,.1);const m=new P(f.x+1*d,f.y+7.6*d,f.z);for(let v=0;v<6;v++){const x=v/6*Math.PI*2;a("leaf",()=>new Sn(.9,5,4).rotateZ(-Math.PI/2).translate(2.5,0,0).scale(1,.25,1),c,l(m.x,m.y,m.z,d,d,d,x,-.35),v%2?2278750:1483594,.1,!0)}a("coco",()=>new Lt(.45,8,6),()=>Q(7877903),l(m.x+.4*d,m.y-.5*d,m.z+.4*d,d))}else a("ball",()=>new di(1,2),c,l(f.x,f.y+1.2*d,f.z,2.2*d,1.7*d,1.8*d),f.color??_.b,.16,!0),a("ball",()=>new di(1,2),c,l(f.x+1.6*d,f.y+.9*d,f.z+.4*d,1.5*d),_.a,.16,!0),_.snow&&a("snow",()=>new Lt(1,12,6,0,Math.PI*2,0,Math.PI/2.6),()=>Q(16317180),l(f.x,f.y+2.4*d,f.z,1.8*d,.9*d,1.5*d))});for(const f of Object.values(o)){const g=new mr(f.geo,f.mat,f.mats.length);if(f.mats.forEach((_,d)=>g.setMatrixAt(d,_)),f.colors&&f.colors.forEach((_,d)=>g.setColorAt(d,_)),t.add(g),f.outline){const _=new mr(f.geo,s,f.mats.length);f.mats.forEach((d,m)=>{const v=new P,x=new Ar,S=new P;d.decompose(v,x,S);const R=b=>b+f.outline*2;S.set(R(S.x),R(S.y),R(S.z)),_.setMatrixAt(m,new rt().compose(v,x,S))}),t.add(_),f.sway&&i.push({m:_,base:[],phase:[]})}f.sway&&i.push({m:g,base:[],phase:[]})}for(const f of i)for(let g=0;g<f.m.count;g++){const _=new rt;f.m.getMatrixAt(g,_),f.base.push(_);const d=new P().setFromMatrixPosition(_);f.phase.push(d.x*.13+d.z*.07)}for(const f of n){const g=an((f.kind==="bush"?2.6:f.kind==="palm"?2.4:3.2)*f.s,(f.kind==="bush"?1.8:2.2)*f.s);g.position.set(f.x,f.y+.04,f.z),t.add(g)}const u=new rt,h=new rt;let p=0;return{obj:t,tick:(f,g)=>{if(p+=g,!(p<1/30)){p=0;for(const _ of i){for(let d=0;d<_.base.length;d++){const m=Math.sin(f*1.3+_.phase[d])*.035;h.makeRotationZ(m);const v=_.base[d];u.copy(v);const x=u.elements,S=x[12],R=x[13],b=x[14];u.setPosition(0,0,0).premultiply(h).setPosition(S+m*2,R,b),_.m.setMatrixAt(d,u)}_.m.instanceMatrix.needsUpdate=!0}}}}}function OM(n=1,e=tt.stone){const t=new Be,i=ie(new Fc(1.6*n,0),Q(e),0,.7*n,0,.12);return i.scale.set(1.3,.8,1),i.rotation.y=n*3,t.add(i),t.add(an(2.2*n,1.5*n)),t}function BM(n){const e=new Be,t=new mr(new Ye(.07,.07,1.4,4).translate(0,.7,0),Q(1483594),n.length),i=new mr(new di(.42,1),Dn(16777215),n.length),r=new mr(new Lt(.2,6,4),Q(16638023),n.length),s=new Et;return n.forEach((o,a)=>{s.position.set(o.x,o.y,o.z),s.scale.set(1,1,1),s.updateMatrix(),t.setMatrixAt(a,s.matrix),s.position.y=o.y+1.5,s.scale.set(1,.7,1),s.updateMatrix(),i.setMatrixAt(a,s.matrix),i.setColorAt(a,new ze(o.c)),s.position.z=o.z+.3,s.position.y=o.y+1.55,s.scale.set(1,1,1),s.updateMatrix(),r.setMatrixAt(a,s.matrix)}),e.add(t,i,r),e}function zM(n,e){const t=new Sn(.35,1.3,4).translate(0,.6,0),i=new mr(t,Q(e?8825231:1409085),n.length*3),r=new Et;let s=0;for(const o of n)for(let a=0;a<3;a++)r.position.set(o.x+(a-1)*.45*o.s,o.y,o.z+a%2*.2),r.rotation.set(0,0,(a-1)*.35),r.scale.setScalar(o.s*(a===1?1.15:.85)),r.updateMatrix(),i.setMatrixAt(s++,r.matrix);return i}function af(n){const e=new Be,t=new Be;for(let r=0;r<6;r++){const s=r/6*Math.PI*2,o=new Je(new Lt(1.2,12,10),Q(16347926));o.scale.set(.75,.85,1),o.position.set(Math.cos(s)*.75,1.2,Math.sin(s)*.75),o.rotation.y=-s,t.add(o)}t.add(ie(new Ye(.16,.24,.9,6),Q(1409085),0,2.4,0,!1)),ep(t.children[0],.1),e.add(t);let i=null;if(n){const r=document.createElement("canvas");r.width=r.height=128;const s=r.getContext("2d");s.fillStyle="#fde047",s.beginPath(),s.moveTo(30,58),s.lineTo(44,34),s.lineTo(58,58),s.closePath(),s.fill(),s.beginPath(),s.moveTo(70,58),s.lineTo(84,34),s.lineTo(98,58),s.closePath(),s.fill(),s.beginPath(),s.moveTo(24,74);for(let a=0;a<=8;a++)s.lineTo(24+a*10,74+(a%2?10:0));s.quadraticCurveTo(64,120,24,74),s.fill();const o=new qn(r);o.colorSpace=Ot,i=new Je(new It(2,2),bt(new on({map:o,transparent:!0,depthWrite:!1}))),i.position.set(0,1.2,1.62),e.add(i)}return e.add(an(2,1.5)),{obj:e,glows:n?[{p:new P(0,1.4,1.8),r:3.2}]:void 0}}function kM(){const n=new Be;n.add(ie(new Ye(.5,.6,1.6,8),Q(9584654),0,.8,0));for(let t=0;t<3;t++)n.add(ie(new Sn(3.4-t*.9,3.2,10),Q(1483594),0,2.8+t*2.1,0));const e=[15680580,16638023,6333946,16020150];for(let t=0;t<12;t++){const i=t*2.4,r=2.2+t%4*1.5,s=3-(r-2)*.42;n.add(ie(new Lt(.3,8,6),Dn(e[t%4],{emissive:e[t%4],emissiveIntensity:.35}),Math.cos(i)*s,r,Math.sin(i)*s,!1))}return n.add(ie(new Bc(.8,0),Dn(16638023,{emissive:16638023,emissiveIntensity:.6}),0,9.6,0)),n.add(an(3.6,2.4)),{obj:n,glows:[{p:new P(0,9.6,.5),r:3},{p:new P(0,5,2),r:5}]}}function HM(){const n=new Be;[-1,0,1].forEach((e,t)=>{const i=5.6-t*.9+(t===1?1.4:0),r=ie(new Ye(.42,.42,i,10),Q(6660877),e,i/2,t===1?-.4:.2);n.add(r)}),n.add(ie(new Ye(2,2.2,1.8,14),Q(14251782),0,.9,0));for(let e=0;e<5;e++)n.add(ie(new Sn(.7,1.6,6),Q(1467700),Math.cos(e*1.3)*1.5,2,Math.sin(e*1.3)*1.2,!1));return n.add(an(2.8,2)),{obj:n}}function VM(){const n=new Be;return n.add(ie(new Lt(.7,10,8).scale(.9,1.15,.9),Q(10576391),0,.8,0,.08)),n.add(ie(new Lt(.72,10,6,0,Math.PI*2,0,Math.PI/2),Q(7877903),0,1.15,0,.08)),n}const li={x:.3,y:.86},ci={x:.58,y:.72},qa=.36,Ya=.062,Ws={up:40,back:54,fov:36,look:-4},Ro=1.2;class ja{constructor(e,t=2.2){Te(this,"group",new Be);Te(this,"holder",new Be);Te(this,"mesh",null);Te(this,"shadow");Te(this,"key",null);Te(this,"art",null);Te(this,"mat");Te(this,"jumpAt",-1);this.id=e,this.mat=bt(new on({transparent:!1,alphaTest:.42,side:kt})),this.shadow=an(t,t*.55),this.shadow.position.y=.05,this.holder.scale.y=Ro,this.group.add(this.shadow,this.holder)}setArt(e){const t=(e==null?void 0:e.key)??null;if(t!==this.key){if(this.key=t,!e){this.mesh&&(this.mesh.visible=!1);return}bM(e).then(i=>{!i||this.key!==t||(this.art=i,this.mat.map=i.tex,this.mat.needsUpdate=!0,this.mesh?this.mesh.geometry=i.geo:(this.mesh=new Je(i.geo,this.mat),this.mesh.frustumCulled=!1,this.holder.add(this.mesh)),this.mesh.visible=!0)})}}height(){return(this.art?this.art.h*.9:6)*Ro}}class GM{constructor(e,t,i){Te(this,"renderer");Te(this,"scene",new CS);Te(this,"camera",new yn(Ws.fov,4/3,1,900));Te(this,"hemi",new fM(14742271,7049038,1.5));Te(this,"sun",new mM(16774368,2.1));Te(this,"seaMat");Te(this,"sea");Te(this,"groundMesh",null);Te(this,"deco",new Be);Te(this,"buildings",new Be);Te(this,"farm",new Be);Te(this,"placed",new Be);Te(this,"actors",new Be);Te(this,"glows",new Be);Te(this,"fx",new Be);Te(this,"ticks",new Map);Te(this,"nightOnly",new Map);Te(this,"glowSpots",new Map);Te(this,"hitBoxes",new Map);Te(this,"bills",new Map);Te(this,"actorSpecs",new Map);Te(this,"placedBills",new Map);Te(this,"spriteMats",new Set);Te(this,"worldKey","");Te(this,"builtKey","");Te(this,"mail",null);Te(this,"chestM",null);Te(this,"walkRing",null);Te(this,"rain",null);Te(this,"snow",null);Te(this,"tod","day");Te(this,"weather","sunny");Te(this,"season",0);Te(this,"ui",{bubble:null,jump:null,unread:0,chest:!1,walking:!1,showWalk:!1});Te(this,"lastJumpKey",0);Te(this,"camTarget",new P);Te(this,"raf",0);Te(this,"t0",performance.now());Te(this,"last",performance.now());Te(this,"w",1);Te(this,"h",1);Te(this,"ro");Te(this,"labels",new Map);Te(this,"bubbleEl");Te(this,"emoteEls",new Map);Te(this,"mailBadge");Te(this,"disposed",!1);Te(this,"colliders",new Map);Te(this,"cullDirty",!0);Te(this,"onFirstFrame",null);Te(this,"canvas");Te(this,"loop",e=>{var u;if(this.disposed)return;this.raf=requestAnimationFrame(this.loop);const t=Math.min(.05,(e-this.last)/1e3);this.last=e;const i=this.now(),r=this.live;{const h=r.playerPos.current;let p=Rt(h),f=Mt(h),g=!1;for(const _ of this.colliders.values())for(const d of _){let m=p-d.x,v=f-d.z,x=Math.hypot(m,v);x>=d.r||(x<.001&&(m=0,v=1,x=1),p=d.x+m/x*d.r,f=d.z+v/x*d.r,g=!0)}if(g){r.playerPos.current=Ha(p,f);const _=(u=r.tapTarget)==null?void 0:u.current;if(_){const d=Rt(_),m=Mt(_);for(const v of this.colliders.values())for(const x of v)Math.hypot(d-x.x,m-x.z)<x.r+.5&&(r.tapTarget.current=null)}}}for(const[h,p]of this.bills){const f=h==="@player"?r.playerPos.current:h==="@monster"?r.monsterPos.current:r.friendPos.current[h];if(!f){p.group.visible=!1;continue}p.group.visible=!0;let g=ot,_=1,d=1;if(h==="@player"){if(this.ui.walking){const m=r.walkPhase.current;g+=Math.abs(Math.sin(m))*.55,d=1+Math.sin(m*2)*.03}else d=1+Math.sin(i*2.2)*.012;_=r.flip.current?-1:1}else d=1+Math.sin(i*2+h.length)*.015;if(p.jumpAt>=0){const m=(i-p.jumpAt)/.55;m>=1?p.jumpAt=-1:g+=Math.sin(m*Math.PI)*2}p.group.position.set(Rt(f),g,Mt(f)),p.shadow.position.y=ot-g+.05,p.holder.scale.set(_,d*Ro,1)}const s=r.playerPos.current,o=Rt(s),a=Mt(s),l=1-Math.exp(-t*4.5);this.camTarget.x+=(o-this.camTarget.x)*l,this.camTarget.z+=(a-this.camTarget.z)*l,this.camera.position.set(this.camTarget.x,ot+Ws.up,this.camTarget.z+Ws.back),this.camera.lookAt(this.camTarget.x,ot,this.camTarget.z+Ws.look),this.camera.updateMatrixWorld(),this.sun.target.position.set(this.camTarget.x,0,this.camTarget.z),this.sun.position.set(this.camTarget.x-40,90,this.camTarget.z+70);for(const h of this.ticks.values())for(const p of h)p(i,t);if(this.seaMat.uniforms.uTime.value=i,this.sea.position.set(Math.round(this.camTarget.x/5)*5,0,Math.round(this.camTarget.z/5)*5-180),this.rain){this.rain.position.set(this.camTarget.x,0,this.camTarget.z);const h=this.rain.geometry.attributes.position;for(let p=0;p<h.count;p+=2){let f=h.getY(p)-t*40;f<0&&(f+=50),h.setY(p,f),h.setY(p+1,f-2.2)}h.needsUpdate=!0}if(this.snow){this.snow.position.set(this.camTarget.x,0,this.camTarget.z);const h=this.snow.geometry.attributes.position;for(let p=0;p<h.count;p++){let f=h.getY(p)-t*4;f<0&&(f+=50),h.setY(p,f),h.setX(p,h.getX(p)+Math.sin(i+p)*t*.6)}h.needsUpdate=!0}this.cullDirty&&(this.scene.traverse(h=>{h.frustumCulled=!1}),this.cullDirty=!1);const c=this.bills.get("@player");if(c){const h=c.group.position,p=kr(new P(h.x,h.y+3.2,h.z),this.camera,this.w,this.h),f=this.renderer.getPixelRatio();Zd.value.set(p.x*f,(this.h-p.y)*f,p.z,this.h*.085*f)}if(this.renderer.render(this.scene,this.camera),this.updateOverlay(),this.onFirstFrame){const h=this.onFirstFrame;this.onFirstFrame=null,h()}});var a;this.host=e,this.overlay=t,this.live=i;const r=document.createElement("canvas");r.className="block h-full w-full",e.appendChild(r),this.canvas=r,this.renderer=new AS({canvas:r,antialias:!0,alpha:!0,powerPreference:"high-performance"});const s=(a=window.matchMedia)==null?void 0:a.call(window,"(pointer: coarse)").matches;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,s?1.5:2)),this.renderer.setClearColor(0,0),this.scene.fog=new Rc(13627135,120,260),this.sun.position.set(-40,90,70),this.scene.add(this.hemi,this.sun,this.sun.target),this.seaMat=XM(),this.sea=new Je(new It(760,700,152,140).rotateX(-Math.PI/2),this.seaMat),this.sea.position.set(Ue.cx,0,Ue.cz),this.sea.renderOrder=-1,this.scene.add(this.sea),this.buildGround(0),this.scene.add(this.deco,this.buildings,this.farm,this.placed,this.actors,this.glows,this.fx),this.bubbleEl=document.createElement("div"),this.bubbleEl.className="i3d-bubble",this.bubbleEl.style.display="none",this.mailBadge=document.createElement("div"),this.mailBadge.className="i3d-badge",this.mailBadge.style.display="none",t.append(this.bubbleEl,this.mailBadge);const o=this.live.playerPos.current;this.camTarget.set(Rt(o),ot,Mt(o)),this.ro=new ResizeObserver(()=>this.resize()),this.ro.observe(e),this.resize(),this.raf=requestAnimationFrame(this.loop),location.hostname==="localhost"&&(window.__island3d=this)}dispose(){this.disposed=!0,cancelAnimationFrame(this.raf),this.ro.disconnect(),this.renderer.dispose(),this.renderer.forceContextLoss(),this.canvas.remove(),this.overlay.innerHTML=""}resize(){const e=this.host.getBoundingClientRect();!e.width||!e.height||(this.w=e.width,this.h=e.height,this.renderer.setSize(e.width,e.height,!1),this.camera.aspect=e.width/e.height,this.camera.updateProjectionMatrix(),this.overlay.style.setProperty("--k",String(e.width/1e3)))}buildGround(e){this.groundMesh&&(this.scene.remove(this.groundMesh),this.groundMesh.geometry.dispose());const t=Ue.cx-Ue.srx-6,i=Ue.cx+Ue.srx+6,r=Ue.cz-Ue.srz-6,s=Ue.cz+Ue.srz+6,o=Math.round((i-t)/.9),a=Math.round((s-r)/.9),l=new It(i-t,s-r,o,a).rotateX(-Math.PI/2);l.translate((t+i)/2,0,(r+s)/2);const c=l.attributes.position,u=new Float32Array(c.count*3),h=e===12||e===1||e===2,p=new ze(h?15134962:7001215),f=new ze(h?13887196:5621356),g=new ze(h?13229263:4174940),_=new ze(13146722),d=new ze(16639626),m=new ze(15779946),v=new ze;for(let S=0;S<c.count;S++){const R=c.getX(S),b=c.getZ(S),A=zr(R,b);c.setY(S,A);const L=jd(R,b);if(L<=.972){const G=Math.sin(R*.19+Math.sin(b*.13)*2)*Math.cos(b*.21+Math.sin(R*.11))*.5+.5;v.copy(p).lerp(f,G>.55?1:G<.42?0:(G-.42)/.13),L>.9&&v.lerp(g,(L-.9)/.072*.6)}else if(A>.62)v.copy(_);else{const G=Kd(R,b);v.copy(d).lerp(m,Math.min(1,Math.max(0,(G-.94)/.05)))}u[S*3]=v.r,u[S*3+1]=v.g,u[S*3+2]=v.b}l.setAttribute("color",new Ht(u,3)),l.computeVertexNormals();const x=Dn(16777215,{vertexColors:!0},!1);this.groundMesh=new Je(l,x),this.scene.add(this.groundMesh)}setWorld(e){const t=[e.pier,e.bridge,e.moshi,e.expansion,e.season,e.halloween].join("|");if(t!==this.worldKey){const r=this.season!==e.season||!this.worldKey;this.worldKey=t,this.season=e.season,r&&this.buildGround(e.season),this.buildDeco(e),this.applySky()}const i=e.built.join(",");i!==this.builtKey&&(this.builtKey=i,this.buildBuildings(e.built))}clearGroup(e,t){e.clear(),this.ticks.delete(t),this.nightOnly.delete(t),this.glowSpots.delete(t),this.hitBoxes.delete(t)}addModel(e,t,i,r,s,o=zr(r,s)){if(i.obj.position.set(r,o,s),t.add(i.obj),i.tick&&(this.ticks.get(e)??this.ticks.set(e,[]).get(e)).push(i.tick),i.nightOnly&&(this.nightOnly.get(e)??this.nightOnly.set(e,[]).get(e)).push(...i.nightOnly),i.glows){const a=this.glowSpots.get(e)??this.glowSpots.set(e,[]).get(e);for(const l of i.glows)a.push({p:l.p.clone().add(i.obj.position),r:l.r})}}addHit(e,t,i){t.updateMatrixWorld(!0);const r=new Si,s=o=>{if(o.userData.noHit)return;const a=o;a.isMesh&&a.material!==Qd&&(a.geometry.boundingBox||a.geometry.computeBoundingBox(),r.union(a.geometry.boundingBox.clone().applyMatrix4(a.matrixWorld))),o.children.forEach(s)};s(t),!r.isEmpty()&&(this.hitBoxes.get(e)??this.hitBoxes.set(e,[]).get(e)).push({box:r,tap:i})}sprite(e,t,i,r,s,o){const a=bt(new on({map:t.tex,alphaTest:.4,side:kt}));this.spriteMats.add(a);const l=new Je(t.geo,a);return l.position.set(i,r,s),l.rotation.x=-.42,o.add(l),l}buildBuildings(e){this.clearGroup(this.buildings,"bld");const t=[],i={bd_house:[[0,-4,6]],bd_light:[[0,-3,3.6]],bd_school:[[-4,-4.5,5],[4,-4.5,5]],bd_wheel:[[0,-2,4]],bd_observ:[[0,-4,5.4]],bd_moon:[[0,-1.8,4.2]]};for(const r of e){const s=Kc[r];if(!s||s.area)continue;const o=DM(r);if(!o)continue;this.addModel("bld",this.buildings,o,Rt(s),Mt(s));const a=r==="bd_house"?jo.mainToHouse:r==="bd_school"?jo.mainToSchool:{x:s.x,y:s.y+.05};this.addHit("bld",o.obj,a),nf(o.obj);for(const[l,c,u]of i[r]??[])t.push({x:Rt(s)+l,z:Mt(s)+c,r:u})}this.colliders.set("bld",t),this.applySky()}buildDeco(e){this.clearGroup(this.deco,"deco");const t=Xa(20260922),i=e.season,r=[];for(const[v,x]of Object.entries(Kc)){if(x.area)continue;const S=v==="bd_school"?13:v==="bd_wheel"?10:9;r.push({x:Rt(x),z:Mt(x)-3,r:S})}for(const v of Object.values(jo))r.push({x:Rt(v),z:Mt(v),r:6});r.push({x:Rt(ci),z:Mt(ci),r:5},{x:Rt(li),z:Mt(li),r:5});for(const[v,x]of Zc)r.push({x:v*Pt,z:x*Pt,r:4.5});const s=Jc,o=(v,x,S,R,b,A,L)=>v>S-L&&v<R+L&&x>b-L&&x<A+L,a=(v,x,S)=>o(v,x,s.x*Pt,(s.x+s.w)*Pt,s.y*Pt,(s.y+s.h)*Pt,S+2)||o(v,x,ei.x0*100,ei.x1*100,ei.y0*75,ei.y1*75,S+1)||Math.abs(v-qa*100)<6+S&&x<0||v>118&&Math.abs(x-45)<6+S?!1:r.every(R=>Math.hypot(v-R.x,x-R.z)>R.r+S),l=[],c=[],u=(v,x)=>{l.push(v),c.push({x:v.x,z:v.z,r:x})},h=(v,x,S)=>c.every(R=>Math.hypot(v-R.x,x-R.z)>R.r+S),p=46;for(let v=0;v<p;v++){const x=v/p*Math.PI*2+.05,S=.945+v%3*.012,R=Ue.cx+Math.cos(x)*Ue.grx*S,b=Ue.cz+Math.sin(x)*Ue.grz*S,A=Math.sin(x)>.45;if(!a(R,b,3)||!h(R,b,3))continue;const L=A?"bush":["round","pine","round","bush"][v%4];u({x:R,y:ot,z:b,kind:L,s:A?.9:.85+t()*.3},3.2)}for(let v=0;v<400&&l.length<78;v++){const x=t()*Math.PI*2,S=.5+t()*.38,R=Ue.cx+Math.cos(x)*Ue.grx*S,b=Ue.cz+Math.sin(x)*Ue.grz*S;b>70&&Math.abs(R-50)<30||!a(R,b,3.5)||!h(R,b,4.5)||u({x:R,y:ot,z:b,kind:t()<.55?"round":t()<.6?"pine":"bush",s:.85+t()*.35},4)}for(let v=0;v<9;v++){const x=v/9*Math.PI*2+.4,S=Ue.cx+Math.cos(x)*Ue.srx*.955,R=Ue.cz+Math.sin(x)*Ue.srz*.955;!a(S,R,2)||Math.sin(x)>.5&&v%2||u({x:S,y:zr(S,R),z:R,kind:"palm",s:.8+t()*.25},3)}const f={x:Rt(cr),z:Mt(cr)+1};for(const[v,x,S]of[[-6,1,.8],[5,2,.75],[-2,-2,1],[3,-3,.95],[0,3,.85],[-5,-3,.7]])l.push({x:f.x+v,y:.9,z:f.z+x,kind:"pine",s:S});this.addModel("deco",this.deco,of(l,i),0,0,0),this.colliders.set("trees",l.filter(v=>v.kind==="round"||v.kind==="pine").map(v=>({x:v.x,z:v.z,r:1.3*v.s})));const g=[],_=[16020150,16436245,10980346,16777215,16478597];for(let v=0;v<300&&g.length<150;v++){const x=t()*Math.PI*2,S=Math.sqrt(t())*.93,R=Ue.cx+Math.cos(x)*Ue.grx*S,b=Ue.cz+Math.sin(x)*Ue.grz*S;if(!a(R,b,1.5)||!h(R,b,1))continue;const A=_[Math.floor(t()*_.length)];for(let L=0;L<4;L++)g.push({x:R+(t()-.5)*2.4,y:ot,z:b+(t()-.5)*1.6,c:A})}i!==12&&i!==1&&i!==2&&this.deco.add(BM(g));const d=[];for(let v=0;v<600&&d.length<260;v++){const x=t()*Math.PI*2,S=Math.sqrt(t())*.95,R=Ue.cx+Math.cos(x)*Ue.grx*S,b=Ue.cz+Math.sin(x)*Ue.grz*S;a(R,b,.5)&&d.push({x:R,y:ot,z:b,s:.7+t()*.5})}this.deco.add(zM(d,i===12||i===1||i===2));for(let v=0;v<12;v++){const x=t()*Math.PI*2,S=v%2===0,R=S?.96:.9,b=Ue.cx+Math.cos(x)*(S?Ue.srx:Ue.grx)*R,A=Ue.cz+Math.sin(x)*(S?Ue.srz:Ue.grz)*R;if(!a(b,A,2)||!h(b,A,2))continue;const L=OM(.6+t()*.6,S?14078929:11051678);L.position.set(b,zr(b,A),A),this.deco.add(L)}this.buildPitch(),this.buildFarmBase(),e.pier&&this.buildPier(),e.bridge&&this.buildBridge(),this.buildForestIslet(),e.moshi&&this.buildMoshi(),e.expansion>=2&&this.buildSchoolIslet(),this.buildDream(),this.mail=UM(),this.addModel("deco",this.deco,this.mail,Rt(ci),Mt(ci)),this.addHit("deco",this.mail.obj,{x:ci.x,y:ci.y-.05}),this.mail.setFlag(this.ui.unread>0),this.chestM=NM(),this.addModel("deco",this.deco,this.chestM,Rt(li),Mt(li)),this.addHit("deco",this.chestM.obj,{x:li.x,y:li.y-.03}),this.sprite("deco",$a("✨",2.4),2.6,3.2,0,this.chestM.obj),this.chestM.obj.visible=this.ui.chest;const m=Zc.map(([v,x])=>({x:v*Pt,z:x*Pt}));if(i===10){for(const v of m.slice(4))this.addModel("deco",this.deco,af(e.halloween),v.x,v.z);if(e.halloween)for(const[v,x]of[[430,330],[690,590],[870,470]])this.addModel("deco",this.deco,af(!0),v*Pt,x*Pt)}else if(i===11){for(const S of m.slice(0,3)){const R=VM();R.position.set(S.x,ot,S.z),this.deco.add(R)}const v=[],x=new Nc(.55,5).rotateX(-Math.PI/2);for(let S=0;S<70;S++){const R=t()*Math.PI*2,b=Math.sqrt(t())*.9,A=Ue.cx+Math.cos(R)*Ue.grx*b,L=Ue.cz+Math.sin(R)*Ue.grz*b,G=new Je(x,Q([14427686,16347926,15381256][S%3]));G.position.set(A,ot+.03,L),G.rotation.y=t()*6,v.push(G)}this.deco.add(...v)}else i===12?this.addModel("deco",this.deco,kM(),86,56):i===1&&this.addModel("deco",this.deco,HM(),86,56);nf(this.deco)}buildPitch(){const e=Jc,t=e.x*Pt,i=e.y*Pt,r=e.w*Pt,s=e.h*Pt,o=document.createElement("canvas");o.width=600,o.height=340;const a=o.getContext("2d");for(let g=0;g<8;g++)a.fillStyle=g%2?"#3fae5c":"#36a052",a.fillRect(g*75,0,76,340);a.strokeStyle="#fff",a.lineWidth=6,a.strokeRect(6,6,588,328),a.beginPath(),a.moveTo(300,6),a.lineTo(300,334),a.stroke(),a.beginPath(),a.arc(300,170,48,0,Math.PI*2),a.stroke();for(const g of[0,1]){const _=g?594:6;a.strokeRect(g?_-88:_,78,88,184),a.strokeRect(g?_-32:_,122,32,96)}const l=new qn(o);l.colorSpace=Ot,l.anisotropy=8;const c=new Je(new It(r+2,s+2,24,14).rotateX(-Math.PI/2),bt(new Mr({map:l})));c.position.set(t+r/2,ot+.04,i+s/2),this.deco.add(c);const u=Q(16777215),h=bt(new on({color:16777215,transparent:!0,opacity:.35,side:kt,depthWrite:!1}));for(const g of[-1,1]){const _=g<0?t-.4:t+r+.4,d=i+s/2,m=6,v=2.6,x=1.8,S=new Be;S.position.set(_,ot,d);for(const A of[-m/2,m/2])S.add(ie(new Ye(.16,.16,v,8),u,0,v/2,A,.06));S.add(ie(new Ye(.16,.16,m,8).rotateX(Math.PI/2),u,0,v,0,.06));const R=new Je(new It(m,v).rotateY(Math.PI/2),h);R.position.set(g*x,v/2,0);const b=new Je(new It(x,m).rotateX(-Math.PI/2),h);b.position.set(g*x/2,v,0),S.add(R,b),this.deco.add(S)}for(const[g,_,d]of[[t,i,16436245],[t+r,i,15680580],[t,i+s,15680580],[t+r,i+s,16436245]]){const m=new Be;m.position.set(g,ot,_),m.add(ie(new Ye(.08,.08,2.4,5),Q(16317180),0,1.2,0,!1)),m.add(ie(new It(1.2,.8).translate(.6,0,0),Dn(d,{side:kt}),0,2,0,!1)),this.deco.add(m)}const p=(()=>{const g=document.createElement("canvas");g.width=128,g.height=64;const _=g.getContext("2d");_.fillStyle="#fff",_.fillRect(0,0,128,64),_.fillStyle="#1f2937";for(const[m,v]of[[20,20],[60,40],[100,18],[40,52],[84,54],[116,44]])_.beginPath(),_.arc(m,v,7,0,Math.PI*2),_.fill();const d=new qn(g);return d.colorSpace=Ot,d})(),f=ie(new Lt(.75,16,12),bt(new Mr({map:p})),t+r/2+5.2,ot+.75,i+s/2+2.2,.06);this.deco.add(f),this.sprite("deco",Gs("⚽ サッカー"),t+2.8,ot+2.6,i-.8,this.deco),this.deco.add(ie(new Ye(.14,.14,3,6),Q(7877903),t+2.8,ot+1.5,i-.9,!1))}buildFarmBase(){const e=ei.x0*100,t=ei.x1*100,i=ei.y0*75+1,r=ei.y1*75-1,s=Q(11817737),o=[];for(let u=e;u<=t+.01;u+=(t-e)/8)o.push([u,i]),o.push([u,r]);for(let u=i+(r-i)/6;u<r-.01;u+=(r-i)/6)o.push([e,u]),o.push([t,u]);for(const[u,h]of o)Math.abs(h-r)<.01&&Math.abs(u-(e+t)/2)<3.5||this.deco.add(ie(Qe(.4,1.6,.4),s,u,ot+.8,h,.06));const a=(u,h,p,f)=>{const g=Math.hypot(p-u,f-h),_=ie(Qe(g,.22,.22),s,(u+p)/2,ot+1.2,(h+f)/2,.05);_.rotation.y=-Math.atan2(f-h,p-u),this.deco.add(_)},l=(e+t)/2;a(e,i,t,i),a(e,i,e,r),a(t,i,t,r),a(e,r,l-3.5,r),a(l+3.5,r,t,r),this.sprite("deco",Gs("はたけ",{size:.8}),t+2.6,ot+2.2,Mt(cs)+1,this.deco),this.deco.add(ie(new Ye(.14,.14,2.4,6),Q(9584654),t+2.6,ot+1.2,Mt(cs)+.9,!1));const c=new Be;c.position.set(l,ot,(i+r)/2),c.add(new Je(Qe(t-e,.5,r-i))),c.position.y=ot+1,this.addHit("deco",c,{x:cs.x,y:cs.y})}buildPier(){const e=qa*100,t=Ue.cz-Ue.grz*Math.sqrt(1-((e-Ue.cx)/Ue.grx)**2)+1.5,i=t-19,r=new Be,s=Q(11817737),o=Q(7877903);for(let h=t;h>i;h-=1.3)r.add(ie(Qe(3.8,.35,1.1),s,e,1.05,h,.05));for(let h=t-2;h>i;h-=4.5)for(const p of[-1,1])r.add(ie(new Ye(.28,.28,3.6,8),o,e+p*1.9,-.4,h,.06));this.deco.add(r);const a=new Be;a.userData.dyn=!0,a.position.set(e+6.5,.1,i+4);const l=ie(new Ye(1.8,1.2,1.4,16,1,!1).scale(1,1,2.2),Q(16281969),0,.3,0,.1);a.add(l),a.add(ie(new Ye(.1,.1,5,6),Q(4988309),0,3.4,0,!1));const c=new ko;c.moveTo(0,0),c.lineTo(0,3.4),c.lineTo(2.4,0),c.closePath(),a.add(ie(new zc(c),Dn(16777215,{side:kt}),.12,1.6,0,!1)),this.deco.add(a),(this.ticks.get("deco")??this.ticks.set("deco",[]).get("deco")).push(h=>{a.position.y=.1+Math.sin(h*1.6)*.18,a.rotation.z=Math.sin(h*1.3)*.05});const u=new Je(Qe(4,2,t-i));u.position.set(e,1.5,(t+i)/2-3),this.addHit("deco",u,{x:qa,y:i/75})}buildBridge(){const e=new Be,t=Q(11817737),i=Q(9584654),r=45.1;for(let s=133;s<190;s+=1.2)e.add(ie(Qe(1,.35,3.4),t,s,1,r,.05));for(const s of[-1,1]){e.add(ie(Qe(57,.25,.25),i,161.5,2,r+s*1.8,.05));for(let o=134;o<190;o+=4)e.add(ie(Qe(.3,1.4,.3),i,o,1.5,r+s*1.8,.05));for(let o=140;o<190;o+=9)e.add(ie(new Ye(.3,.3,4,8),Q(7877903),o,-1,r+s*1.8,!1))}this.deco.add(e),this.sprite("deco",$a("🌸",3),142,2.2,42.6,this.deco)}islet(e,t,i,r){const s=new Be;s.position.set(e,0,t);const o=new Je(new Ye(1,1.25,1.4,32),Q(16639626));o.scale.set(i,1,r),o.position.y=-.3;const a=new Je(new Ye(1,1.06,.8,32),Q(4906624));return a.scale.set(i*.78,1,r*.72),a.position.y=.5,s.add(o,a),s}buildForestIslet(){const e=Rt(cr),t=Mt(cr)+1,i=this.islet(e,t,12,8.5);this.deco.add(i),this.sprite("deco",Gs("まよいの森",{fg:"#14532d",size:.8}),e+7,1.6,t+5,this.deco),this.deco.add(ie(new Ye(.12,.12,2,6),Q(7877903),e+7,1.6,t+4.9,!1)),this.sprite("deco",$a("✨",3),e-8,4,t-2,this.deco)}buildMoshi(){const e=Rt(lo),t=Mt(lo),i=this.islet(0,0,9,6.5),r=new Be;r.userData.dyn=!0,r.position.set(e,0,t),r.add(i),r.add(ie(Qe(5.6,3.8,.4),Q(417606),-1.5,3.4,0));const s=document.createElement("canvas");s.width=128,s.height=80;const o=s.getContext("2d");o.fillStyle="#ecfdf5",o.font="900 44px sans-serif",o.textAlign="center",o.fillText("80%",64,56);const a=new qn(s);a.colorSpace=Ot;const l=new Je(new It(4.4,2.8),bt(new on({map:a,transparent:!0})));l.position.set(-1.5,3.4,.22),r.add(l);for(const c of[-1,1])r.add(ie(Qe(.3,1.8,.3),Q(7877903),-1.5+c*2.2,1.4,0,!1));r.add(ie(new Ye(.15,.15,6,6),Q(7877903),3.6,3.4,0,!1)),r.add(ie(new It(3,1.8).translate(1.5,0,0),Dn(16007006,{side:kt}),3.7,5.6,0,!1)),this.deco.add(r),this.sprite("deco",Gs("もしの しま",{size:.8}),e,.6,t+7,this.deco),(this.ticks.get("deco")??this.ticks.set("deco",[]).get("deco")).push(c=>{r.position.y=Math.sin(c*1.2)*.35})}buildSchoolIslet(){this.deco.add(this.islet(134,-25,8.6,6));const i=of([{x:135,y:.9,z:-25,kind:"palm",s:.9}],this.season);this.deco.add(i.obj);const r=Q(14251782);for(let s=0;s<=14;s++){const o=s/14,a=(1-o)*(1-o)*121+2*(1-o)*o*128+o*o*129,l=(1-o)*(1-o)*-4+2*(1-o)*o*-10+o*o*-19.5;this.deco.add(ie(Qe(2.4,.3,.9),r,a,.9-Math.sin(o*Math.PI)*-.6,l,.05))}}buildDream(){const e=bt(new on({color:9741240,transparent:!0,opacity:.55,depthWrite:!1})),t=new Je(new Lt(1,20,10,0,Math.PI*2,0,Math.PI/2),e);t.scale.set(26,9,10),t.position.set(70,-.5,-150),this.deco.add(t);const i=new Je(new Lt(.9,8,6),bt(new on({color:16710083})));i.position.set(70,8,-146),this.deco.add(i)}setFarm(e){this.farm.clear();for(const t of e){const i=ap(t.i),r=Rt(i),s=Mt(i),o=ie(new Ye(3,3.3,.6,20).scale(1,1,.62),Q(t.wet?5911056:9584654),r,ot+.3,s,.08);if(this.farm.add(o),t.paddy){const a=new Je(new Ye(2.6,2.6,.1,20).scale(1,1,.6),Dn(8246268,{transparent:!0,opacity:.85}));a.position.set(r,ot+.62,s),this.farm.add(a)}else for(const a of[-.6,.6])this.farm.add(ie(Qe(4.6,.18,.3),Q(7877903),r,ot+.62,s+a,!1));if(t.art){const a=new ja("farm"+t.i,0);a.shadow.visible=!1,a.setArt({...t.art,unit:Ya*1.15}),a.group.position.set(r,ot+.5,s+.3),this.spriteMats.add(a.mat),this.farm.add(a.group)}}this.applySky()}setPlaced(e){const t=new Set(e.map(r=>r.uid));for(const[r,s]of this.placedBills)t.has(r)||(this.placed.remove(s.group),this.placedBills.delete(r));const i=[];for(const r of e){let s=this.placedBills.get(r.uid);s||(s=new ja(r.uid,2.4),this.placedBills.set(r.uid,s),this.spriteMats.add(s.mat),this.placed.add(s.group)),s.setArt({...r.art,unit:Ya});const o=r.x*100,a=r.y*75;s.group.position.set(o,ot,a),r.lamp&&i.push({p:new P(o,ot+4.5,a+.5),r:4})}this.glowSpots.set("placed",i),this.applySky()}setActors(e){var i,r;const t=new Set(e.map(s=>s.id));for(const[s,o]of this.bills)t.has(s)||(this.actors.remove(o.group),this.bills.delete(s),this.spriteMats.delete(o.mat),(i=this.labels.get(s))==null||i.remove(),this.labels.delete(s),(r=this.emoteEls.get(s))==null||r.remove(),this.emoteEls.delete(s));for(const s of e){let o=this.bills.get(s.id);o||(o=new ja(s.id,s.id==="@player"?1.9:2.3),this.bills.set(s.id,o),this.spriteMats.add(o.mat),this.actors.add(o.group)),o.setArt(s.art?{...s.art,unit:s.art.unit*Ya}:null),this.actorSpecs.set(s.id,s);let a=this.labels.get(s.id);s.label?(a||(a=document.createElement("div"),a.className="i3d-label",this.overlay.appendChild(a),this.labels.set(s.id,a)),a.textContent!==s.label&&(a.textContent=s.label)):a&&(a.remove(),this.labels.delete(s.id));let l=this.emoteEls.get(s.id);s.emote?(l||(l=document.createElement("div"),l.className="i3d-emote",this.overlay.appendChild(l),this.emoteEls.set(s.id,l)),l.textContent=s.emote):l&&(l.remove(),this.emoteEls.delete(s.id))}this.applySky()}setUI(e){var i,r;const t=(i=this.ui.bubble)==null?void 0:i.key;if(this.ui=e,e.jump&&e.jump.key!==this.lastJumpKey){this.lastJumpKey=e.jump.key;const s=this.bills.get(e.jump.id);s&&(s.jumpAt=this.now())}if((r=this.mail)==null||r.setFlag(e.unread>0),this.chestM&&(this.chestM.obj.visible=e.chest),this.mailBadge.style.display=e.unread>0?"":"none",this.mailBadge.textContent=String(e.unread),e.bubble){if(e.bubble.key!==t){this.bubbleEl.innerHTML="";const s=document.createElement("div");if(s.className="i3d-bubble-in bubble-pop",s.textContent=e.bubble.text,this.bubbleEl.appendChild(s),e.bubble.heart){const o=document.createElement("i");o.textContent="💗",o.className="i3d-heart heart-float",this.bubbleEl.appendChild(o)}}this.bubbleEl.style.display=""}else this.bubbleEl.style.display="none";this.setWalkRing(e.showWalk)}setWalkRing(e){if(e&&!this.walkRing){const t=lp,i=[];for(let o=0;o<=160;o++){const a=o/160*Math.PI*2;i.push(new P((t.cx+Math.cos(a)*t.rx)*100,ot+.15,(t.cy+Math.sin(a)*t.ry)*75))}const r=new Tt().setFromPoints(i),s=new zd(r,bt(new hM({color:16777215,dashSize:2,gapSize:1.6})));s.computeLineDistances(),this.walkRing=s,this.scene.add(s)}else!e&&this.walkRing&&(this.scene.remove(this.walkRing),this.walkRing=null)}setSky(e,t){this.tod=e,this.weather=t,this.applySky()}applySky(){this.cullDirty=!0;const e=this.tod==="night",t=this.tod==="evening",i=this.weather==="cloudy"||this.weather==="rain",r=i?.78:1;e?(this.hemi.color.set(8425680),this.hemi.groundColor.set(1976912),this.hemi.intensity=.95,this.sun.color.set(11057407),this.sun.intensity=.7):t?(this.hemi.color.set(16765616),this.hemi.groundColor.set(7035470),this.hemi.intensity=1.35*r,this.sun.color.set(16756848),this.sun.intensity=1.7*r):(this.hemi.color.set(14742271),this.hemi.groundColor.set(7049038),this.hemi.intensity=1.5*r,this.sun.color.set(16774368),this.sun.intensity=2.1*r);const s=e?2568299:t?16173480:i?13226973:13627135;this.scene.fog.color.set(s);const o=e?10135260:t?16769224:i?15001838:16777215;for(const a of this.spriteMats)a.color.set(o);Hc.emissiveIntensity=e?1.1:t?.45:0,Jd.emissiveIntensity=e?1.2:.25,this.seaMat.uniforms.uTint.value.set(e?5991080:t?16767424:i?14081510:16777215),this.seaMat.uniforms.uFog.value.set(s);for(const a of this.nightOnly.values())for(const l of a)l.visible=e||t,l.traverse(c=>{const u=c.material;u&&"opacity"in u&&(u.opacity=e?.2:.08)});if(this.glows.clear(),e||t)for(const a of this.glowSpots.values())for(const l of a){const c=new Je(new It(l.r*2,l.r*2),MM());c.position.copy(l.p),c.rotation.x=-.65,c.material.opacity=e?.9:.4,this.glows.add(c)}this.setPrecip()}setPrecip(){const e=this.weather==="rain",i=(this.season===12||this.season===1||this.season===2)&&this.weather==="cloudy";if(e&&!this.rain){const s=new Float32Array(3e3),o=Xa(7);for(let l=0;l<500;l++){const c=(o()-.5)*120,u=o()*50,h=(o()-.5)*100;s.set([c,u,h,c-.3,u-2.2,h],l*6)}const a=new Tt;a.setAttribute("position",new Ht(s,3)),this.rain=new PS(a,bt(new Pc({color:12573694,transparent:!0,opacity:.7}))),this.rain.frustumCulled=!1,this.fx.add(this.rain)}else!e&&this.rain&&(this.fx.remove(this.rain),this.rain=null);if(i&&!this.snow){const s=new Float32Array(1800),o=Xa(9);for(let l=0;l<600;l++)s.set([(o()-.5)*120,o()*50,(o()-.5)*100],l*3);const a=new Tt;a.setAttribute("position",new Ht(s,3)),this.snow=new LS(a,bt(new kd({color:16777215,size:.6,transparent:!0,opacity:.9}))),this.snow.frustumCulled=!1,this.fx.add(this.snow)}else!i&&this.snow&&(this.fx.remove(this.snow),this.snow=null)}pick(e,t){var c;const i=this.canvas.getBoundingClientRect(),r=e-i.left,s=t-i.top;let o=null;const a=new P;for(const[u,h]of this.bills){if(u==="@player"||!((c=h.mesh)!=null&&c.visible)||!h.art)continue;const p=h.group.position,f=kr(a.set(p.x-h.art.w*.4,p.y,p.z),this.camera,this.w,this.h),g=kr(a.set(p.x+h.art.w*.4,p.y+h.art.h*.95*Ro,p.z),this.camera,this.w,this.h);if(r>=Math.min(f.x,g.x)&&r<=Math.max(f.x,g.x)&&s>=Math.min(f.y,g.y)&&s<=Math.max(f.y,g.y)){const _=this.actorSpecs.get(u),d=Ha(p.x,p.z),m={x:d.x,y:d.y+((_==null?void 0:_.tapDy)??0)};(!o||f.z<o.d)&&(o={d:f.z,tap:m})}}if(o)return o.tap;for(const u of this.hitBoxes.values())for(const h of u){if(!this.boxVisible(h))continue;const p=WM(h.box).map(_=>kr(_,this.camera,this.w,this.h)),f=p.map(_=>_.x),g=p.map(_=>_.y);if(r>=Math.min(...f)&&r<=Math.max(...f)&&s>=Math.min(...g)&&s<=Math.max(...g)){const _=Math.min(...p.map(d=>d.z));(!o||_<o.d)&&(o={d:_,tap:h.tap})}}if(o)return o.tap;const l=this.groundAt(r,s);return l?Ha(l.x,l.z):null}boxVisible(e){return this.chestM&&e.tap.x===li.x&&e.tap.y===li.y-.03?this.ui.chest:!0}groundAt(e,t){const r=new P(e/this.w*2-1,-(t/this.h)*2+1,.5).applyMatrix4(this.camera.projectionMatrixInverse).normalize(),s=Vo.value,o=new P,a=u=>{const h=r.x*u,p=r.z*u,f=r.y*u+s*p*p;return o.set(h,f,p).applyMatrix4(this.camera.matrixWorld),o.y-Math.max(zr(o.x,o.z),0)};let l=1,c=a(l);for(let u=2;u<500;u+=1.5){const h=a(u);if(c>0&&h<=0){let p=l,f=u;for(let g=0;g<14;g++){const _=(p+f)/2;a(_)>0?p=_:f=_}return a(f),o.clone()}l=u,c=h}return null}now(){return(performance.now()-this.t0)/1e3}updateOverlay(){const e=new P,t=(s,o,a,l,c=!0)=>{const u=kr(e.set(o,a,l),this.camera,this.w,this.h),h=c&&u.z>0&&u.x>-80&&u.x<this.w+80&&u.y>-60&&u.y<this.h+60;return s.style.visibility=h?"visible":"hidden",h&&(s.style.transform=`translate3d(${u.x.toFixed(1)}px, ${u.y.toFixed(1)}px, 0)`),u},i=s=>{const o=s.height();return{x:s.group.position.x,y:s.group.position.y+o,z:s.group.position.z}};for(const[s,o]of this.labels){const a=this.bills.get(s);if(!a||!a.group.visible){o.style.visibility="hidden";continue}const l=i(a);t(o,l.x,l.y+.4,l.z)}for(const[s,o]of this.emoteEls){const a=this.bills.get(s);if(!a)continue;const l=i(a);t(o,l.x+2.4,l.y-.6,l.z)}const r=this.ui.bubble;if(r){const s=this.bills.get(r.id);if(s){const o=i(s),a=t(this.bubbleEl,o.x,o.y+2.6,o.z),l=this.bubbleEl.offsetWidth/2,c=Math.max(l+6-a.x,Math.min(0,this.w-l-6-a.x));this.bubbleEl.style.setProperty("--shift",`${c}px`)}else this.bubbleEl.style.visibility="hidden"}this.ui.unread>0&&t(this.mailBadge,Rt(ci),ot+8.2,Mt(ci))}}function WM(n){const e=[];for(const t of[n.min.x,n.max.x])for(const i of[n.min.y,n.max.y])for(const r of[n.min.z,n.max.z])e.push(new P(t,i,r));return e}function XM(){return new Jn({uniforms:{uTime:{value:0},uCurve:Vo,uTint:{value:new ze(16777215)},uFog:{value:new ze(13627135)},uC:{value:new se(Ue.cx,Ue.cz)},uR:{value:new se(Ue.srx,Ue.srz)},uIslets:{value:[new gt(Rt(cr),Mt(cr)+1,13.5,9.5),new gt(Rt(lo),Mt(lo),10,7.2),new gt(134,-25,9.5,6.8)]}},vertexShader:`
      uniform float uCurve;
      varying vec3 vW;
      varying float vDepth;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vW = w.xyz;
        vec4 mvPosition = viewMatrix * w;
        mvPosition.y -= uCurve * mvPosition.z * mvPosition.z;
        vDepth = -mvPosition.z;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,fragmentShader:`
      uniform float uTime;
      uniform vec3 uTint;
      uniform vec3 uFog;
      uniform vec2 uC;
      uniform vec2 uR;
      uniform vec4 uIslets[3];
      varying vec3 vW;
      varying float vDepth;
      void main() {
        float es = length((vW.xz - uC) / uR);
        float e2 = es;
        for (int i = 0; i < 3; i++) {
          float ei = length((vW.xz - uIslets[i].xy) / uIslets[i].zw);
          e2 = min(e2, ei);
        }
        vec3 shallow = vec3(0.37, 0.86, 0.88);
        vec3 mid = vec3(0.16, 0.62, 0.86);
        vec3 deep = vec3(0.10, 0.40, 0.74);
        vec3 col = mix(shallow, mid, smoothstep(0.98, 1.12, e2));
        col = mix(col, deep, smoothstep(1.15, 1.9, es));
        // きらきら
        float sp = sin(vW.x * 0.35 + uTime * 0.9) * sin(vW.z * 0.42 - uTime * 0.7);
        col += vec3(0.06) * smoothstep(0.75, 1.0, sp);
        // ふちの なみ
        float wv = 0.985 + 0.01 * sin(uTime * 1.3);
        float foam = smoothstep(0.012, 0.0, abs(e2 - wv)) + 0.55 * smoothstep(0.008, 0.0, abs(e2 - wv - 0.035 - 0.012 * sin(uTime * 1.3 + 1.5)));
        col = mix(col, vec3(1.0), clamp(foam, 0.0, 1.0) * 0.85);
        col *= uTint;
        float f = smoothstep(120.0, 260.0, vDepth);
        col = mix(col, uFog, f);
        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }
    `})}const $M={fw_silk:{y:-44,size:34},fw_flower:{y:-42,size:28},fw_glass:{y:-24,size:26},fw_scarf:{y:-4,size:28},fw_pumpkin:{y:-44,size:30},fw_leaf:{y:-40,size:24},fw_gold:{y:-44,size:30},fw_moon:{y:-46,size:28},fw_acorn:{y:-42,size:26},fw_santa:{y:-44,size:32},fw_saturn:{y:-44,size:28}},lf=108;function cf(n){return ol(Gn.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"400",height:"400",viewBox:"-200 -300 400 400",children:n}))}function uf(n,e,t,i,r,s,o){const a=n==null?void 0:n[e];if(!a)return null;let l;try{l=a(t|0,i,lf,{silhouette:s,stars:r})}catch{return null}const c=200,u=lf/c,h=c-20/u;return{key:`c:${e}:${t}:${i.toFixed(2)}:${r}:${s?1:0}:${o?o.ch:""}`,svg:l,unit:u,anchorX:100,extra:o?(p,f,g)=>{const[_,d]=f(100,h+o.y/u);p.font=`${o.size/u*g}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`,p.textAlign="center",p.textBaseline="middle",p.fillText(o.ch,_,d)}:void 0}}const jM=Yt.forwardRef(function(e,t){const i=Yt.useRef(null),r=Yt.useRef(null),s=Yt.useRef(null),o=Yt.useRef(e.onReady);o.current=e.onReady,Yt.useImperativeHandle(t,()=>({pick:(X,V)=>{var re;return((re=s.current)==null?void 0:re.pick(X,V))??null}}),[]),Yt.useEffect(()=>{const X=new GM(i.current,r.current,e.live);return X.onFirstFrame=()=>o.current(),s.current=X,()=>{X.dispose(),s.current=null}},[]);const{built:a,pier:l,bridge:c,moshi:u,expansion:h,season:p,halloween:f}=e,g=a.join(",");Yt.useEffect(()=>{var X;(X=s.current)==null||X.setWorld({built:a,pier:l,bridge:c,moshi:u,expansion:h,season:p,halloween:f})},[g,l,c,u,h,p,f]),Yt.useEffect(()=>{var X;(X=s.current)==null||X.setSky(e.tod,e.weather)},[e.tod,e.weather]);const{plots:_,stages:d,today:m}=e.farm;Yt.useEffect(()=>{var re;const X=cp(),V=_.map((oe,le)=>{var Xe;return{i:le,wet:!!oe&&oe.watered===m,paddy:!!((Xe=hp(oe))!=null&&Xe.paddy),art:oe?{key:`farm:${le}:${oe.seed}:${d[le]}:${oe.watered===m}:${oe.box?1:0}:${X}`,svg:cf(Gn.jsx(up,{p:oe,stage:d[le],today:m,hour:X})),unit:1,anchorX:0}:null}});(re=s.current)==null||re.setFarm(V)},[_,d,m]);const{placed:v,photoFriends:x}=e;Yt.useEffect(()=>{var V;const X=v.map(re=>{const oe=fp(re.id),le=oe?Gn.jsx(dp,{month:oe,friends:x}):Gn.jsx(pp,{id:re.id,scale:1.9});return{uid:re.uid,x:re.x,y:re.y,lamp:re.id==="fn_lamp"||re.id==="fn_fire",art:{key:`fn:${re.id}:${oe?x.length:""}`,svg:cf(le),unit:1,anchorX:0}}});(V=s.current)==null||V.setPlaced(X)},[v,x]);const{chars:S,player:R,monster:b,friends:A}=e,L=JSON.stringify([!!S,R,b,A.map(X=>[X.f.id,X.f.char,X.f.level,X.f.fill,X.f.stars,X.label,X.wear,X.costume,X.emote])]);Yt.useEffect(()=>{var re,oe;const X=[];R.who&&X.push({id:"@player",art:{key:`kid:${R.who}:${R.hat}:${R.ribbon}:${R.magnifier}`,svg:ol(Gn.jsx(mp,{who:R.who,size:104,hat:R.hat,ribbon:R.ribbon,magnifier:R.magnifier})),unit:104/100,anchorX:50},tapDy:0});const V=b.charKey?uf(S,b.charKey,b.level,b.fill,b.stars,b.silhouette,null):{key:"egg",svg:ol(Gn.jsx(gp,{size:96,wobble:!1})),unit:96/100,anchorX:50};V&&b.charKey&&(V.unit=112/200),X.push({id:"@monster",art:V,tapDy:-.07,emote:b.emote});for(const{f:le,label:Xe,wear:et,costume:$,emote:ee}of A){const ve=et?$M[et]:null,he=ve&&le.level>1?{ch:((re=_p[et])==null?void 0:re.emoji)??"",y:ve.y,size:ve.size}:$?{ch:$,y:-46,size:30}:null;X.push({id:le.id,art:uf(S,le.char,le.level,le.fill,le.stars,!1,he),label:Xe,tapDy:-.07,emote:ee})}(oe=s.current)==null||oe.setActors(X)},[L]);const{bubble:G,jump:y,unread:E,chest:F,walking:O,showWalk:H}=e;Yt.useEffect(()=>{var X;(X=s.current)==null||X.setUI({bubble:G,jump:y,unread:E,chest:F,walking:O,showWalk:H})},[G,y,E,F,O,H]);const j=e.weather==="cloudy"||e.weather==="rain",B=e.tod==="night"?"linear-gradient(#0b1033, #1b2560 45%, #27306b)":e.tod==="evening"?"linear-gradient(#6b5ca5, #f59e8b 30%, #f6c9a8 45%)":j?"linear-gradient(#9fb1c2, #c9d3dd 45%)":"linear-gradient(#5fb8f2, #a9dcfb 30%, #cfeeff 45%)";return Gn.jsxs("div",{className:"absolute inset-0",style:{background:B},children:[Gn.jsx("div",{ref:i,className:"absolute inset-0"}),Gn.jsx("div",{ref:r,className:"i3d-overlay pointer-events-none absolute inset-0 overflow-hidden"})]})});export{jM as default};
