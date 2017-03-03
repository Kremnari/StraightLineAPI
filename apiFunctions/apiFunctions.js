(function() {
  j2pApp.controller('apiFunctions', [
    'jsonFile', '$timeout', '$scope', function(jsonFile, $t, $s) {
      this.jsonFile = jsonFile;
      this.showMe = true;
      this.editing = null;
      this.area = 'filterFunctions';
      $s.$on('af-FilterFunctions', function() {
        this.showMe = true;
        this.area = 'filterFunctions';
      });
      this.editFilter = function(fn, props) {
        this.editing = {
          fn: fn,
          code: Base64.decode(props.code)
        };
      };
      this.saveEdit = function() {
        this.jsonFile.json.filters[this.editing.fn].code = Base64.encode(this.editing.code);
        this.editing = null;
      };
      scopes.af = this;
    }
  ]);

}).call(this);
