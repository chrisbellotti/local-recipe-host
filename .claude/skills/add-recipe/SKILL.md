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
macros:              # per serving; see "Macros" below
  calories: 320
  protein: 24
  carbs: 18
  fat: 14
macros_note: Estimated from the ingredient list (fairlife 2% milk assumed).
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
- Keep one ingredient per bullet; each one can be tapped to cross it off.
- Keep one action per numbered step; the step-by-step guide shows one step per card.
- Strip emojis, hashtags, "link in bio", and sponsor text.
- Omit `## Notes` if there's nothing useful.

## Macros

Every recipe gets a `macros` block (per serving: `calories`, `protein`, `carbs`, `fat`; plain numbers, grams for the last three). The recipe page renders it as a Nutrition section.

- **Stated in the source**: use those numbers exactly. If only some are given (e.g. calories and protein), estimate the rest and say so in `macros_note`.
- **Not stated**: estimate from the ingredients and `servings`. Sum each ingredient's macros for the whole batch, then divide by servings. If `servings` is unknown, ask the user or skip `macros` rather than guessing. Round to whole numbers.
- **Look up brands** when an ingredient names one or the brand matters (protein powder, Lily's chocolate, fairlife milk, Greek yogurt, tortillas, etc.). Search the brand's nutrition label online rather than using a generic entry. For unbranded ingredients, use USDA-style values.
- **Milk defaults to fairlife 2%** (about 120 cal, 13g protein, 6g carbs, 5g fat per cup). When a source just says "milk", write it as `fairlife 2% milk` in the ingredients and use those macros. Keep the source's version if it names another kind (fat-free fairlife, whole, oat, almond, etc.). Cream, half-and-half and buttermilk are not "milk".
- Always set `macros_note` when anything was estimated or assumed, in one short sentence (e.g. "Estimated from ingredients; fairlife 2% milk assumed."). Omit it only when every number came from the source.
- Don't put nutrition figures in the body text; the front matter is the one place for them.
- Tell the user in the final message which numbers were estimated and which brand values were used.

## 4. Tags

Use 3–6 lowercase tags. Reuse existing tags whenever possible; list them first with
`grep -h "^tags:" _recipes/*.md | sort -u`.
The index pins these tags as buttons, so use them whenever they fit, spelled exactly like this: `breakfast`, `lunch`, `dinner`, `dessert`, `snack`, `high-protein`, `meal-prep` (portioned into containers for the week). Every other tag lands in a "More tags" dropdown.
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
