$ = (function (document, window, $) {
  // Kill exeuction for bad browsers
  if(typeof document.querySelectorAll === undefined || 'addEventListener' in window === undefined) {
    return;
  }
  // Node covers all elements, but also the document objects
  var node = Node.prototype,
      nodeList = NodeList.prototype,
      forEach = 'forEach',
      trigger = 'trigger',
      each = [][forEach],
      // note: createElement requires a string in Firefox
      dummy = document.createElement('i'),
      events_cache = {},
      event_uuid = 0;

  nodeList[forEach] = each;

  // we have to explicitly add a window.on as it's not included
  // in the Node object.
  window.on = node.on = function (type, fn) {
    event_uuid++;
    if (!this.handlers) {
      this.handlers = {};
    }
    // check for namespace
    var type_arr = type.split(".");
    // store event data
    this.handlers[event_uuid] = type;
    events_cache[event_uuid] = { type: type_arr[0], namespace: type_arr[1] || "", fn: fn };
    // add listener
    this.addEventListener(type_arr[0], fn, false);
    // allow for chaining
    return this;
  };
    nodeList.on = function (type, fn) {
      this[forEach](function (el) {
        el.on(type, fn);
      });
      return this;
    };

  window.off = node.off = function (type) {
    // this.removeEventListener(event, fn, false);
    // check for namespace
    var node = this;
    var node_handlers = node.handlers;
    var type_arr = (typeof type === "undefined") ? [] : type.split(".");
    var event_type, event_namespace;
    if (type_arr.length > 0) {
      event_type = type_arr[0] || "";
      event_namespace = type_arr[1] || "";
    }
    // loop handlers
    Object.keys(node_handlers)[forEach](function(key,i){
      if (
        (type_arr.length === 0) || // off(); so remove all events from node
        (event_type === events_cache[key].type && event_namespace === events_cache[key].namespace) || // match type and namespace
        (event_type === events_cache[key].type && event_namespace === "") || // match type and no namespace
         (event_namespace === events_cache[key].namespace && event_type === "") // match namespace and no type
      ){
        // remove the listener
        node.removeEventListener(events_cache[key].type, events_cache[key].fn, false);
        // clean up after yourself
        delete node.handlers[key];
        delete events_cache[key];
      }
    });
    // allow for chaining
    return this;
  };
    nodeList.off = function (type, fn) {
      this[forEach](function (el) {
        el.off(type, fn);
      });
      return this;
    };

  // we save a few bytes (but none really in compression)
  // by using [trigger] - really it's for consistency in the
  // source code.
  window[trigger] = node[trigger] = function (type, data) {
    // construct an HTML event. This could have
    // been a real custom event
    var event = document.createEvent('HTMLEvents');
    event.initEvent(type, true, true);
    event.data = data || {};
    event.eventName = type;
    event.target = this;
    this.dispatchEvent(event);
    return this;
  };
    nodeList[trigger] = function (event) {
      this[forEach](function (el) {
        el[trigger](event);
      });
      return this;
    };

  // add remove classes
  window.addClass = node.addClass = function(className) {
    if (this.classList) {
      this.classList.add(className);
    } else {
      this.className += ' ' + className;
    }
  }
    nodeList.addClass = function (className) {
      this[forEach](function (el) {
        el.addClass(className);
      });
      return this;
    };
  window.removeClass = node.removeClass = function(className) {
    if (this.classList) {
      this.classList.remove(className);
    } else {
      this.className = this.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }
    nodeList.removeClass = function (className) {
      this[forEach](function (el) {
        el.removeClass(className);
      });
      return this;
    };
  window.hasClass = node.hasClass = function (className) {
   if (this.classList) {
     return this.classList.contains(className);
   } else {
     return new RegExp('(^| )' + className + '( |$)', 'gi').test(this.className);
   }
  }

  // offset top
  window.getOffsetTop = node.getOffsetTop = function(){
    return this.getBoundingClientRect().top + document.body.scrollTop;
  }

  // read/write attribute
  window.attr = node.attr = function(a,v){
    if (v === undefined) {
      return this.getAttribute(a);
    } else {
      this.setAttribute(a,v);
      return this;
    }
  }

  // css
  window.css = node.css = function(p,v) {
    if (v === undefined) {
      return this.style[p];
    } else {
      this.style[p] = v;
      return this;
    }
  }

  $ = function (s,c) {
    // querySelectorAll requires a string with a length
    // otherwise it throws an exception
    var r = (c || document).querySelectorAll(s || '☺'),
        length = r.length;
    // if we have a single element, just return that.
    // if there's no matched elements, return a nodeList to chain from
    // else return the NodeList collection from qSA
    return length == 1 ? r[0] : r;
  };

  // $.on and $.trigger allow for pub/sub type global
  // custom events.
  $.on = node.on.bind(dummy);
  $.off = node.off.bind(dummy);
  $[trigger] = node[trigger].bind(dummy);

  return $;
})(document, this);