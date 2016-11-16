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
function g_generate_schedule(weeks,lg,showteam){
  var max_games = weeks
  if(showteam){
    //var max_teams_per_div = lg.MAX_TEAMS_PER_DIVISION
    var max_teams = lg.TOTAL_SHOW_TEAMS
  }
  else{
    var max_teams_per_div = lg.MAX_TEAMS_PER_DIVISION
    var max_teams = (lg.MAX_CONFERENCES * lg.MAX_DIVISIONS * lg.MAX_TEAMS_PER_DIVISION)
  }
  var nextmatchup = 0
  var games = []
  var schedule = []
  var leagueLocked = {}
  for(var i=0;i<max_teams;i++){ // buildMatchups
  for(var j=0;j<max_teams;j++){
    if(i!=j){
      if(i in games){
        games[i].push([i,j])
      }
      else{
        games[i] = [[i,j]]
      }
    }
  }
  }
  for(var week=0;week<max_games;week++){
    schedule[week] = []
    schedule[week]._locked = {}
    games.map(
    function(game){
      var addGame = true
      game.map(
      function(team){ // buildSchedule
        var matchup = team[0]+","+team[1]
        if(
        addGame &&
        !schedule[week]._locked[team[0]] &&
        !schedule[week]._locked[team[1]] &&
        !leagueLocked[matchup]
        ){
          schedule[week].push(team)
          schedule[week]._locked[team[0]] = 1
          schedule[week]._locked[team[1]] = 1
          leagueLocked[matchup] = 1
          addGame = false
        }
        return team
      }
      )
      return game
    }
    )
    if(schedule[week].length<(max_teams/2)){  // reset scheduler
      schedule[week] = []
      week--
      leagueLocked = {}
      schedule.map(
      function(wk){
        wk._locked = {}
        return wk
      }
      )
    }
  }
  return schedule
}

