# Defineitt

A responsive, static portfolio and creator partnership page. It is built with HTML, CSS, and vanilla JavaScript so it can deploy directly to GitHub Pages without a package install or build step.

## Preview locally

Open `index.html` in a browser. For a local web server, run `python -m http.server 8000` from this folder and visit `http://localhost:8000`.

## Update the site

- Edit copy and section content in `index.html`.
- Edit colors, spacing, and responsive layouts in `styles.css`.
- Edit interactions in `script.js`.
- The header and footer use the full square artwork in `assets/defineitt-brand.webp` as a small profile-style logo.
- The platform marquee uses transparent PNG logo marks for YouTube, Twitch, Kick, and Instagram Reels, matched to the supplied reference screenshot.
- Replace the three MP4s and poster images in `assets/` to update the work cards. The small `*-loop.mp4` files are short muted previews used in the hero; keep their filenames or change the matching paths in `index.html`.
- The Instagram stats in `index.html` reflect the supplied report for 22 Reels. Replace those values and the explanatory text with fresh numbers when you have them. Creators clipped and average retention are not shown because no verified values were supplied.
- The testimonials are explicitly marked as samples. Replace them with approved creator feedback before presenting them as endorsements.
- The contact form opens a prefilled email to `whodefinedit@gmail.com`. It does not store or send form data by itself. To submit directly from the page, connect a form service and replace the mailto handler in `script.js` with its endpoint.
- After deployment, update the Open Graph image URL in `index.html` to the full absolute URL for `assets/defineitt-brand.webp` if your social preview service requires an absolute image URL.

## Publish with GitHub Pages

1. Create a GitHub repository and add the files in this folder. The large originals and extracted HTTrack folder are excluded by `.gitignore`; the compressed versions in `assets/` are the files used by the site.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select the `main` branch and `/ (root)`, then save.
4. GitHub Pages will publish `index.html` and its relative `assets/`, `styles.css`, and `script.js` paths.

No React build is needed for these animations. They use CSS transitions and keyframes plus small JavaScript observers, with reduced-motion support.
