j2pApp.controller('apiRequests', ['jsonFile', (jsonFile) ->
  @jsonFile = jsonFile
  @area = 'collections'
  @showMe = true
  @showNewFilter = false
  
  @newTypeStub = (coll, type) -> { actions: {
      get: { call: "get_#{type}", vars: {} },
      new: { call: "new_#{type}", vars: {} },
      delete: { call: "del_#{type}", vars: {} }
      } }
  @newActionStub = (type, action) -> { call: "#{action}_#{type}", vars: {} }
  @addCollection = ->
    @jsonFile.json.api[@newCollection] = { types: {}, includePhpFile: "api/#{@newCollection}.php" }
    @newCollection = null
    return
  @addType = (scope) ->
    console.log scope
    @jsonFile.json.api[@editing.coll].types[scope.newType] = @newTypeStub @editing.coll, scope.newType
    scope.newType = null
    scope.addSub = false
    return
  @addAction = (scope) ->
    @jsonFile.json.api[@editing.coll].types[@editing.type].actions[scope.newAction] = @newActionStub @editing.type, scope.newAction
    scope.newAction = null
    scope.addAction = false
    return
  @editCollection = (coll) ->
    @editing = {coll}
    @editing.json = @jsonFile.json.api[coll]
    @area = 'editCollection'
    return
  @editType = (coll, type) ->
    @editing = {coll, type }
    @editing.json = @jsonFile.json.api[coll].types[type]
    @area = 'editType'
    return
  @editAction = (coll, type, action) ->
    @editing = {coll, type, action}
    @editing.json = @jsonFile.json.api[coll].types[type].actions[action]
    @area = 'editAction'
    return
  @editVar = (vars) ->
    @editing.vars = vars
    @editing.json = @jsonFile.json.api[@editing.coll].types[@editing.type].actions[@editing.action].vars[vars]
    @area = 'editVars'
    return
  @backup =  ->
    @editing.action = undefined;
    @editing.json = @jsonFile.json.api[@editing.coll].types[@editing.type]
    @area = 'editType'
    return
  @addVarType = (data, scope)->
    @editing.json.varTypes ?= {}
    toAdd = { desc: data.desc }
    if data.isFn
      toAdd.fnName = 'is'+data.name 
      toAdd.code = ''
    @jsonFile.json.filters[data.name] = toAdd
    @editing.json.varTypes[data.name] = toAdd
    scope.newVar = {}
    @showNewFilter = false
    return
  @isString = (what) ->
    typeof what is 'string'

  scopes.ar = this
  return
])
