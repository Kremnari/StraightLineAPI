j2pApp.controller("mainControls", ['$timeout', 'jsonFile', '$http', 'zipSources', 'codeBuilder', ($timeout, jsonFile, $h, zS, cb) ->
  @jsonFile = jsonFile
  #@phpMaker = phpMaker
  @cb = cb
  scopes.mc = this
  @selectFiles = ->
    $timeout ->
      angular.element('#loadJson').trigger('click')
      return
    return
  @loadFiles =  (evt)->
    @jsonFile.loadFile evt.files[0]
    return
  @downloadProject = ()->
    scopes.ao.loadSources( () ->
      url = 'zipSources/zipProvider.php?files[]=php&files[]=mongo'
      #url += "files[]=#{val}&" for elm, val of scopes.jsonFile.json.apiOptions.src when val!='none'
      zS.setUrl url
      zS.loadSF()
      scopes.mc.cb.runCBFile 'php'
      return
    )
    #console.log elm for elm of scopes.ao.src when elm!='none'
    #console.log url
    return
  @generate = ->
    #@phpMaker.processJSON()
    return
  @showOptions = ->
    scopes.ao.showMe = true
    scopes.ar.showMe = false

  return
])
