function setCard(div, cardID, cardPos, noclick) {
    div.setAttribute("cardID", cardID);
    if (noclick != true) {
        div.addEventListener('click', (e) => {
            showCardInfo(e.currentTarget.getAttribute("cardID"), e.currentTarget.getAttribute("cardPos"));
        })
    }
    if (cardID == "") {
        div.style.backgroundImage = '';
        div.classList.remove("notEmpty")
    }
    else {
        div.setAttribute("cardPos", cardPos);
        div.style.backgroundImage = `url(../Images/${cardID}.jpg)`;
        div.classList.add("notEmpty")
    }
}

function setLeader(div, cardID, isAwake) {
    div.setAttribute("cardID", cardID);
    div.addEventListener('click', (e) => {
        showCardInfo(e.currentTarget.getAttribute("cardID"), "");
    })
    div.style.backgroundImage = `url(../Images/${cardID}.jpg)`;
    if (isAwake) div.classList.add("awaken");
    else div.classList.remove("awaken");
}

function cardPosToStr(cardPos) {
    if (cardPos == "") return "리더 존"

    const pos = cardPos.split('-')
    switch (pos[1]) {
        case 'unit':
            return `유닛 존 ${parseInt(pos[2]) + 1}`
        case 'hand':
            return `패`
        case 'deck':
            return `덱`
        case 'skill':
            return `스킬 존`
        case 'damage':
            return `데미지 존`
        case 'trash':
            return `트래시 존`
        case 'equip1':
            return '1열 유닛의 장비'
        case 'equip2':
            return '2열 유닛의 장비'
        case 'equip3':
            return '3열 유닛의 장비'
    }
}

const cardViews = {
    enemy: {
        leader: document.querySelector('#enemy .deck .leader'),
        level: document.querySelector('#enemy .level'),
        deck: document.querySelector('#enemy .deckBtn'),
        trash: document.querySelector('#enemy .trashBtn'),
        hand: document.querySelector('#enemy .handBtn'),
        damage: document.querySelectorAll('#enemy .damage .cardView'),
        damageBtn: document.querySelector('#enemy .damageBtn'),
        skill: document.querySelectorAll('#enemy .skill .cardView'),
        skillBtn: document.querySelector('#enemy .skillBtn'),
        unit: document.querySelectorAll('#enemy .unit'),
    },
    player: {
        leader: document.querySelector('#player .deck .leader'),
        level: document.querySelector('#player .level'),
        deck: document.querySelector('#player .deckBtn'),
        trash: document.querySelector('#player .trashBtn'),
        hand: document.querySelector('#player .handBtn'),
        damage: document.querySelectorAll('#player .damage .cardView'),
        damageBtn: document.querySelector('#player .damageBtn'),
        skill: document.querySelectorAll('#player .skill .cardView'),
        skillBtn: document.querySelector('#player .skillBtn'),
        unit: document.querySelectorAll('#player .unit'),
    },
}

function eulRul(str) {
    if (/[가-힣]$/.test(str)) {
        const unicode = str.charCodeAt(str.length - 1)
        const letterConsonant = (unicode - 44032) % 28
        return `${str}${!letterConsonant ? '를' : '을'}`
    }
    return str
}

function eeGa(str) {
    if (/[가-힣]$/.test(str)) {
        const unicode = str.charCodeAt(str.length - 1)
        const letterConsonant = (unicode - 44032) % 28
        return `${str}${!letterConsonant ? '가' : '이'}`
    }
    return str
}

const storage = window.localStorage;
let cardDB = JSON.parse(storage.getItem("cardDB"));
function getCardData(cardID) {
    if (cardDB[cardID]) {
        return cardDB[cardID]
    } else {
        cardDB = json.parse(storage.getItem("cardDB"));
        return getCardData(cardID)
    }
}

const newGame = {
    enemy: {
        leader: "ST08-001",
        level: 1,
        awaken: false,
        damage: [],
        skill: [],
        unit: ["", "", ""],
        equip: [[], [], []],
        trash: [],
        deck: [],
        hand: [],
    },
    player: {
        leader: "ST09-001",
        level: 1,
        awaken: false,
        damage: [],
        skill: [],
        unit: ["", "", ""],
        equip: [[], [], []],
        trash: [],
        deck: [],
        hand: [],
    }
}

const game = JSON.parse(JSON.stringify(newGame))

