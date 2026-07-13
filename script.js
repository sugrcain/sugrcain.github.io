// ---------- config: replace with your own ----------
const SUBSTACK_FEED_URL = "https://sugrcain.substack.com/feed"; // your Substack RSS feed
const GITHUB_USERNAME   = "sugrcain";                            // your GitHub username
const REPO_COUNT        = 2;

// ---------- Substack RSS ----------
// Substack's RSS endpoint has no CORS headers, so it's fetched through
// rss2json.com's free public API. If that's unavailable (it rate-limits
// anonymous requests), we fall back to fetching the raw XML through a
// CORS proxy and parsing it directly in the browser.
async function fetchFeedItems(feedUrl) {
  // Attempt 1: rss2json
  try {
    const api = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
    const res = await fetch(api);
    const data = await res.json();
    if (data.status === 'ok' && data.items?.length) {
      return data.items.map(item => ({ title: item.title, link: item.link, pubDate: item.pubDate }));
    }
  } catch (err) {
    // fall through to the backup proxy below
  }

  // Attempt 2: raw XML via a CORS proxy, parsed manually
  const proxied = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`;
  const res = await fetch(proxied);
  const xmlText = await res.text();
  const xml = new DOMParser().parseFromString(xmlText, 'text/xml');
  const items = Array.from(xml.querySelectorAll('item')).map(item => ({
    title: item.querySelector('title')?.textContent || 'Untitled',
    link: item.querySelector('link')?.textContent || '#',
    pubDate: item.querySelector('pubDate')?.textContent || ''
  }));
  if (!items.length) throw new Error('empty feed');
  return items;
}

async function loadSubstackFeed() {
  const list = document.getElementById('rssFeedList');
  const link = document.getElementById('rssFeedLink');
  link.href = SUBSTACK_FEED_URL.replace(/\/feed\/?$/, '');
  try {
    const items = await fetchFeedItems(SUBSTACK_FEED_URL);
    list.innerHTML = '';
    items.slice(0, 5).forEach(item => {
      const li = document.createElement('li');
      const date = new Date(item.pubDate).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
      li.innerHTML = `
        <a class="rss-title" href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a>
        <span class="rss-date">${date}</span>`;
      list.appendChild(li);
    });
  } catch (err) {
    list.innerHTML = '<li class="rss-error">Crickets. . . </li>';
  }
}

// ---------- GitHub repos ----------
async function loadGithubRepos() {
  const list = document.getElementById('githubRepoList');
  const profileLink = document.getElementById('githubProfileLink');
  profileLink.href = `https://github.com/${GITHUB_USERNAME}`;
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=${REPO_COUNT}`);
    const repos = await res.json();
    if (!Array.isArray(repos) || !repos.length) throw new Error('no repos');
    list.innerHTML = '';
    repos.forEach(repo => {
      const li = document.createElement('li');
      li.innerHTML = `
        <a class="repo-name" href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a>
        <div class="repo-desc">${repo.description ? repo.description : 'no description'}</div>
        <div class="repo-meta">
          <span>${repo.language || '—'}</span>
          <span>★ ${repo.stargazers_count}</span>
        </div>`;
      list.appendChild(li);
    });
  } catch (err) {
    list.innerHTML = '<li class="repo-desc">WIP?</li>';
  }
}

loadSubstackFeed();
loadGithubRepos();
