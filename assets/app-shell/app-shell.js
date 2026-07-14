(function(){
  'use strict';
  var nav=document.querySelector('.site-nav');
  if(!nav||nav.dataset.appShellReady==='true') return;
  nav.dataset.appShellReady='true';

  var isNested=location.pathname.indexOf('/connections/')!==-1;
  var homeHref=isNested?'../index.html':'index.html';
  var homeBase=isNested?'../index.html':'index.html';
  var oldLogo=nav.querySelector('.nav-logo');
  var oldLinks=Array.prototype.slice.call(nav.querySelectorAll('a')).filter(function(a){return !a.classList.contains('nav-logo');});

  document.body.classList.toggle('app-shell-home',/\/(index\.html)?$/.test(location.pathname));
  nav.classList.add('app-shell');
  nav.innerHTML='';

  var bar=document.createElement('div'); bar.className='app-shell__bar';
  var logo=oldLogo||document.createElement('a'); logo.classList.add('nav-logo'); logo.href=homeHref; logo.setAttribute('aria-label','3Dudes1Life Creative home');
  if(!logo.querySelector('img')){var img=document.createElement('img');img.src=isNested?'../logo.png':'logo.png';img.alt='3Dudes1Life Creative';logo.appendChild(img)}

  var primary=document.createElement('a'); primary.className='app-shell__primary'; primary.href=homeBase+'#latest'; primary.textContent='Latest Episode';
  var toggle=document.createElement('button'); toggle.className='app-shell__toggle'; toggle.type='button'; toggle.setAttribute('aria-label','Open menu'); toggle.setAttribute('aria-expanded','false'); toggle.innerHTML='<span class="app-shell__toggle-lines" aria-hidden="true"></span>';
  var menu=document.createElement('div'); menu.className='app-shell__menu'; menu.id='app-shell-menu'; toggle.setAttribute('aria-controls',menu.id);

  function iconFor(text){
    text=text.toLowerCase();
    if(text.indexOf('universe')>-1||text==='home')return'✨';
    if(text.indexOf('podcast')>-1||text.indexOf('episode')>-1)return'🎙️';
    if(text.indexOf('book')>-1)return'📚';
    if(text.indexOf('adventure')>-1)return'🌎';
    if(text.indexOf('blog')>-1)return'📝';
    if(text.indexOf('contact')>-1)return'📬';
    return'→';
  }
  oldLinks.forEach(function(a){
    var clone=a.cloneNode(true); var label=(clone.textContent||'Explore').trim(); clone.textContent='';
    var icon=document.createElement('span');icon.setAttribute('aria-hidden','true');icon.textContent=iconFor(label);
    var txt=document.createElement('span');txt.textContent=label;clone.appendChild(icon);clone.appendChild(txt);menu.appendChild(clone);
  });
  var divider=document.createElement('div');divider.className='app-shell__divider';menu.appendChild(divider);
  var install=document.createElement('a');install.href=homeBase+'#app-install';install.innerHTML='<span aria-hidden="true">📲</span><span>Install the App</span>';menu.appendChild(install);
  var note=document.createElement('div');note.className='app-shell__menu-note';note.textContent='Podcast, books, travel guides, stories, and the full 3Dudes1Life universe—all in one place.';menu.appendChild(note);
  var scrim=document.createElement('div');scrim.className='app-shell__scrim';scrim.setAttribute('aria-hidden','true');

  bar.appendChild(logo);bar.appendChild(primary);bar.appendChild(toggle);nav.appendChild(bar);nav.appendChild(menu);nav.appendChild(scrim);

  function closeMenu(){document.body.classList.remove('app-menu-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu')}
  function openMenu(){document.body.classList.add('app-menu-open');toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','Close menu');var first=menu.querySelector('a');if(first)setTimeout(function(){first.focus()},50)}
  toggle.addEventListener('click',function(){document.body.classList.contains('app-menu-open')?closeMenu():openMenu()});
  scrim.addEventListener('click',closeMenu);
  menu.addEventListener('click',function(e){if(e.target.closest('a'))closeMenu()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu()});
  window.addEventListener('resize',function(){if(innerWidth>1100)closeMenu()});

  var installSection=document.querySelector('.app-install'); if(installSection&&!installSection.id)installSection.id='app-install';
})();
