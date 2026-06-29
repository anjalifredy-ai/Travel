var COLORS=['#f44336','#e91e63','#9c27b0','#3f51b5','#2196f3','#00bcd4','#4caf50','#ff9800','#795548','#607d8b'];
function clr(s){return COLORS[(s||'V').charCodeAt(0)%COLORS.length];}

var G_HOME=[], G_TREND=[], G_SEARCH=[], G_SHORTS=[];
var liked=[], saved=[], watchHist=[];
var shortIdx=0, touchStartY=0, touchStartTime=0;
var currentChannel='', prevPage='home';

var CHIPS=['All','Music','Gaming','News','Cricket','Coding','Comedy','Cooking','Tech','Science','Travel','Fitness'];
var MOCK=[
  {id:'dQw4w9WgXcQ',title:'India vs England Test 2026 Day 2 Highlights',channel:'ESPN Cricinfo',views:'2.3M',ago:'2 hours ago',dur:'18:34',emoji:'🏏',cat:'Cricket',desc:'Full highlights from Day 2!'},
  {id:'9bZkp7q19f0',title:'Building Full Stack App with Next.js 15',channel:'Fireship',views:'890K',ago:'1 day ago',dur:'24:15',emoji:'💻',cat:'Coding',desc:'Complete full-stack tutorial.'},
  {id:'kJQP7kiw5Fk',title:'TOP 10 Bollywood Songs 2026',channel:'T-Series',views:'15M',ago:'3 days ago',dur:'42:10',emoji:'🎵',cat:'Music',desc:'Biggest hits of 2026!'},
  {id:'OPf0YbXqDm0',title:'100 Hours in Minecraft Hardcore',channel:'Dream',views:'4.1M',ago:'5 days ago',dur:'31:22',emoji:'🎮',cat:'Gaming',desc:'Pure Minecraft survival.'},
  {id:'hT_nvWreIhg',title:'Budget 2026 EXPLAINED in 10 Minutes',channel:'CA Rachana Ranade',views:'3.2M',ago:'1 week ago',dur:'10:45',emoji:'💰',cat:'News',desc:'Breaking down Budget 2026.'},
  {id:'XqZsoesa55w',title:'ChatGPT vs Claude vs Gemini 2026',channel:'MKBHD',views:'5.6M',ago:'2 weeks ago',dur:'19:48',emoji:'🤖',cat:'Tech',desc:'Ultimate AI showdown.'},
  {id:'bNyUyrR0PHo',title:'Butter Chicken Recipe Restaurant Style',channel:'Hebbars Kitchen',views:'7.8M',ago:'3 weeks ago',dur:'15:20',emoji:'🍗',cat:'Cooking',desc:'Perfect Butter Chicken!'},
  {id:'C0DPdy98e4c',title:'How Black Holes Actually Work',channel:'Kurzgesagt',views:'12M',ago:'1 month ago',dur:'14:33',emoji:'🌌',cat:'Science',desc:'Visual explanation.'},
  {id:'uelHwf8o7_U',title:'Stand Up Comedy Family Problems',channel:'Zakir Khan',views:'9.3M',ago:'2 months ago',dur:'58:12',emoji:'😂',cat:'Comedy',desc:'Hilarious special!'},
  {id:'5qap5aO4i9A',title:'30 Day Workout Transformation',channel:'Fitness With Ankit',views:'2.7M',ago:'3 months ago',dur:'20:44',emoji:'💪',cat:'Fitness',desc:'30 day transformation.'},
  {id:'e-ORhEE9VVg',title:'Mountain Biking in Manali',channel:'Bike With Girl',views:'1.1M',ago:'1 month ago',dur:'22:05',emoji:'🚵',cat:'Travel',desc:'Most dangerous trail!'},
  {id:'JGwWNGJdvx8',title:'iPhone 18 Pro Honest Review',channel:'MKBHD',views:'8.9M',ago:'3 months ago',dur:'16:07',emoji:'📱',cat:'Tech',desc:'30 days with iPhone 18 Pro.'},
];
var MOCK_SHORTS=[
  {id:'dQw4w9WgXcQ',title:'Coding trick that blew my mind',channel:'TechBhai',views:'4.2M',emoji:'💻'},
  {id:'9bZkp7q19f0',title:'Perfect chai in 2 minutes',channel:'ChaiWala',views:'8.1M',emoji:'☕'},
  {id:'kJQP7kiw5Fk',title:'India wins last ball thriller',channel:'CricketFans',views:'12M',emoji:'🏏'},
  {id:'OPf0YbXqDm0',title:'DIY phone stand cardboard',channel:'DIYBhai',views:'2.3M',emoji:'📱'},
  {id:'hT_nvWreIhg',title:'5 VS Code shortcuts you NEED',channel:'CodeShorts',views:'3.7M',emoji:'⚡'},
  {id:'XqZsoesa55w',title:'Street food in Old Delhi',channel:'FoodWalker',views:'6.5M',emoji:'🌮'},
  {id:'bNyUyrR0PHo',title:'Monsoon in Mumbai',channel:'MumbaiDiaries',views:'9.2M',emoji:'🌧️'},
  {id:'C0DPdy98e4c',title:'AI art in 10 seconds',channel:'AIArtist',views:'5.1M',emoji:'🎨'},
];

