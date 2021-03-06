let dataArray;

(function () {


    addEventListener(onload, main());


}());


function main() {

    const chosenSort = document.getElementsByName('sort-by');

    for (let i = 0; i < chosenSort.length; i++) {
        chosenSort[i].addEventListener('change', () => {
            checkSort(chosenSort[i]);
        });

    }
    getPosts();

    sessionStorage.setItem('lastPostIndex', '0');

    showTimeOrder(document.getElementsByClassName('select-sort-type')[0]);


    let searchBoxField = document.getElementById('search-box-wrapper');
    searchBoxField.addEventListener('input', (event) => {
        quickSearch(event.target.value);
    });

    const aToTop = document.getElementById('nav-top');
    aToTop.addEventListener('click', () => {
        toTop();
    });

    window.onscroll = function () {
        let lastElement = document.getElementsByClassName('cards-array-wrapper')[0].lastChild;
        let lastElementTop = lastElement.getBoundingClientRect().top;
        let windowHeight = document.documentElement.clientHeight;
        let topVisible = lastElementTop <= windowHeight;

        if (topVisible) {
            createCard(JSON.parse(sessionStorage.getItem("dataArray")));

        }


    }


}

function checkSort(sort) {
    if (sort.checked === true) {
        showContent(sort.id);
    }
}

function showContent(id) {

    const container = document.getElementsByClassName('select-sort-type')[0];
    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }
    if (id === 'sort-tag') {
        showTags(container);
    } else {
        showTimeOrder(container);
    }

}

function showTags(cont) {


    const MAX_LENGTH = 8;

    let allTagList = JSON.parse(sessionStorage.getItem('tagList'));


    for (let i = 0; i < allTagList.length; i++) {
        const tagsList = document.createElement('input');
        const tagsName = document.createElement('label');
        tagsList.setAttribute("type", "checkbox");
        tagsList.setAttribute("id", `tag-${allTagList[i]}`);
        tagsList.setAttribute("name", `tags`);
        tagsList.setAttribute("value", `${allTagList[i]}`);


        tagsName.innerHTML = `${allTagList[i]}`;
        tagsName.setAttribute("for", `tag-${allTagList[i]}`);
        tagsList.setAttribute("class", `tag-label`);

        cont.appendChild(tagsList);
        cont.appendChild(tagsName);
    }

    let tagsArray = document.getElementsByName('tags');
    for (let i = 0; i < tagsArray.length; i++) {
        tagsArray[i].addEventListener('change', () => {
            let arr = [];
            for (let i = 0; i < tagsArray.length; i++) {
                if (tagsArray[i].checked === true) {
                    arr.push(tagsArray[i].value);
                }
            }
            sortByTag(arr);
        })

    }
}

function sortByTag(arr) {

    const data = JSON.parse(sessionStorage.getItem('dataArray'));
    const tagList = JSON.parse(sessionStorage.getItem('tagList'));

    let sortedByTag;


console.log(arr);

    localStorage.setItem('tags', JSON.stringify(arr));
    localStorage.setItem('sortBy', 'tags');


    sortedByTag = data.sort((a, b) => {
        let counterA = 0;
        let counterB = 0;
        arr.forEach((item) => {

            for (let k = 0; k < a.tags.length; k++) {
                if (item === a.tags[k]) {
                    counterA++;
                }
            }
            for (let k = 0; k < b.tags.length; k++) {
                if (item === b.tags[k]) {
                    counterB++;
                }
            }
        });


        if (counterB - counterA !== 0) {
            return counterB - counterA;
        } else {
            if (a.createdAt < b.createdAt) {
                return 1;
            }
            if (a.createdAt > b.createdAt) {
                return -1;
            }
            if (a.createdAt === b.createdAt) {
                return 0;
            }
        }

    });

    sessionStorage.setItem('dataArray', JSON.stringify(sortedByTag));
    sessionStorage.setItem('lastPostIndex', 0);
    createCard(JSON.parse(sessionStorage.getItem("dataArray")));

}

