const ADMIN_PASSWORD = "Admin#1";
let isAdmin = false;

window.onload = () => {
    refreshFeed();
};

// LOGIN LOGIC
document.getElementById('login-confirm').addEventListener('click', checkPassword);
document.getElementById('admin-pass-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') checkPassword(); });

function checkPassword() {
    if (document.getElementById('admin-pass-input').value === ADMIN_PASSWORD) {
        isAdmin = true;
        document.getElementById('login-modal').classList.add('hidden');
        document.getElementById('admin-tools').classList.remove('hidden'); // Persistent vertical nav
        refreshFeed(); // Shows delete buttons on permanent data
        document.getElementById('admin-pass-input').value = '';
    } else {
        alert("ACCESS DENIED");
    }
}

// ADMIN TOOL NAVIGATION
document.getElementById('nav-upload-btn').addEventListener('click', () => {
    document.getElementById('admin-panel').classList.remove('hidden');
});

document.getElementById('nav-arrange-btn').addEventListener('click', () => {
    alert("ARRANGE: Open data.js on GitHub and reorder the blocks inside PERMANENT_POSTS. The first item in the code is the top-left post.");
});

// FEED RENDERING
function refreshFeed() {
    const grid = document.getElementById('feed-grid');
    grid.innerHTML = ''; 
    if (typeof PERMANENT_POSTS !== 'undefined') {
        PERMANENT_POSTS.forEach((p) => { renderPost(p.title, p.text, p.audio, p.image); });
    }
}

function renderPost(title, text, audio, image) {
    const grid = document.getElementById('feed-grid');
    const post = document.createElement('div');
    post.className = 'feed-item';
    
    let media = '';
    // Paths strictly for Releases/ and Posters/
    if (image) media += `<img src="${image}" onerror="this.style.display='none'">`;
    if (audio) media += `<audio controls controlsList="nodownload noplaybackrate" src="${audio}" oncontextmenu="return false;"></audio>`;

    const deleteBtn = isAdmin ? `<button style="position:absolute;top:1rem;right:1rem;color:red;background:none;border:none;cursor:pointer;font-weight:900;font-size:1rem;" onclick="this.parentElement.remove()">DELETE</button>` : '';

    post.innerHTML = `${deleteBtn}<h3>${title}</h3><p>${text}</p>${media}`;
    grid.appendChild(post);
}

// MULTI-POST UPLOAD
document.getElementById('submit-post').addEventListener('click', () => {
    const title = document.getElementById('post-title').value;
    const text = document.getElementById('post-text').value;
    const audioF = document.getElementById('post-audio').files[0];
    const imageF = document.getElementById('post-image').files[0];

    const audioPath = audioF ? 'Releases/' + audioF.name : "";
    const imagePath = imageF ? 'Posters/' + imageF.name : "";

    // Instant local preview
    renderPost(title, text, audioF ? URL.createObjectURL(audioF) : "", imageF ? URL.createObjectURL(imageF) : "");

    const snippet = `{ title: "${title}", text: "${text.replace(/\n/g, "\\n")}", audio: "${audioPath}", image: "${imagePath}" },`;
    document.getElementById('copy-area').value = snippet;
});

// MODAL TRIGGERS
document.getElementById('admin-login-btn').addEventListener('click', () => {
    if(!isAdmin) document.getElementById('login-modal').classList.remove('hidden');
});
document.getElementById('login-close').addEventListener('click', () => document.getElementById('login-modal').classList.add('hidden'));
document.getElementById('admin-close').addEventListener('click', () => document.getElementById('admin-panel').classList.add('hidden'));
document.getElementById('logout-btn').addEventListener('click', () => location.reload());
document.getElementById('copy-btn').addEventListener('click', () => {
    const ca = document.getElementById('copy-area'); ca.select(); document.execCommand('copy');
    alert("Snippet Copied!");
});