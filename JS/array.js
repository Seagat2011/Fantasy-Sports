
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