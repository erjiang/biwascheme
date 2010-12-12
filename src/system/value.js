//
// Values
//
BiwaScheme.Values = Class.create({
  initialize: function(values){
    this.content = values;
  },
  to_write: function(){
    return "#<Values " +
             this.content.map(BiwaScheme.to_write).join(" ") +
           ">";
  }
});

//
// Nil
// javascript representation of empty list( '() )
//
BiwaScheme.nil = {
  toString: function() { return "nil"; },
  to_array: function() { return []; },
  length: function() { return 0; }
};

//
// #<void> (The "nothing" value)
//
BiwaScheme.undef = new Object();
BiwaScheme.undef.toString = function(){ return "#<void>"; }

// (eof-object)
BiwaScheme.eof = new Object;
