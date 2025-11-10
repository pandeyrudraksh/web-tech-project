// =================== SIDEBAR MENU ===================
const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
  item.addEventListener('click', () => {
    menuItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});

// =================== NOTIFICATIONS POPUP ===================
const notifications = document.querySelector('#notifications');
const notificationsPopup = document.querySelector('.notifications-popup');

if (notifications && notificationsPopup) {
  notifications.addEventListener('click', () => {
    notificationsPopup.classList.toggle('show');
    document.querySelector('.notification-count').style.display = 'none';
  });
}

// =================== MESSAGES ===================
const messagesNotification = document.querySelector('#messages-notifications');
const messages = document.querySelector('.messages');
const message = messages ? messages.querySelectorAll('.message') : [];
const messageSearch = document.querySelector('#message-search');

if (messagesNotification) {
  messagesNotification.addEventListener('click', () => {
    messages.style.boxShadow = '0 0 1rem var(--color-primary)';
    document.querySelector('#messages-notifications .notification-count').style.display = 'none';
    setTimeout(() => {
      messages.style.boxShadow = 'none';
    }, 2000);
  });
}

// SEARCH MESSAGES
if (messageSearch) {
  messageSearch.addEventListener('keyup', () => {
    const val = messageSearch.value.toLowerCase();
    message.forEach(chat => {
      let name = chat.querySelector('h5').textContent.toLowerCase();
      if (name.includes(val)) chat.style.display = 'flex';
      else chat.style.display = 'none';
    });
  });
}

// =================== THEME CUSTOMIZATION ===================
const theme = document.querySelector('#theme');
const themeModal = document.querySelector('.customize-theme');

if (theme && themeModal) {
  theme.addEventListener('click', () => {
    themeModal.style.display = 'grid';
  });

  themeModal.addEventListener('click', e => {
    if (e.target.classList.contains('customize-theme')) {
      themeModal.style.display = 'none';
    }
  });
}

// FONT SIZE
const fontSizes = document.querySelectorAll('.choose-size span');
const root = document.querySelector(':root');

fontSizes.forEach(size => {
  size.addEventListener('click', () => {
    fontSizes.forEach(s => s.classList.remove('active'));
    size.classList.add('active');

    let fontSize;
    if (size.classList.contains('font-size-1')) fontSize = '12px';
    else if (size.classList.contains('font-size-2')) fontSize = '14px';
    else if (size.classList.contains('font-size-3')) fontSize = '16px';
    else if (size.classList.contains('font-size-4')) fontSize = '18px';
    else if (size.classList.contains('font-size-5')) fontSize = '20px';

    document.querySelector('html').style.fontSize = fontSize;
  });
});

// PRIMARY COLORS
const colors = document.querySelectorAll('.choose-color span');
colors.forEach(color => {
  color.addEventListener('click', () => {
    colors.forEach(c => c.classList.remove('active'));
    color.classList.add('active');

    let primary;
    if (color.classList.contains('color-1')) primary = 'hsl(252, 75%, 60%)';
    else if (color.classList.contains('color-2')) primary = 'hsl(52, 75%, 60%)';
    else if (color.classList.contains('color-3')) primary = 'hsl(352, 75%, 60%)';
    else if (color.classList.contains('color-4')) primary = 'hsl(152, 75%, 60%)';
    else if (color.classList.contains('color-5')) primary = 'hsl(202, 75%, 60%)';

    root.style.setProperty('--primary-color-hue', primary);
  });
});

// BACKGROUND
const bgOptions = document.querySelectorAll('.choose-bg div');
bgOptions.forEach(bg => {
  bg.addEventListener('click', () => {
    bgOptions.forEach(b => b.classList.remove('active'));
    bg.classList.add('active');

    if (bg.classList.contains('bg-1')) {
      root.style.setProperty('--light-color-lightness', '95%');
      root.style.setProperty('--white-color-lightness', '100%');
      root.style.setProperty('--dark-color-lightness', '17%');
    } else if (bg.classList.contains('bg-2')) {
      root.style.setProperty('--light-color-lightness', '15%');
      root.style.setProperty('--white-color-lightness', '20%');
      root.style.setProperty('--dark-color-lightness', '95%');
    } else if (bg.classList.contains('bg-3')) {
      root.style.setProperty('--light-color-lightness', '0%');
      root.style.setProperty('--white-color-lightness', '10%');
      root.style.setProperty('--dark-color-lightness', '95%');
    }
  });
});

