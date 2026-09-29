# Recipe Box

Our household recipes, added by pasting links or captions into Claude Code.

## Setup (one time)

1. Create a new empty GitHub repo (e.g. `recipes`), then from this folder:
   ```bash
   git init && git add . && git commit -m "Initial recipe box"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, folder `/ (root)`.
3. If the repo isn't named `<you>.github.io`, set `baseurl: "/<repo>"` in `_config.yml` and push.
4. The site appears at `https://<you>.github.io/<repo>/` within a couple of minutes.

## Adding recipes

Open this folder in VS Code, start Claude Code, and paste something like:

- `add this https://www.seriouseats.com/some-recipe`
- `save this recipe https://www.instagram.com/reel/...` followed by the pasted caption

Claude follows `.claude/skills/add-recipe/SKILL.md` to format the recipe, then commits and pushes.

Delete `_recipes/garlic-butter-pasta.md` once you have real recipes.

## Local preview (optional)

With Ruby installed: `gem install jekyll`, then `jekyll serve` and open http://localhost:4000.

Note: GitHub Pages sites are publicly viewable, even from a private repo.
