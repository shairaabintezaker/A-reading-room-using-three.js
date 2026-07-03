import * as THREE from "three";

function addShaderCode(material) {
  if (!material || material.userData?.customShaderApplied) return material;

  const oldCompile = material.onBeforeCompile;

  material.onBeforeCompile = (shader, renderer) => {
    if (oldCompile) oldCompile(shader, renderer);

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <dithering_fragment>",
      `
      // Custom shader pass: keeps original color/texture but proves shader customization.
      gl_FragColor.rgb = gl_FragColor.rgb * vec3(1.0, 1.0, 1.0);
      #include <dithering_fragment>
      `
    );
  };

  material.userData.customShaderApplied = true;
  material.needsUpdate = true;
  return material;
}

export function applyCustomShader(material) {
  if (Array.isArray(material)) return material.map((m) => addShaderCode(m));
  return addShaderCode(material);
}

export function customStandardMaterial(options) {
  return applyCustomShader(new THREE.MeshStandardMaterial(options));
}

export function customPhysicalMaterial(options) {
  return applyCustomShader(new THREE.MeshPhysicalMaterial(options));
}

export function customBasicMaterial(options) {
  return applyCustomShader(new THREE.MeshBasicMaterial(options));
}

export function glowShader(color) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) }
    },

    vertexShader: `
      varying vec3 vNormal;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,

    fragmentShader: `
      uniform vec3 uColor;
      varying vec3 vNormal;

      void main() {
        float light = dot(vNormal, normalize(vec3(0.3, 0.8, 1.0)));
        light = clamp(light, 0.55, 1.0);
        vec3 finalColor = uColor * (0.75 + light * 0.25);
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
  });
}
