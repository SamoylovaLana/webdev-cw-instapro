import { renderUploadImageComponent } from "./upload-image-component.js";
import { renderHeaderComponent } from "./header-component.js";
import { postPosts } from "../api.js";
import { getToken } from '../index.js';
//import { POSTS_PAGE } from "../routes.js";
import { safeInput } from "../helpers.js";


export function renderAddPostPageComponent({ appEl, onAddPostClick }) {

  
  const render = () => {
    let imageUrl = "";
    
    // TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h3 class="form-title">Добавить пост</h3>
        <div class="form-inputs">
          <div class="upload-image-container"></div>
          <label>
            Опишите фотографию:
            <textarea class="input textarea" id="textarea" rows="4"></textarea>
          </label>
          <button class="button" id="add-button">Добавить</button>
       </div>
     </div>
   </div>`;

    appEl.innerHTML = appHtml;

    // рендер заголовка
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

     //рендер добавленного фото
    renderUploadImageComponent({
      element: appEl.querySelector(".upload-image-container"),
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl;
      },
    });
     

    document.getElementById("add-button").addEventListener("click", () => {
        
      if (!imageUrl) {
        alert("Не выбрана фотография");
        return;
      }

      if (!document.getElementById('textarea').value) {
        alert("Добавьте описание фотографии");
        return;
      }
    
      postPosts ({
        token: getToken(),
        description: safeInput(document.getElementById('textarea').value),
        imageUrl: imageUrl
      }).then(() => {
        return onAddPostClick({
          description: safeInput(document.getElementById('textarea').value),
          imageUrl: imageUrl
        })
      })
    })
  };
  render();
}