function applyGame() {
    setLeader(cardViews.enemy.leader, game.enemy.leader, game.enemy.awaken)
    setLeader(cardViews.player.leader, game.player.leader, game.player.awaken)

    cardViews.enemy.damage.forEach((value, key) => {
        if (game.enemy.damage.length <= key) {
            setCard(value, "", "", true)
            return
        }
        setCard(value, game.enemy.damage[key], `e-damage-${key}`, true)
    })
    cardViews.enemy.skill.forEach((value, key) => {
        if (game.enemy.skill.length <= key) {
            setCard(value, "", "", true)
            return
        }
        setCard(value, game.enemy.skill[key], `e-skill-${key}`, true)
    })
    cardViews.enemy.unit.forEach((value, key) => {
        if (game.enemy.unit.length <= key) {
            setCard(value, "", "", true)
            return
        }
        setCard(value, game.enemy.unit[key], `e-unit-${key}`)
        if (game.enemy.equip[key].length > 0) {
            value.setAttribute("hasEquip", "")
        } else {
            value.removeAttribute("hasEquip")
        }
    })
    cardViews.enemy.damageBtn.innerText = "데미지 (" + game.enemy.damage.length + ")";
    cardViews.enemy.level.innerText = "Lv." + game.enemy.level + " Size:" + (game.enemy.level + game.enemy.damage.length);

    cardViews.player.damage.forEach((value, key) => {
        if (game.player.damage.length <= key) {
            setCard(value, "", "", true)
            return
        }
        setCard(value, game.player.damage[key], `p-damage-${key}`, true)
    })
    cardViews.player.skill.forEach((value, key) => {
        if (game.player.skill.length <= key) {
            setCard(value, "", "", true)
            return
        }
        setCard(value, game.player.skill[key], `p-skill-${key}`, true)
    })
    cardViews.player.unit.forEach((value, key) => {
        if (game.player.unit.length <= key) {
            setCard(value, "", "", true) //안쓰이는부분
            return
        }
        setCard(value, game.player.unit[key], `p-unit-${key}`)
        if (game.player.equip[key].length > 0) {
            value.setAttribute("hasEquip", "")
        } else {
            value.removeAttribute("hasEquip")
        }
    })
    cardViews.player.damageBtn.innerText = "데미지 (" + game.player.damage.length + ")";
    cardViews.player.level.innerText = "Lv." + game.player.level + " Size:" + (game.player.level + game.player.damage.length);
}

const popupUI = document.getElementById("popupText")
function popup(text) {
    popupUI.classList.remove("disabled");
    popupUI.innerText = text;
    setTimeout(() => {
        popupUI.classList.add("disabled")
    }, 1000);
}

function addCardsToDiv(div, cards, cardPos) {
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
    for (i = 0; i < cards.length; i++) {
        const d = document.createElement("div");
        d.classList.add("cardView");
        div.appendChild(d);
        setCard(d, cards[i], `${cardPos}-${i}`);
    }
}

const cardInfoUI = document.querySelector(".cardInfoUI")
const cardInfoView = document.querySelector(".cardInfoUI .cardView")
function showCardInfo(cardID, cardPos) {
    if (cardID == "") return;
    setCard(cardInfoView, cardID, cardPos)
    cardInfoUI.showModal()
}

const deckSelectUI = document.getElementById("deckSelectUI")
const deckSelector = document.getElementById("deckSelector")
function chooseDeck() {
    const deckNames = JSON.parse(storage.getItem("deckNames"));
    while (deckSelector.firstChild) {
        deckSelector.removeChild(deckSelector.firstChild)
    }
    for (i = 0; i < deckNames.length; i++) {
        const o = document.createElement("option");
        o.setAttribute("value", deckNames[i])
        o.innerText = deckNames[i]
        deckSelector.appendChild(o);
    }
    deckSelectUI.showModal()
}
function setDeck() {
    const deckName = deckSelector.value
    const deck = JSON.parse(storage.getItem("deck-" + deckName))
    game.player.leader = deck.leader
    game.player.deck = deck.deck
    sendChat("덱을 설정했습니다.")
    deckSelectUI.close()
    sendGame()
    applyGame()
}

