j2pApp.factory 'codeBuilder', ['$timeout', 'jsonFile', 'zipSources', ($t, jsonFile, zipSources) ->
  codeBuilder = 
    codeBuilders : {}
    adding: {}
    
    loadCBFile : (name, url) ->
      new Promise (success, failure) ->
        success() if codeBuilder.codeBuilders[name]?
        codeBuilder.adding.name = name
        codeBuilder.adding.injected = {jsonFile: jsonFile, zipSources: zipSources }
        $.getScript(url).done (src, status) ->
          codeBuilder.adding = {}
          success()
    runCBFile : (callname) ->
      codeBuilder.codeBuilders[callname].run(jsonFile, zipSources)
      return
  
  scopes.cb = codeBuilder
  codeBuilder
]