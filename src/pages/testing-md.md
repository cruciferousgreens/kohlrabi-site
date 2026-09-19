---
title: Markdown pipeline test - Kohlrabi
description: Hidden test page proving Markdown sources build into full site pages.
canonical: https://getkohlrabi.com/testing-md
robots: noindex, nofollow
css_page: privacy
---

<section class="subpage" markdown="1">

# Markdown pipeline test

This page is built from `src/pages/testing-md.md` — plain Markdown with front matter, converted to HTML by `build.py`. If you can read this with the normal site header, footer, and text-page styling, the pipeline works. **This page is not linked anywhere and is excluded from search.**

## Formatting basics

A paragraph with **bold**, *italic*, and a [link to the glossary](/glossary). The
second sentence of the paragraph keeps flowing here to show line wrapping.

- Unordered list, item one
- Item two with `inline code`
- Item three

1. Ordered list, first
2. Ordered list, second

> A blockquote, for pull quotes or callouts.
> It can span multiple lines.

---

### A small table

| Exercise   | Sets | Reps  |
|------------|------|-------|
| Squat      | 3    | 5     |
| Bench      | 3    | 8     |

### A code fence

```python
def double_progression(weight, reps, top_of_range):
    if reps >= top_of_range:
        return weight + 5, reps - 2
    return weight, reps + 1
```

## Raw HTML still works

<div class="chip-row">
  <span class="chip chip-green">Markdown</span>
  <span class="chip chip-outline">HTML</span>
</div>

<details markdown="1">
<summary>Markdown inside a details block</summary>

This paragraph is *Markdown* rendered **inside** a raw HTML `<details>` element,
thanks to the `md_in_html` extension.

- Even lists work in here.
</details>

*End of test page.*

</section>