const cardsUI = document.querySelector('.cardsui')
function initGame() {
    cardViews.enemy.deck.addEventListener('click', (e) => { popup("상대 덱 " + game.enemy.deck.length + "장 남음") })
    cardViews.enemy.trash.addEventListener('click', (e) => {
        addCardsToDiv(document.querySelector('dialog div'), game.enemy.trash, 'e-trash')
        cardsUI.showModal()
        document.querySelector('.cards').scrollLeft = 0
    })
    cardViews.enemy.hand.addEventListener('click', (e) => { popup("상대 손 " + game.enemy.hand.length + "장 남음") })
    cardViews.enemy.damageBtn.addEventListener('click', (e) => {
        addCardsToDiv(document.querySelector('dialog div'), game.enemy.damage, 'e-damage')
        cardsUI.showModal()
        document.querySelector('.cards').scrollLeft = 0
    })
    cardViews.enemy.skillBtn.addEventListener('click', (e) => {
        addCardsToDiv(document.querySelector('dialog div'), game.enemy.skill, 'e-skill')
        cardsUI.showModal()
        document.querySelector('.cards').scrollLeft = 0
    })

    cardViews.player.deck.addEventListener('click', (e) => { popup("본인 덱 " + game.player.deck.length + "장 남음") })
    cardViews.player.trash.addEventListener('click', (e) => {
        addCardsToDiv(document.querySelector('dialog div'), game.player.trash, 'p-trash')
        cardsUI.showModal()
        document.querySelector('.cards').scrollLeft = 0
    })
    cardViews.player.hand.addEventListener('click', (e) => {
        addCardsToDiv(document.querySelector('dialog div'), game.player.hand, 'p-hand')
        cardsUI.showModal()
        document.querySelector('.cards').scrollLeft = 0
    })
    cardViews.player.damageBtn.addEventListener('click', (e) => {
        addCardsToDiv(document.querySelector('dialog div'), game.player.damage, 'p-damage')
        cardsUI.showModal()
        document.querySelector('.cards').scrollLeft = 0
    })
    cardViews.player.skillBtn.addEventListener('click', (e) => {
        addCardsToDiv(document.querySelector('dialog div'), game.player.skill, 'p-skill')
        cardsUI.showModal()
        document.querySelector('.cards').scrollLeft = 0
    })

    cardViews.player.unit.forEach((v, k) => {
        v.querySelector('.equip').addEventListener('click', (e) => {
            e.stopPropagation()
            viewEquip(`p-equip${k}`)
        })
    })
}

function draw() {
    if (game.player.deck.length <= 0) {
        popup("덱에 카드가 없습니다.")
        return;
    }
    game.player.hand.push(game.player.deck.shift())
    popup("카드를 1장 뽑았습니다.")
    sendChat("카드를 1장 뽑았습니다.")
    sendGame()
    applyGame()
}

function lvUp() {
    game.player.level += 1
    if (game.player.level > 10) {
        game.player.level = 1
    }
    sendGame()
    applyGame()
}
function awake() {
    game.player.awaken = !game.player.awaken
    sendChat(game.player.awaken ? "각성했습니다." : "각성이 해제되었습니다")
    sendGame()
    applyGame()
}
function deckTop() {
    if (game.player.deck.length <= 0) {
        popup("덱에 카드가 없습니다.")
        return;
    }
    showCardInfo(game.player.deck[0], "p-deck-0")
    sendChat("덱탑을 확인했습니다.")
}
function trashSkills() {
    game.player.trash = game.player.trash.concat(game.player.skill)
    game.player.skill = []
    sendChat("스킬 존을 비웠습니다.")
    sendGame()
    applyGame()
}
function shuffle() {
    let currentIndex = game.player.deck.length;

    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [game.player.deck[currentIndex], game.player.deck[randomIndex]] = [
            game.player.deck[randomIndex], game.player.deck[currentIndex]];
    }
    sendChat("덱을 셔플했습니다.")
    sendGame()
    applyGame()
}
function viewDeck() {
    addCardsToDiv(document.querySelector('.cards'), game.player.deck, 'p-deck')
    sendChat("덱 내부를 확인했습니다.")
    cardsUI.showModal()
    document.querySelector('.cards').scrollLeft = 0
}

function viewEquip(dest) {
    const cPos = dest.split('-');

    let from
    if (cPos[0] == 'e') from = game.enemy;
    if (cPos[0] == 'p') from = game.player;

    addCardsToDiv(document.querySelector('.cards'), from.equip[cPos[1].substring(5)], dest)
    cardsUI.showModal()
    document.querySelector('.cards').scrollLeft = 0
}

