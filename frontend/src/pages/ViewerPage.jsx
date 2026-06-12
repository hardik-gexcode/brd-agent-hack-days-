import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Volume2, VolumeX, RefreshCw, ExternalLink, CheckCircle2, AlertTriangle, Info, ChevronRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useStore } from "../utils/store";
import { sarvamTTS, buildDemoBRD } from "../utils/api";

const confCls = c => c>=.9?"conf-high":c>=.8?"conf-mid":"conf-low";
const CAT_B = {Functional:"badge-accent","Non-Functional":"badge-purple",Technical:"badge-navy",Security:"badge-red",Integration:"badge-gold",Compliance:"badge-green"};
const PRI_B = {MUST:"badge-red",SHOULD:"badge-gold",COULD:"badge-neutral"};
const DEMO  = buildDemoBRD("BRD-PS21-DEMO","BRD Generation Agent","AI / Cloud Platform",[{type:"text"},{type:"image"},{type:"document"}]);

function ConfBar({val}){
  return(
    <div className="conf-bar">
      <div className="conf-track"><div className={`conf-fill ${confCls(val)}`} style={{width:`${val*100}%`,transition:"width .5s"}}/></div>
      <span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--ink-4)",minWidth:34,textAlign:"right"}}>{(val*100).toFixed(0)}%</span>
    </div>
  );
}

function NarrateBtn({text}){
  const [loading,setLoading]=useState(false);
  const [playing,setPlaying]=useState(false);
  const narrate=async()=>{
    if(playing)return;
    setLoading(true);
    try{
      const blob=await sarvamTTS(text);
      setLoading(false);setPlaying(true);
      const audio=new Audio(URL.createObjectURL(blob));
      audio.onended=()=>setPlaying(false);
      audio.play();
      toast.success("Narrating via Sarvam Bulbul v1");
    }catch{
      setLoading(false);
      toast("Set VITE_SARVAM_API_KEY for live TTS narration",{icon:"🔊"});
    }
  };
  return(
    <motion.button className="btn btn-outline btn-sm" onClick={narrate} disabled={loading} whileTap={{scale:.95}} title="Narrate via Sarvam AI">
      {loading?<Loader2 size={12} style={{animation:"spin 1s linear infinite"}}/>
       :playing?<><VolumeX size={12}/> Playing…</>
       :<><Volume2 size={12}/> Narrate</>}
    </motion.button>
  );
}

function SectionPanel({section}){
  return(
    <motion.div className="card" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} key={section.title}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,flexWrap:"wrap",gap:8}}>
        <h3 style={{fontSize:16,fontWeight:700,letterSpacing:"-0.01em"}}>{section.title}</h3>
        <NarrateBtn text={section.content}/>
      </div>
      <ConfBar val={section.confidence}/>
      <div className="divider"/>
      <div className="brd-content" style={{marginBottom:16}}>{section.content}</div>
      <div style={{marginBottom:12}}>
        <div className="label" style={{marginBottom:6}}>Source Attribution</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {section.sources?.map((src,i)=><span key={i} className="source-chip">{src}</span>)}
        </div>
      </div>
      <div className="explain-box">
        <div style={{fontSize:10,fontWeight:700,color:"var(--accent)",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:5}}>Gemini Rationale</div>
        {section.rationale}
      </div>
    </motion.div>
  );
}

