var BiwaScheme = BiwaScheme || {};

BiwaScheme.Version = "0.6-erjiang";
BiwaScheme.GitCommit = "3ab9ebca55b47f04455d16d1c26923a884be8aa9";

  // FIXME: used by js-load. should be moved
BiwaScheme.require = function(src, check, proc){
  var script = document.createElement('script')
  script.src = src;
  document.body.appendChild(script);

  var checker = new Function("return !!(" + check + ")");

  if(checker()) proc();
  else          setTimeout(function(){ checker() ? proc() : setTimeout(arguments.callee, 10); }, 10);
};
