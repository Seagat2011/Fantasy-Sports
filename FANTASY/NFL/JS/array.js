
Array.prototype._removeIndex = function(m){
  var a = []
  this.map(
    function(u,n){
      if(m!=n){
        a.push(u)
      }
    }
  );  
  return a
}
Array.prototype._removePlayerNamed = function(fn){
  var a = []
  if(this instanceof Array){
    this.map(
      function(u){
        if(u.FULLNAME!=fn){
          a.push(u)
        }
      }
    )
  }
  return a
}