
const texts = ["ऑनलाइन माहिती हक्काची फक्त महाराष्ट्र सरळ सेवा भरती वर"];
let typingEl = document.getElementById('typing-text');
let idxText = 0, idxChar = 0, deleting = false;
function typeLoop(){
  const full = texts[idxText];
  if(!deleting){
    typingEl.textContent = full.substring(0, ++idxChar);
    if(idxChar === full.length){
      deleting = true;
      setTimeout(typeLoop, 1500);
      return;
    }
  } else {
    typingEl.textContent = full.substring(0, --idxChar);
    if(idxChar === 0){
      deleting = false;
      setTimeout(typeLoop, 500);
      return;
    }
  }
  setTimeout(typeLoop, deleting ? 60 : 100);
}
document.addEventListener('DOMContentLoaded', ()=>{ setTimeout(typeLoop, 300); });
