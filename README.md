# Dexter Pratt - Personal Website

A personal portfolio website showcasing my work as a bioinformatics researcher, AI scientist, and artist.

## Live Site

Visit: [https://dexterpratt.github.io/dexter](https://dexterpratt.github.io/dexter)

## Structure

```
dexter/
├── index.html              # Main landing page with bio, experience, and projects
├── cv.html                 # Full CV page (renders cv.md)
├── gallery.html            # Art gallery page
├── blog.html               # Blog listing and single post view
├── cv.md                   # CV content in markdown
├── css/
│   └── style.css           # Main stylesheet
├── js/
│   ├── main.js             # JavaScript for all dynamic loading
│   └── marked.min.js       # Markdown parser library
├── content/
│   ├── experiences/        # Detailed experience writeups
│   │   ├── index.json      # Experience metadata
│   │   └── *.md            # Individual experience files
│   ├── blog/               # Blog posts
│   │   ├── index.json      # Post metadata
│   │   └── *.md            # Individual posts
│   └── gallery/            # Gallery metadata
│       └── index.json      # Artwork metadata
└── images/
    └── gallery/            # Art images
```

## Setting Up GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** > **Pages**
3. Under "Source", select **Deploy from a branch**
4. Choose the **main** branch and **/ (root)** folder
5. Click **Save**

Your site will be live at `https://dexterpratt.github.io/dexter` within a few minutes.

## Adding Content

### Adding a Blog Post

1. Create a new markdown file in `content/blog/` (e.g., `2024-12-my-post.md`)
2. Add an entry to `content/blog/index.json`:

```json
{
  "id": "2024-12-my-post",
  "title": "My Post Title",
  "date": "2024-12-15",
  "excerpt": "A brief description shown in the blog list..."
}
```

Blog posts display with CC BY-NC-ND 4.0 license automatically.

### Adding Artwork to Gallery

1. Add your image to `images/gallery/`
2. Add an entry to `content/gallery/index.json`:

```json
{
  "id": "artwork-name",
  "title": "Artwork Title",
  "image": "images/gallery/artwork-name.jpg",
  "description": "Short description shown in lightbox",
  "date": "2024"
}
```

Gallery items display with CC BY-NC-ND 4.0 license in the lightbox.

### Adding Experience Details

1. Create a markdown file in `content/experiences/` matching the `id` in `index.json`
2. The timeline on the homepage will show the summary; clicking opens the full markdown

### Updating the CV

Edit `cv.md` directly. The CV page renders this markdown automatically.

## Local Development

**Important**: You need a local server because the site loads content via fetch requests.

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve
```

Then visit `http://localhost:8000`

## License

- **Blog posts and artwork**: CC BY-NC-ND 4.0 (displayed per item)
- **Code and site structure**: All rights reserved
