const languageLinks = document.querySelectorAll('[data-lang-switch]');
for (const link of languageLinks) {
  link.addEventListener('click', () => {
    const chapters = [...document.querySelectorAll('main section[id]')];
    const chapter = chapters.findLast(section => section.getBoundingClientRect().top < window.innerHeight * 0.45);
    const atFooter = link.closest('footer');
    const hash = location.hash || (!atFooter && chapter ? '#' + chapter.id : '');
    const url = new URL(link.getAttribute('href'), location.origin);
    url.hash = hash;
    link.href = url.href;
  });
}

const direction = document.querySelector('.direction-flow');
const cards = [...direction.querySelectorAll('[data-decision]')];
const connectors = [...direction.querySelectorAll('.direction-connector')];

function alignConnectors() {
  const origin = direction.getBoundingClientRect();
  const bounds = new Map(cards.map(card => [card.dataset.decision, card.getBoundingClientRect()]));

  for (const connector of connectors) {
    const { from, to, axis } = connector.dataset;
    const start = bounds.get(from);
    const end = bounds.get(to);

    if (axis === 'down') {
      const x = start.left + start.width / 2 - origin.left;
      connector.setAttribute('d', `M ${x} ${start.bottom - origin.top} V ${end.top - origin.top}`);
    } else if (end.left > start.right) {
      const x1 = start.right - origin.left;
      const x2 = end.left - origin.left;
      const y1 = start.top + start.height / 2 - origin.top;
      const y2 = end.top + end.height / 2 - origin.top;
      const middle = (x1 + x2) / 2;
      connector.setAttribute('d', Math.abs(y1 - y2) < 1
        ? `M ${x1} ${y1} L ${x2} ${y2}`
        : `M ${x1} ${y1} H ${middle} V ${y2} H ${x2}`);
    } else {
      connector.removeAttribute('d');
    }
  }
}

alignConnectors();
const directionObserver = new ResizeObserver(alignConnectors);
directionObserver.observe(direction);
for (const element of [...cards, ...direction.querySelectorAll('h3')]) {
  directionObserver.observe(element);
}
