import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { goToPage, posts, getToken, user } from "../index.js";
import { likePost, disLikePost } from "../api.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export function renderPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  /*
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const postsHtml = posts.map((post, index) => {
    return `
       <li class="post">
          <div class="post-header" data-user-id="${post.user.id}">
              <img src="${post.user.imageUrl}" class="post-header__user-image">
              <p class="post-header__user-name">${post.user.name}</p>
          </div>
          <div class="post-image-container">
            <img class="post-image" src="${post.imageUrl}">
          </div>
          <div class="post-likes">
            <button data-post-id="${post.id}" data-index="${index}" class="like-button">
             <img src="./assets/images/${post.isLiked ? 'like-active.svg' : 'like-not-active.svg'}">
            </button>
            <p class="post-likes-text">
              Нравится: <strong> ${post.likes.length > 1 ? post.likes.map((like)=>{return like.name}).pop() + " и еще " + (post.likes.length - 1) : post.likes.length == 1 ? post.likes.map((like)=>{return like.name}).pop() : "0"} </strong>
            </p>
          </div>
          <p class="post-text">
            <span class="user-name">${post.user.name}</span>
            ${post.description}
          </p>
          <p class="post-date">
          ${formatDistanceToNow(new Date(post.createdAt), {locale: ru, addSuffix: true})}
          </p>
        </li>`;
  }).join("");

  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                  ${postsHtml}
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  //«Оживляем» кнопку и счетчик лайков
  function likeActive () {
    const likeButtons = document.querySelectorAll('.like-button')

    for (const likeButton of likeButtons) {
      likeButton.addEventListener('click', () => {
        const index = likeButton.dataset.index
        const id = likeButton.dataset.postId
        if(!getToken()) {
          alert("Нравлик могут поставить только авторизованные пользователи. Вам нужно Войти или Зарегистрироваться");
          return;
        }
        if (user) {
          likeButton.classList.add('loading-like'); 

          if (posts[index].isLiked === false) {
            likePost({ id, token: getToken() })
            posts[index].isLiked = true
            posts[index].likes.push({
              id: posts[index].user.id,
              name: posts[index].user.name
            })
          } else {
            posts[index].isLiked = false
            posts[index].likes.pop()
            disLikePost({ id, token: getToken() })
          }
        }
        setTimeout(()=>{
          renderPostsPageComponent({ appEl })
        },2000)
      })
    }
  }
  likeActive ();
}
