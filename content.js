chrome.storage.local.get("gistUrl", async (data) => {
  const gistUrl = data.gistUrl;
  if (!gistUrl) {
    console.error("No Gist URL found in storage.");
    return;
  }

  try {
    const response = await fetch(gistUrl);
    if (!response.ok) throw new Error("Failed to load documentation mappings");

    const docsMappings = await response.json();
    initializeMutationObserver(docsMappings);
  } catch (error) {
    console.error("Error fetching documentation mappings:", error);
  }
});

function initializeMutationObserver(docsMappings) {
  const observer = new MutationObserver(() => {
    Object.keys(docsMappings).forEach(testId => {
      const elements = document.querySelectorAll(`[data-testid="${testId}"]:not(:has(.doc-helper-question-mark))`);
      elements.forEach(element => addQuestionMark(element, docsMappings[testId]));
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  Object.keys(docsMappings).forEach(testId => {
    document.querySelectorAll(`[data-testid="${testId}"]`).forEach(element => {
      addQuestionMark(element, docsMappings[testId]);
    });
  });
}

function addQuestionMark(element, docInfo) {
  if (!docInfo) return;

  const questionMark = document.createElement('div');
  questionMark.className = 'doc-helper-question-mark';
  questionMark.textContent = '?';

  element.style.position = 'relative';
  questionMark.style.position = 'absolute';
  questionMark.style.right = '5px';
  questionMark.style.top = '5px';
  questionMark.style.cursor = 'pointer';
  questionMark.style.fontWeight = 'bold';

  element.appendChild(questionMark);

  questionMark.addEventListener('click', (e) => {
    e.stopPropagation();
    showPopup(docInfo, e.clientX, e.clientY);
  });
}

function showPopup(docInfo, x, y) {
  document.querySelector('.doc-helper-popup')?.remove();

  const popup = document.createElement('div');
  popup.className = 'doc-helper-popup';

  popup.innerHTML = `
        <div class="doc-helper-popup-header">
            <h3>${docInfo.title}</h3>
            <button class="doc-helper-close">×</button>
        </div>
        <p>${docInfo.description}</p>
        <div class="doc-helper-links">
            ${docInfo.links?.map(link => `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.text}</a>`).join('') || ''}
        </div>
    `;

  popup.style.position = 'fixed';
  popup.style.left = `${x - 400}px`;
  popup.style.top = `${y}px`;
  popup.style.backgroundColor = '#fff';
  popup.style.border = '1px solid #ccc';
  popup.style.padding = '10px';
  popup.style.borderRadius = '5px';
  popup.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';

  document.body.appendChild(popup);

  popup.querySelector('.doc-helper-close').addEventListener('click', () => popup.remove());

  document.addEventListener('click', function closePopup(e) {
    if (!popup.contains(e.target)) {
      popup.remove();
      document.removeEventListener('click', closePopup);
    }
  });
}
