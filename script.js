// ===== Typing Animation for Maharashtra Saral Seva Bharti =====

const textArray = [
  "महाराष्ट्र सरळ सेवा भरती",
  "सरकारी योजना",
  "नोकरी भरती",
  "शेतकरी अपडेट्स"
];

let typingText = document.getElementById("typing-text");
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentText = textArray[textIndex];
  
  if (isDeleting) {
    typingText.textContent = currentText.substring(0, charIndex--);
  } else {
    typingText.textContent = currentText.substring(0, charIndex++);
  }

  if (!isDeleting && charIndex === currentText.length) {
    isDeleting = true;
    setTimeout(typeEffect, 1000); // pause after typing
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % textArray.length;
    setTimeout(typeEffect, 300);
  } else {
    setTimeout(typeEffect, isDeleting ? 70 : 100);
  }
}

document.addEventListener("DOMContentLoaded", typeEffect);
