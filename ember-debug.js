Ember.Application.initializer({
  name: 'debug',
  initialize: function(container, app) {
    function alias(name) {
      return function() {
        debug[name].apply(null, arguments);
      };
    }
    var debug = app.debug = {
      container: container,
      controller: function(name) {
        name = name || debug.currentPath();
        return container.lookup('controller:' + name);
      },
      model: function(name) {
        var controller = debug.controller(name);
        return controller && controller.get('model');
      },
      route: function(name) {
        name = name || debug.currentPath();
        return container.lookup('route:' + name);
      },
      router: function(name) {
        name = name || 'main';
        return container.lookup('router:' + name).get('router');
      },
      routes: function() {
        return Em.keys(debug.router().recognizer.names);
      },
      view: function(id) {
        if (typeof id === 'object') {
          id = id.id;
        }
        return Em.View.views[id];
      },
      currentPath: function() {
        return debug.controller('application').get('currentPath');
      },
      log: function(valueOrPromise) {
        if (valueOrPromise.then) {
          valueOrPromise.then(function(value) {
            console.log(value);
          });
        }
        else {
          console.log(valueOrPromise);
        }
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
      templates: Em.keys(Ember.TEMPLATES),
      inspect: Em.inspect,
      observersFor: function(obj, property) {
        Em.observersFor(obj, property);
      },
      logResolver: function(bool) {
        bool = typeof bool == 'undefined' ? true : bool;
        Em.ENV.LOG_MODULE_RESOLVER = bool;
      },
      logAll: function(bool) {
        bool = typeof bool == 'undefined' ? true : bool;
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
    if (typeof DS == 'object') {
      app.debug.store = container.lookup('store:main');
      app.debug.typeMaps = container.lookup('store:main').typeMaps;
    }
  }
});
