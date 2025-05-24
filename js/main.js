let currentPage = 1;
const totalPages = 9;

let zoomLevel = 1;
const minZoom = 1;
const maxZoom = 2;

const thumbnailContainer = document.getElementById('thumbnailContainer');
const toggleThumbBtn = document.getElementById('toggleThumbnails');

toggleThumbBtn.addEventListener('click', () => {
  thumbnailContainer.classList.toggle('hidden');
});


function createThumbnails() {
  thumbnailContainer.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const thumbImg = document.createElement('img');
    thumbImg.src = `img/page${i}.jpg`;
    thumbImg.alt = `Página ${i}`;
    thumbImg.dataset.page = i;

    if (i === currentPage) {
      thumbImg.classList.add('active');
    }

    thumbImg.addEventListener('click', () => {
      loadPage(i);
      updateActiveThumbnail(i);
    });

    thumbnailContainer.appendChild(thumbImg);
  }
}


createThumbnails();

function updateActiveThumbnail(pageNum) {
  const thumbnails = thumbnailContainer.querySelectorAll('img');
  thumbnails.forEach(img => img.classList.toggle('active', parseInt(img.dataset.page) === pageNum));
}
thumbnailContainer.addEventListener('wheel', (e) => {
  e.preventDefault();
  thumbnailContainer.scrollLeft += e.deltaY;
});

function aplicarZoom(zoomLevel) {
  const zoomWrapper = document.getElementById("zoomWrapper");
  const mainViewer = document.getElementById("mainViewer");

  zoomWrapper.style.transform = `scale(${zoomLevel})`;

  if (zoomLevel > 1) {
    mainViewer.style.overflow = "auto";
      mainViewer.scrollTop = 0;
      mainViewer.scrollLeft = 0; 
  } else {
    mainViewer.style.overflow = "hidden"; 
  }
}
document.getElementById("zoomIn").addEventListener("click", () => {
  if (zoomLevel < maxZoom) {
    zoomLevel += 0.1;
    aplicarZoom(zoomLevel);
  }
});

document.getElementById("zoomOut").addEventListener("click", () => {
  if (zoomLevel > minZoom) {
    zoomLevel = Math.max(minZoom, zoomLevel - 0.1);
    aplicarZoom(zoomLevel);
  }
});

document.getElementById("fullscreenToggle").addEventListener("click", () => {
  const elem = document.documentElement;
  if (!document.fullscreenElement) {
    elem.requestFullscreen().catch(err => alert(`Error: ${err.message}`));
  } else {
    document.exitFullscreen();
  }
});

function loadPage(pageNumber) {
  const container = document.getElementById("pageContainer");
  fetch(`pages/page${pageNumber}.html`)
    .then(res => res.ok ? res.text() : `<h2>Página no encontrada</h2>`)
    .then(html => {
      container.innerHTML = html;
      container.className = '';
      container.classList.add(`page-style-${pageNumber}`);

      document.getElementById("pageCounter").textContent = `${pageNumber} / ${totalPages}`;
      currentPage = pageNumber;

      updateActiveThumbnail(pageNumber);

      // Animación fade-in
      container.classList.remove('fade-in-simple'); 
      void container.offsetWidth;                    
      container.classList.add('fade-in-simple');     

      if (pageNumber === 3) {
        setupStaticTabsPage3();
      } else if (typeof window[`setupTabsPage${pageNumber}`] === "function") {
        window[`setupTabsPage${pageNumber}`]();
      }
      initToggleTextSections(container) 
    });   
}

function setupTabsPage4() {
  const buttons = document.querySelectorAll('#page4Menu .tab');
  const contents = document.querySelectorAll('.tab4-content');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      contents.forEach(c => c.classList.add('hidden'));
      const id = btn.getAttribute('data-tab');
      document.getElementById(`tab4-${id}`).classList.remove('hidden');
      btn.classList.add('active');
    });
  });

  const items = document.querySelectorAll('#itineraryList li');
  items.forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const targetPage = parseInt(item.getAttribute('data-page'), 10);
      if (!isNaN(targetPage)) {
        loadPage(targetPage);
      }
    });
  });
}


function setupTabsPage5() {
  setupTabsPage4();
}

function setupTabsPage6() { // Para agregar una pagina mas con los botones lo que tenes que hacer es copiar y pegar esta misma funcion y solo cabiar el nombre ejemplo la funcion de llama setupTabsPage5 debe cambiar a setupTabsPageX (la X simboliza que ahi le tenes que poner el numero de la pagina)
  setupTabsPage4();
}

function setupTabsPage7() { 
  setupTabsPage4();
}

function setupTabsPage8() { 
  setupTabsPage4();
}

function setupTabsPage9() { 
  setupTabsPage4();
}



function setupStaticTabsPage3() {
  const tabs = document.querySelectorAll('.page-style-2 .tab');
  const contents = document.querySelectorAll('.page-style-2 .tab-content');
  const imageBanner = document.querySelector('.page-style-2 .image-banner img');

  const images = {
    1: 'img/page2.jpg',
    2: 'img/page2relax.jpg', 
    3: 'img/page2cultura.jpg',
    4: 'img/page2actividades.jpg',
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const id = tab.getAttribute('data-tab');
      const content = document.getElementById(`tab-${id}`);
      if (content) content.classList.add('active');

      // Cambiar la imagen del banner según tab
      if(images[id]){
        imageBanner.src = images[id];
      }
    });
  });
}


document.getElementById("nextPage").addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    loadPage(currentPage);
  }
});

document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadPage(currentPage);
  }
});

function showPage(n) {
  // ocultar todas las páginas
  const pages = document.querySelectorAll('pageContainer');
  pages.forEach(page => {
    page.style.display = 'none';
    page.classList.remove('fade-in-simple');
  });
  
  const currentPage = pages[n];
  currentPage.style.display = 'block';
  

  void currentPage.offsetWidth; 
  
  currentPage.classList.add('fade-in-simple');
}
const tabs = document.querySelectorAll('#page4Menu .tab');
const contents = document.querySelectorAll('.tab4-content');

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => {
      c.classList.remove('active', 'slide-in', 'itinerary');
      c.classList.add('hidden');
      c.style.opacity = 0;
    });
    
    tab.classList.add('active');
    const activeContent = contents[index];
    activeContent.classList.remove('hidden');
    activeContent.classList.add('active');

    if (activeContent.id === 'tab4-itinerario') {
      activeContent.classList.add('itinerary');
      const items = activeContent.querySelectorAll('ul li');
      items.forEach(item => {
        item.style.animation = 'none';
        void item.offsetWidth; 
        item.style.animation = 'slideInFromRight 0.4s ease-out forwards';
      });
    } else {
      activeContent.classList.add('slide-in');
    }
  });
});

function initToggleTextSections(container) {
  const left = container.querySelector(".text-left");
  const right = container.querySelector(".text-right");
  const buttons = container.querySelectorAll(".toggle-btn");

  if (!left || !right) return;

  if (window.innerWidth <= 768) {
    left.classList.add("active");
    right.classList.remove("active");
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      
      if (target === "left") {
        left.classList.add("active");
        right.classList.remove("active");
      } else if (target === "right") {
        right.classList.add("active");
        left.classList.remove("active");
      }
    });
  });
}

window.onload = () => loadPage(currentPage);
