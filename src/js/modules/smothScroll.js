import { elementScrollIntoView } from "seamless-scroll-polyfill";

const smothScroll = () => {
   const getNav = document.querySelector('.main-display__menu');

   const activeLink = (e) => {
      e.preventDefault();
      const target = e.target;
      if (target.closest('.main-display__menu-item')) {
         const getId = target.getAttribute('href').slice(1);
         const getSection = document.getElementById(getId);
         if (getSection) {
            elementScrollIntoView(getSection, { behavior: "smooth", block: "center", inline: "center" });
         }
      }
   };

   getNav.addEventListener('click', activeLink);
};
export default smothScroll;