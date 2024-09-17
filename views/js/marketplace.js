const searchInput = document.getElementById('search-input');
const suggestionsDiv = document.getElementById('suggestions');
let debounceTimer;

searchInput.addEventListener('input', function() {
    clearTimeout(debounceTimer);
    /* 
    The existing timer (if any) is cleared using clearTimeout(debounceTimer). 
    This cancels any pending API calls from previous keystrokes.
    */
    const query = this.value;
    if (query.length > 2) {
        debounceTimer = setTimeout(() => {
            fetch('/marketplace/newoffer/search/' + query)
                .then(pertinentHeroes => pertinentHeroes.json())
                    .then(pertinentHeroes_json => {
                        console.log(pertinentHeroes_json);
                        updateSuggestions(pertinentHeroes_json) 
                    })
                    .catch(error => console.error('Error:', error));
        }, 300);
    } else {
        suggestionsDiv.style.display = 'none';
    }
});


const elementsPerPageInput = document.getElementById('elementsPerPage');
let currentPage = 1;
let offersPerPage = parseInt(elementsPerPageInput.value);
let totalPages = Math.ceil(all_offers.length / offersPerPage);

// monitor elemtnts per page input change
elementsPerPageInput.addEventListener('change', function() {
    offersPerPage = parseInt(this.value)
    totalPages = Math.ceil(all_offers.length / offersPerPage)
    renderPage(currentPage, offersPerPage);
});
// monitor prev page change
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage, offersPerPage);
    }
});

// monitor next page change
document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        renderPage(currentPage, offersPerPage);
    }
});
const exchangeItems = {};
exchangeItems.buying = {};
exchangeItems.selling = {};
exchangeItems.buying.figurines = [];
exchangeItems.selling.figurines = [];
exchangeItems.buying.points = 0;
exchangeItems.selling.points = 0;

function renderPage(pageNumber, elementsPerPage) {
    const offersContainer = document.querySelector('.offers-container');
    const startIndex = (pageNumber - 1) * elementsPerPage;
    const endIndex = startIndex + elementsPerPage;
    const offersToDisplay = all_offers.slice(startIndex, endIndex);

    offersContainer.innerHTML = '';

    offersToDisplay.forEach(offer => {
        offersContainer.appendChild(createOfferElement(offer));
    });
    updateNavigationButtons();
}

