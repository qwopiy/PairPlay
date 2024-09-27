export class Player {

constructor(
    posX,
    posY,
    speed,
    jumpForce,
    nbLives,
    currentLevelScene,
    isInTerminalScene
  ) {
    this.isInTerminalScene = isInTerminalScene
    this.currentLevelScene = currentLevelScene
    this.makePlayer(posX, posY)
    this.speed = speed
    this.jumpForce = jumpForce
    this.lives = nbLives
    this.previousHeight = this.gameObj.pos.y
    this.setPlayerControls()
    this.update()
  }

  isTouchEnabled() {
    if (( 'ontouchstart' in window ) || ( navigator.maxTouchPoints > 0 ) || ( navigator.msMaxTouchPoints > 0 )) {
      const leftButton = add([
        sprite("leftButton"),
        pos(10, height() - 100),
        scale(2),
        opacity(0.5),
        fixed(),
        area(),
        "leftButton"
      ]);
      const rightButton = add([
        sprite("rightButton"),
        pos(140, height() - 100),
        scale(2),
        opacity(0.5),
        fixed(),
        area(),
        "rightButton"
      ]);
      const jumpButton = add([
        sprite("jumpButton"),
        pos(width() - 120, height() - 100),
        scale(2),
        opacity(0.5),
        fixed(),
        area(),
        "jumpButton"
      ]);
    }
  }

  makePlayer(x, y) {
    this.initialX = x
    this.initialY = y
    this.gameObj = add([
      sprite("player"),
      area({ shape: new Rect(vec2(0, 0), 16, 16) }),
      anchor("center"),
      pos(x, y),
      scale(4),
      body(),
      "player",
    ])
  }

  moveLeft(speed) {
    if (this.gameObj.paused) return
    //   if (this.gameObj.curAnim() !== "run") this.gameObj.play("run")
      this.gameObj.flipX = true
      if (!this.isRespawning) this.gameObj.move(-speed, 0)
      this.isMoving = true
  }

  moveRight(speed) {
    if (this.gameObj.paused) return
    //   if (this.gameObj.curAnim() !== "run") this.gameObj.play("run")
      this.gameObj.flipX = false
      if (!this.isRespawning) this.gameObj.move(speed, 0)
      this.isMoving = true
  }

  jump() {
    if (this.gameObj.paused) return
      if (this.gameObj.isGrounded() && !this.isRespawning) {
        this.hasJumpedOnce = true
        this.gameObj.jump(this.jumpForce)
        // play("jump")
      }

      //coyote time
      if (
        !this.gameObj.isGrounded() &&
        time() - this.timeSinceLastGrounded < this.coyoteLapse &&
        !this.hasJumpedOnce
      ) {
        this.hasJumpedOnce = true
        this.gameObj.jump(this.jumpForce)
        // play("jump")
      }
  }

  idle() {
    if (this.gameObj.paused) return
    if (isKeyReleased("right") || isKeyReleased("left")) {
      // this.gameObj.play("idle")
      this.isMoving = false
    }
  }

  setPlayerControls() {
    onKeyDown("left", () => {this.moveLeft(this.speed)})
    onKeyDown("right", () => {this.moveRight(this.speed)})
    onKeyDown("up", () => {this.jump()})
    onKeyRelease(() => {this.idle()})

    this.isTouchEnabled()
    
}

  respawnPlayer() {
    if (this.lives > 0) {
        this.gameObj.pos = vec2(this.initialX, this.initialY)
    }
  }

  update() {
    onUpdate(() => {
        if (this.gameObj.pos.y > 700) {
          this.respawnPlayer()
        }

        //touch controls
        onTouchStart((position) => {
          if (position.x < width() / 10) {
            this.isMovingLeft = true
          } else
          if (position.x > width() / 10 && position.x < (width() / 10) * 3) {
            this.isMovingRight = true
          } else{
            this.jump()
          }
        })
    
        onTouchEnd((position) => {
          if (position.x < width() / 10) {
            this.isMovingLeft = false
          }
          if (position.x > width() / 10 && position.x < (width() / 10) * 3) {
            this.isMovingRight = false
          }
        })

        if (this.isMovingLeft) {
          this.moveLeft(this.speed/2)
        }

        if (this.isMovingRight) {
          this.moveRight(this.speed/2)
        }
    })
  }
}