function showTimeOrder(cont) {

    let decreaseOrder = document.createElement('input');
    let decreaseLabel = document.createElement('label');
    let increaseOrder = document.createElement('input');
    let increaseLabel = document.createElement('label');

    decreaseOrder.setAttribute('type', 'radio');
    decreaseOrder.setAttribute('name', 'time-order');
    decreaseOrder.setAttribute('id', 'time-decrease');

    increaseOrder.setAttribute('type', 'radio');
    increaseOrder.setAttribute('name', 'time-order');
    increaseOrder.setAttribute('id', 'time-increase');

    decreaseLabel.innerHTML = "Decrease";
    decreaseLabel.setAttribute('for', 'time-decrease');

    increaseLabel.innerHTML = "Increase";
    increaseLabel.setAttribute('for', 'time-increase');

    cont.appendChild(decreaseOrder);
    cont.appendChild(decreaseLabel);
    cont.appendChild(increaseOrder);
    cont.appendChild(increaseLabel);

    document.getElementById('time-decrease').addEventListener('click', (event) => {
        sortByTimeOrder(event.target.id);
    });
    document.getElementById('time-increase').addEventListener('click', (event) => {
        sortByTimeOrder(event.target.id);
    });
}

function sortByTimeOrder(id) {
    const data = JSON.parse(sessionStorage.getItem('dataArray'));
    localStorage.setItem('sortBy', 'date');
    if (id === 'time-increase') {
        localStorage.setItem('DataOrder', 'time-increase');
        data.sort((a, b) => {
                if (a.createdAt > b.createdAt) {
                    return 1;
                }
                if (a.createdAt < b.createdAt) {
                    return -1;
                }
                if (a.createdAt === b.createdAt) {
                    return 0;
                }

            }
        );

        sessionStorage.setItem('lastPostIndex', 0);
        sessionStorage.setItem('dataArray', JSON.stringify(data));


        createCard(JSON.parse(sessionStorage.getItem("dataArray")));

    }
    if (id === 'time-decrease') {
        localStorage.setItem('DataOrder', 'time-decrease');
        data.sort((a, b) => {
            localStorage.setItem('DataOrder', 'time-decrease');
            if (a.createdAt < b.createdAt) {
                return 1;
            }
            if (a.createdAt > b.createdAt) {
                return -1;
            }
            if (a.createdAt === b.createdAt) {
                return 0;
            }

        });
        sessionStorage.setItem('lastPostIndex', 0);
        sessionStorage.setItem('dataArray', JSON.stringify(data));

        createCard(JSON.parse(sessionStorage.getItem("dataArray")));

    }

}

function getAllTabs() {

    let articleList = JSON.parse(sessionStorage.getItem('dataArray'));
    let tagList = [];
    for (let i = 0; i < articleList.length; i++) {
        articleList[i].tags.forEach((item) => {
            let flag = false;
            for (let k = 0; k < tagList.length; k++) {
                if (item === tagList[k]) {
                    flag = true;
                    break;
                }
            }
            if (flag === false) {
                tagList.push(item)
            }

        });
    }
    sessionStorage.setItem('tagList', JSON.stringify(tagList));

}

function getPosts() {
    const headers = new Headers();
    headers.append('Content-type', 'application/json');

    const request = new Request('https://api.myjson.com/bins/152f9j', {
        method: 'GET',
        headers
    });
    fetch(request)
        .then(response => {
            response.json().then(data => {
                    setDataArray(data.data);
                }
            );
        })
        .catch(err => {
            console.log(err);
        });
}

function setDataArray(data) {
    sessionStorage.setItem("dataArray", JSON.stringify(data));
    getAllTabs();
    console.log(localStorage)
    if (localStorage.getItem('sortBy') === 'tags') {
        console.log(typeof JSON.parse(localStorage.getItem('tags')));
        // sortByTag(localStorage.getItem('tags'));
        sortByTag(JSON.parse(localStorage.getItem('tags')));
    } else if (localStorage.getItem('sortBy') === 'date') {
        sortByTimeOrder(localStorage.getItem('DataOrder'))
    }else{
        sortByTimeOrder('time-decrease');
    }
    // createCard(JSON.parse(sessionStorage.getItem("dataArray")));
}

