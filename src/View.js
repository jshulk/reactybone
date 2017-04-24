function View(){

}
View.prototype = {
  constructor: View,
  setupEvents: function(){
    if(this.events && Object.keys(this.events).length > 0) {
      for(var key in this.events ) {
        var eventData = key.split(" "),
            event = eventData[0],
            selector = eventData[1],
            handler = this.events[key];
        this.root.off(event, selector);
        this.root.on(event, selector, this[handler].bind(this));
      }
    }

  },
  clearEvents: function(){
    if(this.events && Object.keys(this.events).length > 0) {
      for(var key in this.events ) {
        var eventData = key.split(" "),
            event = eventData[0],
            selector = eventData[1],
            handler = this.events[key];
        if( this.root ) {
            this.root.off(event, selector, this[handler]);
        }
      }
    }
  },
  unmount: function () {
    if ( this.subViews ) {
      for ( var key in this.subViews ) {
        this.subViews[key].unmount();
      }
    }
    if (this["componentWillUnMount"]) {
      this.componentWillUnMount();
    }
    this.clearEvents();
    this.destroyDOM();
  },
  destroyDOM: function(){
    if(this.root !== null && this.root !== undefined){
        this.root.html('');
        console.log("dom destroyed");
    }

  },
  renderChain: function (props) {
    this.spec = this.getViewSpec(props);
    this.renderSpec(this.spec, props);
  },
  renderSpec: function (vnode, commonProps) {
    if (vnode.type === "parent-template") {
      if ( vnode.attributes["root"] ) {
        this.root = $(vnode.attributes["root"]);
      }
      this.template = vnode.nodename;
      this.root.html(this.template($.extend({}, commonProps, vnode.attributes)));

    } else if (vnode.type === "subview") {
      this.subViews = this.subViews || {};
      var extendedProps = $.extend({}, commonProps, vnode.attributes);
      if ( this.subViews[vnode.storageKey] ) {
        this.subViews[vnode.storageKey].unmount();
      }
      this.subViews[vnode.storageKey] = new vnode.nodename();
      this.subViews[vnode.storageKey].init(extendedProps);
      if ( !vnode.attributes["lazyRender"] ) {
        var subViewSpec = this.subViews[vnode.storageKey].getViewSpec(extendedProps);
        this.subViews[vnode.storageKey].renderSpec(subViewSpec, extendedProps);
        if (this.subViews[vnode.storageKey]["componentDidMount"]) {
          this.subViews[vnode.storageKey].componentDidMount();
        }
      }
    }
    if ( vnode.children && vnode.children.length ) {
      for( var i = 0; i < vnode.children.length; i++ ) {
        var spec = vnode.children[i];
        this.renderSpec(spec, commonProps);
      }
    }

    if (this["componentDidMount"]) {
      if( !this.initialized ) {
          this.componentDidMount();
          this.initialized = true;
      }
    }

    return this;
  }
};


View.Extend = function(options){
  var func = function(){};
  var c = function(){};
  c.prototype = View.prototype;
  func.prototype = new c();
  for( var key in options) {
    if( options.hasOwnProperty(key)) {
      func.prototype[key] = options[key];
    }
  }
  return func;
};

module.exports = View;
