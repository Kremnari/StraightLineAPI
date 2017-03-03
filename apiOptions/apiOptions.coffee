j2pApp.controller('apiOptions', ['jsonFile', 'codeBuilder', (jsonFile, cb) ->
  @showMe = false
  scopes.ao = this
  @jsonFile = jsonFile
  @srcrepo = 'remotehost'
  jsonFile.json.apiOptions ?= { src: {csf: 'none2', csb: 'none', sss: 'none', sdb: 'none'} }
  @srcs = {
    csf: ['none', 'angular'],
    csb: ['none', 'angularsrvc'],
    sss: ['none', 'php'],
    sdb: ['none', 'mongo']
  }
  @updatesrcs = () ->
    #Ping repo endpoint
    #parse json and replace values in @srcs
    
    return
  @loaded = []
  @hasLoaded = (what) ->
    scopes.ao.loaded[what]?
  @loadSources = (callBack) ->
    #populate these two vars with what needs loading
    scopes.ao.toLoad = ['php']
    scopes.ao.toLoadUrls = { php: 'phpViewer/phpBuilder.js' }
    scopes.ao.loadCB = callBack
    scopes.ao.loadLoop()
    return
  @loadLoop = () ->
    if scopes.ao.toLoad.length == 0
      scopes.ao.loadComplete()
      return
    next = scopes.ao.toLoad.pop()
    scopes.ao.loaded.push(next)
    console.log 'Loading '+next
    cb.loadCBFile(next, scopes.ao.toLoadUrls[next])
      .then ->
        scopes.ao.loadLoop()
        return
    return
  @loadComplete = ->
    console.log 'All loaded'
    scopes.ao.loadCB()
    return
  @test = () ->
    cb.loadCBFile('php', 'phpViewer/phpBuilder.js')
      .then ->
        cb.runCBFile 'php'
        return
    return
  return
])