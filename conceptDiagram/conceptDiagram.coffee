j2pApp.controller("conceptDiagram", ['jsonFile', (jF) ->
  scopes.cd = this
  @jsonFile = jF
  @editing = null
  @areas = []
  
  @addArea = (evt) ->
    @clearEdit()
    @editing = @areas.length
    @areas.push {idx: @areas.length, editing: true, style: 'min-height: 50px; min-width:50px; left:'+evt.offsetX+'px; top:'+evt.offsetY+'px;'}
    @updateAreas()
    return
  @editArea = (evt, area) ->
    @clearEdit() if area.idx!=@editing
    @editing = area.idx
    area.editing = true
    evt.preventDefault()
    evt.stopPropagation()
    @updateAreas()
    false
  @clearEdit = () ->
    return if !@editing?
    @areas[@editing].editing = false if @editing?
    @areas.splice(@editing, 1) if !@areas[@editing].name?
    @editing = null
    return
  @updateAreas = () ->
    return
])