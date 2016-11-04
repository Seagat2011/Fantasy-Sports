/*

  TITLE: 
    FANTASY SPORTS

  AUTHOR: Seagat2011 
    http://eterna.cmu.edu/web/player/90270/

  VERSION: 
    Major.Minor.Release.Build
    1.0.0.0

  STYLEGUIDE: 
    http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml

  REFERENCES:
    http://www.espn.go.com/

  DESCRIPTION: 
    NFL/NCAA scheduling tool (SHOWTEAMS)

  INPUT: 
    g_core_showteam_schedule, league (NFL,NCAA II,etc), total games

  OUTPUT:
    NFL/NCAA Season

  SCRIPT TYPE: 
    (helper) scheduling tool

*/

var teams = [32, 127, 124, 169, 249]
var uncompleted
function interDivisioner(wk, available_games) {
  available_games.forEach(function(_,gm) {
    if (!wk.isdeferred(gm)) {
      wk.push(gm)
      wk.defer(gm)
      wk.complete(gm)
    }
  })
}
function generateAvailableGames(tms) {
  var n = 0
  var u = uncompleted
  for (var i = 0; i < tms; i++) {
    for (var j = 0; j < tms; j++) {
      if (i != j) {
        var a = [i, j]
        u[a.join(",")] = a
      }
    }
  }
}
function g_generate_NFL_schedule(N,G) {
  uncompleted = {}
  generateAvailableGames(teams[N])
  var result = g_core_showteam_schedule[N].map(
    function(wk){
      if(G-wk.length){
        interDivisioner(wk,uncompleted)
      }
      else{
        wk.map(
          function(game){
            wk.complete(game)
            return game
          }
        )
      }
      return wk
    }
  )
  return result
}
