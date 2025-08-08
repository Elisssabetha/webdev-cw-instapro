import { formatDistanceToNow } from "../node_modules/date-fns/formatDistanceToNow.js";
import { ru } from "../node_modules/date-fns/locale/ru.js";
import { renderHeaderComponent } from "./header-component.js";
import {
  initLikeHandlers,
  renderLikeButton,
} from "./like-handler-component.js";

export function renderUserPostsPageComponent({ appEl, posts, user }) {
  // на всякий слуйчай обработка, если клик по имени юзера без постов
  if (!posts.length) {
    appEl.innerHTML = `<div class="page-container">
      <div class="header-container"></div>
      <div class="posts-user__empty">У пользователя пока нет постов</div>
    </div>`;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });
    return;
  }

  const postsHtml = posts
    .map(
      (post) => `
    <li class="post">
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
  `
    )
    .join("");

  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="posts-user-header">
        <img src="${posts[0].user.imageUrl}" class="posts-user-header__user-image">
        <p class="posts-user-header__user-name">${posts[0].user.name}</p>
      </div>
      <ul class="posts">
        ${postsHtml}
      </ul>
    </div>
  `;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  initLikeHandlers(user, posts);
}
