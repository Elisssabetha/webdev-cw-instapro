import { toggleLike } from "../api.js";
import { goToPage } from "../index.js";

//обработчик нажатия лайка
export const initLikeHandlers = (user, posts) => {
  document.querySelectorAll('.like-button').forEach(button => {
    button.addEventListener('click', async (e) => {
      e.stopPropagation();
      
      //проверка авторизации (хотя можно без нее, так как неавторизованные не смогут нажать на кнопку)
      if (!user) {
        alert('Для лайков нужно войти в систему');
        goToPage(AUTH_PAGE);
        return;
      }

      const postId = button.dataset.postId;
      const postIndex = posts.findIndex(p => p.id === postId);
      
      if (postIndex === -1) return;

      const currentPost = posts[postIndex];
      const currentIsLiked = currentPost.isLiked;

      try {
        const response = await toggleLike({
          postId,
          token: `Bearer ${user.token}`,
          isLiked: currentIsLiked // Передаем текущее состояние
        });

        if (!response?.post) {
          throw new Error('Неверный формат ответа сервера');
        }

        // Обновляем пост в массиве
        posts[postIndex] = {
          ...currentPost,
          likes: response.post.likes || [],
          isLiked: !currentIsLiked // Инвертируем состояние
        };

        // Обновляем UI
        updateLikeUI(button, posts[postIndex]);

      } catch (error) {
        console.error('Ошибка:', error);
        alert(error.message || 'Ошибка при изменении лайка');
      }
    });
  });
};

//  изменение картинки и кол-ва после нажатия кнопки лайка
const updateLikeUI = (button, post) => {
  const likeImg = button.querySelector('img');
  const likesText = button.closest('.post-likes').querySelector('.post-likes-text');
  
  likeImg.src = post.isLiked
    ? './assets/images/like-active.svg'
    : './assets/images/like-not-active.svg';
  
  likesText.innerHTML = `Нравится: <strong>${post.likes.length}</strong>`;
};

//html-раметка кнопки лайка, где неавторизованному пользователю на нее нельзя нажать
export const renderLikeButton = (post, user) => {
  return `
    <button data-post-id="${post.id}" 
            class="like-button" 
            ${!user ? "disabled" : ""}>
      <img src="${
        post.isLiked
          ? "./assets/images/like-active.svg"
          : "./assets/images/like-not-active.svg"
      }"
           style="${!user ? "opacity: 0.5; cursor: not-allowed;" : ""}">
    </button>
  `;
};
