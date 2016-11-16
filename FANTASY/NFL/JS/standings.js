
function invalidateLeagueStandings(standings,league){
  // Header ..
  standings.push(
    "<h1 style='text-align:center'>Team Standings</h1><br>"+
    "<table>" +
    "<tbody>" +
    "<tr>" +
    "<td></td>" +
    "<td></td>" +
    "<td><lnk2>W</lnk2></td>" +
    "<td><lnk2>L</lnk2></td>" +
    "<td><lnk2>T</lnk2></td>" +
    "<td><lnk2>PCT</lnk2></td>" +
    "<td><lnk2>HOME</lnk2></td>" +
    "<td><lnk2>ROAD</lnk2></td>" +
    "<td><lnk2>CONF</lnk2></td>" +
    "<td><lnk2>DIV</lnk2></td>" +
    "<td><lnk2>PF</lnk2></td>" +
    "<td><lnk2>PA</lnk2></td>" +
    "<td><lnk2>DIFF</lnk2></td>" +
    "<td><lnk2>STRK</lnk2></td>" +
    "</tr>"
  )
  // Teams ..
  var roster = [];
  var all_teams = 0;
  var current_league = {};
  if(league != "showteam"){
    current_league = g_league_roster
    all_teams = g_league_roster._team.length
  }
  else{
    current_league = g_CURRENT.SHOW_TEAMS
    all_teams = g_CURRENT.SHOW_TEAMS.length  
  }
  current_league._recordSort(roster,league)
  for(var i=0;i<all_teams;i++){
    var idx = roster[i]._idx
    var record = roster[i]
    standings.push(
      "<tr"+(i%2?" class=oddTRrow":"")+">" +
      "<td><row style='font-size:12px;width:-12px;'>"+(i+1)+"&nbsp;&nbsp;&nbsp;</row></td>"+
      "<td><lnk3 onclick=\"lnkTeam("+roster[i]._idx+",'"+league+"')\" title='"+(league!="showteam"?current_league._team[ idx ].FULLNAME:current_league[ idx ]._team)+"'>"+(league!="showteam"?" Team "+current_league._team[ idx ].LASTNAME:current_league[ idx ]._team)+"</lnk3></td>" +
      "<td><cat>"+record._overall[0]+"</cat></td>" +  // WIN 
      "<td><cat>"+record._overall[1]+"</cat></td>" +  // LOSS
      "<td><cat>"+record._overall[2]+"</cat></td>" +  // TIE
      "<td><cat class=hlt>"+record._pct+"</cat></td>" +
      "<td><cat>"+record._home._record[0]+"-"+record._home._record[1]+"-"+record._home._record[2]+"</cat></td>" + // HOME
      "<td><cat>"+record._road._record[0]+"-"+record._road._record[1]+"-"+record._road._record[2]+"</cat></td>" + // ROAD
      "<td><cat>"+record._conf._record[0]+"-"+record._conf._record[1]+"-"+record._conf._record[2]+"</cat></td>" +  // CONF
      "<td><cat>"+record._div._record[0]+"-"+record._div._record[1]+"-"+record._div._record[2]+"</cat></td>" +  // DIV
      "<td><cat>"+record._pf+"</cat></td>" +
      "<td><cat>"+record._pa+"</cat></td>" +
      "<td><cat>"+record._diff+"</cat></td>" +
      "<td><cat>"+record._strk+"</cat></td>" +
      "</tr>"
    )
  }
  // Footer ..
  standings.push(
    "</tbody>" +
    "</table>" +
    "<br>" +
    "<br>" +
    "<p style='color:cadetblue'>Standings are updated with the completion of each game." +
    "<h3 style='color:cadetblue'>Glossary</h3>" +
    "</p>" +
    "<table>" +
    "<tbody>" +
    "<tr>" +
    "<td style='width:200px;'>" +
    "<cat>" +
    "<li><b>W: </b>&nbsp;Wins</li><br>" +
    "<li><b>L: </b>&nbsp;Losses</li><br>" +
    "<li><b>T: </b>&nbsp;Ties</li><br>" +
    "<li><b>PCT: </b>&nbsp;Winning Percentage</li>" +
    "</cat>" +
    "</td>" +
    "<td style='width:200px;'>" +
    "<cat>" +
    "<li><b>HOME: </b>&nbsp;Home Record</li><br>" +
    "<li><b>ROAD: </b>&nbsp;Road Record</li><br>" +
    "<li><b>DIV: </b>&nbsp;Division Record</li><br>" +
    "<li><b>CONF: </b>&nbsp;Conference Record</li>" +
    "</cat>" +
    "</td>" +
    "<td style='width:200px;'>" +
    "<cat>" +
    "<li><b>PF: </b>&nbsp;Total Points For</li><br>" +
    "<li><b>PA: </b>&nbsp;Total Points Against</li><br>" +
    "<li><b>DIFF: </b>&nbsp;Point Differential</li><br>" +
    "<li><b>STRK: </b>&nbsp;Current Streak</li>" +
    "</cat>" +
    "</td>" +
    "</tr>" +
    "</tbody>" +
    "</table>"
  )
  return standings
}