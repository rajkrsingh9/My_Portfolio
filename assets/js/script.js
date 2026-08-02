'use strict';


(function initSplashScreen() {
  const splashScreen = document.getElementById('splashScreen');
  const splashName = document.getElementById('splashName');
  const fullName = 'aj Kr. Singh';
  let charIndex = 0;

  // Start typing after "R" initial animation finishes
  setTimeout(() => {
    const typingInterval = setInterval(() => {
      if (charIndex < fullName.length) {
        const char = document.createElement('span');
        char.className = 'typing-char';
        
        // Preserve space rendering using non-breaking space if needed
        const currentChar = fullName[charIndex];
        char.textContent = currentChar === ' ' ? '\u00A0' : currentChar;

        const cursor = splashName.querySelector('.cursor-blink');
        if (cursor) cursor.remove();

        splashName.appendChild(char);
        charIndex++;

        const newCursor = document.createElement('span');
        newCursor.className = 'cursor-blink';
        splashName.appendChild(newCursor);
      } else {
        clearInterval(typingInterval);
        
        // Keep cursor blinking briefly after typing finishes, then remove before burst
        setTimeout(() => {
          const cursor = splashName.querySelector('.cursor-blink');
          if (cursor) cursor.style.opacity = '0';
        }, 500);
      }
    }, 70);
  }, 600);

  // Remove element completely after burst animation finishes (2.8s delay + 0.7s duration)
  setTimeout(() => {
    if (splashScreen) {
      splashScreen.remove();
    }
  }, 3500);
})();



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// about text "read more" toggle variables
const aboutText = document.querySelector(".about-text");
const aboutReadMoreBtn = document.querySelector("[data-about-read-more]");
const aboutReadMoreText = aboutReadMoreBtn ? aboutReadMoreBtn.querySelector(".about-read-more-text") : null;

if (aboutReadMoreBtn) {
  aboutReadMoreBtn.addEventListener("click", function () {

    const isExpanded = aboutText.classList.toggle("expanded");

    aboutReadMoreText.textContent = isExpanded ? "Read Less" : "Read More";
    aboutReadMoreBtn.setAttribute("aria-expanded", isExpanded);

  });
}



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}











// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}