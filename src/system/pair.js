//
// Pair 
// cons cell
//

BiwaScheme.Pair = Class.create({
  initialize: function(car, cdr){
    this.car = car;
    this.cdr = cdr;
  },

// According to TSPL3, these are defined for
// up to 4 cars and cdrs.

  caar: function(){ return this.car.car; },
  cadr: function(){ return this.cdr.car; },
  cdar: function(){ return this.cdr.car; },
  cddr: function(){ return this.cdr.cdr; },

  caaar: function(){ return this.car.car.car; },
  caadr: function(){ return this.cdr.car.car; },
  cadar: function(){ return this.car.cdr.car; },
  cdaar: function(){ return this.car.car.cdr; },
  caddr: function(){ return this.cdr.cdr.car; },
  cdadr: function(){ return this.cdr.car.cdr; },
  cddar: function(){ return this.car.cdr.cdr; },
  cdddr: function(){ return this.cdr.cdr.cdr; },

  caaaar: function(){ return this.car.car.car.car; },
  caaadr: function(){ return this.cdr.car.car.car; },
  caadar: function(){ return this.car.cdr.car.car; },
  cadaar: function(){ return this.car.car.cdr.car; },
  caaddr: function(){ return this.cdr.cdr.car.car; },
  cadadr: function(){ return this.cdr.car.cdr.car; },
  caddar: function(){ return this.car.cdr.cdr.car; },
  cadddr: function(){ return this.cdr.cdr.cdr.car; },

  cdaaar: function(){ return this.cdr.car.car.cdr; },
  cdaadr: function(){ return this.cdr.car.car.cdr; },
  cdadar: function(){ return this.car.cdr.car.cdr; },
  cddaar: function(){ return this.car.car.cdr.cdr; },
  cdaddr: function(){ return this.cdr.cdr.car.cdr; },
  cddadr: function(){ return this.cdr.car.cdr.cdr; },
  cdddar: function(){ return this.car.cdr.cdr.cdr; },
  cddddr: function(){ return this.cdr.cdr.cdr.cdr; },

  first:  function(){ return this.car; },
  second: function(){ return this.cdr.car; },
  third:  function(){ return this.cdr.cdr.car; },
  fourth: function(){ return this.cdr.cdr.cdr.car; },
  fifth:  function(){ return this.cdr.cdr.cdr.cdr.car; },

  // returns array containing all the car's of list
  // '(1 2 3) => [1,2,3]
  // '(1 2 . 3) => [1,2]
  to_array: function(){
    var ary = [];
    for(var o = this; o instanceof BiwaScheme.Pair && o != BiwaScheme.nil; o=o.cdr){
      ary.push(o.car);
    }
    return ary;
  },

  to_set: function(){
    var set = new BiwaScheme.Set();
    for(var o = this; o instanceof BiwaScheme.Pair && o != BiwaScheme.nil; o=o.cdr){
      set.add(o.car);
    }
    return set;
  },

  length: function(){
    var n = 0;
    for(var o = this; o instanceof BiwaScheme.Pair && o != BiwaScheme.nil; o=o.cdr){
      n++;
    }
    return n;
  },

  // calls the given func passing each car of list
  // returns cdr of last Pair
  foreach: function(func){
    for(var o = this; o instanceof BiwaScheme.Pair && o != BiwaScheme.nil; o=o.cdr){
      func(o.car);
    }
    return o;
  },

  // Returns an array which contains the resuls of calling func
  // with the car's as an argument.
  // If the receiver is not a proper list, the last cdr is ignored.
  // The receiver must not be a cyclic list.
  map: function(func){
    var ary = [];
    for(var o = this; BiwaScheme.isPair(o); o = o.cdr){
      ary.push(func(o.car));
    }
    return ary;
  },

  // Destructively concat the given list to the receiver.
  // The receiver must be a proper list.
  // Returns the receiver.
  concat: function(list){
    var o = this;
    while(o instanceof BiwaScheme.Pair && o.cdr != BiwaScheme.nil){
      o = o.cdr;
    }
    o.cdr = list;
    return this;
  },

  // returns human-redable string of pair
  inspect: function(conv){
    conv || (conv = Object.inspect);
    var a = [];
    var last = this.foreach(function(o){
      a.push(conv(o));
    });
    if(last != BiwaScheme.nil){
      a.push(".");
      a.push(conv(last));
    }
    return "(" + a.join(" ") + ")";
  },
  toString : function(){
    return this.inspect();
  },

  to_write: function(){
    return this.inspect(BiwaScheme.to_write);
  }
});
BiwaScheme.List = function(){
  return $A(arguments).to_list();
};

// Converts an array to a (proper) list.
// Example:
//   [1,2,3].to_list()      //=> (1 2 3)
Array.prototype.to_list = function(){
  var list = BiwaScheme.nil;
  for(var i=this.length-1; i>=0; i--){
    list = new BiwaScheme.Pair(this[i], list);
  }
  return list;
}
