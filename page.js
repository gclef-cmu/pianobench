// Keep audio from the benchmark and the tutorial from playing over one another.
document.querySelector('#question-audio').addEventListener('play', () => {
  window.dispatchEvent(new Event('pause-tutorial'));
});
window.addEventListener('tutorial-playing', () => {
  document.querySelector('#question-audio').pause();
});

let citationResetTimer;
document.querySelector('#copy-citation').addEventListener('click', async () => {
  const citation = document.querySelector('#citation-text');
  const status = document.querySelector('#citation-status');
  try {
    await navigator.clipboard.writeText(citation.textContent);
    status.textContent = 'Citation copied.';
    const button = document.querySelector('#copy-citation');
    const label = document.querySelector('#copy-citation-label');
    button.classList.add('copied');
    label.textContent = 'copied!';
    clearTimeout(citationResetTimer);
    citationResetTimer = setTimeout(() => {
      button.classList.remove('copied');
      label.textContent = 'copy';
      status.textContent = '';
    }, 2000);
  } catch {
    const range = document.createRange();
    range.selectNodeContents(citation);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    status.classList.remove('visually-hidden');
    status.textContent = 'Text selected. Press Ctrl+C or ⌘C to copy.';
  }
});
