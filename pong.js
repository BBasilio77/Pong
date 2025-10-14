

class Ball {
    x
    y
    radius
    dx
    dy

    //initializer
    constructor(x, y) {
        this.x = x
        this.y = y
        this.radius = 50

        this.dx = 2
        this.dy = 3    //You change the speed based on dx and dy

        this.radius = 5

    }
    draw(ctx) {
        ctx.fillStyle = "rgb(0 0 0)"
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill()


    }
    animate() {
        this.x = this.x + this.dx
        this.y = this.y + this.dy

        //ball bounce
        
        if ((this.y > (360 - this.radius)) || (this.y < (0 + this.radius))) {
            this.dy = -this.dy
        }

    }


}

//drawing the paddle (updated)

class Paddle {
    x
    y
    dx
    dy

    constructor(x, y) {
        this.x = x
        this.y = y
        this.dx = 0
        this.dy = 0
        this.width = 10
        this.height = 50

    }
    draw(ctx) {
        ctx.fillStyle = "rgb(255 140 0)"
        ctx.fillRect(this.x - (this.width / 2),
            this.y - (this.height / 2),
            this.width, this.height)


    }

    animate() {
        this.x = this.x + this.dx
        this.y = this.y + this.dy
    }




}



function circle_rect_sdf(circle, rect) {
    vec_x = circle.x - rect.x
    vec_y = circle.y - rect.y
    dist_to_rect_x = Math.abs(vec_x) - (rect.width / 2)
    dist_to_rect_y = Math.abs(vec_y) - (rect.height / 2)
    nearest_rect_dist = Math.max(dist_to_rect_x, dist_to_rect_y)
    signed_distance = nearest_rect_dist - circle.radius
    return signed_distance
}






var ctx

const INTRO = 0
const PLAYING = 1
const SCORE1 = 2
const SCORE2 = 3
const GAMEOVER = 4

const PLAYER1 = 1
const PLAYER2 = 2


const MAXSCORE = 3
class Pong {


    constructor() {
       
       //getting canvas + context
        const canvas = document.getElementById("pong")
        this.ctx = canvas.getContext("2d")

            this.ctx.scale(2, 2)

        
        this.ctx.textAlign = "center"
        this.ctx.textBaseline = "middle"
        this.ctx.font = "48px roboto"
    
        //creating the ball and the paddles
        this.leftpaddle = new Paddle(20, 180)
        this.rightpaddle = new Paddle(460, 180)
        this.ball = new Ball(240, 180)
        
        this.new_game()
        
            //adding the event listeners
        document.addEventListener("keydown", this.pong_keydown.bind(this))
        document.addEventListener("keyup", this.pong_keyup.bind(this))
    
        this.frame()
    }
    end_round(player) {
       this.leftpaddle.dy = 0 
        this.rightpaddle.dy = 0
        if (player == PLAYER1) {
            this.player1 += 1
             this.gamestate = SCORE1
         }       
       
        else if (player == PLAYER2) {
            this.player2 +=1
            this.gamestate = SCORE2
        }
        if (this.player1 == MAXSCORE) {
            this.gamestate = GAMEOVER
            }
        if (this.player2 == MAXSCORE) {
            this.gamestate = GAMEOVER
        }
    }



    






    new_round() {
        this.ball.x = 240   
        this.ball.y = 180
        this.ball.dx = (Math.random() * 2) + 1
        if (Math.random() > 0.5) {
           this.ball.dx *= -1 
        }
        this.ball.dy = (Math.random() * 2) + 1
        if (Math.random() > 0.5) {
           this.ball.dy *= -1 
        }
        
        this.gamestate = PLAYING
    }


    new_game() {
        this.new_round()
        this.player1 = 0
        this.player2 = 0        
        this.gamestate = INTRO

    }





