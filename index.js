
var userSign = "";
var computerSign = "";
var userCanMove = false;
$(".board").toggle();

$("#choose-sign button").click(
    function () {
        console.log("clicked");

        userSign = $(this).attr("class");
        computerSign = (userSign == "cross") ? "circle" : "cross";

        $("#choose-sign").toggle();
        $(".board").toggle();
        $("#decision-container").hide();

        var possibleMoves = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        var cells = 9;
        var gameActive = true;

        $("#turn").text("Your Turn");
        userCanMove = true;

        $("[t-cell]").off("click").on("click", function () {
            if (!userCanMove || !gameActive) {
                $("#decision-container").show();
                return;
            }
            var userCellPlayed = parseInt($(this).attr("t-cell"));
            if (possibleMoves[userCellPlayed] === -1) {
                return;
            }
            $(this).addClass(userSign);
            let userSignAudio=new Audio(userSign+".mp3");
            userSignAudio.play();
            possibleMoves[userCellPlayed] = -1;
            cells--;

            let isWinner = checkWins();
            if (isWinner !== "") {
                gameActive = false;
                $("#decision-container").show();
                let winner = (isWinner == userSign) ? "You" : "Computer ";
                $("#turn").text(winner + " Win");
                let statusAudio1=new Audio(((isWinner==userSign)?"victory":"lose")+".mp3");
                statusAudio1.play();
                return;
            }

            if (cells <= 0) {
                gameActive = false;
                $("#turn").text("Game Over");
                $("#decision-container").show();
                return;
            }

            // computer turn
            userCanMove = false;
            $("#turn").text("Computer Turn");
            setTimeout(
                function () {
                    var availableMoves = possibleMoves.map((val, idx) => val !== -1 ? idx : -1).filter(i => i !== -1);
                    if (availableMoves.length == 0) {
                        gameActive = false;
                        $("#turn").text("Game Over");
                        $("#decision-container").show();
                        return;
                    }
                    var computerCellPlayed = availableMoves[Math.floor(Math.random() * availableMoves.length)];
                    // $("[t-cell]:eq(" + computerCellPlayed + ")").addClass(computerSign);
                    $("[t-cell='" + computerCellPlayed + "']").addClass(computerSign);
                    let computerSignAudio=new Audio(computerSign+".mp3");
                    computerSignAudio.play();
                    possibleMoves[computerCellPlayed] = -1;
                    let isWinner = checkWins();
                    if (isWinner !== "") {
                        gameActive = false;
                        let winner = (isWinner == userSign) ? "You" : "Computer";
                        $("#turn").text(winner + " Win");
                        $("#decision-container").show();
                        let statusAudio2=new Audio(((isWinner==userSign)?"victory":"lose")+".mp3");
                        statusAudio2.play();
                        return;
                    }
                    cells--;
                    if (cells <= 0) {
                        gameActive = false;
                        $("#turn").text("Game Over");
                        $("#decision-container").show();
                        return;
                    }
                    $("#turn").text("Your Turn");
                    userCanMove = true;
                }, 1000);
        }
        );
    }
);

function checkWins() {
    let targetPattern = [[0, 1], [3, 1], [6, 1], [0, 3], [1, 3], [2, 3], [0, 4], [2, 2]];
    for (let i = 0; i < targetPattern.length; i++) {
        let coord = targetPattern[i][0];
        let curSign = $("[t-cell]:eq(" + coord + ")").attr("class");
        if (curSign !== "circle" && curSign !== "cross") {
            continue;
        }
        let isWin = true;
        for (let j = 1; j < 3; j++) {
            coord += targetPattern[i][1];
            if ($("[t-cell]:eq(" + coord + ")").attr("class") != curSign) {
                isWin = false;
            }
        }
        if (isWin) {
            return curSign;
        }
    }
    return "";
}

$(".decision").click(
    function restartOrQuit() {
        $("[t-cell]").removeClass("cross circle");
        userSign = "";
        computerSign = "";
        userCanMove = false;
        possibleMoves = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        cells = 9;
        gameActive = true;
        $("#choose-sign").show();
        $(".board").hide();
        $("#decision-container").hide();
    }
);