let pdfDoc = null,
  pageNum = 1,
  pageRendering = false,
  pageNumPending = null,
  scale = 1.5,
  canvas = document.getElementById("pdf-canvas"),
  ctx = canvas.getContext("2d");

function toggleLeftPanel() {
  const leftPanel = document.getElementById("left-panel");
  const toggleButton = document.getElementById("toggle-button");
  const rightPanel = document.getElementById("right-panel");
  if (leftPanel && toggleButton && rightPanel) {
    leftPanel.classList.toggle("collapsed");
    if (leftPanel.classList.contains("collapsed")) {
      leftPanel.style.width = "0";
      toggleButton.innerHTML = "&#9776;";
      rightPanel.style.left = "0";
      toggleButton.style.left = "10px";
    } else {
      leftPanel.style.width = "300px"; // Ensure consistent width
      toggleButton.innerHTML = "&#10006;";
      rightPanel.style.left = "300px";
      toggleButton.style.left = "300px";
    }
  }
}

function closeLeftPanel() {
  const leftPanel = document.getElementById("left-panel");
  const closeButton = document.getElementById("close-button");
  const toggleButton = document.getElementById("toggle-button");
  const rightPanel = document.getElementById("right-panel");
  if (leftPanel && closeButton && toggleButton && rightPanel) {
    leftPanel.classList.add("collapsed");
    leftPanel.style.width = "0";
    closeButton.style.display = "none";
    toggleButton.innerHTML = "&#9654;";
    toggleButton.style.left = "10px";
    rightPanel.style.left = "0";
  }
}

function toggleSubtitle(subtitleId) {
  const subtitle = document.getElementById(subtitleId);
  const leftPanel = document.getElementById("left-panel");
  if (subtitle && leftPanel) {
    subtitle.classList.toggle("expanded");
    leftPanel.style.width = "300px"; // Ensure consistent width
  }
}

function toggleSection(sectionId) {
  const section = document.getElementById(sectionId);
  const leftPanel = document.getElementById("left-panel");
  if (section && leftPanel) {
    section.classList.toggle("expanded");
    leftPanel.style.width = "300px"; // Ensure consistent width
  }
}

function showPDF(url, title, subtitle) {
  const pdfCanvas = document.getElementById("pdf-canvas");
  const pdfControls = document.getElementById("pdf-controls");
  const pdfContainer = document.getElementById("pdf-container");
  const leftPanel = document.getElementById("left-panel");
  const contentInfo = document.getElementById("current-content-info");
  if (pdfCanvas && pdfControls && pdfContainer && leftPanel && contentInfo) {
    pdfjsLib.getDocument(url).promise.then(function (pdfDoc_) {
      pdfDoc = pdfDoc_;
      document.getElementById("page-count").textContent = pdfDoc.numPages;
      renderPage(pageNum);
      pdfCanvas.style.display = "block";
      pdfControls.style.display = "block";
      pdfContainer.style.display = "block";
      document.getElementById("video-container").style.display = "none";
      document.getElementById("note-content").style.display = "none";
      leftPanel.style.width = "300px"; // Ensure consistent width
      contentInfo.textContent = `${subtitle} - ${title}`;
    });
  }
}