function createOfferElement(offer) {
        const offerContainer = document.createElement('div');
        offerContainer.className = 'offerContainer';
        offerContainer.setAttribute('data-key', offer._id);
        const offerHeader = document.createElement('div');
        offerHeader.className = 'offerHeader';
        const offerUser = document.createElement('p');
        offerUser.textContent = offer.username;
        offerHeader.appendChild(offerUser);
        // const offerNames = document.createElement('div');
        // offerNames.className = 'offerNames';
        const offerCentral = document.createElement('div');
        offerCentral.className = 'offerCentral';
        const offerRequesting = document.createElement('div');
        offerRequesting.className = 'offerRequesting';
        const offerSymbol = document.createElement('div');
        offerSymbol.className = 'offerSymbol';
        const offerOffering = document.createElement('div');
        offerOffering.className = 'offerOffering';
        const offerRequestingNames = document.createElement('div');
        offerRequestingNames.className = 'offerRequestingNames';
        const offerRequestingElements = document.createElement('div');
        offerRequestingElements.className = 'offerRequestingElements';
        const offerExchangeSymbolNames = document.createElement('div');
        offerExchangeSymbolNames.className = 'offerExchangeSymbolNames';
        const symbolIconNames = document.createElement('i');
        symbolIconNames.className = 'fa-duotone fa-solid fa-arrow-right-arrow-left'; // Using Font Awesome exchange icon
        symbolIconNames.style.width = '100%';
        symbolIconNames.style.height = 'auto';
        offerExchangeSymbolNames.appendChild(symbolIconNames);
        const offerExchangeSymbol = document.createElement('div');
        offerExchangeSymbol.className = 'offerExchangeSymbol';
        const symbolIcon = document.createElement('i');
        symbolIcon.className = 'fa-duotone fa-solid fa-arrow-right-arrow-left'; // Using Font Awesome exchange icon
        symbolIcon.style.width = '100%';
        symbolIcon.style.height = 'auto';
        offerExchangeSymbol.appendChild(symbolIcon);
        const offerOfferingNames = document.createElement('div');
        offerOfferingNames.className = 'offerOfferingNames';
        const offerOfferingElements = document.createElement('div');
        offerOfferingElements.className = 'offerOfferingElements';

        const offerFooter = document.createElement('div');
        offerFooter.className = 'offerFooter';
        const offerRemoveFooter = document.createElement('div');
        offerRemoveFooter.className = 'offerRemoveFooter';
        try {    
            if(user_offers.includes(offer._id)) {
                const removeButton = document.createElement('a');
                removeButton.className = 'removeButton';
                removeButton.setAttribute('onclick', 'removeOffer(this)');
                const removeButtonInternal = document.createElement('div');
                removeButtonInternal.className = 'removeButtonInternal';
                const removeButtonText = document.createElement('span')
                removeButtonText.textContent = 'Remove';
                removeButtonInternal.appendChild(removeButtonText);
                removeButton.appendChild(removeButtonInternal);
                offerRemoveFooter.appendChild(removeButton);
                offerFooter.style.display = 'none';
            } else {
                const exchangeButton = document.createElement('a');
                exchangeButton.className = 'exchangeButton';
                exchangeButton.setAttribute('onclick', 'exchange(this)');
                const exchangeButtonInternal= document.createElement('div');
                exchangeButtonInternal.className = 'exchangeButtonInternal';
                const exchangeButtonText = document.createElement('span')
                exchangeButtonText.textContent = 'Exchange';
                exchangeButtonInternal.appendChild(exchangeButtonText);
                exchangeButton.appendChild(exchangeButtonInternal);
                offerFooter.appendChild(exchangeButton);

                offerRemoveFooter.style.display = 'none';
            }
        } catch (error) {
            console.log(error);
        }

        if(offer.requesting.points > 0) {
            const pointsNumber = document.createElement('span');
            pointsNumber.textContent = offer.requesting.points + ' points';
            pointsNumber.className = 'pointsNumber';

            const requestingPointsContainer = document.createElement('div');
            requestingPointsContainer.className = 'requestingPoints';

            const pointsCircle = document.createElement('div');
            pointsCircle.className = 'pointsCircle';

            const innerPointsCircle = document.createElement('div');
            innerPointsCircle.className = 'innerPointsCircle';

            const pointsValue = document.createElement('span');
            pointsValue.textContent = offer.requesting.points;

            innerPointsCircle.appendChild(pointsValue);
            pointsCircle.appendChild(innerPointsCircle);
            requestingPointsContainer.appendChild(pointsCircle);
            offerRequestingNames.appendChild(pointsNumber);
            offerRequestingElements.appendChild(requestingPointsContainer);
        }
            offer.requesting.figurines.forEach(figurine => {
                const figurineName = document.createElement('span');
                figurineName.textContent = figurine.figurine_name;

                if(figurine.figurine_image_path.endsWith('image_not_available')) {
                    const noImageDiv = document.createElement('div');
                    noImageDiv.style.cssText = "width: 115px; height: 152px; border-radius: 10px; border: 4px solid #b11616; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; font-size: 10px; line-height: 1.2; margin-bottom: 28px;";
                    noImageDiv.innerHTML = `<span style="font-size: medium; font-weight: bold">${figurine.figurine_name}</span><span>Image</span><span>Not</span><span>Available</span>`;
                    offerRequestingElements.appendChild(noImageDiv);
                    if(offer.requesting.figurines.indexOf(figurine) > 0 || offer.requesting.points > 0){
                        noImageDiv.style.setProperty('margin-left', '20px');
                        const figurinePlus = document.createElement('span');
                        figurinePlus.textContent = '+';
                        offerRequestingNames.appendChild(figurinePlus);
                    }
                    offerRequestingNames.appendChild(figurineName);
                }  else {
                    const figurineElement = document.createElement('div');
                    figurineElement.class = 'requestingFigurine';
                    figurineElement.style.cssText = 'width: 120px; height: 100%; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; display: flex; flex-direction: column; justify-content: flex-start; align-items: center;';
                    const figurineImg = document.createElement('img');
                    figurineImg.className = 'requestingFigurineImg';
                    figurineImg.src = figurine.figurine_image_path + '/portrait_medium.' + figurine.figurine_ext;
                    figurineImg.onerror = function() {
                        this.onerror = null;
                        this.parentNode.innerHTML = `<div style="width: 100px; height: 150px; border: 2px solid #8b0000; border-radius: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; font-size: 10px; line-height: 1.2;"><span style="font-size: medium; font-weight: bold">${figurine.figurine_name}</span><span>Image</span><span>Not</span><span>Available</span></div>`;
                    };
                    if(offer.requesting.figurines.indexOf(figurine) > 0 || offer.requesting.points > 0){
                        figurineElement.style.setProperty('margin-left', '20px');
                        const figurinePlus = document.createElement('span');
                        figurinePlus.textContent = '+';
                        offerRequestingNames.appendChild(figurinePlus);
                    }
                    offerRequestingNames.appendChild(figurineName);
                    figurineElement.appendChild(figurineImg);
                    offerRequestingElements.appendChild(figurineElement);
                }

            });

        if(offer.offering.points > 0) {
            const pointsNumber = document.createElement('span');
            pointsNumber.textContent = offer.offering.points + ' points';
            pointsNumber.className = 'pointsNumber';

            const offeringPointsContainer = document.createElement('div');
            offeringPointsContainer.className = 'offeringPoints';

            const pointsCircle = document.createElement('div');
            pointsCircle.className = 'pointsCircle';

            const innerPointsCircle = document.createElement('div');
            innerPointsCircle.className = 'innerPointsCircle';

            const pointsValue = document.createElement('span');
            pointsValue.textContent = offer.offering.points;
            pointsValue.style.cssText = 'font-size: 24px; color: #b11616; position: relative;';

            innerPointsCircle.appendChild(pointsValue);
            pointsCircle.appendChild(innerPointsCircle);
            offeringPointsContainer.appendChild(pointsCircle);
            offerOfferingNames.appendChild(pointsNumber);
            offerOfferingElements.appendChild(offeringPointsContainer);
        }
            offer.offering.figurines.forEach(figurine => {
                const figurineName = document.createElement('span');
                figurineName.textContent = figurine.figurine_name;
                if(figurine.figurine_image_path.endsWith('image_not_available')) {
                    const noImageDiv = document.createElement('div');
                    noImageDiv.style.cssText = "width: 115px; height: 152px; border-radius: 10px; border: 4px solid #b11616; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; font-size: 10px; line-height: 1.2; margin-bottom: 28px;";
                    noImageDiv.innerHTML = `<span style="font-size: medium; font-weight: bold">${figurine.figurine_name}</span><span>Image</span><span>Not</span><span>Available</span>`;
                    offerOfferingElements.appendChild(noImageDiv);
                    if(offer.offering.figurines.indexOf(figurine) > 0 || offer.offering.points > 0){
                        noImageDiv.style.setProperty('margin-left', '20px');
                        const figurinePlus = document.createElement('span');
                        figurinePlus.textContent = '+';
                        offerOfferingNames.appendChild(figurinePlus);
                    }
                    offerOfferingNames.appendChild(figurineName);
                }  else {
                    const figurineElement = document.createElement('div');
                    figurineElement.class = 'offeringFigurine';
                    figurineElement.style.cssText = ' width: 120px; height: 100%; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; display: flex; flex-direction: column; justify-content: flex-start; align-items: center;';
                    const figurineImg = document.createElement('img');
                    figurineImg.className = 'offeringFigurineImg';
                    figurineImg.src = figurine.figurine_image_path + '/portrait_medium.' + figurine.figurine_ext;
                    figurineImg.onerror = function() {
                        this.onerror = null;
                        this.parentNode.innerHTML = `<div style="width: 100px; height: 150px; border: 2px solid #8b0000; border-radius: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; font-size: 10px; line-height: 1.2;"><span style="font-size: medium; font-weight: bold">${figurine.figurine_name}</span><span>Image</span><span>Not</span><span>Available</span></div>`;
                    };
                    if(offer.offering.figurines.indexOf(figurine) > 0|| offer.offering.points > 0){
                        figurineElement.style.setProperty('margin-left', '20px');
                        const figurinePlus = document.createElement('span');
                        figurinePlus.textContent = '+';
                        figurinePlus.className = 'offeringFigurinePlus';
                        offerOfferingNames.appendChild(figurinePlus);
                    }
                    offerOfferingNames.appendChild(figurineName);
                    figurineElement.appendChild(figurineImg);
                    offerOfferingElements.appendChild(figurineElement);
                }

            });

    offerRequesting.appendChild(offerRequestingNames);
    offerRequesting.appendChild(offerRequestingElements);
    offerSymbol.appendChild(offerExchangeSymbolNames);
    offerSymbol.appendChild(offerExchangeSymbol);
    offerOffering.appendChild(offerOfferingNames);
    offerOffering.appendChild(offerOfferingElements);

    offerCentral.appendChild(offerRequesting);
    offerCentral.appendChild(offerSymbol);
    offerCentral.appendChild(offerOffering);

    offerContainer.appendChild(offerHeader);
    offerContainer.appendChild(offerCentral);
    offerContainer.appendChild(offerFooter);
    offerContainer.appendChild(offerRemoveFooter);

    return offerContainer;

}

