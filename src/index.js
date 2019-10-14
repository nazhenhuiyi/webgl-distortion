import * as THREE from "three";

const image = require("./disp.jpg");
const vertex = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `;

const fragment = `
    varying vec2 vUv;

    uniform sampler2D texture;
    uniform sampler2D disp;
    // uniform float dispFactor;
    // uniform float effectFactor;
    void main() {

        vec2 uv = vUv;

        vec4 disp = texture2D(disp, uv);
        float vx = -(disp.r *2. - 1.) * disp.b;
        float vy = -(disp.g *2. - 1.) * disp.b;
        vec2 distortedPosition = vec2(uv.x +  vx, uv.y + vy);
        gl_FragColor = texture2D(texture, distortedPosition);
    }
`;


class App {
  constructor() {
    this.width = 200;
    this.height = 200;
    this.init();
  }
  init() {
    const upload = document.querySelector("#upload-input")
    const app = document.querySelector("#app")
    upload.addEventListener('change', (e) => {
      const file = upload.files[0]
      if (file) {
        const url = URL.createObjectURL(file)
        const texture1 = loader.load(url, texture => {
          mat.uniforms.texture.value = texture
          renderer.setSize(300, (texture.image.height / texture.image.width) * 300);
          renderer.render(scene, camera);
        });
      }
    })
    const scene = (this.scene = new THREE.Scene());
    const camera = new THREE.OrthographicCamera(-100, 100, 100, -100, 1, 1000);
    camera.position.z = 5;
    const renderer = (this.renderer = new THREE.WebGLRenderer({
      antialias: false
    }));

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xffffff, 0.0);
    renderer.setSize(this.width, this.height);
    app.appendChild(renderer.domElement);
    const loader = new THREE.TextureLoader();
    // const texture1 = loader.load(image, texture => {
    //   renderer.setSize(300, (texture.image.height / texture.image.width) * 100);
    //   renderer.render(scene, camera);
    // });
    const disp = loader.load(image)

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        // effectFactor: { type: "f", value: intensity },
        dispFactor: { type: "f", value: 0.0 },
        texture: { type: "t", value: null },
        disp: { type: "t", value: disp }
      },

      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      opacity: 1.0
    });

    const geometry = new THREE.PlaneBufferGeometry(this.width, this.height, 1);
    const plane = new THREE.Mesh(geometry, mat);
    scene.add(plane);
  }
}
new App();
