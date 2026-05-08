document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('global-search');
  const resultsBox = document.getElementById('search-results');

  if (!searchInput) {
    console.log("Search input not found");
    return;
  }

  console.log("Search script loaded successfully");

  fetch('/search.json')
    .then(response => {
      if (!response.ok) throw new Error("search.json not found");
      return response.json();
    })
    .then(posts => {
      console.log("Search data loaded:", posts.length + " posts");

      const lunrIndex = lunr(function () {
        this.ref('id');
        this.field('title', { boost: 10 });
        this.field('content');
        posts.forEach(post => this.add(post));
      });

      searchInput.addEventListener('keyup', function () {
        const query = this.value.trim();
        resultsBox.innerHTML = '';

        if (query.length < 2) {
          resultsBox.classList.add('hidden');
          return;
        }

        const results = lunrIndex.search(query);

        if (results.length === 0) {
          resultsBox.innerHTML = `<p class="p-4 text-zinc-400">No results found for "${query}"</p>`;
          resultsBox.classList.remove('hidden');
          return;
        }

        let html = '';
        results.forEach(result => {
          const post = posts.find(p => p.id === result.ref);
          if (post) {
            html += `
              <a href="${post.url}" class="block px-4 py-3 hover:bg-zinc-800 border-b border-zinc-700 last:border-none">
                <div class="font-medium text-white">${post.title}</div>
              </a>`;
          }
        });

        resultsBox.innerHTML = html;
        resultsBox.classList.remove('hidden');
      });
    })
    .catch(err => {
      console.error("Search error:", err);
      resultsBox.innerHTML = `<p class="p-4 text-red-400">Search is not working properly.</p>`;
    });
});
