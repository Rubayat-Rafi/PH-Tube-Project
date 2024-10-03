document.getElementById('search-input').addEventListener('keyup', (e) => {
    loadVideos(e.target.value)
})
// time function 
function getTime(time){
    const hours = parseInt(time / 3600);
    let remainmimgSecond = time % 3600;
    const minute = parseInt(remainmimgSecond /60);
    remainmimgSecond = remainmimgSecond % 60;
    return `${hours}hrs ${minute} min ${remainmimgSecond} sec ago`
}

// create load categories 
const loadCategories = () => {
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
    .then(res => res.json())
    .then(data => displayCategories(data.categories))
    .catch(error => console.log(error))
}
// create load videos categories 
const loadVideos = (searchText = '') => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then(res => res.json())
    .then(v => displayVideos(v.videos))
    .catch(error => console.log(error))
}

const removeActiveClass = () => {
    const buttons = document.getElementsByClassName('category-btn');
    for(let btn of buttons){
        btn.classList.remove('active');
    }
}

loadCategories();
loadVideos()

// create display categories
const displayCategories = (categories) => {
    const btnContainer = document.getElementById('btn-container');

    categories.forEach((item) => {
        // create button 
        const btnCard = document.createElement('div');
        btnCard.innerHTML = `
        <button id="btn-${item.category_id}" onclick='buttonClick(${item.category_id})' class="category-btn rounded-lg py-2 px-5 bg-[#252525] bg-opacity-15 text-base font-medium text-[#252525] text-opacity-70">
        ${item.category}
        </button>
        `;
        btnContainer.appendChild(btnCard);
    });
};

const buttonClick = (id) => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then(res => res.json())
    .then(v => {
        // remove class
        removeActiveClass();

        // Remove 'active' class from all buttons
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));

        // Add 'active' class to the clicked button
        const activeBtn = document.getElementById(`btn-${id}`);
        activeBtn.classList.add('active');

        // Display videos
        displayVideos(v.category);
    })
    .catch(error => console.log(error));
};



// create display videos section 
const displayVideos = (videos) => {
    const videoContainer = document.getElementById('videos');
    videoContainer.innerHTML = '';

    if(videos.length === 0){
        videoContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center gap-8 text-center col-span-4 py-10">
            <img src="./images/Icon.png" class="w-36 h-36">
            <h2 class="text-3xl font-bold text-[#171717]">Oops!! Sorry, There is no content here</h2>
        </div>`;
    }
    videos.forEach( video => {
    // create card 
    const card = document.createElement('div');
    card.classList ="card rounded-lg card-compact bg-base-100"
    card.innerHTML = `
    <figure class="h-[180px] relative"> 
    <img
      src="${video.thumbnail}"
      alt="Shoes" class="rounded-lg h-full w-full object-cover"/>
      ${
        video.others.posted_date?.length == 0 ? '' : `<span class="absolute right-2 bottom-2 bg-black text-white text-[10px] px-2 py-1 rounded-md">${getTime(video.others.posted_date)}</span>`
      }
      
  </figure>
  <div class="px-0 py-3 flex gap-3">

        <div>
            <img  src="${video.authors[0].profile_picture}" alt="" class="w-8 h-8 rounded-full object-cover">
         </div>

         <div class="space-y-1">
            <h3 class="text-[#171717] text-base font-bold leading-6" >${video.title}</h3>

            <p class="flex gap-1 items-center"> 
            <span class="text-sm font-normal text-[#171717] text-opacity-70">${video.authors[0].profile_name}</span>
            <span>${video.authors[0].verified ? '<img src="https://img.icons8.com/?size=100&id=D9RtvkuOe31p&format=png&color=000000" class="w-4 h-4" >' : ""}</span>
            </p>

            <p class="text-sm font-normal text-[#171717] text-opacity-70">${video.others.views} views</p>
         </div>
  </div>
    `
    videoContainer.appendChild(card)
    })
}
