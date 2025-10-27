
// Basic JS: search filter for posts
document.addEventListener('DOMContentLoaded', function(){
  const input = document.getElementById('searchInput');
  if(!input) return;
  input.addEventListener('input', function(e){
    const q = e.target.value.toLowerCase();
    const posts = document.querySelectorAll('.post');
    posts.forEach(p=>{
      const text = p.innerText.toLowerCase();
      p.style.display = text.includes(q) ? '' : 'none';
    });
  });
});
