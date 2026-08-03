"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function NeuralBackground() {
  const mountRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    particles: THREE.Points;
    lines: THREE.LineSegments;
  } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // ── Scene Setup ───────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // ── Particle System (Cosmic Purple & Cyber Cyan) ──────────
    const PARTICLE_COUNT = 600;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);

    const color1 = new THREE.Color(0x5b4dff); // Cosmic Purple
    const color2 = new THREE.Color(0x00d4ff); // Electric Cyan
    const color3 = new THREE.Color(0xa855f7); // Deep Purple

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const t = Math.random();
      let c: THREE.Color;
      if (t < 0.5) c = color1.clone().lerp(color2, t * 2);
      else c = color2.clone().lerp(color3, (t - 0.5) * 2);
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = Math.random() * 0.08 + 0.02;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    particleGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── Connection Lines ──────────────────────────────────────
    const linePositions: number[] = [];
    const lineColors: number[] = [];
    const CONNECTION_DIST = 3.5;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dx = positions[i*3]   - positions[j*3];
        const dy = positions[i*3+1] - positions[j*3+1];
        const dz = positions[i*3+2] - positions[j*3+2];
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.3;
          linePositions.push(
            positions[i*3], positions[i*3+1], positions[i*3+2],
            positions[j*3], positions[j*3+1], positions[j*3+2]
          );
          lineColors.push(
            colors[i*3]*alpha, colors[i*3+1]*alpha, colors[i*3+2]*alpha,
            colors[j*3]*alpha, colors[j*3+1]*alpha, colors[j*3+2]*alpha
          );
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeo.setAttribute("color", new THREE.Float32BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });

    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    sceneRef.current = { renderer, scene, camera, particles, lines };

    // ── Mouse Parallax ────────────────────────────────────────
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.5;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
    };
    window.addEventListener("mousemove", onMouseMove);

    // ── Animation Loop ────────────────────────────────────────
    let t = 0;
    const animate = () => {
      animRef.current = requestAnimationFrame(animate);
      t += 0.003;

      particles.rotation.y = t * 0.05 + mouseX * 0.3;
      particles.rotation.x = mouseY * 0.2;
      lines.rotation.y     = t * 0.05 + mouseX * 0.3;
      lines.rotation.x     = mouseY * 0.2;

      (particleMat as THREE.PointsMaterial).opacity =
        0.55 + Math.sin(t * 0.8) * 0.25;

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
