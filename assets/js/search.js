document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('global-search');
  const resultsBox = document.getElementById('search-results');

  if (!searchInput) return;

  fetch('{{ site.baseurl }}/search.json')
    .then(res => res.json())
    .then(posts => {
      const lunrIndex = lunr(function () {
        this.ref('id');
        this.field('title', { boost: 10 });
        this.field('content');
        posts.forEach(post => this.add(post));
      });

      searchInput.addEventListener('input', function () {
        const query = this.value.trim();
        resultsBox.innerHTML = '';

        if (query.length < 2) return;

        const results = lunrIndex.search(query);

        if (results.length === 0) {
          resultsBox.innerHTML = `<p class="p-4 text-zinc-400 text-sm">No results found</p>`;
          return;
        }

        let html = '';
        results.forEach(result => {
          const post = posts.find(p => p.id === result.ref);
          if (post) {
            html += `
              <a href="${post.url}" class="block px-4 py-3 hover:bg-zinc-800 border-b border-zinc-700 last:border-none">
                <div class="font-medium">${post.title}</div>
              </a>`;
          }
        });

        resultsBox.innerHTML = html;
      });
    });
});
