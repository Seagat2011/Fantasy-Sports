Object.prototype.assert = function(u, v) {
  if (!(u in this)) {
    this[u] = v
  }
}
Object.prototype.iterate = function(cb) {
  var u = this;
  var i = 0;
  for (var x in u) {
    if (u.hasOwnProperty(x)) {
      cb(u[x], i++, this)
    }
  }
}
Object.prototype.forEach = function(cb){
  var u = this;
  var i = 0;
  for(var x in u){
    if(u.hasOwnProperty(x)){
      cb(x,u[x],this)
    }
  }
}
Object.prototype.remove = function(j) {
  var a = []
  this.map(function(u, i) {
    if (i != j) {
      a.push(u)
    }
  })
  return a
}
Object.prototype.iscompleted = function(n) {
  var ret = true
  var idx = n.join(",")
  if (idx in uncompleted) {
    ret = false
  }
  return ret
}
Object.prototype.complete = function(n) {
  var idx = n.join(",")
  if (idx in uncompleted) {
    var i = uncompleted[idx]
    uncompleted._gms = uncompleted._gms.remove(i)
    delete uncompleted[idx]
  }
}
Object.prototype.isdeferred = function(n) {
  this.assert("deferred", {})
  var t0 = (n[0]in this.deferred)
  var t2 = (n[1]in this.deferred)
  return ( t0 || t2)
}
Object.prototype.defer = function(n) {
  this.assert("deferred", {})
  deferred[n[0]] = 1
  deferred[n[1]] = 1
  this.deferred[n[0]] = 1
  this.deferred[n[1]] = 1
}
Object.prototype.encase = function(){
  return [this]
}
var teams = [32, 127, 124, 169, 249]
var games_p_season = [16, 12, 12, 12, 12]
var deferred = {}
var uncompleted
function interDivisioner(wk, available_games,gm) {
  available_games._gms.map(function(gm) {
    if (!wk.iscompleted(gm) && !wk.isdeferred(gm)) {
      wk.push(gm)
      wk.defer(gm)
      wk.complete(gm)
    }
  })
}
function intraDivisioner(wk,start,end) {
  for(var i=start;i<end;i++){
    for(var j=start;j<end;j++){
      if(i!=j){
        var gm = [i,j]
        if (!wk.iscompleted(gm) && !wk.isdeferred(gm)) {
          wk.push(gm)
          wk.defer(gm)
          wk.complete(gm)
        }
      }
    }
  }
}
function generateAvailableGames(tms) {
  var n = 0
  var u = uncompleted
  for (var i = 0; i < tms; i++) {
    for (var j = 0; j < tms; j++) {
      if (i != j) {
        var a = [i, j]
        u[a.join(",")] = n++
        u._gms.push(a)
      }
    }
  }
}
function nflDraft() {
  var wk = []
  g_teams_per_division.map(
    function(league,i){
      uncompleted = {
        _gms: []
      }
      generateAvailableGames(teams[i])
      wk.push([])
      var total_teams = teams[i]
      for(var matchup=0;matchup<2;matchup++){ // matchup #1,#2
        for(var j=0;j<games_p_season[i];j++){
          if(!(j in wk[i])){
            wk[i].push([])
          }
          var start = 0
          league.forEach(
            function(conferenceTitle,conference){
              conference.forEach(
                function(divisionTitle,division){
                  var end = start + division.team_total
                  intraDivisioner(wk[i][j],start,end)
                  start = end
                }
              )
            }
          )
        }
      }
    }
  )
  srcTranslated.value = "var g_core_showteam_schedule = "+JSON.stringify(wk, 2, 2)
}