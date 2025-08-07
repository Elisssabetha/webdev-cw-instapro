import { toggleLike } from "../api.js";
import { goToPage } from "../index.js";


 //обработчик нажатия лайка
export const initLikeHandlers = (user, posts) => {
  document.querySelectorAll('.like-button').forEach(button => {
    button.addEventListener('click', async (e) => {
      e.stopPropagation();
      
      if (!user) {
        alert('Для лайков нужно войти в систему');
        goToPage(AUTH_PAGE);
        return;
      }

      const postId = button.dataset.postId;
      const post = posts.find(p => p.id === postId);
      try {
        await toggleLike({ 
          postId, 
          token: `Bearer ${user.token}` 
        });
        updateLikeUI(button, post);
      } catch (error) {
        console.error('Ошибка при лайке:', error);
      }
    });
  });
};


//  изменение картинки и кол-ва после нажатия кнопки лайка
const updateLikeUI = (button, post) => {
  const likeImg = button.querySelector('img');
  const likesText = button.closest('.post-likes').querySelector('.post-likes-text');
  const currentCount = post.likes.length;

  if (likeImg.src.includes('like-active')) {
    likeImg.src = './assets/images/like-not-active.svg';
    likesText.innerHTML = `Нравится: <strong>${currentCount - 1}</strong>`;
  } else {
    likeImg.src = './assets/images/like-active.svg';
    likesText.innerHTML = `Нравится: <strong>${currentCount + 1}</strong>`;
  }
};


 //html-раметка кнопки лайка, где неавторизованному пользователю на нее нельзя нажать
export const renderLikeButton = (post, user) => {
  return `
    <button data-post-id="${post.id}" 
            class="like-button" 
            ${!user ? 'disabled' : ''}>
      <img src="${post.isLiked ? './assets/images/like-active.svg' : './assets/images/like-not-active.svg'}"
           style="${!user ? 'opacity: 0.5; cursor: not-allowed;' : ''}">
    </button>
  `;
};