function updateNavigationButtons() {
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const pageNum = document.getElementById('pageNum')
    pageNum.innerHTML = 'Page ' + currentPage;

    prevButton.classList.toggle('disabled', currentPage === 1);
    nextButton.classList.toggle('disabled', currentPage === totalPages);
}


function createNewOffer() {

console.log(userDoublesFigurines);
const figurinesList = document.querySelector('.figurinesList');
const exchangedItems = document.querySelector('.exchangedItems');

userDoublesFigurines.forEach(doubleFigurine => {
    const doubleFigurineElement = document.createElement('div');
    doubleFigurineElement.className = 'doubleFigurine';
    sessionStorage.setItem('double_' + doubleFigurine.name, JSON.stringify({ "name": doubleFigurine.name, "image_path": doubleFigurine.image_path, "user_figurine_id": doubleFigurine._id }))
    const doubleFigurineName = document.createElement('div');
    doubleFigurineName.className = 'doubleFigurineName';
    const doubleFigurineNameText = document.createElement('p');
    doubleFigurineNameText.className = 'doubleFigurineNameText';
    doubleFigurineNameText.textContent = doubleFigurine.name;
    const doubleFigurineImage = document.createElement('div');
    doubleFigurineImage.className = 'doubleFigurineImage';
    if(doubleFigurine.image_path.endsWith('image_not_available')) {
        doubleFigurineImage.style.cssText = 'border: 4px solid #8b0000; border-radius: 10px; flex-direction: column;';
        doubleFigurineImage.innerHTML = `<span>Image</span><span>Not</span><span>Available</span>`;
    } else {
    const doubleFigurineImageImg = document.createElement('img');
    doubleFigurineImageImg.src = doubleFigurine.image_path + '/portrait_medium.' + doubleFigurine.ext;
    doubleFigurineImageImg.onerror = function() {
                this.onerror = null;
                this.parentNode.style.cssText = 'border: 4px solid #8b0000; border-radius: 10px; flex-direction: column;'
                this.parentNode.innerHTML = `<span>Image</span><span>Not</span><span>Available</span>`;
            };
    doubleFigurineImageImg.alt = 'double figurine image ' + doubleFigurine._id;
    doubleFigurineImage.appendChild(doubleFigurineImageImg);
    }
    const doubleFigurineSelling = document.createElement('div');
    doubleFigurineSelling.className = 'doubleFigurineSelling';
    doubleFigurineSelling.setAttribute('onclick', 'addSellingItem(this)');
    const doubleFigurineSellingText = document.createElement('i');
    doubleFigurineSellingText.textContent = 'SELL';

    doubleFigurineName.appendChild(doubleFigurineNameText);
    doubleFigurineSelling.appendChild(doubleFigurineSellingText);

    doubleFigurineElement.appendChild(doubleFigurineName);
    doubleFigurineElement.appendChild(doubleFigurineImage);
    doubleFigurineElement.appendChild(doubleFigurineSelling);

    figurinesList.appendChild(doubleFigurineElement);
});

document.querySelector('.modalNewOffer').style.display = 'flex';
}

