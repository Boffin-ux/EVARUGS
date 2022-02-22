const disableScroll = () => {
   document.body.dataset.scrollY = window.scrollY;

   const scrollWidth = window.innerWidth - document.body.offsetWidth;

   document.body.style.cssText = `
      position: fixed;
      top: -${window.scrollY}px;
      left: 0;
      width: 100%;
      overflow: hidden;
      height: 100vh;
      padding-right: ${scrollWidth}px;
   `;
};
const enableScroll = () => {
   document.body.style.cssText = '';
   window.scroll({
      top: document.body.dataset.scrollY
   });
};

export { disableScroll, enableScroll };
