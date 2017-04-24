var View = require("./View");
var NavbarView = require("./NavbarView");
var TilesView = require("./TilesView");

module.exports = View.Extend({
  init: function(props) {
    this.props = props;
    this.renderChain(props);
  },
  getViewSpec: function (props) {
    return {
      nodename: require("templates/home.hbs"),
      type: 'parent-template',
      attributes: props,
      children: [
        {
          nodename: NavbarView,
          type: 'subview',
          storageKey: "navbarView",
          attributes: {
            root: "#headerContainer",
            lazyRender: false
          }
        },
        {
          nodename: TilesView,
          type: 'subview',
          storageKey: 'tilesView',
          attributes: {
            root: "#tilesContainer",
            lazyRender: false
          }
        }
      ]
    };
  }
});
