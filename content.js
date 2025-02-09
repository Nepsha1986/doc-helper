// Fetch documentation mappings from the Gist

fetch('https://gist.githubusercontent.com/Nepsha1986/e67f5a69f437f8f91147cafa0b889d3b/raw/31568962364718dcb9a62003943065502922bd63/gistfile1.txt')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load documentation mappings');
      return response.json();
    })
    .then(docsMappings => {
      // Set up a MutationObserver to watch for new elements
      const observer = new MutationObserver(() => {
        Object.keys(docsMappings).forEach(testId => {
          const elements = document.querySelectorAll(`[data-testid="${testId}"]:not(:has(.doc-helper-question-mark))`);
          elements.forEach(element => addQuestionMark(element, docsMappings[testId]));
        });
      });

      // Start observing the document
      observer.observe(document.body, { childList: true, subtree: true });

      // Also check for existing elements
      Object.keys(docsMappings).forEach(testId => {
        document.querySelectorAll(`[data-testid="${testId}"]`).forEach(element => {
          addQuestionMark(element, docsMappings[testId]);
        });
      });
    })
    .catch(error => console.error('Error fetching documentation mappings:', error));

function addQuestionMark(element, docInfo) {
  if (!docInfo) return; // Safety check in case of missing mapping

  const questionMark = document.createElement('div');
  questionMark.className = 'doc-helper-question-mark';
  questionMark.textContent = '?';

  // Style adjustments
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
  // Remove existing popup
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

  // Position the popup near the clicked question mark
  popup.style.position = 'fixed';
  popup.style.left = `${x + 10}px`;
  popup.style.top = `${y}px`;
  popup.style.backgroundColor = '#fff';
  popup.style.border = '1px solid #ccc';
  popup.style.padding = '10px';
  popup.style.borderRadius = '5px';
  popup.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';

  document.body.appendChild(popup);

  // Close button functionality
  popup.querySelector('.doc-helper-close').addEventListener('click', () => popup.remove());

  // Close popup when clicking outside
  document.addEventListener('click', function closePopup(e) {
    if (!popup.contains(e.target)) {
      popup.remove();
      document.removeEventListener('click', closePopup);
    }
  });
}
