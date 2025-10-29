// Typing animation for Marathi tagline
const textArray = [
  "ऑनलाईन माहिती हक्काची फक्त महाराष्ट्र सरळ सेवा भरती वर"
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 100;
const deletingSpeed = 60;
const delayBetween = 1500;

function type() {
  const text = textArray[textIndex];
  const display = document.getElementById("typing-text");

  if (!display) return;

  if (!isDeleting && charIndex <= text.length) {
    display.textContent = text.substring(0, charIndex++);
    setTimeout(type, typingSpeed);
  } else if (isDeleting && charIndex >= 0) {
    display.textContent = text.substring(0, charIndex--);
    setTimeout(type, deletingSpeed);
  } else {
    isDeleting = !isDeleting;
    if (!isDeleting) {
      textIndex = (textIndex + 1) % textArray.length;
    }
    setTimeout(type, delayBetween);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(type, 400);
});
