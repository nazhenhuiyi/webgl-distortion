import { DisplaymentCanvas } from "./canvas";
import * as THREE from "three";
import "./styles.css";
const displaymentCanvs = new DisplaymentCanvas();
const image = require("./sample.jpg");
var vertex = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `;

var fragment = `
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
    const button = document.createElement("button");
    button.textContent = "生成";
    button.addEventListener("click", () => {
      mat.uniforms.disp.value = new THREE.CanvasTexture(
        displaymentCanvs.canvas
      );
      renderer.render(scene, camera);
    });
    document.body.appendChild(button);
    const scene = (this.scene = new THREE.Scene());
    var camera = new THREE.OrthographicCamera(-100, 100, 100, -100, 1, 1000);
    camera.position.z = 5;

    const renderer = (this.renderer = new THREE.WebGLRenderer({
      antialias: false
    }));

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xffffff, 0.0);
    renderer.setSize(this.width, this.height);
    document.body.appendChild(renderer.domElement);
    var loader = new THREE.TextureLoader();
    var texture1 = loader.load(image, texture => {
      renderer.setSize(300, (texture.image.height / texture.image.width) * 100);
      renderer.render(scene, camera);
    });
    var disp = new THREE.CanvasTexture(displaymentCanvs.canvas);

    var mat = new THREE.ShaderMaterial({
      uniforms: {
        // effectFactor: { type: "f", value: intensity },
        dispFactor: { type: "f", value: 0.0 },
        texture: { type: "t", value: texture1 },
        disp: { type: "t", value: disp }
      },

      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      opacity: 1.0
    });

    var geometry = new THREE.PlaneBufferGeometry(this.width, this.height, 1);
    var plane = new THREE.Mesh(geometry, mat);
    scene.add(plane);
  }
}
new App();
