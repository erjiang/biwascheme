var BiwaScheme = BiwaScheme || {}; 

(function(){ //local namespace

  // readAttribute (taken from prototype.js 1.6.0)
  var readAttribute = function(element, name) {
    if (/*Prototype.Browser.IE*/ !!(window.attachEvent && !window.opera)){
      var t = {
        names: {
          'class': 'className',
          'for':   'htmlFor'
        },
        values: {
          _getAttr: function(element, attribute) {
            return element.getAttribute(attribute, 2);
          },
          _getAttrNode: function(element, attribute) {
            var node = element.getAttributeNode(attribute);
            return node ? node.value : "";
          },
          _getEv: function(element, attribute) {
            var attribute = element.getAttribute(attribute);
            return attribute ? attribute.toString().slice(23, -2) : null;
          },
          _flag: function(element, attribute) {
            return $(element).hasAttribute(attribute) ? attribute : null;
          },
          style: function(element) {
            return element.style.cssText.toLowerCase();
          },
          title: function(element) {
            return element.title;
          }
        }
      };
      if (t.values[name]) return t.values[name](element, name);
      if (t.names[name]) name = t.names[name];
      if (name.indexOf(':') > -1){
        return (!element.attributes || !element.attributes[name]) ? null :
         element.attributes[name].value;
      }
    }
    return element.getAttribute(name);
  }

  // Find the script tag
  var script = (function(e){ 
    if(e.id == '_firebugConsole'){
      return arguments.callee(document.body);
    }
    else if(e.nodeName.toLowerCase() == 'script'){
      return e;
    }
    else{
      return arguments.callee(e.lastChild);
    }
  })(document);

  var src = readAttribute(script, 'src');
  var dir = src.match(/(.*)development_loader.js/)[1];

  var script_tag = function(path){
    return '<script type="text/javascript" src="' +
             path +
           '"><\/script>';
  }
  var dir = "../";
  document.write(script_tag(dir+"/src/prototype.js"));
  document.write(script_tag(dir+"/src/stackbase.js"));
  document.write(script_tag(dir+"/src/library/r6rs_lib.js"));
  document.write(script_tag(dir+"/src/library/webscheme_lib.js"));
  document.write(script_tag(dir+"/src/library/extra_lib.js"));
  document.write(script_tag(dir+"/src/dumper.js"));
  document.write("<script type='text/javascript'>" +
    script.innerHTML +
    "<\/script>");
})();