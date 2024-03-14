// Three JS 

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

function adjustCanvasSize() {
    const canvas = document.querySelector('canvas.webgl');
    const documentHeight = document.body.scrollHeight;
    if (window.innerWidth > 500) canvas.style.height = `${documentHeight * .35}px`;
    else canvas.style.height = `${documentHeight * .55}px`;
    canvas.style.width = 'auto'
}

// Adjust the canvas size on load and window resize
window.addEventListener('load', adjustCanvasSize);

// Textures
const textureLoader = new THREE.TextureLoader()
const starTexture = textureLoader.load('assets/star.png')

// LIGHTS
const directionalLight = new THREE.PointLight('#ff0000', 13)
directionalLight.position.set(0, 0, 5)
scene.add(directionalLight)


// Particles
const particlesCount = 127000
const positions = new Float32Array(particlesCount * 3)

const documentHeight = document.body.scrollHeight * .01

for(let i = 0; i < particlesCount; i++)
{
    positions[i * 3 + 0] = (Math.random() - 0.5) * 2.5
    positions[i * 3 + 1] = ( Math.random() - .5) * documentHeight 
    positions[i * 3 + 2] = (Math.random()) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const particlesMaterial = new THREE.PointsMaterial({
    sizeAttenuation: true,
    size: 0.03,
    transparent: true,
    alphaTest: .5,
    map: starTexture
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

// Window Sizing
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// Cursor Logic
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

// Animation Logic
const clock = new THREE.Clock()
let previousTime = 0

const loop = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    camera.position.y = - scrollY / sizes.height 

    const parallaxX = cursor.x * 0.25
    const parallaxY = - cursor.y * 0.25
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    renderer.render(scene, camera)
    window.requestAnimationFrame(loop)
}

loop()



// Form Handler
const contact = document.getElementById('contact')

const sender = document.getElementById('email')
const message = document.getElementById('message')
const submitForm = document.getElementById('submitForm')
submitForm.addEventListener('click', () => sendEmail())

const sendEmail = async() => {
    if (!sender.value || !message.value) {
        return
    }
    
    const popup = document.createElement('div')
    popup.className="popup"


    popup.addEventListener('click', () => {
        sender.value=""
        message.value=""
        popup.remove()
    })
    contact.appendChild(popup)
    const success = document.createElement('p')
    success.innerHTML="Thank you! <br/>Your message has been sent<br/><br/><span class='bigRedX'>X</span>"
    success.className="success"
    popup.appendChild(success)

    const resp = await fetch('https://wabs-server.onrender.com/portfolio/contact', {
        method: "POST",
        headers: {"Content-Type": "Application/json"},
        body: JSON.stringify({
            senderEmail: sender.value,
            message: message.value
        })
    });
    if (resp.ok) {
        console.log('message sent');
    }
}