function moveCardTo(cardPos, cardDest, isTop) {
    const cPos = cardPos.split('-');

    let from
    if (cPos[0] == 'e') from = game.enemy;
    if (cPos[0] == 'p') from = game.player;

    const from2 = cPos[1].startsWith("equip") ? from["equip"][cPos[1].substring(5)] : from[cPos[1]]
    const cardID = from2[cPos[2]]
    if (cardDest.startsWith("equip")) {
        const pos = cardDest.substring(5)
        if (from.unit[pos] == "") {
            alert("유닛이 없는 곳에 장비할 수 없습니다.")
            return false
        }
        if (cPos[1] == "unit") {
            if (cPos[2] == pos) {
                alert("자신에게 자신을 장비할 수 없습니다.")
                return false
            }
            from2[cPos[2]] = ""
            if (from.equip[cPos[2]].length >= 0) {
                let texts = "";
                for (i = 0; i < from.equip[cPos[2]].length; i++) {
                    if (i != 0) texts += ", "
                    texts += getCardData(from.equip[cPos[2]][i]).name;
                }
                sendChat(`장비된 ${eeGa(texts)} 트래시되었습니다.`)
                from.trash = from.trash.concat(from.equip[cPos[2]])
                from.equip[cPos[2]] = []
            }
        } else {
            from2.splice(cPos[2], 1)
        }
        from.equip[pos].push(cardID)
    }
    else if (cardDest.startsWith("unit")) {
        const pos = cardDest.substring(4)
        if (cPos[1] == 'unit' && pos == cPos[2]) {
            alert("제자리로 이동시킬 수 없습니다")
            return false;
        }
        if (cPos[1].startsWith("equip") && pos == cPos[1].substring(5)) {
            alert("왜 장비랑 유닛 위치를 바꾸시려는 거에요...\n 선량한 개발자를 괴롭히지 마세요...")
            return false;
        }
        if (from.unit[pos] != "") {
            if (confirm(`${parseInt(pos) + 1}번 칸에 유닛이 있습니다. 트래시합니까?`)) {
                moveCardTo(`${cPos[0]}-unit-${pos}`, 'trash', false)
                if (cPos[1] == "unit") {
                    from2[cPos[2]] = ""
                    if (from.equip[cPos[2]].length >= 0) {
                        from.equip[pos] = from.equip[cPos[2]]
                        from.equip[cPos[2]] = []
                    }
                } else {
                    from2.splice(cPos[2], 1)
                }
                from.unit[pos] = cardID
            }
        } else {
            if (cPos[1] == "unit") {
                from2[cPos[2]] = ""
                if (from.equip[cPos[2]].length >= 0) {
                    from.equip[pos] = from.equip[cPos[2]]
                    from.equip[cPos[2]] = []
                }
            } else {
                from2.splice(cPos[2], 1)
            }
            from.unit[pos] = cardID
        }
    } else {
        if (cPos[1] == "unit") {
            from2[cPos[2]] = ""
            if (from.equip[cPos[2]].length >= 0) {
                let texts = "";
                for (i = 0; i < from.equip[cPos[2]].length; i++) {
                    if (i != 0) texts += ", "
                    texts += getCardData(from.equip[cPos[2]][i]).name;
                }
                sendChat(`장비된 ${eeGa(texts)} 트래시되었습니다.`)
                from.trash = from.trash.concat(from.equip[cPos[2]])
                from.equip[cPos[2]] = []
            }
        } else {
            from2.splice(cPos[2], 1)
        }
        if (isTop) {
            from[cardDest].push(cardID)
        } else {
            from[cardDest].unshift(cardID)
        }
    }
    return true;
}

function moveCurTo(cardDest, isTop) {
    const card = cardInfoView.getAttribute("cardID")
    const pos = cardInfoView.getAttribute("cardPos")

    let destStr = {
        "deck": "덱",
        "hand": "패로",
        "unit0": "유닛존 1로",
        "unit1": "유닛존 2로",
        "unit2": "유닛존 3으로",
        "damage": "데미지 존으로",
        "skill": "스킬 존으로",
        "trash": "트래시 존으로",
        "equip0": "유닛존 1의 장착으로",
        "equip1": "유닛존 2의 장착으로",
        "equip2": "유닛존 3의 장착으로",
    }[cardDest]

    if (cardDest == "deck") {
        destStr += isTop ? " 아래로" : " 위로"
    }

    if (moveCardTo(pos, cardDest, isTop) == false) return;

    if (pos.split[1] != "deck" || cardDest != "hand") {
        sendChat(`${eulRul(getCardData(card).name)} ${cardPosToStr(pos)}에서 ${destStr} 이동시켰습니다.`)
    } else {
        sendChat(`카드 한 장을 덱에서 손으로 가져왔습니다.`)
    }
    cardsUI.close()
    cardInfoUI.close()
    sendGame()
    applyGame()
}