// =================== POST CREATION & IMAGE PREVIEW ===================
const postForm = document.querySelector('.create-post');
const postText = document.querySelector('#create-post-text');
const postImage = document.querySelector('#post-image');
const imagePreview = document.querySelector('#image-preview');
const postPreviewWrapper = document.querySelector('#post-preview');
const removeImageBtn = document.querySelector('#remove-image');
const feedsContainer = document.querySelector('.feeds');

if (postPreviewWrapper) postPreviewWrapper.style.display = 'none';

if (postImage && imagePreview && postPreviewWrapper) {
  postImage.addEventListener('change', () => {
    const file = postImage.files[0];
    if (!file) {
      imagePreview.src = '';
      postPreviewWrapper.style.display = 'none';
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      imagePreview.src = e.target.result;
      postPreviewWrapper.style.display = 'block';
    };
    reader.readAsDataURL(file);
  });

  removeImageBtn.addEventListener('click', () => {
    imagePreview.src = '';
    postImage.value = '';
    postPreviewWrapper.style.display = 'none';
  });
}

if (postForm && postText && feedsContainer) {
  postForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = postText.value.trim();
    const imgSrc = imagePreview && imagePreview.src ? imagePreview.src : null;

    if (!text && !imgSrc) return;

    const newPost = document.createElement('div');
    newPost.classList.add('feed');
    newPost.innerHTML = `
      <div class="head">
        <div class="user">
          <div class="profile-photo"><img src="./images/profile-1.jpg"></div>
          <div class="info"><h3>You</h3><small>Just now</small></div>
        </div>
        <span class="edit"><i class="uil uil-ellipsis-h"></i></span>
      </div>
      ${imgSrc ? `<div class="photo"><img src="${imgSrc}"></div>` : ''}
      <div class="caption"><p><b>You</b> ${text} <span class="harsh-tag">#trending</span></p></div>
    `;
    feedsContainer.prepend(newPost);

    postText.value = '';
    postImage.value = '';
    imagePreview.src = '';
    postPreviewWrapper.style.display = 'none';
  });
}

// =================== INFINITE SCROLL ===================
let loading = false;

function loadMorePosts() {
  const fakeUsers = [
        { name: "Rohan Mehta", img: "./images/profile-rohan.jpg" },
        { name: "Aisha Kapoor", img: "./images/profile-aisha.jpg" },
        { name: "Neha Sinha", img: "./images/profile-neha.jpg" },
        { name: "Rahul Bhatia", img: "./images/profile-rahul.jpg" },
        { name: "Arjun Verma", img: "./images/profile-arjun.jpg" },
        { name: "Meera Nair", img: "./images/profile-meera.jpg" },
        { name: "Karan Patel", img: "./images/profile-karan.jpg" },
        { name: "Tanya Sharma", img: "./images/profile-tanya.jpg" },
        { name: "Vikram Chauhan", img: "./images/profile-vikram.jpg" },
        { name: "Priya Malhotra", img: "./images/profile-priya.jpg" }
    ];
    const captions = [
        "Enjoying a chill evening ✨",
        "What a view! 🌅",
        "Weekend mode on 😎",
        "Throwback to a good day 📸",
        "Coffee and code ☕💻",
        "Feeling grateful today 💫",
        "Exploring something new 🚀"
    ];
    const randomImages = [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
        "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
        "https://images.unsplash.com/photo-1508672019048-805c876b67e2",
        "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47",
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
        "https://images.unsplash.com/photo-1525182008055-f88b95ff7980",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
    ];

  for (let i = 0; i < 3; i++) {
    const user = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
    const captionText = captions[Math.floor(Math.random() * captions.length)];
    const randomTime = `${Math.floor(Math.random() * 59) + 1} minutes ago`;
    const randomImg = randomImages[Math.floor(Math.random() * randomImages.length)];

    const newFeed = document.createElement('div');
    newFeed.classList.add('feed');
    newFeed.innerHTML = `
      <div class="head">
        <div class="user">
          <div class="profile-photo">
            <img src="${user.img}">
          </div>
          <div class="info">
            <h3>${user.name}</h3>
            <small>${randomTime}</small>
          </div>
        </div>
      </div>
      <div class="photo"><img src="${randomImg}" alt="post"></div>
      <div class="caption"><p><b>${user.name}</b> ${captionText} <span class="harsh-tag">#trending</span></p></div>
    `;
    feedsContainer.appendChild(newFeed);
  }
}

window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !loading) {
    loading = true;
    setTimeout(() => {
      loadMorePosts();
      loading = false;
    }, 800);
  }
});
