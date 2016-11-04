function tallyClubScore(team){
  var livePro = 0;
  ["QB","WR","RB","TE","D/ST","K"].map(
  function(POS){
    var players = g_league_roster[ POS ][ team ]
    if(players && (0 in players)){
      players.map(
      function(player){
        if(player && !player.BENCH){
          livePro += (player.AVG+2)
        }
        return player
      })
    }
    else
    if(players && !players.BENCH){
      livePro += (players.AVG+2)
    }
  })
  return livePro  
}
function get_team_livepros( teams ){
  var livePros = [0,0]
  livePros[0] = tallyClubScore(teams[0])
  livePros[1] = tallyClubScore(teams[1])
  return livePros
}
function get_team_lines( team_livepro ){
  var avg = Number(Math.abs(team_livepro[0]-team_livepro[1])/2).toFixed(1)
  var team_line = [(team_livepro[0]>team_livepro[1]?"-"+avg:"+"+avg),(team_livepro[1]>team_livepro[0]?"-"+avg:"+"+avg)]
  return team_line
}
function invalidateCurrentMatchup(wk){
  var find_team = true
  var teams = []
  g_fantasy_schedule[ wk ].map(
    function(team){
      if(
      (find_team && team[0]==0) ||
      (find_team && team[1]==0) ){
        teams = team
        find_team = false
      }
      return team
    }
  )
  if(teams){
  var player1 = teams[0]
  var player2 = teams[1]
  var team_livepro = get_team_livepros(teams)
  var team_line = get_team_lines( team_livepro )
  var mu = [
    "<table class=matchup>",
    "<tbody>",
    "<tr id=teamscrg_5_activeteamrow>",
    "<td class=team>",
    "<div class=name>",
    "<lnk id=lnkTeam5 title=\"Team "+g_league_roster._team[ player1 ].LASTNAME+" ("+g_league_roster._team[ player1 ].FULLNAME+")\">Team "+g_league_roster._team[ player1 ].LASTNAME+"</lnk>", 
    "<span id=spAbbrev class=abbrev>("+g_league_roster._team[ player1 ].LASTNAME+")</span>",
    "</div>",
    "<div>",
    "<span id=spTeamRecord5 class=record title=\"Record\">("+g_league_roster._record[ player1 ]._overall[0]+"-"+g_league_roster._record[ player1 ]._overall[1]+")</span>",
    "<span class=owners>"+g_league_roster._team[ player1 ].FULLNAME+"</span>",
    "</div>",
    "</td>",
    "<td class=score title=\"0\" id=tmTotalPts_5 width=\"18%\">0</td>",
    "</tr>",
    "<tr id=teamscrg_3_activeteamrow>",
    "<td class=team>",
    "<div class=name>",
    "<lnk id=lnkTeam3 title=\"Team "+g_league_roster._team[ player2 ].LASTNAME+" ("+g_league_roster._team[ player2 ].FULLNAME+")\">Team "+g_league_roster._team[ player2 ].LASTNAME+"</lnk>", 
    "<span id=spAbbrev class=\"abbrev\">("+g_league_roster._team[ player2 ].LASTNAME+")</span>",
    "</div>",
    "<div>",
    "<span id=spTeamRecord3 class=record title=\"Record\">("+g_league_roster._record[ player2 ]._overall[0]+"-"+g_league_roster._record[ player2 ]._overall[1]+")</span>",
    "<span class=owners>"+g_league_roster._team[ player2 ].FULLNAME+"</span>",
    "</div>",
    "</td>",
    "<td class=score title=\"0\" id=tmTotalPts_3 width=\"18%\">0</td>",
    "</tr>",
    "<tr>",
    "<td colspan=\"2\" class=info>",
    "<div class=boxscoreLinks>",
    "<lnk onclick='hideClubhouseDiv()'>Quick Box Score</lnk> | ",
    "<lnk onclick='lnkTeam("+(player1==0?player2:player1)+")'>Full Box Score</lnk>",
    "</div>",
    "<table class=scoringDetails>",
    "<tbody>",
    "<tr>",
    "<td class=abbrev>"+g_league_roster._team[ player1 ].LASTNAME+"</td>",
    "<td class=labels>",
    "<div title=\"Players yet to Play\">Yet to Play:</div>",
    "<div title=\"Players In Play\">In Play:</div>",
    "<div title=\"Minutes Remaining\">Mins Left:</div>",
    "<div title=\"Projected Total\">Proj Total:</div>",
    "<div title=\"Game Line\">Line:</div>",
    "<div>Top Scorer:</div>",
    "</td>",
    "<td class=playersPlayed>",
    "<div id=team_ytp_5>9</div>",
    "<div id=team_ip_5>0</div>",
    "<div id=team_pmr_5>540</div>",
    "<div id=team_liveproj_5>"+team_livepro[0]+"</div>",
    "<div id=team_line_5>"+team_line[0]+"</div>",
    "<div id=team_topscorer_5>None</div>",
    "</td>",
    "<td class=\"homeTeam abbrev\">"+g_league_roster._team[ player2 ].LASTNAME+"</td>",
    "<td class=labels>",
    "<div title=\"Players yet to Play\">Yet to Play:</div>",
    "<div title=\"Players In Play\">In Play:</div>",
    "<div title=\"Minutes Remaining\">Mins Left:</div>",
    "<div title=\"Projected Total\">Proj Total:</div>",
    "<div title=\"Game Line\">Line:</div>",
    "<div>Top Scorer:</div>",
    "</td>",
    "<td class=playersPlayed>",
    "<div id=team_ytp_3>9</div>",
    "<div id=team_ip_3>0</div>",
    "<div id=team_pmr_3>540</div>",
    "<div id=team_liveproj_3>"+team_livepro[1]+"</div>",
    "<div id=team_line_3>"+team_line[1]+"</div>",
    "<div id=team_topscorer_3>None</div>",
    "</td>",
    "</tr>",
    "</tbody>",
    "</table>",
    "</td>",
    "</tr>",
    "</tbody>",
    "</table>",
    ]
  }
  else{
    var mu = ["BYE WEEK. Click Play Week to continue.."]
  }
return mu
}