export class Player {
  isTouchingIce = false
  isJumping = false
  isMovingLeft = false
  isMovingRight = false
  isRespawning = false
  speed = 0
  coyoteLapse = 0.05
  death = 0

constructor(
    speed,
    jumpForce,
    nbLives,
    left,
    right,
    up,
    playerNumber,
    currentLevelScene,
    isInTerminalScene,
  ) {
    this.isInTerminalScene = isInTerminalScene
    this.currentLevelScene = currentLevelScene
    this.regSpeed = speed
    this.jumpForce = jumpForce
    this.lives = nbLives
    this.left = left
    this.right = right
    this.up = up
    this.playerNumber = playerNumber
    this.setPlayerControls()
    this.update()
  }

  isTouchEnabled() {
    return (( 'ontouchstart' in window ) || 
    ( navigator.maxTouchPoints > 0 ) || 
    ( navigator.msMaxTouchPoints > 0 ))
  }

  makePlayer(x, y, id, Scale) {
    this.initialX = x
    this.initialY = y
    this.gameObj = add([
      sprite("player", { anim : "idle" }),
      area({ shape: new Rect(vec2(0, 0), 15, 15) }),
      anchor("center"),
      pos(x, y),
      rotate(0),
      scale(Scale),
      body({ maxVelocity: 500, }),
      String(id),
    ])
  }

  Move(speed) {
  
    if (this.isMovingRight && !this.isRespawning) {
      if (this.gameObj.curAnim() !== "run") this.gameObj.play("run")
      if (!this.isTouchingIce)
        this.speed = this.regSpeed
      else this.speed += 5
        this.gameObj.flipX = false
    } else if (this.isMovingLeft && !this.isRespawning) {
      if (this.gameObj.curAnim() !== "run") this.gameObj.play("run")
      if (!this.isTouchingIce)
        this.speed = -this.regSpeed
      else this.speed -= 5
        this.gameObj.flipX = true
    } else {
      this.gameObj.play("idle")
      this.idle()
    }

    if (this.gameObj.paused) return
    //   if (this.gameObj.curAnim() !== "run") this.gameObj.play("run")
    // this.gameObj.flipX = true
    if (!this.isRespawning) this.gameObj.move(speed, 0)

    // this.isMoving = true
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

  bounce() {
    this.gameObj.jump(this.jumpForce * 2)
  }

  idle() {
    if (this.gameObj.paused) return
    // this.gameObj.play("idle")
    // this.isMoving = false
    if (!this.isTouchingIce) this.speed = 0
  }

  setPlayerControls() {
    onKeyDown(this.left, () => {
      // if (!this.isTouchingIce)
      // this.speed = -this.regSpeed
      // else this.speed -= 2
      // this.gameObj.flipX = true
      this.isMovingLeft = true
    })
    onKeyRelease(this.left, () => {
      // this.idle()  
      this.isMovingLeft = false
    })
    
    onKeyDown(this.right, () => {
      // if (!this.isTouchingIce)
      //   this.speed = this.regSpeed
      // else this.speed += 2
      // this.gameObj.flipX = false
      this.isMovingRight = true
    })
    onKeyRelease(this.right, () => {
      // this.idle()
      this.isMovingRight = false
    })
    onKeyDown(this.up, () => {this.jump()})


    if (this.isTouchEnabled()) {
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

  touchControls() {
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

  }
  
  respawnPlayers() {
    this.gameObj.use(body({ gravityScale: 0 }))
    this.gameObj.pos = vec2(this.initialX, this.initialY)
    this.gameObj.use(body({ gravityScale: 1 }))
    this.gameObj.angle = 0
    this.isRespawning = true
    setTimeout(() => this.isRespawning = false, 1000)
    this.speed = 0
  }
  
  update() {
    onUpdate(() => {
      // if (this.isTouchEnabled())  this.touchControls()

      if (this.gameObj.isGrounded()) {
        this.hasJumpedOnce = false
        this.timeSinceLastGrounded = time()
      }

      this.heightDelta = this.previousHeight - this.gameObj.pos.y
      this.previousHeight = this.gameObj.pos.y
    })
  }
}