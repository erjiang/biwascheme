//
// String
//
// Source code below adapted from foxscheme/src/system/string.js
//
/*
 * BiwaScheme.String
 *
 * BiwaScheme uses its own FoxScheme.String object so that
 * (eq? "abc" "abc") => #f
 */
BiwaScheme.String = Class.create({
    // guard against accidental non-instantiation
    initialize: function(str) {
        if(typeof(str) === "string")
            this.value = str;
        else
            throw new BiwaScheme.Bug("Tried to create String from non-string","String");
    },
    length: function() {
        return this.value.length;
    },
    set: function(i, c) {
        if(!(c instanceof BiwaScheme.Char))
            throw new BiwaScheme.Error(c+" is not a Char", "String.set");
        if(i < 0 || i > this.value.length)
            throw new BiwaScheme.Error("Invalid index "+i, "String.set");
        this.value = this.value.slice(0, i)+ c.value +this.value.slice(i+1);
        return;
    },
    ref: function(i) {
        if(i < 0 || i > this.value.length)
            throw new BiwaScheme.Error("Invalid index "+i, "String.get");
        
        return this.value[i];
    },
    to_write: function() {
        return '"'+this.value+'"';
    },
    inspect: function() {
        return '"'+this.value+'"';
    },
    toString: function() {
        return this.value;
    }
});
