export function renderImageModal() {
  return `
    <div id="imageModal" class="modal">
      <div class="modal-background"></div>
      <div class="modal-content">
        <p class="image">
          <img id="modalImage" src="" alt="Food Image" />
        </p>
      </div>
      <button id="closeImageModal" class="modal-close is-large" aria-label="close"></button>
    </div>
  `;
}

export function bindImageModalEvents() {
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const closeBtn = document.getElementById("closeImageModal");
  const background = modal?.querySelector(".modal-background");

  function closeModal() {
    modal?.classList.remove("is-active");
  }

  closeBtn?.addEventListener("click", closeModal);
  background?.addEventListener("click", closeModal);

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest(".food-image-thumb");
    if (trigger) {
      const imgSrc = trigger.dataset.src;
      if (modalImage && modal) {
        modalImage.src = imgSrc;
        modal.classList.add("is-active");
      }
    }
  });
}