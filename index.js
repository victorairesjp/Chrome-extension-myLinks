const inputEl = document.getElementById("input-el")
const openAllEl = document.getElementById("openAll-btn")
const addLinkEl = document.getElementById("addLink-btn")
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
        let label
        try {
            const url = list[i].startsWith("http") ? list[i] : "https://" + list[i]
            label = new URL(url).hostname.replace(/^www\./, "")
        } catch (_) {
            label = list[i]
        }
        listLinks += `
            <li>
                <a target='_blank' href='${list[i]}' title='${list[i]}'>
                    ${label}
                </a>
                <button class='btn-delete-item' data-index='${i}' title='Remover link'>
                    &times;
                </button>
            </li>
        `
    }
    ulEl.innerHTML = listLinks

    // Adiciona evento de clique nos botões de deletar individuais
    document.querySelectorAll(".btn-delete-item").forEach(function(btn) {
        btn.addEventListener("click", function() {
            const index = parseInt(this.getAttribute("data-index"))
            myLinks.splice(index, 1)
            localStorage.setItem("myLinks", JSON.stringify(myLinks))
            render(myLinks)
        })
    })

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




// Função para deletar todos os links da lista (myLinks)
clearAllEl.addEventListener("dblclick", function() {
    myLinks = []
    render(myLinks)
})