# Recipe Box

A household recipe site built with Jekyll and hosted on GitHub Pages.

- Recipes live in `_recipes/*.md` (one file per recipe: YAML front matter + Markdown body).
- `index.html` lists recipes with search and tag filters (`assets/js/site.js`).
- `_layouts/recipe.html` renders one recipe; styles are in `assets/css/style.css`.
- Pushing to `main` publishes automatically. No build step or dependencies.

When the user pastes a recipe, link, or caption, use the `add-recipe` skill in `.claude/skills/add-recipe/`.
Keep the front matter schema consistent; the index and recipe layout depend on it.
