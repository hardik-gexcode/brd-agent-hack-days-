import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Layers, Mic, TrendingUp, Clock, CheckCircle2, Brain } from "lucide-react";
import { useStore } from "../utils/store";
import { API } from "../utils/api";
const SAMPLE = [
  {id:"BRD-A1B2C3D4",project_name:"E-Commerce Platform Revamp",requirements_count:24,generated_at:"2026-06-10T09:14:00Z",domain:"E-Commerce"},
  {id:"BRD-E5F6G7H8",project_name:"Internal HR Automation Suite",requirements_count:17,generated_at:"2026-06-09T14:30:00Z",domain:"Technology"},
  {id:"BRD-I9J0K1L2",project_name:"Supply Chain Analytics Dashboard",requirements_count:31,generated_at:"2026-06-08T11:05:00Z",domain:"Logistics"},
];
function Stat({icon:Icon,label,value,sub,color,delay=0}){
  return(
    <motion.div className="stat-card" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay,ease:[0.16,1,0.3,1]}} style={{position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:color,borderRadius:"12px 12px 0 0"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
        <div className="stat-label">{label}</div>
        <div style={{width:34,height:34,borderRadius:9,background:color+"18",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon size={15} color={color} strokeWidth={1.8}/></div>
      </div>
      <div className="stat-value">{value}</div>
      {sub&&<div className="stat-sub">{sub}</div>}
    </motion.div>
  );
}
export default function DashboardPage(){
  const{setPage,setBRD}=useStore();
  const[all,setAll]=useState(SAMPLE);
  useEffect(()=>{API.listBRDs().then(d=>{if(d?.brds?.length)setAll(p=>[...d.brds,...p]);}).catch(()=>{});},[]);
  const open=brd=>{if(brd.sections){setBRD(brd);setPage("viewer");}else setPage("viewer");};
  return(
    <div className="page fade-up">
      <div style={{marginBottom:28}}>
        <div className="label" style={{marginBottom:6}}>Command Center</div>
        <h1 style={{fontSize:28,fontWeight:700,letterSpacing:"-0.02em",marginBottom:6}}>Dashboard</h1>
        <p style={{color:"var(--ink-3)",fontSize:14}}>Multi-modal BRD generation · Gemini 1.5 Pro · Sarvam AI · BigQuery · Vertex AI</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
        <Stat icon={FileText}   label="BRDs Generated" value={all.length}                                                   sub="this session"        color="#1B4FD8" delay={0}/>
        <Stat icon={Layers}     label="Reqs Extracted"  value={all.reduce((a,b)=>a+(b.requirements_count||0),0)}             sub="across all jobs"     color="#7C3AED" delay={0.06}/>
        <Stat icon={Mic}        label="Voice Sessions"  value="3"                                                            sub="Sarvam Saarika v2.5" color="#DC2626" delay={0.12}/>
        <Stat icon={TrendingUp} label="Avg Confidence"  value="94.2%"                                                        sub="Gemini score"        color="#15803D" delay={0.18}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:20,marginBottom:20}}>
        <motion.div className="card" style={{background:"var(--navy)",border:"none",cursor:"pointer"}} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.2}} onClick={()=>setPage("ingest")} whileHover={{y:-2}}>
          <div style={{width:44,height:44,borderRadius:12,background:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}><Brain size={22} color="white" strokeWidth={1.5}/></div>
          <h2 style={{fontSize:18,fontWeight:700,color:"white",letterSpacing:"-0.01em",marginBottom:8}}>Generate a BRD</h2>
          <p style={{fontSize:13,color:"rgba(255,255,255,.5)",lineHeight:1.6,marginBottom:20}}>Upload transcripts, whiteboard images, or docs — or speak in Hindi/English via Sarvam AI Saarika v2.5.</p>
          <div style={{display:"flex",alignItems:"center",gap:6,color:"white",fontSize:13,fontWeight:600}}>Start New Job <ArrowRight size={14}/></div>
        </motion.div>
        <motion.div className="card" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.24}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:16}}>Data Flow Pipeline</div>
          {[["01","Ingest","Text · Images · Docs · Voice (Sarvam STT)","#DBEAFE"],["02","Process","Gemini 1.5 Pro multi-modal analysis","#EDE9FE"],["03","Validate","BigQuery cross-check vs 847 requirements","#FEF3C7"],["04","Generate","Explainable BRD + source attribution","#DCFCE7"],["05","Deploy","GitHub push · Sarvam TTS narration","#FEE2E2"]].map(([n,t,d,bg],i)=>(
            <div key={n} style={{display:"flex",gap:12,marginBottom:i<4?14:0,alignItems:"flex-start"}}>
              <div style={{width:30,height:30,borderRadius:8,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0,fontFamily:"var(--font-mono)"}}>{n}</div>
              <div><div style={{fontSize:13,fontWeight:600,marginBottom:2}}>{t}</div><div style={{fontSize:12,color:"var(--ink-4)"}}>{d}</div></div>
            </div>
          ))}
        </motion.div>
      </div>
      <motion.div className="card" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.3}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:600}}>Recent BRDs</div>
          <button className="btn btn-ghost btn-sm" onClick={()=>setPage("ingest")}>New <ArrowRight size={11}/></button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1.8fr 1fr 80px 130px 90px 80px",gap:12,padding:"0 0 10px",borderBottom:"1px solid var(--cream-3)",marginBottom:4}}>
          {["Project","Domain","Reqs","Generated","Status",""].map(h=><div key={h} className="label" style={{fontSize:10}}>{h}</div>)}
        </div>
        {all.map((brd,i)=>(
          <motion.div key={brd.id} style={{display:"grid",gridTemplateColumns:"1.8fr 1fr 80px 130px 90px 80px",gap:12,padding:"12px 0",borderBottom:"1px solid var(--cream-2)",alignItems:"center"}} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.3+i*.05}}>
            <div><div style={{fontSize:13,fontWeight:600,marginBottom:2}}>{brd.project_name}</div><div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--ink-5)"}}>{brd.id}</div></div>
            <div><span className="badge badge-neutral">{brd.domain||"Technology"}</span></div>
            <div style={{fontFamily:"var(--font-mono)",fontSize:13}}>{brd.requirements_count||"—"}</div>
            <div style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:"var(--ink-4)"}}><Clock size={11}/>{new Date(brd.generated_at).toLocaleDateString("en-IN")}</div>
            <div><span className="badge badge-green" style={{fontSize:10}}><CheckCircle2 size={9}/> Complete</span></div>
            <div><button className="btn btn-outline btn-sm" style={{fontSize:11,padding:"5px 12px"}} onClick={()=>open(brd)}>View</button></div>
          </motion.div>
        ))}
      </motion.div>
      <motion.div className="card" style={{marginTop:20,display:"flex",gap:20,alignItems:"center",flexWrap:"wrap",background:"var(--gold-l)",border:"1px solid rgba(180,83,9,.15)"}} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.4}}>
        <div style={{flex:1}}>
          <div className="label" style={{color:"var(--gold)",marginBottom:4}}>Sarvam AI Integration</div>
          <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>Voice-first BRD generation · Multilingual narration</div>
          <div style={{fontSize:13,color:"var(--ink-3)"}}>Saarika v2.5 STT captures Hindi/English voice. Bulbul v1 TTS narrates BRD sections. Only AgniBytes ships this.</div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <span className="badge badge-gold">Saarika v2.5 STT</span>
          <span className="badge badge-gold">Bulbul v1 TTS</span>
        </div>
      </motion.div>
    </div>
  );
}
