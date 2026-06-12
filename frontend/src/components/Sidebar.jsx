import { motion } from "framer-motion";
import { LayoutDashboard, Upload, FileText, Zap } from "lucide-react";
import { useStore } from "../utils/store";
const NAV = [
  { id:"dashboard", icon:LayoutDashboard, label:"Dashboard"     },
  { id:"ingest",    icon:Upload,          label:"Data Ingestion" },
  { id:"viewer",    icon:FileText,        label:"BRD Viewer"    },
];
export default function Sidebar() {
  const { page, setPage } = useStore();
  return (
    <aside style={{width:220,minWidth:220,height:"100vh",position:"fixed",top:0,left:0,background:"#fff",borderRight:"1px solid var(--cream-3)",display:"flex",flexDirection:"column",zIndex:100}}>
      <div style={{padding:"22px 20px 18px",borderBottom:"1px solid var(--cream-3)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:10,background:"var(--navy)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Zap size={16} color="#fff" fill="#fff"/>
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:700,letterSpacing:"-0.01em"}}>REQUIX</div>
            <div style={{fontSize:10,color:"var(--ink-4)",letterSpacing:"0.04em"}}>PS21 · AgniBytes</div>
          </div>
        </div>
      </div>
      <nav style={{padding:"12px 10px",flex:1}}>
        <div style={{fontSize:10,fontWeight:600,color:"var(--ink-5)",letterSpacing:"0.08em",textTransform:"uppercase",padding:"6px 10px 8px"}}>Navigation</div>
        {NAV.map(item => {
          const Icon = item.icon, active = page === item.id;
          return (
            <motion.button key={item.id} className={`nav-link ${active?"active":""}`} onClick={() => setPage(item.id)} whileTap={{scale:0.97}}>
              <Icon size={15} strokeWidth={active?2.2:1.8}/>
              <span>{item.label}</span>
              {active && <motion.div layoutId="navdot" style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:"var(--ink)"}} transition={{type:"spring",stiffness:400,damping:30}}/>}
            </motion.button>
          );
        })}
      </nav>
      <div style={{padding:"14px 16px 20px",borderTop:"1px solid var(--cream-3)"}}>
        <div style={{fontSize:10,fontWeight:600,color:"var(--ink-5)",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:8}}>Powered by</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
          {["Gemini 1.5 Pro","Vertex AI","BigQuery","Sarvam AI","GCS"].map(t => (
            <span key={t} className="badge badge-neutral" style={{fontSize:10}}>{t}</span>
          ))}
        </div>
      </div>
    </aside>
  );
}
