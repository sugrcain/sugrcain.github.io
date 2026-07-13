// ---------- config: replace with your own ----------
const SUBSTACK_FEED_URL = "https://sugrcain.substack.com/feed"; // your Substack RSS feed
const GITHUB_USERNAME   = "sugrcain";                            // your GitHub username
const REPO_COUNT        = 2;

// ---------- Substack RSS ----------
// Substack's RSS endpoint has no CORS headers, so it's fetched through
// rss2json.com's free public API. Swap in your own proxy if preferred.
async function loadSubstackFeed() {
  const list = document.getElementById('rssFeedList');
  const link = document.getElementById('rssFeedLink');
  link.href = SUBSTACK_FEED_URL.replace(/\/feed\/?$/, '');
  try {
    const api = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(SUBSTACK_FEED_URL)}`;
    const res = await fetch(api);
    const data = await res.json();
    if (data.status !== 'ok' || !data.items?.length) throw new Error('empty feed');
    list.innerHTML = '';
    data.items.slice(0, 5).forEach(item => {
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
