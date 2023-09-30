const bodyElements = {
  sideBarBtn: document.querySelector(".sidebar_button"),
  contentSideBar: document.querySelector(".content_sidebar"),
  searchBar: document.querySelector("#keyword_search"),
  searchError: document.querySelector(".search_error"),
  categoryCards: document.querySelector("#search_image_box"),
  categoryCards1: document.querySelector("#category_cards"),
  category_image_cards: document.querySelector('#category_image_cards'),
  previewModalWrap: document.querySelector('.preview_modal_wrap'),
  previewModal: document.querySelector('.preview_modal'),
  previewImage: document.querySelector('.preview_image'),
  previewProfile: document.querySelector('.preview_profile'),
  previewAuthor: document.querySelector('.preview_author_name'),
  closeModal: document.querySelector('.preview_close_btn'),
  sidebarLoader: document.querySelector('.sidebar_loader'),
  clientId: "9dXl8d3QJerO9NtECI5wA6cYkw3wgtHk2fDFzSiUjGI",
  queryApiUrl: `https://api.unsplash.com/search/photos/`,
  topicsApiUrl: `https://api.unsplash.com/topics/`,
};

// event listeners
window.addEventListener("scroll", scrollFromTop)
bodyElements.sideBarBtn.addEventListener("click", changeToggleLine);
bodyElements.searchBar.addEventListener("keyup", function (button) {
  checkKeyPress(button);
});
bodyElements.closeModal.addEventListener("click", closePreviewModal)
window.addEventListener("DOMContentLoaded", function () {
  clearInput()
  // getCategories()
  renderCategories()
});


function changeToggleLine() {
    if (bodyElements.sideBarBtn.classList.contains("active")) {
      bodyElements.sideBarBtn.classList.remove("active");
      bodyElements.contentSideBar.classList.remove("active");
    } else {
      bodyElements.sideBarBtn.classList.add("active");
      bodyElements.contentSideBar.classList.add("active");
    }
}
function clearInput() {
    bodyElements.searchBar.value = "";
}
async function checkKeyPress(button) {
  if (button.keyCode === 13) {
    checkEmpty();
    await renderWallpapers();
    downloadImage()
    previewImage()
  }
}
function checkEmpty() {
    if (bodyElements.searchBar.value == "") {
      bodyElements.searchError.classList.add("show");
    } else {
      bodyElements.searchError.classList.remove("show");
    }
}

// search
async function getQueryWallpapers() {
  let searchVal = bodyElements.searchBar.value;
  console.log(searchVal)
  try {
    let wallpaperResponse = await fetch(
      `${bodyElements.queryApiUrl}?query=${searchVal}&client_id=${bodyElements.clientId}`);
    return await wallpaperResponse.json();
  } catch (error) {
    console.log(error);
  }
}
async function renderWallpapers() {
  let wallpapers = await getQueryWallpapers();
  console.log(wallpapers)
  getAppend(wallpapers);
}
function createImageCards(wallpaper) {
  let wallPaperCard = `<div class="query_image_card">
        <img src="${wallpaper.urls.small}" class="query_image"></img>
        <div class="image-overlay"></div>
        <div class="photo_details">
            <div class="owner_image">
                <img src="${wallpaper.user.profile_image.small}" alt="" class="author_profile">
            </div>
            <div class="owner_name">
                <p class="photo_owner">
                    Photo by <span class="author_name">${wallpaper.user.name}</span>
                </p>
                <p class="credit_owner">on Unsplash</p>
            </div>
        </div>
        <div class="likes_number">
            <span class="likes_icon">&#9825;</span>
            <p class="number">${wallpaper.user.total_likes}</p>
        </div>
        <div class="image_preview_download">
            <p class="image_btn preview_btn" data-url="${wallpaper.urls.full}"  data-profile="${wallpaper.user.profile_image.small}" data-name="${wallpaper.user.name}">&#43; preview</p>
            <button data-url="${wallpaper.urls.full}" class="image_btn download_btn" target="_blank">&darr; download</button>
        </div>
    </div>`;
  return wallPaperCard;
}
function getAppend(wallpapers) {
  let cards = "";
  wallpapers.results.forEach((wallpaper) => {
    // console.log(wallpaper)
    let finalWallpaperCard = createImageCards(wallpaper);
    cards += finalWallpaperCard;
  });
  bodyElements.categoryCards.innerHTML = cards;
}
function previewImage(){
    let previewBtn = document.querySelectorAll(".preview_btn")
    previewBtn.forEach((preview) => {
        preview.addEventListener("click", function (action){
            showModal()
            previewDetails(action)
        })
    })
}
function showModal(){
    bodyElements.previewModalWrap.classList.add("active")
    setTimeout(() => {
        bodyElements.previewModal.classList.add("active")
    }, 300);
}
function previewDetails(action){
    let url = action.target.dataset.url;
    let currentPreviewProfile = action.target.dataset.profile
    let currentPreviewName = action.target.dataset.name
    
    bodyElements.previewImage.src = url
    bodyElements.previewProfile.src = currentPreviewProfile
    bodyElements.previewAuthor.innerText = currentPreviewName
}
function downloadImage(){
    let downloadBtn = document.querySelectorAll(".download_btn");
    downloadBtn.forEach((btn) => {
      btn.addEventListener("click", function (action) {
        let url = action.target.dataset.url;
        fetchFile(url);
      });
    });
}
function closePreviewModal(){
    bodyElements.previewModal.classList.remove("active")
    setTimeout(() => {
        bodyElements.previewModalWrap.classList.remove('active')
        bodyElements.previewImage.src = ''
    }, 1200);
}
function fetchFile(url) {
  fetch(url)
    .then((image) => image.blob())
    // blob size and file type
    .then((finalImage) => {
    // url to download image in code format
      let tempUrl = URL.createObjectURL(finalImage);
      console.log(tempUrl, "temp url");

      const aTag = document.createElement("a");
      aTag.href = tempUrl;
      aTag.download = url.replace(/^.*[\\\/]/, "");
      document.body.appendChild(aTag);
      aTag.click();
      document.body.removeChild(aTag);

      URL.revokeObjectURL(tempUrl);
    })
    .catch(() => {
      alert("Failed to download file!");
    });
}
function previewProfileDetails(action){

    let previewClick = action.target
    console.log(previewClick);
    bodyElements.previewProfile.src = `${wallpaper.user.profile_image.small}`
}
function scrollFromTop(){
    let scrollFromTop = Math.round(window.scrollY)
    let scrollHeight = document.documentElement.scrollHeight - 100
    let clientHeight = document.documentElement.clientHeight
    console.log(clientHeight, 'viewport height')
    console.log(scrollHeight, 'client height');
    console.log(Math.floor(scrollFromTop), 'from top')
    if(scrollFromTop + clientHeight == scrollHeight){
        bodyElements.sidebarLoader.style.display = 'flex';
    }
    else{
        bodyElements.sidebarLoader.style.display = 'none';
    }
}

