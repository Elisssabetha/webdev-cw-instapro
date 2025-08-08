import { formatDistanceToNow } from '../node_modules/date-fns/formatDistanceToNow.js';
import { ru } from '../node_modules/date-fns/locale/ru.js';
import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { goToPage } from "../index.js";
import { initLikeHandlers, renderLikeButton} from './like-handler-component.js';


export function renderPostsPageComponent({ appEl, posts, user }) {

  // верстка одного поста (применяется для всех из списка posts)
  const postsHtml = posts.map(post => `
    <li class="post">
      <div class="post-header" data-user-id="${post.user.id}">
        <img src="${post.user.imageUrl}" class="post-header__user-image">
        <p class="post-header__user-name">${post.user.name}</p>
      </div>
      <div class="post-image-container">
        <img class="post-image" src="${post.imageUrl}">
      </div>
      <div class="post-likes">
        ${renderLikeButton(post, user)}
        <p class="post-likes-text">
          Нравится: <strong>${post.likes.length}</strong>
        </p>
      </div>
      <p class="post-text">
        <span class="user-name">${post.user.name}</span>
        ${post.description}
      </p>
      <p class="post-date">
        ${formatDistanceToNow(new Date(post.createdAt), { locale: ru })} назад
      </p>
    </li>
  `).join('');
  
  // добавляем все наши посты в остальную разметку
  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        ${postsHtml}
      </ul>
    </div>
  `;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  //обработчик нажатия лайков
  initLikeHandlers(user, posts);

  // обработчик клика на имени пользователя
  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
}
