import GameControl from "./GameControl.js";
import GameEnv from "./GameEnv.js";
import Socket from "./Multiplayer.js";

const Leaderboard = {
    currentKey: "localTimes",
    currentPage: 1,
    rowsPerPage: 10,
    isOpen: false,
    detailed: false,

    getTimeSortedLeaderboardData (slowestFirst) {
        const localData = JSON.parse(localStorage.getItem(this.currentKey))
        if (!localData) {
            console.log("NO DATA")
            return []
        }
        localData.sort((a, b) => a.time - b.time);
        if (slowestFirst) {
            return localData.reverse()
        }

        return localData
    }, 

    getCoinScoreSortedLeaderboardData (highestFirst) {
        const localData = JSON.parse(localStorage.getItem(this.currentKey))
        if (!localData) {
            console.log("NO DATA")
            return []
        }
        localData.sort((a, b) => a.coinScore - b.coinScore);
        if (highestFirst) {
            return localData.reverse()
        }

        return localData
    }, 

    getDateSortedLeaderboardData (newestFirst) {
        const localData = JSON.parse(localStorage.getItem(this.currentKey))
        if (!localData) {
            console.log("NO DATA")
            return []
        }

        localData.sort((a, b) => {
            const dateA = new Date(a.date)
            const dateB = new Date(b.date)

            return dateA - dateB
        })
        //defaults to oldest first
        if (newestFirst) {
            return localData.reverse()
        }

        return localData
    },

    backgroundDim: {
        create () {
            console.log("CREATE DIM")
        },
        remove () {
            console.log("REMOVE DIM");
        }
    },

    createDetailToggledAndSort () {
        document.getElementById("detail-toggle-section")?.remove()

        const buttonSection = document.createElement("div")
        buttonSection.style.width = "100%"
        buttonSection.id = "detail-toggle-section"
        buttonSection.style.display = "flex"
        buttonSection.style.alignItems = "center"
        buttonSection.style.justifyContent = "center"
        const sortDropDown = document.createElement("label")
        sortDropDown.htmlFor = "sorts"
        sortDropDown.innerText = "Sort by: "
        buttonSection.append(sortDropDown)
        const sortOptions = document.createElement("select")
        sortOptions.name = "sorts"
        sortOptions.id = "sorts"

        buttonSection.append(sortOptions)
        const toggleButton = document.createElement("button")
        toggleButton.style.width = "20%"
        toggleButton.innerText = Leaderboard.detailed ? "[Close]":"[Expand]"
        buttonSection.append(toggleButton)
        
        toggleButton.addEventListener("click", this.toggleDetails)

        return buttonSection
    },

    createLeaderboardDisplayTable () {
        const table = document.createElement("table");
        table.className = "table scores"
        const header = document.createElement("tr");
        const th1 = document.createElement("th");
        th1.innerText = "Name";
        header.append(th1);
        const th2 = document.createElement("th");
        th2.innerText = "Time";
        header.append(th2);
        table.append(header);
        const th3 = document.createElement("th");
        th3.innerText = "Score ";
        header.append(th3);
        table.append(header);
        const th4 = document.createElement("th");
        th4.innerText = "Difficulty";
        th4.hidden = !Leaderboard.detailed
        header.append(th4);
        table.append(header);
        const th5 = document.createElement("th");
        th5.innerText = "Game Speed";
        th5.hidden = !Leaderboard.detailed
        header.append(th5);
        const th6 = document.createElement("th");
        th6.innerText = "Date";
        th6.hidden = !Leaderboard.detailed
        header.append(th6);
        table.append(header);

        return table
    },

    toggleDetails() {
        Leaderboard.detailed = !Leaderboard.detailed

        Leaderboard.updateLeaderboardDisplay()
    },

    createPagingButtonsRow() {
        const data = Leaderboard.getTimeSortedLeaderboardData()

        const pagingButtonsRow = document.createElement("div")
        pagingButtonsRow.id = "paging-buttons-row"
        pagingButtonsRow.style.display = "grid"
        pagingButtonsRow.style.gridTemplateColumns = "auto auto auto"
        pagingButtonsRow.style.textAlign = "center"
        pagingButtonsRow.style.width = "100%"

        const backButton = document.createElement("button")
        backButton.innerText = "<"
        backButton.style.width = "100%"
        pagingButtonsRow.append(backButton)

        const pageDisplay = document.createElement("span")
        pageDisplay.textContent = `${this.currentPage} of ${Math.ceil(data.length/Leaderboard.rowsPerPage)}`
        pagingButtonsRow.append(pageDisplay)
        // pagingButtonsRow.innerText = `${this.currentPage} of ${Math.ceil(data.length/Leaderboard.rowsPerPage)}`

        const frontButton = document.createElement("button")
        frontButton.innerText = ">"
        frontButton.style.width = "100%"
        pagingButtonsRow.append(frontButton)

        backButton.addEventListener("click", this.backPage)
        frontButton.addEventListener("click", this.frontPage)

        return pagingButtonsRow
    },

    createClearLeaderboardButton() {
        const clearButtonRow = document.createElement("div")
        clearButtonRow.id = "clear-button-row"
        clearButtonRow.style.textAlign = "center"
        const clearButton = document.createElement("button")
        clearButton.innerText = "CLEAR TABLE"
        clearButton.style.width = '50%'
        clearButtonRow.append(clearButton)

        clearButton.addEventListener("click", this.clearTable)

        return clearButtonRow
    },

    clearTable () {
        const table = document.getElementsByClassName("table scores")[0]

        localStorage.removeItem(Leaderboard.currentKey)

        Leaderboard.currentPage = 1

        if (table) {
            table.remove() //remove old table if it is there
        }
        Leaderboard.updateLeaderboardDisplay()
    },
    
    updateLeaderboardTable () {
        const data = this.getTimeSortedLeaderboardData()
        const table = this.createLeaderboardDisplayTable()
        const startPage = (this.currentPage-1)*this.rowsPerPage
        const displayData = data.slice(startPage, startPage+this.rowsPerPage)
        
        displayData.forEach(score => {
            const row = document.createElement("tr");
            const td1 = document.createElement("td");
            td1.innerText = score.userID;
            row.append(td1);
            const td2 = document.createElement("td");
            td2.innerText = (score.time/1000);
            row.append(td2);
            const td3 = document.createElement("td");
            td3.innerText = score.coinScore;
            row.append(td3);
            table.append(row);
            const td4 = document.createElement("td");
            if (score.difficulty) {
                td4.innerText = score.difficulty;
            }
            td4.hidden = !this.detailed
            row.append(td4);
            table.append(row);
            const td5 = document.createElement("td");
            if (score.gameSpeed) {
                td5.innerText = score.gameSpeed;
            }
            td5.hidden = !this.detailed
            row.append(td5);
            const td6 = document.createElement("td");
            if (score.date) {
                const date = new Date(score.date)
                td6.innerText = `${date.getMonth()+1}/${date.getDate()}`
            }
            td6.hidden = !this.detailed
            row.append(td6);
            table.append(row);
        });
        
        return table
    },

    updateLeaderboardDisplay () {
        const table = document.getElementsByClassName("table scores")[0]
        const detailToggleSection = document.getElementById("detail-toggle-section")
        const clearButtonRow = document.getElementById("clear-button-row")
        const pagingButtonsRow = document.getElementById("paging-buttons-row")

        if (detailToggleSection) {
            detailToggleSection.remove()
        }

        if (table) {
            table.remove() //remove old table if it is there
        }

        if (pagingButtonsRow) {
            pagingButtonsRow.remove()
        }

        if (clearButtonRow) {
            clearButtonRow.remove()
        }

        document.getElementById("leaderboardDropDown").append(Leaderboard.createDetailToggledAndSort())
        document.getElementById("leaderboardDropDown").append(Leaderboard.updateLeaderboardTable()) //update new leaderboard
        document.getElementById("leaderboardDropDown").append(Leaderboard.createPagingButtonsRow())
        document.getElementById("leaderboardDropDown").append(Leaderboard.createClearLeaderboardButton())
    },

    backPage () {
        const table = document.getElementsByClassName("table scores")[0]

        if (Leaderboard.currentPage - 1 == 0) {
            return;
        }
    

        Leaderboard.currentPage -= 1

        Leaderboard.updateLeaderboardDisplay()
    },
    
    frontPage () {
        const data = Leaderboard.getTimeSortedLeaderboardData()

        console.log(data.length/Leaderboard.rowsPerPage)

        if (Leaderboard.currentPage + 1 > Math.ceil(data.length/Leaderboard.rowsPerPage)) {
            return
        }

        Leaderboard.currentPage += 1

        Leaderboard.updateLeaderboardDisplay()
        
    },

    openLeaderboardPanel () {
            leaderboardTitle.innerHTML = "Local Leaderboard";

            // toggle isOpen
            this.isOpen = !this.isOpen;
            // open and close properties for sidebar based on isOpen
            const table = document.getElementsByClassName("table scores")[0]
            if (!this.isOpen) {
                Leaderboard.backgroundDim.remove()
            }
            if (this.isOpen) {
                Leaderboard.backgroundDim.create()
                if (table) {
                    table.remove() //remove old table if it is there
                }
                Leaderboard.updateLeaderboardDisplay()
            }

            const leaderboardDropDown = document.querySelector('.leaderboardDropDown');
            leaderboardDropDown.style.width = this.isOpen?"70%":"0px";
            leaderboardDropDown.style.top = this.isOpen?"15%":"0px";
            leaderboardDropDown.style.left = this.isOpen?"15%":"0px";
    },

    initializeLeaderboard () {
        const leaderboardTitle = document.createElement("div");
        leaderboardTitle.id = "leaderboardTitle";
        document.getElementById("leaderboardDropDown").appendChild(leaderboardTitle);
        document.getElementById("leaderboardDropDown").append(this.updateLeaderboardTable())

        document.getElementById("leaderboard-button").addEventListener("click",Leaderboard.openLeaderboardPanel)
    },

}
    
export default Leaderboard;