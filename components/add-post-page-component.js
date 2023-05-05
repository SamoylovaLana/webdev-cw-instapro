import { renderUploadImageComponent } from "./upload-image-component.js";
import { renderHeaderComponent } from "./header-component.js";
import { onAddPostClick } from "../api.js";
import { POSTS_PAGE } from "../routes.js";


export function renderAddPostPageComponent({ appEl }) {

  let imageUrl = "";
  const render = () => {
    
    // рендер заголовка
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });
    
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
            <textarea class="input textarea" id="description-input" rows="4"></textarea>
          </label>
          <button class="button" id="add-button">Добавить</button>
       </div>
     </div>
   </div>`;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

     //рендер добавленного фото
     const uploadImageContainer = appEl.querySelector(".upload-image-container");

     if (uploadImageContainer) {
       renderUploadImageComponent({
         element: appEl.querySelector(".upload-image-container"),
         onImageUrlChange(newImageUrl) {
           imageUrl = newImageUrl;
         },
       });
     }

    document.getElementById("add-button").addEventListener("click", () => {
      const postDescription = document.getElementById("description-input").value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
        
      if (!imageUrl) {
        alert("Не выбрана фотография");
        return;
      }

      if (!postDescription) {
        alert("Добавьте описание фотографии");
        return;
      }
    
      onAddPostClick({
        token: getToken(),
        description: postDescription,
        imageUrl,
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        goToPage(POSTS_PAGE);
      });  
    });
    
  };

  render();
}
