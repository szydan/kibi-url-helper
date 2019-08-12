$( document ).ready(function() {

  $('#url').focus();
  
  function findPart(name, parts) {
    for (var i=0; i < parts.length; i++ ) {
      var part = parts[i];
      if (part.indexOf(name) === 0) {
        return part.substring(name.length + 1).replace(/\r?\n|\r/g, '');
      }
    }
    return null;
  }

  function setEditor(editor, value) {
    if(!value) {
      return
    }
    try {
      var decoded = rison.decode(value);
      console.log(decoded);
      editor.setValue(JSON.stringify(decoded, null, ' '));
    } catch (e) {
      console.log(e)
      $('#error').val(e.message);
    }
  }

  function encodeToRison(s) {
    try {
      var o = JSON.parse(s);
      return rison.encode(o);
    } catch (e) {
      console.log(e)
      $('#error').val(e.message);
    }
    return null;
  }

  function createEditor(id) {
    var editor = ace.edit(id);
    editor.setTheme("ace/theme/textmate");
    editor.getSession().setMode("ace/mode/javascript");
    editor.setOptions({
      autoScrollEditorIntoView: true,
      tabSize: 2
    });
    return editor;
  }

  var hostAndPath = '';
  var _a = createEditor('_a');
  var _g = createEditor('_g');
  var _k = createEditor('_k');

  $('#toObjects').click(function () {
    var url = $('#url').val();
    url = decodeURIComponent(url);
    // grab parts 
    var index = url.indexOf('?');
    var search = url.substring(index+1);
    hostAndPath = url.substring(0, index);
    var parts = search.split('&');

    var kibiState = findPart('_k', parts);  
    var globalState = findPart('_g', parts);  
    var appState = findPart('_a', parts);  

    console.log("["+appState+"]");
    console.log("["+globalState+"]");
    console.log("["+kibiState+"]");
    
    setEditor(_a, appState);
    setEditor(_g, globalState);
    setEditor(_k, kibiState);
  });

  $('#toURL').click(function () {
    var appStateString = _a.getValue();
    var globalStateString = _g.getValue();
    var kibiStateString = _k.getValue();

    console.log("["+appStateString+"]");
    console.log("["+globalStateString+"]");
    console.log("["+kibiStateString+"]");

    var appState = encodeToRison(appStateString);
    var globalState = encodeToRison(globalStateString);
    var kibiState = encodeToRison(kibiStateString);

    console.log("RISON");

    console.log("["+appState+"]");
    console.log("["+globalState+"]");
    console.log("["+kibiState+"]");

    var urlParts = [];
    if(appState) {
      urlParts.push('_a=' + appState);
    }
    if(globalState) {
      urlParts.push('_g=' + globalState);
    }
    if(kibiState) {
      urlParts.push('_k=' + kibiState);
    }
    $("#url").val(hostAndPath + '?' + urlParts.join('&'))


  });

});
