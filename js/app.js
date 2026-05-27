function showSkeleton(container, count = 8) {
  container.innerHTML = '';
  const verticalGroup = document.createElement('div');
  verticalGroup.className = 'gallery-group gallery-vertical';
  const horizontalGroup = document.createElement('div');
  horizontalGroup.className = 'gallery-group gallery-horizontal';

  for (let i = 0; i < count; i++) {
    const itemWrapper = document.createElement('div');
    itemWrapper.classList.add('gallery-item', 'skeleton-item');

    const card = document.createElement('div');
    card.classList.add('card', 'gallery-card', 'skeleton-card');

    const img = document.createElement('div');
    img.className = 'skeleton-img';

    const body = document.createElement('div');
    body.className = 'p-3';
    const title = document.createElement('div');
    title.className = 'skeleton-line skeleton-title';
    const text = document.createElement('div');
    text.className = 'skeleton-line skeleton-text mt-2';

    body.appendChild(title);
    body.appendChild(text);

    card.appendChild(img);
    card.appendChild(body);
    itemWrapper.appendChild(card);

    if (i % 3 === 0) {
      verticalGroup.appendChild(itemWrapper);
    } else {
      horizontalGroup.appendChild(itemWrapper);
    }
  }

  container.appendChild(verticalGroup);
  container.appendChild(horizontalGroup);
}

function clearSkeleton(container) {
  const skeletons = container.querySelectorAll('.skeleton-item');
  skeletons.forEach(s => s.remove());
  const rows = container.querySelectorAll('.skeleton-row');
  rows.forEach(r => {
    if (!r.querySelector('.skeleton-item')) {
      r.remove();
    }
  });
}

const MIN_SKELETON_MS = 1000;

function showOverlay(targetSelector, count = 6, duration = MIN_SKELETON_MS) {
  const target = document.querySelector(targetSelector);
  if (!target) return null;

  const computed = getComputedStyle(target);
  if (computed.position === 'static') {
    target.style.position = 'relative';
  }

  const overlay = document.createElement('div');
  overlay.className = 'skeleton-overlay';
  const inner = document.createElement('div');
  inner.className = 'skeleton-overlay-inner';
  showSkeleton(inner, count);
  overlay.appendChild(inner);
  target.appendChild(overlay);

  const timeoutId = setTimeout(() => {
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }, duration);

  return { overlay, timeoutId };
}

function calcColumnsForViewport() {
  const w = window.innerWidth;
  if (w >= 992) return 4;
  if (w >= 768) return 3;
  if (w >= 576) return 2;
  return 2;
}

function showSkeletonRows(container, rows = 2) {
  container.innerHTML = '';
  const cols = calcColumnsForViewport();
  const total = cols * rows;

  for (let r = 0; r < rows; r++) {
    const row = document.createElement('div');
    row.className = 'skeleton-row';
    row.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    // add delay class for accessibility of stagger
    const delayClass = `skeleton-appear-delay-${Math.min(r+1,5)}`;
    row.classList.add(delayClass);

    for (let c = 0; c < cols; c++) {
      const itemWrapper = document.createElement('div');
      itemWrapper.classList.add('gallery-item', 'skeleton-item');
      itemWrapper.setAttribute('data-aos', 'fade-up');
      itemWrapper.setAttribute('data-aos-delay', String(c * 50));

      const card = document.createElement('div');
      card.classList.add('card', 'gallery-card', 'skeleton-card');

      const img = document.createElement('div');
      img.className = 'skeleton-img';

      const body = document.createElement('div');
      body.className = 'p-3';
      const title = document.createElement('div');
      title.className = 'skeleton-line skeleton-title';
      const text = document.createElement('div');
      text.className = 'skeleton-line skeleton-text mt-2';

      body.appendChild(title);
      body.appendChild(text);

      card.appendChild(img);
      card.appendChild(body);
      itemWrapper.appendChild(card);
      row.appendChild(itemWrapper);
    }

    // Append rows one by one with slight stagger
    setTimeout(() => {
      container.appendChild(row);
      // trigger visible class next tick so transition runs
      requestAnimationFrame(() => row.classList.add('visible'));
    }, r * 150);
  }

  return { cols, total };
}