// categories
async function getCategories(){
    try {
        let categoryResponse = await fetch(`${bodyElements.topicsApiUrl}?page=1&per_page=20&client_id=${bodyElements.clientId}`);
        let categoryResp = await categoryResponse.json();
        return categoryResp
      }
      catch (error) {
        console.log(error);
      }
}
function createcategoryCard(category){
  let categoryCard = `
  <div class="category_card" data-id="${category.id}">
      <div class="category_overlay"></div>
      <img src="${category.cover_photo.urls.regular}" alt="" class="category_cover">
      <p class="category_name">${category.title}</p>
  </div>
  `
  return categoryCard
}
function appendCategories(categories){
  let categoriesBox = ""
  categories.forEach((category) => {
      let finalCategorycard = createcategoryCard(category)
      categoriesBox += finalCategorycard
  })
  bodyElements.categoryCards1.innerHTML = categoriesBox
  // console.log(bodyElements.categoryCards1.children);
}
function categoryCardClick(){
  let categoryCard1 = document.querySelectorAll(".category_cards1 .category_card")
  console.log(categoryCard1, 'all new category cards');
    categoryCard1.forEach((category1) => {
        category1.addEventListener('click', function(){
            getCategoryId(category1)
            renderCategoryImages()
        })
    })
}
function getCategoryId(category1){
  let categoryId = category1.dataset.id
  console.log(categoryId)
}
async function renderCategories(){
    let categories = await getCategories()
    console.log(categories)
    appendCategories(categories)
    categoryCardClick()
}

// category images
async function getCategoryImages(){
    try{
        let categoryImagesResponse = await fetch(`${bodyElements.topicsApiUrl}3bnm95isIxE/photos?page=1&per_page=20&client_id=${bodyElements.clientId}`)
        let categoryImageJson = await categoryImagesResponse.json()
        // console.log(categoryJson);
        return categoryImageJson
    }
    catch(error){
        console.log(error);
    }
}
function createCategoryImageCard(categoryImage){
  let categoryImageCard = `
  <div class="category_image_card">
    <img src="${categoryImage.urls.small}" alt="" clas
    category_image>
    <div class="category_image_details">
      <p class="category_image_name">Photo by ${categoryImage.user.first_name}</p>
      <p class="owner_name">on Unsplash</p>
    </div>
  </div>
  `
  return categoryImageCard
}
function appendCategoryImages(categoryImages){
  let categoryImagesBox = ""
  categoryImages.forEach((categoryImage) => {
    console.log(categoryImage);
    let finalCategoryImage = createCategoryImageCard(categoryImage)
    categoryImagesBox+= finalCategoryImage
  })
  bodyElements.category_image_cards.innerHTML = categoryImagesBox
  console.log(bodyElements.category_image_cards);
}
async function renderCategoryImages(){
  let categoryImages = await getCategoryImages()
  console.log(categoryImages)
  appendCategoryImages(categoryImages)
}
