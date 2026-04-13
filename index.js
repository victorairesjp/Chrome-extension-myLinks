const inputEl = document.getElementById("input-el")
const openAllEl = document.getElementById("openAll-btn")
const addLinkEl = document.getElementById("addLink-btn")
const deleteLinkEl = document.getElementById("deleteLink-btn")
const clearAllEl = document.getElementById("clearAll-btn")
const ulEl = document.getElementById("ul-el")
const loadFromLocalStorage = JSON.parse(localStorage.getItem("myLinks"))
let myLinks = []

if (loadFromLocalStorage) {
    myLinks = loadFromLocalStorage
    render(myLinks)
}


// Função para add link na lista de links (myLinks)
addLinkEl.addEventListener("click", function() {
    if (inputEl.value !== "") {
        myLinks.push(inputEl.value)
        inputEl.value = ""
        localStorage.setItem("myLinks", JSON.stringify(myLinks))
        render(myLinks)
    } else {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            myLinks.push(tabs[0].url)
            localStorage.setItem("myLinks", JSON.stringify(myLinks))
            render(myLinks)
        })
    }
})


// Função para renderizar a lista de links (myLinks)
function render(list) {
    let listLinks = ""
    for (let i = 0; i < list.length; i++) {
        listLinks += `
            <li>
                <a target='_blank' href='${list[i]}'>
                    ${list[i]}
                </a>
            </li>
        `
    }
    ulEl.innerHTML = listLinks

    const emptyState = document.getElementById("empty-state")
    if (emptyState) {
        emptyState.style.display = list.length === 0 ? "block" : "none"
    }
}


// Função para abrir todos os links da lista (myLinks)
openAllEl.addEventListener("click", function() {
    for (let i = 0; i < myLinks.length; i++) {
        const url = myLinks[i].startsWith("http://") || myLinks[i].startsWith("https://")
            ? myLinks[i]
            : "https://" + myLinks[i]
        chrome.tabs.create({ url: url })
    }
})


// Função para deletar um link da lista (myLinks)
deleteLinkEl.addEventListener("dblclick", function() {
    myLinks.pop()
    render(myLinks)
})


// Função para deletar todos os links da lista (myLinks)
clearAllEl.addEventListener("dblclick", function() {
    myLinks = []
    render(myLinks)
})