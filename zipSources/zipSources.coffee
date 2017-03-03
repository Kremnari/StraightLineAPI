j2pApp.factory 'zipSources', ['jsonFile', (jsonFile)  ->
  zipSources =
    sourceFile: null
    url: 'zipSources/zipProvider.php?files[]=mongo&files[]=php'
    setUrl: (what) ->
      zipSources.url = what
      return
    loadSF: () ->
      new Promise (resolve) ->
        resolve() if zipSources.sourceFile?
        xhr = new XMLHttpRequest()
        xhr.open 'GET', zipSources.url
        xhr.responseType = 'blob'
        xhr.onload = (e) ->
          if(this.status == 200)
            zip.createReader new zip.BlobReader(this.response), (reader) ->
              zipSources.sourceFile = reader
              resolve()
          return
        xhr.send()
    getFile: (what) ->
      new Promise (resolve) ->
        return null if !zipSources.sourceFile?
        zipSources.sourceFile.getEntries (list) ->
          for key, each of list
            if each.filename==what
              resolve each
          return
        return
    addAPIFile: (what) ->
      return
  scopes.zipSources = zipSources
  zipSources
]