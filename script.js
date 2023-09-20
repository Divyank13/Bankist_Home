"use strict";
/*--------------------------------------------ELEMENT SELECTOR---------------------------------------------------
 */
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const nav = document.querySelector(".nav");
const section1 = document.querySelector("#section--1");
const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;
const allSections = document.querySelectorAll(".section");
/*--------------------------------------------Modal window---------------------------------------------------
 */

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//-----------------------------------Implementiing smooth scroll on (btn--scroll-to)---------------------------------------
const btnScrollTo = document.querySelector(".btn--scroll-to");
btnScrollTo.addEventListener("click", function (e) {
  section1.scrollIntoView({ behavior: "smooth" });
});

//---------------------------Implementing smooth scroll on nav items using eventDeleagtion--------------------
//1.} add eventlistener on a common parent element
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();
  //2.} Check the target element
  //3.}Matching the target element class with the child class of the above selected parent class
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({
      behavior: "smooth",
    });
  }
});

//---------------------------------------Implementing Tabbing in the operation section---------------------------------------------
//Selecting the elements
const tabsContainer = document.querySelector(".operations__tab-container");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContent = document.querySelectorAll(".operations__content");
//-------------------------------------Event Delegation-----------------------------------
//adding eventListener to the parent element
tabsContainer.addEventListener("click", function (e) {
  //Matching the elements
  const clicked = e.target.closest(".operations__tab");

  // //Guard clause :-not throw error in case click has been somewhere else in the tabscontainer
  if (!clicked) return;

  //removing the class responsible for popping up the tab from all the tabs.
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));

  //removing the class responsible for tab content display of the selected tab
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));

  //adding the class responsible for popping up the tab to the selected tab
  clicked.classList.add("operations__tab--active");

  //adding the class responsible for tab content display of the selected tab
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});
//----------------------------------------------MENU FADE DELEGATION--------------------------------------------------------
//Function to avoid DRY
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");
    siblings.forEach((el) => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};

//For blurring other elements (PASSING ARGUMENT IN EVENT-LISTENER,USING BIND METHOD)
nav.addEventListener("mouseover", handleHover.bind(0.5));

//For making things back to normal  (PASSING ARGUMENT IN EVENT-LISTENER,USING BIND METHOD)
nav.addEventListener("mouseout", handleHover.bind(1));

//-----------------------------------------STICKY NAV BAR-----------------------------------------------------
//We want to stick our NAV BAR on the top of the screen as we scroll down the page,but it should appear after
//we reach the first section.
// const initialCord = section1.getBoundingClientRect();
// window.addEventListener("scroll", function () {
//   if (window.scrollY > initialCord.top) {
//     nav.classList.add("sticky");
//   } else {
//     nav.classList.remove("sticky");
//   }
// });
//This is not a good way of implementing this,to implement it in a better way we will use Intersection Observer API.

//----------------------------------------INTERSECTION OBSERVER API------------------------------------------------------
//Call back function
const stickyNav = function (entries) {
  const [entry] = entries; //Destructuring,equivalent to entries[0]
  //Condition for adding and removing the navBar from the screen
  if (!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
};

//Intersection Observer API
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, //since we want to observe in the viewPort
  threshold: 0, //We want the effect when the header is completely gone from the viewport
  rootMargin: `-${navHeight}px`,
});

//calling the API for the target element,here it is header
headerObserver.observe(header);

/*-------------------------------------REVEALING ELEMENTS WHILE WE SCROLL CLOSE TO THEM------------------------
 */
//Creating a callBack function to reveal the upComing elements(sections)
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return; //Guard clause
  entry.target.classList.remove("section--hidden");
  //In order to prevent the function from running after once it has been run for all the element
  observer.unobserve(entry.target);
};

//Intersection Observer API
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

//Calling the API for each section
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  //adding section--hidden on each section
  section.classList.add("section--hidden");
});

//--------------------------------------------LAZY IMAGE LOADER-------------------------------------------------
const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  //Changing img src with data-src
  entry.target.src = entry.target.dataset.src;
  //adding eventListener
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });
  observer.unobserve(entry.target);
};

//IntersectionObserver API
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.5,
  rootMargin: "200px",
});

//Calling API on every required images
imgTargets.forEach((img) => imgObserver.observe(img));

//------------------------------------------SLIDING COMPONENTS--------------------------------------------------
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnleft = document.querySelector(".slider__btn--left");
  const btnright = document.querySelector(".slider__btn--right");
  let curr = 0;
  const min = 0;
  const max = slides.length;
  const dotContainer = document.querySelector(".dots");

  //Function to move to the required slide
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class ="dots__dot" data-slide="${i}">
    </button>`
      );
    });
  };

  //Function to make the active button blink
  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    //adding the class to the active slide
    document
      .querySelector(`.dots__dot[data-slide = "${slide}"]`)
      .classList.add("dots__dot--active");
  };
  //Calling the function activateDot() to highlight the 1st dot on refreshing the page

  //Function to slide the elements
  const goToSlides = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  //Next slide function
  const nextSlide = function () {
    if (curr == max - 1) {
      curr = 0;
    } else {
      curr++;
    }
    goToSlides(curr);
    activateDot(curr);
  };

  //Function containing all the function that needs to be called at the time of page reload
  const init = function () {
    createDots();
    activateDot(0);
    //looping over slides nodeList
    goToSlides(0);
  };

  init();

  //Implementing functionality of right button(NEXT SLIDE)
  btnright.addEventListener("click", nextSlide);

  //Previous slide Function
  const prevSlide = function () {
    if (curr == 0) {
      curr = max - 1;
    } else {
      curr--;
    }
    goToSlides(curr);
    activateDot(curr);
  };
  //Implementing functionality of left button(PREVIOUS SLIDE)
  btnleft.addEventListener("click", prevSlide);

  //Implementing arrow buttons for sliding
  document.addEventListener("keydown", function (e) {
    if (e.key == "ArrowRight") {
      nextSlide();
    } else if (e.key === "ArrowLeft") {
      prevSlide();
    }
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset; //destructuring
      goToSlides(slide);
      activateDot(slide);
    }
  });
};
//calling the slider function
slider();
