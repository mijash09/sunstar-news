/**
 * Sunstar News Main Application Script
 * Dynamic Rendering & Interactivity Engine - OnlineKhabar Integration
 */

document.addEventListener('DOMContentLoaded', () => {
    processLogoBackground();
    initApp();
});

/**
 * Dynamically converts logo with white background into a crisp transparent PNG
 */
function processLogoBackground() {
    const logoImgs = document.querySelectorAll('.brand-logo-img, .footer-logo');
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Loop through pixels and make white/near-white pixels transparent
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            if (r > 225 && g > 225 && b > 225) {
                data[i + 3] = 0; // Alpha = 0 (Transparent)
            }
        }

        ctx.putImageData(imgData, 0, 0);
        const transparentDataUrl = canvas.toDataURL('image/png');

        logoImgs.forEach(el => {
            el.src = transparentDataUrl;
            el.style.mixBlendMode = 'normal';
            el.style.filter = 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))';
        });
    };
    img.src = 'assets/sunstar-logo.jpg';
}

function initApp() {
    // 1. Render Top Header & Ticker Information
    renderTicker();
    renderWeatherAndDate();
    renderStockBar();

    // 2. Render News Sections
    renderHeroSection();
    renderTimelineFeed();
    renderPoliticsSection();
    renderBusinessSection();
    renderOpinionSection();
    renderPradeshSection('gandaki'); // Default province
    renderSportsAndEntertainment();
    renderWorldNews();
    renderVideoGallery();

    // 3. Render Interactive Poll
    renderPollWidget();

    // 4. Setup Event Listeners & Modals
    setupEventListeners();
    setupThemeToggle();
}

/* -------------------------------------------------------------------------- */
/* RENDER FUNCTIONS                                                           */
/* -------------------------------------------------------------------------- */

function renderTicker() {
    const tickerContainer = document.getElementById('tickerText');
    if (!tickerContainer) return;

    const tickerItems = SUNSTAR_DATA.breakingNews;
    tickerContainer.innerHTML = tickerItems.map(item => `<span>🔥 ${item}</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`).join('');
}

function renderWeatherAndDate() {
    const weatherContainer = document.getElementById('weatherWidget');
    if (weatherContainer) {
        weatherContainer.innerHTML = `
            <span>📍 ${SUNSTAR_DATA.weather.city}</span>
            <span>🌡️ ${SUNSTAR_DATA.weather.temp}</span>
            <span>🍃 AQI: ${SUNSTAR_DATA.weather.aqi}</span>
        `;
    }

    const dateContainer = document.getElementById('liveDate');
    if (dateContainer) {
        dateContainer.innerHTML = `📅 १५ भाद्र २०८३, सोमबार (31 Aug 2026)`;
    }
}

function renderStockBar() {
    const nepseContainer = document.getElementById('nepseBar');
    if (!nepseContainer) return;

    const data = SUNSTAR_DATA.nepseTicker;
    nepseContainer.innerHTML = `
        <div class="nepse-item">
            <span class="nepse-label">नेप्से सूचक:</span>
            <span class="nepse-val val-up">${data.index} (${data.change} | ${data.percent})</span>
        </div>
        <div class="nepse-item">
            <span class="nepse-label">कुल कारोबार:</span>
            <span class="nepse-val">${data.turnover}</span>
        </div>
        <div class="nepse-item">
            <span class="nepse-label">सुन प्रति तोल:</span>
            <span class="nepse-val">${data.goldPrice}</span>
        </div>
        <div class="nepse-item">
            <span class="nepse-label">डलर १ =</span>
            <span class="nepse-val">${data.forexUSD}</span>
        </div>
    `;
}