function renderPage(num) {
  pageRendering = true;
  pdfDoc.getPage(num).then(function (page) {
    const viewport = page.getViewport({ scale: scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };
    const renderTask = page.render(renderContext);
    renderTask.promise.then(function () {
      pageRendering = false;
      if (pageNumPending !== null) {
        renderPage(pageNumPending);
        pageNumPending = null;
      }
    });
  });
  document.getElementById("page-num").textContent = num;
}

function prevPage() {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  renderPage(pageNum);
}

function nextPage() {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  renderPage(pageNum);
}

function showVideo(url, title, subtitle) {
  const videoPlayer = document.getElementById("video-player");
  const videoSource = document.getElementById("video-source");
  const videoContainer = document.getElementById("video-container");
  const leftPanel = document.getElementById("left-panel");
  const contentInfo = document.getElementById("current-content-info");
  if (
    videoPlayer &&
    videoSource &&
    videoContainer &&
    leftPanel &&
    contentInfo
  ) {
    videoSource.src = url;
    videoPlayer.load();
    videoPlayer.style.display = "block";
    videoContainer.style.display = "block";
    document.getElementById("pdf-canvas").style.display = "none";
    document.getElementById("pdf-controls").style.display = "none";
    document.getElementById("pdf-container").style.display = "none";
    document.getElementById("note-content").style.display = "none";
    leftPanel.style.width = "300px"; // Ensure consistent width
    contentInfo.textContent = `${subtitle} - ${title}`;
  }
}

function showNote(content, title, subtitle) {
  const noteContent = document.getElementById("note-content");
  const leftPanel = document.getElementById("left-panel");
  const contentInfo = document.getElementById("current-content-info");
  if (noteContent && leftPanel && contentInfo) {
    noteContent.innerHTML = content;
    noteContent.style.display = "block";
    noteContent.scrollTop = 0;
    document.getElementById("pdf-canvas").style.display = "none";
    document.getElementById("pdf-controls").style.display = "none";
    document.getElementById("pdf-container").style.display = "none";
    document.getElementById("video-container").style.display = "none";
    leftPanel.style.width = "300px"; // Ensure consistent width
    contentInfo.textContent = `${subtitle} - ${title}`;
  }
}

function prevContent() {
  const currentContent = document.querySelector(
    ".left-panel .subtitle-content .section-content .pdf-title a.active, .left-panel .subtitle-content .section-content .video-title a.active, .left-panel .subtitle-content .section-content .note-title a.active"
  );
  if (currentContent) {
    const prevContent = currentContent.parentElement.previousElementSibling;
    if (prevContent) {
      prevContent.querySelector("a").click();
    } else {
      const currentSection = currentContent.closest(".section-content");
      const prevSection = currentSection.previousElementSibling;
      if (prevSection) {
        const lastItem = prevSection.querySelector("li:last-child a");
        if (lastItem) {
          lastItem.click();
        } else {
          prevContentInSection(prevSection);
        }
      } else {
        const currentSubtitle = currentContent.closest(".subtitle-content");
        const prevSubtitle = currentSubtitle.previousElementSibling;
        if (prevSubtitle) {
          const lastSection = prevSubtitle.querySelector(
            ".section-content:last-child"
          );
          if (lastSection) {
            const lastItem = lastSection.querySelector("li:last-child a");
            if (lastItem) {
              lastItem.click();
            } else {
              prevContentInSection(lastSection);
            }
          }
        }
      }
    }
  }
}

function prevContentInSection(section) {
  const lastItem = section.querySelector("li:last-child a");
  if (lastItem) {
    lastItem.click();
  } else {
    const prevSection = section.previousElementSibling;
    if (prevSection) {
      prevContentInSection(prevSection);
    }
  }
}

function nextContent() {
  const currentContent = document.querySelector(
    ".left-panel .subtitle-content .section-content .pdf-title a.active, .left-panel .subtitle-content .section-content .video-title a.active, .left-panel .subtitle-content .section-content .note-title a.active"
  );
  if (currentContent) {
    const nextContent = currentContent.parentElement.nextElementSibling;
    if (nextContent) {
      nextContent.querySelector("a").click();
    } else {
      const currentSection = currentContent.closest(".section-content");
      const nextSection = currentSection.nextElementSibling;
      if (nextSection) {
        const firstItem = nextSection.querySelector("li:first-child a");
        if (firstItem) {
          firstItem.click();
        } else {
          nextContentInSection(nextSection);
        }
      } else {
        const currentSubtitle = currentContent.closest(".subtitle-content");
        const nextSubtitle = currentSubtitle.nextElementSibling;
        if (nextSubtitle) {
          const firstSection = nextSubtitle.querySelector(
            ".section-content:first-child"
          );
          if (firstSection) {
            const firstItem = firstSection.querySelector("li:first-child a");
            if (firstItem) {
              firstItem.click();
            } else {
              nextContentInSection(firstSection);
            }
          }
        }
      }
    }
  }
}

function nextContentInSection(section) {
  const firstItem = section.querySelector("li:first-child a");
  if (firstItem) {
    firstItem.click();
  } else {
    const nextSection = section.nextElementSibling;
    if (nextSection) {
      nextContentInSection(nextSection);
    }
  }
}

// Add active class to the clicked content link
document.querySelectorAll(".left-panel a").forEach((link) => {
  link.addEventListener("click", function () {
    document.querySelectorAll(".left-panel a").forEach((el) => {
      el.classList.remove("active");
    });
    this.classList.add("active");
  });
});

function changeTheme(theme) {
  const themeStylesheet = document.getElementById("theme-stylesheet");
  themeStylesheet.href = `/static/css/contents/${theme}.css`;
  document.body.className = theme; // Add theme class to body
  localStorage.setItem("selectedTheme", theme);
  updateToggleButtonColor(theme);
  updateHeaderBarColor(theme);
}

function updateToggleButtonColor(theme) {
  const toggleButton = document.getElementById("toggle-button");
  switch (theme) {
    case "theme1":
      toggleButton.style.backgroundColor = "#1e3a5f";
      toggleButton.style.color = "#d1e7f0";
      break;
    case "theme2":
      toggleButton.style.backgroundColor = "#2e7d32";
      toggleButton.style.color = "#e8f5e9";
      break;
    case "theme3":
      toggleButton.style.backgroundColor = "#4a148c";
      toggleButton.style.color = "#f3e5f5";
      break;
    case "theme4":
      toggleButton.style.backgroundColor = "#b71c1c";
      toggleButton.style.color = "#ffebee";
      break;
    default:
      toggleButton.style.backgroundColor = "#b85042";
      toggleButton.style.color = "#e7e8d1";
      break;
  }
}

function updateHeaderBarColor(theme) {
  const headerBar = document.querySelector(".header-bar");
  const themeSelector = document.querySelector(".theme-selector");
  const backButton = document.querySelector(".back-button");
  switch (theme) {
    case "theme1":
      headerBar.style.backgroundColor = "#1e3a5f";
      headerBar.style.color = "#d1e7f0";
      themeSelector.style.backgroundColor = "#1e3a5f";
      themeSelector.style.color = "#d1e7f0";
      backButton.style.backgroundColor = "#d1e7f0";
      backButton.style.color = "#1e3a5f";
      break;
    case "theme2":
      headerBar.style.backgroundColor = "#2e7d32";
      headerBar.style.color = "#e8f5e9";
      themeSelector.style.backgroundColor = "#2e7d32";
      themeSelector.style.color = "#e8f5e9";
      backButton.style.backgroundColor = "#e8f5e9";
      backButton.style.color = "#2e7d32";
      break;
    case "theme3":
      headerBar.style.backgroundColor = "#4a148c";
      headerBar.style.color = "#f3e5f5";
      themeSelector.style.backgroundColor = "#4a148c";
      themeSelector.style.color = "#f3e5f5";
      backButton.style.backgroundColor = "#f3e5f5";
      backButton.style.color = "#4a148c";
      break;
    case "theme4":
      headerBar.style.backgroundColor = "#b71c1c";
      headerBar.style.color = "#ffebee";
      themeSelector.style.backgroundColor = "#b71c1c";
      themeSelector.style.color = "#ffebee";
      backButton.style.backgroundColor = "#ffebee";
      backButton.style.color = "#b71c1c";
      break;
    default:
      headerBar.style.backgroundColor = "#b85042";
      headerBar.style.color = "#e7e8d1";
      themeSelector.style.backgroundColor = "#b85042";
      themeSelector.style.color = "#e7e8d1";
      backButton.style.backgroundColor = "#e7e8d1";
      backButton.style.color = "#b85042";
      break;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("selectedTheme") || "contentsstyle";
  document.getElementById("theme-select").value = savedTheme;
  changeTheme(savedTheme);
});
