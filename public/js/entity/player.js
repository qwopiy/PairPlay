export class Player {
  isTouchingIce = false
  isJumping = false
  isMovingLeft = false
  isMovingRight = false
  isRespawning = false
  win = false
  isPushing = false
  speed = 0
  coyoteLapse = 0.05
  death = 0
  walk = play("walk", { volume: 1, loop: true, paused: true })

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
      sprite(`player${this.playerNumber}`, { anim : "idle" }),
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
    if (this.gameObj.paused) return
    if (this.isMovingRight && !this.isRespawning) {
      if (this.gameObj.curAnim() !== "run" 
          && this.gameObj.isGrounded() 
          && !this.isPushing) {
        {this.gameObj.play("run")
        this.walk.seek(0)
        this.walk.paused = false}
      }
      else if (this.gameObj.curAnim() !== "push" 
              && this.gameObj.isGrounded() 
              && this.isPushing) {
        {this.gameObj.play("push") 
        this.walk.seek(0)
        this.walk.paused = false}
      }
        
      if (!this.isTouchingIce)
        this.speed = this.regSpeed
      else 
        this.speed += 4
      
      this.gameObj.flipX = false
    } else if (this.isMovingLeft && !this.isRespawning) {
      if (this.gameObj.curAnim() !== "run" 
          && this.gameObj.isGrounded() 
          && !this.isPushing) {
        {this.gameObj.play("run")
        this.walk.seek(0)
        this.walk.paused = false}
      }
      else if (this.gameObj.curAnim() !== "push" 
              && this.gameObj.isGrounded() 
              && this.isPushing) {
        {this.gameObj.play("push") 
        this.walk.seek(0)
        this.walk.paused = false}
      }

      if (!this.isTouchingIce)
        this.speed = -this.regSpeed
      else 
        this.speed -= 5
      
      this.gameObj.flipX = true
    } else {
      if (this.gameObj.isGrounded()) this.gameObj.play("idle")
      this.walk.paused = true
      this.idle()
    }

    if (!this.isRespawning && !this.win) this.gameObj.move(speed, 0)
  }

  jump() {
    if (this.gameObj.paused) return
      if (this.gameObj.isGrounded() && !this.isRespawning) {
        this.hasJumpedOnce = true
        this.gameObj.jump(this.jumpForce)
        this.gameObj.play("jump")
        play("jump", { volume: 0.6 })
      }

      //coyote time
      if (
        !this.gameObj.isGrounded() &&
        time() - this.timeSinceLastGrounded < this.coyoteLapse &&
        !this.hasJumpedOnce
      ) {
        this.hasJumpedOnce = true
        this.gameObj.jump(this.jumpForce)
        this.gameObj.play("jump")
        play("jump", { volume: 0.6 })
      }
  }

  bounce() {
    play("bounce", { volume: 1})
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
    onKeyPress(this.up, () => {
      this.jump()
    })


    if (this.isTouchEnabled()) {
      const leftButton = add([
        sprite("moveButton", { anim: "left" }),
        pos(40, height() - 100),
        scale(2),
        opacity(0.5),
        fixed(),
        area(),
        "leftButton"
      ]);
      const rightButton = add([
        sprite("moveButton", { anim: "right" }),
        pos(200, height() - 100),
        scale(2),
        opacity(0.5),
        fixed(),
        area(),
        "rightButton"
      ]);
      const jumpButton = add([
        sprite("moveButton", { anim: "jump" }),
        pos(width() - 120, height() - 100),
        scale(2),
        opacity(0.5),
        fixed(),
        area(),
        "jumpButton"
      ]);
    }
}

  // fix later
  // touchControls() {
  //   onTouchStart((position) => {
  //     if (position.x < width() / 10) {
  //       this.isMovingLeft = true
  //     } else
  //     if (position.x > width() / 10 && position.x < (width() / 10) * 3) {
  //       this.isMovingRight = true
  //     } else{
  //       this.jump()
  //     }
  //   })

  //   onTouchEnd((position) => {
  //     if (position.x < width() / 10) {
  //       this.isMovingLeft = false
  //     }
  //     if (position.x > width() / 10 && position.x < (width() / 10) * 3) {
  //       this.isMovingRight = false
  //     }
  //   })

  // }
  
  respawnPlayers() {
    this.gameObj.use(body({ gravityScale: 0 }))
    this.gameObj.pos = vec2(this.initialX, this.initialY)
    this.gameObj.use(body({ gravityScale: 1 }))
    this.gameObj.angle = 0
    this.win = false
    this.isRespawning = true
    setTimeout(() => this.isRespawning = false, 100)
    this.speed = 0
  }
  
  update() {
    onUpdate(() => {
      if (this.gameObj.isGrounded()) {
        this.hasJumpedOnce = false
        this.timeSinceLastGrounded = time()
      }

      this.heightDelta = this.previousHeight - this.gameObj.pos.y
      this.previousHeight = this.gameObj.pos.y

      if (
        !this.gameObj.isGrounded() &&
        this.heightDelta > 0 &&
        this.gameObj.curAnim() !== "jump-up"
      ) {
        this.gameObj.play("jump-up")
      }

      if (
        !this.gameObj.isGrounded() &&
        this.heightDelta < 0 &&
        this.gameObj.curAnim() !== "jump-down"
      ) {
        this.gameObj.play("jump-down")
      }

    })
  }
}