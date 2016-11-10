
Object.prototype.updatePRK = function(rankings){
  var self = this
  if(!(self.AVG in rankings[self.POS].obj)){
    rankings[self.POS].obj[self.AVG] = []
    rankings[self.POS].arry.push(self.AVG)
  }
  rankings[self.POS].obj[self.AVG].push(self)
}
Object.prototype.isTheWinner = function( scoreboards ){
  var self = this
  var winStatus = (scoreboards[ self[0] ].pts>scoreboards[ self[1] ].pts)
  return winStatus
}
Object.prototype.isTheLoser = function( scoreboards ){
  var self = this
  var winStatus = (scoreboards[ self[0] ].pts<scoreboards[ self[1] ].pts)
  return winStatus
}
Object.prototype.scoreIsTied = function(scoreboards){
  var self = this
  var tieStatus = (scoreboards[ self[0] ].pts==scoreboards[ self[1] ].pts)
  return tieStatus
}
Object.prototype.IsTheTiebreaker_I_Winner = function(scoreboards){
  var self = this
  var winStatus = (scoreboards[ self[0] ].teamBest.pts>scoreboards[ self[1] ].teamBest.pts)
  return winStatus
}
Object.prototype.IsTheTiebreaker_I_Loser = function(scoreboards){
  var self = this
  var winStatus = (scoreboards[ self[0] ].teamBest.pts<scoreboards[ self[1] ].teamBest.pts)
  return winStatus
}
Object.prototype.updateOverallWINRecord = function( scoreboards ){
  var self = this
  if(self.isTheWinner(scoreboards)){
    g_league_roster._record[ self[0] ]._overall[0]++
  }
  else
  if(self.isTheLoser(scoreboards)){
    g_league_roster._record[ self[1] ]._overall[0]++
  }
}
Object.prototype.updateOverallLOSSRecord = function( scoreboards ){
  var self = this
  if(self.isTheWinner(scoreboards)){
    g_league_roster._record[ self[1] ]._overall[1]++
  }
  else
  if(self.isTheLoser(scoreboards)){
    g_league_roster._record[ self[0] ]._overall[1]++
  }
}
Object.prototype.updateOverallTIERecord = function( scoreboards ){
  var self = this
  if(self.scoreIsTied(scoreboards)){
    if(self.IsTheTiebreaker_I_Winner(scoreboards)){
      g_league_roster._record[ self[0] ]._overall[0]++
      g_league_roster._record[ self[1] ]._overall[1]++
    }
    else
    if(self.IsTheTiebreaker_I_Loser(scoreboards)){
      g_league_roster._record[ self[0] ]._overall[1]++
      g_league_roster._record[ self[1] ]._overall[0]++
    }
    else{
      g_league_roster._record[ self[0] ]._overall[2]++
      g_league_roster._record[ self[1] ]._overall[2]++
    }
  }
}
Object.prototype.conferencesMatch = function(){
  var confStatus = (g_league_roster._conf[ self[0] ] == g_league_roster._conf[ self[1] ])
  return confStatus
}
Object.prototype.divisionsMatch = function(){
  var divStatus = (g_league_roster._div[ self[0] ] == g_league_roster._div[ self[1] ])
  return divStatus
}
Object.prototype.updateOverallDIVRecord = function( scoreboards ){
  var self = this
  if(self.divisionsMatch()){
    if(self.isTheWinner( scoreboards ) ){
      g_league_roster._record[ self[0] ]._div._record[0]++
      g_league_roster._record[ self[1] ]._div._record[1]++
    }
    else
    if(
    self.isTheLoser( scoreboards ) ||
    self.IsTheTiebreaker_I_Loser( scoreboards ) ){
      g_league_roster._record[ self[0] ]._div._record[1]++
      g_league_roster._record[ self[1] ]._div._record[0]++
    }
    else
    if(self.IsTheTiebreaker_I_Winner( scoreboards)){
      g_league_roster._record[ self[0] ]._div._record[0]++
      g_league_roster._record[ self[1] ]._div._record[1]++
    }
    else
    if(self.IsTheTiebreaker_I_Loser( scoreboards)){
      g_league_roster._record[ self[0] ]._div._record[1]++
      g_league_roster._record[ self[1] ]._div._record[0]++
    }
    else{
      g_league_roster._record[ self[0] ]._div._record[2]++
      g_league_roster._record[ self[1] ]._div._record[2]++
    }
  }
}
Object.prototype.updateOverallCONFRecord = function( scoreboards ){
  var self = this
  if(self.conferencesMatch()){
    if(self.isTheWinner( scoreboards ) ){
      g_league_roster._record[ self[0] ]._conf._record[0]++
      g_league_roster._record[ self[1] ]._conf._record[1]++
    }
    else
    if(
    self.isTheLoser( scoreboards ) ||
    self.IsTheTiebreaker_I_Loser( scoreboards ) ){
      g_league_roster._record[ self[0] ]._conf._record[1]++
      g_league_roster._record[ self[1] ]._conf._record[0]++
    }
    else
    if(self.IsTheTiebreaker_I_Winner( scoreboards)){
      g_league_roster._record[ self[0] ]._conf._record[0]++
      g_league_roster._record[ self[1] ]._conf._record[1]++
    }
    else
    if(self.IsTheTiebreaker_I_Loser( scoreboards)){
      g_league_roster._record[ self[0] ]._conf._record[1]++
      g_league_roster._record[ self[1] ]._conf._record[0]++
    }
    else{
      g_league_roster._record[ self[0] ]._conf._record[2]++
      g_league_roster._record[ self[1] ]._conf._record[2]++
    }
  }
}
Object.prototype.updateOverallPCT = function( scoreboards ){

}
Object.prototype.updateOverallPF = function( scoreboards ){
  var self = this
  g_league_roster._record[ self[0] ]._pf += scoreboards[ self[0] ].pts
  g_league_roster._record[ self[1] ]._pf += scoreboards[ self[1] ].pts
}
Object.prototype.updateOverallPA = function( scoreboards ){
  var self = this
  g_league_roster._record[ self[0] ]._pa += scoreboards[ self[1] ].pts
  g_league_roster._record[ self[1] ]._pa += scoreboards[ self[0] ].pts
}
Object.prototype.updateOverallDIFF = function( scoreboards ){
  var self = this
  g_league_roster._record[ self[0] ]._diff  = (g_league_roster._record[ self[0] ]._pf - g_league_roster._record[ self[0] ]._pa)
  g_league_roster._record[ self[1] ]._diff  = (g_league_roster._record[ self[1] ]._pf - g_league_roster._record[ self[1] ]._pa)
}
Object.prototype.updateOverallSTRK = function( scoreboards ){

}
Object.prototype.updateOverallHOMERecord = function( scoreboards ){
  var self = this
  if(self.isTheWinner( scoreboards )){
    g_league_roster._record[ self[0] ]._home._record[0]++
  }
  else
  if(self.isTheLoser( scoreboards )){
    g_league_roster._record[ self[0] ]._home._record[1]++
  }
  else
  if(self.IsTheTiebreaker_I_Winner( scoreboards )){
    g_league_roster._record[ self[0] ]._home._record[0]++
  }
  else
  if(self.IsTheTiebreaker_I_Loser( scoreboards )){
    g_league_roster._record[ self[0] ]._home._record[1]++
  }
  else{
    g_league_roster._record[ self[0] ]._home._record[2]++
  }
}
Object.prototype.updateOverallROADRecord = function( scoreboards ){
  var self = this
  // self [0] is ALWAYS the home-team so we politely update the road-team's stats for them :) //
  if(self.isTheWinner( scoreboards )){
    g_league_roster._record[ self[1] ]._road._record[1]++
  }
  else
  if(self.isTheLoser( scoreboards )){
    g_league_roster._record[ self[1] ]._road._record[0]++
  }
  else
  if(self.IsTheTiebreaker_I_Winner( scoreboards )){
    g_league_roster._record[ self[1] ]._road._record[1]++
  }
  else
  if(self.IsTheTiebreaker_I_Loser( scoreboards )){
    g_league_roster._record[ self[1] ]._road._record[0]++
  }
  else{
    g_league_roster._record[ self[1] ]._road._record[2]++
  }
}
Object.prototype.isNotAVerifiedTeamMember = function(){
  var memberStatus = (this.TEAM == "available")
  return memberStatus
}
Object.prototype.isAVerifiedTeamMember = function(){
  var memberStatus = (this.TEAM != "available")
  return memberStatus
}
Object.prototype.updateAVG = function(wk){
  if(this.BYE!=wk){
    var avg = Math.floor(this.PTS/(wk+((this.BYE<wk&&wk>0)?0:1)))
    this.AVG = avg
  }
}
Object.prototype.addToPersonalTotals = function(wk,pts){
  this.PTS += pts
  this.PTS_HISTORY[ wk ] = pts
}
Object.prototype.updateLast = function(pts){
  this.LAST = pts
}
Object.prototype.getPtsPROJ = function(wk){
  if(this.BYE!=wk){
    var pts = this.AVG+2
  }
  else{
    var pts = 0
  }
  return pts
}
Object.prototype.getPROJPtsPerformance = function(wk){
  var pts = 0
  if(!this.BENCH && (this.BYE!=wk)){
    if(this.PIVOT.trendUP){
      pts = this.AVG+2
    }
    else
    if((this.AVG-2)>0){
      pts = this.AVG-2
    }
    else
    if(this.AVG<0){
      this.AVG = 0
    }
  }
  return pts
}
Object.prototype.updatePivotTrend = function(){
  this.PIVOT.trendUP = !this.PIVOT.trendUP
}
Object.prototype.verifyPivot = function(wk){
  var isAPivotWeek = (wk in this.PIVOT.obj)
  if(isAPivotWeek){
    this.updatePivotTrend()
  }
  return isAPivotWeek
}
Object.prototype.isAVerifiedNonByeWeekPlayer = function(wk){
  var byeWeekStatus = (this.BYE != wk)
  return byeWeekStatus
}
Object.prototype.isAVerifiedNonBenchWeekPlayer = function(wk){
  var benchStatus = (this.BENCH == false)
  return benchStatus
}
Object.prototype.buildScoreboard = function(league,mu,showteam){
  var self = this
  if(self){
  var player1 = self[0]
  var player2 = self[1]
  var team_livepro = get_team_livepros(self,showteam)
  var team_line = get_team_lines( team_livepro )
  if(showteam){
    var player1_title = league[ player1 ]._team
    var player1_name = league[ player1 ]._team
    var player1_abbrev = league[ player1 ]._team
    var player1_owner = league[ player1 ]._team
    var player1_record = league[ player1 ]._record
    var player2_title = league[ player2 ]._team
    var player2_name = league[ player2 ]._team
    var player2_abbrev = league[ player2 ]._team
    var player2_owner = league[ player2 ]._team
    var player2_record = league[ player1 ]._record

  }
  else{
    var player1_title = "Team "+league._team[ player1 ].LASTNAME+" ("+league._team[ player1 ].FULLNAME+")"
    var player1_name = "Team "+league._team[ player1 ].LASTNAME
    var player1_abbrev = league._team[ player1 ].LASTNAME
    var player1_owner = league._team[ player1 ].FULLNAME
    var player1_record = league._record[ player1 ]
    var player2_title = "Team "+league._team[ player2 ].LASTNAME+" ("+league._team[ player2 ].FULLNAME+")"
    var player2_name = "Team "+league._team[ player2 ].LASTNAME
    var player2_abbrev = league._team[ player2 ].LASTNAME
    var player2_owner = league._team[ player2 ].FULLNAME
    var player2_record = league._record[ player2 ]
  }
  mu.push([
    "<table class=matchup>",
    "<tbody>",
    "<tr id=teamscrg_5_activeteamrow>",
    "<td class=team>",
    "<div class=name>",
    "<lnk id=lnkTeam5 title=\""+player1_title+"\">"+player1_name+"</lnk>",
    "<span id=spAbbrev5 class=abbrev>("+player1_abbrev+")</span>",
    "</div>",
    "<div>",
    "<span id=spTeamRecord5 class=record title=\"Record\">("+player1_record._overall[0]+"-"+player1_record._overall[1]+")</span>",
    "<span class=owners>"+player1_owner+"</span>",
    "</div>",
    "</td>",
    "<td class=score title=\"0\" id=tmTotalPts_5 width=\"18%\">0</td>",
    "</tr>",
    "<tr id=teamscrg_3_activeteamrow>",
    "<td class=team>",
    "<div class=name>",
    "<lnk id=lnkTeam3 title=\""+player2_title+"\">"+player2_name+"</lnk>",
    "<span id=spAbbrev3 class=\"abbrev\">("+player2_abbrev+")</span>",
    "</div>",
    "<div>",
    "<span id=spTeamRecord3 class=record title=\"Record\">("+player2_record._overall[0]+"-"+player2_record._overall[1]+")</span>",
    "<span class=owners>"+player2_owner+"</span>",
    "</div>",
    "</td>",
    "<td class=score title=\"0\" id=tmTotalPts_3 width=\"18%\">0</td>",
    "</tr>",
    "<tr>",
    "<td colspan=\"2\" class=info>",
    "<div class=boxscoreLinks>",
    "<lnk>Quick Box Score</lnk> | ",
    "<lnk>Full Box Score</lnk>",
    "</div>",
    "<table class=scoringDetails>",
    "<tbody>",
    "<tr>",
    "<td class=abbrev>"+player1_abbrev+"</td>",
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
    "<td class=\"homeTeam abbrev\">"+player2_abbrev+"</td>",
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
    ].join("") )
  }
  else{
    mu.push( "BYE WEEK. Click Play Week to continue.." )
  }
}
Object.prototype.ptsPerWeek = function(){
  var ret = this.FULLNAME + "  " + this.PTS_HISTORY.join("  ")
  return ret
}
Object.prototype.toStartPOS = function(depthChart){
  this.DEPTH_CHART = depthChart
  this.FLEX = false
  this.BENCH = false
}
Object.prototype.playsSamePosition = function(py){
  var status = this.POS == py.POS
  return status
}
Object.prototype.slotAvailableFromFLEX = function(){
  var self = this
  var team = 0
  var POS = this.POS
  var slotAvailable = false
  g_league_roster[ POS ][ team ].map(
    function(player,i){
      if(!slotAvailable && !player){
        self.DEPTH_CHART = i
        slotAvailable = true
      }
      return player
    }
  )
  return slotAvailable
}
Object.prototype.toBENCH = function(){
  this.FLEX = false
  this.BENCH = true
}
Object.prototype.toFLEX = function(){
  this.FLEX = true
  this.BENCH = false
}
Object.prototype.ISARosterMemberOf = function(i){
  ret = true
  if(this.TEAM != i){
    alert(this.POS+" "+this.FULLNAME+" is not a member of your team.")
    ret = false
  }
  return ret
}
Object.prototype.addPlayerToShowteamFullRoster = function(py){
  if(!(py.SHOW_TEAM in this)){
    this[ py.SHOW_TEAM ] = {}
  }
  if(!(py.POS in this[ py.SHOW_TEAM ])){
    this[ py.SHOW_TEAM ][ py.POS ] = []
  }
  this[ py.SHOW_TEAM ][ py.POS ].push( py )
}
Object.prototype.postPadZero = function(N){
  var pad = ""
  var ret = this
  var I = Math.pow(10,N)
  for(var i=0;i<N;i++){
    if(this<I){
      pad += "&nbsp;"
    }
    I /= 10
  }
  if(pad){
    ret = this + pad
  }
  return ret
}
Object.prototype.asFixedString = function(){
  return this.toString().replace(/0+(\.\d+)/,"$1") // 0.750 => .750
}
Object.prototype._recordSort = function(rankings,league,action){
  function _record(){
    this.WINS = 0
    this.LOSS = 0
  }
  function addCache(record,lg){
    var pct = record._pct
    if(!(pct in lg.cache)){
      lg.cache[pct] = []
      lg.array.push(pct)
    }
    lg.cache[pct].push(record)
    record._pct = (record._pct==1?record._pct.toString():record._pct.asFixedString())
  }
  function gamesHaveBeenPlayed(record){
    var ret = false
    var val = ( record._overall[0] || record._overall[1] )
    if(val){
      ret = true
    }
    return ret
  }
  function calculateWinPercentage(record){
    var pct = Number(record._overall[0] / (record._overall[0]+record._overall[1])).toFixed(3)
    record._pct = pct
  }
  function saveTeamId(record,i){
    record._idx = i
  }
  function nonDefaultAction(action){
    var result = (action && (action != "PCT"))
    return result
  }
  function initCache(lg){
    lg.cache = {}
    lg.array = []
  }
  function assignWinlessRecord(record){
    record._pct = Number(0).toFixed(3)
  }
  function sortByPCT(lg,league){
    if(league != "showteam"){
      lg._record.map(
        function(record,i){
          saveTeamId(record,i)
          if( gamesHaveBeenPlayed(record) ){
            calculateWinPercentage(record)
          }
          else{
            assignWinlessRecord(record)
          }
          addCache(record,lg)
          return record
        }
      )
    }
    else{
      lg.map(
        function(team,i){
          saveTeamId(team._record,i)
          if( gamesHaveBeenPlayed(team._record) ){
            calculateWinPercentage(team._record)
          }
          else{
            assignWinlessRecord(team._record)
          }
          addCache(team._record,lg)
          return team
        }
      )
    }
    lg.array.sort().reverse().map(
      function(pct){
        lg.cache[pct].map(
          function(tm){
            rankings.push(tm)
          }
        )
      }
    )
  }
  var lg = this
  initCache(lg)
  if( nonDefaultAction(action) ){
    alert("Functionality not implemented.")
  }
  else{
    // PCT. //
    sortByPCT(lg,league)
  }
}
Object.prototype._polarize = function(){
  var pol = this.toString()
  if(this>0){
    pol = "+"+pol
  }
  return pol
}
Object.prototype.sortByAVG = function(){
  this.sortBy("AVG")
}
Object.prototype.sortBy = function(u){
  if(this instanceof Array){
    this.sort(
      function(player,player2){
        var ret = 0
        if(player[ u ]<player2[ u ]){
          return -1
        }
        else
        if(player[ u ]>player2[ u ]){
          ret = 1
        }
        return ret
      }
    )
  }
}
Object.prototype._sort = function(){
  if(this instanceof Array){
    this.sort(
      function(player,player2){
        var ret = 0
        if(player.DEPTH_CHART<player2.DEPTH_CHART){
          return -1
        }
        else
        if(player.DEPTH_CHART>player2.DEPTH_CHART){
          ret = 1
        }
        return ret
      }
    )
  }
}
Object.prototype._swap = function(id){
  var py = getPlayerDetails(id)
  var self = this
  if(self.POS){
    var tmp = { DEPTH_CHART:self.DEPTH_CHART,FLEX:self.FLEX,BENCH:self.BENCH }
    self.DEPTH_CHART = py.DEPTH_CHART
    self.FLEX = py.FLEX
    self.BENCH = py.BENCH
    py.DEPTH_CHART = tmp.DEPTH_CHART
    py.FLEX = tmp.FLEX
    py.BENCH = tmp.BENCH
  }
  else{
    self.clone( py )
  }
}
Object.prototype.build_attribs = function( attr ){
  var self = this
  var act = []
  g_fantasy_attrs.forEach(
    function(action,f){
      act.push( f(self) )
    }
  )
  g_parseActions[ self.POS ]( self,act,attr )
}
Object.prototype._playerDetailsAtIndex = function(i){
  // precedence: 1. slot => bench //
  var ret = []
  ret.sz = 0
  ret.bench = []
  ret.len = 0
  if(i in this){
    ret.len = this[i].length
    this[i].map(
      function(u,i){
        if(!u.BENCH){
          ret.push( u )
          ret.sz++
        }
        else
        if(u.BENCH){
          ret.bench.push(u)
        }
      }
    )
  }
  return ret
}
Object.prototype._playerMetaDetailsAtIndex = function(i){
  // precedence: 1. flex => slot => bench //
  var ret = ["","",""]
  ret.sz = 0
  ret.bench = []
  ret.flex = ""
  ret.len = 0
  if(i in this){
    ret.len = this[i].length
    this[i].map(
      function(u,i){
        if(u.FLEX){
          ret.flex = u
          ret.sz++
        }
        else
        if(!u.BENCH){
          ret[u.DEPTH_CHART] = u
          ret.sz++
        }
        else
        if(u.BENCH){
          ret.bench.push(u)
        }
      }
    )
  }
  return ret
}
Object.prototype._length = function(){
  var self = this
  var ret = Math.max(self.length-1, 0)
  return ret
}
Object.prototype.assert = function(u, v) {
  if (!(u in this)) {
    this[u] = v
  }
}
Object.prototype.iterate = function(cb){
  var u = this;
  var i = 0;
  for(var x in u){
    if(u.hasOwnProperty(x)){
      cb(u[x],i++,this)
    }
  }
}
Object.prototype.forEach = function(cb){
  var u = this;
  for(var x in u){
    if(u.hasOwnProperty(x)){
      cb(x,u[x],this)
    }
  }
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
  this.deferred[n[0]] = 1
  this.deferred[n[1]] = 1
}
Object.prototype.clone = function(u){
  var self = this
  u.forEach(
    function(v){
      self[v] = u[v]
    }
  )
}
Object.prototype._dump = function(){

}
Object.prototype.addFromWaiversToTeam = function(i){
  var self = this
  if(self.nextAvailableAdd && (self.nextAvailableAdd<g_WK)){
    var errmsg = self.FULLNAME+" was recently placed on Waivers and will not be available until week "+(g_WK+2)
    alert(errmsg)
  }
  else{
    self.TEAM = i
    self.toBENCH()
    g_league_roster[ self.POS ][i].push(self)
    delete g_draftRoster[ self.POS ][ self.PRK-1 ]
  }
}
Object.prototype.sendToWaivers = function(){
  var self = this
  var i = self.TEAM
  self.TEAM = "available"
  self.DEPTH_CHART = "available"
  self.BENCH = false
  self.FLEX = false
  self.nextAvailableAdd = (g_WK+1)
  if(g_league_roster[ self.POS ][i] instanceof Array){
    g_league_roster[ self.POS ][i] = g_league_roster[ self.POS ][i]._removePlayerNamed(self.FULLNAME)
  }
  else{
    g_league_roster[ self.POS ][i] = []
  }
  g_draftRoster[ self.POS ][ self.PRK-1 ] = self
}
Object.prototype.oppTAG = function(){
  return this.asTAG("opp")
}
Object.prototype.statTAG = function(){
  return this.asTAG("stat")
}
Object.prototype.etTAG = function(){
  return this.asTAG("et")
}
Object.prototype.projTAG = function(){
  return this.asTAG("proj")
}
Object.prototype.lastTAG = function(){
  return this.asTAG("last")
}
Object.prototype.ptsTAG = function(){
  return this.asTAG("pts")
}
Object.prototype.prkTAG = function(){
  return this.asTAG("prk")
}
Object.prototype.dropTAG = function(){
  return this.asTAG("drop")
}
Object.prototype.byeTAG = function(){
  return this.asTAG("bye")
}
Object.prototype.teamTAG = function(){
  return this.asTAG("team")
}
Object.prototype.avgTAG = function(py){
  var val = this.toString()
  var title = ""
  var tag = "avg"
  if(py){
    title = " title='"+py.ptsPerWeek()+"'"
  }
  var tmp =  "<"+tag+title+">"+val+"</"+tag+">"
  return tmp
}
Object.prototype.numTAG = function(){
  return this.asTAG("num")
}
Object.prototype.playerTAG = function(v){
  return this.asTAG("player")
}
Object.prototype.posTAG = function(){
  return this.asTAG("pos")
}
Object.prototype.rowTAG = function(){
  return this.asTAG("row")
}
Object.prototype.asTAG = function(v){
  var tmp =  "<"+v+">"+this.toString()+"</"+v+">"
  return tmp
}
Object.prototype.asSCTAG = function(u,v){
  var tmp = "<"+u+" "+v+"/>"
  return tmp
}
Object.prototype.lnkTAG = function(){
  var tm = this.TEAM
  var tm_nm = g_league_roster._team[ this.TEAM ].LASTNAME
  return '<lnk onclick="lnkTeam('+tm+')">'+tm_nm+'</lnk>'
}
Object.prototype.draftTAG = function(i){
  return '<draft onclick="draftToRoster(\''+this.toString()+'\')">Draft</draft>'
}
Object.prototype.addTAG = function(i){
  return '<add onclick="addToRoster(\''+this.toString()+'\')">Add</add>'
}
Object.prototype.benchTAG = function(){
  return '<bench onclick="benchToRoster(\''+this.toString()+'\')">bench</bench>'
}
Object.prototype.dropTAG = function(){
  return '<drop onclick="dropToRoster(\''+this.toString()+'\')">drop</drop>'
}
Object.prototype.tradeTAG = function(){
  return '<trade onclick="tradeToRoster(\''+this.toString()+'\')">trade</trade>'
}
Object.prototype.qb1TAG = function(){
  return '<qb_one onclick="qb1ToRoster(\''+this.toString()+'\')">QB</qb_one>'
}
Object.prototype.rb1TAG = function(){
  return '<rb_one onclick="rb1ToRoster(\''+this.toString()+'\')">RB1</rb_one>'
}
Object.prototype.rb2TAG = function(){
  return '<rb_two onclick="rb2ToRoster(\''+this.toString()+'\')">RB2</rb_two>'
}
Object.prototype.wr1TAG = function(){
  return '<wr_one onclick="wr1ToRoster(\''+this.toString()+'\')">WR1</wr_one>'
}
Object.prototype.wr2TAG = function(){
  return '<wr_two onclick="wr2ToRoster(\''+this.toString()+'\')">WR2</wr_two>'
}
Object.prototype.te1TAG = function(){
  return '<te_one onclick="te1ToRoster(\''+this.toString()+'\')">TE</te_one>'
}
Object.prototype.dst1TAG = function(){
  return '<dst_one onclick="dst1ToRoster(\''+this.toString()+'\')">D/ST</dst_one>'
}
Object.prototype.flexTAG = function(){
  return '<flex onclick="flexToRoster(\''+this.toString()+'\')">flex</flex>'
}
Object.prototype.k1TAG = function(){
  return '<k_one onclick="k1ToRoster(\''+this.toString()+'\')">K</k_one>'
}
Object.prototype.addPreHTMLtab = function(n){
  var self = this
  var buff = ""
  var i=0
  while(i<n){
    if( (n-i) in g_htmlTabHistory ){
      buff += g_htmlTabHistory[ n-i ]
      break
    }
    else{
      buff += "&nbsp;"
      g_htmlTabHistory[ i+1 ] = buff
    }
    i++
  }
  self = buff + self
  return self
}
Object.prototype.addPostHTMLtab = function(n){
  var self = this
  var buff = ""
  var i=0
  while(i<n){
    if( (n-i) in g_htmlTabHistory ){
      buff += g_htmlTabHistory[ n-i ]
      break
    }
    else{
      buff += "&nbsp;"
      g_htmlTabHistory[ i+1 ] = buff
    }
    i++
  }
  self += buff
  return self
}
Object.prototype.ceil = function(){
  return Math.ceil(this)
}
Object.prototype.sg2011_assert = function(u,v){
  if( !(u in this) ){
    this[u] = v
  }
}
Object.prototype.sg2011_remove = function(j){
  var a = []
  this.map(
    function(u,i){
      if(i!=j){
        a.push( u )
      }
    }
  )
  return a
}
Object.prototype.sg2011_iscompleted = function(n){
  var ret = true
  var idx = n.join(",")
  if(idx in sg2011_uncompleted){
    ret = false
  }
  return ret
}
Object.prototype.sg2011_complete = function(n){
  var idx = n.join(",")
  if(idx in sg2011_uncompleted){
    delete sg2011_uncompleted[idx]
  }
}
Object.prototype.sg2011_isdeferred = function(n){
  this.assert("deferred",{})
  var t0 = (n[0] in this.deferred)
  var t2 = (n[1] in this.deferred)
  return (t0 || t2)
}
Object.prototype.sg2011_isdeferredGlobal = function(n){
  var t0 = (n[0] in sg2011_deferred)
  var t2 = (n[1] in sg2011_deferred)
  return (t0 || t2)
}
Object.prototype.sg2011_defer = function(n){
  this.assert("deferred",{})
  sg2011_deferred[n[0]] = 1
  sg2011_deferred[n[1]] = 1
  this.deferred[n[0]] = 1
  this.deferred[n[1]] = 1
}