    pong_keydown(event) {
        if (this.gamestate == PLAYING) {
            if (event.key == "ArrowDown") {
                this.rightpaddle.dy = 10
            }
            if (event.key == "ArrowUp") {
                this.rightpaddle.dy = -10
            }
            if (event.key == "s") {
                this.leftpaddle.dy = 10
        
            }
            if (event.key == "w") {
                this.leftpaddle.dy = -10
            }

        }
        else if (this.gamestate == INTRO) {
            if (event.key == " ") {
              this.new_round()
            }
        }
        else if ((this.gamestate == SCORE1) || (this.gamestate == SCORE2)) {
            if (event.key == " ") {
                this.new_round()
            }
        }        
        else if (this.gamestate == GAMEOVER) {
            if (event.key == " ") {
                    this.new_game()
            }
        }
       
    
    }
    pong_keyup(event) {
        if (this.gamestate == PLAYING){
            if (event.key == "ArrowDown") {
                this.rightpaddle.dy = 0
            }
            if (event.key == "ArrowUp") {
                this.rightpaddle.dy = 0
            }
            if (event.key == "s") {
                this.leftpaddle.dy = 0
            }
            if (event.key == "w") {
                this.leftpaddle.dy = 0
            }
       
        } 
    }






    frame() {

            //clearing the canvas
        this.ctx.fillStyle = "rgb"
        this.ctx.clearRect(0, 0, 480, 360)

        //drawing the paddles and the ball
        this.leftpaddle.draw(this.ctx)
        this.rightpaddle.draw(this.ctx)
        this.ball.draw(this.ctx)

        //drawing the player scores
        this.ctx.font = "48px roboto"
         this.ctx.fillText(`${this.player1}`, 30, 330)   
            this.ctx.fillText(`${this.player2}`, 450, 330) 

        if (this.gamestate == INTRO) {
            this.ctx.font = "24px roboto"
            this.ctx.fillText("First to 3 points wins, press SPACE to start.", 240, 240) 
 
        }
        
        
        
        
       else if (this.gamestate == PLAYING) {


          //animating the ball & paddles
            this.leftpaddle.animate()
            this.rightpaddle.animate()
            this.ball.animate()
        

            if (circle_rect_sdf(this.ball, this.leftpaddle) <= 0) {
                this.ball.dx *= -1.2

            }
            if (circle_rect_sdf(this.ball, this.rightpaddle) <= 0) {
                this.ball.dx *= -1.2
            }

            if (this.ball.x > (480 - this.ball.radius)) {
                this.end_round(PLAYER1)
            }
            if (this.ball.x < (0 + this.ball.radius)) {
                this.end_round(PLAYER2)
            }

           
        } else if (this.gamestate == SCORE1) {
             this.ctx.font = "48px roboto"
            this.ctx.fillText("SCORE PLAYER 1!", 240, 180)  
            this.ctx.font = "24px roboto"
            this.ctx.fillText("Press SPACE to continue.", 240, 240)

            }
        else if (this.gamestate == SCORE2) {
            this.ctx.font = "48px roboto"
            this.ctx.fillText("SCORE PLAYER 2!", 240, 180)  
            this.ctx.font = "24px roboto"
            this.ctx.fillText("Press space to continue.", 240, 240)    

        }  
        else if (this.gamestate == GAMEOVER) {
                if (this.player1 == MAXSCORE) {
                    this.ctx.fillText("PLAYER 1 WINS!", 240, 180)
                    this.ctx.font = "24px roboto"
                    this.ctx.fillText("Press SPACE to reset the game.", 240, 240)
            }
            if (this.player2 == MAXSCORE) {
                this.ctx.fillText("PLAYER 2 WINS!", 240, 180)
                this.ctx.font = "24px roboto"
                this.ctx.fillText("Press SPACE to reset the game.", 240, 240)
                
            }
            }
       

        //next frame
        window.requestAnimationFrame(this.frame.bind(this))
   
    } 
}




var pongGame
function pong() {
 pongGame = new Pong()   


}