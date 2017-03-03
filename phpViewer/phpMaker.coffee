j2pApp.factory 'phpMaker', ['$timeout', 'jsonFile', 'zipSources', ($timeout, jsonFile, zipSources)  ->
  phpMaker =
    final: " "
    sourceZip: null
    
    processJSON: ->
      console.log 'starting'
      phpMaker.neededFiles = phpMaker.makePhp jsonFile.json
      phpMaker.final = phpMaker.neededFiles['backend.php']
      return
    neededFilters: []
    makePhp: (what) ->
      input = (varName) -> '$_input['+varName+']'
      output = []
      fn = {}
      phpMaker.neededFilters = []
      
      addFunction = (call, vars) -> 
        out = 'function '+call+'() {\n'
        out += '  '+input(each)+';\n' for each of vars
        out += '}\n'
        out
      
      output.push "switch( #{input('noun')}) {"
      for coll, value of what.api
        output.push "  case \"#{coll}\": "
        output.push "    include('#{value.includePhpFile}');"
        fn[value.includePhpFile] = []
        output.push "    switch( #{input('type')}) {"
        for type, typeVars of what.api[coll].types
          output.push "      case \"#{type}\": "
          output.push "        switch( #{input('verb')}) {"
          for action, actionVars of what.api[coll].types[type].actions
            output.push "          case \"#{action}\": "
            output.push "            #{actionVars.call}();"
            fn[value.includePhpFile].push addFunction actionVars.call, actionVars.vars
            output.push "            break;"
          output.push "        }"
          output.push "        break;"
        output.push "    }"
        output.push  "    break;"
      output.push "}"
      fn['backend.php'] = output.join '\n'
      return fn
    makeFnFile: (what) ->
      output = []
      output.push 'function '+each+'(){\n\n}' for each in what
      return output.join '\n'
    downloadAll: ->    
      phpMaker.processJSON()
      zipSources.loadSF().then () ->
        phpMaker.writer = new zip.BlobWriter
        zip.createWriter phpMaker.writer, (zipWriter) ->
          addFile = (name, file)->
            zipWriter.add name, new zip.TextReader(file), nextFile
            return
          nextFile = ->
            for each of phpMaker.neededFiles 
              phpMaker.processedFiles ?= []
              continue if each in phpMaker.processedFiles
              phpMaker.processedFiles.push each
              if each is 'backend.php'
                zipSources.getFile('phpbackend/backend.php').then (file) ->
                  file.getData new zip.TextWriter(), (text) ->
                    addFile each, text.replace('#{SWITCH}#', phpMaker.neededFiles[each])
              else 
                addFile each, phpMaker.neededFiles[each]
              return
            zipWriter.close (blob) ->
              download(blob, 'project.zip', 'application/octet-stream')
              console.log 'done'
              return
            return
          nextFile()
          return
  scopes.phpMaker = phpMaker
  phpMaker
]