function addSellingItem(target){

    target.parentNode.children[0].children[0].classList.toggle('disabled');
    target.parentNode.children[1].classList.toggle('disabled');
    target.parentNode.children[2].classList.toggle('disabled');
    target.removeAttribute('onclick');

    const sellingFigurinesList = document.querySelector('.sellingItemsList');
    const sellingFigurine = document.createElement('div');
    sellingFigurine.className = 'sellingItem';
    const doubleHero = JSON.parse(sessionStorage.getItem('double_' + target.parentNode.children[0].textContent))
    const exchangeItemRemove = document.createElement('div');
    exchangeItemRemove.className = 'exchangeItemRemove';
    exchangeItemRemove.setAttribute('onclick', 'removeExhangeItem(this)');
    const exchangeItemRemoveText = document.createElement('i');
    exchangeItemRemoveText.textContent = 'REMOVE';
    exchangeItemRemove.appendChild(exchangeItemRemoveText);
    let doubleHeroName = doubleHero.name
    exchangeItems.selling.figurines.push({
            figurine_name: doubleHero.name,
            figurine_image_path: doubleHero.image_path,
            figurine_id: doubleHero.user_figurine_id
    })
    sellingFigurine.setAttribute('hero-name', doubleHeroName)
    console.log(exchangeItems.selling.figurines)
    // maybe to add in an element attribute for reference later `${target.parentNode.children[0].children[0].textContent}`;
    const sellingFigurineImage = document.createElement('div');
    sellingFigurineImage.className = 'doubleFigurineImage';
    if(target.parentNode.children[1].children[0].textContent === 'Image') {
        sellingFigurineImage.style.cssText = 'border: 4px solid #8b0000; border-radius: 10px; flex-direction: column;';
        sellingFigurineImage.innerHTML = `<span style="font-weight: bold">${doubleHeroName}</span><span>Image</span><span>Not</span><span>Available</span>`;
    } else {
    const sellingFigurineImageImg = document.createElement('img');
    sellingFigurineImageImg.src = target.parentNode.children[1].children[0].getAttribute('src');
    sellingFigurineImageImg.onerror = function() {
                this.onerror = null;
                this.parentNode.style.cssText = 'border: 4px solid #8b0000; border-radius: 10px; flex-direction: column;'
                this.parentNode.innerHTML = `<span style="font-weight: bold">${doubleHeroName}</span><span>Image</span><span>Not</span><span>Available</span>`;
            };
    sellingFigurineImageImg.alt = 'double figurine image';
    sellingFigurineImage.appendChild(sellingFigurineImageImg);

    }

    // sellingItem.innerHTML = `<div class="sellingItemName">${event.target.parentNode.children[0].textContent}</div><div class="sellingItemImage"><img src="${event.target.parentNode.children[1].children[0].src}" alt="selling item image"></div>`;
    // sellingFigurineName.appendChild(sellingFigurineNameText);

    // sellingFigurine.appendChild(sellingFigurineName);
    sellingFigurine.appendChild(sellingFigurineImage);
    sellingFigurine.appendChild(exchangeItemRemove);
    sellingFigurinesList.appendChild(sellingFigurine);
}

