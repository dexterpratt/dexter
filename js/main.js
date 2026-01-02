// Utility: Fetch and parse markdown
async function loadMarkdown(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Failed to load ${path}`);
        const text = await response.text();
        return marked.parse(text);
    } catch (error) {
        console.error(error);
        return `<p class="error">Failed to load content.</p>`;
    }
}

// Utility: Fetch JSON
async function loadJSON(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Failed to load ${path}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

// License text for blog and gallery
const LICENSE_HTML = `
<div class="license">
    <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noopener">
        CC BY-NC-ND 4.0
    </a> - You may share with attribution for non-commercial purposes. No derivatives.
</div>`;

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Smooth scroll for anchor links (with delay to handle dynamic content)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                // Small delay to ensure dynamic content has loaded
                setTimeout(() => {
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 100);
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            navbar.style.background = window.scrollY > 50
                ? 'rgba(10, 10, 10, 0.98)'
                : 'rgba(10, 10, 10, 0.9)';
        });
    }

    // Initialize page-specific features
    initTimeline();
    initCV();
    initGallery();
    initBlog();
});

// ============ TIMELINE / EXPERIENCE ============
async function initTimeline() {
    const timeline = document.getElementById('timeline');
    if (!timeline) return;

    const experiences = await loadJSON('content/experiences/index.json');
    if (!experiences) {
        timeline.innerHTML = '<p class="error">Failed to load experiences.</p>';
        return;
    }

    timeline.innerHTML = experiences.map(exp => `
        <div class="timeline-item" data-experience="${exp.id}">
            <div class="timeline-date">${exp.dates}</div>
            <div class="timeline-content">
                <h3>${exp.title}</h3>
                <p class="timeline-org">${exp.org}</p>
                <p>${exp.summary}</p>
            </div>
        </div>
    `).join('');

    // Add click handlers for modal
    const modal = document.getElementById('experience-modal');
    const modalBody = document.getElementById('experience-modal-body');
    const modalClose = modal?.querySelector('.modal-close');

    timeline.querySelectorAll('.timeline-item').forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', async () => {
            const expId = item.dataset.experience;
            const exp = experiences.find(e => e.id === expId);

            // Try to load detailed markdown, fall back to summary
            let content = await loadMarkdown(`content/experiences/${expId}.md`);
            if (content.includes('Failed to load')) {
                content = `
                    <h2>${exp.title}</h2>
                    <p class="modal-org">${exp.org} | ${exp.dates}</p>
                    <p>${exp.summary}</p>
                    <p class="modal-note"><em>Detailed description coming soon.</em></p>
                `;
            }

            modalBody.innerHTML = content;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Modal close handlers
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// ============ CV PAGE ============
async function initCV() {
    const cvContent = document.getElementById('cv-content');
    if (!cvContent) return;

    const html = await loadMarkdown('cv.md');
    cvContent.innerHTML = html;
}

// ============ GALLERY ============
async function initGallery() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;

    const items = await loadJSON('content/gallery/index.json');
    if (!items) {
        galleryGrid.innerHTML = '<p class="error">Failed to load gallery.</p>';
        return;
    }

    const escapeAttr = str => str.replace(/"/g, '&quot;');

    galleryGrid.innerHTML = items.map((item, index) => `
        <div class="gallery-item" data-index="${index}" data-id="${escapeAttr(item.id)}" data-title="${escapeAttr(item.title)}" data-desc="${escapeAttr(item.description)}">
            <img src="${item.image}" alt="${escapeAttr(item.title)}" onerror="this.parentElement.classList.add('placeholder'); this.style.display='none'; this.parentElement.innerHTML='<span>+</span>';">
            <div class="gallery-item-overlay">
                <div class="gallery-item-title">${item.title}</div>
                <div class="gallery-item-desc">${item.description}</div>
            </div>
        </div>
    `).join('');

    // Enhanced lightbox with license and navigation
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    let currentIndex = 0;

    // Add caption container if not exists
    let caption = lightbox.querySelector('.lightbox-caption');
    if (!caption) {
        caption = document.createElement('div');
        caption.className = 'lightbox-caption';
        lightbox.appendChild(caption);
    }

    function showImage(index) {
        // Wrap around
        if (index < 0) index = items.length - 1;
        if (index >= items.length) index = 0;
        currentIndex = index;

        const item = items[index];
        lightboxImg.src = item.image;
        lightboxImg.alt = item.title;
        caption.innerHTML = `
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            ${LICENSE_HTML}
        `;
    }

    galleryGrid.querySelectorAll('.gallery-item:not(.placeholder)').forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img && img.style.display !== 'none') {
                showImage(parseInt(this.dataset.index));
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Navigation buttons
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showImage(currentIndex - 1);
        });
    }
    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showImage(currentIndex + 1);
        });
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
}

// ============ BLOG ============
async function initBlog() {
    const blogList = document.querySelector('.blog-list');
    if (!blogList) return;

    // Check if viewing single post
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('post');

    if (postId) {
        // Single post view
        await loadSinglePost(blogList, postId);
    } else {
        // List view
        await loadBlogList(blogList);
    }
}

async function loadBlogList(container) {
    const posts = await loadJSON('content/blog/index.json');
    if (!posts) {
        container.innerHTML = '<p class="error">Failed to load blog posts.</p>';
        return;
    }

    if (posts.length === 0) {
        container.innerHTML = '<p>No blog posts yet. Check back soon!</p>';
        return;
    }

    container.innerHTML = posts.map(post => `
        <article class="blog-post">
            <div class="blog-post-date">${formatDate(post.date)}</div>
            <h2><a href="blog.html?post=${post.id}">${post.title}</a></h2>
            <p>${post.excerpt}</p>
            <a href="blog.html?post=${post.id}" class="read-more">Read more &rarr;</a>
        </article>
    `).join('');
}

async function loadSinglePost(container, postId) {
    const posts = await loadJSON('content/blog/index.json');
    const post = posts?.find(p => p.id === postId);

    if (!post) {
        container.innerHTML = `
            <p class="error">Post not found.</p>
            <p><a href="blog.html">&larr; Back to all posts</a></p>
        `;
        return;
    }

    const content = await loadMarkdown(`content/blog/${postId}.md`);

    container.innerHTML = `
        <article class="blog-post blog-post-full">
            <div class="blog-post-date">${formatDate(post.date)}</div>
            <div class="blog-post-content">${content}</div>
            ${LICENSE_HTML}
            <p class="blog-back"><a href="blog.html">&larr; Back to all posts</a></p>
        </article>
    `;

    // Update page title
    document.title = `${post.title} | Dexter Pratt`;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
