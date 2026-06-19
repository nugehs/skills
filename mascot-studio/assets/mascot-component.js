/* mascot-component.js — reusable animated mascot template.
   Self-contained: injects its own CSS + inline SVG, exposes a global API.
   No dependencies, no build step. Drop in <script src="mascot.js"></script>.

   CUSTOMIZE:
     1. PALETTE below — swap to the brand hex.
     2. The SVG body inside SVG`...` — replace the generic creature with your
        constructed character (keep the group structure + class names).
     3. The face groups (data-face="...") — design one per product moment.
     4. SAY copy — match the product voice.

   API (window.Mascot):
     Mascot.react(state)  'ready'|'thinking'|'happy'|'celebrate'|'sad'|'surprised'
     Mascot.show() / hide()
     Mascot.wave()
     Mascot.say(text, ms)
*/
(function () {
  if (window.Mascot) return;

  var PALETTE = {
    body:   '#2DC6C0',   /* primary fill            */
    dark:   '#14857F',   /* outline / detail        */
    light:  '#E9FBF9',   /* belly / highlight       */
    accent: '#FFC23C',   /* signature feature       */
    cheek:  '#FF9E8F',   /* cheeks                  */
    ink:    '#14302E',   /* eyes / mouth            */
    bubble: '#1A2A66', bubbleBorder: '#22398F', bubbleText: '#EEF3FF'
  };

  var HYPE = { celebrate: 1 };           /* states that raise arms + pulse glow */
  var SAY = {
    happy: ['Nice!'], celebrate: ['Woohoo!'], sad: ['Aw, try again'], surprised: ['Whoa!']
  };

  var CSS = [
    '.msc-wrap{position:fixed;right:18px;bottom:18px;width:120px;height:140px;z-index:9000;',
    'pointer-events:none;opacity:0;transform:translateY(16px) scale(.6);',
    'transition:opacity .4s ease, transform .5s cubic-bezier(.2,.8,.3,1.4)}',
    '.msc-wrap.msc-on{opacity:1;transform:translateY(0) scale(1)}',
    '.msc-svg{position:absolute;left:0;bottom:0;width:120px;height:120px;overflow:visible}',
    '.msc-bob{transform-box:fill-box;transform-origin:50% 100%;animation:mscBob 3.6s ease-in-out infinite}',
    '.msc-torso{transform-box:fill-box;transform-origin:50% 90%;animation:mscBreathe 3.6s ease-in-out infinite}',
    '.msc-inner{transform-box:fill-box;transform-origin:50% 100%;transition:transform .25s ease}',
    '.msc-inner.msc-squash{transform:scale(1.04,.96)}',
    '.msc-inner.msc-wiggle{animation:mscWiggle .5s ease}',
    '.msc-eyes{transform-box:fill-box;transform-origin:50% 50%}',
    '.msc-eyes.msc-blink{animation:mscBlink .16s ease}',
    '.msc-sig{transform-box:fill-box;transform-origin:50% 100%;animation:mscFlick 2.4s ease-in-out infinite}',
    '.msc-glow{transform-box:fill-box;transform-origin:center;opacity:.12}',
    '.msc-glow.msc-pulse{animation:mscPulse 1.2s ease-in-out infinite}',
    '.msc-arm{transform-box:fill-box;transform-origin:50% 14%;transition:transform .3s ease}',
    '.msc-armL{transform:rotate(-18deg)}.msc-armR{transform:rotate(18deg)}',
    '.msc-armL.msc-up{transform:rotate(-62deg)}.msc-armR.msc-up{transform:rotate(62deg)}',
    '.msc-armR.msc-wave{animation:mscWave .5s ease-in-out 3}',
    '.msc-face{display:none}.msc-face.msc-show{display:block}',
    '.msc-spk{transform-box:fill-box;transform-origin:center;animation:mscTw 1.1s ease-in-out infinite}',
    '.msc-pupils{transition:transform .12s ease-out}',
    '.msc-bubble{position:absolute;right:8px;bottom:118px;max-width:150px;border-radius:14px;',
    'padding:7px 11px;font-size:13px;line-height:1.25;font-family:system-ui,sans-serif;',
    'opacity:0;transform:translateY(6px) scale(.9);transform-origin:bottom right;',
    'transition:opacity .25s ease, transform .3s cubic-bezier(.2,.8,.3,1.4)}',
    '.msc-bubble.msc-on{opacity:1;transform:translateY(0) scale(1)}',
    '@keyframes mscBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}',
    '@keyframes mscBreathe{0%,100%{transform:scale(1,1)}50%{transform:scale(.99,1.025)}}',
    '@keyframes mscBlink{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.1)}}',
    '@keyframes mscFlick{0%,100%{opacity:1}50%{opacity:.78}}',
    '@keyframes mscPulse{0%,100%{transform:scale(1);opacity:.12}50%{transform:scale(1.15);opacity:.28}}',
    '@keyframes mscWave{0%,100%{transform:rotate(40deg)}50%{transform:rotate(74deg)}}',
    '@keyframes mscWiggle{0%,100%{transform:rotate(0)}20%{transform:rotate(-6deg)}40%{transform:rotate(5deg)}60%{transform:rotate(-3deg)}80%{transform:rotate(2deg)}}',
    '@keyframes mscTw{0%,100%{transform:scale(.5);opacity:.3}50%{transform:scale(1.1);opacity:1}}',
    '@media (prefers-reduced-motion:reduce){.msc-bob,.msc-torso,.msc-sig,.msc-glow{animation:none}}'
  ].join('');

  var P = PALETTE;
  /* --- Generic creature. Replace with your constructed character. --------- */
  var SVG =
    '<svg class="msc-svg" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<g class="msc-bob">' +
    '<ellipse class="msc-glow" cx="160" cy="190" rx="110" ry="104" fill="' + P.body + '"/>' +
    '<g class="msc-sig"><path d="M160 96 C140 74 146 44 172 36 C184 60 178 86 160 98 Z" fill="' + P.accent + '"/></g>' +
    '<g class="msc-arm msc-armL"><ellipse cx="74" cy="206" rx="14" ry="24" fill="' + P.body + '"/></g>' +
    '<g class="msc-arm msc-armR"><ellipse cx="246" cy="206" rx="14" ry="24" fill="' + P.body + '"/></g>' +
    '<g class="msc-torso">' +
    '<ellipse cx="160" cy="190" rx="104" ry="110" fill="' + P.body + '" stroke="' + P.dark + '" stroke-width="6"/>' +
    '<ellipse cx="160" cy="214" rx="66" ry="74" fill="' + P.light + '"/>' +
    '<circle cx="104" cy="214" r="13" fill="' + P.cheek + '"/><circle cx="216" cy="214" r="13" fill="' + P.cheek + '"/>' +
    '</g>' +
    '<g class="msc-face msc-show" data-face="ready">' +
    '<g class="msc-eyes">' +
    '<circle cx="134" cy="180" r="22" fill="#fff"/><circle cx="186" cy="180" r="22" fill="#fff"/>' +
    '<g class="msc-pupils">' +
    '<circle cx="139" cy="183" r="11" fill="' + P.ink + '"/><circle cx="181" cy="183" r="11" fill="' + P.ink + '"/>' +
    '<circle cx="135" cy="177" r="4.5" fill="#fff"/><circle cx="177" cy="177" r="4.5" fill="#fff"/>' +
    '</g></g>' +
    '<path d="M138 202 Q160 226 182 202 Q160 214 138 202 Z" fill="' + P.ink + '"/>' +
    '</g>' +
    '<g class="msc-face" data-face="thinking">' +
    '<circle cx="134" cy="180" r="20" fill="#fff"/><circle cx="186" cy="180" r="20" fill="#fff"/>' +
    '<circle cx="136" cy="174" r="10" fill="' + P.ink + '"/><circle cx="184" cy="174" r="10" fill="' + P.ink + '"/>' +
    '<path d="M148 208 Q160 204 174 208" stroke="' + P.ink + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '</g>' +
    '<g class="msc-face" data-face="happy">' +
    '<path d="M116 180 Q134 162 152 180" stroke="' + P.ink + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    '<path d="M168 180 Q186 162 204 180" stroke="' + P.ink + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    '<path d="M138 200 Q160 226 182 200 Q160 214 138 200 Z" fill="' + P.ink + '"/>' +
    '</g>' +
    '<g class="msc-face" data-face="celebrate">' +
    '<path d="M116 180 Q134 162 152 180" stroke="' + P.ink + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    '<path d="M168 180 Q186 162 204 180" stroke="' + P.ink + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    '<path d="M134 198 Q160 232 186 198 Q160 214 134 198 Z" fill="' + P.ink + '"/>' +
    '<path class="msc-spk" d="M92 154 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2 Z" fill="' + P.accent + '"/>' +
    '<path class="msc-spk" d="M226 154 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2 Z" fill="' + P.accent + '"/>' +
    '</g>' +
    '<g class="msc-face" data-face="sad">' +
    '<circle cx="134" cy="182" r="18" fill="#fff"/><circle cx="186" cy="182" r="18" fill="#fff"/>' +
    '<circle cx="136" cy="184" r="9" fill="' + P.ink + '"/><circle cx="184" cy="184" r="9" fill="' + P.ink + '"/>' +
    '<path d="M146 210 Q160 200 176 210" stroke="' + P.ink + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '</g>' +
    '<g class="msc-face" data-face="surprised">' +
    '<circle cx="132" cy="178" r="24" fill="#fff"/><circle cx="188" cy="178" r="24" fill="#fff"/>' +
    '<circle cx="134" cy="180" r="11" fill="' + P.ink + '"/><circle cx="186" cy="180" r="11" fill="' + P.ink + '"/>' +
    '<circle cx="160" cy="208" r="8" fill="' + P.ink + '"/>' +
    '</g>' +
    '</g></svg>';
  /* ----------------------------------------------------------------------- */

  var wrap, bubble, sig, glow, armL, armR, eyes, pupils, faces, current = 'ready';
  var bubbleTimer;

  function injectCSS() {
    if (document.getElementById('msc-css')) return;
    var s = document.createElement('style'); s.id = 'msc-css'; s.textContent = CSS;
    document.head.appendChild(s);
  }

  function mount(parent) {
    if (wrap) return wrap;
    injectCSS();
    wrap = document.createElement('div'); wrap.className = 'msc-wrap'; wrap.setAttribute('aria-hidden', 'true');
    bubble = document.createElement('div'); bubble.className = 'msc-bubble';
    bubble.style.background = P.bubble; bubble.style.color = P.bubbleText;
    bubble.style.border = '2px solid ' + P.bubbleBorder;
    wrap.appendChild(bubble);
    var host = document.createElement('div'); host.innerHTML = SVG; wrap.appendChild(host.firstChild);
    (parent || document.body).appendChild(wrap);

    sig = wrap.querySelector('.msc-sig'); glow = wrap.querySelector('.msc-glow');
    armL = wrap.querySelector('.msc-armL'); armR = wrap.querySelector('.msc-armR');
    eyes = wrap.querySelector('.msc-eyes'); pupils = wrap.querySelector('.msc-pupils');
    faces = wrap.querySelectorAll('.msc-face');
    var inner = wrap.querySelector('.msc-svg');

    setInterval(function () {
      if (current !== 'ready' && current !== 'thinking') return;
      eyes.classList.remove('msc-blink'); void eyes.offsetWidth; eyes.classList.add('msc-blink');
    }, 3400);

    document.addEventListener('mousemove', function (ev) {
      if (!wrap.classList.contains('msc-on') || (current !== 'ready' && current !== 'thinking') || !pupils) return;
      var r = inner.getBoundingClientRect(); if (!r.width) return;
      var dx = ev.clientX - (r.left + r.width / 2), dy = ev.clientY - (r.top + r.height * 0.45);
      var d = Math.sqrt(dx * dx + dy * dy) || 1;
      pupils.style.transform = 'translate(' + ((dx / d) * 6).toFixed(1) + 'px,' + ((dy / d) * 5).toFixed(1) + 'px)';
    });
    return wrap;
  }

  function react(state) {
    if (!wrap) mount(); if (!faces) return;
    var hype = !!HYPE[state];
    for (var i = 0; i < faces.length; i++) faces[i].classList.toggle('msc-show', faces[i].getAttribute('data-face') === state);
    armL.classList.toggle('msc-up', hype); armR.classList.toggle('msc-up', hype);
    glow.classList.toggle('msc-pulse', hype);
    current = state;
    if (SAY[state]) say(SAY[state][Math.floor(Math.random() * SAY[state].length)], 1800);
    else hideBubble();
  }
  function say(text, ms) { if (!wrap) mount(); bubble.textContent = text; bubble.classList.add('msc-on'); clearTimeout(bubbleTimer); if (ms !== 0) bubbleTimer = setTimeout(hideBubble, ms || 2000); }
  function hideBubble() { if (bubble) bubble.classList.remove('msc-on'); }
  function wave() { if (!wrap) mount(); if (armR.classList.contains('msc-up')) return; armR.classList.remove('msc-wave'); void armR.offsetWidth; armR.classList.add('msc-wave'); }
  function show() { if (!wrap) mount(); wrap.classList.add('msc-on'); }
  function hide() { if (wrap) { wrap.classList.remove('msc-on'); hideBubble(); } }

  window.Mascot = { mount: mount, react: react, say: say, wave: wave, show: show, hide: hide };
  if (document.readyState !== 'loading') mount(); else document.addEventListener('DOMContentLoaded', function () { mount(); });
})();