function renderMedia(containerId, filtro = null, tipo = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const descriptionEl = document.getElementById('categoryDescription');
  if (descriptionEl) {
    descriptionEl.textContent = filtro ? categoryDescriptions[filtro] || 'Explora el estilo y motivo de esta colección.' : 'Explora cada estilo y motivo de fotografía disponible en la galería.';
  }

  // Mostrar esqueletos inmediatamente
  // For the categories page (galeria) show rows that fill per viewport
  if (containerId === 'galeria') {
    showSkeletonRows(container, 2);
  } else {
    showSkeleton(container, 8);
  }

  // Ejecutar renderizado real tras permitir repintado y respetar mínimo visible
  setTimeout(() => {
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

    // Si no hay datos, mostrar mensaje y quitar skeletons
    if (data.length === 0) {
      clearSkeleton(container);
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

    data.forEach((item, index) => {
      const itemWrapper = document.createElement('div');
      itemWrapper.classList.add('gallery-item', 'fade-pop-item');
      itemWrapper.style.transitionDelay = `${(index % 4) * 80}ms`;

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

        // Añadir por defecto al grupo vertical
        verticalGroup.appendChild(itemWrapper);

        // Reclasificar cuando cargue
        img.addEventListener('load', () => {
          const orientation = img.naturalWidth >= img.naturalHeight ? 'horizontal' : 'vertical';
          if (orientation === 'horizontal') {
            if (verticalGroup.contains(itemWrapper)) verticalGroup.removeChild(itemWrapper);
            horizontalGroup.appendChild(itemWrapper);
            card.classList.remove('vertical');
          } else {
            card.classList.add('vertical');
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

    // Quitar esqueletos antes de añadir contenido real
    clearSkeleton(container);
    container.appendChild(verticalGroup);
    container.appendChild(horizontalGroup);
    
    // Initialize fade-pop reveal for images on scroll
    initializeFadePopObserver(container);

    // Refresh AOS to detect new elements and apply animations
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }, MIN_SKELETON_MS);
}

function initializeFadePopObserver(container) {
  const items = container.querySelectorAll('.fade-pop-item');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(item => item.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  items.forEach(item => observer.observe(item));
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

  // Aplicar overlays skeleton en secciones estáticas SOLO si no es la página de inicio
  const isIndex = location.pathname === '/' || location.pathname.endsWith('index.html') || location.pathname === '';
  if (!isIndex && !document.getElementById('galeria')) {
    const galleryContainer = document.querySelector('.gallery-section .container');
    if (galleryContainer) {
      showOverlay('.gallery-section .container', 8, MIN_SKELETON_MS);
    }
  }

  // Aplicar skeletons al carrusel de videos (reels) SOLO en la página de categorías
  const isCategorias = location.pathname.endsWith('categorias.html');
  const reelsInner = document.querySelector('#videoHighlightsCarousel .carousel-inner');
  if (reelsInner && isCategorias) {
    showOverlay('#videoHighlightsCarousel .carousel-inner', 3, MIN_SKELETON_MS);
  }

  // Inicializar tooltips de Bootstrap
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // ===== WHATSAPP FORM LOGIC =====
  const whatsappForm = document.getElementById('whatsappForm');
  const nextStepBtn = document.getElementById('nextStep');
  const prevStepBtn = document.getElementById('prevStep');
  const sendWhatsappBtn = document.getElementById('sendWhatsapp');

  if (!whatsappForm) return;

  // Define flow for each event type
  const flowConfig = {
    boda_religiosa: ['step1', 'serviceStep', 'churchStep', 'locationStep', 'dateTimeStep', 'preparativesStep', 'extraStep', 'contactStep'],
    boda_civil: ['step1', 'serviceStep', 'locationStep', 'dateTimeStep', 'preparativesStep', 'extraStep', 'contactStep'],
    ceremonia_fe: ['step1', 'ceremonyTypeStep', 'serviceStep', 'churchStep', 'dateTimeStep', 'extraStep', 'contactStep'],
    sesion_fotos: ['step1', 'photoTypeStep', 'sessionTypeStep', 'sessionDateStep', 'extraStep', 'contactStep'],
    propuesta_matrimonio: ['step1', 'serviceStep', 'locationStep', 'dateTimeStep', 'hoursStep', 'extraStep', 'contactStep'],
    xv: ['step1', 'serviceStep', 'churchStep', 'locationStep', 'dateTimeStep', 'preparativesXVStep', 'extraStep', 'contactStep'],
    otro: ['step1', 'serviceStep', 'locationStep', 'dateTimeStep', 'extraStep', 'contactStep']
  };

  function buildSesionFotosFlow(sessionType) {
    const flow = ['step1', 'photoTypeStep', 'sessionTypeStep'];
    if (sessionType && sessionType.toLowerCase().includes('casual')) {
      flow.push('casualLocationStep');
    }
    flow.push('sessionDateStep', 'extraStep', 'contactStep');
    return flow;
  }

  let currentFlow = [];
  let currentStep = 0;

  // Add missing steps to form
  const missingSteps = ['photoTypeStep', 'sessionTypeStep', 'casualLocationStep', 'sessionDateStep', 'hoursStep', 'ceremonyLocationStep', 'preparativesXVStep'];
  missingSteps.forEach(step => {
    if (!document.getElementById(step)) {
      const div = document.createElement('div');
      div.id = step;
      div.className = 'form-step d-none';
      
      if (step === 'photoTypeStep') {
        div.innerHTML = `<div class="mb-4">
          <label class="form-label fw-bold">¿Tipo de fotos? <i class="fas fa-question-circle help-icon" data-bs-toggle="tooltip" title="Selecciona el tipo de sesión fotográfica" style="color: #8B4513; margin-left: 5px;"></i></label>
          <div class="btn-group w-100 flex-wrap" role="group">
            <input type="radio" class="btn-check" name="photoType" id="photoIndividual" value="Individual">
            <label class="btn btn-outline-brown" for="photoIndividual">Individual</label>
            <input type="radio" class="btn-check" name="photoType" id="photoCumpleanos" value="Cumpleaños">
            <label class="btn btn-outline-brown" for="photoCumpleanos">Cumpleaños</label>
            <input type="radio" class="btn-check" name="photoType" id="photoPareja" value="Pareja">
            <label class="btn btn-outline-brown" for="photoPareja">Pareja</label>
            <input type="radio" class="btn-check" name="photoType" id="photoNewBorn" value="NewBorn">
            <label class="btn btn-outline-brown" for="photoNewBorn">NewBorn</label>
            <input type="radio" class="btn-check" name="photoType" id="photoPrenatal" value="Prenatal">
            <label class="btn btn-outline-brown" for="photoPrenatal">Prenatal</label>
            <input type="radio" class="btn-check" name="photoType" id="photoFamiliar" value="Familiar">
            <label class="btn btn-outline-brown" for="photoFamiliar">Familiar</label>
            <input type="radio" class="btn-check" name="photoType" id="photoInfantil" value="Infantil">
            <label class="btn btn-outline-brown" for="photoInfantil">Infantil</label>
            <input type="radio" class="btn-check" name="photoType" id="photoOtro" value="Otro">
            <label class="btn btn-outline-brown" for="photoOtro">Otro</label>
          </div>
        </div>`;
      } else if (step === 'sessionTypeStep') {
        div.innerHTML = `<div class="mb-4">
          <label class="form-label fw-bold">¿Tipo de sesión? <i class="fas fa-question-circle help-icon" data-bs-toggle="tooltip" title="Elige si deseas sesión al aire libre o en estudio" style="color: #8B4513; margin-left: 5px;"></i></label>
          <div class="btn-group w-100" role="group">
            <input type="radio" class="btn-check" name="sessionType" id="sessionCasual" value="Casual (Exterior)">
            <label class="btn btn-outline-brown" for="sessionCasual">Casual (Exterior)</label>
            <input type="radio" class="btn-check" name="sessionType" id="sessionEstudio" value="Estudio">
            <label class="btn btn-outline-brown" for="sessionEstudio">Estudio</label>
          </div>
        </div>`;
      } else if (step === 'casualLocationStep') {
        div.innerHTML = `<div class="mb-4">
          <label for="casualLocation" class="form-label fw-bold">¿Lugar de las fotos en caso de ser Casual? <i class="fas fa-question-circle help-icon" data-bs-toggle="tooltip" title="Dirección o descripción del lugar exterior (opcional)" style="color: #8B4513; margin-left: 5px;"></i></label>
          <input type="text" class="form-control" id="casualLocation" name="casualLocation" placeholder="Ej: Parque Municipal">
        </div>`;
      } else if (step === 'sessionDateStep') {
        div.innerHTML = `<div class="mb-4">
          <label for="sessionDate" class="form-label fw-bold">¿Fecha de la sesión? <i class="fas fa-question-circle help-icon" data-bs-toggle="tooltip" title="Proporciona la fecha para tu sesión" style="color: #8B4513; margin-left: 5px;"></i></label>
          <input type="date" class="form-control" id="sessionDate" name="sessionDate">
        </div>`;
      } else if (step === 'hoursStep') {
        div.innerHTML = `<div class="mb-4">
          <label for="hours" class="form-label fw-bold">¿Cantidad de Horas a cubrir? <i class="fas fa-question-circle help-icon" data-bs-toggle="tooltip" title="Indica cuántas horas deseas" style="color: #8B4513; margin-left: 5px;"></i></label>
          <input type="number" class="form-control" id="hours" name="hours" min="1" placeholder="Ej: 2 horas">
        </div>`;
      } else if (step === 'ceremonyLocationStep') {
        div.innerHTML = `<div class="mb-4">
          <label for="ceremonyLocation" class="form-label fw-bold">¿Lugar del evento en caso de requerir cobertura? <i class="fas fa-question-circle help-icon" data-bs-toggle="tooltip" title="Dirección donde necesitas cobertura (opcional)" style="color: #8B4513; margin-left: 5px;"></i></label>
          <input type="text" class="form-control" id="ceremonyLocation" name="ceremonyLocation" placeholder="Opcional: Salón, jardín">
        </div>`;
      } else if (step === 'preparativesXVStep') {
        div.innerHTML = `<div class="mb-4">
          <label class="form-label fw-bold">¿Desde los preparativos de la Quinceañera? <i class="fas fa-question-circle help-icon" data-bs-toggle="tooltip" title="¿Deseas cobertura desde peinado y maquillaje?" style="color: #8B4513; margin-left: 5px;"></i></label>
          <div class="btn-group w-100" role="group">
            <input type="radio" class="btn-check" name="preparativesXV" id="prepXVYes" value="Sí, desde los preparativos">
            <label class="btn btn-outline-brown" for="prepXVYes">Sí, desde los preparativos</label>
            <input type="radio" class="btn-check" name="preparativesXV" id="prepXVNo" value="No, solo desde el evento">
            <label class="btn btn-outline-brown" for="prepXVNo">No, solo desde el evento</label>
          </div>
        </div>`;
      }
      
      whatsappForm.appendChild(div);
    }
  });

  function showStep(stepIndex) {
    const steps = document.querySelectorAll('.form-step');
    steps.forEach(s => s.classList.add('d-none'));
    
    if (stepIndex >= 0 && stepIndex < currentFlow.length) {
      const stepId = currentFlow[stepIndex];
      const step = document.getElementById(stepId);
      if (step) {
        step.classList.remove('d-none');
        step.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // Update button visibility
    prevStepBtn.classList.toggle('d-none', currentStep === 0);
    nextStepBtn.classList.toggle('d-none', currentStep === currentFlow.length - 1);
    sendWhatsappBtn.classList.toggle('d-none', currentStep !== currentFlow.length - 1);
  }

  function validateStep(stepIndex) {
    const stepId = currentFlow[stepIndex];
    const step = document.getElementById(stepId);
    if (!step) return true;

    // Check if radio/checkbox is selected for this step
    const radios = step.querySelectorAll('input[type="radio"]');
    if (radios.length > 0) {
      const isChecked = Array.from(radios).some(r => r.checked);
      if (!isChecked) {
        alert('Por favor, selecciona una opción');
        return false;
      }
    }

    // Check required text inputs/textareas
    const inputs = step.querySelectorAll('input[type="text"], input[type="tel"], input[type="date"], input[type="datetime-local"], input[type="number"], textarea');
    for (let input of inputs) {
      if (input.hasAttribute('required') || (stepId === 'contactStep' && input.parentElement.querySelector('label').textContent.includes('Tu'))) {
        if (!input.value.trim()) {
          alert('Por favor, completa los campos requeridos');
          return false;
        }
      }
    }

    return true;
  }

  // Event type selection
  document.querySelectorAll('input[name="eventType"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const eventType = e.target.value;
      currentFlow = flowConfig[eventType] || flowConfig.otro;
      currentStep = 1; // Move to next step
      showStep(currentStep);
    });
  });

  // Update session flow when session type is selected so location is asked only for Casual sessions
  document.querySelectorAll('input[name="sessionType"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (currentFlow && currentFlow.includes('sessionTypeStep')) {
        currentFlow = buildSesionFotosFlow(e.target.value);
      }
    });
  });

  // Auto-advance when selecting any radio option in the form
  whatsappForm.addEventListener('change', (e) => {
    if (e.target.type === 'radio' && e.target.name !== 'eventType') {
      // Auto-advance to next step after 300ms
      setTimeout(() => {
        if (validateStep(currentStep) && currentStep < currentFlow.length - 1) {
          currentStep++;
          showStep(currentStep);
        }
      }, 300);
    }
  });

  nextStepBtn.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      currentStep++;
      showStep(currentStep);
    }
  });

  prevStepBtn.addEventListener('click', () => {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  });

  sendWhatsappBtn.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      buildAndSendMessage();
    }
  });

  function buildAndSendMessage() {
    const formData = new FormData(whatsappForm);
    const eventType = formData.get('eventType');
    const clientName = formData.get('clientName') || 'Cliente';
    const clientPhone = formData.get('clientPhone') || '';

    // Map event slugs to readable names
    const eventTypeNames = {
      boda_religiosa: 'Boda Religiosa',
      boda_civil: 'Boda Civil',
      ceremonia_fe: 'Ceremonia de Fe',
      sesion_fotos: 'Sesión de Fotos',
      propuesta_matrimonio: 'Propuesta de Matrimonio',
      xv: 'XV Años',
      otro: 'Otro'
    };

    // Helper function to format datetime to 24-hour format (DD/MM/YYYY HH:MM)
    const formatDateTime = (dateTimeStr) => {
      if (!dateTimeStr) return '';
      const dt = new Date(dateTimeStr);
      const day = String(dt.getDate()).padStart(2, '0');
      const month = String(dt.getMonth() + 1).padStart(2, '0');
      const year = dt.getFullYear();
      const hours = String(dt.getHours()).padStart(2, '0');
      const minutes = String(dt.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    // Helper function to format date (DD/MM/YYYY)
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      const dt = new Date(dateStr + 'T00:00:00');
      const day = String(dt.getDate()).padStart(2, '0');
      const month = String(dt.getMonth() + 1).padStart(2, '0');
      const year = dt.getFullYear();
      return `${day}/${month}/${year}`;
    };

    let message = `*COTIZACIÓN DE EVENTO - Lupita Marin Fotografia*\n\n`;
    message += `*Nombre del cliente:* ${clientName}\n`;
    message += `*Teléfono:* ${clientPhone}\n\n`;
    message += `*Tipo de evento:* ${eventTypeNames[eventType] || eventType}\n`;

    // Add event-specific info
    if (eventType === 'boda_religiosa' || eventType === 'boda_civil' || eventType === 'xv') {
      message += `*Servicios:* ${formData.get('serviceType')}\n`;
      if (formData.get('church')) message += `*Iglesia/Parroquia:* ${formData.get('church')}\n`;
      message += `*Lugar:* ${formData.get('location')}\n`;
      message += `*Fecha y Hora:* ${formatDateTime(formData.get('eventDateTime'))}\n`;
      const prepKey = eventType === 'xv' ? 'preparativesXV' : 'preparatives';
      if (formData.get(prepKey)) message += `*Preparativos:* ${formData.get(prepKey)}\n`;
    } else if (eventType === 'ceremonia_fe') {
      message += `*Tipo de Ceremonia:* ${formData.get('ceremonyType')}\n`;
      message += `*Servicios:* ${formData.get('serviceType')}\n`;
      message += `*Iglesia/Parroquia:* ${formData.get('church')}\n`;
      message += `*Fecha y Hora:* ${formatDateTime(formData.get('eventDateTime'))}\n`;
    } else if (eventType === 'sesion_fotos') {
      message += `*Tipo de Fotos:* ${formData.get('photoType')}\n`;
      message += `*Tipo de Sesión:* ${formData.get('sessionType')}\n`;
      if (formData.get('casualLocation')) message += `*Lugar (Casual):* ${formData.get('casualLocation')}\n`;
      message += `*Fecha:* ${formatDate(formData.get('sessionDate'))}\n`;
    } else if (eventType === 'propuesta_matrimonio') {
      message += `*Servicios:* ${formData.get('serviceType')}\n`;
      message += `*Lugar:* ${formData.get('location')}\n`;
      message += `*Fecha y Hora:* ${formatDateTime(formData.get('eventDateTime'))}\n`;
      if (formData.get('hours')) message += `*Horas a cubrir:* ${formData.get('hours')}\n`;
    } else {
      message += `*Servicios:* ${formData.get('serviceType')}\n`;
      message += `*Lugar:* ${formData.get('location')}\n`;
      message += `*Fecha:* ${formatDateTime(formData.get('eventDateTime'))}\n`;
    }

    if (formData.get('extra')) message += `\n*Solicitudes especiales:*\n${formData.get('extra')}\n`;

    message += `\n---\n*Espero poder ayudarte a capturar tus momentos especiales.*`;

    // Encode and send via WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/527861116672?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('whatsappFormModal'));
    if (modal) modal.hide();
    
    // Reset form and UI completely
    setTimeout(() => {
      whatsappForm.reset();
      
      // Clear all step visibility and reset to step 1
      document.querySelectorAll('.form-step').forEach(s => s.classList.add('d-none'));
      const step1 = document.getElementById('step1');
      if (step1) {
        step1.classList.remove('d-none');
        step1.classList.add('active');
      }
      
      // Reset button states
      prevStepBtn.classList.add('d-none');
      nextStepBtn.classList.remove('d-none');
      sendWhatsappBtn.classList.add('d-none');
      
      // Reset flow and step
      currentFlow = [];
      currentStep = 0;
    }, 500);
  }
});

