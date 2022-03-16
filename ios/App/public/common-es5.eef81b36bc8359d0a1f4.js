!function(){"use strict";function n(n,e){for(var t=0;t<e.length;t++){var r=e[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(n,r.key,r)}}(self.webpackChunkonTarget=self.webpackChunkonTarget||[]).push([[8592],{6633:function(n,e,t){t.d(e,{c:function(){return a}});var r=t(23150),i=t(52954),o=t(97279),a=function(n,e){var t,a,c=function(n,r,i){if("undefined"!=typeof document){var o=document.elementFromPoint(n,r);o&&e(o)?o!==t&&(s(),u(o,i)):s()}},u=function(n,e){t=n,a||(a=t);var i=t;(0,r.c)(function(){return i.classList.add("ion-activated")}),e()},s=function(){var n=arguments.length>0&&void 0!==arguments[0]&&arguments[0];if(t){var e=t;(0,r.c)(function(){return e.classList.remove("ion-activated")}),n&&a!==t&&t.click(),t=void 0}};return(0,o.createGesture)({el:n,gestureName:"buttonActiveDrag",threshold:0,onStart:function(n){return c(n.currentX,n.currentY,i.a)},onMove:function(n){return c(n.currentX,n.currentY,i.b)},onEnd:function(){s(!0),(0,i.h)(),a=void 0}})}},77330:function(n,e,t){t.d(e,{a:function(){return a},d:function(){return c}});var r,i=t(34553),o=t(52377),a=(r=(0,i.Z)(regeneratorRuntime.mark(function n(e,t,r,i,a){var c;return regeneratorRuntime.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:if(!e){n.next=2;break}return n.abrupt("return",e.attachViewToDom(t,r,a,i));case 2:if("string"==typeof r||r instanceof HTMLElement){n.next=4;break}throw new Error("framework delegate is missing");case 4:return c="string"==typeof r?t.ownerDocument&&t.ownerDocument.createElement(r):r,i&&i.forEach(function(n){return c.classList.add(n)}),a&&Object.assign(c,a),t.appendChild(c),n.next=10,new Promise(function(n){return(0,o.c)(c,n)});case 10:return n.abrupt("return",c);case 11:case"end":return n.stop()}},n)})),function(n,e,t,i,o){return r.apply(this,arguments)}),c=function(n,e){if(e){if(n)return n.removeViewFromDom(e.parentElement,e);e.remove()}return Promise.resolve()}},52954:function(n,e,t){t.d(e,{a:function(){return o},b:function(){return a},c:function(){return i},d:function(){return u},h:function(){return c}});var r={getEngine:function(){var n=window;return n.TapticEngine||n.Capacitor&&n.Capacitor.isPluginAvailable("Haptics")&&n.Capacitor.Plugins.Haptics},available:function(){return!!this.getEngine()},isCordova:function(){return!!window.TapticEngine},isCapacitor:function(){return!!window.Capacitor},impact:function(n){var e=this.getEngine();if(e){var t=this.isCapacitor()?n.style.toUpperCase():n.style;e.impact({style:t})}},notification:function(n){var e=this.getEngine();if(e){var t=this.isCapacitor()?n.style.toUpperCase():n.style;e.notification({style:t})}},selection:function(){this.impact({style:"light"})},selectionStart:function(){var n=this.getEngine();!n||(this.isCapacitor()?n.selectionStart():n.gestureSelectionStart())},selectionChanged:function(){var n=this.getEngine();!n||(this.isCapacitor()?n.selectionChanged():n.gestureSelectionChanged())},selectionEnd:function(){var n=this.getEngine();!n||(this.isCapacitor()?n.selectionEnd():n.gestureSelectionEnd())}},i=function(){r.selection()},o=function(){r.selectionStart()},a=function(){r.selectionChanged()},c=function(){r.selectionEnd()},u=function(n){r.impact(n)}},66575:function(e,t,r){r.d(t,{s:function(){return i}});var i=function(e){try{if(e instanceof function(){return e=function n(e){!function(n,e){if(!(n instanceof e))throw new TypeError("Cannot call a class as a function")}(this,n),this.value=e},t&&n(e.prototype,t),r&&n(e,r),Object.defineProperty(e,"prototype",{writable:!1}),e;var e,t,r}())return e.value;if(!c()||"string"!=typeof e||""===e)return e;var t=document.createDocumentFragment(),r=document.createElement("div");t.appendChild(r),r.innerHTML=e,s.forEach(function(n){for(var e=t.querySelectorAll(n),r=e.length-1;r>=0;r--){var i=e[r];i.parentNode?i.parentNode.removeChild(i):t.removeChild(i);for(var c=a(i),u=0;u<c.length;u++)o(c[u])}});for(var i=a(t),u=0;u<i.length;u++)o(i[u]);var l=document.createElement("div");l.appendChild(t);var f=l.querySelector("div");return null!==f?f.innerHTML:l.innerHTML}catch(t){return console.error(t),""}},o=function n(e){if(!e.nodeType||1===e.nodeType){for(var t=e.attributes.length-1;t>=0;t--){var r=e.attributes.item(t),i=r.name;if(u.includes(i.toLowerCase())){var o=r.value;null!=o&&o.toLowerCase().includes("javascript:")&&e.removeAttribute(i)}else e.removeAttribute(i)}for(var c=a(e),s=0;s<c.length;s++)n(c[s])}},a=function(n){return null!=n.children?n.children:n.childNodes},c=function(){var n=window,e=n&&n.Ionic&&n.Ionic.config;return!e||(e.get?e.get("sanitizerEnabled",!0):!0===e.sanitizerEnabled||void 0===e.sanitizerEnabled)},u=["class","id","href","src","name","slot"],s=["script","style","iframe","meta","link","object","embed"]},60408:function(n,e,t){t.d(e,{S:function(){return r}});var r={bubbles:{dur:1e3,circles:9,fn:function(n,e,t){var r=n*e/t-n+"ms",i=2*Math.PI*e/t;return{r:5,style:{top:9*Math.sin(i)+"px",left:9*Math.cos(i)+"px","animation-delay":r}}}},circles:{dur:1e3,circles:8,fn:function(n,e,t){var r=e/t,i=n*r-n+"ms",o=2*Math.PI*r;return{r:5,style:{top:9*Math.sin(o)+"px",left:9*Math.cos(o)+"px","animation-delay":i}}}},circular:{dur:1400,elmDuration:!0,circles:1,fn:function(){return{r:20,cx:48,cy:48,fill:"none",viewBox:"24 24 48 48",transform:"translate(0,0)",style:{}}}},crescent:{dur:750,circles:1,fn:function(){return{r:26,style:{}}}},dots:{dur:750,circles:3,fn:function(n,e){return{r:6,style:{left:9-9*e+"px","animation-delay":-110*e+"ms"}}}},lines:{dur:1e3,lines:12,fn:function(n,e,t){return{y1:17,y2:29,style:{transform:"rotate(".concat(30*e+(e<6?180:-180),"deg)"),"animation-delay":n*e/t-n+"ms"}}}},"lines-small":{dur:1e3,lines:12,fn:function(n,e,t){return{y1:12,y2:20,style:{transform:"rotate(".concat(30*e+(e<6?180:-180),"deg)"),"animation-delay":n*e/t-n+"ms"}}}}}},61269:function(n,e,t){t.d(e,{c:function(){return a},g:function(){return c},h:function(){return o},o:function(){return s}});var r,i=t(34553),o=function(n,e){return null!==e.closest(n)},a=function(n,e){return"string"==typeof n&&n.length>0?Object.assign((t={"ion-color":!0},r="ion-color-".concat(n),i=!0,r in t?Object.defineProperty(t,r,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[r]=i,t),e):e;var t,r,i},c=function(n){var e={};return function(n){return void 0!==n?(Array.isArray(n)?n:n.split(" ")).filter(function(n){return null!=n}).map(function(n){return n.trim()}).filter(function(n){return""!==n}):[]}(n).forEach(function(n){return e[n]=!0}),e},u=/^[a-z][a-z0-9+\-.]*:/,s=(r=(0,i.Z)(regeneratorRuntime.mark(function n(e,t,r,i){var o;return regeneratorRuntime.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:if(null==e||"#"===e[0]||u.test(e)){n.next=4;break}if(!(o=document.querySelector("ion-router"))){n.next=4;break}return n.abrupt("return",(null!=t&&t.preventDefault(),o.push(e,r,i)));case 4:return n.abrupt("return",!1);case 5:case"end":return n.stop()}},n)})),function(n,e,t,i){return r.apply(this,arguments)})}}])}();