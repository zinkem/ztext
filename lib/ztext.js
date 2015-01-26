var ztext = exports;


function Dictionary(){
  this.root = null;
  this.size = 0;
}
ztext.Dictionary = Dictionary;

Dictionary.prototype.add = function(object){
  n_object = new WC(object.key, object.count)
  this.size++;
  if(this.root == null)
    this.root = n_object;
  else
    this.place(this.root, n_object)
}

Dictionary.prototype.place = function(tree_node, object){
  var current = tree_node;

  if( current.key == object.key ){
    current.count += object.count;
    return current;
  }

  if( current.key > object.key){
    if( current.left == null)
      current.left = object;
    else 
      this.place(current.left, object)
  } else {
    if( current.right == null)
      current.right = object;
    else 
      this.place(current.right, object)

  }

}

Dictionary.prototype.get = function(key){
  if(this.root == null)
    return null;
  else
    return this.retrieve(this.root, key)
}

Dictionary.prototype.retrieve = function(tree_node, key){
  var current = tree_node;
  if( current.key == key ){
    return current;
  }

  if( current.key > key){
    if( current.left == null)
      return null;
    else 
      return this.retrieve(current.left, key)
  } else {
    if( current.right == null)
      return null;
    else 
      return this.retrieve(current.right, key)
  }

}

Dictionary.prototype.print = function(tree_node){

  if( tree_node == null){
    if( this.root != null){
      this.print(this.root);
    } else {
      console.log("NO DICT!")
    }
    return 0;
  }

  if( tree_node.left !== null) this.print(tree_node.left);

  console.log(tree_node.key + " " + tree_node.count)

  if( tree_node.right !== null) this.print(tree_node.right);
}

Dictionary.prototype.loadArray = function(array, tree_node){
  if( tree_node == null){
    if( this.root != null){
      this.loadArray(array, this.root);
    } else {
      console.log("NO DICT TO LOAD ARRAY!")
    }
    return 0;
  }

  if( tree_node.left !== null) this.loadArray(array, tree_node.left);

  array.push(new WC(tree_node.key, tree_node.count));

  if( tree_node.right !== null) this.loadArray(array, tree_node.right);
}

Dictionary.prototype.map = function(fn, tree_node){
  if( tree_node == null){
    if( this.root != null){
      this.map(fn, this.root);
    } else {
      console.log("NO DICT TO MAP!")
    }
    return 0;
  }

  if( tree_node.left !== null) this.map(fn, tree_node.left);

  fn(new WC(tree_node.key, tree_node.count));

  if( tree_node.right !== null) this.map(fn, tree_node.right);
}

function WC(k, c){
  this.key = k;
  this.count = c;
  this.left = null;
  this.right = null;
}


//returns an associative array with words and
//counts of their occurances 
ztext.wordcounts = function(text){
  //var word_array = text.split(' ');
  var word_array = text.toLowerCase().split(' ');
  var word_counts = new Dictionary();

  for (i in word_array){
     word_counts.add(new WC(word_array[i], 1))
  }

  return word_counts;

};

//multiplies all counts in a by n
ztext.scale = function(a, n){
  var word_counts = new Dictionary();

  a.map(function(node){
    node.count = node.count * n;
    word_counts.add(node);
  });

  return word_counts;

};

//takes elements from b and adds them to word_counts
//not exported- only to be used within this module
//since a parameter is modified
var combine = function(word_counts, b){

  b.map(function(tree_node){
    word_counts.add(tree_node);
  });

  return word_counts;
};

//returns new object, deep copy of a
ztext.copy = function(a){
  var word_counts = new Dictionary();

  return combine(word_counts, a);
};

//adds 2 wordfreq vectors
ztext.add = function(a, b){
  //a + b = word_counts
  var word_counts = new Dictionary();

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



