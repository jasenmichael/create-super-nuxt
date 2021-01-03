## cretate-super-nuxt

this installs a fresh nuxt install, with your selected settings, then adds some opiniated starting point with many out of the box features.

to install:

```bash
npx create-super-nuxt [my-project]
```

features:

- Static generated site with SEO in mind.
- OG/Twitter head tags.
- PWA (and TWA option).
- CI/CD with github actions - builds and pushes to prod which triggers netlify deploy.
- netlify build cache for fast builds.
- all site settings in one file.
- Nuxt Content linked with Netlify CMS.
- Netlify CMS to CRUD on content files.
- Netlify identity for cms
- Most logic is done in the page view passing props to component.
- All styling done within the layout and components.
- css framework based themes

todo:

- RSS feed to trigger Zappier
- robots.txt
-

---

super-nuxt-themes
tailwind-boilerplate
tailawind-musician-elegant
tailawind-[custom-theme-name]

dev/ << nuxt install for theme development

themes/
[custom-theme-name]
files/
assets/
components/
posts/
_.md
page/
_.md
content/
pages/
posts/
layouts/
pages/

package.json
