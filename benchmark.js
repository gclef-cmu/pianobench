const get = (id) => document.getElementById(id);
let questions = [], index = 0, revealed = false, selected = null;

function renderAnswers() {
  const q = questions[index];
  get('answer').hidden = !revealed;
  get('reveal').textContent = revealed ? 'Hide reference answer' : 'Show reference answer';
  get('reveal').setAttribute('aria-expanded', String(revealed));
  get('choices').querySelectorAll('label').forEach((row, i) => {
    row.classList.toggle('correct', revealed && i === q.answer_index);
  });
  get('reference-answer').textContent = `Reference answer: ${String.fromCharCode(65 + q.answer_index)}. ${q.choices[q.answer_index]}`;
  get('selection-feedback').textContent = !revealed || selected === null ? '' : selected === q.answer_index ? 'Your answer matches the reference.' : 'Your answer differs from the reference.';
}

function render() {
  const q = questions[index];
  revealed = false;
  selected = null;
  get('question-audio').pause();
  get('question-audio').src = q.audio_url;
  get('question-audio').load();
  get('question').textContent = q.question;
  get('question-progress').textContent = `Question ${index + 1} of ${questions.length}`;
  get('previous-question').disabled = index === 0;
  get('next-question').disabled = index === questions.length - 1;
  get('choices').querySelectorAll('label').forEach((row) => row.remove());
  q.choices.forEach((choice, i) => {
    const row = document.createElement('label');
    row.className = 'choice';
    const input = document.createElement('input');
    input.type = 'radio'; input.name = 'answer'; input.value = i;
    input.addEventListener('change', () => { selected = i; renderAnswers(); });
    const text = document.createElement('span');
    text.textContent = `${String.fromCharCode(65 + i)}. ${choice}`;
    row.append(input, text);
    get('choices').append(row);
  });
  renderAnswers();
}
get('previous-question').addEventListener('click', () => { if (index > 0) { index--; render(); } });
get('next-question').addEventListener('click', () => { if (index < questions.length - 1) { index++; render(); } });
get('reveal').addEventListener('click', () => { revealed = !revealed; renderAnswers(); });
try {
  const response = await fetch(new URL('./data/questions.json', import.meta.url));
  if (!response.ok) throw new Error(`Could not load benchmark examples: HTTP ${response.status}`);
  questions = (await response.json()).questions;
  if (questions.length) { get('benchmark-viewer').hidden = false; render(); }
  else get('benchmark-error').textContent = 'Benchmark examples are not available.';
} catch (error) { get('benchmark-error').textContent = error.message; }
