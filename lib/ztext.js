var ztext = exports;


//returns an associative array with words and
//counts of their occurances 
ztext.wordcounts = function(text){
  var word_array = text.toLowerCase().split(' ');

  var word_counts = {};

  for( i in word_array ){
    var key = word_array[i];
    if( word_counts[key] == null )
      word_counts[key] = 1;
    else
      word_counts[key] += 1;
  }

  return word_counts;

};

//multiplies all counts in a by n
ztext.scale = function(a, n){
  var word_counts = {};

  for( i in a) {
    word_counts[i] = a[i] * n;
  };

  return word_counts;

};

//takes elements from b and adds them to word_counts
//not exported- only to be used within this module
//since a parameter is modified
var combine = function(word_counts, b){
  for( i in b ){
    var key = i;

    if( word_counts[key] == null)
      word_counts[key] = b[key];
    else
      word_counts[key] += b[key];
  };

  return word_counts;
};

//returns new object, deep copy of a
ztext.copy = function(a){
  var word_counts = {};

  return combine(word_counts, a);
};

//adds 2 wordfreq vectors
ztext.add = function(a, b){
  //a + b = word_counts
  var word_counts = {};

  combine(word_counts, a);
  combine(word_counts, b);

  return word_counts;

};

//subtracts wordreq vector b from vector a
ztext.difference = function(a, b){
  return  ztext.add( a, ztext.scale(b, -1));
};

//returns true if vectors a and b contrain the same word counts
ztext.equals = function(a, b){
  var diff = ztext.difference(a, b);
  var accum = true;
  for( i in diff ){
    accum = (accum && diff[i] == 0);
  }

  return accum;
};

//word count of a given vector
ztext.vector_wordcount = function(vector){
  var accum = 0;
  for( i in vector ){
    accum += vector[i];
  };

  return accum;
};

ztext.squarefreqs = function(vector){

  var freq_vector = ztext.copy(vector);

  for( i in freq_vector ){
    freq_vector[i] = freq_vector[i]*freq_vector[i];        
  };

  return freq_vector;
};

//normalized word frequency, % of representation for each term
ztext.wordfreq = function(vector){
  return ztext.scale( vector, 1/ztext.vector_wordcount(vector) );
};


//returns a single int, word count of text
ztext.wordcount = function(text){
  console.log(text);
  if( typeof text !== 'string' )
    return ztext.vector_wordcount(text);

  var word_array = text.split(' ');
  return word_array.length;
};


//returns squared frequency vector on a string
ztext.distance = function(string1, string2){
  squared_vector = ztext.squarefreqs(
                    ztext.difference(
                      ztext.wordfreq(ztext.wordcounts(string1)), 
                      ztext.wordfreq(ztext.wordcounts(string2))
                      ));

  var accum = 0;
  for ( i in squared_vector ){
    accum += squared_vector[i];
  }

  return accum;

};



ztext.sortedWordCounts = function(wc){
  var sortable = [];
  for( i in wc ){
    sortable.push([i, wc[i]]);
  }
  sortable.sort(function(a, b) { return a[1] - b[1] })

  return sortable;

}



