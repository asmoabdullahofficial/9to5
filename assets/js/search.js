document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('global-search');
const results = lunrIndex.search(query.split(" ").map(word => word + '*').join(" "));

  if (!searchInput) return;

  fetch('/search.json')
    .then(response => response.json())
    .then(posts => {

      const lunrIndex = lunr(function () {
        this.ref('id');
        this.field('title', { boost: 10 });
        this.field('content');
        this.field('categories');

        posts.forEach(post => {
          this.add(post);
        });
      });

      searchInput.addEventListener('keyup', function () {
        const query = this.value.trim().toLowerCase();
        resultsBox.innerHTML = '';

        if (query.length < 2) {
          resultsBox.classList.add('hidden');
          return;
        }

        const results = lunrIndex.search(query + '*');

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
    });
});
