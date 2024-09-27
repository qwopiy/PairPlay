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

  setPlayerControls() {
    onKeyDown("left", () => {
      if (this.gameObj.paused) return
    //   if (this.gameObj.curAnim() !== "run") this.gameObj.play("run")
      this.gameObj.flipX = true
      if (!this.isRespawning) this.gameObj.move(-this.speed, 0)
      this.isMoving = true
    })

    onKeyDown("right", () => {
      if (this.gameObj.paused) return
    //   if (this.gameObj.curAnim() !== "run") this.gameObj.play("run")
      this.gameObj.flipX = false
      if (!this.isRespawning) this.gameObj.move(this.speed, 0)
      this.isMoving = true
    })

    onKeyDown("up", () => {
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
    })

    onKeyRelease(() => {
      if (this.gameObj.paused) return
      if (isKeyReleased("right") || isKeyReleased("left")) {
        // this.gameObj.play("idle")
        this.isMoving = false
      }
    })
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
    })
  }
}