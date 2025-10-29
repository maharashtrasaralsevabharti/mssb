// Typing animation text
const textArray = [
  "महाराष्ट्र सरळ सेवा भरती",
  "सरकारी योजना",
  "नोकरी भरती",
  "शेतकरी अपडेट्स"
];

let typingElement = document.querySelector(".typing-text");
let arrayIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentText = textArray[arrayIndex];
  
  if (isDeleting) {
    typingElement.textContent = currentText.substring(0, charIndex--);
  } else {
    typingElement.textContent = currentText.substring(0, charIndex++);
  }

  if (!isDeleting && charIndex === currentText.length) {
    isDeleting = true;
    setTimeout(typeEffect, 1500);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    arrayIndex = (arrayIndex + 1) % textArray.length;
    setTimeout(typeEffect, 500);
  } else {
    setTimeout(typeEffect, isDeleting ? 60 : 100);
  }
}

document.addEventListener("DOMContentLoaded", typeEffect);
