(function() {
  j2pApp.factory('zipSources', [
    'jsonFile', function(jsonFile) {
      var zipSources;
      zipSources = {
        sourceFile: null,
        url: 'zipSources/zipProvider.php?files[]=mongo&files[]=php',
        setUrl: function(what) {
          zipSources.url = what;
        },
        loadSF: function() {
          return new Promise(function(resolve) {
            var xhr;
            if (zipSources.sourceFile != null) {
              resolve();
            }
            xhr = new XMLHttpRequest();
            xhr.open('GET', zipSources.url);
            xhr.responseType = 'blob';
            xhr.onload = function(e) {
              if (this.status === 200) {
                zip.createReader(new zip.BlobReader(this.response), function(reader) {
                  zipSources.sourceFile = reader;
                  return resolve();
                });
              }
            };
            return xhr.send();
          });
        },
        getFile: function(what) {
          return new Promise(function(resolve) {
            if (zipSources.sourceFile == null) {
              return null;
            }
            zipSources.sourceFile.getEntries(function(list) {
              var each, key;
              for (key in list) {
                each = list[key];
                if (each.filename === what) {
                  resolve(each);
                }
              }
            });
          });
        },
        addAPIFile: function(what) {}
      };
      scopes.zipSources = zipSources;
      return zipSources;
    }
  ]);

}).call(this);
