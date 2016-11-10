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
    NFL/NCAA scheduling tool (FANTASY TEAMS)

  INPUT: 
    league (NFL,NCAA II,etc), total games

  OUTPUT:
    FANTASY Season

  SCRIPT TYPE: 
    (helper) scheduling tool

*/

var sg2011_deferred = {}
var sg2011_completed = {}
var sg2011_uncompleted

function sg2011_generateAvailableGames(tms){
  var n = 0
  for(var i=0;i<tms;i++){
    for(var j=0;j<tms;j++){
      if(i!=j){
        var a = [i,j]
        sg2011_uncompleted[a.join(",")] = a
      }
    }
  }
}
// used to generate expanded (full) fantasy schedule //
function sg2011_interDivisioner(wk,range,available_games){
  available_games.forEach(
    function(_,gm){
      if((Math.abs(gm[0]-gm[1])>range) && !wk.sg2011_iscompleted(gm) && !wk.sg2011_isdeferred(gm)){
        wk.push(gm)
        wk.sg2011_defer(gm)
        wk.sg2011_complete(gm)
      }
    }
  )
}
// used to generate core-fanasy-schedule //
function sg2011_intraDivisioner(k,range,WK){
  var K = k+range
  var x = WK.length-1
  var wk = WK[x]
  sg2011_uncompleted.forEach(
    function(_,gm){
      if((gm[0]>=k&&gm[1]<=K) && !wk.sg2011_iscompleted(gm) && !wk.sg2011_isdeferredGlobal(gm)){
        wk.push(gm)
        wk.sg2011_defer(gm)
        wk.sg2011_complete(gm)
      }
    }
  )
}
function g_generate_schedule(weeks,lg){
  var div = 0
  var teams_p_div = lg.MAX_TEAMS_PER_DIVISION
  var confs = lg.MAX_CONFERENCES
  var divs = lg.MAX_DIVISIONS
  var matchups = (lg.MAX_CONFERENCES * lg.MAX_DIVISIONS)
  var all_teams = (lg.MAX_CONFERENCES * lg.MAX_DIVISIONS * lg.MAX_TEAMS_PER_DIVISION)
  var game_pairs = Math.floor( (lg.MAX_CONFERENCES * lg.MAX_DIVISIONS * lg.MAX_TEAMS_PER_DIVISION) / 2 )
  var wk = []
  sg2011_uncompleted = {}
  sg2011_generateAvailableGames( all_teams )
  var code = []
  for(var k=0;k<weeks;k++){ // build core-schedule (ie division games) //
    code.push("div=0","sg2011_deferred={}","wk.push( [] )")
    for(var i=0;i<matchups;i++){
      code.push("sg2011_intraDivisioner(div,teams_p_div,wk)","div += teams_p_div")
    }
  }
  eval(code.join("\n"))
  sg2011_deferred={}
  wk.map( // fill vacancies with inter-divisional matchups //
    function(u){
      if(game_pairs-u.length){
        sg2011_interDivisioner(u,teams_p_div,sg2011_uncompleted)
      }
    }
  )
  return wk
}