function createCard(storage) {

    const POST_AMOUNT = 10;
    // const storage = JSON.parse(sessionStorage.getItem('dataArray'));
    const lastPostIndex = sessionStorage.getItem('lastPostIndex');
    const container = document.getElementsByClassName('cards-array-wrapper')[0];



    if (lastPostIndex === '0') {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }
    let i = +lastPostIndex;

    for (; i < POST_AMOUNT + +lastPostIndex; i++) {


        if (i < storage.length) {


            const card = document.createElement('div');
            card.setAttribute('class', 'card-wrapper');


            //cancel

            const cardCancelButtonWrapper = document.createElement('div');

            const cardCancelButton = document.createElement('button');
            cardCancelButton.setAttribute('class', 'card-cancel');
            cardCancelButton.setAttribute('value', `${i}`);

            const icon = document.createElement('i');
            icon.setAttribute('class', "icon-cancel");



            //title
            const cardTitleWrapper = document.createElement('div');
            cardTitleWrapper.setAttribute('class', 'cart-title-wrapper');

            const cardTitle = document.createElement('h3');
            cardTitle.innerHTML = storage[i].title;

            //description
            const cardDescriptionWrapper = document.createElement('div');
            cardDescriptionWrapper.setAttribute('class', 'cart-description-wrapper');

            //cardImg
            const cardImgWrapper = document.createElement('div');
            cardImgWrapper.setAttribute('class', 'cart-img-wrapper');

            const cardImg = document.createElement('img');
            cardImg.setAttribute('src', `${storage[i].image}`);
            //date
            const cardDateWrapper = document.createElement('div');
            cardDateWrapper.setAttribute('class', 'cart-date-wrapper');

            //Tags
            const cardTagsWrapper = document.createElement('div');
            cardTagsWrapper.setAttribute('class', 'cart-tags-wrapper');


            container.appendChild(card);
            card.appendChild(cardCancelButtonWrapper);
            card.appendChild(cardTitleWrapper);
            card.appendChild(cardDescriptionWrapper);
            card.appendChild(cardImgWrapper);
            card.appendChild(cardDateWrapper);
            card.appendChild(cardTagsWrapper);


            cardCancelButtonWrapper.appendChild(cardCancelButton);
            cardTitleWrapper.appendChild(cardTitle);

            cardCancelButton.appendChild(icon);
            cardDescriptionWrapper.innerHTML = `<p>${storage[i].description}</p>`;
            cardImgWrapper.appendChild(cardImg);
            cardDateWrapper.innerHTML = `<p>${storage[i].createdAt}</p>`;
            cardTagsWrapper.innerHTML = `<p>${storage[i].tags}</p>`;
        }
    }
//
    sessionStorage.setItem('lastPostIndex', i);
    let buttons = document.getElementsByClassName('card-cancel');
    for (let k = 0; k < buttons.length; k++) {
        buttons[k].addEventListener('click', (event) => {
            deleteElements(event);
        })

    }

}

function deleteElements(ev) {
    const currentWraper = ev.currentTarget.parentElement.parentElement;
    const buttonIndex = ev.currentTarget.value;
    const dataArr = JSON.parse(sessionStorage.getItem('dataArray'));


    dataArr.splice(buttonIndex, 1);

    sessionStorage.setItem('dataArray', JSON.stringify(dataArr));


 currentWraper.remove();
    sessionStorage.setItem('lastPostIndex', 0);
    createCard(JSON.parse(sessionStorage.getItem('dataArray')));
    // const elCount = document.getElementsByClassName('card-wrapper').length;
    // console.log(elCount);
    // sessionStorage.setItem('elCount',elCount);




}

function quickSearch(value) {
    let regex = new RegExp(value, 'i');
    let postsArray = JSON.parse(sessionStorage.getItem("dataArray"));
    let searchingArray;


    searchingArray = postsArray.filter((item) => {
        return item.title.search(regex) !== -1;

    });

    console.log(searchingArray);
    sessionStorage.setItem('lastPostIndex', 0);

    createCard(searchingArray);


}

function toTop() {

    sessionStorage.setItem('lastPostIndex', 0);
    createCard(JSON.parse(sessionStorage.getItem("dataArray")));



}

