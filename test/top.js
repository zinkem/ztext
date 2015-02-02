var ztext = require('../lib/ztext');

var silly_string = "a sly red fox fox"
var other_string = "the sly blue fox hound"

var colors = {
  Clear       : "\33[0;0m",
  Black       : "\33[0;30m",
  Blue        : "\33[0;34m",
  Green       : "\33[0;32m",
  Cyan        : "\33[0;36m",
  Red         : "\33[0;31m",
  Purple      : "\33[0;35m",
  Brown       : "\33[0;33m",
  Gray        : "\33[0;37m",
  DarkGray    : "\33[1;30m",
  LightBlue   : "\33[1;34m",
  LightGreen  : "\33[1;32m",
  LightCyan   : "\33[1;36m",
  LightRed    : "\33[1;31m",
  LightPurple : "\33[1;35m",
  Yellow      : "\33[1;33m",
  White       : "\33[1;37m"
}

function cprint(msg, color){
  if(color == null)
    color = colors.Yellow;
  console.log(color + msg + colors.Gray);
}

var testresults = [];
function assert(bool){
  if( bool )
    cprint("PASSED", colors.Green)
  else
    cprint("FAILED", colors.Red)

  testresults.push(bool);
}

cprint(silly_string, colors.Yellow);


var wc = ztext.wordcount(silly_string);
cprint("wordcount('" + silly_string + "') == " + wc, colors.Yellow);
assert(wc == 5);

var silly_wf = ztext.wordcounts(silly_string);

silly_wf.print();

cprint("wordcounts('"+silly_string+"')")
assert( silly_wf.root != null )
assert( silly_wf.get("fox").count == 2 )


var other_wf = ztext.wordcounts(other_string);
console.log(other_string)
cprint("wordcounts('"+other_string+"')")
assert( other_wf.get("sly") != null )
assert( other_wf.get("red") == null )


var add = ztext.add(silly_wf, other_wf);

add.print();
cprint("ztext.add(silly_wf,other_wf)");
assert( add.get("fox").count == 3)
assert( add.get("sly").count == 2)
assert( add.get("red").count == 1)
var accum = 0;
add.map(function(word){
  accum += word.count;
})
assert( accum == 10)


var scaled_n1 = ztext.scale(silly_wf, -1);
scaled_n1.print();
cprint("ztext.scale(silly_wf, -1);")
assert( scaled_n1.get("fox").count == -2)

/*
var subtract = ztext.add(add, scaled_n1);
console.log(subtract)

var subtract2 = ztext.add(silly_wf, scaled_n1);
console.log(subtract2)

var subtract3 = ztext.difference(add, silly_wf);
console.log(subtract3)


var equal = ztext.equals(silly_wf, other_wf)
console.log(equal);

var equal2 = ztext.equals(silly_wf, silly_wf)
console.log(equal2);

var equal3 = ztext.equals(subtract3, other_wf)
console.log(equal3);


var vwc = ztext.wordcount(add);
console.log(vwc);

var nwf = ztext.wordfreq(add);
console.log(nwf);

var dist = ztext.distance(silly_string, other_string);
console.log(dist);



*/