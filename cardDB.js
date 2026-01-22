(() => {
    const storage = window.localStorage;

    async function getCardDB(data) {
        try {
            const response = await fetch("cardData.json");

            const result = await response.json();
            console.log("성공:", result);

            const cardDB = {}
            result.forEach(element => {
                cardDB[element.cardId] = element;
            });
            storage.setItem("cardDB", JSON.stringify(cardDB))

        } catch (error) {
            console.error("실패:", error);
        }
    }

    if (storage.getItem("cardDB") == null) {
        getCardDB()
    }
})()