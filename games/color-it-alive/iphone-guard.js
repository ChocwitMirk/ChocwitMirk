'use strict';
/* Safari/iOS: keep touches on the artwork, but leave name inputs editable. */
(function(){
  const isColoring=()=>Boolean(document.querySelector('#paintModal.open,#pagePaintModal.open'));
  const editable=el=>Boolean(el&&el.closest&&el.closest('input:not([type="range"]),textarea,[contenteditable="true"]'));
  document.addEventListener('selectstart',e=>{
    if(isColoring()&&!editable(e.target)) e.preventDefault();
  },{passive:false});
  document.addEventListener('contextmenu',e=>{
    if(isColoring()&&!editable(e.target)) e.preventDefault();
  });
  for(const type of ['gesturestart','gesturechange']){
    document.addEventListener(type,e=>{
      if(isColoring()&&e.cancelable)e.preventDefault();
    },{passive:false});
  }
})();
