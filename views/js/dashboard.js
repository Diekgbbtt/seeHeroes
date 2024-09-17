

console.log(userFigurines);
const figurinesPerPage = 24; 
const totalPages = Math.ceil(userFigurines.length / figurinesPerPage);
let currentPage = 1;

function openEditMenu() {

    document.getElementById('modalEditMenu').style.display = 'flex';
    
    document.getElementById('editProfileForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        username: document.getElementById('username').value,
        email: document.getElementById('email').value
    };

    fetch('/account/edit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        document.getElementById('modalEditMenu').style.display='none';
        document.getElementById('editProfileForm').reset();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    });
}

function openBuyForm() {
    const modal = document.getElementById('modalPoints');
    const moadlContent = document.getElementById('modalPointsContent');
    const purchaseForm = document.getElementById('purchaseSubmitForm');

    modal.style.display = "flex";

    purchaseForm.addEventListener('submit', function(event) {

        event.preventDefault();

        const updatedData = {
            pointsAmount: document.getElementById('amount').value
        }

        fetch('/account/dashboard/buypoints/confirm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData)
        })
            .then(response => response.json())
                .then((data) => {
                    if(data.success) {
                        purchaseForm.reset();
                        document.getElementById('totalCost').innerHTML = 'Total Cost: 1 €';
                        modal.style.display = 'none';
                    }
                    else {
                        alert('error adding points');
                    }
                })
                .catch((error) => {
                console.error('Error:', error);
                });
    });
}

function openPacket(a_container) {
const packet_id = a_container.children[0].getAttribute('data-key');
const Extractedfigurines = document.getElementById('figurines-container');
const modalPacket = document.getElementById('modalPacket');
const loadingContent = document.getElementById('loadingContent');
const figurinesContent = document.getElementById('figurinesContent');

modalPacket.style.display = 'flex';
loadingContent.style.display = 'flex';
figurinesContent.style.display = 'none';

fetch('/account/dashboard/packets/' + packet_id)
    .then((figurines_data) => figurines_data.json())
    .then((figurines_data_json) => {
        console.log(figurines_data_json);
        let figs_count = 0;

        const displayFigs = () => {
            console.log(figurines_data_json[figs_count]);
            const figurine_entry = document.createElement('div');
            figurine_entry.className = 'figurine-entry'; 
            const fig_title = document.createElement('p');
            fig_title.innerHTML = figurines_data_json[figs_count].name;
            const fig_image = document.createElement('img');
            fig_image.src = figurines_data_json[figs_count].image_path + '/portrait_medium.' + figurines_data_json[figs_count].ext;
            fig_image.onerror = function() {
            this.onerror = null;
            this.src = `http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_medium.jpg`;
            };
            fig_image.style.setProperty('border-radius', '10px');
            Extractedfigurines.appendChild(figurine_entry);
            figurine_entry.appendChild(fig_title);
            figurine_entry.appendChild(fig_image);
            figs_count++;
            if(figs_count == figurines_data_json.length) {
                loadingContent.style.display = 'none';
                figurinesContent.style.display = 'block';
                return;
            } else {
                displayFigs();
            }
        }
        displayFigs();
    })
    .catch((error) => {
        Extractedfigurines.innerHTML = 'Unable to fetch packet data';
        loadingContent.style.display = 'none';
        figurinesContent.style.display = 'block';
    });
}




function renderPage(pageNumber) {
    const container = document.querySelector('.userFigurines');
    container.innerHTML = '';
    const startIndex = (pageNumber - 1) * figurinesPerPage;
    const endIndex = startIndex + figurinesPerPage;
    const pageFigurines = userFigurines.slice(startIndex, endIndex);
    
    pageFigurines.forEach(figurine => {
        container.appendChild(createFigurineElement(figurine));
    });
    
    updateNavigationButtons();
}

function createFigurineElement(figurine) {
    const container = document.createElement('a');
    container.id = "buttonDisplayCharacter";
    container.onclick = function() { displayChar(this); };
    container.style.cssText = "cursor: pointer; margin-left: 50px";

    const figurineEntry = document.createElement('div');
    figurineEntry.className = "figurine-entry";
    figurineEntry.setAttribute('figurineId', figurine.id_figurine);
    figurineEntry.style.cssText = "width: 30%; margin: 10px; box-sizing: border-box;";

    if (figurine.image_path.endsWith('image_not_available')) {
        const noImageDiv = document.createElement('div');
        noImageDiv.style.cssText = "width: 100px; height: 150px; border-radius: 10px; border: 2px solid #8b0000; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; font-size: 10px; line-height: 1.2;";
        noImageDiv.innerHTML = `<span style="font-size: medium; font-weight: bold">${figurine.name}</span><span>Image</span><span>Not</span><span>Available</span>`;
        figurineEntry.appendChild(noImageDiv);
    } else {
        const img = document.createElement('img');
        img.style.borderRadius = "10px";
        img.src = `${figurine.image_path}/portrait_medium.${figurine.ext || 'jpg'}`;
        img.onerror = function() {
            this.onerror = null;
            this.parentNode.innerHTML = `<div style="width: 100px; height: 150px; border: 2px solid #8b0000; border-radius: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; font-size: 10px; line-height: 1.2;"><span style="font-size: medium; font-weight: bold">${figurine.name}</span><span>Image</span><span>Not</span><span>Available</span></div>`;
        };
        figurineEntry.appendChild(img);
    }

    container.appendChild(figurineEntry);
    return container;
}

function updateNavigationButtons() {
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const pageNum = document.getElementById('pageNum')
    pageNum.innerHTML = 'Page ' + currentPage;

    prevButton.classList.toggle('disabled', currentPage === 1);
    nextButton.classList.toggle('disabled', currentPage === totalPages);
}

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        renderPage(currentPage);
    }
});

// Initial render
renderPage(1);


function displayChar(a_container) {
    const figId = a_container.children[0].getAttribute('figurineId');
    const charContainer = document.querySelector('.characterContainer');
    const charTitle = document.querySelector('.charTitle p');
    const charImage = document.querySelector('.charImage img');
    const charDesc = document.querySelector('.charDesc p');
    const charAppearances = document.querySelector('.charAppearances p');



    fetch(`/account/dashboard/fig/${figId}`)
        .then((figurine) => figurine.json())
            .then((figurine_json) => {
            charTitle.textContent = figurine_json.name;
            charImage.src = `${figurine_json.image_path}/landscape_xlarge.${figurine_json.ext}`;
            charImage.onerror = function() {
                this.onerror = null;
                this.src = `http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/landscape_xlarge.jpg`;
            };
            charDesc.textContent = figurine_json.description || 'No description available.';

            charAppearances.innerHTML = `${figurine_json.name} appears in: \n ${figurine_json.appearances[0]} comics \n ${figurine_json.appearances[1]} series \n ${figurine_json.appearances[2]} stories \n ${figurine_json.appearances[3]} events`;
            
            charContainer.style.display = 'flex';
            adjustLayout()
            return
        })
        .catch(error => console.error('Couldn\'t retrieve figurine from db, Error:', error));
}

function adjustLayout() {
    const windowWidth = window.innerWidth;
    const charContainer = document.querySelector('.characterContainer');
    const row3 = document.querySelector('.row-3');

    if (windowWidth <= 856 && charContainer.style.display === 'flex') {
        row3.style.height = '135vh';
    } else {
        row3.style.height = '75vh';
}
}

window.addEventListener('resize', adjustLayout);