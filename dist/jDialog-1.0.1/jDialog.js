!function(t,e){function i(t){var e=t,i=e.getWrapper(),n=e.options;return i.appendChild(e.getHeader()),i.appendChild(e.getContainer()),i.appendChild(e.getFooter()),""===n.title&&e.hideHeader(),e.title(n.title),n.url?e.iframe(n.url):e.content(n.content),e.addButton("取消","destory",function(){e.remove()}),n.modal&&e.showModal(),n.autoHide&&e.autoHide(n.autoHide),n.callBack&&e.addButton("确定","apply",n.callBack),i.addEventListener("click",o.bind(e),!1),a.body.appendChild(i),e.verticalInViewPort(n.fixed).addClass("dialog-zoom-in"),e}function n(t,e){var i=a.createElement(t);return d.extend(i,e),i}function o(t){var e=t.target,i=e.getAttribute("data-dialog-action");i&&d.event.fire(i)}function r(t){var e=t,i=n("div");return i.style.cssText=";background:rgba(0,0,0,0.3);width:100%;position:absolute;left:0;top:0;height:"+Math.max(a.documentElement.scrollHeight,a.body.scrollHeight)+"px;z-index:"+(e.currentDOMIndex-1),i.onclick=function(){e.options.preventHide||d.event.fire("destory")},a.body.appendChild(i),i}var s=t,a=e,h="1.0.0",d=function(t,e){return new d.fn.init(t,e)};d.fn=d.prototype={constructor:d,init:function(t,e){if(this.options={title:"提示",modal:!0,content:"",autoHide:0,prefix:"",fixed:!0,preventHide:!1,callBack:null,url:null},this.actions={},this.buttons=[],d.event.root=this,d.currentDialog&&d.currentDialog.remove(),d.currentDialog=this,d.isPlainObject(t))d.extend(this.options,t);else{if(!/string|number|boolean/gi.test(typeof t))return this;this.options.content=t,d.isFunction(e)&&(this.options.callBack=e)}return i(this),this}},d.extend=d.fn.extend=function(){var t,e,i=arguments[0]||{},n=arguments[1]||{};1===arguments.length&&(i=this,n=arguments[0]);for(t in n)e=n[t],void 0!==e&&(i[t]=e);return i},d.fn.init.prototype=d.fn,d.extend({isFunction:function(t){return"[object Function]"===Object.prototype.toString.call(t)},isPlainObject:function(t){return null===t||void 0===t?!1:t.constructor=={}.constructor},isUrl:function(t){var e=/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;return e.test(t)},expando:"jDialog"+(h+Math.random()).replace(/\D/g,"")}),d.event={getRoot:function(){return this.root||d.currentDialog||d()},add:function(t,e){var i=this.getRoot();return this.has(t)||(i.actions[t]=[]),d.isFunction(e)&&i.actions[t].push(e),this},remove:function(t){var e=this.getRoot();return this.has(t)?delete e.actions[t]:(console.warn(t+"不存在"),!1)},has:function(t){var e=this.getRoot();return"string"==typeof t&&e.actions[t]?!0:!1},once:function(t){return this.has(t)&&this.fire(t).remove(t),this},fire:function(t){var e=this.getRoot();if(this.has(t)){var i=e.actions[t],n=i.length;if(n)for(var o=0;n>o;o++)i[o].call(e)}return this}},d.fn.extend({verticalInViewPort:function(t){var e=a.documentElement,i=e.clientHeight,n=this.height();if(t)n>i&&(n=i-100,this.getContainer().style.height=n-(this.height(this.getHeader())+this.height(this.getFooter()))+"px"),this.height(n).toggleLockBody(!0).extend(this.getWrapper().style,{position:"fixed",marginTop:-n/2+"px",top:"50%"});else{var o=Math.max(a.body.scrollTop,e.scrollTop),r=Math.max(382*(i-n)/1e3+o,o);this.top(r).height("auto").toggleLockBody(!1).getContainer().style.height="auto"}return this},toggleLockBody:function(t){var e=this.getHeader(),i=this.getFooter(),n=this.getModal(),o="ontouchmove";return e[o]=i[o]=n[o]=t?function(){return!1}:null,this},getWrapper:function(){if(!this.wrapper){var t=this.options.prefix;this.wrapper=n("div",{className:t+"dialog"}),this.wrapper.style.zIndex=this.currentDOMIndex=614}return this.wrapper},getHeader:function(){if(!this.header){var t=this.options.prefix;this.header=n("div",{className:t+"dialog-header"})}return this.header},hideHeader:function(){var t=this.getHeader(),e=this.height(t);return this.height(this.height()-e),t.style.display="none",this},getContainer:function(){if(!this.container){var t=this.options.prefix;this.container=n("div",{className:t+"dialog-body"})}return this.container},getFooter:function(){if(!this.footer){var t=this.options.prefix;this.footer=n("div",{className:t+"dialog-footer"})}return this.footer},hideFooter:function(){var t=this.getFooter(),e=this.height(t);return this.height(this.height()-e),t.style.display="none",this},addButton:function(t,e,i){var o=("jDialog"+Math.random()).replace(/\D/g,""),r="确定";if(d.isFunction(t))return this.addButton(r,e||o,t);if(d.isFunction(e))return this.addButton(t,o,e);var s=this.options.prefix,a=n("a",{href:"javascript:;",className:s+"dialog-btn",innerHTML:t||r});e?d.event.add(e,i):e="destory",a.setAttribute("data-dialog-action",e);var h=this.getFooter();return this.buttons.length?(this.addClass("dialog-btn-primary",a),h.insertBefore(a,h.childNodes.item(0))):h.appendChild(a),this.buttons.push(a),this},delButton:function(t){var e,i=this.getButton(t);if(i){e=i.getAttribute("data-dialog-action"),"destory"!=e&&d.event.remove(e),this.getFooter().removeChild(i);var n=this.buttons.indexOf(i);this.buttons.splice(n,1)}return this},getButton:function(t){var e=this.buttons.slice().reverse();return e[t]?e[t]:null},addClass:function(t,e){var e=e||this.getWrapper();return 1===e.nodeType&&"string"==typeof t&&e.classList.add(t),this},removeClass:function(t,e){var e=e||this.getWrapper();return 1===e.nodeType&&"string"==typeof t&&e.classList.remove(t),this},autoHide:function(t){return d.currentDialog?0==t?this.remove():void 0===t?this.autoHide(this.options.autoHide):(this.autoHideTimer&&clearTimeout(this.autoHideTimer),this.autoHideTimer=setTimeout(function(){this.remove(),clearTimeout(this.autoHideTimer),this.autoHideTimer=null}.bind(this),1e3*t),this):this},remove:function(){return this.toggleLockBody(!1),this.wrapper&&(this.wrapper.removeEventListener("click",o,!1),a.body.removeChild(this.wrapper)),this.modal&&(this.modal.onclick=null,a.body.removeChild(this.modal)),this.autoHideTimer&&clearTimeout(this.autoHideTimer),this.actions=[],d.event.root=d.currentDialog=null,this},getModal:function(){return this.modal||(this.modal=r(this)),this.modal},hideModal:function(){return this.getModal().style.display="none",this},showModal:function(){return this.getModal().style.display="",this},iframe:function(t){var e=this,t=t||e.options.url;if(!d.isUrl(t))return e.content(t+"不是一个有效的地址");var i=e.getContainer(),o=a.documentElement.clientHeight;i.style.position="relative",this.content('<div style="text-align: center;background-color: rgba(255,255,255,0.5);position:absolute;left:0;top:0;width:100%;height:100%">loading...</div>');var r=n("iframe",{frameborder:0,width:"100%",height:o});return r.onload=function(){var t=this.parentNode,e=t.getElementsByTagName("div")[0];t.removeChild(e),r.onload=null},r.onerror=function(){e.content("加载"+t+"时发生错误"),r.onerror=null},i.appendChild(r),r.src=t,e}});var u=function(t){return/em|px|rem|pt|%|auto/gi.test(t)||(t+="px"),t};d.fn.extend({title:function(t){return"undefined"==typeof t?this.options.title:(this.getHeader().innerHTML=this.options.title=t,this)},content:function(t){return void 0===t?this.options.content:(this.getContainer().innerHTML=this.options.content=t,this)},height:function(t){return void 0===t?this.height(this.getWrapper()):1===t.nodeType?t.offsetHeight:(this.wrapper.style.height=u(t),this)},width:function(t){return void 0===t?this.width(this.getWrapper()):1===t.nodeType?t.offsetWidth:(d.extend(this.wrapper.style,{width:u(t),marginLeft:u(-(parseFloat(t)/2))}),this)},index:function(t){return void 0===t?this.currentDOMIndex:(this.currentDOMIndex=t,this.wrapper.style.zIndex=this.currentDOMIndex,this.getModal().style.zIndex=this.currentDOMIndex-1,this)},top:function(t){return void 0===t?s.getComputedStyle(this.getWrapper()).top:(d.extend(this.wrapper.style,{top:u(t),marginTop:""}),this)},fixed:function(t){var e=!0;return t&&"undefined"==typeof t||(e=!1,this.getWrapper().style.position="absolute"),this.verticalInViewPort(e)},absolute:function(){return this.fixed(!1)},preventHide:function(){return this.options.preventHide=!0,this}}),d.extend({alert:function(t){return d(t)},toast:function(t,e){var i=d(t),n=i.getContainer(),o=i.height(n);return i.getContainer().style.textAlign="center",i.addClass("dialog-toast").hideFooter().hideHeader().hideModal().height(o).autoHide(e||3),i},error:function(t,e){return d(t,e).addClass("dialog-error")}}),"function"==typeof define&&define.amd?define("jdialog",[],function(){return d}):s.jDialog=d}(window,window.document);