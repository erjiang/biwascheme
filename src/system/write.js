
//  Object.prototype.inspect = function() {
//    var a = [];
//    for(var k in this){
//      //if(this.prototype[k]) continue;
//      a.push( k.toString() );//+" => "+this[k].toString() );
//    }
//    return "#<Object{"+a.join(",")+"}>";
//  }
Function.prototype.to_write = function() {
  return "#<Function "+(this.fname ? this.fname :
                        this.toSource ? this.toSource().truncate(40) :
                        "")+">";
}
String.prototype.to_write = function(){
  return '"' +
         this.replace(/\\|\"/g,function($0){return'\\'+$0;})
             .replace(/\x07/g, "\\a")
             .replace(/\x08/g, "\\b")
             .replace(/\t/g, "\\t")
             .replace(/\n/g, "\\n")
             .replace(/\v/g, "\\v")
             .replace(/\f/g, "\\f")
             .replace(/\r/g, "\\r") +
         '"';
}
//Number.prototype.inspect = function() { return this.toString(); }
Array.prototype.to_write = function(){
  if(this.closure_p)
    return "#<Closure>";

  var a = [];
  for(var i=0; i<this.length; i++){
    a.push(BiwaScheme.to_write(this[i]));
  }
  return '#(' + a.join(" ") + ')';
}
//  Array.prototype.memq = function(x){
//    for(var i=this.length-1; i>=0; i--){
//      if(this[i] === x)
//        return true;
//    }
//    return false;
//  }

//
// utility functions
//
BiwaScheme.to_write = function(obj){
  if(obj === undefined)
    return "undefined";
  else if(obj === null)
    return "null";
  else if(typeof(obj.to_write) == 'function')
    return obj.to_write();
  else if(isNaN(obj) && typeof(obj) == 'number')
    return "+nan.0";
  else{
    switch(obj){
      case true: return "#t";
      case false: return "#f";
      case BiwaScheme.nil: return "()";
      case Infinity: return "+inf.0";
      case -Infinity: return "-inf.0";
    }
  }
  return Object.inspect(obj);
}
BiwaScheme.to_display = function(obj){
  if(typeof(obj.valueOf()) == "string")
    return obj;
  else if(obj instanceof BiwaScheme.Symbol)
    return obj.name;
  else if(obj instanceof Array)
    return '#(' + obj.map(BiwaScheme.to_display).join(' ') + ')';
  else if(obj instanceof BiwaScheme.Pair)
    return obj.inspect(BiwaScheme.to_display);
  else if(obj instanceof BiwaScheme.Char)
    return obj.value;
  else
    return BiwaScheme.to_write(obj);
}

// write/ss (write with substructure)
// example:  > (let ((x (list 'a))) (list x x))                   //           (#0=(a) #0#)
// 2-pass algorithm.
// (1) detect all the objects which appears more than once
//     (find_cyclic, reduce_cyclic_info)
// (2) write object using this information
//   * add prefix '#n=' for first appearance
//   * just write '#n#' for other appearance

//TODO: support Values
BiwaScheme.write_ss = function(obj, array_mode){
  var known = [obj], used = [false];
  BiwaScheme.find_cyclic(obj, known, used);
  var cyclic   = BiwaScheme.reduce_cyclic_info(known, used);
  var appeared = new Array(cyclic.length);
  for(var i=cyclic.length-1; i>=0; i--) appeared[i] = false;

  return BiwaScheme.to_write_ss(obj, cyclic, appeared, array_mode);
}
BiwaScheme.to_write_ss = function(obj, cyclic, appeared, array_mode){
  var ret = "";
  var i = cyclic.indexOf(obj);
  if(i >= 0){
    if(appeared[i]){
      return "#"+i+"#";
    }
    else{
      appeared[i] = true;
      ret = "#"+i+"=";
    }
  }

  if(obj instanceof BiwaScheme.Pair && obj != BiwaScheme.nil){
    var a = [];
    a.push(BiwaScheme.to_write_ss(obj.car, cyclic, appeared, array_mode));
    for(var o=obj.cdr; o != BiwaScheme.nil; o=o.cdr){
      if(!(o instanceof BiwaScheme.Pair) || cyclic.indexOf(o) >= 0){
        a.push(".");
        a.push(BiwaScheme.to_write_ss(o, cyclic, appeared, array_mode));
        break;
      }
      a.push(BiwaScheme.to_write_ss(o.car, cyclic, appeared, array_mode));
    }
    ret += "(" + a.join(" ") + ")";
  }
  else if(obj instanceof Array){
    var a = obj.map(function(item){
      return BiwaScheme.to_write_ss(item, cyclic, appeared, array_mode);
    })
    if(array_mode)
      ret += "[" + a.join(", ") + "]";
    else
      ret += "#(" + a.join(" ") + ")";
  }
  else{
    ret += BiwaScheme.to_write(obj);
  }
  return ret;
}
BiwaScheme.reduce_cyclic_info = function(known, used){
  var n_used = 0;
  for(var i=0; i<used.length; i++){
    if(used[i]){
      known[n_used] = known[i];
      n_used++;
    }
  }
  return known.slice(0, n_used);
}
BiwaScheme.find_cyclic = function(obj, known, used){
  var items = (obj instanceof BiwaScheme.Pair)  ? [obj.car, obj.cdr] :
              (obj instanceof Array) ? obj :
              null;
  if(!items) return;

  items.each(function(item){
    if(typeof(item)=='number' || typeof(item)=='string' ||
      item === BiwaScheme.undef || item === true || item === false ||
      item === BiwaScheme.nil || item instanceof BiwaScheme.Symbol) return;
    
    var i = known.indexOf(item);
    if(i >= 0)
      used[i] = true;
    else{
      known.push(item);
      used.push(false);
      BiwaScheme.find_cyclic(item, known, used);
    }
  });
};


