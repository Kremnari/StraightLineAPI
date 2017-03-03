j2pApp.controller('apiFunctions', [ 'jsonFile', '$timeout', '$scope', (jsonFile, $t, $s) ->
  @jsonFile = jsonFile
  @showMe = true
  @editing = null
  @area = 'filterFunctions'
  $s.$on 'af-FilterFunctions', ->
    @showMe = true
    @area = 'filterFunctions'
    return
  @editFilter = (fn, props) ->
    @editing = {fn, code: Base64.decode props.code  }
    return  
  @saveEdit = () ->
    @jsonFile.json.filters[@editing.fn].code = Base64.encode @editing.code
    @editing = null
    return
  scopes.af = this
  return
])
