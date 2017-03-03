(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  j2pApp.factory('phpMaker', [
    '$timeout', 'jsonFile', 'zipSources', function($timeout, jsonFile, zipSources) {
      var phpMaker;
      phpMaker = {
        final: " ",
        sourceZip: null,
        processJSON: function() {
          var data;
          console.log('starting');
          data = jsonFile.json;
          phpMaker.neededFiles = phpMaker.makePhp(data);
          phpMaker.final = phpMaker.neededFiles['backend.php'];
        },
        neededFilters: [],
        makePhp: function(what) {
          var action, actionVars, addFunction, coll, fn, input, output, type, typeVars, value, _ref, _ref1, _ref2;
          input = function(varName) {
            return '$_input[' + varName + ']';
          };
          output = [];
          fn = {};
          phpMaker.neededFilters = [];
          addFunction = function(call, vars) {
            var each, out;
            out = 'function ' + call + '() {\n';
            for (each in vars) {
              out += '  ' + input(each) + ';\n';
            }
            out += '}\n';
            return out;
          };
          output.push("switch( " + (input('noun')) + ") {");
          _ref = what.api;
          for (coll in _ref) {
            value = _ref[coll];
            output.push("  case \"" + coll + "\": ");
            output.push("    include('" + value.includePhpFile + "');");
            fn[value.includePhpFile] = [];
            output.push("    switch( " + (input('type')) + ") {");
            _ref1 = what.api[coll].types;
            for (type in _ref1) {
              typeVars = _ref1[type];
              output.push("      case \"" + type + "\": ");
              output.push("        switch( " + (input('verb')) + ") {");
              _ref2 = what.api[coll].types[type].actions;
              for (action in _ref2) {
                actionVars = _ref2[action];
                output.push("          case \"" + action + "\": ");
                output.push("            " + actionVars.call + "();");
                fn[value.includePhpFile].push(addFunction(actionVars.call, actionVars.vars));
                output.push("            break;");
              }
              output.push("        }");
              output.push("        break;");
            }
            output.push("    }");
            output.push("    break;");
          }
          output.push("}");
          fn['backend.php'] = output.join('\n');
          return fn;
        },
        makeFnFile: function(what) {
          var each, output, _i, _len;
          output = [];
          for (_i = 0, _len = what.length; _i < _len; _i++) {
            each = what[_i];
            output.push('function ' + each + '(){\n\n}');
          }
          return output.join('\n');
        },
        downloadAll: function() {
          phpMaker.processJSON();
          return zipSources.loadSF().then(function() {
            phpMaker.writer = new zip.BlobWriter;
            return zip.createWriter(phpMaker.writer, function(zipWriter) {
              var addFile, nextFile;
              addFile = function(name, file) {
                zipWriter.add(name, new zip.TextReader(file), nextFile);
              };
              nextFile = function() {
                var each;
                for (each in phpMaker.neededFiles) {
                  if (phpMaker.processedFiles == null) {
                    phpMaker.processedFiles = [];
                  }
                  if (__indexOf.call(phpMaker.processedFiles, each) >= 0) {
                    continue;
                  }
                  phpMaker.processedFiles.push(each);
                  if (each === 'backend.php') {
                    zipSources.getFile('phpbackend/backend.php').then(function(file) {
                      return file.getData(new zip.TextWriter(), function(text) {
                        return addFile(each, text.replace('#{SWITCH}#', phpMaker.neededFiles[each]));
                      });
                    });
                  } else {
                    addFile(each, phpMaker.neededFiles[each]);
                  }
                  return;
                }
                zipWriter.close(function(blob) {
                  download(blob, 'project.zip', 'application/octet-stream');
                  console.log('done');
                });
              };
              nextFile();
            });
          });
        }
      };
      scopes.phpMaker = phpMaker;
      return phpMaker;
    }
  ]);

}).call(this);
