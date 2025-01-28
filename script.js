// script.js

// Seleccionamos el canvas
const canvas = document.getElementById("bg-canvas");

// Renderer de Three.js
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Establecer color de fondo del renderer
renderer.setClearColor(0xffd1dc, 1);

// Creamos la escena
const scene = new THREE.Scene();

// Cámara con perspectiva
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Fijamos la cámara mirando de frente
camera.position.set(0, 0, 30);
camera.lookAt(scene.position);

// Luces
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

/* 
  Función para crear el sobre:
  - Base (BoxGeometry)
  - Solapa (Shape extruido)
*/
function createEnvelope() {
  const envelopeGroup = new THREE.Group();

  // 1) BASE DEL SOBRE
  const baseGeometry = new THREE.BoxGeometry(10, 6, 0.2);
  const baseMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
  envelopeGroup.add(baseMesh);

  // 2) SOLAPA (triángulo extruido)
  const flapShape = new THREE.Shape();
  flapShape.moveTo(-5, 0);
  flapShape.lineTo(5, 0);
  flapShape.lineTo(0, 3);
  flapShape.lineTo(-5, 0);

  const flapGeometry = new THREE.ExtrudeGeometry(flapShape, {
    depth: 0.2,
    bevelEnabled: false,
  });
  const flapMaterial = new THREE.MeshStandardMaterial({ color: 0xffb6c1 });
  const flapMesh = new THREE.Mesh(flapGeometry, flapMaterial);
  flapMesh.position.y = 3; // Lo ubicamos en la parte superior de la base
  envelopeGroup.add(flapMesh);

  return envelopeGroup;
}

// Creamos el grupo que contiene el sobre
const envelope = createEnvelope();
envelope.scale.set(2, 2, 2);
scene.add(envelope);

// Ajustar la escena y la cámara al cambiar el tamaño de la ventana
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Interacción con el mouse
let mouseX = 0;
let mouseY = 0;
document.addEventListener("mousemove", (event) => {
  // Normalizamos la posición del mouse para que quede en [-1..1]
  mouseX = (event.clientX / window.innerWidth) * 2 - 1; 
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Animación
function animate() {
  requestAnimationFrame(animate);

  // Ajusta este factor para que el giro sea más o menos sensible
  const rotationFactor = 0.5;

  // El sobre se orienta de acuerdo a la posición del mouse
  // Rotación en Y para movimiento horizontal, en X para vertical
  envelope.rotation.y = mouseX * rotationFactor;
  envelope.rotation.x = mouseY * rotationFactor;

  renderer.render(scene, camera);
}

animate();
