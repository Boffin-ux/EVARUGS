import { disableScroll, enableScroll } from "./blockScrolled.js";
import postData from "./postData.js";

const openModal = () => {
   const getBtnModal = document.querySelector('.main-display__button');
   const getModal = document.querySelector('.modal');
   const getBtnSend = document.querySelector('.modal__button');
   const modalInner = getModal.querySelector('.modal__inner');
   const modalCheck = document.getElementById('modal__check');
   const modalInput = document.querySelectorAll('.modal__input');
   const modalMessage = document.querySelector('.modal__message');

   const activeModal = (e) => {
      e.preventDefault();
      getModal.classList.add('active');
      disableScroll();
   };
   const checkInput = () => {
      return [...modalInput, modalMessage].every(item => item.value !== '');
   };
   const clearOrder = (sendMessage) => {
      modalCheck.checked = false;
      [...modalInput, modalMessage].forEach(item => item.value = '');
      getModal.classList.remove('active');
      sendMessage ? sendMessage.remove() : false;
   };
   const controlModal = (e) => {
      if (!e.target.closest('.modal__inner')) {
         let sendMessage = document.querySelector('.send-message');
         clearOrder(sendMessage);
         enableScroll();
      }
   };
   const postOrder = async e => {
      e.preventDefault();
      let sendMessage = document.querySelector('.send-message');
      if (!sendMessage) {
         const addMessage = `<span class="send-message"><span>`;
         modalInner.insertAdjacentHTML('beforeEnd', addMessage);
         sendMessage = document.querySelector('.send-message');
      }
      if (modalCheck.checked && checkInput()) {
         await postData();
         sendMessage.classList.add('active');
         sendMessage.textContent = `Заказ успешно отправлен!`;
         setTimeout(() => {
            clearOrder(sendMessage);
         }, 2000);
      } else if (modalCheck.checked && !checkInput()) {
         sendMessage.textContent = `Заполните все поля!`;
         sendMessage.classList.add('active');
      } else {
         sendMessage.textContent = `Отметьте чекбокс!`;
         sendMessage.classList.add('active');
      }
   };

   getBtnModal.addEventListener('click', activeModal);
   getModal.addEventListener('click', controlModal);
   getBtnSend.addEventListener('click', postOrder);
};

export default openModal;