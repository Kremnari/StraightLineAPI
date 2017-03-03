((_base) ->
  phpBuilder = 
    injected : _base.injected
    run: () ->
      console.log 'starting phpBuilder'
      phpBuilder.processJSON()
      console.log '  api complied'
      console.log '  adding files to zip queue'
      phpBuilder.addFiles()
      return
      
    processJSON: ()->
      phpBuilder.neededFiles = phpBuilder.makePhp phpBuilder.injected.jsonFile.json
      return
      
    neededFilters: []
    ###
      This will populate arrays for each of the files.
      It should create phpBuilder.files[filename]
      because some files may have more than one replace string
    ###
    makePhp: (what) ->
      #vars
      output = []
      phpBuilder.files = {}
      phpBuilder.neededFilters = []
      
      #helper functions
      input = (varName) -> "$_input['#{varName}']"
      addFunction = (call, vars) -> 
        out = """
          function #{call}() {
            eval(scriptVars);
            #{input(each)+';\n' for each of vars}
          }
        """
      
      #main loop
      output.push "switch( #{input('noun')}) {"
      for coll, value of what.api
        output.push "  case \"#{coll}\": "
        output.push "    include('#{value.includePhpFile}');"
        phpBuilder.files[value.includePhpFile] = []
        output.push "    switch( #{input('type')}) {"
        for type, typeVars of what.api[coll].types
          output.push "      case \"#{type}\": "
          output.push "        switch( #{input('verb')}) {"
          for action, actionVars of what.api[coll].types[type].actions
            output.push "          case \"#{action}\": "
            output.push "            #{actionVars.call}();"
            phpBuilder.files[value.includePhpFile].push addFunction actionVars.call, actionVars.vars
            output.push "            break;"
          output.push "        }"
          output.push "        break;"
        output.push "    }"
        output.push  "    break;"
      output.push "}"
      phpBuilder.files['backend.php'] = {}
      phpBuilder.files['backend.php']['switch'] = output
      phpBuilder.files['backend.php']['switch'].join '\n'
      each.join '\n' for each in phpBuilder.files when Array.isArray(each)
      return
      
    addFiles: ->
      #phpBuilder.injected.zipAPI.addSourceFiles(phpBuilder.files).then ()->
      
    downloadAll: ->    
      phpBuilder.processJSON()
      phpBuilder.injected.zipSources.loadSF().then () ->
        phpBuilder.writer = new zip.BlobWriter
        zip.createWriter phpBuilder.writer, (zipWriter) ->
          addFile = (name, file)->
            zipWriter.add name, new zip.TextReader(file), nextFile
            return
          nextFile = ->
            for each of phpBuilder.neededFiles 
              phpBuilder.processedFiles ?= []
              continue if each in phpBuilder.processedFiles
              phpBuilder.processedFiles.push each
              if each is 'backend.php'
                phpBuilder.injected.zipSources.getFile('phpbackend/backend.php').then (file) ->
                  file.getData new zip.TextWriter(), (text) ->
                    addFile each, text.replace('#{SWITCH}#', phpBuilder.neededFiles[each])
              else 
                addFile each, phpBuilder.neededFiles[each]
              return
            zipWriter.close (blob) ->
              download(blob, 'project.zip', 'application/octet-stream')
              console.log 'done'
              return
            return
          nextFile()
          return
  scopes.cb.codeBuilders[_base.name] = phpBuilder
  #phpBuilder[_base.exec]() #function execution
  return
)(scopes.cb.adding)