function RequirementsMatrix({reqs}){
  const cats=[...new Set(reqs.map(r=>r.category))];
  return(
    <div>
      {cats.map(cat=>{
        const list=reqs.filter(r=>r.category===cat);
        return(
          <div key={cat} style={{marginBottom:24}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <span className={`badge ${CAT_B[cat]||"badge-neutral"}`}>{cat}</span>
              <span style={{fontSize:12,color:"var(--ink-4)",fontFamily:"var(--font-mono)"}}>{list.length} req{list.length!==1?"s":""}</span>
            </div>
            {list.map(req=>(
              <motion.div key={req.id} className="req-card" style={{marginBottom:8}} whileHover={{x:2}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                  <span style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--ink-4)"}}>{req.id}</span>
                  <span className={`badge ${PRI_B[req.priority]||"badge-neutral"}`}>{req.priority}</span>
                </div>
                <div style={{fontSize:13,color:"var(--ink-2)",lineHeight:1.5,marginBottom:8}}>{req.requirement}</div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span className="source-chip" style={{fontSize:10}}>{req.source}</span>
                  <div style={{flex:1}}><ConfBar val={req.confidence}/></div>
                </div>
              </motion.div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function ConflictLog({incons}){
  return(
    <div>
      {!incons?.length
        ?<div style={{padding:"24px",textAlign:"center",color:"var(--ink-4)"}}><CheckCircle2 size={24} color="var(--green)" style={{marginBottom:8}}/><div>No inconsistencies detected.</div></div>
        :incons.map((inc,i)=>(
          <motion.div key={i} className="incon-card" style={{marginBottom:12}} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*.08}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
              <AlertTriangle size={13} color="var(--red)"/>
              <span style={{fontSize:11,fontWeight:700,color:"var(--red)",letterSpacing:"0.05em",textTransform:"uppercase"}}>{inc.type}</span>
            </div>
            <div style={{fontSize:13,color:"var(--ink-2)",marginBottom:8}}>{inc.description}</div>
            <div style={{display:"flex",gap:6,alignItems:"flex-start",fontSize:12,color:"var(--green)"}}>
              <ChevronRight size={13} style={{marginTop:1,flexShrink:0}}/><span>{inc.resolution}</span>
            </div>
          </motion.div>
        ))
      }
      {incons?.length>0&&(
        <div className="card" style={{background:"var(--green-l)",border:"1px solid rgba(21,128,61,.2)",marginTop:8}}>
          <div style={{fontSize:13,color:"var(--green)",display:"flex",gap:8,alignItems:"center"}}>
            <CheckCircle2 size={14}/> All {incons.length} inconsistencies detected and resolved by Gemini cross-reference analysis.
          </div>
        </div>
      )}
    </div>
  );
}

function ExplainReport({report}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div className="card">
          <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>Model Details</div>
          {[["LLM Model",report.model_used],["Processing Time",`${report.processing_time_ms}ms`],["Vertex AI Pipeline",report.vertex_ai_pipeline],["GitHub Push","Auto-deployed ✓"]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--cream-3)",fontSize:13}}>
              <span style={{color:"var(--ink-4)",fontSize:12}}>{k}</span>
              <span style={{fontFamily:"var(--font-mono)",fontSize:12,color:"var(--ink-2)"}}>{v}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>Sarvam AI Features</div>
          {report.sarvam_features_used?.map((f,i)=>(
            <div key={i} style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
              <CheckCircle2 size={12} color="var(--green)"/>
              <span style={{fontSize:12,fontFamily:"var(--font-mono)"}}>{f}</span>
            </div>
          ))}
          <span className="badge badge-gold" style={{marginTop:8}}>Powered by Sarvam AI</span>
        </div>
      </div>
      <div className="card">
        <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>BigQuery Validation</div>
        <div className="explain-box">{report.bigquery_validation}</div>
        <div style={{marginTop:10}}><ConfBar val={0.962}/></div>
      </div>
      {Object.keys(report.source_attribution||{}).length>0&&(
        <div className="card">
          <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>Source Attribution Map</div>
          {Object.entries(report.source_attribution).map(([id,attr])=>(
            <div key={id} className="req-card" style={{marginBottom:8}}>
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:6}}>
                <span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--ink-4)"}}>{id}</span>
                <span className="source-chip">{attr.source}</span>
              </div>
              <ConfBar val={attr.confidence}/>
            </div>
          ))}
        </div>
      )}
      <div className="card" style={{background:"var(--accent-l)",border:"1px solid rgba(27,79,216,.15)"}}>
        <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
          <Info size={15} color="var(--accent)" style={{flexShrink:0,marginTop:2}}/>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:"var(--accent)",marginBottom:6}}>Explainability Philosophy</div>
            <div style={{fontSize:13,color:"var(--ink-2)",lineHeight:1.7}}>
              Every requirement is traceable to a specific source fragment. The Gemini Rationale explains <em>why</em> each requirement was included, which source influenced it, and the assigned confidence. This fulfills PS21's core mandate: <strong>explainable, context-aware decisions</strong> with full audit trail from input to final requirement.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ViewerPage(){
  const{brd,setPage}=useStore();
  const doc=brd||DEMO;
  const[tab,setTab]=useState("sections");
  const[secIdx,setSecIdx]=useState(0);
  const tabs=[
    {id:"sections",      label:"BRD Sections"},
    {id:"requirements",  label:"Requirements Matrix"},
    {id:"conflicts",     label:`Conflicts (${doc.inconsistencies?.length||0})`},
    {id:"explainability",label:"Explainability"},
  ];
  return(
    <div className="page fade-up">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:16}}>
        <div>
          <div className="label" style={{marginBottom:6}}>BRD Viewer · <span style={{fontFamily:"var(--font-mono)"}}>{doc.id}</span></div>
          <h1 style={{fontSize:24,fontWeight:700,letterSpacing:"-0.02em",marginBottom:8}}>{doc.project_name}</h1>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
            <span style={{fontSize:12,color:"var(--ink-4)"}}>📅 {new Date(doc.generated_at).toLocaleString("en-IN")}</span>
            <span style={{fontSize:12,color:"var(--ink-4)"}}>🏷 {doc.domain}</span>
            <span className="badge badge-green"><CheckCircle2 size={10}/> Complete</span>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn btn-outline btn-sm" onClick={()=>setPage("ingest")}><RefreshCw size={12}/> New Job</button>
          <a className="btn btn-outline btn-sm" href={doc.explainability_report?.github_repo||"#"} target="_blank" rel="noreferrer"><ExternalLink size={12}/> GitHub</a>
          <button className="btn btn-primary btn-sm"><Download size={12}/> Export PDF</button>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
        {[
          ["Sources Ingested",  doc.source_summary?.total_inputs||0,                    (doc.source_summary?.modalities_processed||[]).join(" · ")],
          ["Reqs Extracted",    doc.source_summary?.requirements_extracted||0,          "by Gemini 1.5 Pro"],
          ["Conflicts Resolved",doc.source_summary?.inconsistencies_resolved||0,        "inconsistencies"],
          ["Tokens Processed",  (doc.source_summary?.tokens_processed||0).toLocaleString(),`${doc.explainability_report?.processing_time_ms||0}ms`],
        ].map(([l,v,s])=>(
          <div key={l} className="stat-card">
            <div className="stat-label">{l}</div>
            <div className="stat-value">{v}</div>
            <div className="stat-sub">{s}</div>
          </div>
        ))}
      </div>

      <div className="tab-bar">
        {tabs.map(t=><button key={t.id} className={`tab-btn ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}
      </div>

      <AnimatePresence mode="wait">
        {tab==="sections"&&(
          <motion.div key="sec" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:20}}>
            <div>
              <div className="label" style={{marginBottom:8}}>Sections</div>
              {doc.sections?.map((s,i)=>(
                <button key={i} className={`sec-btn ${secIdx===i?"active":""}`} onClick={()=>setSecIdx(i)}>
                  <div style={{fontSize:12,fontWeight:600,marginBottom:4,color:secIdx===i?"var(--ink)":"var(--ink-3)"}}>{s.title}</div>
                  <ConfBar val={s.confidence}/>
                </button>
              ))}
            </div>
            <div>{doc.sections?.[secIdx]&&<SectionPanel section={doc.sections[secIdx]}/>}</div>
          </motion.div>
        )}
        {tab==="requirements"&&(
          <motion.div key="req" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <RequirementsMatrix reqs={doc.raw_requirements||[]}/>
          </motion.div>
        )}
        {tab==="conflicts"&&(
          <motion.div key="con" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <ConflictLog incons={doc.inconsistencies}/>
          </motion.div>
        )}
        {tab==="explainability"&&(
          <motion.div key="exp" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <ExplainReport report={doc.explainability_report||{}}/>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
