let random = function (min, max) {
    if (arguments.length < 2) {
        max = min
        min = 0
    } else if (min > max) {
        min = [max, max = min][0]
    }
    return Math.floor(Math.random() * (max - min + 1)) + min
}
let getRow = function (index, allNumber, rowAllNumber) {
    let row = 1
    for (let i = 0; i < allNumber; i++) {
        if (i > (allNumber / rowAllNumber * row - 1)) {
            ++row
        }
        if (i >= index) {
            break
        }
    }
    return row
}

class Point {
    constructor() {
        this.ctx = document.getElementById('main-canvas').getContext('2d')
        this.onOrder = false
        this.radius = random(1, 4.5)
        this.orderRadius = 6
        this.alpha = random(3, 5)
        this.x = window.innerWidth / 2
        this.y = window.innerHeight / 2
        this.text = ''
    }

    render() {
        let ctx = this.ctx
        ctx.save()
        ctx.beginPath()
        if (this.onOrder) {
            ctx.fillStyle = `rgba(255,255,255,${this.alpha / 10}`
            ctx.arc(this.x, this.y, this.orderRadius, 0, Math.PI * 2)
        } else {
            ctx.fillStyle = `rgba(255,255,255,${this.alpha / 10}`
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        }


        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }
}

class Canvas {
    constructor() {
        let mainCanvas = document.getElementById('main-canvas')
        let textCanvas = document.getElementById('text-canvas')
        let input = document.querySelector('input')
        this.ctx = mainCanvas.getContext('2d')
        this.textCtx = textCanvas.getContext('2d')
        this.windowWidth = mainCanvas.width = window.innerWidth
        this.windowHeight = mainCanvas.height = window.innerHeight
        this.textCtx.fillStyle = '#fff'
        this.textCtx.textBaseline = 'top'
        window.addEventListener('resize', () => {
            this.windowWidth = mainCanvas.width = window.innerWidth;
            this.windowHeight = mainCanvas.height = window.innerHeight;
        })
        input.addEventListener('change', () => {
            this.changeText(input.value)
        })
        this.points = []
        this.initPointAmount = 1800
        this.init()
    }

    init() {
        let index = 0

        for (let i = 0; i < this.initPointAmount; i++) {
            let p = new Point()
            let x = random(this.windowWidth), y = random(this.windowHeight), r = p.radius
            this.points.push(p)
            let scaleDuration = 1200
            let moveDuration = random(500, 1000)
            let move = i => {
                dynamics.animate(p, {
                    x,
                    y,
                    radius: r
                }, {
                    type: dynamics.easeOut,
                    duration: moveDuration,
                    complete: () => {
                        ++index
                        if (index >= this.initPointAmount - 1) {
                            this.points.pop()
                            this.pointRandomMove()
                        }
                    }
                })
            }
            let scale = i => {
                dynamics.animate(p, {
                    // alpha: random(3, 8),
                    radius: 50
                }, {
                    type: dynamics.easeIn,
                    duration: scaleDuration,
                    complete: () => {
                        move(i)
                    }
                })
            }
            scale(i)
        }
        // this.pointRandomMove()
    }

    changeText(text) {
        if (!text) {
            text = '请输入文字'
        } else if (text.length > 10) {
            text = '太长了！'
        }
        let l = text.length
        let fz = 0
        let scaleDuration = 600
        let moveDuration = 800
        if (l === 1) {
            fz = 45
        } else if (l === 2) {
            fz = 36
        } else if (l === 3) {
            fz = 30
        } else if (l === 4) {
            fz = 25
        } else if (l === 5) {
            fz = 22
        } else if (l === 6) {
            fz = 20
        } else if (l === 7) {
            fz = 18
        } else if (l === 8) {
            fz = 16
        } else if (l === 9) {
            fz = 14
        } else if (l === 10) {
            fz = 12
        }
        let textCtx = this.textCtx
        textCtx.clearRect(0, 0, 1000, 1000)
        textCtx.font = `${fz}px Microsoft Yahei`
        let spacing = 2
        let textArr = text.split('')
        // for(let i=0;i<textArr.length;i++){
        //     if(i==0){
        //         textCtx.fillText(textArr[i], 0, 0)
        //     }else {
        //
        //     }
        // }
        textCtx.fillText(text, 0, 0)

        let textWidth = text.length * fz,
            textHeight = 120
        let data = textCtx.getImageData(0, 0, textWidth, textHeight), arr = data.data
        for (let p of this.points) {
            p.onOrder = false
            p.alpha = random(3, 5)
        }
        let measure = textCtx.measureText(text).width
        let startX = this.windowWidth / 2 - measure * 7.5
        let startY = this.windowHeight / 2 - fz * 10
        this.pointRandomMove()
        for (let i = 0, j = 0; i < arr.length; i++) {
            if (i % 4 === 0 && arr[i] === 255) {
                let row = getRow(i, arr.length, textHeight)
                let spacing = this.points[j].orderRadius * 2 + 3
                this.points[j].onOrder = true
                this.points[j].alpha = 10
                let x = startX + spacing * ((i - (row - 1) * textWidth * 4) / 4),
                    y = startY + spacing * row

                let move = j => {
                    dynamics.animate(this.points[j], {
                        x,
                        y,
                        alpha: 10,
                        orderRadius: 6
                    }, {
                        type: dynamics.easeIn,
                        duration: moveDuration
                    })
                }
                let scale = j => {
                    dynamics.animate(this.points[j], {
                        alpha: random(3, 8),
                        orderRadius: 10
                    }, {
                        type: dynamics.easeIn,
                        duration: scaleDuration,
                        complete: () => {
                            move(j)
                        }
                    })
                }
                scale(j)
                j++
            }
        }
    }

    pointRandomMove() {
        for (let p of this.points) {
            let randomFn = () => {
                let x = p.x + random(-100, 100)
                let y = p.y + random(-100, 100)
                let duration = random(800, 1200)
                let pause = random(200, 500)

                dynamics.animate(p, {
                    x, y
                }, {
                    type: dynamics.easeInOut,
                    duration,
                    complete: () => {
                        dynamics.animate(p, {
                            x, y
                        }, {
                            duration: pause,
                            complete: () => {
                                randomFn()
                            }
                        })
                    }
                })

            }
            randomFn()
        }
    }

    render() {
        let ctx = this.ctx
        let r = () => {
            ctx.clearRect(0, 0, this.windowWidth, this.windowHeight)
            for (let i = 0; i < this.points.length; i++) {
                this.points[i].render()
            }
            requestAnimationFrame(r)
        }
        r()
    }

    test() {

    }
}

const particleCanvas = new Canvas()
particleCanvas.render()
// particleCanvas.test()
