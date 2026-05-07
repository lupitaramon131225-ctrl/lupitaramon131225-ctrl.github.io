function renderMedia(containerId, filtro = null, tipo = null) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  let data = [...MEDIA];
  
  // Agregar imágenes subidas desde localStorage
  const uploadedImages = JSON.parse(localStorage.getItem('uploadedImages') || '[]');
  data = data.concat(uploadedImages);
  
  if (filtro) {
    data = data.filter(item => item.categoria === filtro);
  }

  if (tipo) {
    data = data.filter(item => item.type === tipo);
  }

  if (data.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.classList.add('col-12', 'text-center', 'text-muted');
    emptyMessage.textContent = 'No hay imágenes disponibles para esta categoría.';
    container.appendChild(emptyMessage);
    return;
  }

  const verticalGroup = document.createElement('div');
  verticalGroup.className = 'gallery-group gallery-vertical';
  const horizontalGroup = document.createElement('div');
  horizontalGroup.className = 'gallery-group gallery-horizontal';

  data.forEach(item => {
    const itemWrapper = document.createElement('div');
    itemWrapper.classList.add('gallery-item');

    const card = document.createElement('div');
    card.classList.add('card', 'gallery-card');
    card.style.cursor = 'pointer';

    if (item.type === 'image') {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.title;
      img.loading = 'lazy';
      img.className = 'card-img-top';
      
      card.appendChild(img);
      itemWrapper.appendChild(card);
      
      // Agregar a grupo vertical por defecto
      verticalGroup.appendChild(itemWrapper);
      
      // Reclasificar cuando cargue
      img.addEventListener('load', () => {
        const orientation = img.naturalWidth >= img.naturalHeight ? 'horizontal' : 'vertical';
        if (orientation === 'horizontal') {
          verticalGroup.removeChild(itemWrapper);
          horizontalGroup.appendChild(itemWrapper);
        }
      });
      
      card.addEventListener('click', () => {
        openLightbox(item.src);
      });
    } else {
      const video = document.createElement('video');
      video.className = 'card-img-top';
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      const source = document.createElement('source');
      source.src = item.src;
      video.appendChild(source);
      card.appendChild(video);
      itemWrapper.appendChild(card);
      horizontalGroup.appendChild(itemWrapper);
    }
  });

  container.appendChild(verticalGroup);
  container.appendChild(horizontalGroup);
}

function openLightbox(imageSrc) {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImage');
  if (modal && img) {
    img.src = imageSrc;
    modal.style.display = 'flex';
  }
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('lightboxClose');
  const modal = document.getElementById('lightboxModal');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }
  
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeLightbox();
      }
    });
  }
});
