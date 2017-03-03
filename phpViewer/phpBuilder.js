var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

(function(_base) {
  var phpBuilder;
  phpBuilder = {
    injected: _base.injected,
    run: function() {
      console.log('starting phpBuilder');
      phpBuilder.processJSON();
      debugger;
      console.log('  api complied');
      console.log('  adding files to zip queue');
    },
    processJSON: function() {
      phpBuilder.neededFiles = phpBuilder.makePhp(phpBuilder.injected.jsonFile.json);
    },
    neededFilters: [],
    /*
      This will populate arrays for each of the files.
      It should create phpBuilder.files[filename]
      because some files may have more than one replace string
    */

    makePhp: function(what) {
      var action, actionVars, addFunction, coll, each, input, output, type, typeVars, value, _i, _len, _ref, _ref1, _ref2, _ref3;
      output = [];
      phpBuilder.files = {};
      phpBuilder.neededFilters = [];
      input = function(varName) {
        return "$_input['" + varName + "']";
      };
      addFunction = function(call, vars) {
        var each, out;
        return out = "function " + call + "() {\n  eval(scriptVars);\n  " + ((function() {
          var _results;
          _results = [];
          for (each in vars) {
            _results.push(input(each) + ';\n');
          }
          return _results;
        })()) + "\n}";
      };
      output.push("switch( " + (input('noun')) + ") {");
      _ref = what.api;
      for (coll in _ref) {
        value = _ref[coll];
        output.push("  case \"" + coll + "\": ");
        output.push("    include('" + value.includePhpFile + "');");
        phpBuilder.files[value.includePhpFile] = [];
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
            phpBuilder.files[value.includePhpFile].push(addFunction(actionVars.call, actionVars.vars));
            output.push("            break;");
          }
          output.push("        }");
          output.push("        break;");
        }
        output.push("    }");
        output.push("    break;");
      }
      output.push("}");
      phpBuilder.files['backend.php'] = {};
      phpBuilder.files['backend.php']['switch'] = output;
      _ref3 = phpBuilder.files;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        each = _ref3[_i];
        each.join('\n');
      }
    },
    downloadAll: function() {
      phpBuilder.processJSON();
      return phpBuilder.injected.zipSources.loadSF().then(function() {
        phpBuilder.writer = new zip.BlobWriter;
        return zip.createWriter(phpBuilder.writer, function(zipWriter) {
          var addFile, nextFile;
          addFile = function(name, file) {
            zipWriter.add(name, new zip.TextReader(file), nextFile);
          };
          nextFile = function() {
            var each;
            for (each in phpBuilder.neededFiles) {
              if (phpBuilder.processedFiles == null) {
                phpBuilder.processedFiles = [];
              }
              if (__indexOf.call(phpBuilder.processedFiles, each) >= 0) {
                continue;
              }
              phpBuilder.processedFiles.push(each);
              if (each === 'backend.php') {
                phpBuilder.injected.zipSources.getFile('phpbackend/backend.php').then(function(file) {
                  return file.getData(new zip.TextWriter(), function(text) {
                    return addFile(each, text.replace('#{SWITCH}#', phpBuilder.neededFiles[each]));
                  });
                });
              } else {
                addFile(each, phpBuilder.neededFiles[each]);
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
  scopes.cb.codeBuilders[_base.name] = phpBuilder;
})(scopes.cb.adding);