function renderHeroSection() {
    const heroMainContainer = document.getElementById('heroMainArticle');
    const heroSecondaryContainer = document.getElementById('heroSecondaryArticles');
    
    if (!heroMainContainer || !heroSecondaryContainer) return;

    // Main Lead
    const lead = SUNSTAR_DATA.featuredLead;
    heroMainContainer.innerHTML = `
        <div class="hero-card" onclick="openArticleModal('${lead.id}')">
            <div class="hero-img-wrapper">
                <span class="category-tag">${lead.category}</span>
                <span class="source-badge">🔴 ${lead.source || 'OnlineKhabar.com'}</span>
                <img src="${lead.image}" alt="${lead.title}" loading="lazy">
            </div>
            <div class="hero-card-body">
                <h1 class="hero-title">${lead.title}</h1>
                <p class="hero-summary">${lead.summary}</p>
                <div class="article-meta">
                    <div class="author-info">
                        <img src="${lead.authorImage}" class="author-avatar" alt="${lead.author}">
                        <span>${lead.author}</span>
                    </div>
                    <span>⏱️ ${lead.time}</span>
                    <span>👁️ ${lead.views}</span>
                </div>
            </div>
        </div>
    `;

    // Secondary Leads
    const secondaryLeads = SUNSTAR_DATA.topSecondaryLeads;
    heroSecondaryContainer.innerHTML = secondaryLeads.map(item => `
        <div class="sub-lead-card" onclick="openArticleModal('${item.id}')">
            <div class="sub-lead-thumb">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
            </div>
            <div>
                <h2 class="sub-lead-title">${item.title}</h2>
                <div class="sub-lead-meta">
                    <span>${item.category}</span> • <span class="source-pill">${item.source || 'अनलाइनखबर'}</span> • <span>${item.time}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderTimelineFeed() {
    const timelineContainer = document.getElementById('latestTimelineList');
    if (!timelineContainer) return;

    const items = SUNSTAR_DATA.latestTimeline;
    timelineContainer.innerHTML = items.map(item => `
        <li class="timeline-item" onclick="openArticleModal('${item.id}')">
            <div class="timeline-dot"></div>
            <div class="timeline-time">${item.time} • <span style="color:var(--brand-orange); font-weight:600;">${item.source || 'अनलाइनखबर'}</span></div>
            <div class="timeline-title">${item.title}</div>
        </li>
    `).join('');
}

function renderPoliticsSection() {
    const container = document.getElementById('politicsGrid');
    if (!container) return;

    const articles = SUNSTAR_DATA.politicsNews;
    container.innerHTML = articles.map(item => `
        <div class="standard-news-card" onclick="openArticleModal('${item.id}')">
            <div class="card-thumb">
                <span class="source-badge">🔴 ${item.source || 'OnlineKhabar'}</span>
                <img src="${item.image}" alt="${item.title}" loading="lazy">
            </div>
            <div class="card-body">
                <div class="category-tag" style="position:static; display:inline-block; margin-bottom:8px;">${item.category}</div>
                <h3 class="card-title">${item.title}</h3>
                <p class="card-snippet">${item.summary}</p>
                <div class="article-meta" style="margin-top:auto;">
                    <span>⏱️ ${item.time}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderBusinessSection() {
    const container = document.getElementById('businessGrid');
    if (!container) return;

    const articles = SUNSTAR_DATA.businessNews;
    container.innerHTML = articles.map(item => `
        <div class="standard-news-card" onclick="openArticleModal('${item.id}')">
            <div class="card-thumb">
                <span class="source-badge">🔴 ${item.source || 'OnlineKhabar'}</span>
                <img src="${item.image}" alt="${item.title}" loading="lazy">
            </div>
            <div class="card-body">
                <div class="category-tag" style="position:static; display:inline-block; margin-bottom:8px;">${item.category}</div>
                <h3 class="card-title">${item.title}</h3>
                <p class="card-snippet">${item.summary}</p>
                <div class="article-meta" style="margin-top:auto;">
                    <span>⏱️ ${item.time}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderOpinionSection() {
    const container = document.getElementById('opinionGrid');
    if (!container) return;

    const opinions = SUNSTAR_DATA.opinions;
    container.innerHTML = opinions.map(item => `
        <div class="opinion-card" onclick="openArticleModal('${item.id}')">
            <div class="author-headshot-box">
                <img src="${item.avatar}" alt="${item.author}">
                <div class="author-details">
                    <span class="author-name">${item.author}</span>
                    <span class="author-role">${item.role}</span>
                </div>
            </div>
            <h3 class="opinion-title">"${item.title}"</h3>
            <p class="card-snippet">${item.summary}</p>
            <div class="article-meta" style="margin-top:auto;">
                <span>🕒 ${item.time}</span>
            </div>
        </div>
    `).join('');
}

function renderPradeshSection(pradeshKey) {
    const container = document.getElementById('pradeshContainer');
    if (!container) return;

    const items = SUNSTAR_DATA.pradeshNews[pradeshKey] || [];
    container.innerHTML = items.map(item => `
        <div class="pradesh-item-card" onclick="openArticleModal('${item.id}')">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="pradesh-badge">📍 ${item.location}</span>
                <span style="font-size:0.75rem; color:var(--brand-orange); font-weight:600;">${item.source || 'अनलाइनखबर'}</span>
            </div>
            <h3 class="card-title" style="font-size:1.05rem; margin-top:6px;">${item.title}</h3>
            <div class="article-meta" style="border:none; padding:0; margin-top:10px;">
                <span>⏱️ ${item.time}</span>
            </div>
        </div>
    `).join('');
}

function switchPradeshTab(pradeshKey, btnElement) {
    document.querySelectorAll('.pradesh-tab-btn').forEach(btn => btn.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');
    renderPradeshSection(pradeshKey);
}

function renderSportsAndEntertainment() {
    const sportsContainer = document.getElementById('sportsGrid');
    if (sportsContainer) {
        sportsContainer.innerHTML = SUNSTAR_DATA.sportsNews.map(item => `
            <div class="standard-news-card" onclick="openArticleModal('${item.id}')">
                <div class="card-thumb">
                    <span class="source-badge">🔴 ${item.source || 'OnlineKhabar'}</span>
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                </div>
                <div class="card-body">
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-snippet">${item.summary}</p>
                </div>
            </div>
        `).join('');
    }

    const entContainer = document.getElementById('entertainmentGrid');
    if (entContainer) {
        entContainer.innerHTML = SUNSTAR_DATA.entertainmentNews.map(item => `
            <div class="standard-news-card" onclick="openArticleModal('${item.id}')">
                <div class="card-thumb">
                    <span class="source-badge">🔴 ${item.source || 'OnlineKhabar'}</span>
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                </div>
                <div class="card-body">
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-snippet">${item.summary}</p>
                </div>
            </div>
        `).join('');
    }
}

function renderWorldNews() {
    const container = document.getElementById('worldNewsGrid');
    if (!container) return;

    container.innerHTML = SUNSTAR_DATA.worldNews.map(item => `
        <div class="standard-news-card" onclick="openArticleModal('${item.id}')">
            <div class="card-thumb">
                <span class="source-badge">🔴 ${item.source || 'OnlineKhabar'}</span>
                <img src="${item.image}" alt="${item.title}" loading="lazy">
            </div>
            <div class="card-body">
                <h3 class="card-title">${item.title}</h3>
                <p class="card-snippet">${item.summary}</p>
            </div>
        </div>
    `).join('');
}

function renderVideoGallery() {
    const container = document.getElementById('videoGrid');
    if (!container) return;

    const videos = SUNSTAR_DATA.videoNews;
    container.innerHTML = videos.map(item => `
        <div class="video-card" onclick="openVideoPlayer('${item.title}')">
            <div class="video-thumb">
                <img src="${item.thumbnail}" alt="${item.title}">
                <div class="play-icon-overlay">▶</div>
                <span class="video-duration">${item.duration}</span>
                <span class="source-badge" style="left:10px; right:auto;">🔴 ${item.source || 'OnlineKhabar'}</span>
            </div>
            <h3 class="video-title">${item.title}</h3>
        </div>
    `).join('');
}

/* -------------------------------------------------------------------------- */
/* INTERACTIVE POLL                                                           */
/* -------------------------------------------------------------------------- */

let hasVoted = false;

function renderPollWidget() {
    const container = document.getElementById('pollWidget');
    if (!container) return;

    const poll = SUNSTAR_DATA.poll;

    container.innerHTML = `
        <div class="poll-question">${poll.question}</div>
        <div class="poll-options" id="pollOptions">
            ${poll.options.map(opt => `
                <button class="poll-option-btn" onclick="submitPollVote('${opt.id}')">
                    <span>${opt.label}</span>
                    <span class="poll-percent-label" style="display:none; font-weight:bold; color:var(--brand-orange);">${opt.percent}%</span>
                </button>
                <div class="poll-bar-container" style="display:none;">
                    <div class="poll-bar-fill" id="bar-${opt.id}" style="width:0%"></div>
                </div>
            `).join('')}
        </div>
        <div style="font-size:0.85rem; color:var(--text-muted); text-align:right;" id="pollTotalCount">
            कुल मत: ${poll.totalVotes.toLocaleString('ne-NP')}
        </div>
    `;
}

function submitPollVote(optId) {
    if (hasVoted) return;
    hasVoted = true;

    const poll = SUNSTAR_DATA.poll;
    poll.totalVotes += 1;

    // Show percentage labels and animate progress bars
    document.querySelectorAll('.poll-percent-label').forEach(el => el.style.display = 'inline-block');
    document.querySelectorAll('.poll-bar-container').forEach(el => el.style.display = 'block');

    poll.options.forEach(opt => {
        if (opt.id === optId) opt.count += 1;
        const calcPercent = Math.round((opt.count / poll.totalVotes) * 100);
        const barElement = document.getElementById(`bar-${opt.id}`);
        if (barElement) {
            setTimeout(() => {
                barElement.style.width = `${calcPercent}%`;
            }, 100);
        }
    });

    const totalEl = document.getElementById('pollTotalCount');
    if (totalEl) totalEl.innerText = `तपाईंको मत दर्ता भयो! कुल मत: ${poll.totalVotes.toLocaleString('ne-NP')}`;
}

/* -------------------------------------------------------------------------- */
/* MODALS & READERS                                                           */
/* -------------------------------------------------------------------------- */

let currentFontSize = 1.15; // rem

function openArticleModal(articleId) {
    // Find article in datasets
    const allArticles = [
        SUNSTAR_DATA.featuredLead,
        ...SUNSTAR_DATA.topSecondaryLeads,
        ...SUNSTAR_DATA.politicsNews,
        ...SUNSTAR_DATA.businessNews,
        ...SUNSTAR_DATA.opinions,
        ...SUNSTAR_DATA.sportsNews,
        ...SUNSTAR_DATA.entertainmentNews,
        ...SUNSTAR_DATA.worldNews
    ];

    let found = allArticles.find(a => a.id === articleId);

    // If not found in primary arrays, construct default story object
    if (!found) {
        found = {
            title: "समाचार सम्बन्धी विस्तृत जानकारी",
            category: "समाचार",
            author: "अनलाइनखबर समाचार डेस्क",
            authorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
            time: "भर्खरै",
            date: "१५ भाद्र २०८३",
            source: "OnlineKhabar.com",
            image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=1200",
            summary: "घटनाक्रमको थप विवरण प्राप्त हुने क्रममा छ। अनलाइनखबर र सनस्टार न्युज अपडेटमा रहनुहोला।",
            content: `<p>यस समाचारबारे थप विवरण र प्रत्यक्ष अपडेटहरू अनलाइनखबर र सनस्टार न्युजको अनलाइन प्लेटफर्ममार्फत नियमित सम्प्रेषण भइरहेको छ।</p><p>स्थानीय प्रतिनिधि तथा सरोकारवाला निकायहरूसँग समन्वय गरी सत्य, तथ्य र निष्पक्ष समाचार प्रस्तुत गर्न हाम्रो टोली निरन्तर क्रियाशील छ।</p>`
        };
    }

    const modal = document.getElementById('articleModal');
    const modalBody = document.getElementById('articleModalBody');

    modalBody.innerHTML = `
        <div class="reader-header">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div class="reader-category">📌 ${found.category || 'समाचार'}</div>
                <div class="source-credit-banner">
                    📰 स्रोत: <span style="color:var(--brand-orange); font-weight:700;">${found.source || 'SunstarNews.com'}</span>
                </div>
            </div>
            <h1 class="reader-title">${found.title}</h1>
            <div class="article-meta">
                <div class="author-info">
                    <img src="${found.authorImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}" class="author-avatar" alt="Author">
                    <span>${found.author || 'अनलाइनखबर डेस्क'}</span>
                </div>
                <span>📅 ${found.date || '१५ भाद्र २०८३'}</span>
                <span>⏱️ ${found.time || 'भर्खरै'}</span>
            </div>
            <div class="reader-toolbar">
                <button class="audio-player-btn" onclick="toggleAudioReader(this)">
                    <span>🔊 समाचार सुन्नुहोस् (Audio)</span>
                </button>
                <div class="font-controls">
                    <span>अक्षर आकार:</span>
                    <button class="font-btn" onclick="changeFontSize(-0.1)">A-</button>
                    <button class="font-btn" onclick="changeFontSize(0.1)">A+</button>
                </div>
            </div>
        </div>
        <div style="padding: 0 30px; margin-top:20px;">
            <img src="${found.image || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=1200'}" style="width:100%; max-height:450px; object-fit:cover; border-radius:var(--radius-md);" alt="${found.title}">
            ${found.caption ? `<div style="font-size:0.88rem; color:var(--text-muted); font-style:italic; margin-top:6px; text-align:center;">${found.caption}</div>` : ''}
        </div>
        <div class="reader-body" id="readerContentBody" style="font-size:${currentFontSize}rem;">
            ${found.content || `<p>${found.summary}</p>`}
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeArticleModal() {
    const modal = document.getElementById('articleModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function changeFontSize(delta) {
    currentFontSize = Math.min(Math.max(0.9, currentFontSize + delta), 1.6);
    const contentBody = document.getElementById('readerContentBody');
    if (contentBody) contentBody.style.fontSize = `${currentFontSize}rem`;
}

let isSpeaking = false;
function toggleAudioReader(btnElement) {
    if ('speechSynthesis' in window) {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            isSpeaking = false;
            btnElement.innerHTML = `<span>🔊 समाचार सुन्नुहोस् (Audio)</span>`;
        } else {
            const contentText = document.getElementById('readerContentBody').innerText;
            const utterance = new SpeechSynthesisUtterance(contentText);
            utterance.lang = 'ne-NP'; // Nepali
            utterance.rate = 0.95;
            
            utterance.onend = () => {
                isSpeaking = false;
                btnElement.innerHTML = `<span>🔊 समाचार सुन्नुहोस् (Audio)</span>`;
            };

            window.speechSynthesis.speak(utterance);
            isSpeaking = true;
            btnElement.innerHTML = `<span>⏸️ वाचन रोक्नुहोस्</span>`;
        }
    } else {
        alert("तपाईंको ब्राउजरमा अडियो वाचन सुविधा उपलब्ध छैन।");
    }
}

function openVideoPlayer(videoTitle) {
    alert(`▶ '${videoTitle}' भिडियो प्लेयर सुरु हुँदैछ...`);
}

/* -------------------------------------------------------------------------- */
/* SEARCH & THEME SETUP                                                        */
/* -------------------------------------------------------------------------- */

function setupEventListeners() {
    // Mobile Drawer Navigation
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navList = document.getElementById('navList');

    if (mobileBtn && navList) {
        mobileBtn.addEventListener('click', () => {
            navList.classList.toggle('mobile-open');
        });
    }

    // Modal Close Backdrop Click
    const modal = document.getElementById('articleModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeArticleModal();
        });
    }
}

function setupThemeToggle() {
    const themeBtn = document.getElementById('themeToggleBtn');
    const savedTheme = localStorage.getItem('sunstar_theme') || 'light';

    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('sunstar_theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
}

function updateThemeIcon(theme) {
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
        themeBtn.innerHTML = theme === 'dark' ? '☀️ दिन' : '🌙 रात';
    }
}

function triggerSearchModal() {
    const query = prompt("अनलाइनखबर/सनस्टार समाचार खोज्नुहोस् (Keyword enter गर्नुहोस्):");
    if (query && query.trim() !== '') {
        const term = query.trim().toLowerCase();
        const allArticles = [
            SUNSTAR_DATA.featuredLead,
            ...SUNSTAR_DATA.topSecondaryLeads,
            ...SUNSTAR_DATA.politicsNews,
            ...SUNSTAR_DATA.businessNews
        ];
        const filtered = allArticles.filter(a => a.title.toLowerCase().includes(term) || a.summary.toLowerCase().includes(term));

        if (filtered.length > 0) {
            openArticleModal(filtered[0].id);
        } else {
            alert(`'${query}' सँग सम्बन्धित कुनै समाचार फेला परेन।`);
        }
    }
}
