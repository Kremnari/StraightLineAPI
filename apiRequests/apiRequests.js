(function() {
  j2pApp.controller('apiRequests', [
    'jsonFile', function(jsonFile) {
      this.jsonFile = jsonFile;
      this.area = 'collections';
      this.showMe = true;
      this.showNewFilter = false;
      this.newTypeStub = function(coll, type) {
        return {
          actions: {
            get: {
              call: "get_" + type,
              vars: {}
            },
            "new": {
              call: "new_" + type,
              vars: {}
            },
            "delete": {
              call: "del_" + type,
              vars: {}
            }
          }
        };
      };
      this.newActionStub = function(type, action) {
        return {
          call: "" + action + "_" + type,
          vars: {}
        };
      };
      this.addCollection = function() {
        this.jsonFile.json.api[this.newCollection] = {
          types: {},
          includePhpFile: "api/" + this.newCollection + ".php"
        };
        this.newCollection = null;
      };
      this.addType = function(scope) {
        console.log(scope);
        this.jsonFile.json.api[this.editing.coll].types[scope.newType] = this.newTypeStub(this.editing.coll, scope.newType);
        scope.newType = null;
        scope.addSub = false;
      };
      this.addAction = function(scope) {
        this.jsonFile.json.api[this.editing.coll].types[this.editing.type].actions[scope.newAction] = this.newActionStub(this.editing.type, scope.newAction);
        scope.newAction = null;
        scope.addAction = false;
      };
      this.editCollection = function(coll) {
        this.editing = {
          coll: coll
        };
        this.editing.json = this.jsonFile.json.api[coll];
        this.area = 'editCollection';
      };
      this.editType = function(coll, type) {
        this.editing = {
          coll: coll,
          type: type
        };
        this.editing.json = this.jsonFile.json.api[coll].types[type];
        this.area = 'editType';
      };
      this.editAction = function(coll, type, action) {
        this.editing = {
          coll: coll,
          type: type,
          action: action
        };
        this.editing.json = this.jsonFile.json.api[coll].types[type].actions[action];
        this.area = 'editAction';
      };
      this.editVar = function(vars) {
        this.editing.vars = vars;
        this.editing.json = this.jsonFile.json.api[this.editing.coll].types[this.editing.type].actions[this.editing.action].vars[vars];
        this.area = 'editVars';
      };
      this.backup = function() {
        this.editing.action = void 0;
        this.editing.json = this.jsonFile.json.api[this.editing.coll].types[this.editing.type];
        this.area = 'editType';
      };
      this.addVarType = function(data, scope) {
        var toAdd, _base;
        if ((_base = this.editing.json).varTypes == null) {
          _base.varTypes = {};
        }
        toAdd = {
          desc: data.desc
        };
        if (data.isFn) {
          toAdd.fnName = 'is' + data.name;
          toAdd.code = '';
        }
        this.jsonFile.json.filters[data.name] = toAdd;
        this.editing.json.varTypes[data.name] = toAdd;
        scope.newVar = {};
        this.showNewFilter = false;
      };
      this.isString = function(what) {
        return typeof what === 'string';
      };
      scopes.ar = this;
    }
  ]);

}).call(this);
