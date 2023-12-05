const result = document.querySelector('#resultado');
const form = document.querySelector('#formulario');
const paginationDiv = document.querySelector('#paginacion');


const recordPerPage = 40;
let totalPages;
let iterator;
let actualPage = 1;

window.onload = () => {
    form.addEventListener('submit', validateForm);
}

function validateForm(e){
    e.preventDefault();

    const termSearch = document.querySelector('#termino').value;

    if(termSearch === ''){
        showAlert('Add a term of search');
        return
    }

    searchImages();
}

function showAlert(message){

    const alertExist = document.querySelector('.bg-red-100');

    if(!alertExist){
        const alert = document.createElement('p');
        alert.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 
        'max-w-lg', 'mx-auto', 'mt-5', 'text-center');

        alert.innerHTML = `
            <strong class="font-bod">Error!</strong>
            <span class="block sm:inline">${message}</span>
        `;

        form.appendChild(alert);
        setTimeout(() => {
            alert.remove();
        }, 3000)
    }   
}

function searchImages(){
    const term = document.querySelector('#termino').value;

    const key = '';
    const url = `https://pixabay.com/api/?key=${key}&q=${term}&per_page=${recordPerPage}&page=${actualPage}`;
    
    fetch(url)
        .then (response => response.json())
        .then (result => {
        
            totalPages = calculatePages(result.totalHits);
            console.log(totalPages)
            showImages(result.hits);
        })
}

// Generator that is going to record the amount of elements in base to the pages
function *createPaginator(total){
    for (let i = 1; i<= total; i++){
        yield i;
    }
}

function calculatePages(total){
    return parseInt( Math.ceil(total / recordPerPage));
}

function showImages(images){

    // console.log(images)
    while(result.firstChild){
        result.removeChild(result.firstChild);
    }

    // Iterate over the array of images and build the HTML
    images.forEach(image => {
        const {previewURL, likes, views, largeImageURL} = image;

        result.innerHTML += `
            <div class="w-1/2 md:2-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}">

                    <div class="p-4">
                        <p class="font-bold"> ${likes} <span class="font-light"> Likes </span></p>
                        <p class="font-bold"> ${views} <span class="font-light"> Times watched </span></p>

                        <a 
                            class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                            href="${largeImageURL}" target="_blank" rel="noopener noreferrer"
                        >
                            See Image
                        </a>

                </div>
            </dv>
        ` 
    });
    // Clean the previous paginator
    while(paginationDiv.firstChild){
        paginationDiv.removeChild(paginationDiv.firstChild)
    }

    // Generate the new HTML
    printPaginator();
}

function printPaginator(){
    iterator = createPaginator(totalPages); 

    while(true){
        const {value, done} = iterator.next();
        if(done) return;

        // Otherwise, generate a button for every element in the generator
        const button = document.createElement('a');
        button.href="#";
        button.dataset.page = value;
        button.textContent = value;
        button.classList.add('next', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'rounded');

        button.onclick= () => {
            actualPage = value;
            searchImages();
        }

        paginationDiv.appendChild(button);

    }
}