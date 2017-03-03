j2pApp.factory('codeBuilder', [
  '$timeout', 'jsonFile', 'zipSources', function($t, jsonFile, zipSources) {
    var codeBuilder;
    codeBuilder = {
      codeBuilders: {},
      adding: {},
      loadCBFile: function(name, url) {
        return new Promise(function(success, failure) {
          if (codeBuilder.codeBuilders[name] != null) {
            success();
          }
          codeBuilder.adding.name = name;
          codeBuilder.adding.injected = {
            jsonFile: jsonFile,
            zipSources: zipSources
          };
          return $.getScript(url).done(function(src, status) {
            codeBuilder.adding = {};
            return success();
          });
        });
      },
      runCBFile: function(callname) {
        codeBuilder.codeBuilders[callname].run(jsonFile, zipSources);
      }
    };
    scopes.cb = codeBuilder;
    return codeBuilder;
  }
]);
