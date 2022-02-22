const getLocation = () => {
   const headerMapsBtn = document.querySelector('.header__maps-info'),
      choiceRegionFirst = document.querySelector('.choice-region__first'),
      choiceRegionSecond = document.querySelector('.choice-region__second'),
      title = document.querySelector('title'),
      userLocation = document.querySelectorAll('.user-location');

   const activeLocation = () => {
      if (localStorage.getItem('location')) {
         title.innerHTML = `Evarugs: ${JSON.parse(localStorage.getItem('location'))}`;
         userLocation.forEach(item => {
            item.textContent = JSON.parse(localStorage.getItem('location'));
         });
      } else {
         title.innerHTML = `Evarugs: Москва`;
         userLocation.forEach(item => {
            item.textContent = 'Москва';
         });
      }
   };

   const setLocation = (e) => {
      e.preventDefault();
      if (e.target.closest('li')) {
         localStorage.setItem('location', JSON.stringify(e.target.closest('li').textContent.trim()));
         activeLocation();
         choiceRegionSecond.classList.remove('active');
      } else if (e.target.closest('.choice-region__second-close-button')) {
         choiceRegionSecond.classList.remove('active');
      }
   };

   const controlLocation = (e) => {
      if (e.target.closest('.location-change')) {
         choiceRegionSecond.classList.add('active');
         choiceRegionFirst.classList.remove('active');
         choiceRegionSecond.addEventListener('click', setLocation);
      }
      if (e.target.closest('.location-close')) {
         choiceRegionFirst.classList.remove('active');
      }
   };

   const openLocation = (e) => {
      e.preventDefault();
      choiceRegionFirst.classList.add('active');
      choiceRegionFirst.addEventListener('click', controlLocation);
   };
   activeLocation();
   headerMapsBtn.addEventListener('click', openLocation);
};

export default getLocation;