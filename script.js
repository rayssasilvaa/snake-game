//criando variaveis, e importando o conteudo
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const score = document.querySelector(".score--value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector (".menu-screen")
const btnPlay = document.querySelector(".btn-play")
const audio = new Audio("../assets/audio.mp3")

//tamanho dos elementos
const size = 30;

const initialPosition = { x: 270, y: 240}

//array da cobra
let snake = [initialPosition]

//adiciona eventos de toque para controlar o movimento
let touchStartX = 0;
let touchStartY = 0;

//funçao para adicionar +10 no score quando a cobra comer
const incrementScore = () => {
    score.innerText = +score.innerText + 10
}

//funçao para gerar numeros aleatório
const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}


//funçao para comida ter posiçao aleatoria
const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

//rgb da comida
const randomColor = () => {
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}


//variavel da comida
const food = {
   x: randomPosition(),
   y: randomPosition(),
   color: randomColor()
}

//variavel para a direçao
let direction, loopId

//funçao food
const drawFood = () => {

    const {x, y, color} = food

    ctx.shadowColor = color
    ctx.shadowBlur = 7
    ctx.fillStyle = color
    ctx.fillRect(food.x, food.y, size, size)
    ctx.shadowBlur = 0
} 

//funçao para desenhar a cobra
const drawSnake = () => {
    ctx.fillStyle = "#33cc50"
    
//funçao para mudar posiçao da cobra
    snake.forEach((position, index) =>  {

//condiçao para mudar a cor do primerio retangulo
        if(index == snake.length - 1){
            ctx.fillStyle = "green"
           
        }

        ctx.fillRect(position.x, position.y, size, size)
    })
}

//funçao para mover a cobra
const moveSnake = () => {
 
    if(!direction) return

    const head = snake[snake.length -1]

    if(direction == "right") {
        snake.push({x: head.x + size, y: head.y })
    }

    if(direction == "left") {
        snake.push({x: head.x - size, y: head.y })
    }

    if(direction == "down") {
        snake.push({x: head.x, y: head.y + size })
    }

    if(direction == "up") {
        snake.push({x: head.x, y: head.y - size })
    }

    snake.shift()
}

//criaçao grid
const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    for(let i = 30; i < canvas.width; i += 30){
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
    
}

//funçao para a comida mudar de posicao
const chackEat = () => {
    const head = snake[snake.length -1]

    if(head.x == food.x && head.y == food.y) {
        incrementScore()
        snake.push(head)
        audio.play()

        let x = randomPosition()
        let y = randomPosition()

        while(snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
        food.color = randomColor()
    }
}

//funçao para checkar se bater na parede
const chackCollision = () => {
    const head = snake[snake.length -1]
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2
    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if(wallCollision || selfCollision){
        gameOver()
    }
    
}

//funçao gameover
const gameOver = () => {
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(5px)"

}

//loop para o jogo 
const gameLoop= () => {
    clearInterval(loopId)

    ctx.clearRect(0, 0, 600, 600)
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    chackEat()
    chackCollision()
    
    loopId = setTimeout(() => {
        gameLoop()
    }, 300)
}

gameLoop()

//add as teclas de movimento
document.addEventListener("keydown", ({ key }) => {
    if(key == "d" && direction != "left"){
        direction = "right"
    }

    if(key == "a" && direction != "right"){
        direction = "left"
    }

    if(key == "s" && direction != "up"){
        direction = "down"
    }

    if(key == "w" && direction != "down"){
        direction = "up"
    }
})

//funçao para movimentação mobile
document.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
})

//declarando os movimentos mobile
document.addEventListener("touchmove", (event) => {
    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if(Math.abs(dx) > Math.abs(dy)) {
        if(dx > 0 && direction !== "left") {
            direction = "right";
        } else if(dx < 0 && direction !== "right"){
            direction = "left";
        }
    } else {
        if(dy > 0 && direction !== "up"){
            direction = "down";
        } else if (dy < 0 && direction !== "down") {
            direction = "up";
        }
    }
})

//criando funçao para o botão
btnPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [initialPosition]
})