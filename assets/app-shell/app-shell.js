(function(){
  'use strict';
  if(document.documentElement.dataset.appShellBooted==='true') return;
  document.documentElement.dataset.appShellBooted='true';

  var path=location.pathname;
  var isNested=path.indexOf('/connections/')!==-1;
  var homeBase=isNested?'../index.html':'index.html';
  var nav=document.querySelector('.site-nav');

  if(!nav){
    nav=document.createElement('nav');
    nav.className='site-nav';
    nav.setAttribute('aria-label','Primary navigation');
    document.body.insertBefore(nav,document.body.firstChild);
  }

  var oldLogo=nav.querySelector('.nav-logo');
  var oldLinks=Array.prototype.slice.call(nav.querySelectorAll('a')).filter(function(a){
    return !a.classList.contains('nav-logo');
  });

  var isHome=/(^|\/)(index\.html)?$/.test(path);
  document.body.classList.toggle('app-shell-home',isHome);
  nav.classList.add('app-shell');
  nav.innerHTML='';

  var bar=document.createElement('div');
  bar.className='app-shell__bar';

  var logo=oldLogo||document.createElement('a');
  logo.classList.add('nav-logo');
  logo.href=homeBase;
  logo.setAttribute('aria-label','3Dudes1Life Creative home');
  if(!logo.querySelector('img')){
    var img=document.createElement('img');
    img.src=isNested?'../logo.png':'logo.png';
    img.alt='3Dudes1Life Creative';
    logo.appendChild(img);
  }

  var primary=document.createElement('a');
  primary.className='app-shell__primary';
  primary.href=homeBase+'#latest';
  primary.textContent='Latest Episode';

  var toggle=document.createElement('button');
  toggle.className='app-shell__toggle';
  toggle.type='button';
  toggle.setAttribute('aria-label','Open menu');
  toggle.setAttribute('aria-expanded','false');
  toggle.innerHTML='<span class="app-shell__toggle-lines" aria-hidden="true"></span>';

  var menu=document.createElement('div');
  menu.className='app-shell__menu';
  menu.id='app-shell-menu';
  menu.setAttribute('aria-label','Site menu');
  toggle.setAttribute('aria-controls',menu.id);

  var fallbackLinks=[
    ['✨','The Universe',homeBase+'#universe'],
    ['🎙️','Podcast',homeBase+'#podcast'],
    ['🎙️','Latest Episode',homeBase+'#latest'],
    ['📚','Books',homeBase+'#book'],
    ['🌎','Adventures',homeBase+'#adventures'],
    ['📝','Blog',homeBase+'#blog'],
    ['📬','Contact',homeBase+'#contact']
  ];

  function iconFor(text){
    text=(text||'').toLowerCase();
    if(text.indexOf('universe')>-1||text==='home')return'✨';
    if(text.indexOf('podcast')>-1||text.indexOf('episode')>-1)return'🎙️';
    if(text.indexOf('book')>-1)return'📚';
    if(text.indexOf('adventure')>-1)return'🌎';
    if(text.indexOf('blog')>-1)return'📝';
    if(text.indexOf('contact')>-1)return'📬';
    return'→';
  }

  if(oldLinks.length){
    oldLinks.forEach(function(a){
      var clone=a.cloneNode(true);
      var label=(clone.textContent||'Explore').trim();
      clone.textContent='';
      var icon=document.createElement('span');
      icon.setAttribute('aria-hidden','true');
      icon.textContent=iconFor(label);
      var txt=document.createElement('span');
      txt.textContent=label;
      clone.appendChild(icon);
      clone.appendChild(txt);
      menu.appendChild(clone);
    });
  }else{
    fallbackLinks.forEach(function(item){
      var a=document.createElement('a');
      a.href=item[2];
      a.innerHTML='<span aria-hidden="true">'+item[0]+'</span><span>'+item[1]+'</span>';
      menu.appendChild(a);
    });
  }

  var divider=document.createElement('div');
  divider.className='app-shell__divider';
  menu.appendChild(divider);

  var install=document.createElement('a');
  install.href=homeBase+'#app-install';
  install.innerHTML='<span aria-hidden="true">📲</span><span>Install the App</span>';
  menu.appendChild(install);

  var note=document.createElement('div');
  note.className='app-shell__menu-note';
  note.textContent='Podcast, books, travel guides, stories, and the full 3Dudes1Life universe—all in one place.';
  menu.appendChild(note);

  var scrim=document.createElement('div');
  scrim.className='app-shell__scrim';
  scrim.setAttribute('aria-hidden','true');

  bar.appendChild(logo);
  bar.appendChild(primary);
  bar.appendChild(toggle);
  nav.appendChild(bar);
  nav.appendChild(menu);
  nav.appendChild(scrim);

  function closeMenu(restoreFocus){
    document.body.classList.remove('app-menu-open');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open menu');
    if(restoreFocus) toggle.focus();
  }
  function openMenu(){
    document.body.classList.add('app-menu-open');
    toggle.setAttribute('aria-expanded','true');
    toggle.setAttribute('aria-label','Close menu');
    var first=menu.querySelector('a');
    if(first)setTimeout(function(){first.focus()},50);
  }

  toggle.addEventListener('click',function(){
    document.body.classList.contains('app-menu-open')?closeMenu(false):openMenu();
  });
  scrim.addEventListener('click',function(){closeMenu(false)});
  menu.addEventListener('click',function(e){if(e.target.closest('a'))closeMenu(false)});
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&document.body.classList.contains('app-menu-open'))closeMenu(true);
  });
  window.addEventListener('resize',function(){if(innerWidth>1100)closeMenu(false)});

  var installSection=document.querySelector('.app-install');
  if(installSection&&!installSection.id)installSection.id='app-install';
})();
