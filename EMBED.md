# Embedding the RESONANT PALIS OFF demo on resonant-tt.com

Demo URL (live): https://meshdevo.github.io/resonant-demo/

## Option 1 — Link to the demo (simplest)

From any page on resonant-tt.com, link to the demo:

```html
<a href="https://meshdevo.github.io/resonant-demo/" target="_blank" rel="noopener">
  View the PALIS OFF in 3D
</a>
```

The demo page itself already links back to the official PALIS product page
(https://resonant-tt.com/en/shop/hoelzer/palis/) via the
"View on resonant-tt.com ↗" button in its header.

## Option 2 — Embed the demo on a page (iframe)

In WordPress, add a **Custom HTML** block with:

```html
<iframe src="https://meshdevo.github.io/resonant-demo/"
        width="100%" height="720"
        style="border:0; border-radius:12px; background:#17191e;"
        loading="lazy" allowfullscreen
        title="RESONANT PALIS OFF — Interactive 3D Configurator (Demo)"></iframe>
```

Use `height="720"` on desktop; on mobile the viewer is responsive, but a
shorter height (e.g. `520`) fits small screens better. Deep links work
inside the iframe: append `?handle=2` for Handle 2, or
`?view=back`, `?view=edge`, `?view=handle`, `?view=butt` for a preset view.

## Notes

- This is the **contest demo** (one blade, two handles, standalone link).
  The full project in the client brief (§6) is a different deliverable:
  the configurator integrated as a maintainable solution into the
  WordPress/WooCommerce site, with the configured blade added to the
  WooCommerce cart at a server-verified price.
- The demo is a static site (HTML + JS + GLB + textures, no server code),
  so it can also be hosted on resonant-tt.com itself later — copy the
  package contents to any static folder and serve them as-is.