function revealCard() {
    const card = cardInfoView.getAttribute("cardID")
    const pos = cardInfoView.getAttribute("cardPos")
    sendChat(`지목한 카드 -> ${cardPosToStr(pos)}의 ${getCardData(card).name}`)
}
function triggerCard() {
    const card = cardInfoView.getAttribute("cardID")
    const pos = cardInfoView.getAttribute("cardPos")
    sendChat(`${cardPosToStr(pos)} ${getCardData(card).name}의 효과 발동을 선언`)
    cardsUI.close()
    cardInfoUI.close()
}

function gameToJson() {
    return JSON.stringify(game);
}

function jsonToGame(gameJson) {
    const g = JSON.parse(gameJson)
    game.player = g.enemy;
    game.enemy = g.player;
    applyGame()
}

const chatBox = document.getElementById("chatBox")
const supabaseClient = supabase.createClient('https://wlzfxoyfnprrrsdxnilt.supabase.co', 'sb_publishable_VUpD6iMVMvrl13zOtR4z5Q_VvnHcZ1N')

const peer = new Peer();
let gConn = "noConn";
let peerId = "noID";
const openBtn = document.getElementById("openRoom")
const joinBtn = document.getElementById("joinRoom")
const joinModal = document.getElementById("RoomSelectUI")
const joinSelector = document.getElementById("RoomSelector")
peer.on('open', function (id) {
    console.log('My peer ID is: ' + id);
    peerId = id
    openBtn.addEventListener('click', () => {
        const roomName = prompt("방 제목을 입력하세요", "")
        if (roomName == "") return;
        isHost = true
        uploadRoom(roomName)
        openBtn.disabled = true
        joinBtn.disabled = true
    })
    joinBtn.addEventListener('click', async function () {
        rooms = await findRooms()
        for (const [key, value] of Object.entries(rooms)) {
            const o = document.createElement("option");
            o.setAttribute("value", value)
            o.innerText = key
            joinSelector.appendChild(o);
        }
        document.getElementById("joinRoom2").addEventListener('click', () => {
            console.log(joinSelector.value)
            const conn = peer.connect(joinSelector.value);
            conn.on('open', function () {
                popup("접속 성공")
            });
            initConn(conn)
            joinModal.close()
        })
        joinModal.showModal()
        openBtn.disabled = true
        joinBtn.disabled = true
    })
    joinBtn.disabled = false
    openBtn.disabled = false
});
peer.on('connection', function (conn) {
    popup("상대가 들어왔습니다");
    initConn(conn)
    setTimeout(()=>{
        console.log("sendGame")
        conn.send("UG" + gameToJson());
    }, 1000)
});
function sendGame() {
    if (gConn == "noConn") return;
    gConn.send("UG" + gameToJson());
}
function sendChat(chatText) {
    chatBox.value += "\n" + "나: " + chatText;
    chatBox.scrollTop = chatBox.scrollHeight;

    if (gConn == "noConn") return;
    gConn.send("CH" + chatText)
}
function sendPopup(popupText) {
    popup(text)
}
function initConn(conn) {
    conn.on('data', function (data) {
        if (data.startsWith("UG")) {
            jsonToGame(data.substring(2))
        }
        if (data.startsWith("CH")) {
            chatBox.value += "\n" + "적: " + data.substring(2)
            chatBox.scrollTop = chatBox.scrollHeight;
        }
        if (data.startsWith("PO")) {
            popup(data.substring(2))
        }
    });
    gConn = conn;
}
document.getElementById('chatui').onsubmit = function () {
    const data = this.text.value;

    if (gConn == "noConn") {
        /*
        const conn = peer.connect(data);
        conn.on('open', function () {
            initConn(conn)
            sendGame()
        });
        */
    } else {
        gConn.send("CH" + data);
    }
    return false
}
async function findRooms() {
    const rooms = {}

    const tenMinutesAgo = new Date(Date.now() - 300000).toISOString();
    const { data, error } = await supabaseClient
        .from('NivelSim')
        .select('*')
        .gte('created_at', tenMinutesAgo)
        .order('created_at', { ascending: true })

    console.log(data)
    data.forEach(e => {
        rooms[e.roomName] = e.peerID
    })
    return rooms
}
async function uploadRoom(roomName) {
    const { error } = await supabaseClient
        .from('NivelSim')
        .insert({ roomName: roomName, peerID: peerId })
}

chatBox.value=""
initGame()
applyGame()