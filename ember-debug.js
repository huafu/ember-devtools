/* global Ember */
Ember.Application.initializer({
  name: 'debug',
  after: typeof DS !== 'undefined' ? 'store' : null,
  initialize: function(container, app) {
    function alias(name) {
      return function() {
        debug[name].apply(null, arguments);
      };
    }
    var debug = app.debug = {
      container: container,
      controller: function(name) {
        name = name || debug.currentRouteName();
        return container.lookup('controller:' + name);
      },
      model: function(name) {
        var controller = debug.controller(name);
        return controller && controller.get('model');
      },
      route: function(name) {
        name = name || debug.currentRouteName();
        return container.lookup('route:' + name);
      },
      router: function(name) {
        name = name || 'main';
        return container.lookup('router:' + name).get('router');
      },
      routes: function() {
        return Ember.keys(debug.router().recognizer.names);
      },
      view: function(id) {
        if (typeof id === 'object') {
          id = id.id;
        }
        return Ember.View.views[id];
      },
      currentRouteName: function() {
        return debug.controller('application').get('currentRouteName');
      },
      currentPath: function() {
        return debug.controller('application').get('currentPath');
      },
      log: function(promise, property, getEach) {
        promise.then(function(value) {
          window.$E = value;
          if (property) {
            value = value[getEach ? 'getEach' : 'get'].call(value, property);
          }
          console.log(value);
        });
      },
      className: function(object) {
        return object.__proto__.constructor;
      },
      registry: container.registry.dict,
      lookup: function(name) {
        return container.lookup(name);
      },
      containerNameFor: function(object) {
        var name;
        container.cache.eachLocal(function(key, value) {
          if (value === object) {
            name = key;
          }
        });
        return name;
      },
      templates: Ember.keys(Ember.TEMPLATES),
      inspect: Ember.inspect,
      observersFor: function(obj, property) {
        Ember.observersFor(obj, property);
      },
      logResolver: function(bool) {
        bool = typeof bool === 'undefined' ? true : bool;
        Ember.ENV.LOG_MODULE_RESOLVER = bool;
      },
      logAll: function(bool) {
        bool = typeof bool === 'undefined' ? true : bool;
        app.LOG_ACTIVE_GENERATION = bool;
        app.LOG_VIEW_LOOKUPS = bool;
        app.LOG_TRANSITIONS = bool;
        app.LOG_TRANSITIONS_INTERNAL = bool;
      },
      globalize: function() {
        for (var prop in this) {
          if (this.hasOwnProperty(prop)) {
            window[prop] = window[prop] || this[prop];
          }
        }
      }
    };
    if (typeof DS !== 'undefined') {
      app.debug.store = container.lookup('store:main');
      app.debug.typeMaps = app.debug.store.typeMaps;
    }
  }
});
