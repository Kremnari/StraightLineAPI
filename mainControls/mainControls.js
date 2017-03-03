(function() {
  j2pApp.controller("mainControls", [
    '$timeout', 'jsonFile', '$http', 'zipSources', 'codeBuilder', function($timeout, jsonFile, $h, zS, cb) {
      this.jsonFile = jsonFile;
      this.cb = cb;
      scopes.mc = this;
      this.selectFiles = function() {
        $timeout(function() {
          angular.element('#loadJson').trigger('click');
        });
      };
      this.loadFiles = function(evt) {
        this.jsonFile.loadFile(evt.files[0]);
      };
      this.downloadProject = function() {
        scopes.ao.loadSources(function() {
          var url;
          url = 'zipSources/zipProvider.php?files[]=php&files[]=mongo';
          zS.setUrl(url);
          zS.loadSF();
          scopes.mc.cb.runCBFile('php');
        });
      };
      this.generate = function() {};
      this.showOptions = function() {
        scopes.ao.showMe = true;
        return scopes.ar.showMe = false;
      };
    }
  ]);

}).call(this);
