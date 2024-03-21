const isTouchDevice =
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0;


const vacuum = document.querySelector("#vacuum");
let vacuumFlag = false;
vacuum.addEventListener("click", () => (vacuumFlag = !vacuumFlag));

const broom = document.querySelector("#broom");
let broomFlag = false;
broom.addEventListener("click", () => (broomFlag = !broomFlag));

function hideCleaners() {
  broom.style.display = "none";
  setTimeout(() => {
    vacuum.style.display = "none";
  }, 1000);
}

// Three JS

//Add Eraser to clean up scene when dragged around it 'pops' the dirt bubbles...
//Add Vacuum to suck them all into the top left corner...

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const bubbleTexture = textureLoader.load("./assets/bubble.png");
const vacuumTexture = textureLoader.load("./assets/vacuum.png");

// PARTICLES
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 5040;
const posArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount; i++) {
  const i3 = i * 3;
  posArray[i3 + 0] = (Math.random() - 0.5) * 10;
  posArray[i3 + 1] = (Math.random() - 0.5) * 10;
  posArray[i3 + 2] = (Math.random() - 0.5) * 5;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(posArray, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.075,
  map: bubbleTexture,
  alphaTest: 0.5,
  transparent: true,
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Store original positions
const originalPositions = [];
const positions = particlesGeometry.attributes.position.array;
for (let i = 0; i < positions.length; i += 3) {
  originalPositions.push(
    new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2])
  );
}

// LIGHTS
const pointLight = new THREE.PointLight("#ff0000", 23);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Window Sizing
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Mouse Logic
const mouse = {};
mouse.x = 0;
mouse.y = 0;

const previousMouse = { x: 0, y: 0 };

function pushParticles() {
  for (let i = 0; i < originalPositions.length; i++) {
    const posX = positions[i * 3];
    const posY = positions[i * 3 + 1];

    const dx = mouse.x - posX;
    const dy = mouse.y - posY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const maxDistance = 0.6; // Adjust this for a larger or smaller effect radius
    if (distance < maxDistance) {
      const force = (1 - distance / maxDistance) * 0.5; // Adjust the 0.1 for stronger/weaker force
      positions[i * 3] -= dx * force;
      positions[i * 3 + 1] -= dy * force;
    } else {
      // Lerp back to original position
      positions[i * 3] += (originalPositions[i].x - positions[i * 3]) * 0.05;
      positions[i * 3 + 1] +=
        (originalPositions[i].y - positions[i * 3 + 1]) * 0.05;
    }
  }
  particlesGeometry.attributes.position.needsUpdate = true;
}

function broomParticles() {
  const directionX = mouse.x - previousMouse.x;
  const directionY = mouse.y - previousMouse.y;

  for (let i = 0; i < originalPositions.length; i++) {
    const posX = positions[i * 3];
    const posY = positions[i * 3 + 1];

    const dx = mouse.x - posX;
    const dy = mouse.y - posY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const maxDistance = 2.5; // Adjust this for a larger or smaller effect radius
    if (distance < maxDistance) {
      const force = (1 - distance / maxDistance) * 0.6; // Adjust the 0.1 for stronger/weaker force
      positions[i * 3] += directionX * force;
      positions[i * 3 + 1] += directionY * force;
    }
  }
  particlesGeometry.attributes.position.needsUpdate = true;
}

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1; // normalize mouse x
  mouse.y = -(event.clientY / sizes.height) * 2 + 1; // normalize mouse y

  if (!vacuumFlag && !broomFlag && !isTouchDevice) {
    pushParticles();
  } else if (!vacuumFlag && broomFlag && !isTouchDevice) {
    broomParticles();
  }
});

window.addEventListener("scroll", () => {
  const scrollRatio = -(window.scrollY / document.body.scrollHeight);
  cameraGroup.position.y = scrollRatio * 3;
  cameraGroup.position.z = scrollRatio;
  canvas.style.top = scrollRatio;
});

// Animation Logic
const clock = new THREE.Clock();
let previousTime = 0;

const loop = () => {
  if (broomFlag || vacuumFlag) hideCleaners();
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;
  for (let i = 0; i < particlesCount * 3; i += 3) {
    if (vacuumFlag) {
      positions[i] -= 0.1;
      positions[i + 1] += 0.1;
    }
  }

  particlesGeometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};

loop();

// Form Handler
const contact = document.getElementById("contact");

const sender = document.getElementById("email");
const message = document.getElementById("message");
const submitForm = document.getElementById("submitForm");
submitForm.addEventListener("click", () => sendEmail());

const sendEmail = async () => {
  if (!sender.value || !message.value) {
    return;
  }

  const popup = document.createElement("div");
  popup.className = "popup";

  popup.addEventListener("click", () => {
    sender.value = "";
    message.value = "";
    popup.remove();
  });
  contact.appendChild(popup);
  const success = document.createElement("p");
  success.innerHTML =
    "Thank you! <br/>Your message has been sent<br/><br/><span class='bigRedX'>X</span>";
  success.className = "success";
  popup.appendChild(success);

  const resp = await fetch(
    "https://wabs-server.onrender.com/portfolio/contact",
    {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({
        senderEmail: sender.value,
        message: message.value,
      }),
    }
  );
  if (resp.ok) {
    console.log("message sent");
  }
};
