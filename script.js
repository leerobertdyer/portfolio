// Three JS

// const canvas = document.querySelector("canvas.webgl");
// const scene = new THREE.Scene();

// const documentHeight = document.body.scrollHeight;
// canvas.style.height = "1000px";
// canvas.style.width = "auto";


// // LIGHTS
// const directionalLight = new THREE.PointLight("#ff0000", 13);
// directionalLight.position.set(0, 0, 5);
// scene.add(directionalLight);

// // Particles
// const particlesCount = 1000;
// const positions = new Float32Array(particlesCount * 3);

// for (let i = 0; i < particlesCount; i++) {
//   positions[i * 3 + 0] = (Math.random() - 0.5) * 2.5;
//   positions[i * 3 + 1] = Math.random() - 0.5;
//   positions[i * 3 + 2] = Math.random() * 10;
// }

// const particlesGeometry = new THREE.BufferGeometry();
// particlesGeometry.setAttribute(
//   "position",
//   new THREE.BufferAttribute(positions, 3)
// );

// const particlesMaterial = new THREE.PointsMaterial({
//   sizeAttenuation: true,
//   size: 0.03,
//   transparent: true,
//   alphaTest: 0.5,
// });

// const particles = new THREE.Points(particlesGeometry, particlesMaterial);
// scene.add(particles);

// // Window Sizing
// const sizes = {
//   width: window.innerWidth,
//   height: window.innerHeight,
// };

// window.addEventListener("resize", () => {
//   sizes.width = window.innerWidth;
//   sizes.height = window.innerHeight;

//   camera.aspect = sizes.width / sizes.height;
//   camera.updateProjectionMatrix();

//   renderer.setSize(sizes.width, sizes.height);
//   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// });

// // Group
// const cameraGroup = new THREE.Group();
// scene.add(cameraGroup);

// // Base camera
// const camera = new THREE.PerspectiveCamera(
//   35,
//   sizes.width / sizes.height,
//   0.1,
//   100
// );
// camera.position.z = 6;
// cameraGroup.add(camera);

// // Renderer
// const renderer = new THREE.WebGLRenderer({
//   canvas: canvas,
//   alpha: true,
// });
// renderer.setSize(sizes.width, sizes.height);
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// // Cursor Logic
// const cursor = {};
// cursor.x = 0;
// cursor.y = 0;

// window.addEventListener("mousemove", (event) => {
//   cursor.x = event.clientX / sizes.width - 0.5;
//   cursor.y = event.clientY / sizes.height - 0.5;
// });

// // Animation Logic
// const clock = new THREE.Clock();
// let previousTime = 0;

// const originalParticlePositions = [...positions]

// const loop = () => {
//   const elapsedTime = clock.getElapsedTime();
//   const deltaTime = elapsedTime - previousTime;
//   previousTime = elapsedTime;

//   for (let i = 0; i < positions.length; i += 3) {
//     // Get the original position
//     const ox = originalParticlePositions[i];
//     const oy = originalParticlePositions[i + 1];

//     // Compute the displacement based on mouse proximity
//     const dx = cursor.x - positions[i];
//     const dy = cursor.y - positions[i + 1];
//     const distance = dx + dy * 10

//     // Check if the mouse is close enough
//     if (distance < 0.1) { // Adjust 0.1 as needed
//       // Displace the particle away from the mouse  
//       positions[i] += dx * 0.1; // Adjust 0.1 for reaction speed
//       positions[i + 2] += dy * 0.1;
//     } else {
//       // Gradually move the particle back to its original position
//       positions[i] += (ox - positions[i]) * 0.05; // Adjust 0.05 for return speed
//       positions[i + 1] += (oy - positions[i + 1]) * 0.05;
//     }
//   }

//   // Update the geometry
//   particlesGeometry.attributes.position.needsUpdate = true;

//   renderer.render(scene, camera);
//   window.requestAnimationFrame(loop);
// };

// loop();



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
