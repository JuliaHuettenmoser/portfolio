let bookmarks = []
let currentAmiibo = {}
let deletedAmiibos = []
let editedAmiibos = []
let newAmiibos = []
function createSearches(data) {
    removeEverything()
    let list = ""
                let i = 0
                for(d of data.amiibo){
                    i++
                    let giveIt = `<li id="suggest ${i}" >${d.name}, ${d.character}, ${d.amiiboSeries}</li>`
                    list = list.concat('\n', giveIt)
                }
                document.getElementById("searched").innerHTML = list;
}
function makedaAmiibo(amiibo) {
    currentAmiibo = amiibo
    // showEditandDelete()
    console.log(amiibo);
    getPicture(amiibo);
    getInformation(amiibo);
    // getUsage(amiibo);
}
function getPicture(amiibo) {
    document.getElementById('picture').innerHTML = `<img src="${amiibo.image}" class="picture"></img>`
}
function getInformation(amiibo) {
    document.getElementById('information').innerHTML = 
    `<br><span class="text">Amiibo : </span>${amiibo.name}</br>
    <br><span class="text">Amiibo Series : </span>${amiibo.amiiboSeries}</br>
    <br><span class="text">Character : </span>${amiibo.character}</br>
    <br><span class="text">Game Series : </span>${amiibo.gameSeries}</br>
    <br><span class="text">Release Date EU : </span>${amiibo.release.eu}</br>
    <input id="like" type="image" src="img/heart.png" class="heart contrast"><span id = "like" class="marked">Add to Bookmark</span>
    `;
    makeLikeFunction(amiibo)
} 
function makeLikeFunction(amiibo) {
    document.getElementById("like").addEventListener("click", (e) => {
        e.preventDefault();
        bookmarks = bookmarks.concat([[amiibo.tail, amiibo.name, amiibo.amiiboSeries]])
        console.log(bookmarks)
    })
}

function removeEverything() {
    document.getElementById("searched").innerHTML = ""
    document.getElementById("information").innerHTML = ""
    document.getElementById("picture").innerHTML = ""
    document.getElementById("bookmarked").innerHTML=""
}

function sayhitoBookmarks() {
    let listOfBookmarks = ""
    for (let amiibo of bookmarks) {
        listOfBookmarks = listOfBookmarks.concat('\n',`<div class="text" id="bookmark-${amiibo[0]}">${amiibo[1]} | ${amiibo[2]}</div><div class="text" id="delete-${amiibo[0]}"><input id = "makeDeletion" type="image" class = "delete" src="img/trash-bin.png"/></div>`)
    }
    document.getElementById("bookmarked").innerHTML = listOfBookmarks
    document.getElementById("books").style.display = "block";
    giveInteractionBooks()
    makeDeletion()
}
function giveInteractionBooks() {
    for (let i=0; i < bookmarks.length; i++) {
        document.getElementById(`bookmark-${bookmarks[i][0]}`).addEventListener("click", (e) => {
            e.preventDefault();
            console.log("are you there?")
            document.getElementById("bookmarked").innerHTML = ""
            const search = `https://www.amiiboapi.com/api/amiibo/?tail=${bookmarks[i][0]}`
            const amiibo = fetch(search)
                .then((res) => res = res.json())
                .then((data) => {
                    makedaAmiibo(data.amiibo[0])
                })
        })
    }    
}
function makeDeletion() {
    for (let i = 0; i < bookmarks.length; i++) {
        document.getElementById(`delete-${bookmarks[i][0]}`).addEventListener("click", (e) => {
            e.preventDefault();
            let currentBookmark = e.target.parentElement.id.slice(7)
            bookmarks = bookmarks.filter( bookmark => bookmark[0] !== currentBookmark)
            sayhitoBookmarks()
        })
}
}
function deleteEntry() {
    deletedAmiibos = deletedAmiibos.concat(currentAmiibo.tail)
    removeEverything()
}
function checkDeleted(data) {
    for (let [i,amiibo] of data.amiibo.entries()){
        if (deletedAmiibos.includes(amiibo.tail)) {
            data.amiibo.splice(i, 1);
        }
    }
    console.log(data)
    return data
}
function addNew(data) {
    data = data.amiibo.concat(newAmiibos)
    console.log(data)
    return data;
}
document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();
    let query = document.getElementById("searchField").value
    const data = `https://www.amiiboapi.com/api/amiibo/?character=${query}`
    const amiibo = fetch(data)
            .then((res) => res = res.json())
            .then((data) => data = checkDeleted(data))
            .then((data) => {
                createSearches(data)
                for(let j = 1; j <= data.amiibo.length; j++) {
                    document.getElementById(`suggest ${j}`).addEventListener("click", (f) => {
                    f.preventDefault()
                    document.getElementById('searched').innerHTML = "";
                    makedaAmiibo(data.amiibo[j-1])                    
                })}
            })
})
document.getElementById("bookmark").addEventListener("click", (e) => {
    e.preventDefault()
    console.log("hi")
    removeEverything();
    sayhitoBookmarks();
})

document.getElementById("newIt").addEventListener("submit", (e) => {
    e.preventDefault();
    let newAmiibo = {}
    newAmiibo.name = document.getElementById("newAmiibo").value
    newAmiibo.amiiboSeries = document.getElementById("newAmiiboSeries").value
    newAmiibo.character = document.getElementById("newCharacter").value
    newAmiibo.gameSeries = document.getElementById("newGameSeries").value
    newAmiibo.release = {}
    newAmiibo.release.eu = document.getElementById("newRelease").value
    newAmiibo.image = document.getElementById("newImg").value
    if (newAmiibos == []) {
        newAmiibo.tail = 1000000001
    } else {
        newAmiibo.tail = (1000000001+newAmiibos.length)
    }
    newAmiibos.push(newAmiibo)
    console.log(newAmiibo)
})