window.onload = function(){
  initChips();
  loadHome();
  loadShorts();
  loadTrending();
};

function initChips(){
  var html='';
  for(var i=0;i<CHIPS.length;i++){
    html+='<button class="chip'+(i===0?' active':'')+'" onclick="filterChip(this,\''+CHIPS[i]+'\')">'+CHIPS[i]+'</button>';
  }
  document.getElementById('chipBar').innerHTML=html;
}

function filterChip(el,cat){
  var chips=document.querySelectorAll('.chip');
  for(var i=0;i<chips.length;i++) chips[i].classList.remove('active');
  el.classList.add('active');
  var src=G_HOME.length?G_HOME:MOCK;
  var f=[];
  if(cat==='All'){f=src;}
  else{for(var i=0;i<src.length;i++){if((src[i].cat||'').toLowerCase()===cat.toLowerCase())f.push(src[i]);}}
  renderGrid(f.length?f:src);
}

function loadHome(){
  showSkel('homeContent');
  fetch('/api/youtube?type=home')
    .then(function(r){return r.json();})
    .then(function(d){
      G_HOME=(d.videos&&d.videos.length)?d.videos:MOCK;
      renderGrid(G_HOME);
    })
    .catch(function(){
      G_HOME=MOCK;
      renderGrid(MOCK);
    });
}

