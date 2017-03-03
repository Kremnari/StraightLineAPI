j2pApp.controller('apiOptions', [
  'jsonFile', 'codeBuilder', function(jsonFile, cb) {
    var _base;
    this.showMe = false;
    scopes.ao = this;
    this.jsonFile = jsonFile;
    this.srcrepo = 'remotehost';
    if ((_base = jsonFile.json).apiOptions == null) {
      _base.apiOptions = {
        src: {
          csf: 'none2',
          csb: 'none',
          sss: 'none',
          sdb: 'none'
        }
      };
    }
    this.srcs = {
      csf: ['none', 'angular'],
      csb: ['none', 'angularsrvc'],
      sss: ['none', 'php'],
      sdb: ['none', 'mongo']
    };
    this.updatesrcs = function() {};
    this.loaded = [];
    this.hasLoaded = function(what) {
      return scopes.ao.loaded[what] != null;
    };
    this.loadSources = function(callBack) {
      scopes.ao.toLoad = ['php'];
      scopes.ao.toLoadUrls = {
        php: 'phpViewer/phpBuilder.js'
      };
      scopes.ao.loadCB = callBack;
      scopes.ao.loadLoop();
    };
    this.loadLoop = function() {
      var next;
      if (scopes.ao.toLoad.length === 0) {
        scopes.ao.loadComplete();
        return;
      }
      next = scopes.ao.toLoad.pop();
      scopes.ao.loaded.push(next);
      console.log('Loading ' + next);
      cb.loadCBFile(next, scopes.ao.toLoadUrls[next]).then(function() {
        scopes.ao.loadLoop();
      });
    };
    this.loadComplete = function() {
      console.log('All loaded');
      scopes.ao.loadCB();
    };
    this.test = function() {
      cb.loadCBFile('php', 'phpViewer/phpBuilder.js').then(function() {
        cb.runCBFile('php');
      });
    };
  }
]);
