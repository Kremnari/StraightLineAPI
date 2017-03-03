j2pApp.controller("conceptDiagram", [
  'jsonFile', function(jF) {
    scopes.cd = this;
    this.jsonFile = jF;
    this.editing = null;
    this.areas = [];
    this.addArea = function(evt) {
      this.clearEdit();
      this.editing = this.areas.length;
      this.areas.push({
        idx: this.areas.length,
        editing: true,
        style: 'min-height: 50px; min-width:50px; left:' + evt.offsetX + 'px; top:' + evt.offsetY + 'px;'
      });
      this.updateAreas();
    };
    this.editArea = function(evt, area) {
      if (area.idx !== this.editing) {
        this.clearEdit();
      }
      this.editing = area.idx;
      area.editing = true;
      evt.preventDefault();
      evt.stopPropagation();
      this.updateAreas();
      return false;
    };
    this.clearEdit = function() {
      if (this.editing == null) {
        return;
      }
      if (this.editing != null) {
        this.areas[this.editing].editing = false;
      }
      if (this.areas[this.editing].name == null) {
        this.areas.splice(this.editing, 1);
      }
      this.editing = null;
    };
    return this.updateAreas = function() {};
  }
]);
