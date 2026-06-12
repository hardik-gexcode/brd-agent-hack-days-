import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles() {
  const ref = useRef(); const N = 800;
  const { pos, col } = useMemo(() => {
    const p = new Float32Array(N*3), c = new Float32Array(N*3);
    for (let i = 0; i < N; i++) {
      const ring = Math.floor(i/(N/4)), angle = (i/(N/4))*Math.PI*2+ring*0.5;
      const r = 2.5+ring*0.8+Math.random()*0.4, sp = (Math.random()-0.5)*0.3;
      p[i*3]=Math.cos(angle)*r+sp; p[i*3+1]=(Math.random()-0.5)*1.2+sp; p[i*3+2]=Math.sin(angle)*r+sp;
      const t=i/N; c[i*3]=0.2+t*0.3; c[i*3+1]=0.25+t*0.2; c[i*3+2]=0.5+t*0.4;
    }
    return { pos:p, col:c };
  }, []);
  useFrame(s => { if(ref.current){ ref.current.rotation.y=s.clock.elapsedTime*0.06; ref.current.rotation.x=Math.sin(s.clock.elapsedTime*0.04)*0.1; }});
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos,3]}/>
        <bufferAttribute attach="attributes-color"    args={[col,3]}/>
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.7} sizeAttenuation/>
    </points>
  );
}

function Globe() {
  const r = useRef();
  useFrame(s => { if(r.current) r.current.rotation.y = s.clock.elapsedTime*0.12; });
  return <mesh ref={r}><sphereGeometry args={[1.4,32,32]}/><meshStandardMaterial color="#0D1B2A" wireframe transparent opacity={0.18}/></mesh>;
}

function Streams() {
  const g = useRef();
  const lines = useMemo(() => Array.from({length:6}, (_,i) => {
    const a = (i/6)*Math.PI*2, pts=[];
    for(let t=0;t<=1;t+=0.05) pts.push(new THREE.Vector3(Math.cos(a+t*0.5)*(1.5+t*1.5),(t-0.5)*0.8,Math.sin(a+t*0.5)*(1.5+t*1.5)));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),20,0.008,4,false);
  }), []);
  useFrame(s => { if(g.current) g.current.rotation.y = s.clock.elapsedTime*0.08; });
  return <group ref={g}>{lines.map((geo,i)=><mesh key={i} geometry={geo}><meshBasicMaterial color={i%2===0?"#1B4FD8":"#4F46E5"} transparent opacity={0.4}/></mesh>)}</group>;
}

export default function OrbitalScene({ height=500 }) {
  return (
    <div style={{width:"100%",height,background:"transparent"}}>
      <Canvas camera={{position:[0,1,7],fov:50}} style={{background:"transparent"}} gl={{alpha:true,antialias:true}}>
        <ambientLight intensity={0.4}/>
        <pointLight position={[5,5,5]}   intensity={1.2} color="#DBEAFE"/>
        <pointLight position={[-5,-3,-5]} intensity={0.5} color="#EDE9FE"/>
        <Particles/><Globe/><Streams/>
      </Canvas>
    </div>
  );
}
