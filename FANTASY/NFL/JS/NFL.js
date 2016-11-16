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
    Fantasy League Sim Tool

  INPUT:
    Your club name + Selected draft picks

  OUTPUT:
    Fantasy Team + Clubhouse, Fantasy Season

  SCRIPT TYPE:
    Sim tool

*/
var g_myTeam = 0
var g_selectedIndex = 0
var g_league_roster = { QB:[],WR:[],RB:[],TE:[],FLEX:[],"D/ST":[],K:[],_conf:[],_div:[],_record:[],_bye:[],_team:[] }
var g_show_team_roster = { QB:[],WR:[],RB:[],TE:[],FLEX:[],"D/ST":[],K:[] }
var g_full_showteam_roster = {}
var addToRoster=function(u){
  _adjustRosterDraftBoardWaivers(u,"available","add")
}
var dropToRoster=function(u){
  if(getPlayerDetails(u).ISARosterMemberOf(0)){
    if(isLeaguePlay()){
      _adjustRosterDraftBoardWaivers(u,"available","drop")
    }
    else{
      var msg = "Feature will be enabled during league play."
      alert(msg)
    }
  }
}
var benchToRoster=function(u){
  if(getPlayerDetails(u).ISARosterMemberOf(0)){
    _adjustRoster(u,0,"bench")
  }
}
var tradeToRoster=function(u){
  if(isLeaguePlay()){
    _adjustRosterDraftBoardWaivers(u,"available","trade")
  }
  else{
    var msg = "Feature will be enabled during league play."
    alert(msg)
  }
}
var qb1ToRoster=function(u){
  if(getPlayerDetails(u).ISARosterMemberOf(0)){
  _adjustRoster(u,"available","qb")
  }
}
var wr1ToRoster=function(u){
  if(getPlayerDetails(u).ISARosterMemberOf(0)){
  _adjustRoster(u,0,"wr")
  }
}
var wr2ToRoster=function(u){
  if(getPlayerDetails(u).ISARosterMemberOf(0)){
  _adjustRoster(u,1,"wr")
  }
}
var rb1ToRoster=function(u){
  if(getPlayerDetails(u).ISARosterMemberOf(0)){
  _adjustRoster(u,0,"rb")
  }
}
var rb2ToRoster=function(u){
  if(getPlayerDetails(u).ISARosterMemberOf(0)){
  _adjustRoster(u,1,"rb")
  }
}
var te1ToRoster=function(u){
  if(getPlayerDetails(u).ISARosterMemberOf(0)){
  _adjustRoster(u,0,"te")
  }
}
var flexToRoster=function(u){
  if(getPlayerDetails(u).ISARosterMemberOf(0)){
  _adjustRoster(u,0,"flex")
  }
}
var dst1ToRoster=function(u){
  if(getPlayerDetails(u).ISARosterMemberOf(0)){
  _adjustRoster(u,"available","d/st")
  }
}
var k1ToRoster=function(u){
  if(getPlayerDetails(u).ISARosterMemberOf(0)){
  _adjustRoster(u,"available","k")
  }
}
function waiversNotInFocus(){
  var wstatus = (selBox.selectedIndex!=6)
  return wstatus
}
var _adjustRosterDraftBoardWaivers=function(u,depthChart,action){
  var updateClubhouseOnly = false
  var py = getPlayerDetails(u)
  if(action=="add"){
    if(
    py.nextAvailableAdd &&
    (g_WK<py.nextAvailableAdd) ){
      alert(py.FULLNAME+" will not be available until week "+(g_WK+2)+". ")
    }
    else
    if(py.isNotAVerifiedTeamMember()){
      py.addFromWaiversToTeam(0)
    }
    else{
      var msg = py.POS+" "+py.FULLNAME+" is already a member of your team."
      alert(msg)
    }
  }
  else
  if(action=="drop"){
    py.sendToWaivers()
    if(waiversNotInFocus()){
      updateClubhouseOnly = true
    }
  }
  else
  if(action=="trade"){
    alert("Functionality not implemented.")
  }
  g_league_roster[ py.POS ][g_myTeam]._sort()
  if(!updateClubhouseOnly){
    if(isLeaguePlay()){
      updateWaivers()
    }
    else{
      updateDraftBoard()
    }
  }
  else{
    updateClubhouseView()
  }
}
var _adjustRoster=function(u,depthChart,action){
  var py = getPlayerDetails(u)
  if(action=="flex"){
    var resetRequired = true;
    function cb2(player){
      if(player instanceof Array){
        parsePosition(player,cb2)
      }
      else
      if(
      (player.FLEX) &&
      (player.FULLNAME != py.FULLNAME) &&
      resetRequired){
        if(player.playsSamePosition(py)){
          player._swap(u)
        }
        else{
          var slotFound = player.slotAvailableFromFLEX()
          if(!slotFound){
            player.toBENCH()
          }
          py.toFLEX()
        }
        resetRequired = false
      }
    }
    function cb(POS){
      parsePosition(g_league_roster[ POS ][g_myTeam],cb2)
    }
    parseFLEXpositions(cb)
    if(resetRequired){
      py.toFLEX()
    }
  }
  else
  if(action=="bench"){
    var resetRequired = true
    if(resetRequired){
      py.toBENCH()
    }
  }
  else{
    var resetRequired = true
    function cb2(player){
      if(player instanceof Array){
        parsePosition(player,cb2)
      }
      else
      if(
      (player.DEPTH_CHART==depthChart) &&
      (player.FULLNAME != py.FULLNAME) &&
      resetRequired){
        if(player.playsSamePosition(py)){
          player._swap(u)
          if(player.BENCH && py.BENCH){
            py.toStartPOS(depthChart)
          }
          resetRequired = false
        }
        else
        if(player.POS.match(new RegExp(action,"i"))){
          player._swap(u)
          player.toBENCH()
          resetRequired = false
        }
      }
    }
    function cb(POS){
      parsePosition(g_league_roster[ POS ][g_myTeam],cb2)
    }
    parseROSTERpositions(cb)
    if(resetRequired){
      py.toStartPOS(depthChart)
    }
  }
  g_league_roster[ py.POS ][g_myTeam]._sort()
  updateClubhouseView()
}
var g_HUDmsg = [
  "- Evaluate your lineup to be sure your players are ready.",
  "- Don't forget to enter a name for your clubhouse!",
  "- Only players on a Bye-Week or players claimed from Waivers can be sent to the bench.",
  "- Be sure to check Player Waivers regularly.",
]
var g_fantasy_attrs = {
  drop:function(u){
    return u.FULLNAME.dropTAG()
  },
  bench:function(u){
    return u.FULLNAME.benchTAG()
  },
  trade:function(u){
    return u.FULLNAME.tradeTAG()
  },
  qb:function(u){
    return u.FULLNAME.qb1TAG()
  },
  wr1:function(u){
    return u.FULLNAME.wr1TAG()
  },
  wr2:function(u){
    return u.FULLNAME.wr2TAG()
  },
  rb1:function(u){
    return u.FULLNAME.rb1TAG()
  },
  rb2:function(u){
    return u.FULLNAME.rb2TAG()
  },
  te:function(u){
    return u.FULLNAME.te1TAG()
  },
  flex:function(u){
    return u.FULLNAME.flexTAG()
  },
  "D/ST":function(u){
    return u.FULLNAME.dst1TAG()
  },
  k:function(u){
    return u.FULLNAME.k1TAG()
  },
  add:function(u){
    return u.FULLNAME.addTAG()
  },
}
var g_positional_attrs = {
  QB:{ drop:1,bench:1,qb:1,trade:1 },
  WR:{ drop:1,bench:1,flex:1,wr1:1,wr2:1,trade:1 },
  RB:{ drop:1,bench:1,flex:1,rb1:1,rb2:1,trade:1 },
  TE:{ drop:1,bench:1,te:1,flex:1,trade:1 },
  FLEX:{ drop:1,bench:1,wr1:1,wr2:1,rb1:1,rb2:1,te:1,trade:1 },
  "D/ST":{ drop:1,bench:1,"D/ST":1,trade:1 },
  K:{ drop:1,bench:1,k:1,trade:1 },
}
var g_league_play = false
var g_draftRoster = {}
var g_showteam_schedule
var g_fantasy_schedule
var g_htmlTabHistory = {}
var g_leagueNAMES = {}
var g_draftRound = 1
var g_WK = 0
var g_CURRENT = { LEAGUE_SETTINGS:g_LEAGUE_SETTINGS[g_myTeam],SHOW_TEAMS:SHOW_TEAMS[0] }
var g_draftChart = []
var g_snakeDraft = {
  Down:function(){
    var lg = g_CURRENT.LEAGUE_SETTINGS.LEAGUE
    var currentPick = (lg.MAX_CONFERENCES * lg.MAX_DIVISIONS * lg.MAX_TEAMS_PER_DIVISION)-1
    while(currentPick>0){ // last teams pick first!
      conductDraftAndInterviews(currentPick--)
    }
  },
  Up:function(){
    var currentPick = 1 // skip we (0!), we pick manually
    var lg = g_CURRENT.LEAGUE_SETTINGS.LEAGUE
    var all_teams = (lg.MAX_CONFERENCES * lg.MAX_DIVISIONS * lg.MAX_TEAMS_PER_DIVISION)
    while(currentPick<all_teams){ // first teams pick first!
      conductDraftAndInterviews(currentPick++)
    }
  },
}
var g_display = {
  invalidate_current_window:{},
  0:function(){
    // current matchup //
    this.currentMatchup()
    },
  1:function(){
    // team clubhouse //
    this.teamClubhouse()
    },
  2:function(){
    // team standings //
    this.teamStandings()
    },
  3:function(){
    // scoreboard //
    this.scoreboard()
    },
  4:function(){
    // Other Stats (NFL/NCAA Teams) Standings //
    this.otherStatsStandings()
    },
  5:function(){
    // Other Stats (NFL/NCAA Teams) Scoreboards //
    this.otherStatsScoreboard()
    },
  6:function(){
    // available players //
    this.availablePlayers()
    },
  currentMatchup:function(){
    this.invalidate_current_window = this.currentMatchup
    var wk = g_WK
    var msg = g_HUDmsg
    var sp = invalidateSeasonPanel(wk)
    var mu = invalidateCurrentMatchup(wk)
    seasonPANEL.innerHTML = sp.join(" | ") + "<br>"
    HUD.innerHTML = msg.join("<br>")
    gamedayMATCHUP.innerHTML = mu.join("")
    this._show({ 0:1,1:1,3:1,6:1 })
    },
  teamClubhouse:function(){
    this.invalidate_current_window = this.teamClubhouse
    this._show({ 6:1 })
    },
  teamStandings:function(){
    this.invalidate_current_window = this.teamStandings
    var lg_standings = []
    invalidateLeagueStandings(lg_standings)
    gamedayMATCHUP.innerHTML = lg_standings.join("")
    this._show({ 0:1 })
    },
  scoreboard:function(){
    this.invalidate_current_window = this.scoreboard
    var wk = g_WK
    var msg = g_HUDmsg
    var schedule = invalidateScoreboard(wk)
    gamedayMATCHUP.innerHTML = "<h1 style='text-align:center'>FANTASY Scoreboard</h1><br>"
    scoreBOARD.innerHTML = schedule.join("")
    HUD.innerHTML = msg.join("<br>")
    this._show({ 0:1,3:1,2:1,1:1 })
    },
  otherStatsStandings:function(){
    this.invalidate_current_window = this.otherStatsStandings
    var lg_standings = []
    invalidateLeagueStandings(lg_standings,"showteam")
    gamedayMATCHUP.innerHTML = lg_standings.join("")
    this._show({ 0:1 })
    },
  otherStatsScoreboard:function(){
    this.invalidate_current_window = this.otherStatsScoreboard
    var wk = g_WK
    var msg = g_HUDmsg
    var schedule = invalidateScoreboard(wk,"showteam")
    gamedayMATCHUP.innerHTML = "<h1 style='text-align:center'>Official Scoreboard</h1><br>"
    scoreBOARD.innerHTML = schedule.join("")
    HUD.innerHTML = msg.join("<br>")
    this._show({ 0:1,3:1,2:1,1:1 })
    },
  availablePlayers:function(cat){
    this.invalidate_current_window = this.availablePlayers
    var roster = [];
    var msg = [
       'Free Agent Waivers: Select a player - click "Add" on any line to add a player to bench - Week '+(g_WK+1)+' (FANTASY Waivers)',
       "---------------------------------------------------",
       "",
       "<div onclick=\"g_display.availablePlayers('default')\" class=\"button-filter-alt first "+(cat!="all"?"focused":"")+"\">Available</div><div onclick=\"g_display.availablePlayers('all')\" class=\"button-filter-alt last "+(cat=="all"?"focused":"")+"\">All</div>",
       "",
       g_draft_panel
      ];
    updateWaiversView(roster,cat)
    HUD.innerHTML = msg.join("<br>")
    var showWindows = { 3:1,5:1,7:1 };
    if(cat=="all"){
      showWindows[4] = 1
    }
    this._show(showWindows)
    },
  _show:function(showpanel){
    [gamedayMATCHUP,seasonPANEL,scoreBOARD,HUD,divClubhouse,srcCode,txtClubName].map(
      function(u,i){
        if(showpanel[i]){
          u.style.display = "block"
          if(u.scrollTop){
            u.scrollTop = 0
          }
        }
        else{
          u.style.display = "none"
        }
      }
    )},
}
var g_panel_header =
  "<span title='Player Position'>SLOT</span>".addPostHTMLtab(5)+
  "<span title='Player'>PLAYER</span>".addPostHTMLtab(25)+
  "<span title='Position'>POS</span>".addPostHTMLtab(3)+
  "<span title='Team'>TEAM</span>".addPostHTMLtab(31)+
  "<span title='Opponent'>OPP</span>".addPostHTMLtab(32)+
  "<span title='Game Day Schedule'>STATUS</span>".addPostHTMLtab(7)+
  "<span title='Eastern Time - Start Time'>ET</span>".addPostHTMLtab(6)+
  "<span title='Positional Rank'>PRK</span>".addPostHTMLtab(3)+
  "<span title='Season Points'>PTS</span>".addPostHTMLtab(3)+
  "<span title='Season Average'>AVG</span>".addPostHTMLtab(3)+
  "<span title='Last Game Day Performance'>LAST</span>".addPostHTMLtab(2)+
  "<span title='Projected Game Day Performance'>PROJ</span>"
