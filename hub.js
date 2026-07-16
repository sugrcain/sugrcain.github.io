
const treeData = {
  name: '.',
  children: [
    {
      name: 'NeatSites/',
      children: [
        { name: 'CyberChef', url: 'https://toolbox.itsec.tamu.edu/' },
        { name: 'ApexRabbit', url: 'https://apexrabbit.com/resources/' },
        { name: 'LOLBAS', url: 'https://lolbas-project.github.io/' },
        { name: 'GTFOBins', url: 'https://gtfobins.org/' }
      ]
    },
    {
      name: 'WebApp/',
      children: [
        { name: 'Pentest Blogs', url: 'https://pentesterlab.com/blog/' },
        { name: 'PortSwigger Blogs', url: 'https://portswigger.net/research/top-10-web-hacking-techniques' },
        { name: 'OWASP', url: 'https://owasp.org/www-project-top-ten/' }
      ]
    },
    {
      name: 'RedTeam/',
      children: [
        { name: 'ired.team', url: 'https://www.ired.team/' },
        { name: 'WADComm', url: 'https://wadcoms.github.io/' },
        { name: 'netexec', url: 'https://www.netexec.wiki/' }
      ]
    },
    {
      name: 'OSCP Prep/',
      children: [
        { name: 'LainKusanagi List', url: 'https://docs.google.com/spreadsheets/d/13YoNQuY6HC5ot-lZiX2tY9pR5mvwnp3xV6lHs78DlqQ/edit?gid=878934599#gid=878934599' },
        { name: 'IppSec Search', url: 'https://ippsec.rocks/?#', desc: 'search for specific techniques' },
        { name: 'HTB CPTS Path', url: 'https://academy.hackthebox.com/preview/certifications/htb-certified-penetration-testing-specialist' },
        { name: 'OSCP-LK', url: 'https://buymeacoffee.com/lainkusanagi/e/542033', desc: 'affordable OSCP practice test' }
      ]
    }
  ]
};

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderNode(node, prefix, isLast, isRoot, lines, counts) {
  if (isRoot) {
    lines.push(`<span class="tree-root">${escapeHtml(node.name)}</span>`);
  } else {
    const connector = isLast ? '&#9492;&#9472;&#9472; ' : '&#9500;&#9472;&#9472; '; // └── / ├──
    const isDir = Array.isArray(node.children);
    isDir ? counts.dirs++ : counts.files++;

    let label = node.url
      ? `<a href="${node.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(node.name)}</a>`
      : escapeHtml(node.name);
    if (node.desc) label += `  <span class="tree-comment"># ${escapeHtml(node.desc)}</span>`;

    lines.push(prefix + connector + label);
  }

  if (node.children) {
    const childPrefix = isRoot ? '' : prefix + (isLast ? '    ' : '&#9474;   '); // │
    node.children.forEach((child, i) => {
      renderNode(child, childPrefix, i === node.children.length - 1, false, lines, counts);
    });
  }
}

function renderTree() {
  const el = document.getElementById('treeOutput');
  if (!el) return;

  const lines = [];
  const counts = { dirs: 0, files: 0 };
  renderNode(treeData, '', true, true, lines, counts);

  lines.push('');
  lines.push(`${counts.dirs} directories, ${counts.files} files`);

  el.innerHTML = lines.join('\n');
}

renderTree();
