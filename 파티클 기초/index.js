const canvas = document.querySelector('canvas')

const ctx = canvas.getContext('2d')

const dpr = window.devicePixelRatio // 기기별 dpr을 파악해서 캔버스를 그릴 때 더 높은 배율로 표시할지 파악

let canvasWidth = innerWidth
let canvasHeight = innerHeight

let particles

const init = () => {
    canvasWidth = innerWidth
    canvasHeight = innerHeight
    
    canvas.style.width = canvasWidth + 'px' // css와 캔버스의 크기를 같게 해줘야 안깨진다.
    canvas.style.height = canvasHeight + 'px'
    
    const TOTAL = canvasWidth / 100

    canvas.width = canvasWidth * dpr // css와 캔버스의 크기를 같게 해줘야 안깨진다.
    canvas.height = canvasHeight * dpr // dpr 을 곱해줌으로 더 높은 배율로 표시되도록 함
    particles = []
    ctx.scale(dpr, dpr) // 커진 scale 값을 축소

    

    for (let i = 0; i < TOTAL; i++){
        const x = randomNumDetween(0, canvasWidth)
        const y = randomNumDetween(0, canvasHeight)
        const radius = randomNumDetween(50, 100)
        const vy = randomNumDetween(0.3, 2)

        const particle = new Particle(x, y, radius, vy)

        particles.push(particle)
    }
}

const feGaussianBlur = document.querySelector('feGaussianBlur')
const feColorMatrix = document.querySelector('feColorMatrix')


const controls = new function() {
    this.blurValue = 40
    this.alphaChannel = 100
    this.alphaOffset = -23
    this.acc = 1.03
}

let gui = new dat.GUI()

const f1 = gui.addFolder('gooey effect')
f1.open()

f1.add(controls, 'blurValue', 0, 100).onChange(value => {
    feGaussianBlur.setAttribute('stdDeviation', value)
})

f1.add(controls, 'alphaChannel', 1, 200).onChange(value => {
    feColorMatrix.setAttribute('values', `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${value} ${controls.alphaOffset}`)
})

f1.add(controls, 'alphaOffset', -40, 40).onChange(value => {
    feColorMatrix.setAttribute('values', `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${controls.alphaChannel} ${value}`)
})

const f2 = gui.addFolder('particle property')
f2.open()

f2.add(controls, 'acc', 1, 1.5, 0.01).onChange(value => {
    particles.forEach(particle => particle.acc = value)
})

class Particle {
    constructor(x, y, radius, vy) {
        this.x = x
        this.y = y
        this.radius = radius
        this.vy = vy
        this.acc = 1.03 // 가속도
    }
    update() {
        this.vy *= this.acc // 가속도를 계속 곱해줌
        this.y += this.vy
    }
    draw() {
        ctx.beginPath() // 그림을 그리겠다 선언
        ctx.arc(this.x, this.y, this.radius, 0 , Math.PI / 180 * 360)
        ctx.fillStyle = 'red'
        ctx.fill()
        ctx.closePath()
    }
}

const x = 100
const y = 100
const radius = 50

const particle = new Particle(x, y, radius)


const randomNumDetween = (min, max) => {
    return Math.random() * (max - min + 1) + min
}



let interval = 1000 / 60
let now, delta
let then = Date.now()

const animate = () => {
    window.requestAnimationFrame(animate) // 재귀로 프레임마다 무한으로 실행되게 하는 로직
    now = Date.now()
    delta = now - then

    if(delta < interval) return
    ctx.clearRect(0, 0, canvasWidth, canvasHeight) // 이전 것 지우기
    
    particles.forEach(particle => {
        particle.update()
        particle.draw()

        if( particle.y - particle.radius > canvasHeight) {
            particle.x = randomNumDetween(0, canvasWidth)
            particle.radius = randomNumDetween(50, 100)
            particle.vy = randomNumDetween(0, 2)
            particle.y = particle.y = -particle.radius
        } 
    })

    then = now - (delta % interval)
}

window.addEventListener('load', () => {
    init()
    animate()
})

window.addEventListener('resize', () => {
    init()
})