import { renderUploadImageComponent } from "./upload-image-component.js";
import { renderHeaderComponent } from "./header-component.js";
import { sanitizeInput } from "../helpers.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";

  const render = () => {
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h3 class="form-title">Добавить пост</h3>
        <div class="form-inputs">
          <textarea class="input textarea" placeholder="Описание фотографии" rows="4"></textarea>
          <div class="upload-image-container"></div>
          <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    </div>
    `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    renderUploadImageComponent({
      element: document.querySelector(".upload-image-container"),
      onImageUrlChange: (url) => {
        imageUrl = url;
        console.log("Изображение загружено:", url);
      },
    });

    document.getElementById("add-button").addEventListener("click", () => {
      const rawDescription = document.querySelector(".textarea").value;

      // обрабатываем потенциальные теги
      const description = sanitizeInput(rawDescription);
      
      if (!description) {
        alert("Добавьте описание фотографии");
        return;
      }

      if (!imageUrl) {
        alert("Не выбрана фотография");
        return;
      }

      onAddPostClick({ description, imageUrl });
    });
  };

  render();
}
