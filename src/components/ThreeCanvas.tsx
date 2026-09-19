import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SCIENCE_NODES } from '../data/scienceData';
import { ScienceNodeData } from '../types';
import { soundFx } from '../utils/audio';

interface ThreeCanvasProps {
  onSelectNode: (node: ScienceNodeData) => void;
  onVioletClick: () => void;
  onOpenVideos: () => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  onSelectNode,
  onVioletClick,
  onOpenVideos,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hoveredNodeIdRef = useRef<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      46,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, -0.65, 18.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.2);
    keyLight.position.set(5, 10, 8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xa855f7, 2.0);
    rimLight.position.set(-6, -4, -3);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0x38bdf8, 2.5, 25);
    fillLight.position.set(0, -6, 5);
    scene.add(fillLight);

    // 1. STARFIELD & COSMIC PARTICLES
    const starCount = 350;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);

    const pastelPalettes = [
      new THREE.Color(0xfef08a), // warm yellow
      new THREE.Color(0xfbcfe8), // soft pink
      new THREE.Color(0xa5f3fc), // soft cyan
      new THREE.Color(0xe9d5ff), // soft purple
      new THREE.Color(0xffffff), // bright white
    ];

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 45;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 35;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;

      const col = pastelPalettes[Math.floor(Math.random() * pastelPalettes.length)];
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;

      starSizes[i] = Math.random() * 2.5 + 1.2;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    // Particle sprite using canvas
    const starCanvas = document.createElement('canvas');
    starCanvas.width = 64;
    starCanvas.height = 64;
    const sCtx = starCanvas.getContext('2d')!;
    const grad = sCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    grad.addColorStop(0.6, 'rgba(254, 240, 138, 0.4)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 64, 64);
    const starTexture = new THREE.CanvasTexture(starCanvas);

    const starMaterial = new THREE.PointsMaterial({
      size: 0.35,
      map: starTexture,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starField = new THREE.Points(starGeo, starMaterial);
    scene.add(starField);

    // 2. CENTRAL STYLIZED PLANET
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);
    planetGroup.position.set(0, -2.6, 0);

    // Procedural wavy candy planet texture
    const planetCanvas = document.createElement('canvas');
    planetCanvas.width = 1024;
    planetCanvas.height = 512;
    const pCtx = planetCanvas.getContext('2d')!;

    // Background base
    pCtx.fillStyle = '#8b5cf6';
    pCtx.fillRect(0, 0, 1024, 512);

    // Bubbly colorful terrain layers
    const terrainColors = ['#ec4899', '#06b6d4', '#4ade80', '#a855f7', '#f43f5e', '#38bdf8', '#fbbf24'];
    for (let layer = 0; layer < 12; layer++) {
      pCtx.fillStyle = terrainColors[layer % terrainColors.length];
      pCtx.beginPath();
      const startY = (512 / 12) * layer;
      pCtx.moveTo(0, startY);
      for (let x = 0; x <= 1024; x += 40) {
        const wave = Math.sin((x / 1024) * Math.PI * 4 + layer) * 35 + Math.cos((x / 1024) * Math.PI * 6) * 15;
        pCtx.lineTo(x, startY + wave);
      }
      pCtx.lineTo(1024, 512);
      pCtx.lineTo(0, 512);
      pCtx.closePath();
      pCtx.fill();
    }

    // Playful dots and spots
    for (let d = 0; d < 60; d++) {
      pCtx.fillStyle = terrainColors[(d * 3) % terrainColors.length];
      pCtx.beginPath();
      const rx = Math.random() * 1024;
      const ry = Math.random() * 512;
      const rr = Math.random() * 24 + 10;
      pCtx.arc(rx, ry, rr, 0, Math.PI * 2);
      pCtx.fill();
      // White highlight dot
      pCtx.fillStyle = 'rgba(255,255,255,0.7)';
      pCtx.beginPath();
      pCtx.arc(rx - rr * 0.3, ry - rr * 0.3, rr * 0.3, 0, Math.PI * 2);
      pCtx.fill();
    }

    const planetTexture = new THREE.CanvasTexture(planetCanvas);
    planetTexture.wrapS = THREE.RepeatWrapping;
    planetTexture.wrapT = THREE.ClampToEdgeWrapping;

    const planetGeometry = new THREE.SphereGeometry(2.35, 64, 64);
    const planetMaterial = new THREE.MeshStandardMaterial({
      map: planetTexture,
      roughness: 0.35,
      metalness: 0.1,
    });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    planetMesh.userData = { isCentralPlanet: true };
    planetGroup.add(planetMesh);

    // Planet atmosphere glow
    const atmosGeo = new THREE.SphereGeometry(2.52, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    atmosMesh.userData = { isCentralPlanet: true };
    planetGroup.add(atmosMesh);

    // Invisible hit sphere to easily hover/click central planet
    const planetHitSphere = new THREE.Mesh(
      new THREE.SphereGeometry(2.6, 16, 16),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    planetHitSphere.userData = { isCentralPlanet: true };
    planetGroup.add(planetHitSphere);

    // Embedded 3D Cartoon Elements on Planet:
    // A. Spinning Gears
    const gearGroup = new THREE.Group();
    const createGear = (radius: number, teeth: number, color: number) => {
      const g = new THREE.Group();
      const disc = new THREE.Mesh(
        new THREE.CylinderGeometry(radius, radius, 0.08, 24),
        new THREE.MeshStandardMaterial({ color, metalness: 0.8, roughness: 0.3 })
      );
      disc.rotation.x = Math.PI / 2;
      g.add(disc);
      for (let i = 0; i < teeth; i++) {
        const tooth = new THREE.Mesh(
          new THREE.BoxGeometry(radius * 0.4, radius * 0.3, 0.08),
          new THREE.MeshStandardMaterial({ color, metalness: 0.8, roughness: 0.3 })
        );
        const angle = (i / teeth) * Math.PI * 2;
        tooth.position.set(Math.cos(angle) * (radius * 1.05), Math.sin(angle) * (radius * 1.05), 0);
        tooth.rotation.z = angle;
        g.add(tooth);
      }
      return g;
    };

    const gear1 = createGear(0.35, 8, 0xfbbf24);
    gear1.position.set(-1.6, 0.5, 1.4);
    gear1.lookAt(new THREE.Vector3(-3, 1, 3));
    planetGroup.add(gear1);

    const gear2 = createGear(0.25, 6, 0x38bdf8);
    gear2.position.set(-1.2, 0.1, 1.8);
    gear2.lookAt(new THREE.Vector3(-2, 0.2, 3.5));
    planetGroup.add(gear2);

    // B. Miniature Colorful Cartoon Trees
    const planetTrees: THREE.Group[] = [];
    const createTree = (foliageColor: number, scale = 1) => {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06 * scale, 0.09 * scale, 0.45 * scale, 8),
        new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.9 })
      );
      trunk.position.y = 0.22 * scale;
      tree.add(trunk);

      // Fluffy puff spheres
      const folMat = new THREE.MeshStandardMaterial({ color: foliageColor, roughness: 0.3 });
      const f1 = new THREE.Mesh(new THREE.SphereGeometry(0.22 * scale, 12, 12), folMat);
      f1.position.set(0, 0.48 * scale, 0);
      tree.add(f1);

      const f2 = new THREE.Mesh(new THREE.SphereGeometry(0.16 * scale, 10, 10), folMat);
      f2.position.set(0.12 * scale, 0.38 * scale, 0.06 * scale);
      tree.add(f2);

      const f3 = new THREE.Mesh(new THREE.SphereGeometry(0.15 * scale, 10, 10), folMat);
      f3.position.set(-0.1 * scale, 0.4 * scale, -0.05 * scale);
      tree.add(f3);

      planetTrees.push(tree);
      return tree;
    };

    const tree1 = createTree(0x4ade80, 1.1);
    tree1.position.set(-0.8, 1.8, 1.1);
    tree1.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tree1.position.clone().normalize());
    planetGroup.add(tree1);

    const tree2 = createTree(0x06b6d4, 0.85);
    tree2.position.set(-1.8, 0.9, -0.8);
    tree2.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tree2.position.clone().normalize());
    planetGroup.add(tree2);

    const tree3 = createTree(0xec4899, 0.95);
    tree3.position.set(1.4, -0.8, 1.5);
    tree3.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tree3.position.clone().normalize());
    planetGroup.add(tree3);

    // C. Cartoon Test Tubes & Flasks on Planet
    const flaskGroup = new THREE.Group();
    const flaskMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.85,
      opacity: 1,
      transparent: true,
      roughness: 0.1,
      ior: 1.4,
    });
    const flaskBody = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.45, 16), flaskMat);
    const flaskNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.2, 16), flaskMat);
    flaskNeck.position.y = 0.25;
    flaskGroup.add(flaskBody, flaskNeck);

    const liquid = new THREE.Mesh(
      new THREE.ConeGeometry(0.19, 0.3, 16),
      new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 0.5 })
    );
    liquid.position.y = -0.06;
    flaskGroup.add(liquid);
    flaskGroup.position.set(-0.2, 1.6, 1.6);
    flaskGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), flaskGroup.position.clone().normalize());
    planetGroup.add(flaskGroup);

    // D. Craters & Domes
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      metalness: 0.3,
      roughness: 0.2,
      emissive: 0x9d174d,
      emissiveIntensity: 0.4,
    });
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.4, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), domeMat);
    dome.position.set(0.6, -1.2, 1.7);
    dome.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dome.position.clone().normalize());
    planetGroup.add(dome);

    // E. Glowing Planetary Orbit Rings (translucent white-cyan arcs)
    const ringGeo1 = new THREE.TorusGeometry(3.6, 0.035, 16, 120);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI * 0.58;
    ring1.rotation.y = -Math.PI * 0.12;
    planetGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(4.0, 0.02, 16, 120);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.55,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI * 0.55;
    ring2.rotation.y = -Math.PI * 0.18;
    planetGroup.add(ring2);

    // Sparkles traveling along ring
    const ringSparkles: THREE.Mesh[] = [];
    for (let sp = 0; sp < 6; sp++) {
      const sparkle = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      planetGroup.add(sparkle);
      ringSparkles.push(sparkle);
    }

    // 2B. VIDEOS LABEL & MARQUEE FOR CENTRAL PLANET
    const videosLabelGroup = new THREE.Group();
    videosLabelGroup.position.set(0, -2.6, 2.65);
    scene.add(videosLabelGroup);

    // Helper to generate custom "VIDEOS" label canvas texture
    const createVideosLabelTexture = () => {
      const lCanvas = document.createElement('canvas');
      lCanvas.width = 512;
      lCanvas.height = 256;
      const ctx = lCanvas.getContext('2d')!;

      // Rounded pill badge background
      const radius = 54;
      const x = 36;
      const y = 48;
      const w = 440;
      const h = 160;

      // Glow / outer stroke
      ctx.shadowColor = 'rgba(239, 68, 68, 0.85)';
      ctx.shadowBlur = 28;

      // Gradient pill fill (Red to Hot Pink)
      const grad = ctx.createLinearGradient(x, y, x + w, y + h);
      grad.addColorStop(0, '#dc2626');
      grad.addColorStop(0.5, '#ef4444');
      grad.addColorStop(1, '#ec4899');
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.roundRect(x, y, w, h, radius);
      ctx.fill();

      // Golden outer accent border
      ctx.shadowBlur = 0;
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#fef08a';
      ctx.stroke();

      // White inner border
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(x + 5, y + 5, w - 10, h - 10, radius - 4);
      ctx.stroke();

      // YouTube-style Play triangle icon on the left
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      const px = 118;
      const py = 128;
      ctx.moveTo(px - 16, py - 32);
      ctx.lineTo(px + 28, py);
      ctx.lineTo(px - 16, py + 32);
      ctx.closePath();
      ctx.fill();

      // Play button inner shine
      ctx.fillStyle = 'rgba(254, 240, 138, 0.6)';
      ctx.beginPath();
      ctx.moveTo(px - 14, py - 26);
      ctx.lineTo(px + 14, py);
      ctx.lineTo(px - 14, py + 2);
      ctx.closePath();
      ctx.fill();

      // Text "VIDEOS" in Titan One
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = '900 64px "Titan One", "Fredoka", sans-serif';

      // Multi-layered thick purple outline
      ctx.lineWidth = 16;
      ctx.strokeStyle = '#3b0764';
      ctx.strokeText('VIDEOS', 172, 128);

      ctx.lineWidth = 8;
      ctx.strokeStyle = '#581c87';
      ctx.strokeText('VIDEOS', 172, 128);

      // Bright white text fill
      ctx.fillStyle = '#ffffff';
      ctx.fillText('VIDEOS', 172, 128);

      const tex = new THREE.CanvasTexture(lCanvas);
      tex.needsUpdate = true;
      return tex;
    };

    const videosLabelTexture = createVideosLabelTexture();
    const videosLabelGeo = new THREE.PlaneGeometry(2.5, 1.25);
    const videosLabelMat = new THREE.MeshBasicMaterial({
      map: videosLabelTexture,
      transparent: true,
      depthTest: false,
    });
    const videosLabelMesh = new THREE.Mesh(videosLabelGeo, videosLabelMat);
    videosLabelMesh.userData = { isCentralPlanet: true, isVideosLabel: true };
    videosLabelGroup.add(videosLabelMesh);

    // Glowing aura plane behind the label
    const labelAuraGeo = new THREE.PlaneGeometry(3.0, 1.6);
    const labelAuraMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthTest: false,
    });
    const labelAuraMesh = new THREE.Mesh(labelAuraGeo, labelAuraMat);
    labelAuraMesh.position.z = -0.05;
    videosLabelGroup.add(labelAuraMesh);

    // Invisible hit plane on the videos label for easy clicking/hovering
    const videosHitMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.8, 1.5),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    videosHitMesh.userData = { isCentralPlanet: true, isVideosLabel: true };
    videosLabelGroup.add(videosHitMesh);

    // Shockwave ring for cool click animation
    const shockwaveGeo = new THREE.RingGeometry(0.2, 0.5, 48);
    const shockwaveMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthTest: false,
    });
    const shockwaveMesh = new THREE.Mesh(shockwaveGeo, shockwaveMat);
    shockwaveMesh.position.set(0, -2.6, 2.7);
    scene.add(shockwaveMesh);

    let shockwaveProgress = 1.0;
    const triggerShockwave = () => {
      shockwaveProgress = 0.0;
    };

    // 3. VIOLET CHARACTER AT TOP HEMISPHERE OF PLANET
    const violetGroup = new THREE.Group();
    violetGroup.position.set(0, -0.55, 0.9); // Centered and comfortably poised at top hemisphere
    scene.add(violetGroup);

    // Observatory Capsule / Hatch pod
    const podGeo = new THREE.CylinderGeometry(0.85, 0.75, 0.8, 32);
    const podMat = new THREE.MeshStandardMaterial({
      color: 0xf3e8ff,
      metalness: 0.1,
      roughness: 0.25,
    });
    const podMesh = new THREE.Mesh(podGeo, podMat);
    podMesh.position.y = -0.25;
    violetGroup.add(podMesh);

    // Pod purple rim
    const podRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.85, 0.08, 16, 32),
      new THREE.MeshStandardMaterial({ color: 0x9333ea, roughness: 0.3 })
    );
    podRim.rotation.x = Math.PI / 2;
    podRim.position.y = 0.15;
    violetGroup.add(podRim);

    // "Violet" nameplate badge on pod front
    const badgeCanvas = document.createElement('canvas');
    badgeCanvas.width = 256;
    badgeCanvas.height = 128;
    const bCtx = badgeCanvas.getContext('2d')!;
    bCtx.fillStyle = '#c084fc';
    bCtx.beginPath();
    bCtx.roundRect(10, 20, 236, 88, 30);
    bCtx.fill();
    bCtx.lineWidth = 8;
    bCtx.strokeStyle = '#ffffff';
    bCtx.stroke();
    bCtx.fillStyle = '#ffffff';
    bCtx.font = 'bold 54px Fredoka, Titan One, sans-serif';
    bCtx.textAlign = 'center';
    bCtx.textBaseline = 'middle';
    bCtx.fillText('Violet', 128, 64);

    const badgeTexture = new THREE.CanvasTexture(badgeCanvas);
    const badgeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.9, 0.45),
      new THREE.MeshBasicMaterial({ map: badgeTexture, transparent: true })
    );
    badgeMesh.position.set(0, -0.15, 0.88);
    badgeMesh.rotation.y = 0;
    violetGroup.add(badgeMesh);

    // Violet character body & head
    const charBody = new THREE.Group();
    violetGroup.add(charBody);

    // White lab coat torso
    const coatMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const coat = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.58, 0.8, 24), coatMat);
    coat.position.y = 0.4;
    charBody.add(coat);

    // Purple collar / lapel
    const collar = new THREE.Mesh(
      new THREE.TorusGeometry(0.35, 0.05, 8, 24, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0x9333ea })
    );
    collar.position.set(0, 0.72, 0.25);
    collar.rotation.x = -Math.PI * 0.45;
    charBody.add(collar);

    // Stethoscope / pen in pocket
    const pen = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.16, 8),
      new THREE.MeshStandardMaterial({ color: 0xec4899 })
    );
    pen.position.set(0.2, 0.5, 0.48);
    pen.rotation.z = -0.1;
    charBody.add(pen);

    // Head & Neck (Light-to-medium golden caramel skin tone for Black & Mexican mixed heritage)
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xd49b6a,
      roughness: 0.58,
    });
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.22, 16), skinMat);
    neck.position.set(0, 0.85, 0.08);
    charBody.add(neck);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.46, 24, 24), skinMat);
    head.position.set(0, 1.15, 0.05);
    charBody.add(head);

    // Curly Puff Hair (Stylized bubbly clusters of dark curls)
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x22130c, roughness: 0.9 });
    const hairPuffs: [number, number, number, number][] = [
      [0, 1.48, -0.05, 0.45], // Top main puff
      [-0.38, 1.35, 0, 0.34], // Left puff
      [0.38, 1.35, 0, 0.34], // Right puff
      [0, 1.25, -0.36, 0.4], // Back puff
      [-0.28, 1.15, -0.25, 0.32],
      [0.28, 1.15, -0.25, 0.32],
      [-0.38, 0.95, 0.02, 0.26],
      [0.38, 0.95, 0.02, 0.26],
    ];
    hairPuffs.forEach(([x, y, z, r]) => {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 16), hairMat);
      puff.position.set(x, y, z);
      charBody.add(puff);
    });

    // Violet's Eyes & Joyful Smile
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1f1209 });
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), eyeMat);
    eyeL.position.set(-0.15, 1.15, 0.46);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), eyeMat);
    eyeR.position.set(0.15, 1.15, 0.46);

    // Eye catchlights (sparkles)
    const catchL = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    catchL.position.set(-0.13, 1.17, 0.52);
    const catchR = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    catchR.position.set(0.17, 1.17, 0.52);
    charBody.add(eyeL, eyeR, catchL, catchR);

    // Cheerful Smile (curved tube)
    const smileCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.12, 0.98, 0.47),
      new THREE.Vector3(0, 0.9, 0.5),
      new THREE.Vector3(0.12, 0.98, 0.47)
    );
    const smileMesh = new THREE.Mesh(
      new THREE.TubeGeometry(smileCurve, 16, 0.022, 8, false),
      new THREE.MeshBasicMaterial({ color: 0xbe185d })
    );
    charBody.add(smileMesh);

    // Rosy cheeks
    const cheekMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.45 });
    const cheekL = new THREE.Mesh(new THREE.CircleGeometry(0.06, 12), cheekMat);
    cheekL.position.set(-0.24, 1.05, 0.43);
    cheekL.rotation.y = -0.3;
    const cheekR = new THREE.Mesh(new THREE.CircleGeometry(0.06, 12), cheekMat);
    cheekR.position.set(0.24, 1.05, 0.43);
    cheekR.rotation.y = 0.3;
    charBody.add(cheekL, cheekR);

    // Left Arm (resting on pod)
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.45, 12), coatMat);
    armL.position.set(-0.55, 0.45, 0.15);
    armL.rotation.z = 0.5;
    charBody.add(armL);

    // Left Hand (resting gently on pod rim)
    const handL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), skinMat);
    handL.position.set(-0.72, 0.32, 0.22);
    charBody.add(handL);

    // Right Arm (Waving!)
    const wavingArmGroup = new THREE.Group();
    wavingArmGroup.position.set(0.5, 0.6, 0.1);
    charBody.add(wavingArmGroup);

    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.42, 12), coatMat);
    armR.position.set(0.18, 0.18, 0);
    armR.rotation.z = -0.75;
    wavingArmGroup.add(armR);

    // Waving Hand
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 12), skinMat);
    hand.position.set(0.35, 0.35, 0);
    wavingArmGroup.add(hand);

    // Invisible hit sphere for Violet to trigger greetings
    const violetHit = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 12, 12),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    violetHit.userData = { isViolet: true };
    violetGroup.add(violetHit);

    // 4. INTERACTIVE FLOATING NODES (THE MENU)
    const nodeMeshes: {
      group: THREE.Group;
      data: ScienceNodeData;
      sphere: THREE.Mesh;
      glowMesh: THREE.Mesh;
      ringMesh: THREE.Mesh;
      baseY: number;
      propGroup: THREE.Group;
      phase: number;
      spinVelocity: number;
      targetSpinVelocity: number;
    }[] = [];

    // Helper to generate a colorful procedural candy planet texture for each science node
    const createNodePlanetTexture = (baseColor: string, secondaryColor: string) => {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 512;
      pCanvas.height = 256;
      const ctx = pCanvas.getContext('2d')!;

      // Base background
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, 512, 256);

      // Playful wavy planetary bands
      ctx.fillStyle = secondaryColor;
      for (let band = 0; band < 5; band++) {
        ctx.beginPath();
        const startY = (256 / 5) * band + 14;
        ctx.moveTo(0, startY);
        for (let x = 0; x <= 512; x += 20) {
          const wave = Math.sin((x / 512) * Math.PI * 4 + band) * 12 + Math.cos((x / 512) * Math.PI * 2) * 6;
          ctx.lineTo(x, startY + wave);
        }
        ctx.lineTo(512, startY + 24);
        ctx.lineTo(0, startY + 24);
        ctx.closePath();
        ctx.fill();
      }

      // Playful craters & stardust spots
      const spotColors = ['#ffffff', secondaryColor, '#fde047', '#f472b6'];
      for (let s = 0; s < 24; s++) {
        const sx = (s * 79) % 512;
        const sy = ((s * 41) % 220) + 16;
        const sr = (s % 4) * 4 + 7;
        ctx.fillStyle = spotColors[s % spotColors.length];
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();

        // White 3D highlight rim
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.beginPath();
        ctx.arc(sx - sr * 0.25, sy - sr * 0.25, sr * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }

      const tex = new THREE.CanvasTexture(pCanvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      return tex;
    };

    // Helper to generate node label canvas texture
    const createNodeLabelTexture = (title: string) => {
      const lCanvas = document.createElement('canvas');
      lCanvas.width = 512;
      lCanvas.height = 256;
      const lCtx = lCanvas.getContext('2d')!;

      // Bold bubble lettering with two lines if needed
      lCtx.textAlign = 'center';
      lCtx.textBaseline = 'middle';
      lCtx.font = '900 52px "Titan One", "Fredoka", sans-serif';

      const words = title.split(' ');
      const line1 = words.length > 1 ? words[0] : title;
      const line2 = words.length > 1 ? words.slice(1).join(' ') : '';

      const drawTextLine = (text: string, yPos: number) => {
        // Multi-layered thick purple stroke
        lCtx.lineWidth = 14;
        lCtx.strokeStyle = '#3b0764';
        lCtx.strokeText(text, 256, yPos);
        lCtx.lineWidth = 8;
        lCtx.strokeStyle = '#581c87';
        lCtx.strokeText(text, 256, yPos);
        // Fill pure white
        lCtx.fillStyle = '#ffffff';
        lCtx.fillText(text, 256, yPos);
      };

      if (line2) {
        drawTextLine(line1, 100);
        drawTextLine(line2, 160);
      } else {
        drawTextLine(line1, 128);
      }

      const tex = new THREE.CanvasTexture(lCanvas);
      tex.needsUpdate = true;
      return tex;
    };

    // Build specific 3D companion props for each of the 6 nodes matching reference image!
    const createCompanionPropsForNode = (nodeId: string) => {
      const g = new THREE.Group();

      if (nodeId === 'fun-experiments') {
        // Lab Beaker with rainbow smoke puffs & whisk
        const flask = new THREE.Mesh(
          new THREE.ConeGeometry(0.4, 0.7, 16),
          new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.8, roughness: 0.1, transparent: true })
        );
        flask.position.set(-0.9, 0.4, 0.3);
        const potion = new THREE.Mesh(
          new THREE.ConeGeometry(0.35, 0.45, 16),
          new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 0.8 })
        );
        potion.position.set(-0.9, 0.3, 0.3);
        // Colorful smoke puff spheres
        const smoke1 = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), new THREE.MeshBasicMaterial({ color: 0xf43f5e }));
        smoke1.position.set(-0.9, 0.85, 0.3);
        const smoke2 = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), new THREE.MeshBasicMaterial({ color: 0x4ade80 }));
        smoke2.position.set(-0.75, 1.05, 0.25);
        // Whisk / stirring rod
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 8), new THREE.MeshStandardMaterial({ color: 0xc084fc, metalness: 0.8 }));
        rod.position.set(0.85, 0.2, 0.2);
        rod.rotation.z = -0.6;
        g.add(flask, potion, smoke1, smoke2, rod);
      } else if (nodeId === 'space-explorer') {
        // Red & White Rocket with flame + golden stars
        const rocket = new THREE.Group();
        const body = new THREE.Mesh(
          new THREE.CylinderGeometry(0.15, 0.25, 0.8, 16),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
        );
        const nose = new THREE.Mesh(
          new THREE.ConeGeometry(0.2, 0.4, 16),
          new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 })
        );
        nose.position.y = 0.55;
        const flame = new THREE.Mesh(
          new THREE.ConeGeometry(0.18, 0.4, 12),
          new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
        );
        flame.position.y = -0.55;
        flame.rotation.x = Math.PI;
        rocket.add(body, nose, flame);
        rocket.position.set(-0.85, 0.4, 0.3);
        rocket.rotation.z = -0.5;
        // Telescope on right
        const tele = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.14, 0.7, 12),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.7 })
        );
        tele.position.set(0.8, -0.4, 0.2);
        tele.rotation.z = 0.7;
        g.add(rocket, tele);
      } else if (nodeId === 'dino-digs') {
        // Baby T-Rex with glasses & Volcano
        const dino = new THREE.Group();
        const dBody = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
        const dHead = new THREE.Mesh(new THREE.SphereGeometry(0.25, 14, 14), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
        dHead.position.set(0.25, 0.3, 0);
        // Goggles
        const gogg = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 8, 16), new THREE.MeshStandardMaterial({ color: 0x06b6d4 }));
        gogg.position.set(0.38, 0.32, 0.15);
        dino.add(dBody, dHead, gogg);
        dino.position.set(-0.8, -0.1, 0.3);
        // Mini volcano
        const volc = new THREE.Mesh(
          new THREE.ConeGeometry(0.45, 0.6, 12, 1, true),
          new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 })
        );
        volc.position.set(0.85, -0.2, 0.2);
        const lava = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
        lava.position.set(0.85, 0.15, 0.2);
        g.add(dino, volc, lava);
      } else if (nodeId === 'animal-world') {
        // Baby giraffe & leafy tree
        const giraffe = new THREE.Group();
        const gBody = new THREE.Mesh(new THREE.SphereGeometry(0.28, 14, 14), new THREE.MeshStandardMaterial({ color: 0xfde047 }));
        const gNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.6, 12), new THREE.MeshStandardMaterial({ color: 0xfde047 }));
        gNeck.position.set(0.15, 0.35, 0);
        const gHead = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), new THREE.MeshStandardMaterial({ color: 0xfde047 }));
        gHead.position.set(0.2, 0.7, 0);
        giraffe.add(gBody, gNeck, gHead);
        giraffe.position.set(-0.85, 0.1, 0.3);
        // Leafy jungle tree
        const tree = createTree(0x22c55e, 1.1);
        tree.position.set(0.85, 0.1, 0.1);
        g.add(giraffe, tree);
      } else if (nodeId === 'human-body') {
        // Dancing skeleton & pulsating heart
        const skel = new THREE.Group();
        const skull = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 14), new THREE.MeshStandardMaterial({ color: 0xf8fafc }));
        skull.position.set(0, 0.4, 0);
        const rib = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.35, 10), new THREE.MeshStandardMaterial({ color: 0xf8fafc }));
        rib.position.set(0, 0.1, 0);
        skel.add(skull, rib);
        skel.position.set(-0.8, 0.2, 0.3);
        // Red Heart
        const heart = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.5 }));
        heart.position.set(0.8, 0.3, 0.2);
        // DNA spiral cylinder
        const dna = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.7, 12), new THREE.MeshStandardMaterial({ color: 0x38bdf8 }));
        dna.position.set(0.75, -0.4, 0.2);
        dna.rotation.z = 0.5;
        g.add(skel, heart, dna);
      } else if (nodeId === 'mystery-quests') {
        // Magnifying glass & Question Mark
        const mag = new THREE.Group();
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.04, 12, 24), new THREE.MeshStandardMaterial({ color: 0xa855f7, metalness: 0.8 }));
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8), new THREE.MeshStandardMaterial({ color: 0x9333ea }));
        handle.position.set(0, -0.4, 0);
        mag.add(rim, handle);
        mag.position.set(-0.8, -0.2, 0.3);
        mag.rotation.z = -0.4;
        // Question Mark
        const qGeo = new THREE.TorusGeometry(0.2, 0.04, 8, 16, Math.PI * 1.5);
        const qMesh = new THREE.Mesh(qGeo, new THREE.MeshStandardMaterial({ color: 0xf43f5e }));
        qMesh.position.set(0.8, 0.35, 0.2);
        const qDot = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshStandardMaterial({ color: 0xf43f5e }));
        qDot.position.set(0.8, 0.05, 0.2);
        g.add(mag, qMesh, qDot);
      }

      return g;
    };

    SCIENCE_NODES.forEach((nodeData, idx) => {
      const nodeGroup = new THREE.Group();
      nodeGroup.position.set(...nodeData.position);
      scene.add(nodeGroup);

      // Spherical Node Planet with Procedural Candy Texture
      const sphereRadius = 1.05;
      const sphereGeo = new THREE.SphereGeometry(sphereRadius, 36, 36);
      const planetTex = createNodePlanetTexture(nodeData.color, '#ffffff');
      const sphereMat = new THREE.MeshStandardMaterial({
        map: planetTex,
        roughness: 0.25,
        metalness: 0.1,
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.userData = { nodeId: nodeData.id, isNode: true, data: nodeData };
      nodeGroup.add(sphereMesh);

      // Glowing aura corona
      const glowGeo = new THREE.SphereGeometry(sphereRadius * 1.25, 24, 24);
      const glowMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(nodeData.color),
        transparent: true,
        opacity: 0.25,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      nodeGroup.add(glowMesh);

      // Tilted Planetary Orbit Ring (Saturn style)
      const ringGeo = new THREE.RingGeometry(sphereRadius * 1.28, sphereRadius * 1.65, 32);
      const ringMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(nodeData.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
        roughness: 0.35,
        metalness: 0.2,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI * 0.44;
      ringMesh.rotation.y = 0.22;
      nodeGroup.add(ringMesh);

      // Add cute sparkling stardust beads along ring
      for (let r = 0; r < 4; r++) {
        const bead = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 8, 8),
          new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.6 })
        );
        const bAngle = (r / 4) * Math.PI * 2;
        bead.position.set(Math.cos(bAngle) * (sphereRadius * 1.46), Math.sin(bAngle) * (sphereRadius * 1.46), 0);
        ringMesh.add(bead);
      }

      // 3D Text Label Billboard on front of sphere
      const labelTexture = createNodeLabelTexture(nodeData.title);
      const labelGeo = new THREE.PlaneGeometry(1.7, 0.85);
      const labelMat = new THREE.MeshBasicMaterial({
        map: labelTexture,
        transparent: true,
        depthTest: false,
      });
      const labelMesh = new THREE.Mesh(labelGeo, labelMat);
      labelMesh.position.set(0, 0, sphereRadius + 0.05);
      nodeGroup.add(labelMesh);

      // Companion 3D cartoon props
      const propGroup = createCompanionPropsForNode(nodeData.id);
      nodeGroup.add(propGroup);

      nodeMeshes.push({
        group: nodeGroup,
        data: nodeData,
        sphere: sphereMesh,
        glowMesh,
        ringMesh,
        baseY: nodeData.position[1],
        propGroup,
        phase: idx * 1.05,
        spinVelocity: 0.005,
        targetSpinVelocity: 0.005,
      });
    });

    // 5. RESTRICTED MOUSE PARALLAX & RAYCASTING
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-1000, -1000);
    const targetCameraPos = new THREE.Vector3(0, -1.35, 18.5);
    const targetCameraRot = new THREE.Vector2(0, 0);

    let currentPlanetSpeed = 0.08;

    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      mouse.x = x;
      mouse.y = y;

      // Restricted parallax shift: maximum 1.5 units horizontally, 0.8 unit vertically
      targetCameraPos.x = x * 1.5;
      targetCameraPos.y = -1.35 + y * 0.8;
      targetCameraRot.x = y * 0.08;
      targetCameraRot.y = -x * 0.12;
    };

    const onClick = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (const hit of intersects) {
        if (hit.object.userData?.isViolet) {
          soundFx.playPop(1.4);
          soundFx.playFanfare();
          onVioletClick();
          return;
        }

        if (hit.object.userData?.isCentralPlanet || hit.object.userData?.isVideosLabel) {
          soundFx.playWhoosh();
          soundFx.playFanfare();
          // Boost central planet spin burst!
          currentPlanetSpeed = 3.2;
          triggerShockwave();
          onOpenVideos();
          return;
        }

        if (hit.object.userData?.isNode) {
          const nodeData = hit.object.userData.data as ScienceNodeData;
          console.log(`Clicked node: ${nodeData.title}`);
          soundFx.playPop(1.1);
          soundFx.playFanfare();
          onSelectNode(nodeData);
          return;
        }
      }
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('click', onClick);

    // RESIZE HANDLER
    const onResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;

      // Adjust camera distance for mobile responsiveness
      const isMobile = width < 768;
      camera.fov = isMobile ? 56 : 46;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);
    onResize();

    // 6. ANIMATION LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Camera smooth damping lerp (Mouse Parallax)
      camera.position.x += (targetCameraPos.x - camera.position.x) * 0.05;
      camera.position.y += (targetCameraPos.y - camera.position.y) * 0.05;
      camera.position.z = 18.5;
      camera.lookAt(
        targetCameraPos.x * 0.15,
        targetCameraPos.y * 0.15 - 1.45,
        0
      );

      // Starfield subtle twinkling & rotation
      starField.rotation.y = time * 0.015;
      starField.rotation.x = Math.sin(time * 0.02) * 0.05;

      // Sparkles moving along planetary orbit rings
      ringSparkles.forEach((sparkle, idx) => {
        const angle = time * 0.8 + (idx / ringSparkles.length) * Math.PI * 2;
        sparkle.position.set(Math.cos(angle) * 3.6, Math.sin(angle) * 3.6, 0);
      });

      // Raycasting for hover interactivity
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      let hoveredNode: ScienceNodeData | null = null;
      let isHoveringViolet = false;
      let isHoveringCentralPlanet = false;

      for (const hit of intersects) {
        if (hit.object.userData?.isViolet) {
          isHoveringViolet = true;
          break;
        }
        if (hit.object.userData?.isCentralPlanet) {
          isHoveringCentralPlanet = true;
          break;
        }
        if (hit.object.userData?.isNode) {
          hoveredNode = hit.object.userData.data;
          break;
        }
      }

      container.style.cursor = hoveredNode || isHoveringViolet || isHoveringCentralPlanet ? 'pointer' : 'default';

      if (hoveredNode && hoveredNode.id !== hoveredNodeIdRef.current) {
        hoveredNodeIdRef.current = hoveredNode.id;
        soundFx.playHover();
      } else if (!hoveredNode) {
        hoveredNodeIdRef.current = null;
      }

      // Shockwave animation update
      if (shockwaveProgress < 1.0) {
        shockwaveProgress += 0.025;
        const ringScale = 1.0 + shockwaveProgress * 16;
        shockwaveMesh.scale.set(ringScale, ringScale, 1);
        shockwaveMat.opacity = Math.max(0, (1 - shockwaveProgress) * 0.95);
        shockwaveMesh.rotation.z += 0.04;
      } else {
        shockwaveMat.opacity = 0;
      }

      // Videos label floating bob and hover zoom
      if (isHoveringCentralPlanet) {
        videosLabelGroup.scale.lerp(new THREE.Vector3(1.18, 1.18, 1.18), 0.15);
        labelAuraMat.opacity = 0.6 + Math.sin(time * 8.0) * 0.25;
        videosLabelGroup.rotation.z = Math.sin(time * 6.0) * 0.04;
      } else {
        videosLabelGroup.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
        labelAuraMat.opacity = 0.35 + Math.sin(time * 2.0) * 0.1;
        videosLabelGroup.rotation.z = THREE.MathUtils.lerp(videosLabelGroup.rotation.z, 0, 0.1);
      }
      videosLabelGroup.position.y = -2.6 + Math.sin(time * 2.5) * 0.06;

      // Central planet rotation with accelerated hover-spin!
      const targetPlanetSpeed = isHoveringCentralPlanet ? 0.45 : 0.08;
      currentPlanetSpeed = THREE.MathUtils.lerp(currentPlanetSpeed, targetPlanetSpeed, isHoveringCentralPlanet ? 0.12 : 0.04);
      planetGroup.rotation.y += currentPlanetSpeed * 0.05;

      // Central planet gears spin faster when hovered
      const gearSpinRate = isHoveringCentralPlanet ? 0.22 : 0.04;
      gear1.rotation.z += gearSpinRate * 1.5;
      gear2.rotation.z -= gearSpinRate * 2.0;

      // Central planet trees wobble with excitement when hovered
      if (isHoveringCentralPlanet) {
        planetTrees.forEach((tree, tIdx) => {
          tree.rotation.z = Math.sin(time * 16.0 + tIdx * 1.5) * 0.16;
        });
      } else {
        planetTrees.forEach((tree) => {
          tree.rotation.z = THREE.MathUtils.lerp(tree.rotation.z, 0, 0.1);
        });
      }

      // Violet Character Animations:
      if (isHoveringViolet) {
        // Violet does an excited pirouette spin and jump!
        violetGroup.rotation.y += 0.12;
        charBody.position.y = Math.abs(Math.sin(time * 10.0)) * 0.12;
        wavingArmGroup.rotation.z = 0.4 + Math.sin(time * 14.0) * 0.45;
      } else {
        // Return to facing front smoothly
        violetGroup.rotation.y = THREE.MathUtils.lerp(violetGroup.rotation.y, 0, 0.08);
        // Idle breathing / squash-stretch
        charBody.position.y = Math.sin(time * 2.2) * 0.035;
        charBody.scale.set(
          1 + Math.cos(time * 2.2) * 0.015,
          1 + Math.sin(time * 2.2) * 0.02,
          1
        );
        // Waving arm animation
        wavingArmGroup.rotation.z = 0.3 + Math.sin(time * 5.0) * 0.35;
      }

      // 6 Orbiting Planets Hover Spin Interactivity
      nodeMeshes.forEach((item) => {
        const isHovered = hoveredNode?.id === item.data.id;

        if (isHovered) {
          // Accelerate spin velocity to high speed!
          item.targetSpinVelocity = 0.095;
          // Scale up smoothly
          item.group.scale.lerp(new THREE.Vector3(1.24, 1.24, 1.24), 0.15);
          // Brighter glow
          item.glowMesh.scale.lerp(new THREE.Vector3(1.42, 1.42, 1.42), 0.15);
          (item.glowMesh.material as THREE.MeshBasicMaterial).opacity = 0.75;
          // Playful 3D tilt wobble during fast spin
          item.group.rotation.z = Math.sin(time * 7.0) * 0.08;
        } else {
          // Gentle celestial idle drift
          item.targetSpinVelocity = 0.005;
          item.group.rotation.z = THREE.MathUtils.lerp(item.group.rotation.z, 0, 0.1);
          item.group.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
          item.glowMesh.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
          (item.glowMesh.material as THREE.MeshBasicMaterial).opacity = 0.25;

          // Continuous gentle sine-wave bobbing
          const bob = Math.sin(time * 2.0 + item.phase) * 0.22;
          item.group.position.y = item.baseY + bob;
        }

        // Smoothly interpolate current spin velocity (with inertia)
        item.spinVelocity = THREE.MathUtils.lerp(
          item.spinVelocity,
          item.targetSpinVelocity,
          isHovered ? 0.14 : 0.04
        );

        // 1. SPIN THE PLANET SPHERE
        item.sphere.rotation.y += item.spinVelocity;

        // 2. SPIN THE PLANETARY RING (with slight precession)
        item.ringMesh.rotation.z += item.spinVelocity * 1.6;

        // 3. SPIN THE COMPANION PROPS (Rocket, Beaker, Dino, Skeleton, etc. orbit around the planet!)
        if (isHovered) {
          item.propGroup.rotation.y += item.spinVelocity * 1.5;
          item.propGroup.position.y = Math.sin(time * 10.0 + item.phase) * 0.08;
        } else {
          item.propGroup.rotation.y = Math.sin(time * 1.5 + item.phase) * 0.15;
          item.propGroup.position.y = 0;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('click', onClick);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onSelectNode, onVioletClick, onOpenVideos]);

  return <div ref={containerRef} className="absolute inset-0 z-10 w-full h-full" />;
};