function addPoints(target) {

    target.parentNode.children[1].value = target.parentNode.children[1].value.replace(/[^0-9]/g, '');

    if(target.parentNode.children[1].value < 1) {
            console.log("must add at least one point")
    } else {
        const points = parseInt(target.parentNode.children[1].value, 10);
        const itemsList = target.parentNode.parentNode.parentNode.children[1];
        
        for (let child of itemsList.children) {
            if (child.classList.contains('requestingPoints')) {
                child.children[0].children[0].children[0].textContent = parseInt(child.children[0].children[0].children[0].textContent, 10) + points; 
                return
            }
        }

        if(target.parentNode.parentNode.children[1].textContent === 'Buying') {
            exchangeItems.buying.points += points;
        } else if(target.parentNode.parentNode.children[1].textContent === 'Selling'){
            exchangeItems.selling.points += points;
        } else {
            console.log("adding points context not identified")
            return
        }
        const requestingPointsContainer = document.createElement('div');
        requestingPointsContainer.className = 'requestingPoints';

        const pointsCircle = document.createElement('div');
        pointsCircle.className = 'pointsCircle';

        const innerPointsCircle = document.createElement('div');
        innerPointsCircle.className = 'innerPointsCircle';

        const pointsValue = document.createElement('span');
        pointsValue.textContent = target.parentNode.children[1].value;

        const exchangeItemRemove = document.createElement('div');
        exchangeItemRemove.className = 'exchangeItemRemove';
        exchangeItemRemove.setAttribute('onclick', 'removeExhangeItem(this)');
        const exchangeItemRemoveText = document.createElement('i');
        exchangeItemRemoveText.textContent = 'REMOVE';
        exchangeItemRemove.appendChild(exchangeItemRemoveText);

        target.parentNode.children[1].value = '';

        innerPointsCircle.appendChild(pointsValue);
        pointsCircle.appendChild(innerPointsCircle);
        requestingPointsContainer.appendChild(pointsCircle);
        requestingPointsContainer.appendChild(exchangeItemRemove);
        itemsList.appendChild(requestingPointsContainer);
    }

}

    // javascript to dincamically create suggested heroes and add heroes to buying list
