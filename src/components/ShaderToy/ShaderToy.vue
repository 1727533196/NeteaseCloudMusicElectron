<template>
  <div ref="container" id="container"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
// import * as THREE from 'three';

const props = defineProps({
  mainColor: {
    type: Array,
    default: () => [0.25, 0.5, 0.75], // 默认颜色为白色
  }
});
const container = ref(null);

// 定义全局变量
let scene, camera, renderer, clock, uniforms;

onMounted(() => {
  init();
  animate();
  window.addEventListener('resize', onWindowResize);
});

onUnmounted(() => {
  // 清理工作
  window.removeEventListener('resize', onWindowResize);
  renderer.dispose();
  scene = null;
  camera = null;
});

function init() {
  // 初始化场景、相机、渲染器等
  scene = new THREE.Scene();
  camera = new THREE.Camera();
  camera.position.z = 1;
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.value.appendChild(renderer.domElement);
  clock = new THREE.Clock(true);

  let geometry = new THREE.PlaneBufferGeometry(2, 2);

  uniforms = {
    iTime: { value: 0 },
    iTimeScale: { value: 0.25 }, // 添加初始值
    iResolution: { value: new THREE.Vector2() },
    uMainColor: { value: new THREE.Color(...props.mainColor) },
  };

  let material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader(),
    fragmentShader: fragmentShader(),
  });

  let mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  onWindowResize();
}

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.iResolution.value.x = renderer.domElement.width;
  uniforms.iResolution.value.y = renderer.domElement.height;
}

function animate() {
  requestAnimationFrame(animate);
  uniforms.iTime.value = clock.getElapsedTime();
  renderer.render(scene, camera);
}
// 省略了 vertexShader 和 fragmentShader 函数的定义
// 以及其他可能的辅助函数

// Vertex shader remains unchanged
function vertexShader() {
  return `
                void main() {
                    gl_Position = vec4(position, 1.0);
                }
            `;
}

// The fragment shader is adapted from the provided ShaderToy code
function fragmentShader() {
  return `
    uniform vec2 iResolution;
    uniform float iTime;
    uniform float iTimeScale; // 添加时间缩放 uniform
    uniform vec3 uMainColor;

    #define MAIN_COLOR vec3(1.0, 1.0, 1.0)

    // 伪随机数生成器
    float random(float n) {
        return fract(sin(n) * 43758.5453123);
    }

    // 1D 噪声
    float noise(float p) {
        float fl = floor(p);
        float fc = fract(p);
        return mix(random(fl), random(fl + 1.0), fc);
    }

    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        vec2 p = (2.0*fragCoord.xy - iResolution.xy) / max(iResolution.x, iResolution.y);
        for(int i = 1; i < 5; i++)
        {
            vec2 newp = p;
            float scaledTime = iTime * iTimeScale; // 使用时间缩放因子
            newp.x += 0.6/float(i) * sin(float(i) * p.y + scaledTime + 0.3*float(i)) + 1.0;
            newp.y += 0.6/float(i) * sin(float(i) * p.x + scaledTime + 0.3*float(i+10)) - 1.4;
            // 添加噪声扰动
            newp += 0.02 * vec2(noise(newp.x + scaledTime), noise(newp.y + scaledTime));
            p = newp;
        }
        vec3 col = vec3(1.0 - abs(sin(p.x)), 1.0 - abs(sin(p.x + p.y)), 1.0 - abs(sin(p.y)))
            * uMainColor;
        fragColor = vec4(col, 1.0);
    }

    void main() {
        vec2 fragCoord = gl_FragCoord.xy;
        mainImage(gl_FragColor, fragCoord);
    }
    `;
}
</script>

<style scoped lang="less">
#container {
  width: 100vw;
  height: 100vh;
  position: absolute;
}
</style>