var g_draft_panel =
   "Rank Pos".addPostHTMLtab(3)+
   "Name".addPostHTMLtab(26)+
   "Team".addPostHTMLtab(31)+
   "Bye-Wk".addPostHTMLtab(4)+
   "Avg";
var g_parseActions = {
  QB:function(py,u,v){
      var param0 = (py.BYE==g_WK&&!py.BENCH)
      var param1 = (py.BENCH==true)
      // 0:drop, 1:bench, 2:trade, 3:qb, 4:wr1, 5:wr2, 6:rb1, 7:rb2, 8:te, 9:flex, 10:dst, 11:k
      v.push([u[0],(param0?u[1]:""),u[2],(param1?u[3]:"")].join(" "))
    },
  WR:function(py,u,v){
      var param0 = (py.BYE==g_WK)
      var param1 = ((py.DEPTH_CHART!=0)||py.BENCH||py.FLEX)
      var param2 = ((py.DEPTH_CHART!=1)||py.BENCH||py.FLEX)
      var param3 = (py.FLEX==true)
      // 0:drop, 1:bench, 2:trade, 3:qb, 4:wr1, 5:wr2, 6:rb1, 7:rb2, 8:te, 9:flex, 10:dst, 11:k
      v.push([u[0],(param0?u[1]:""),u[2],(param1?u[4]:""),(param2?u[5]:""),(param3?"":u[9])].join(" "))
    },
  RB:function(py,u,v){
      var param0 = (py.BYE==g_WK)
      var param1 = ((py.DEPTH_CHART!=0)||py.BENCH||py.FLEX)
      var param2 = ((py.DEPTH_CHART!=1)||py.BENCH||py.FLEX)
      var param3 = (py.FLEX==true)
      // 0:drop, 1:bench, 2:trade, 3:qb, 4:wr1, 5:wr2, 6:rb1, 7:rb2, 8:te, 9:flex, 10:dst, 11:k
      v.push([u[0],(param0?u[1]:""),u[2],(param1?u[6]:""),(param2?u[7]:""),(param3?"":u[9])].join(" "))
    },
  TE:function(py,u,v){
      var param0 = (py.BYE==g_WK)
      var param1 = ((py.BENCH||py.FLEX)==true)
      var param2 = (py.FLEX==true)
      // 0:drop, 1:bench, 2:trade, 3:qb, 4:wr1, 5:wr2, 6:rb1, 7:rb2, 8:te, 9:flex, 10:dst, 11:k
      v.push([u[0],(param0?u[1]:""),u[2],(param1?u[8]:""),(param2?"":u[9])].join(" "))
    },
 "D/ST":function(py,u,v){
      var param0 = (py.BYE==g_WK)
      var param1 = (py.BENCH==true)
      // 0:drop, 1:bench, 2:trade, 3:qb, 4:wr1, 5:wr2, 6:rb1, 7:rb2, 8:te, 9:flex, 10:dst, 11:k
      v.push([u[0],(param0?u[1]:""),u[2],(param1?u[10]:"")].join(" "))
    },
  K:function(py,u,v){
      var param0 = (py.BYE==g_WK)
      var param1 = (py.BENCH==true)
      // 0:drop, 1:bench, 2:trade, 3:qb, 4:wr1, 5:wr2, 6:rb1, 7:rb2, 8:te, 9:flex, 10:dst, 11:k
      v.push([u[0],(param0?u[1]:""),u[2],(param1?u[11]:"")].join(" "))
    },
}
var g_clubhouseConferencer = function(all_teams){
  var MAX_CONFERENCES = g_CURRENT.LEAGUE_SETTINGS.LEAGUE.MAX_CONFERENCES
  var conf = [];
  for(var i=0;i<all_teams;i++){
    conf.push( (i%MAX_CONFERENCES)+1 )
  }
  return conf
}
var g_clubhouseDivisioner = function(all_teams){
  var MAX_DIVISIONS = g_CURRENT.LEAGUE_SETTINGS.LEAGUE.MAX_DIVISIONS
  var div = [];
  for(var i=0;i<all_teams;i++){
    div.push( (i%MAX_DIVISIONS)+1 )
  }
  return div
}
function fromStaticTypeToArrayType(objType){
  if(!objType){
    objType = []
  }
  else
  if(!(objType instanceof Array)){
    objType = [objType]
  }
  return objType
}
function updateSrcCodeHTML(code){
  srcCode.innerHTML = code
  srcCode.scrollTop = 0
}
function updateSrcCodeTXT(code){
  srcCode.innerText = code
  srcCode.scrollTop = 0
}
function invalidateSeasonPanel(wk){
  var I = g_CURRENT.LEAGUE_SETTINGS.TEAMS.GAMES_PER_SEASON
  var week = ["<b>Week:</b>&nbsp;&nbsp;<br>"]
  for(var i=0;i<I;i++){
    var j = i+1
    var buff = ""
    if(i!=wk){
      buff = "<lnk onclick=lnkWk("+i+") title=\"Week "+j+"\">"+j+"</lnk>"
    }
    else{
      buff = "<b>"+j+"</b>"
    }
    if(i!=0){
      week.push( buff )
    }
    else{
      week[0] += buff
    }
  }
  return week
}
function g_clubhouseRecords(N){
  var league_records = []
  for(var i=0;i<N;i++){
    league_records.push(new _overallRecord())
  }
  return league_records
}
function g_clubhouseNames(N){
  var cache = {}
  var first_entry = { LASTNAME:"???",FULLNAME:"???? ????" }
  var L = NAMES[1].length
  var roster = [first_entry]
  for(var i=1;i<N;i++){
    do{
      var l = Math._random(L)
      var l2 = Math._random(L)
    } while((NAMES[1][l]+NAMES[1][l2]) in cache);
    cache[ NAMES[1][l] + NAMES[1][l] ] = 1
    roster.push({ LASTNAME:NAMES[1][l],FULLNAME:(NAMES[1][l]+NAMES[1][l2]) })
  }
  return roster
}
function _player(resume){
  this.clone(resume)
}
function _team(lineup){
  this.clone(lineup)
}
function _division(nfl){
  this.total = g_CURRENT.LEAGUE.MAX_DIVISIONS
  this.NAME = nfl.NAME
  this.TEAMS = nfl.TEAMS
}
function _conference(nfl){
  this.total = g_CURRENT.LEAGUE.MAX_CONFERENCES
  this.NAME = nfl.NAME
  this.DIVISIONS = nfl.divisions
}
function _league(nfl){
  this.total = g_CURRENT.LEAGUE.MAX_LEAGUES
  this.NAME = nfl.NAME
  this.CONFERENCES = nfl.conferences
}
function scheduler(){
  g_showteam_schedule = g_generate_schedule(
      g_CURRENT.LEAGUE_SETTINGS.TEAMS.GAMES_PER_SEASON+1, /* +1 game to prevent end-of-season crash */
      g_CURRENT.LEAGUE_SETTINGS.LEAGUE,
      "showteams"
    )
  g_fantasy_schedule = g_generate_schedule(
      g_CURRENT.LEAGUE_SETTINGS.TEAMS.GAMES_PER_SEASON+1, /* +1 game to prevent end-of-season crash */
      g_CURRENT.LEAGUE_SETTINGS.LEAGUE
    )
}
function nameGEN(){
  var firstNAME = ""
  var lastNAME = ""
  var id
  do{
    var I0 = NAMES[0].length
    var I2 = NAMES[1].length
    var idx = Math._random(I0)
    var idy = Math._random(I2)
    firstNAME = NAMES[0][ idx ]
    lastNAME = NAMES[1][ idy ]
    id = firstNAME+" "+lastNAME
  } while(id in g_leagueNAMES);
  g_leagueNAMES[ id ] = 1
  return { NAME:firstNAME,LASTNAME:lastNAME,FULLNAME:id }
}
function numPIVOTS(){
  return Math._random( g_CURRENT.LEAGUE_SETTINGS.TEAMS.GAMES_PER_SEASON )
}
function pivotWEEK(){
  return Math._random( g_CURRENT.LEAGUE_SETTINGS.TEAMS.GAMES_PER_SEASON )
}
function buildPivotWeek(p){
  var history = {}
  var numpivots = numPIVOTS()
  for(var i=0;i<numpivots;i++){
    var j = pivotWEEK()
    while(j in history){
      j = pivotWEEK()
    }
    history[ j ] = 1
    p.PIVOT.obj[ j ] = 1
    p.PIVOT.arry.push( j )
  }
}
function getByeWeek(){
  return Math._random( g_CURRENT.LEAGUE_SETTINGS.TEAMS.GAMES_PER_SEASON )
}
function buildByeWeek(p){
  p.BYE = getByeWeek()
}
function getShowTeam(u){
  var I = Math._random( g_show_team_roster[u].length )
  var idx = g_show_team_roster[u][I]._idx
  g_show_team_roster[u][I]._slots--
  if(g_show_team_roster[u][I]._slots<1){
    g_show_team_roster[u] = g_show_team_roster[u]._removeIndex(I)
  }
  return g_CURRENT.SHOW_TEAMS[ idx ]
}
function _newPtsHISTORY(N,bye){
  var ret = [];
  for(var i=0;i<N;i++){
    ret.push((i==bye?"bye":"--"))
  }
  return ret
}
function addLEAGUEplayer(fn,pos,avg,tm,i){
  var ico_dir = 'class=sm_ico src="'+g_CURRENT.LEAGUE_SETTINGS.ICONS
  var id = fn.FULLNAME
  var py = new _player({
    POS:pos,
    NAME:fn.NAME,
    LASTNAME:fn.LASTNAME,
    FULLNAME:fn.FULLNAME,
    PTS:0,
    PTS_HISTORY:_newPtsHISTORY( g_CURRENT.LEAGUE_SETTINGS.TEAMS.GAMES_PER_SEASON,tm._bye ),
    AVG:avg,
    LAST:0,
    TEAM:"available",
    SHOW_TEAM:tm._team,
    SHOW_ICON:('<img '+ico_dir+tm._ico+'"/>'),
    BYE:tm._bye,
    PRK:i,
    FLEX:false,
    BENCH:false,
    DEPTH_CHART:"available",
    PIVOT:{
      obj:{},
      arry:[],
      trendUP:true
    },
  })
  buildPivotWeek(py)
  g_leagueNAMES[ id ] = py
  g_draftRoster[pos][py.PRK-1] = py
  g_full_showteam_roster.addPlayerToShowteamFullRoster( py )
}
function nextAVG(i,avg,step){
  var val = avg
  if(
  (i && (i!=1) && (val-1>0))
  ){
    val -= step
  }
  else
  if(i==1 && val-1>0){ // assure there is only 1 top athlete for each position //
    val--
  }
  return val
}
function buildCatTag(player,waivers,cat){
  var cat_tag
  if(waivers){
    if(
    (cat != "all") ||
    (player.TEAM == "available") ){
      cat_tag = player.FULLNAME.addTAG()
    }
    else{
      cat_tag = player.lnkTAG()
    }
  }
  else{
    cat_tag = player.FULLNAME.draftTAG()
  }
  return cat_tag
}
function toPlayerRowHTML(n,t,player,tm,c_avg,waivers,cat){
  var s = n.toString()
  var bye = (tm._bye+1)
  var cat_tag = buildCatTag(player,waivers,cat)
  var p = [
    n.numTAG().addPostHTMLtab(5-s.length),
    t.posTAG().addPostHTMLtab(6-t.length),
    player.FULLNAME.playerTAG().addPostHTMLtab(30-player.FULLNAME.length),
    tm._team.teamTAG().addPostHTMLtab(35-tm._team.length),
    bye.byeTAG().addPostHTMLtab(10-bye.toString().length),
    c_avg.avgTAG(("PTS_HISTORY" in player?player:"")).addPostHTMLtab(5-c_avg.toString().length),
    cat_tag,
  ]
  return p
}
function populateROSTER(I,avg,t,roster){
  var step = avg / I
  for(var i=0;i<I;i++){
    avg = nextAVG(i,avg,step)
    var c_avg = avg.ceil()
    var player = nameGEN()
    var n = i+1
    var tm = getShowTeam(t)
    var p = toPlayerRowHTML(n,t,player,tm,c_avg)
    roster.push(p.join("").rowTAG())
    addLEAGUEplayer(player,t,c_avg,tm,(i+1))
  }
}
function buildComponents(t,roster){
  var I = g_CURRENT.SHOW_TEAMS.length * g_CURRENT.LEAGUE_SETTINGS.TEAMS.MAX_SHOW_TEAM_SLOTS[ t ]
  var avg = g_CURRENT.LEAGUE_SETTINGS.TEAMS.MAX_SLOT_START_AVG[ t ]
  populateROSTER(I,avg,t,roster)
}
function genQB(){
  var t = "QB"
  var roster = []
  buildComponents(t,roster)
  return roster.join("<br>")
}
function genWR(){
  var t = "WR"
  var roster = []
  buildComponents(t,roster)
  return roster.join("<br>")
}
function genRB(){
  var t = "RB"
  var roster = []
  buildComponents(t,roster)
  return roster.join("<br>")
}
function genTE(){
  var t = "TE"
  var roster = []
  buildComponents(t,roster)
  return roster.join("<br>")
}
function genDST(){
  var t = "D/ST"
  var roster = []
  buildComponents(t,roster)
  return roster.join("<br>")
}
function genK(){
  var t = "K"
  var roster = []
  buildComponents(t,roster)
  return roster.join("<br>")
}
function openNextRound(){
  return ++g_draftRound
}
function getCurrentRound(){
  return g_draftRound
}
function resetRound(){
  g_draftRound = 1
}
function resetDraftChart(){
  g_draftChart = { length:0 }
}
function expandDraftChart(i){
  g_draftChart[i] = "QB,WR,WR,RB,RB,TE,FLEX,D/ST,K"
  g_draftChart.length++
}
function generate_positional_attrs(py){
  var attr = [""]
  py.build_attribs( attr )
  return attr
}
function toClubHouseRowHTML(player,showteam){
  var roster = [""]
  if(player && player.FULLNAME){
    var proj = player.getPtsPROJ(g_WK)
    var POS = player.POS;
    if(player.FLEX && !showteam){
      POS = "FLEX"
    }
    roster = [
      "".addPostHTMLtab(9-POS.length),
      player.FULLNAME.playerTAG().addPostHTMLtab(31-player.FULLNAME.length),
      player.POS.posTAG().addPostHTMLtab(6-player.POS.length),
      player.SHOW_TEAM.teamTAG().addPostHTMLtab(35-player.SHOW_TEAM.length),
      "--".oppTAG().addPostHTMLtab(35-2),  // OPP
      "--".statTAG().addPostHTMLtab(13-2),  // STATUS
      "--".etTAG().addPostHTMLtab(8-2),  // ET
      player.PRK.prkTAG().addPostHTMLtab(6-player.PRK.toString().length),
      player.PTS.ptsTAG().addPostHTMLtab(6-player.PTS.toString().length),
      player.AVG.avgTAG(player).addPostHTMLtab(6-player.AVG.toString().length),
      player.LAST.lastTAG().addPostHTMLtab(6-player.LAST.toString().length),
      proj.projTAG().addPostHTMLtab(6-proj.toString().length),
      generate_positional_attrs(player).join("")
    ]
  }
  return roster
}
function buildBench(roster){
  var bench = []
  roster.map(
    function(POS){
      if(POS && ("bench" in POS)){
        POS.bench.map(
          function(player){
            bench.push(player.POS.posTAG()+toClubHouseRowHTML(player).join("").rowTAG())
            return player
          }
        )
      }
      return POS
    }
  )
  return bench || [""]
}
function buildClubHouse(roster){
  var QB = roster[0]
  var WR = roster[1]
  var RB = roster[2]
  var TE = roster[3]
  var FLEX = roster[4]
  var DST = roster[5]
  var K = roster[6]
  var lineup = [
    ("QB".posTAG()+toClubHouseRowHTML(QB[0]).join("")).rowTAG(),
    ("WR".posTAG()+toClubHouseRowHTML(WR[0]).join("")).rowTAG(),
    ("WR".posTAG()+toClubHouseRowHTML(WR[1]).join("")).rowTAG(),
    ("RB".posTAG()+toClubHouseRowHTML(RB[0]).join("")).rowTAG(),
    ("RB".posTAG()+toClubHouseRowHTML(RB[1]).join("")).rowTAG(),
    ("TE".posTAG()+toClubHouseRowHTML(TE[0]).join("")).rowTAG(),
    ("FLEX".posTAG()+toClubHouseRowHTML(FLEX[0]).join("")).rowTAG(),
    ("D/ST".posTAG()+toClubHouseRowHTML(DST[0]).join("")).rowTAG(),
    ("K".posTAG()+toClubHouseRowHTML(K[0]).join("")).rowTAG()
  ]
  return lineup || ["QB","WR","WR","RB","RB","TE","FLEX","D/ST","K"]
}
function flexPlayerNotDrafted(team){
  var drafted = false
  var roster = ["WR","RB","TE"]
  roster.forEach(
  function(POS){
    if(
    !drafted &&
    (team in g_league_roster[ POS ]) &&
    (g_league_roster[ POS ][ team ] instanceof Array) &&
    (g_league_roster[ POS ][ team ].length >= g_CURRENT.LEAGUE_SETTINGS.TEAMS.MAX_SLOTS[POS ])){
      drafted = true
    }
  })
  return drafted
}
function parsePosition(f,cb){
  if(f instanceof Array){
    f.map(
      function(g,i){
        cb(g,i)
        return g
      }
    )
  }
  else
  if(f){
    cb(f)
  }
  return f
}
function parseROSTERpositions(cb){
  ["QB","WR","RB","TE","D/ST","K"].map(
    function(POS){
      cb(POS)
      return POS
    }
  )
}
function parseFLEXpositions(cb){
  ["WR","RB","TE"].map(
    function(POS){
      cb(POS)
      return POS
    }
  )
}
function parseNonFLEXpositions(cb){
  ["QB","D/ST","K"].map(
    function(POS){
      cb(POS)
      return POS
    }
  )
}
function invalidateHUD(blurb){
  blurb.push(
   'Snake Draft: Select a player - click "Draft" on any line to draft a player - Round <span id=draftSTATUS>'+getCurrentRound()+'</span> of 9 (FANTASY Draft)',
   "---------------------------------------------------",
   g_draft_panel
  )
}
function hideClubhouseDiv(){
  divClubhouse.style.display = "none"
}
function showClubhouseDiv(roster){
  divClubhouse.innerHTML = roster.join("<br>")
  divClubhouse.style.display = "block"
}
function lnkTeam(team,league){
  var roster = []
  var ln = "";
  var fn = "";
  if(league != "showteam"){
    ln = g_league_roster._team[ team ].LASTNAME
    fn = g_league_roster._team[ team ].FULLNAME
    invalidateClubhouse(roster,team,league)
    roster.unshift("ClubHouse - Team "+ln+" ("+ln+")",fn,"")
  }
  else{
    fn = g_CURRENT.SHOW_TEAMS[ team ]._team
    invalidateShowteamClubhouse(roster,team)
    roster.unshift("ClubHouse - "+fn,"")
  }
  showClubhouseDiv(roster)
}
function addToItinerary(player,i,tmp,cat){
  var pos = player.POS
  if(!(pos in tmp)){
    tmp[ pos ] = []
  }
  tmp[ pos ][ i ] = { player:player,cat:cat }
}
function draftRosterToHTML(roster,cat){
  g_draftRoster.forEach(
    function(POS,ROSTER){
      ROSTER.map(
        function(player){
          addToItinerary(player,player.PRK,roster,cat)
          return player
        }
      )
    }
  )
}
function leagueRosterToHTML(roster,cat){
  g_leagueNAMES.forEach(
    function cb(name,player){
      addToItinerary(player,player.PRK,roster,cat)
    }
  )
}
function buildWaiverRoster(roster,tmp){
  tmp.forEach(
    function(POS,players){
      players.map(
        function(py,i){
          var player = py.player
          var cat = py.cat
          roster.push(toPlayerRowHTML(player.PRK,POS,player,{ _team:player.SHOW_TEAM,_bye:player.BYE },player.AVG,"waivers",cat).join("").rowTAG())
        }
      )
    }
  )
}
function invalidateWaiverRoster(roster,cat){
  var tmp = {}
  var showAllAvailablePlayers = (cat == "all")
  if(showAllAvailablePlayers){
    leagueRosterToHTML(tmp,cat)
  }
  else{
    draftRosterToHTML(tmp,cat)
  }
  buildWaiverRoster(roster,tmp)
}
function invalidateDraftRoster(roster){
  g_draftRoster.forEach(
    function(POS,ROSTER){
      ROSTER.map(
        function(player,i){
          roster.push(toPlayerRowHTML((i+1),POS,player,{ _team:player.SHOW_TEAM,_bye:player.BYE },player.AVG).join("").rowTAG())
          return player
        }
      )
    }
  )
}
function invalidateShowteamClubhouse(homePanel,team){
  var tm_name = g_CURRENT.SHOW_TEAMS[ team ]._team
  var roster = g_full_showteam_roster[ tm_name ]
  var clubPanel = buildShowteamClubhouse(roster)
  var benchPanel = buildShowteamBench(roster)
  homePanel.push(
    "",
    "AVAILABLE SLOTS - "+(0).numTAG(),
    "",
    "STARTERS",
    "--------------------",
    g_panel_header,
    clubPanel.join("<br>"),
    "",
    "",
    "BENCH - AVAILABLE SLOTS "+"(Disabled - No bye weeks)".numTAG(),
    "--------------------",
    g_panel_header,
    benchPanel.join("<br>")
  )
}
function buildShowteamClubhouse(roster){
  var QB = roster.QB
  var WR = roster.WR
  var RB = roster.RB
  var TE = roster.TE
  var DST = roster["D/ST"]
  var K = roster.K
  var lineup = [
    ("QB".posTAG()+toClubHouseRowHTML(QB[0]).join("")).rowTAG(),
    ("WR".posTAG()+toClubHouseRowHTML(WR[0],"showteam").join("")).rowTAG(),
    ("WR".posTAG()+toClubHouseRowHTML(WR[1],"showteam").join("")).rowTAG(),
    ("RB".posTAG()+toClubHouseRowHTML(RB[0],"showteam").join("")).rowTAG(),
    ("RB".posTAG()+toClubHouseRowHTML(RB[1],"showteam").join("")).rowTAG(),
    ("TE".posTAG()+toClubHouseRowHTML(TE[0],"showteam").join("")).rowTAG(),
    ("D/ST".posTAG()+toClubHouseRowHTML(DST[0]).join("")).rowTAG(),
    ("K".posTAG()+toClubHouseRowHTML(K[0]).join("")).rowTAG()
  ]
  return lineup
}
function buildShowteamBench(roster){
  var QB = roster.QB
  var WR = roster.WR
  var RB = roster.RB
  var TE = roster.TE
  var DST = roster["D/ST"]
  var K = roster.K
  var lineup = [
    ("QB".posTAG()+toClubHouseRowHTML(QB[1]).join("")).rowTAG(),
    ("WR".posTAG()+toClubHouseRowHTML(WR[2],"showteam").join("")).rowTAG(),
    ("WR".posTAG()+toClubHouseRowHTML(WR[3],"showteam").join("")).rowTAG(),
    ("RB".posTAG()+toClubHouseRowHTML(RB[2],"showteam").join("")).rowTAG(),
    ("RB".posTAG()+toClubHouseRowHTML(RB[3],"showteam").join("")).rowTAG(),
    ("TE".posTAG()+toClubHouseRowHTML(TE[1],"showteam").join("")).rowTAG(),
    ("D/ST".posTAG()+toClubHouseRowHTML(DST[1]).join("")).rowTAG(),
    ("K".posTAG()+toClubHouseRowHTML(K[1]).join("")).rowTAG()
  ]
  return lineup
}
function invalidateClubhouse(homePanel,i){
  var team = i || 0;
  var current_league = g_league_roster;
  var QB = current_league.QB._playerDetailsAtIndex(team)
  var WR = current_league.WR._playerMetaDetailsAtIndex(team)
  var RB = current_league.RB._playerMetaDetailsAtIndex(team)
  var TE = current_league.TE._playerMetaDetailsAtIndex(team)
  var FLEX = [WR.flex || RB.flex || TE.flex || ""]
  var DST = current_league["D/ST"]._playerDetailsAtIndex(team)
  var K = current_league.K._playerDetailsAtIndex(team)
  var availableSlots = 9-(
    QB.sz+
    WR.sz+
    RB.sz+
    TE.sz+
    DST.sz+
    K.sz)
  var lineup = [QB,WR,RB,TE,FLEX,DST,K]
  var clubPanel = buildClubHouse(lineup)
  var benchPanel = buildBench(lineup)
  homePanel.push(
    "",
    "AVAILABLE SLOTS - "+availableSlots.numTAG(),
    "",
    "STARTERS",
    "--------------------",
    g_panel_header,
    clubPanel.join("<br>"),
    "",
    "",
    "BENCH - AVAILABLE SLOTS "+"(Disabled - No bye weeks)".numTAG(),
    "--------------------",
    g_panel_header,
    benchPanel.join("<br>")
  )
}
function updateWaiversView(rost,cat){
  var roster = rost || []
  invalidateWaiverRoster(roster,cat)
  srcCode.innerHTML = roster.join("<br>")  
}
function updateWaivers(){
  updateWaiversView()
  updateClubhouseView()
}
function updateDraftBoard(){
  var roster = []
  var blurb = []
  invalidateDraftRoster(roster)
  invalidateHUD(blurb)
  HUD.innerHTML = blurb.join("<br>")
  srcCode.innerHTML = roster.join("<br>")
  updateClubhouseView()
}
function nflDraft(){
  g_show_team_roster = { QB:[],WR:[],RB:[],TE:[],FLEX:[],"D/ST":[],K:[] }
  g_draftRoster = { QB:[],WR:[],RB:[],TE:[],FLEX:[],"D/ST":[],K:[] }
  g_full_showteam_roster = {}
  g_selectedIndex = leagueBox.selectedIndex
  resetDraftChart()
  resetRound()
  resetLeaguePlay()
  var lg = g_CURRENT.LEAGUE_SETTINGS.LEAGUE
  var gps = g_CURRENT.LEAGUE_SETTINGS.TEAMS.GAMES_PER_SEASON
  var tms = g_CURRENT.LEAGUE_SETTINGS.TEAMS.MAX_SHOW_TEAM_SLOTS
  var all_teams = (lg.MAX_CONFERENCES * lg.MAX_DIVISIONS * lg.MAX_TEAMS_PER_DIVISION)
  g_league_roster._team = g_clubhouseNames(all_teams)
  g_league_roster._record = g_clubhouseRecords(all_teams)
  g_league_roster._conf = g_clubhouseConferencer(all_teams)
  g_league_roster._div = g_clubhouseDivisioner(all_teams)
  for(var i=0;i<all_teams;i++){
    expandDraftChart(i)
  }
  g_CURRENT.SHOW_TEAMS.map(
    function(u,i){
      g_show_team_roster["QB"].push({ _idx:i,_slots:tms.QB })
      g_show_team_roster["WR"].push({ _idx:i,_slots:tms.WR })
      g_show_team_roster["RB"].push({ _idx:i,_slots:tms.RB })
      g_show_team_roster["TE"].push({ _idx:i,_slots:tms.TE })
      g_show_team_roster["FLEX"].push({ _idx:i,_slots:tms.FLEX })
      g_show_team_roster["D/ST"].push({ _idx:i,_slots:tms["D/ST"] })
      g_show_team_roster["K"].push({ _idx:i,_slots:tms.K })
      u._bye = getByeWeek()
      return u
    }
  )
  var roster = [
    genQB(),
    genWR(),
    genRB(),
    genTE(),
    genDST(),
    genK(),
  ]
  var blurb = [
   'Snake Draft: Select a player - click "Draft" on any line to draft a player - Round <span id=draftSTATUS>'+getCurrentRound()+'</span> of 9 (FANTASY Draft)',
   "---------------------------------------------------",
   g_draft_panel,
  ]
  var emptyPanel = ""
  var homePanel = [
    "",
    "AVAILABLE SLOTS - "+"9".numTAG(),
    "",
    "STARTERS",
    "--------------------",
    g_panel_header,
    ("QB".posTAG()+emptyPanel).rowTAG(),
    ("WR".posTAG()+emptyPanel).rowTAG(),
    ("WR".posTAG()+emptyPanel).rowTAG(),
    ("RB".posTAG()+emptyPanel).rowTAG(),
    ("RB".posTAG()+emptyPanel).rowTAG(),
    ("TE".posTAG()+emptyPanel).rowTAG(),
    ("FLEX".posTAG()+emptyPanel).rowTAG(),
    ("D/ST".posTAG()+emptyPanel).rowTAG(),
    ("K".posTAG()+emptyPanel).rowTAG(),
    "",
    "",
    "BENCH - AVAILABLE SLOTS "+"(Disabled - No bye weeks)".numTAG(),
    "--------------------",
    g_panel_header,
  ]
  scheduler()
  sortShowteamRoster()
  fantasy_week_total.innerHTML = gps
  HUD.innerHTML = blurb.join("<br>")
  srcCode.innerHTML = roster.join("<br>")
  srcTranslated.innerHTML = homePanel.join("<br>")
}
function sortShowteamRoster(){
  g_full_showteam_roster.forEach(
    function(name,team){
       team.forEach(
         function(POS){
           team[ POS ].sortByAVG()
           team[ POS ].reverse()
         }
       )
      return team
    }
  )
}
function updateDraft(){
  g_league_roster = { QB:[],WR:[],RB:[],TE:[],FLEX:[],"D/ST":[],K:[],_conf:[],_div:[],_record:[],_bye:[],_team:[] }
  g_CURRENT.LEAGUE_SETTINGS = g_LEAGUE_SETTINGS[ leagueBox.selectedIndex ]
  g_CURRENT.SHOW_TEAMS = SHOW_TEAMS[ leagueBox.selectedIndex ]
  g_CURRENT.LEAGUE_SETTINGS.TEAMS.GAMES_PER_SEASON = btnUpdateGISeason.value*1
  g_CURRENT.LEAGUE_SETTINGS.LEAGUE.MAX_CONFERENCES = btnUpdateConf.value*1
  g_CURRENT.LEAGUE_SETTINGS.LEAGUE.MAX_DIVISIONS = btnUpdateDiv.value*1
  g_CURRENT.LEAGUE_SETTINGS.LEAGUE.MAX_TEAMS_PER_DIVISION = btnUpdateTPDiv.value*1
  g_leagueNAMES = {}
  nflDraft()
}
function benchIsClearOfNonByeWeekPlayers(){
  var team = 0
  var statusReady = true
  function cb2(player){
    if(statusReady && player.BENCH && (player.BYE != g_WK)){
      statusReady = false
    }
  }
  function cb(POS){
    parsePosition(g_league_roster[ POS ][ team ],cb2)
  }
  parseROSTERpositions(cb)
  if(!statusReady){
    alert("To continue, please clear your bench of all non bye-week players.")
  }
  return statusReady
}
function isCurrentTeamBest(pts,teamBest){
  var statsStatus = (pts>teamBest.pts)
  return statsStatus
}
function updateTeamBest(py,tb){
  tb.fn = py.FULLNAME
  tb.pts = py.LAST
}
function autoUpdateWeeklyPlayerPRKs(){
  var rankings = {
    QB:{obj:{},arry:[]},
    WR:{obj:{},arry:[]},
    RB:{obj:{},arry:[]},
    TE:{obj:{},arry:[]},
    "D/ST":{obj:{},arry:[]},
    K:{obj:{},arry:[]},
  }
  function fsort(lhs,rhs){
    var i = 0
    if(lhs>rhs){
      i = -1
    }
    else
    if(lhs<rhs){
      i=1
    }
    return i
  }
  function cb2(rnk){
    var i=1
    rnk.arry.sort(fsort).map(
      function(num){
        rnk.obj[num].map(
          function(player){
            player.PRK = i++
            if(player.isNotAVerifiedTeamMember()){
              g_draftRoster[ player.POS ][player.PRK-1] = player
            }
          }
        )
      }
    )
  }
  function cb(POS){
    g_draftRoster[ POS ] = []
    parsePosition(rankings[ POS ],cb2)
  }
  g_leagueNAMES.forEach(
  function(name,player){
    player.updatePRK(rankings)
  }) 
  parseROSTERpositions(cb)
}
function unpackByeWeekTeams(scoreboards,showteam){
  function _team(){
    this.pts=0
    this.teamBest={ fn:"",pts:0 }
  }
  if(!showteam){
    var lg = g_CURRENT.LEAGUE_SETTINGS.LEAGUE
    var all_teams = (lg.MAX_CONFERENCES * lg.MAX_DIVISIONS * lg.MAX_TEAMS_PER_DIVISION)
  }
  else{
    var all_teams = g_CURRENT.LEAGUE_SETTINGS.TEAMS.TOTAL_SHOW_TEAMS
  }
  for(var i=0;i<all_teams;i++){  // Make sure bye-week teams dont crash game //
    if(!(i in scoreboards)){
      scoreboards[i] = new _team()
    }
  }
}
function autoUpdateWeeklyPlayerTotals(wk,showteam){
  var result = [] 
  function _team(){
    this.pts=0
    this.teamBest={ fn:"n/a",pts:0 }
  }
  if(!showteam){ 
    function indexResults(res,py){
      if(!(py.TEAM in res)){
        res[ py.TEAM ] = new _team()
      }
    }
    g_leagueNAMES.forEach(
    function(name,player){
      if( player.isAVerifiedNonByeWeekPlayer(wk) ){
        player.verifyPivot(wk)
        var pts = player.getPROJPtsPerformance(wk)
        player.updateLast(pts)
        player.addToPersonalTotals(wk,pts)
        player.updateAVG(wk)
        if(player.isAVerifiedTeamMember()){
          indexResults(result,player)
          result[ player.TEAM ].pts += pts
          if(isCurrentTeamBest(pts,result[ player.TEAM ].teamBest)){
            updateTeamBest(player,result[ player.TEAM ].teamBest)
          }
        }
      }
      else
      if(!player.isAVerifiedNonByeWeekPlayer(wk)){
        player.PTS_HISTORY[ wk ] = "bye"
      }
    })
  }
  else{
    // We can just copy over player performance-data for this week //
    function indexResults(res,py){
      if(!(py.SHOW_TEAM in res)){
        res[ py.SHOW_TEAM ] = new _team()
      }
    }
    g_leagueNAMES.forEach(
    function(name,player){
      var pts = player.LAST
      indexResults(result,player)
      result[ player.SHOW_TEAM ].pts += pts
      if(isCurrentTeamBest(pts,result[ player.SHOW_TEAM ].teamBest)){
        updateTeamBest(player,result[ player.SHOW_TEAM ].teamBest)
      }
    })
  }
  unpackByeWeekTeams(result,showteam)
  return result
}
function autoUpdateWeeklyLeagueTotals(scoreboards,wk){
  g_fantasy_schedule[ wk ].map(
    function(team){
      team.updateOverallWINRecord( scoreboards )
      team.updateOverallLOSSRecord( scoreboards )
      team.updateOverallTIERecord( scoreboards )
      team.updateOverallDIVRecord( scoreboards )
      team.updateOverallCONFRecord( scoreboards )
      team.updateOverallPCT( scoreboards )
      team.updateOverallPF( scoreboards )
      team.updateOverallPA( scoreboards )
      team.updateOverallDIFF( scoreboards )
      team.updateOverallSTRK( scoreboards )
      team.updateOverallHOMERecord( scoreboards )
      team.updateOverallROADRecord( scoreboards )
      return team
    }
  )
}
function autoUpdateWeeklyShowteamTotals(scoreboards,wk){
  g_showteam_schedule[ wk ].map(
    function(team){
      team.updateOverallWINRecord( scoreboards,"showteam" )
      team.updateOverallLOSSRecord( scoreboards,"showteam" )
      team.updateOverallTIERecord( scoreboards,"showteam" )
      team.updateOverallDIVRecord( scoreboards,"showteam" )
      team.updateOverallCONFRecord( scoreboards,"showteam" )
      team.updateOverallPCT( scoreboards,"showteam" )
      team.updateOverallPF( scoreboards,"showteam" )
      team.updateOverallPA( scoreboards,"showteam" )
      team.updateOverallDIFF( scoreboards,"showteam" )
      team.updateOverallSTRK( scoreboards,"showteam" )
      team.updateOverallHOMERecord( scoreboards,"showteam" )
      team.updateOverallROADRecord( scoreboards,"showteam" )
      return team
    }
  )
}
function updateClubhouseView(homePanel){
  var hp = homePanel || []
  invalidateClubhouse(hp) // BUG: Module implicitly calls updated global g_WK -- BUGFIX: ????
  srcTranslated.innerHTML = hp.join("<br>")
}
function playWeek(){

  /* -----------------------
   *  RANK TIE-BREAKERS
   *
   *  1. Team Having Widest Point Differential (PF-PA Points)
   *  2. Team Having Highest scoring player
   *  3. Team Having Smallest Variance Between Starting Players
   *  4. Alphabetical Order
   *  5. Random
   * ----------------------- */

  var games_per_season = g_CURRENT.LEAGUE_SETTINGS.TEAMS.GAMES_PER_SEASON
  if(
  g_WK<games_per_season &&
  benchIsClearOfNonByeWeekPlayers() ){
    var wk = g_WK;
    var homePanel = [];
    var scoreboards =
      autoUpdateWeeklyPlayerTotals(wk);
    var showBoards = 
      autoUpdateWeeklyPlayerTotals(wk,"showteam");
    autoUpdateWeeklyLeagueTotals(scoreboards,wk)
    autoUpdateWeeklyShowteamTotals(showBoards,wk)
    autoUpdateWeeklyPlayerPRKs(wk)
    sortShowteamRoster()
    wk = ++g_WK
    fantasy_week.innerHTML = ((wk<games_per_season)?(wk+1):wk)
    g_display.invalidate_current_window()
    var sp = invalidateSeasonPanel(wk)
    seasonPANEL.innerHTML = sp.join(" | ") + "<br>"
    updateClubhouseView(homePanel)
  }
}
function calculateTOTALS(i){
  if(
  (g_LEAGUE_SETTINGS.hasOwnProperty(i)) &&
  (i in g_LEAGUE_SETTINGS)
  ){
    var lg = g_LEAGUE_SETTINGS[ i ]
    var a = btnUpdateConf.value = lg.LEAGUE.MAX_CONFERENCES
    var b = btnUpdateDiv.value = lg.LEAGUE.MAX_DIVISIONS
    var c = btnUpdateTPDiv.value = lg.LEAGUE.MAX_TEAMS_PER_DIVISION
    teamTALLY.innerText = a * b * c
  }
}
function updateTOTALS(i){
  if(
  (g_LEAGUE_SETTINGS.hasOwnProperty(i)) &&
  (i in g_LEAGUE_SETTINGS)
  ){
    var lg = g_LEAGUE_SETTINGS[ i ]
    var a = btnUpdateConf.value
    var b = btnUpdateDiv.value
    var c = btnUpdateTPDiv.value
    teamTALLY.innerText = a * b * c
  }
}
function hideDraftBoard(){
  draftBOARD.style.display = "none"
}
function showGamedayBoard(){
  fantasyBOARDS.style.display = "inline"
}
function unlockClubhouse(){
  activateLeaguePlay()
  hideDraftBoard()
  showGamedayBoard()
  g_display.currentMatchup()
}
function activateLeaguePlay(){
  g_league_play = true
}
function resetLeaguePlay(){
  g_league_play = false
}
function isLeaguePlay(){
  return g_league_play
}
function draftComplete(){
  var ret = ("length" in g_draftChart) && (g_draftChart.length > 0)
  return !ret
}
function getTopDraftRosterScore_then_findQualifyingPlayers(available_slots){
  var topScore = 0
  var rankedAVGS = {}
  var bestPlayers = []
  available_slots.forEach(
    function(POS,_){
      if(POS != "FLEX"){
        g_draftRoster[ POS ].map(
          function(player){
            if(player && (player.AVG>=topScore)){
              topScore=player.AVG
              if(!(player.AVG in rankedAVGS)){
                rankedAVGS[ player.AVG ] = []
              }
              rankedAVGS[ player.AVG ].push( player )
            }
            return player
          }
        )
      }
      else{
        function cb2(player){
          if(player instanceof Array){
            parsePosition(player,cb2)
          }
          else
          if(player && (player.AVG>=topScore)){
            topScore=player.AVG
            if(!(player.AVG in rankedAVGS)){
              rankedAVGS[ player.AVG ] = []
            }
            rankedAVGS[ player.AVG ].push( player )
          }
        }
        function cb(POS){
          parsePosition(g_draftRoster[ POS ],cb2)
        }
        parseFLEXpositions(cb)
      }
    }
  )
  bestPlayers = rankedAVGS[ topScore ]
  return bestPlayers
}
function gatherPlayers(available_slots){
  var bestPlayers = getTopDraftRosterScore_then_findQualifyingPlayers(available_slots)
  return bestPlayers
}
function findAvailableSlots(currentPick){
  var available_slots = {}
  g_draftChart[currentPick].split(/,+/g).map(
    function(POS){
      if(!(POS in available_slots)){
        available_slots[ POS ] = 1
      }
    }
  )
  return available_slots
}
function interviewBestPlayers(currentPick){
  var available_slots = findAvailableSlots(currentPick)
  var bestPlayers = gatherPlayers(available_slots)
  return bestPlayers
}
function choosePlayer(draftGroup){
  var i = Math._random( draftGroup.length )
  var choice = draftGroup[i]
  return choice
}
function conductDraftAndInterviews(currentPick){
  var availableMeetings = interviewBestPlayers(currentPick)
  var py = choosePlayer(availableMeetings)
  if(
  (openPositionVerified(py,currentPick)) ||
  (flexPositionVerified(py,currentPick)) ){
    signPlayerToTeam(py,currentPick)
  }
  else{
    Error(['Attempt to fill unavailable position: Team',currentPick,', player',py].join(" "))
  }
}
function oddRound(){
  return (getCurrentRound()%2!=0)
}
function autodraftRemainingRound(){
  if(oddRound()){
    g_snakeDraft.Up()
    openNextRound()
    if(draftComplete()){
      updateDraftBoard()
      unlockClubhouse()
    }
    else{
      g_snakeDraft.Down()
      updateDraftBoard()
    }
  }
  else{
    openNextRound()
    if(draftComplete()){
      updateDraftBoard()
      unlockClubhouse()
    }
    else{
      updateDraftBoard()
    }
  }
}
function pruneDraftChart(py){
  if(!g_draftChart[ py.TEAM ]){
    delete g_draftChart[ py.TEAM ]
    g_draftChart.length--
  }
}
function updateDraftChart(py){
  var POS = py.FLEX?"FLEX":py.POS;
  var re = new RegExp(","+POS+"|"+POS+",|"+POS)
  g_draftChart[ py.TEAM ] = g_draftChart[ py.TEAM ].replace(re,"")
  pruneDraftChart(py)
}
function assignFlex(py,team){
  var resetRequired = true
  var roster = ["RB","WR","TE"]
  roster.forEach(
  function(POS){
    if(team in g_league_roster[ POS ]){
      g_league_roster[ POS ][team].map(
      function(player){
        if(
        (player.FLEX) &&
        (player.FULLNAME != py.FULLNAME) &&
        resetRequired){
          player._swap(py.FULLNAME)
          player.FLEX = false
          resetRequired = false
        }
        return player
      })
    }
  })
  if(resetRequired){
    py.FLEX = true
    py.BENCH = false
  }
  g_league_roster[ py.POS ][team]._sort()
}
function addMetaSlot(py,team){
  if(!(team in g_league_roster[ py.POS ])){
    g_league_roster[ py.POS ][ team ] = []
  }
}
function assertSlotCount(py,team){
  var lg = g_league_roster[ py.POS ]
  if(!g_league_roster[ py.POS ][ team ]){
    addMetaSlot( py,team )
  }
}
function metaSlotAvailable(py,team){
  var ret = (g_league_roster[ py.POS ][ team ].length < g_CURRENT.LEAGUE_SETTINGS.TEAMS.MAX_SLOTS[ py.POS ])
  return ret
}
function pushToMetaSlot(py,team){
  assertSlotCount(py,team)
  pushToMetaRosterSlot(py,team)
}
function pushToMetaRosterSlot(py,team){
  var DEPTH_CHART = -1
  do{
    DEPTH_CHART++
    var depthChartCollision = false
    g_league_roster[ py.POS ][ team ].map(
    function(player){
      if(player && !depthChartCollision && (player.DEPTH_CHART==DEPTH_CHART)){
        depthChartCollision = true
      }
      return player
    })
  } while(depthChartCollision)
  py.DEPTH_CHART = DEPTH_CHART
  if(!metaSlotAvailable(py,team) && flexPlayerNotDrafted(team)){
    assignFlex(py,team)
  }
  g_league_roster[ py.POS ][ team ].push( py )
}
function pushToRosterSlot(py,team){
  g_league_roster[ py.POS ][ team ] = [py]
}
function isMetaSlot(py){
  var ret = (g_CURRENT.LEAGUE_SETTINGS.TEAMS.MAX_META_SLOTS[ py.POS ]>0)
  return ret
}
function addToWaiverRoster(py){
  g_draftRoster[ py.POS ][ py.PRK-1 ] = py
}
function removeFromWaiverRoster(py){
  delete g_draftRoster[ py.POS ][ py.PRK-1 ]
}
function updateDraftRoster(py,team){
  if(py.TEAM == "available"){
    py.TEAM = team
    delete g_draftRoster[ py.POS ][ py.PRK-1 ]
  }
}
function signPlayerToTeam(py,team){
  if(isMetaSlot(py)){
    pushToMetaSlot(py,team)
  }
  else{
    pushToRosterSlot(py,team)
  }
  updateDraftRoster(py,team)
  updateDraftChart(py)
}
function getPlayerDetails(id){
  var py = g_leagueNAMES[ id ]
  return py
}
function openPositionVerified(py,team){
  var re = new RegExp( py.POS )
  return (g_draftChart && (team in g_draftChart) && g_draftChart[ team ].match( re ))
}
function flexPositionVerified(py,team){
  var ret = false
  var result00 = (g_draftChart && (team in g_draftChart) && g_draftChart[ team ].match( /FLEX/i ))
  var result01 = py.POS.match( /RB|WR|TE/ )
  var result02 = isMetaSlot(py)
  var result03 = metaSlotAvailable(py,team)
  var criteria_met = (result00 && result01 && result02 && !result03)
  if(criteria_met){
    ret = py.FLEX = true
  }
  return ret
}
function draftToRoster(id){
  var py = getPlayerDetails(id)
  if(
  (openPositionVerified(py,g_myTeam)) ||
  (flexPositionVerified(py,g_myTeam))){
    try{
      signPlayerToTeam(py,g_myTeam)
      autodraftRemainingRound()
    }
    catch(e){
      alert([e.message,e.stack].join("\n"))
    }
  }
  else{
    showDraftWarningMSG(py)
  }
}
function showDraftWarningMSG(py){
  var blurb = []
  function cb(player){
    if(player instanceof Array){
      parsePosition(player,cb)
    }
    else
    if(!player.FLEX){
      blurb.push( 'You have already offered a '+py.POS+' contract to '+player.FULLNAME )
    }
    else{
      blurb.push( 'You have already offered a FLEX/'+py.POS+' contract to '+player.FULLNAME )
    }    
  }
  parsePosition(g_league_roster[ py.POS ][ g_myTeam ],cb)
  alert( blurb.join("\n") )
}
function selectBox(e){
  if(e.target.id == selBox.id){
    selBox_onchange(e)
  }
  else
  if(e.target.id == leagueBox.id){
    leagueBox_onchange(e)
  }
}
selBox_onchange = function(e){
  g_display[ selBox.selectedIndex ]()
}
leagueBox_onchange = function(e){
  var i = e.target.selectedIndex
  var N = SHOW_TEAMS[ i ].length * 2 // twice as many teams due to no backups
  var lg = g_LEAGUE_SETTINGS[ i ]
  calculateTOTALS( i )
  btnUpdateGISeason.value = lg.TEAMS.GAMES_PER_SEASON
  teamTOTAL.innerText = N
}
btnUpdateConf:onkeyup = function(e){
  if(
  (e.target.id == btnUpdateConf.id) ||
  (e.target.id == btnUpdateDiv.id) ||
  (e.target.id == btnUpdateTPDiv.id)
  ){
    updateTOTALS( leagueBox.selectedIndex )
  }
  else
  if(e.target.id == txtClubName.id){
    var txt = txtClubName.value.replace(/\s/,"_").split(/_/)
    g_league_roster._team[g_myTeam].FULLNAME = txt[0]
    g_league_roster._team[g_myTeam].LASTNAME = txt[1] || ""
  }
}
addEventListener("change",selectBox,1)