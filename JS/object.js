
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
  if(this.TEAM !=i){
    alert("Player is not a member of your team.")
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
    var pct = Number(record._overall[0] / record._overall[1]).toFixed(3)
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
Object.prototype._sort = function(){
  if(0 in this){
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
  if(g_parseActions[ this.POS ][ this.DEPTH_CHART ]){
    g_parseActions[ this.POS ][ this.DEPTH_CHART ]( self,act,attr )
  }
  else{
    // NOP //
  }
}
Object.prototype._playerDetailsAtIndex = function(i){
  var ret = [""]
  ret.sz = 0
  ret.bench = []
  ret.len = 0
  if(i in this){
    ret.len = 1
    if(!this[i].BENCH){
      ret[0] = this[i]
      ret.sz++
    }
    else{
      ret.bench.push(this[i])
    }
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
Object.prototype.avgTAG = function(){
  return this.asTAG("avg")
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