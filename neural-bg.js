import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.167.1/build/three.module.js";

const canvas = document.getElementById("neural-bg");

if (canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 220);
  camera.position.set(0, 0, 22);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const group = new THREE.Group();
  scene.add(group);

  const NODE_COUNT = window.innerWidth < 768 ? 64 : 92;
  const SPACE = 20;
  const nodes = new Float32Array(NODE_COUNT * 3);

  for (let i = 0; i < NODE_COUNT; i += 1) {
    nodes[i * 3] = (Math.random() - 0.5) * SPACE;
    nodes[i * 3 + 1] = (Math.random() - 0.5) * SPACE;
    nodes[i * 3 + 2] = (Math.random() - 0.5) * SPACE;
  }

  const pointGeometry = new THREE.BufferGeometry();
  pointGeometry.setAttribute("position", new THREE.BufferAttribute(nodes, 3));

  const pointMaterial = new THREE.PointsMaterial({
    size: window.innerWidth < 768 ? 0.11 : 0.13,
    color: new THREE.Color("#8cdfff"),
    transparent: true,
    opacity: 0.88,
    depthWrite: false
  });

  const cloud = new THREE.Points(pointGeometry, pointMaterial);
  group.add(cloud);

  const MAX_DISTANCE = 5.25;
  const MAX_PER_NODE = 4;
  const links = [];

  for (let i = 0; i < NODE_COUNT; i += 1) {
    let linkCount = 0;

    for (let j = i + 1; j < NODE_COUNT && linkCount < MAX_PER_NODE; j += 1) {
      const ax = nodes[i * 3];
      const ay = nodes[i * 3 + 1];
      const az = nodes[i * 3 + 2];
      const bx = nodes[j * 3];
      const by = nodes[j * 3 + 1];
      const bz = nodes[j * 3 + 2];

      const d = Math.hypot(ax - bx, ay - by, az - bz);

      if (d <= MAX_DISTANCE) {
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([ax, ay, az, bx, by, bz]), 3));

        const lineMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color("#6ff3c4"),
          transparent: true,
          opacity: 0.2,
          depthWrite: false
        });

        const line = new THREE.Line(lineGeometry, lineMaterial);
        group.add(line);
        links.push({ material: lineMaterial, baseOpacity: 0.2 });
        linkCount += 1;
      }
    }
  }

  const pointerTarget = { x: 0, y: 0 };
  const pointerCurrent = { x: 0, y: 0 };
  let scrollProgress = 0;
  let pulseUntil = 0;

  function setPointer(clientX, clientY) {
    pointerTarget.x = (clientX / window.innerWidth) * 2 - 1;
    pointerTarget.y = (clientY / window.innerHeight) * 2 - 1;
  }

  window.addEventListener("mousemove", (event) => {
    setPointer(event.clientX, event.clientY);
  });

  window.addEventListener("touchmove", (event) => {
    const touch = event.touches && event.touches[0];
    if (touch) {
      setPointer(touch.clientX, touch.clientY);
    }
  }, { passive: true });

  function onScroll() {
    const limit = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    scrollProgress = window.scrollY / limit;
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function pulseNeural() {
    pulseUntil = performance.now() + 700;
  }

  const pulseTargets = document.querySelectorAll(".btn, .skill-tag, .contact-method, .social-links a, .footer-socials a");
  pulseTargets.forEach((item) => {
    item.addEventListener("mouseenter", pulseNeural);
    item.addEventListener("focus", pulseNeural);
    item.addEventListener("touchstart", pulseNeural, { passive: true });
  });

  function render() {
    requestAnimationFrame(render);

    pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.06;
    pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.06;

    group.rotation.y += 0.0012;
    group.rotation.x += 0.0005;
    group.rotation.y += pointerCurrent.x * 0.006;
    group.rotation.x += -pointerCurrent.y * 0.004;

    const depthTarget = 22 - scrollProgress * 8.5;
    camera.position.z += (depthTarget - camera.position.z) * 0.05;
    camera.position.y += (((scrollProgress - 0.5) * 1.8) - camera.position.y) * 0.05;

    const now = performance.now();
    const activePulse = now < pulseUntil;
    const pulsePower = activePulse ? (Math.sin(((pulseUntil - now) / 700) * Math.PI * 4) * 0.5 + 0.5) : 0;

    for (let i = 0; i < links.length; i += 1) {
      const l = links[i];
      l.material.opacity = l.baseOpacity + pulsePower * 0.45;
    }

    pointMaterial.opacity = 0.82 + pulsePower * 0.16;
    renderer.render(scene, camera);
  }

  render();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
