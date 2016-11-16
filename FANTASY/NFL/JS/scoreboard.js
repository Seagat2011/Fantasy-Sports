
function invalidateScoreboard(wk,showteam){
  // Header ..
  var mu = ["<table><tbody>"];
  // Teams ..
  if(!showteam){
    var current = g_fantasy_schedule[ wk ]
    var league = g_league_roster
  }
  else{
    var current = g_showteam_schedule[ wk ]
    var league = g_CURRENT.SHOW_TEAMS
  }
  current.map(
    function(team,i){
      if(team){
        var j = i+1
        var head = "<td>"
        var tail = "</td><td></td>"
        if(j%2==0){
          head = "<tr>"+head
        }
        else
        if(j%2){
          tail += "</tr>"        
        }
        mu.push( head )
        team.buildScoreboard(league,mu,showteam)
        mu.push( tail )
      }
      return team
    }
  );
  mu.push("</tbody></table>")
  return mu
}