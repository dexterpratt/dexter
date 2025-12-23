# Dexter Pratt - Personal Website

A personal portfolio website showcasing my work as a bioinformatics researcher, AI scientist, and artist.

## Live Site

Visit: [https://dexterpratt.github.io/dexter](https://dexterpratt.github.io/dexter)

## Structure

```
dexter/
├── index.html          # Main landing page with bio, experience, and projects
├── gallery.html        # Art gallery page
├── blog.html           # Blog listing page
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   └── main.js         # JavaScript for navigation and lightbox
└── images/             # Place your images here
```

## Setting Up GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** > **Pages**
3. Under "Source", select **Deploy from a branch**
4. Choose the **main** branch and **/ (root)** folder
5. Click **Save**

Your site will be live at `https://yourusername.github.io/dexter` within a few minutes.

## Customization

### Adding Artwork to the Gallery

1. Add your images to the `images/` folder
2. Edit `gallery.html` and replace the placeholder items:

```html
<div class="gallery-item" data-title="Your Title" data-desc="Description">
    <img src="images/your-artwork.jpg" alt="Description">
    <div class="gallery-item-overlay">
        <div class="gallery-item-title">Your Title</div>
        <div class="gallery-item-desc">Description</div>
    </div>
</div>
```

### Adding Blog Posts

1. Create a `posts/` folder
2. Create individual HTML files for each post
3. Update `blog.html` with links to your new posts

### Updating Contact Information

Edit `index.html` and update the contact section with your actual links:
- GitHub profile URL
- LinkedIn profile URL
- Email address

## Local Development

Simply open `index.html` in your browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve
```

Then visit `http://localhost:8000`

## License

All rights reserved.
