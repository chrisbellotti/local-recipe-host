---
name: add-recipe
description: Turn a pasted recipe, recipe URL, or Instagram/TikTok caption into a formatted recipe file in _recipes/, then commit and push so it appears on the site. Use this whenever the user pastes a link, caption, or recipe text, or says anything like "add this", "save this recipe", or "put this on the site", even without the word "recipe". Also use when asked to edit, retag, or fix an existing recipe.
---

# Add a recipe

This repo is a Jekyll site on GitHub Pages. Each recipe is one Markdown file in `_recipes/`. Pushing to `main` publishes it.

## 1. Get the recipe content

- **Recipe website URL**: fetch the page. Look first for a `<script type="application/ld+json">` block with `"@type": "Recipe"` (it may be nested in an `@graph` array). It gives reliable ingredients, steps, times, yield, and image. Fall back to the visible page text if there's none. Ignore the life-story preamble and comments.
- **Instagram / TikTok / YouTube Shorts link**: these can't be fetched reliably. Use the caption or text the user pasted alongside it. If they only gave a link, ask them to paste the caption.
- **Pasted text or caption**: use it directly.

If the source doesn't actually contain the recipe (e.g. "recipe in bio", "full recipe on my site", or instructions only spoken in the video), stop and tell the user what's missing rather than inventing it. If a creator's blog is named, offer to fetch that instead.

## 2. Check for duplicates

Search `_recipes/` for the same `source` URL or a very similar title. If one exists, show it and ask whether to update it or save a separate version.

## 3. Write the file

Filename: `_recipes/<slug>.md`, lowercase with hyphens, no dates (e.g. `crispy-gochujang-tofu.md`). If the slug is taken by a different recipe, add a distinguishing word.

Front matter (omit any line that's unknown; never guess times or servings):

```yaml
---
title: Crispy Gochujang Tofu
summary: One plain sentence on what it is.
source: https://original-link
source_name: Creator or site name (e.g. "@handle on Instagram", "Serious Eats")
source_type: web | instagram | tiktok | youtube | family | other
added: YYYY-MM-DD   # today's date
servings: 4
prep_time: 10 min
cook_time: 25 min
total_time: 35 min
tags: [tofu, korean, vegetarian, weeknight]
image: https://...   # web sources only; never Instagram/TikTok CDN links (they expire)
---
```

Body, in this order:

```markdown
## Ingredients

- 1 block (14 oz) extra-firm tofu, pressed and cubed
- 2 tbsp gochujang

## Instructions

1. First step as a full sentence.
2. Next step.

## Notes

- Tips, substitutions, or storage from the source.
```

Formatting rules:
- Group ingredients under `###` subheadings (e.g. `### Sauce`) only when the source groups them.
- Quantity, then unit, then ingredient, then prep: `2 cloves garlic, minced`.
- Units: `tsp`, `tbsp`, `cup`, `oz`, `lb`, `g`, `ml`, `min`. Fractions as `1/2`. Keep the source's measurement system; don't convert.
- Keep amounts exactly as given. If a caption gives no amount, write "to taste" or leave the amount off. Never make one up.
- Rewrite steps as clear, numbered, imperative sentences. Split run-on caption text into separate steps. Put oven temperatures and times in the step where they're used.
- Strip emojis, hashtags, "link in bio", and sponsor text.
- Omit `## Notes` if there's nothing useful.

## 4. Tags

Use 3–6 lowercase tags. Reuse existing tags whenever possible; list them first with
`grep -h "^tags:" _recipes/*.md | sort -u`.
Cover, where they apply: main ingredient or protein, cuisine, meal type (breakfast, dinner, dessert, snack, side), diet (vegetarian, vegan, gluten-free), and effort (weeknight, weekend, make-ahead).

## 5. Publish

```bash
git add _recipes/<slug>.md
git commit -m "Add recipe: <Title>"
git push
```

Then tell the user the title, the tags chosen, anything that was guessed or left out, and the page path `/recipes/<slug>/` (live about a minute after pushing).

## Editing an existing recipe

Edit the file in place, keep `added` unchanged, and commit with `Update recipe: <Title>`.