function updateSuggestions(suggestions) {
    suggestionsDiv.innerHTML = '';

    if (suggestions.length > 0) {
        suggestions.forEach(item => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = item.name;
            div.onclick = function() {
                searchInput.value = this.textContent;
                suggestionsDiv.style.display = 'none';
                addBuyingItem(this.textContent);
                searchInput.value = '';
            };
            suggestionsDiv.appendChild(div);
            sessionStorage.setItem(item.name, JSON.stringify(item))
        });
        suggestionsDiv.style.display = 'block';
    } else {
        suggestionsDiv.style.display = 'none';
    }
}

function addBuyingItem(itemName){
    // check for hero buy and sell requests
    
    // check for hero double buy request
    for(let buyingItem of exchangeItems.buying.figurines) {
        if(buyingItem.figurine_name === itemName) {
            alert("you are already buying this hero")
            return
        }
    }
    // check for hero already in doubles
    for( let key in sessionStorage) {
        if(sessionStorage.hasOwnProperty(key)) {
            if(key.startsWith('double_')) {
                if(JSON.parse(sessionStorage.getItem(key)).name === itemName) {
                    alert("this hero is already in doubles, you can't buy another one")
                    return
                }
            }
        }
    }


    const hero = JSON.parse(sessionStorage.getItem(itemName))
    const buyingFigurinesList = document.querySelector('.buyingItemsList');
    const buyingFigurine = document.createElement('div');
    buyingFigurine.className = 'buyingItem';
    const exchangeItemRemove = document.createElement('div');
    exchangeItemRemove.className = 'exchangeItemRemove';
    exchangeItemRemove.setAttribute('onclick', 'removeExhangeItem(this)');
    const exchangeItemRemoveText = document.createElement('i');
    exchangeItemRemoveText.textContent = 'REMOVE';
    exchangeItemRemove.appendChild(exchangeItemRemoveText);
    let heroName = hero.name
    exchangeItems.buying.figurines.push({
            figurine_name: heroName,
            figurine_image_path: hero.image_path,
            figurine_id: hero.id // exchange accept later requires hero id, using figurine_id just to comply to model attributes for straight assignment server side
    })
    buyingFigurine.setAttribute('hero-name', heroName)
    console.log(exchangeItems.buying.figurines)
    const buyingFigurineImage = document.createElement('div');
    buyingFigurineImage.className = 'doubleFigurineImage';
    if(hero.image_path.endsWith('image_not_available')) {
        buyingFigurineImage.style.cssText = 'border: 4px solid #8b0000; border-radius: 10px; flex-direction: column;';
        buyingFigurineImage.innerHTML = `<span style="font-weight: bold">${heroName}</span><span>Image</span><span>Not</span><span>Available</span>`;
    } else {
    const buyingFigurineImageImg = document.createElement('img');
    buyingFigurineImageImg.src = hero.image_path + '/portrait_medium.jpg';
    buyingFigurineImageImg.onerror = function() {
                this.onerror = null;
                this.parentNode.style.cssText = 'border: 4px solid #8b0000; border-radius: 10px; flex-direction: column;'
                this.parentNode.innerHTML = `<span style="font-weight: bold">${heroName}</span><span>Image</span><span>Not</span><span>Available</span>`;
            };
    buyingFigurineImageImg.alt = 'double figurine image';
    buyingFigurineImage.appendChild(buyingFigurineImageImg);
    }
    //buyingFigurineName.appendChild(buyingFigurineNameText);
    // buyingFigurine.appendChild(buyingFigurineName);
    buyingFigurine.appendChild(buyingFigurineImage);
    buyingFigurine.appendChild(exchangeItemRemove)
    buyingFigurinesList.appendChild(buyingFigurine);
}

