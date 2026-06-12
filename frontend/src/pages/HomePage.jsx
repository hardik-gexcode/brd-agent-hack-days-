import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mic, FileText, Brain, Layers, CheckCircle2, Zap, Globe } from "lucide-react";
import { useStore } from "../utils/store";
const OrbitalScene = lazy(() => import("../components/OrbitalScene"));
const FEATS = [
  {icon:Layers,      title:"Multi-Modal Ingestion", desc:"Upload transcripts, whiteboard images, and legacy PDFs simultaneously. Gemini 1.5 Pro processes all 3 modalities in one pass.",                                    bg:"#DBEAFE",ic:"#1B4FD8"},
  {icon:Mic,         title:"Voice-First Capture",   desc:"Speak requirements in Hindi, English, or code-mix. Sarvam Saarika v2.5 transcribes with 95%+ accuracy across Indian languages.",                                  bg:"#FEE2E2",ic:"#DC2626",badge:"Sarvam AI"},
  {icon:Brain,       title:"Explainable AI",        desc:"Every requirement cites its exact source fragment, confidence score, and Gemini's reasoning — fully auditable for any stakeholder.",                                bg:"#EDE9FE",ic:"#7C3AED"},
  {icon:CheckCircle2,title:"Conflict Detection",    desc:"Automatically surfaces inconsistencies between fragmented sources and provides AI-generated resolution suggestions.",                                               bg:"#DCFCE7",ic:"#15803D"},
  {icon:Globe,       title:"BRD Narration",         desc:"Have your BRD read aloud by Sarvam Bulbul v1 in natural Indian English. Built for accessibility and stakeholder walkthroughs.",                                  bg:"#FEF3C7",ic:"#B45309",badge:"Sarvam AI"},
  {icon:Zap,         title:"60-Second Pipeline",    desc:"From fragmented chaos to structured, version-controlled BRD in under 60 seconds. Auto-pushed to your GitHub repository.",                                        bg:"#F0FDF4",ic:"#15803D"},
];
const FLOW = [
  {n:"01",l:"Upload or Speak",  s:"Text · Images · Documents · Voice"},
  {n:"02",l:"Gemini Processes", s:"Multi-modal analysis + conflict detection"},
  {n:"03",l:"BigQuery Validates",s:"Cross-checked against 847 historical requirements"},
  {n:"04",l:"BRD Generated",   s:"Explainable · Traceable · Narrated aloud"},
];
export default function HomePage() {
  const { setPage } = useStore();
  return (
    <div style={{paddingBottom:80,paddingTop:60}}>
      <section style={{position:"relative",overflow:"hidden",minHeight:580,display:"flex",alignItems:"center"}}>
        <div style={{position:"absolute",right:0,top:0,width:"55%",height:"100%"}}>
          <Suspense fallback={<div/>}><OrbitalScene height="100%"/></Suspense>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to right,#F7F6F2 0%,transparent 40%)"}}/>
        </div>
        <div className="page" style={{position:"relative",zIndex:10,paddingTop:60,paddingBottom:60}}>
          <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.6,ease:[0.16,1,0.3,1]}}>
            <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
              <span className="badge badge-navy">PS21 · Commudle × Google</span>
              <span className="badge badge-accent">AgniBytes</span>
            </div>
            <div style={{fontSize:13,fontWeight:700,letterSpacing:"0.15em",color:"var(--ink-4)",marginBottom:12,textTransform:"uppercase"}}>REQUIX</div>
            <h1 style={{fontSize:"clamp(34px,5vw,54px)",fontWeight:700,letterSpacing:"-0.03em",lineHeight:1.1,maxWidth:520,marginBottom:20}}>
              Turn Fragmented Data<br/>
              <span style={{fontFamily:"'Instrument Serif',Georgia,serif",fontStyle:"italic",fontWeight:400}}>into Actionable BRDs</span>
            </h1>
            <p style={{fontSize:15,color:"var(--ink-3)",maxWidth:440,lineHeight:1.7,marginBottom:32}}>
              A multi-modal AI agent built on <strong>Google Gemini 1.5 Pro</strong> and <strong>Sarvam AI</strong>.
              Upload transcripts, images, and documents — or <strong>speak</strong> in Hindi or English — and get a structured, explainable BRD in under 60 seconds.
            </p>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <motion.button className="btn btn-primary btn-lg" onClick={()=>setPage("ingest")} whileHover={{scale:1.02}} whileTap={{scale:0.98}}>
                Generate a BRD <ArrowRight size={16}/>
              </motion.button>
              <motion.button className="btn btn-outline btn-lg" onClick={()=>setPage("viewer")} whileHover={{scale:1.02}} whileTap={{scale:0.98}}>
                <FileText size={16}/> View Demo BRD
              </motion.button>
            </div>
            <div style={{display:"flex",gap:28,marginTop:40,flexWrap:"wrap"}}>
              {[["< 60s","Generation time"],["3 modalities","Text · Image · Doc"],["Voice-enabled","Sarvam AI STT/TTS"]].map(([v,l])=>(
                <div key={v}><div style={{fontSize:18,fontWeight:700,letterSpacing:"-0.02em"}}>{v}</div><div style={{fontSize:12,color:"var(--ink-4)"}}>{l}</div></div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      <section style={{background:"var(--navy)",padding:"60px 48px"}}>
        <div style={{maxWidth:1280,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:40}}>
            <div className="label" style={{color:"rgba(255,255,255,0.4)",marginBottom:8}}>How it works</div>
            <h2 style={{fontSize:28,fontWeight:700,color:"white",letterSpacing:"-0.02em"}}>Four-step pipeline</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:2}}>
            {FLOW.map((step,i)=>(
              <motion.div key={step.n} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}}
                style={{padding:"28px 24px",background:i%2===0?"rgba(255,255,255,0.04)":"rgba(255,255,255,0.02)",borderRadius:16,position:"relative"}}>
                <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.25)",fontFamily:"var(--font-mono)",letterSpacing:"0.1em",marginBottom:12}}>{step.n}</div>
                <div style={{fontSize:15,fontWeight:600,color:"white",marginBottom:6}}>{step.l}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",lineHeight:1.5}}>{step.s}</div>
                {i<FLOW.length-1&&<div style={{position:"absolute",right:-12,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.2)",fontSize:20,zIndex:1}}>→</div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="page" style={{paddingTop:64,paddingBottom:20}}>
        <div style={{marginBottom:40}}>
          <div className="label" style={{marginBottom:8}}>Capabilities</div>
          <h2 style={{fontSize:28,fontWeight:700,letterSpacing:"-0.02em"}}>What sets us apart</h2>
          <p style={{color:"var(--ink-3)",marginTop:8,maxWidth:520}}>Every competitor ships a BRD tool. Only AgniBytes adds voice-first multilingual capture + AI narration via Sarvam — in Hindi, English, and code-mix.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
          {FEATS.map((f,i)=>{const Icon=f.icon;return(
            <motion.div key={f.title} className="card" initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.08}} whileHover={{y:-2}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div style={{width:40,height:40,borderRadius:10,background:f.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Icon size={18} color={f.ic} strokeWidth={1.8}/>
                </div>
                {f.badge&&<span className="badge badge-gold" style={{fontSize:10}}>{f.badge}</span>}
              </div>
              <div style={{fontSize:14,fontWeight:600,marginBottom:6}}>{f.title}</div>
              <div style={{fontSize:13,color:"var(--ink-3)",lineHeight:1.6}}>{f.desc}</div>
            </motion.div>
          );})}
        </div>
      </section>
      <section className="page" style={{paddingTop:40}}>
        <div style={{background:"var(--navy)",borderRadius:24,padding:"48px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:24}}>
          <div>
            <h2 style={{fontSize:24,fontWeight:700,color:"white",letterSpacing:"-0.02em",marginBottom:8}}>Ready to generate your first BRD?</h2>
            <p style={{color:"rgba(255,255,255,0.5)",fontSize:14}}>Speak, upload, or paste — we handle the rest.</p>
          </div>
          <motion.button className="btn btn-lg" style={{background:"white",color:"var(--navy)",fontWeight:700}} onClick={()=>setPage("ingest")} whileHover={{scale:1.03}} whileTap={{scale:0.97}}>
            Start Now <ArrowRight size={16}/>
          </motion.button>
        </div>
      </section>
    </div>
  );
}
