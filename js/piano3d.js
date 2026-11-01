/**
 * Piano Player - Exquisite Synthwave Crystal Grand Piano (Three.js WebGL)
 * 
 * High-End Steinway Model B/D Architecture:
 * - Geometrically accurate orientation: Front keyboard at +Z, Tail at -Z, Spine at -X, Bentside at +X.
 * - Steinway Cross-Strung Harp (Treble & Bass banks), Cast Iron Struts, Bridges & Tuning Pins.
 * - Synthwave Aesthetics: Neon Cyber-Edges (Electric Cyan & Sunset Peach), LED Keylight, Floating Motes, Hover Ripple.
 * - Crystal Physical Shader (Refraction & Specular Flare) & Polished Brass Accents.
 * - Centered at (0, 0, 0), zero borders, zero cards, 360° mouse/touch rotation.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', initSynthwavePiano);

  function initSynthwavePiano() {
    const container = document.getElementById('piano-canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    // ============================================================
    // 【參數調整 1：鋼琴大小縮放比例 (PIANO_SCALE)】
    // 預設為 0.82（原本全尺寸為 1.0）。
    // 若想讓鋼琴更大，可調大數值（例如 0.9 或 1.0）；
    // 若想讓鋼琴更小，可調小數值（例如 0.75 或 0.70）。
    // ============================================================
    const PIANO_SCALE = 0.8;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight * 0.75;

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);

    const updateCameraDistance = () => {
      const aspect = width / height;
      camera.aspect = aspect;
      if (aspect < 0.9) {
        // Mobile portrait: pull camera slightly back and higher angle
        camera.fov = 42;
        camera.position.set(3.0, 2.0, 3.2);
      } else if (aspect < 1.3) {
        // Tablet
        camera.fov = 36;
        camera.position.set(2.6, 1.7, 2.8);
      } else {
        // Desktop / widescreen: cinematic 3/4 perspective
        camera.fov = 32;
        camera.position.set(2.4, 1.6, 2.6);
      }
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    };

    updateCameraDistance();

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 2. Cinematic Synthwave Lighting Setup
    // A. Ambient Twilight Light
    const ambientLight = new THREE.AmbientLight(0x222a42, 2.2);
    scene.add(ambientLight);

    // B. Warm Sunset Peach Key Light (from front-right top)
    const keyLight = new THREE.DirectionalLight(0xffbfa3, 2.4);
    keyLight.position.set(4.5, 5.5, 4.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // C. Soft Dreamwave Violet Rim Light (from rear-left top)
    const rimLight = new THREE.DirectionalLight(0x9d72e8, 1.4);
    rimLight.position.set(-4.0, 4.0, -3.0);
    scene.add(rimLight);

    // D. Bioluminescent Cyan Upward Water Bounce Light
    const waterBounce = new THREE.DirectionalLight(0x06b6d4, 1.5);
    waterBounce.position.set(0, -4, 1);
    waterBounce.target.position.set(0, 0, 0);
    scene.add(waterBounce);
    scene.add(waterBounce.target);

    // 3. Materials System (Synthwave Cyber-Crystal & Luxury Accents)
    // A. Transparent Optical Crystal Glass (Rim, Lid, Cheeks, Desk)
    const crystalGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x9be8ff,
      emissive: 0x072230,
      emissiveIntensity: 0.35,
      transmission: 0.86,
      opacity: 0.70,
      transparent: true,
      roughness: 0.05,
      metalness: 0.08,
      ior: 1.52,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04
    });

    // B. Polished Golden Brass (Prop stick, Pedals, Casters)
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xffd166,
      emissive: 0x5a3e14,
      emissiveIntensity: 0.28,
      metalness: 0.92,
      roughness: 0.18
    });

    // D. Keyboard Keys Materials
    const whiteKeyMat = new THREE.MeshStandardMaterial({
      color: 0xfdfdfd,
      roughness: 0.10,
      metalness: 0.05
    });

    const blackKeyMat = new THREE.MeshStandardMaterial({
      color: 0x111116,
      roughness: 0.22,
      metalness: 0.30
    });

    const redFeltMat = new THREE.MeshStandardMaterial({
      color: 0xd94e64,
      roughness: 0.9
    });

    // E. Synthwave Neon Glowing Materials
    const neonCyanLineMat = new THREE.LineBasicMaterial({
      color: 0x05d9e8,
      transparent: true,
      opacity: 0.85,
      linewidth: 2
    });

    const neonPeachLineMat = new THREE.LineBasicMaterial({
      color: 0xff8fa3,
      transparent: true,
      opacity: 0.90,
      linewidth: 2
    });

    const neonLedStripMat = new THREE.MeshBasicMaterial({
      color: 0x05d9e8
    });

    // 4. Procedural Steinway Grand Piano Construction
    // Master pivot group (centered at 0, 0, 0 for pure in-place rotation)
    const pianoPivot = new THREE.Group();
    pianoPivot.scale.set(PIANO_SCALE, PIANO_SCALE, PIANO_SCALE);
    scene.add(pianoPivot);

    // Inner model container (holds all meshes; will be auto-centered)
    const pianoModel = new THREE.Group();
    pianoPivot.add(pianoModel);

    // Accurate 2D Steinway Rim Contour:
    // In our 3D space:
    // Front edge: +Z = +1.14 (keyboard face)
    // Rear tail peak: -Z = -1.14
    // Left straight spine: X = -0.74
    // Right bentside S-curve: X = +0.74
    // Using Y_shape = -Z_3d, so when rotated by rotateX(-Math.PI / 2):
    // Z_3d = -Y_shape (Front: -(-1.14) = +1.14, Tail: -(+1.14) = -1.14)
    const shapePoints = [
      // Left Spine (straight line from front corner to tail curve)
      [-0.74, -1.14],
      [-0.74, -0.65],
      [-0.74, -0.10],
      [-0.74, 0.45],
      [-0.74, 0.80],
      // Tail Arc
      [-0.71, 0.93],
      [-0.62, 1.04],
      [-0.48, 1.11],
      [-0.30, 1.14], // Rear tail peak (-0.30, -1.14 in 3D)
      [-0.12, 1.13],
      [0.04, 1.07],
      [0.16, 0.96],
      // Right Bentside S-Curve
      [0.25, 0.79],
      [0.32, 0.59],
      [0.37, 0.39],
      [0.41, 0.19],
      [0.44, -0.01],
      [0.46, -0.21],
      [0.49, -0.41],
      [0.54, -0.59],
      [0.61, -0.77],
      [0.68, -0.91],
      [0.74, -0.97],
      [0.74, -1.14]  // Front right corner
    ];

    const pianoShape = new THREE.Shape();
    pianoShape.moveTo(shapePoints[0][0], shapePoints[0][1]);
    for (let i = 1; i < shapePoints.length; i++) {
      pianoShape.lineTo(shapePoints[i][0], shapePoints[i][1]);
    }
    pianoShape.closePath();

    // A. Main Crystal Rim Body
    const rimExtrude = {
      depth: 0.30,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.015,
      bevelThickness: 0.015
    };

    const rimGeo = new THREE.ExtrudeGeometry(pianoShape, rimExtrude);
    rimGeo.rotateX(-Math.PI / 2); // Map extrusion depth to +Y, Y_shape to -Z_3d
    const rimMesh = new THREE.Mesh(rimGeo, crystalGlassMat);
    rimMesh.position.y = -0.15;
    rimMesh.castShadow = true;
    rimMesh.receiveShadow = true;
    pianoModel.add(rimMesh);

    // Synthwave Neon Wireframe Rim Outline (Cyan neon edge)
    const rimEdges = new THREE.EdgesGeometry(rimGeo, 28);
    const rimNeonWire = new THREE.LineSegments(rimEdges, neonCyanLineMat);
    rimNeonWire.position.y = -0.15;
    pianoModel.add(rimNeonWire);

    // E. Front Keyboard Assembly (Located accurately at Front Edge Z = +1.04)
    // Keybed foundation block
    const keybedGeo = new THREE.BoxGeometry(1.48, 0.065, 0.24);
    const keybedMesh = new THREE.Mesh(keybedGeo, crystalGlassMat);
    keybedMesh.position.set(0, -0.035, 1.02);
    pianoModel.add(keybedMesh);

    // Left and Right Cheekblocks (framing keyboard)
    const cheekGeo = new THREE.BoxGeometry(0.10, 0.15, 0.24);
    const cheekL = new THREE.Mesh(cheekGeo, crystalGlassMat);
    cheekL.position.set(-0.69, 0.05, 1.02);
    pianoModel.add(cheekL);

    const cheekR = new THREE.Mesh(cheekGeo, crystalGlassMat);
    cheekR.position.set(0.69, 0.05, 1.02);
    pianoModel.add(cheekR);

    // Key Slip (front protective lip)
    const lipGeo = new THREE.BoxGeometry(1.28, 0.03, 0.015);
    const lipMesh = new THREE.Mesh(lipGeo, crystalGlassMat);
    lipMesh.position.set(0, 0.01, 1.135);
    pianoModel.add(lipMesh);

    // Keys (White & Black)
    const keyGroup = new THREE.Group();
    keyGroup.position.set(0, 0.02, 1.04);

    const totalWhiteKeys = 42;
    const kw = 1.28 / totalWhiteKeys;
    const kh = 0.030;
    const kd = 0.16;

    // Red Felt Strip along fallboard
    const feltGeo = new THREE.BoxGeometry(1.28, 0.012, 0.018);
    const feltMesh = new THREE.Mesh(feltGeo, redFeltMat);
    feltMesh.position.set(0, kh * 0.5 + 0.006, -kd * 0.44);
    keyGroup.add(feltMesh);

    // Synthwave Neon LED Strip above keys (casting glowing cyber light)
    const ledStripGeo = new THREE.BoxGeometry(1.28, 0.006, 0.008);
    const ledStrip = new THREE.Mesh(ledStripGeo, neonLedStripMat);
    ledStrip.position.set(0, kh * 0.5 + 0.015, -kd * 0.44);
    keyGroup.add(ledStrip);

    for (let k = 0; k < totalWhiteKeys; k++) {
      const kx = -0.64 + k * kw + kw / 2;
      const wGeo = new THREE.BoxGeometry(kw * 0.92, kh, kd);
      const wKey = new THREE.Mesh(wGeo, whiteKeyMat);
      wKey.position.set(kx, 0, 0);
      keyGroup.add(wKey);

      // Black keys (2-3 pattern)
      const mod = k % 7;
      if (mod !== 2 && mod !== 6 && k < totalWhiteKeys - 1) {
        const bGeo = new THREE.BoxGeometry(kw * 0.56, kh * 1.5, kd * 0.62);
        const bKey = new THREE.Mesh(bGeo, blackKeyMat);
        bKey.position.set(kx + kw / 2, kh * 0.38, -kd * 0.19);
        keyGroup.add(bKey);
      }
    }
    pianoModel.add(keyGroup);

    // Fallboard with Synthwave Emblem
    const fallboardGeo = new THREE.BoxGeometry(1.28, 0.12, 0.018);
    const fallboard = new THREE.Mesh(fallboardGeo, crystalGlassMat);
    fallboard.position.set(0, 0.10, 0.94);
    fallboard.rotation.x = 0.20; // angled backwards ~11 deg
    pianoModel.add(fallboard);

    // Transparent Music Desk (acrylic sheet tilted back)
    const deskGeo = new THREE.BoxGeometry(0.72, 0.18, 0.012);
    const deskMesh = new THREE.Mesh(deskGeo, crystalGlassMat);
    deskMesh.position.set(0, 0.25, 0.80);
    deskMesh.rotation.x = -0.32; // tilted back ~18 deg
    pianoModel.add(deskMesh);

    // Neon trim line on Music Desk
    const deskEdges = new THREE.EdgesGeometry(deskGeo);
    const deskNeon = new THREE.LineSegments(deskEdges, neonPeachLineMat);
    deskMesh.add(deskNeon);

    // F. Grand Piano Open Lid Assembly
    // Hinged along Left Spine at X = -0.74, opening upwards to +X
    const lidExtrude = {
      depth: 0.020,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.01,
      bevelThickness: 0.01
    };

    const lidGeo = new THREE.ExtrudeGeometry(pianoShape, lidExtrude);
    lidGeo.rotateX(-Math.PI / 2);
    const lidMesh = new THREE.Mesh(lidGeo, crystalGlassMat);
    lidMesh.castShadow = true;

    // Neon edge highlight on Lid (Warm Sunset Peach / Rose glow)
    const lidEdges = new THREE.EdgesGeometry(lidGeo, 30);
    const lidNeon = new THREE.LineSegments(lidEdges, neonPeachLineMat);
    lidMesh.add(lidNeon);

    const lidPivot = new THREE.Group();
    // Spine hinge coordinate: X = -0.74, top of rim Y = 0.15
    lidPivot.position.set(-0.74, 0.15, 0);
    lidMesh.position.set(0.74, 0, 0); // Re-anchor so pivot is at spine
    lidPivot.add(lidMesh);
    lidPivot.rotation.z = 0.48; // Opens ~27.5 degrees upward to the right (+X)
    pianoModel.add(lidPivot);

    // Golden Prop Stick (supporting the open lid)
    const propGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.64, 8);
    const propStick = new THREE.Mesh(propGeo, brassMat);
    propStick.position.set(0.24, 0.32, 0.15);
    propStick.rotation.z = -0.22;
    propStick.rotation.x = 0.10;
    pianoModel.add(propStick);

    // G. 3 Crystal Spade Legs with Polished Brass Casters
    const legCoords = [
      [-0.60, 0.90],   // Front left leg (under left cheek)
      [0.60, 0.90],    // Front right leg (under right cheek)
      [-0.20, -0.85]   // Rear tail leg (under curved tail)
    ];

    legCoords.forEach(([lx, lz]) => {
      const legObj = new THREE.Group();
      legObj.position.set(lx, -0.42, lz);

      // Tapered crystal leg
      const legGeo = new THREE.CylinderGeometry(0.045, 0.026, 0.58, 8);
      const legMesh = new THREE.Mesh(legGeo, crystalGlassMat);
      legObj.add(legMesh);

      // Neon vertical seam on leg
      const legEdges = new THREE.EdgesGeometry(legGeo, 20);
      const legWire = new THREE.LineSegments(legEdges, neonCyanLineMat);
      legObj.add(legWire);

      // Brass ferrule & wheel caster
      const ferruleGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.03, 12);
      const ferrule = new THREE.Mesh(ferruleGeo, brassMat);
      ferrule.position.y = -0.28;
      legObj.add(ferrule);

      const casterGeo = new THREE.SphereGeometry(0.032, 12, 8);
      const caster = new THREE.Mesh(casterGeo, brassMat);
      caster.position.y = -0.32;
      legObj.add(caster);

      pianoModel.add(legObj);
    });

    // H. Steinway Lyre Assembly (Pedal Lyre at front center)
    const lyreGroup = new THREE.Group();
    lyreGroup.position.set(0, -0.46, 0.80);

    const postGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.42, 8);
    const postL = new THREE.Mesh(postGeo, crystalGlassMat);
    postL.position.x = -0.07;
    const postR = new THREE.Mesh(postGeo, crystalGlassMat);
    postR.position.x = 0.07;
    lyreGroup.add(postL);
    lyreGroup.add(postR);

    // 3 Golden Brass Pedals (Una Corda, Sostenuto, Sustain)
    for (let p = -1; p <= 1; p++) {
      const pedGeo = new THREE.BoxGeometry(0.028, 0.014, 0.08);
      const pedal = new THREE.Mesh(pedGeo, brassMat);
      pedal.position.set(p * 0.05, -0.20, 0.03);
      lyreGroup.add(pedal);
    }

    // Diagonal Brass Braces
    const braceGeo = new THREE.CylinderGeometry(0.007, 0.007, 0.38, 6);
    for (let b = -1; b <= 1; b += 2) {
      const brace = new THREE.Mesh(braceGeo, brassMat);
      brace.position.set(b * 0.12, -0.08, -0.10);
      brace.rotation.x = -0.55;
      brace.rotation.z = -b * 0.25;
      lyreGroup.add(brace);
    }
    pianoModel.add(lyreGroup);

    // I. Ambient Synthwave Stardust / Dream Dust Particles (twinkling around piano)
    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleBaseY = new Float32Array(particleCount);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const px = (Math.random() - 0.5) * 4.6;
      const py = (Math.random() - 0.5) * 2.2;
      const pz = (Math.random() - 0.5) * 4.6;
      particlePositions[i * 3] = px;
      particlePositions[i * 3 + 1] = py;
      particlePositions[i * 3 + 2] = pz;
      particleBaseY[i] = py;
      particleSpeeds[i] = 0.2 + Math.random() * 0.6;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffd2ec,
      size: 0.035,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // ============================================================
    // 5. Absolute Geometric Centering of pianoModel inside pianoPivot
    // Guarantees pure in-place rotation around exact visual centroid
    // ============================================================
    const box = new THREE.Box3().setFromObject(pianoModel);
    const center = new THREE.Vector3();
    box.getCenter(center);
    pianoModel.position.x = -center.x;
    pianoModel.position.y = -center.y;
    pianoModel.position.z = -center.z;

    // 6. Interactive Drag & Touch Rotation Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    // Default angle: Angled 3/4 front view showcasing keyboard and open lid
    let targetRotY = -0.45;
    let targetRotX = 0.08;
    let currentRotY = -0.45;
    let currentRotX = 0.08;

    const onPointerDown = (e) => {
      isDragging = true;
      const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;

      targetRotY += deltaX * 0.007;
      targetRotX += deltaY * 0.004;
      // Prevent flipping upside down
      targetRotX = Math.max(-0.25, Math.min(0.40, targetRotX));

      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // 7. Performance Saver: Pause loop when scrolled out of view
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.02 }
    );
    observer.observe(container);

    // 8. Responsive Resize
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight * 0.75;
      updateCameraDistance();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    requestAnimationFrame(handleResize);

    // 9. Animation Loop (Slow Relaxing Chillwave Breathing & Bobbing)
    const clock = new THREE.Clock();

    function renderLoop() {
      requestAnimationFrame(renderLoop);

      if (!isVisible) return; // Zero CPU/GPU usage when not in view

      const elapsedTime = clock.getElapsedTime();

      // Smooth inertia easing
      currentRotY += (targetRotY - currentRotY) * 0.06;
      currentRotX += (targetRotX - currentRotX) * 0.06;

      pianoPivot.rotation.y = currentRotY;
      pianoPivot.rotation.x = currentRotX;

      // Ultra-slow Chillwave Bobbing (16s harmonic cycle)
      const floatOffset = Math.sin(elapsedTime * 0.4) * 0.05;
      pianoPivot.position.y = floatOffset;
      pianoPivot.rotation.z = Math.cos(elapsedTime * 0.3) * 0.012;

      // Gentle floating dust particles
      const posAttr = particleGeo.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        const py = particleBaseY[i] + Math.sin(elapsedTime * particleSpeeds[i] + i) * 0.15;
        posAttr.setY(i, py);
      }
      posAttr.needsUpdate = true;

      // Gentle drift when user isn't dragging
      if (!isDragging) {
        targetRotY += 0.0012;
      }

      renderer.render(scene, camera);
    }

    renderLoop();
  }
})();