function renderGrid(vids){
  var html='<div class="video-grid">';
  for(var i=0;i<vids.length;i++){
    var v=vids[i];
    var ch=v.channel||'V';
    var thumb=v.thumbnail?('<img src="'+v.thumbnail+'" alt="" loading="lazy" onerror="this.parentNode.querySelector(\'.thumb-emoji\').style.display=\'flex\';this.remove();">'):'';
    var es=v.thumbnail?'display:none':'display:flex';
    html+='<div class="video-card" onclick="openWatch('+i+',\'home\')">';
    html+='<div class="thumb-wrap">'+thumb+'<div class="thumb-emoji" style="'+es+'">'+(v.emoji||'▶️')+'</div>';
    html+='<div class="duration">'+(v.dur||v.duration||'')+'</div></div>';
    html+='<div class="card-info">';
    html+='<div class="ch-av" style="background:'+clr(ch)+'" onclick="event.stopPropagation();openChannel(\''+ch.replace(/'/g,"\\'")+'\')">';
    html+=ch[0]+'</div>';
    html+='<div class="card-meta"><div class="card-title">'+(v.title||'')+'</div>';
    html+='<div class="card-sub"><span class="card-ch-name" onclick="event.stopPropagation();openChannel(\''+ch.replace(/'/g,"\\'")+'\')">'+ch+'</span> • '+(v.views||'')+' • '+(v.ago||'')+'</div>';
    html+='</div></div></div>';
  }
  html+='</div>';
  document.getElementById('homeContent').innerHTML=html;
}

function openWatch(idx,src){
  var arr=src==='home'?G_HOME:src==='trend'?G_TREND:src==='search'?G_SEARCH:MOCK;
  var v=arr[idx]||MOCK[0];
  if(!v)return;
  watchHist.unshift(v);
  updateStats();
  var isLiked=liked.indexOf(v.id)>-1;
  var isSaved=saved.indexOf(v.id)>-1;
  var all=G_HOME.length?G_HOME:MOCK;
  var related=[];
  for(var i=0;i<all.length;i++){if(all[i].id!==v.id&&related.length<8)related.push(all[i]);}
  var relHTML='';
  for(var i=0;i<related.length;i++){
    var r=related[i];
    var rt=r.thumbnail?('<img src="'+r.thumbnail+'" alt="" loading="lazy" onerror="this.style.display=\'none\'">'):'' ;
    var res=r.thumbnail?'display:none':'';
    relHTML+='<div class="side-card" onclick="openWatch('+i+',\'home\')">';
    relHTML+='<div class="side-thumb">'+rt+'<span style="'+res+'">'+(r.emoji||'▶️')+'</span>';
    relHTML+='<div class="side-dur">'+(r.dur||r.duration||'')+'</div></div>';
    relHTML+='<div class="side-meta"><div class="side-title">'+(r.title||'')+'</div>';
    relHTML+='<div class="side-ch" onclick="event.stopPropagation();openChannel(\''+(r.channel||'').replace(/'/g,"\\'")+'\')">'+(r.channel||'')+'</div>';
    relHTML+='<div style="font-size:11px;color:var(--text2);">'+(r.views||'')+' • '+(r.ago||'')+'</div></div></div>';
  }
  var ch=v.channel||'V';
  var vt=v.thumbnail?('<img src="'+v.thumbnail+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" onerror="this.remove();">'):'';
  var ve=v.thumbnail?'':'<div class="watch-emoji">'+(v.emoji||'▶️')+'</div>';
  document.getElementById('watchPage').innerHTML=
    '<div class="watch-player" id="playerWrap">'+vt+ve+'<div class="big-play" id="bigPlay" onclick="playVid(\''+v.id+'\')"><div class="big-play-btn">▶</div></div></div>'+
    '<div class="watch-info">'+
    '<div class="watch-title">'+(v.title||'')+'</div>'+
    '<div class="watch-stats">'+(v.views||'')+' views • '+(v.ago||'')+'</div>'+
    '<div class="action-row">'+
    '<button class="act-btn'+(isLiked?' liked':'')+'" id="likeBtn" onclick="toggleLike(\''+v.id+'\')">👍 Like</button>'+
    '<button class="act-btn" onclick="showToast(\'👎 Noted!\')">👎</button>'+
    '<button class="act-btn" onclick="showToast(\'🔗 Copied!\')">🔗 Share</button>'+
    '<button class="act-btn" id="saveBtn" onclick="toggleSave(\''+v.id+'\')">'+(isSaved?'✅ Saved':'📥 Save')+'</button>'+
    '</div>'+
    '<div class="ch-row" onclick="openChannel(\''+ch.replace(/'/g,"\\'")+'\')">';+
    '<div class="ch-av-lg" style="background:'+clr(ch)+'">'+ch[0]+'</div>'+
    '<div style="flex:1;min-width:0;"><div class="ch-name">'+ch+' ✓ <span style="font-size:12px;color:var(--text3)">›</span></div>'+
    '<div class="ch-subs">Tap to view channel</div></div>'+
    '<button class="sub-btn" id="subBtn" onclick="event.stopPropagation();toggleSub(this)">Subscribe</button></div>'+
    '<div class="desc-box" onclick="this.classList.toggle(\'expanded\')">'+
    '<div class="desc-text">'+(v.desc||v.description||'No description.')+'</div>'+
    '<div style="font-size:12px;color:var(--text2);margin-top:4px;font-weight:600;">...more</div></div>'+
    '<div class="comments-hdr">💬 Comments</div>'+
    '<div class="comment-input-row"><div class="com-av" style="background:var(--accent)">V</div>'+
    '<input class="comment-input" id="comInput" placeholder="Add a comment..." onkeydown="if(event.key===\'Enter\')postComment()">'+
    '<button class="comment-post" onclick="postComment()">Post</button></div>'+
    '<div id="comList">'+mockComments()+'</div></div>'+
    '<div class="up-next-label">Up next</div>'+relHTML;
  showPage('watch');
  window.scrollTo(0,0);
}

function playVid(id){
  var bp=document.getElementById('bigPlay');
  if(bp)bp.style.display='none';
  var wrap=document.getElementById('playerWrap');
  if(!wrap)return;
  var ifr=document.createElement('iframe');
  ifr.src='https://www.youtube.com/embed/'+id+'?autoplay=1&playsinline=1';
  ifr.allow='autoplay;encrypted-media;fullscreen';
  ifr.allowFullscreen=true;
  wrap.appendChild(ifr);
}

function toggleLike(id){
  var btn=document.getElementById('likeBtn');
  var idx=liked.indexOf(id);
  if(idx>-1){liked.splice(idx,1);if(btn)btn.classList.remove('liked');}
  else{liked.push(id);if(btn)btn.classList.add('liked');showToast('👍 Liked!');}
  updateStats();
}
function toggleSave(id){
  var btn=document.getElementById('saveBtn');
  var idx=saved.indexOf(id);
  if(idx>-1){saved.splice(idx,1);if(btn)btn.textContent='📥 Save';}
  else{saved.push(id);if(btn)btn.textContent='✅ Saved';showToast('⏰ Saved!');}
  updateStats();
}
function toggleSub(btn){
  if(btn.classList.contains('subbed')){btn.classList.remove('subbed');btn.textContent='Subscribe';}
  else{btn.classList.add('subbed');btn.textContent='✅ Subscribed';showToast('🔔 Subscribed!');}
}
function postComment(){
  var inp=document.getElementById('comInput');
  var txt=(inp.value||'').trim();
  if(!txt)return;
  document.getElementById('comList').insertAdjacentHTML('afterbegin','<div class="comment"><div class="com-av" style="background:var(--accent)">V</div><div><div class="com-name">You <span class="com-time">just now</span></div><div class="com-text">'+txt+'</div></div></div>');
  inp.value='';
  showToast('💬 Posted!');
}
function mockComments(){
  var cs=[
    {n:'Aakash Singh',c:'#f44336',t:'2h ago',txt:'Amazing! 🔥'},
    {n:'Priya Sharma',c:'#2196f3',t:'5h ago',txt:'Best video!'},
    {n:'Rahul Kumar',c:'#4caf50',t:'1d ago',txt:'Gold hai 👑'},
    {n:'Sneha Patel',c:'#ff9800',t:'2d ago',txt:'Subscribed! 🙌'}
  ];
  var html='';
  for(var i=0;i<cs.length;i++){
    var c=cs[i];
    html+='<div class="comment"><div class="com-av" style="background:'+c.c+'">'+c.n[0]+'</div><div><div class="com-name">'+c.n+'<span class="com-time">'+c.t+'</span></div><div class="com-text">'+c.txt+'</div></div></div>';
  }
  return html;
}

function openChannel(name){
  if(!name)return;
  currentChannel=name;
  var col=clr(name);
  var allVids=G_HOME.length?G_HOME:MOCK;
  var chVids=[];
  for(var i=0;i<allVids.length;i++){if(allVids[i].channel===name)chVids.push(allVids[i]);}
  var showVids=chVids.length?chVids:allVids;
  document.getElementById('chPageName').textContent=name;
  document.getElementById('chNameXL').textContent=name+' ✓';
  document.getElementById('chHandle').textContent='@'+name.toLowerCase().replace(/ /g,'');
  document.getElementById('chAvXL').textContent=name[0];
  document.getElementById('chAvXL').style.background=col;
  document.getElementById('chBanner').style.background='linear-gradient(135deg,'+col+',#000)';
  var SUBS=['980K','1.2M','3.4M','8.9M','21M','260M','4.5M','18M'];
  document.getElementById('chSubs').textContent=SUBS[name.charCodeAt(0)%SUBS.length];
  document.getElementById('chVids').textContent=Math.floor(Math.random()*400+50);
  document.getElementById('chViews').textContent=(Math.floor(Math.random()*900+100))+'M';
  document.getElementById('chSubBtn').textContent='Subscribe';
  document.getElementById('chSubBtn').classList.remove('subbed');
  var tabs=document.querySelectorAll('.ch-tab');
  for(var i=0;i<tabs.length;i++) tabs[i].classList.remove('active');
  tabs[0].classList.add('active');
  renderChVids(showVids);
  document.getElementById('mainTopbar').style.display='none';
  document.getElementById('bottomNav').style.display='none';
  var pages=document.querySelectorAll('.page');
  for(var i=0;i<pages.length;i++) pages[i].classList.remove('active');
  document.getElementById('watchPage').classList.remove('active');
  document.getElementById('channelPage').classList.add('active');
  window.scrollTo(0,0);
}
function renderChVids(vids){
  var html='<div class="ch-vids-grid">';
  for(var i=0;i<vids.length;i++){
    var v=vids[i];
    var t=v.thumbnail?('<img src="'+v.thumbnail+'" alt="" loading="lazy" onerror="this.style.display=\'none\'">'):'' ;
    var es=v.thumbnail?'display:none':'';
    html+='<div class="ch-vid" onclick="openWatch('+i+',\'home\')"><div class="ch-vid-thumb">'+t+'<span style="'+es+'">'+(v.emoji||'▶️')+'</span><div class="ch-vid-dur">'+(v.dur||v.duration||'')+'</div></div><div class="ch-vid-info"><div class="ch-vid-title">'+(v.title||'')+'</div><div class="ch-vid-stats">'+(v.views||'')+' • '+(v.ago||'')+'</div></div></div>';
  }
  html+='</div>';
  document.getElementById('chContent').innerHTML=html;
}
function chTab(el,tab){
  var tabs=document.querySelectorAll('.ch-tab');
  for(var i=0;i<tabs.length;i++) tabs[i].classList.remove('active');
  el.classList.add('active');
  if(tab==='about'){
    document.getElementById('chContent').innerHTML='<div style="padding:16px 12px;"><div style="font-size:14px;font-weight:700;margin-bottom:8px;">About</div><div style="font-size:13px;color:var(--text2);line-height:1.6;margin-bottom:12px;">Welcome to '+currentChannel+'! Best content for our community. Subscribe!</div><div style="font-size:13px;color:var(--text2);">📅 Joined Jan 2018 &nbsp; 🌍 India</div></div>';
  } else {
    var allVids=G_HOME.length?G_HOME:MOCK;
    var chVids=[];
    for(var i=0;i<allVids.length;i++){if(allVids[i].channel===currentChannel)chVids.push(allVids[i]);}
    renderChVids(chVids.length?chVids:allVids);
  }
}
function toggleChSub(btn){
  if(btn.classList.contains('subbed')){btn.classList.remove('subbed');btn.textContent='Subscribe';}
  else{btn.classList.add('subbed');btn.textContent='✅ Subscribed';showToast('🔔 Subscribed to '+currentChannel+'!');}
}
function closeChannel(){
  document.getElementById('channelPage').classList.remove('active');
  document.getElementById('mainTopbar').style.display='flex';
  document.getElementById('bottomNav').style.display='flex';
  showPage('home');
}

function loadShorts(){
  fetch('/api/youtube?type=shorts')
    .then(function(r){return r.json();})
    .then(function(d){G_SHORTS=(d.videos&&d.videos.length)?d.videos:MOCK_SHORTS;})
    .catch(function(){G_SHORTS=MOCK_SHORTS;});
}
function renderShortSlide(idx){
  var s=G_SHORTS[idx]||MOCK_SHORTS[idx]||MOCK_SHORTS[0];
  if(!s)return;
  var t=s.thumbnail?('<img class="s-thumb" src="'+s.thumbnail+'" onerror="this.style.display=\'none\'">'):'' ;
  var es=s.thumbnail?'display:none':'';
  var slide=document.getElementById('shortSlide');
  slide.innerHTML='<div class="short-slide" id="curShort">'+t+'<div class="s-emoji" style="'+es+'">'+(s.emoji||'▶️')+'</div>'+
    '<div class="short-play-overlay" id="shortPlayOverlay" onclick="playShort(\''+s.id+'\')"><div class="short-play-btn">▶</div></div>'+
    '<div class="short-info"><div class="short-ch">'+(s.channel||'ViewTube')+'</div><div class="short-ttl">'+(s.title||'')+'</div><div class="short-views-b">👁 '+(s.views||'')+' views</div></div>'+
    '<div class="short-actions">'+
    '<button class="s-act" onclick="showToast(\'👍 Liked!\')"><span class="s-act-icon">👍</span><span class="s-act-label">Like</span></button>'+
    '<button class="s-act" onclick="showToast(\'💬 Coming!\')"><span class="s-act-icon">💬</span><span class="s-act-label">Comment</span></button>'+
    '<button class="s-act" onclick="showToast(\'🔗 Shared!\')"><span class="s-act-icon">🔗</span><span class="s-act-label">Share</span></button>'+
    '</div>'+
    '<div style="position:absolute;bottom:16px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,.5);font-size:12px;z-index:6;">'+(idx+1)+' / '+(G_SHORTS.length||MOCK_SHORTS.length)+' &nbsp; ↑ swipe up</div></div>';
  slide.ontouchstart=function(e){touchStartY=e.touches[0].clientY;touchStartTime=Date.now();};
  slide.ontouchend=function(e){
    var dy=touchStartY-e.changedTouches[0].clientY;
    var dt=Date.now()-touchStartTime;
    var total=G_SHORTS.length||MOCK_SHORTS.length;
    if(Math.abs(dy)>60&&dt<600){
      if(dy>0&&shortIdx<total-1){shortIdx++;renderShortSlide(shortIdx);}
      else if(dy<0&&shortIdx>0){shortIdx--;renderShortSlide(shortIdx);}
    }
  };
}
function playShort(id){
  var overlay=document.getElementById('shortPlayOverlay');
  if(overlay)overlay.style.display='none';
  var slide=document.getElementById('curShort');
  if(!slide)return;
  var old=slide.querySelector('iframe');
  if(old)old.remove();
  var ifr=document.createElement('iframe');
  ifr.src='https://www.youtube.com/embed/'+id+'?autoplay=1&playsinline=1&loop=1&playlist='+id;
  ifr.allow='autoplay;encrypted-media;fullscreen';
  ifr.allowFullscreen=true;
  slide.appendChild(ifr);
}
function openShorts(){
  shortIdx=0;
  var shorts=G_SHORTS.length?G_SHORTS:MOCK_SHORTS;
  renderShortSlide(0);
  document.getElementById('shortsPage').classList.add('active');
  document.getElementById('mainTopbar').style.display='none';
  document.getElementById('bottomNav').style.display='none';
  var pages=document.querySelectorAll('.page');
  for(var i=0;i<pages.length;i++) pages[i].classList.remove('active');
  var bns=document.querySelectorAll('.bn-item');
  for(var i=0;i<bns.length;i++) bns[i].classList.remove('active');
  document.getElementById('bn-shorts').classList.add('active');
}
function closeShorts(){
  var ifr=document.querySelector('#shortSlide iframe');
  if(ifr)ifr.remove();
  document.getElementById('shortsPage').classList.remove('active');
  document.getElementById('mainTopbar').style.display='flex';
  document.getElementById('bottomNav').style.display='flex';
  showPage('home');
}

function doSearch(q){
  q=(q||'').trim();
  if(!q)return;
  document.getElementById('searchInput').value=q;
  showPage('search');
  document.getElementById('searchContent').innerHTML='<div style="padding:20px;color:var(--text2)">⏳ Searching...</div>';
  fetch('/api/youtube?type=search&q='+encodeURIComponent(q))
    .then(function(r){return r.json();})
    .then(function(d){
      G_SEARCH=(d.videos&&d.videos.length)?d.videos:MOCK;
      renderSearch(q);
    })
    .catch(function(){
      G_SEARCH=MOCK;
      renderSearch(q);
    });
}
function renderSearch(q){
  var html='<div style="padding:8px 12px;font-size:13px;color:var(--text2);">Results for "<b style="color:var(--text)">'+q+'</b>"</div>';
  for(var i=0;i<G_SEARCH.length;i++){
    var v=G_SEARCH[i];
    var t=v.thumbnail?('<img src="'+v.thumbnail+'" alt="" loading="lazy" onerror="this.style.display=\'none\'">'):'' ;
    var es=v.thumbnail?'display:none':'';
    html+='<div class="search-re