function removeExhangeItem(target) {

    if(target.parentNode.classList.contains('requestingPoints')){
        if(target.parentNode.parentNode.classList.contains('buyingItemsList')) {
            exchangeItems.buying.points = 0;
        } else {
            exchangeItems.selling.points = 0;
        }
        target.parentNode.remove();
    } else if(target.parentNode.classList.contains('buyingItem')) {
        const buyingFigurine = JSON.parse(sessionStorage.getItem(target.parentNode.getAttribute('hero-name')))
        for (const [index, item] of exchangeItems.buying.figurines.entries()) {
            if (item.figurine_id === buyingFigurine.id) {
                exchangeItems.buying.figurines.splice(index, 1);
                break;
            }
        }
        target.parentNode.remove();
    } else if(target.parentNode.classList.contains('sellingItem')){
        /* enable element in doubles list*/
        const sellingItem = JSON.parse(sessionStorage.getItem('double_' + target.parentNode.getAttribute('hero-name')))
        const disabledDoubleFigurinesElementsName = document.querySelectorAll('.doubleFigurineNameText.disabled');
        disabledDoubleFigurinesElementsName.forEach(disabledFigName => {
            if(disabledFigName.textContent === target.parentNode.getAttribute('hero-name')) {
            disabledFigName.classList.toggle('disabled');
            disabledFigName.parentNode.parentNode.children[1].classList.toggle('disabled');
            disabledFigName.parentNode.parentNode.children[2].classList.toggle('disabled');
            disabledFigName.parentNode.parentNode.children[2].setAttribute('onclick', 'addSellingItem(this)');
            }
        })
        for (const [index, item] of exchangeItems.selling.figurines.entries()) {
            if (item.figurine_id === sellingItem.user_figurine_id) {
                exchangeItems.selling.figurines.splice(index, 1);
                break;
            }
        }
        target.parentNode.remove();
        } else {
        console.log('element not recognized')
        }
}

function closeNewOfferMenu() {
    document.querySelector('.modalNewOffer').style.display='none'; 

    document.querySelector('.figurinesList').innerHTML = ''; 
    document.querySelector('.buyingItemsList').innerHTML = ''; 
    document.querySelector('.sellingItemsList').innerHTML = ''; 
    document.getElementById('suggestions').innerHTML = ''; 
    document.getElementById('search-input').value = '';

    sessionStorage.clear(); 

    exchangeItems.buying.points = 0;
    exchangeItems.buying.figurines = [];
    exchangeItems.selling.points = 0;
    exchangeItems.selling.figurines = [];
}

function confirmNewOffer() {

    fetch('/marketplace/newoffer/confirm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(exchangeItems)
    })
    .then((response) => response.json())
        .then((data) => {
            if(data.success) {
                console.log('success')
                console.log(data)
                sessionStorage.clear();
                window.location.reload();
            } else {
                alert(data.errorMessage)
            }
        })
}

function exchange(target) {

    fetch('/marketplace/exchange/' + target.parentNode.parentNode.getAttribute('data-key'))
        .then((response) => response.json())
            .then((data) => {
                if(data.success) {
                    console.log('success')
                    window.location.href = '/marketplace';
                } else {
                    alert('error creating exchange \n ' + data.errorMessage)
                }
            })

}

function removeOffer(target) {
    const offerContainer = target.parentNode.parentNode
    const offerId = offerContainer.getAttribute('data-key')

    fetch('/marketplace/offer/remove', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            offerId: offerId
        })
    })
    .then((response) => response.json())
    .then((data) => {
            if(data.success) {
                console.log('success')
                window.location.reload();
            } else {
                alert('Error removing offer \n' + data.errorMessage)
            }
        })
}


renderPage(currentPage, offersPerPage);