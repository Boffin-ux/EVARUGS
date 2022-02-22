class SliderTouch {
   constructor({
      sliderWrap,
      sliderItems,
      slidesToShow = 3,
      position = 0,
      addClassName = false,
      classActiveItem = false,
      classNextItem = false,
      classPrevItem = false,
      responsive = [],
   }) {
      this.sliderWrap = document.querySelector(sliderWrap);
      this.sliderItems = document.querySelector(sliderItems);
      this.slides = this.sliderItems.children;
      this.slidesToShow = slidesToShow;
      this.widthSlide = (100 / this.slidesToShow);
      this.addClassName = addClassName;
      this.position = position;
      this.responsive = responsive;
      this.firstSlide = this.slides[0];
      this.lastSlide = this.slides[this.slides.length - 1];
      this.classActiveItem = classActiveItem || 'active';
      this.classNextItem = classNextItem || 'next';
      this.classPrevItem = classPrevItem || 'prev';

      this.swipeStart = this.dragStart.bind(this);
      this.swipeEnd = this.dragEnd.bind(this);
      this.swipeAction = this.dragMove.bind(this);
      this.moveNext = this.nextSlide.bind(this);
      this.movePrev = this.prevSlide.bind(this);

      this.isDrag = false;
      this.animationId = '';
      this.timerId = '';
      this.timeTransform = '.6';
      this.startPosition = 0;
      this.currentTranslate = 0;
      this.prevTranslate = 0;
      this.mobilePosition = false;
      this.moving = this.widthSlide / 10;
      this.blockSlide = false;
   }
   cloneSlides() {
      if (this.slides.length <= this.slidesToShow) {
         [...this.slides].forEach(item => this.sliderItems.append(item.cloneNode(true)));
      }
      const cloneFirst = this.firstSlide.cloneNode(true);
      const cloneLast = this.lastSlide.cloneNode(true);
      this.sliderItems.append(cloneFirst);
      this.sliderItems.insertAdjacentElement('afterBegin', cloneLast);
      this.slides = this.sliderItems.querySelectorAll(`.${this.addClassName}`);
   }
   addStyle() {
      let style = document.getElementById(`${this.addClassName}-style`);
      if (!style) {
         style = document.createElement('style');
         style.id = `${this.addClassName}-style`;
      }
      style.textContent = `
      .${this.addClassName}-item {
         width: calc(${this.widthSlide}% - 7rem);
      }
      .${this.classActiveItem} {
         opacity: 1;
      }
      `;
      document.head.append(style);
   }
   addClass() {
      for (const item of [...this.slides]) {
         item.classList.add(`${this.addClassName}-item`);
      }
   }
   setActiveItem(mobilePosition) {
      for (const item of [...this.slides]) {
         item.classList.remove(this.classNextItem);
         item.classList.remove(this.classPrevItem);
         item.classList.remove(this.classActiveItem);
      }
      if (mobilePosition) {
         this.slides[this.position].classList.add(this.classActiveItem);
      } else {
         this.slides[this.position].classList.add(this.classActiveItem);
         this.slides[this.position - 1].classList.add(this.classPrevItem);
         this.slides[this.position + 1].classList.add(this.classNextItem);
      }
   }
   getPositionX(event) {
      return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
   }
   dragStart(e) {
      e.preventDefault();
      if (e.target.closest(`.${this.classActiveItem}`)) {
         if (e.type === 'touchstart') {
            this.sliderItems.addEventListener('touchend', this.swipeEnd);
            this.sliderItems.addEventListener('touchmove', this.swipeAction);
         } else {
            this.sliderItems.addEventListener('mouseup', this.swipeEnd);
            this.sliderItems.addEventListener('mousemove', this.swipeAction);
            this.sliderItems.addEventListener('mouseleave', this.swipeEnd);
         }
         this.isDrag = true;
         this.animationId = requestAnimationFrame(this.animation.bind(this));
         this.startPosition = this.getPositionX(e);

      } else if (e.target.closest(`.${this.classNextItem}`) && !this.blockSlide) {
         this.blockSlide = true;
         this.nextSlide();
      } else if (e.target.closest(`.${this.classPrevItem}`) && !this.blockSlide) {
         this.blockSlide = true;
         this.prevSlide();
      }
   }
   dragMove(e) {
      if (this.isDrag) {
         const currentPosition = this.getPositionX(e);
         this.currentTranslate = this.prevTranslate - ((currentPosition - this.startPosition) / this.startPosition * this.widthSlide);
      }
   }
   dragEnd() {
      this.isDrag = false;

      const movedBy = this.currentTranslate - this.prevTranslate;

      if (movedBy < -this.moving && !this.blockSlide) {
         this.blockSlide = true;
         this.prevSlide();
      } else if (movedBy > this.moving && !this.blockSlide) {
         this.blockSlide = true;
         this.nextSlide();
      } else {
         this.currentTranslate = this.prevTranslate;
      }
      cancelAnimationFrame(this.animationId);
      this.sliderItems.removeEventListener('touchend', this.swipeEnd);
      this.sliderItems.removeEventListener('touchmove', this.swipeAction);
      this.sliderItems.removeEventListener('mouseup', this.swipeEnd);
      this.sliderItems.removeEventListener('mousemove', this.swipeAction);
      this.sliderItems.removeEventListener('mouseleave', this.swipeEnd);
   }
   nextSlide() {
      if (this.position < this.slides.length - 2) {
         this.setPosition(this.timeTransform, '+');
         if (this.position > this.slides.length - 3) {
            this.resetSlide(3);
         }
      }
   }
   prevSlide() {
      if (this.position > 1) {
         this.setPosition(this.timeTransform, '-');
         if (this.position < 2) {
            this.resetSlide(4);
         }
      }
   }
   resetSlide(value) {
      clearTimeout(this.timerId);
      this.setPosition(this.timeTransform);
      this.position = value;
      const clearTransition = () => {
         this.setPosition(0);
         this.blockSlide = false;
      };
      this.timerId = setTimeout(clearTransition, 600);
   }
   setPosition(time, sign) {
      if (sign) {
         sign === '+' ? ++this.position : --this.position;
      }
      if (this.mobilePosition) {
         this.currentTranslate = this.position * this.widthSlide;
         this.setActiveItem(this.mobilePosition);
      } else {
         this.currentTranslate = (this.position - 1) * this.widthSlide;
         this.setActiveItem();
      }
      this.prevTranslate = this.currentTranslate;
      this.sliderItems.style.transition = `transform ${time}s`;
      this.moveSlider();
      const transitionEnd = () => {
         this.blockSlide = false;
         this.sliderItems.removeEventListener('transitionend', transitionEnd);
      };
      this.sliderItems.addEventListener("transitionend", transitionEnd);
   }
   moveSlider() {
      this.sliderItems.style.transform = `translateX(-${this.currentTranslate}%)`;
   }
   animation() {
      this.moveSlider();
      this.isDrag ? requestAnimationFrame(this.animation.bind(this)) : false;
   }
   controlSlider() {
      this.sliderItems.addEventListener('mousedown', this.swipeStart);
      this.sliderItems.addEventListener('touchstart', this.swipeStart);
   }
   init() {
      this.cloneSlides();
      this.addClass();
      this.controlSlider();
      this.responseInit();
   }
   responseInit() {
      const slidesToShowDefault = this.slidesToShow;
      const allResponse = this.responsive.map(item => item.breakpoint);
      const maxResponse = Math.max(...allResponse);

      const checkResponse = () => {
         const widthWindow = document.documentElement.clientWidth;
         if (widthWindow < maxResponse) {
            for (let i = 0; i < allResponse.length; i++) {
               if (widthWindow < allResponse[i]) {
                  this.slidesToShow = this.responsive[i].slidesToShow;
                  this.widthSlide = (100 / this.slidesToShow);
                  this.addStyle();
                  this.mobilePosition = true;
                  this.moving = this.widthSlide / 20;
                  this.setPosition();
               }
            }
         } else {
            this.slidesToShow = slidesToShowDefault;
            this.widthSlide = (100 / this.slidesToShow);
            this.addStyle();
            this.mobilePosition = false;
            this.moving = this.widthSlide / 10;
            this.setPosition();
         }
      };
      checkResponse();
      window.addEventListener('resize', checkResponse);
   }
}

const sliderTouch = new SliderTouch({
   sliderWrap: '.reviews__wrap',
   sliderItems: '.reviews__slider',
   slidesToShow: 3,
   position: 2,
   addClassName: 'reviews__slide',
   classActiveItem: 'slide--active',
   classNextItem: 'slide--next',
   classPrevItem: 'slide--prev',
   responsive: [
      {
         breakpoint: 769,
         slidesToShow: 1,
      },
   ]
});

export default sliderTouch;