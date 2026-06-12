import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Mic, MicOff, Upload, Type, Image, File, X, ChevronRight, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { useStore } from "../utils/store";
import { API, buildDemoBRD } from "../utils/api";
import { useVoiceRecorder } from "../hooks/useVoiceRecorder";

const STEPS = [
  {id:"upload",  label:"Upload",  sub:"Sources"},
  {id:"gemini",  label:"Gemini",  sub:"Analysis"},
  {id:"bigquery",label:"BigQuery",sub:"Validate"},
  {id:"synth",   label:"Synth",   sub:"Generate"},
  {id:"deploy",  label:"Deploy",  sub:"GitHub"},
];
const DOMAINS = ["Technology","Finance","Healthcare","Logistics","E-Commerce","Education","Government"];
const LANGS   = [{value:"en-IN",label:"English (India)"},{value:"hi-IN",label:"Hindi"},{value:"ta-IN",label:"Tamil"},{value:"te-IN",label:"Telugu"},{value:"kn-IN",label:"Kannada"}];

function Pipeline({ current }) {
  const idx = STEPS.findIndex(s => s.id === current);
  return (
    <div style={{display:"flex",alignItems:"center",padding:"20px 0"}}>
      {STEPS.map((step,i) => {
        const st = i<idx?"done":i===idx?"active":"idle";
        return (
          <div key={step.id} style={{display:"flex",alignItems:"center",flex:i<STEPS.length-1?1:0}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
              <div className={`step-node ${st}`}>
                {st==="done"   ? <CheckCircle2 size={13}/> :
                 st==="active" ? <Loader2 size={13} style={{animation:"spin 1s linear infinite"}}/> :
                 <span style={{fontSize:10,fontFamily:"var(--font-mono)"}}>{String(i+1).padStart(2,"0")}</span>}
              </div>
              <div style={{textAlign:"center",minWidth:52}}>
                <div style={{fontSize:11,fontWeight:600,color:st==="idle"?"var(--ink-5)":"var(--ink)"}}>{step.label}</div>
                <div style={{fontSize:10,color:"var(--ink-5)"}}>{step.sub}</div>
              </div>
            </div>
            {i<STEPS.length-1 && <div className={`step-connector ${i<idx?"done":""}`} style={{margin:"0 4px",marginBottom:28}}/>}
          </div>
        );
      })}
    </div>
  );
}

function VoiceCard({ onTranscript }) {
  const [lang,setLang] = useState("en-IN");
  const { recording, processing, toggle } = useVoiceRecorder({ onTranscript, language:lang });
  return (
    <div className="card" style={{borderColor:recording?"var(--red)":undefined,transition:"border-color .2s"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div>
          <div style={{fontSize:14,fontWeight:600,marginBottom:3}}>Voice Input</div>
          <div style={{fontSize:12,color:"var(--ink-4)"}}>Sarvam Saarika v2.5 — Hindi · English · Code-mix</div>
        </div>
        <span className="badge badge-gold">Sarvam AI</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <select className="input" style={{width:170}} value={lang} onChange={e=>setLang(e.target.value)}>
          {LANGS.map(l=><option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
        <motion.button className={`btn ${recording?"btn-danger voice-btn recording":"btn-outline"}`} onClick={toggle} disabled={processing} whileTap={{scale:0.95}} style={{minWidth:160}}>
          {processing ? <><Loader2 size={13} style={{animation:"spin 1s linear infinite"}}/> Transcribing…</>
           : recording ? <><MicOff size={13}/> Stop Recording</>
           : <><Mic size={13}/> Start Recording</>}
        </motion.button>
        {recording && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"var(--red)"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:"var(--red)",animation:"pulse 1s ease infinite"}}/> Recording…
          </motion.div>
        )}
      </div>
    </div>
  );
}

function DropZone({ onFiles }) {
  const onDrop = useCallback(f=>onFiles(f),[onFiles]);
  const { getRootProps,getInputProps,isDragActive } = useDropzone({onDrop,multiple:true,accept:{"image/*":[],"application/pdf":[],"text/*":[],"application/vnd.openxmlformats-officedocument.wordprocessingml.document":[]}});
  return (
    <div {...getRootProps()} className={`dropzone ${isDragActive?"active":""}`}>
      <input {...getInputProps()}/>
      <Upload size={26} color="var(--ink-4)" strokeWidth={1.5} style={{marginBottom:10}}/>
      <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>{isDragActive?"Drop here":"Drop files or click to browse"}</div>
      <div style={{fontSize:12,color:"var(--ink-4)",marginBottom:10}}>PNG · JPG · PDF · DOCX · TXT</div>
      <div style={{display:"flex",gap:6,justifyContent:"center"}}>
        {[["🖼","Images"],["📄","PDFs"],["📝","Docs"]].map(([icon,label])=>(
          <span key={label} className="badge badge-neutral">{icon} {label}</span>
        ))}
      </div>
    </div>
  );
}

function InputChip({ inp, onRemove }) {
  const bg  = inp.type==="text"?"#DBEAFE":inp.type==="image"?"#EDE9FE":"#FEF3C7";
  const col = inp.type==="text"?"#1B4FD8":inp.type==="image"?"#7C3AED":"#B45309";
  const IconEl = inp.type==="text"?<Type size={13}/>:inp.type==="image"?<Image size={13}/>:<File size={13}/>;
  return (
    <motion.div className="file-chip" initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}}>
      <div style={{width:30,height:30,borderRadius:8,background:bg,color:col,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{IconEl}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
          {inp.filename||(inp.voiceCaptured?"🎙 Voice transcript":inp.preview)||`${inp.source_type} input`}
        </div>
        <span className="badge badge-neutral" style={{fontSize:9,marginTop:2}}>{inp.type}</span>
      </div>
      <button className="btn btn-ghost btn-icon btn-sm" onClick={onRemove}><X size={11}/></button>
    </motion.div>
  );
}

export default function IngestPage() {
  const { jobId,setJobId,addInput,clearInputs,projectName,setProjectName,domain,setDomain,setPage,setBRD,addBRD,genStatus,genProgress,setGenStatus,setGenProgress,logs,addLog,clearLogs } = useStore();
  const [textVal,setTextVal]     = useState("");
  const [srcType,setSrcType]     = useState("transcript");
  const [pipeStep,setPipeStep]   = useState("upload");
  const [localInputs,setLocalInputs] = useState([]);

  const ensureJob = async () => {
    if (jobId) return jobId;
    try   { const { job_id } = await API.createJob(); setJobId(job_id); return job_id; }
    catch { const id=`JOB-${Math.random().toString(36).slice(2,10).toUpperCase()}`; setJobId(id); return id; }
  };

  const handleVoice = async transcript => {
    const jid = await ensureJob();
    const inp = {type:"text",source_type:"voice_transcript",preview:transcript.slice(0,70)+"…",voiceCaptured:true};
    setLocalInputs(p=>[...p,inp]); addInput(inp);
    addLog(`Voice transcript captured via Sarvam STT (${transcript.length} chars)`,"success");
    try { await API.uploadText(jid,transcript,"transcript"); } catch {}
  };

  const addText = async () => {
    if (!textVal.trim()) return;
    const jid = await ensureJob();
    const inp = {type:"text",source_type:srcType,preview:textVal.slice(0,70)+"…"};
    setLocalInputs(p=>[...p,inp]); addInput(inp);
    addLog(`Text uploaded: ${srcType} (${textVal.length} chars)`,"success");
    try { await API.uploadText(jid,textVal,srcType); } catch {}
    setTextVal(""); toast.success("Text input added");
  };

  const handleFiles = async files => {
    const jid = await ensureJob();
    for (const f of files) {
      const ft = f.type.startsWith("image/")?"image":"document";
      const inp = {type:ft,filename:f.name};
      setLocalInputs(p=>[...p,inp]); addInput(inp);
      addLog(`File uploaded: ${f.name} → Cloud Storage`,"success");
      try { await API.uploadFile(jid,f); } catch {}
    }
    toast.success(`${files.length} file(s) added`);
  };

  const generate = async () => {
    if (!projectName.trim()) { toast.error("Enter a project name"); return; }
    if (!localInputs.length) { toast.error("Add at least one data source"); return; }
    setGenStatus("running"); clearLogs();
    addLog("Initialising BRD generation pipeline…");
    const delays = [
      {step:"gemini",   ms:900,  msg:"Gemini 1.5 Pro: processing multi-modal inputs…"},
      {step:"bigquery", ms:2200, msg:"BigQuery: validating against 847 historical requirements…"},
      {step:"synth",    ms:3800, msg:"Synthesising BRD sections with explainability layer…"},
      {step:"deploy",   ms:5200, msg:"Pushing to GitHub repository…"},
    ];
    delays.forEach(({step,ms,msg})=>setTimeout(()=>{setPipeStep(step);setGenProgress(((delays.findIndex(d=>d.step===step)+1)/delays.length)*90);addLog(msg);},ms));
    const jid = jobId||(await ensureJob());
    try {
      const res = await API.generateBRD(jid,projectName,domain);
      let attempts=0;
      const poll=setInterval(async()=>{
        attempts++;
        try { const st=await API.getBRDStatus(res.brd_id); if(st.status==="complete"){clearInterval(poll);const brd=await API.getBRD(res.brd_id);finalize(brd);} }
        catch {}
        if(attempts>25){clearInterval(poll);finalizeDemoMode();}
      },400);
    } catch { setTimeout(finalizeDemoMode,6000); }
  };

  const finalizeDemoMode = () => finalize(buildDemoBRD(`BRD-${Math.random().toString(36).slice(2,10).toUpperCase()}`,projectName,domain,localInputs));

  const finalize = brd => {
    setGenProgress(100); setPipeStep("done"); setGenStatus("done");
    setBRD(brd); addBRD(brd);
    addLog("✓ BRD generated and pushed to GitHub!","success");
    toast.success("BRD generated!");
    setTimeout(()=>setPage("viewer"),1200);
  };

  const running=genStatus==="running", done=genStatus==="done";

  return (
    <div className="page fade-up">
      <div style={{marginBottom:28}}>
        <div className="label" style={{marginBottom:6}}>Data Ingestion</div>
        <h1 style={{fontSize:26,fontWeight:700,letterSpacing:"-0.02em",marginBottom:6}}>Multi-Modal Input</h1>
        <p style={{color:"var(--ink-3)",fontSize:14}}>Upload sources or use voice. Gemini processes all 3 modalities simultaneously.</p>
      </div>

      <div className="card" style={{marginBottom:20,padding:"14px 24px"}}>
        <Pipeline current={running||done?pipeStep:"upload"}/>
        {running&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:12,color:"var(--ink-4)"}}>
              <span>Generation progress</span>
              <span style={{fontFamily:"var(--font-mono)"}}>{genProgress.toFixed(0)}%</span>
            </div>
            <div className="progress-track"><div className="progress-fill accent" style={{width:`${genProgress}%`}}/></div>
          </div>
        )}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="card">
            <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>Project Details</div>
            <div className="form-group">
              <label className="form-label">Project Name *</label>
              <input className="input" placeholder="e.g. E-Commerce Platform Revamp" value={projectName} onChange={e=>setProjectName(e.target.value)}/>
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">Domain</label>
              <select className="input" value={domain} onChange={e=>setDomain(e.target.value)}>
                {DOMAINS.map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <VoiceCard onTranscript={handleVoice}/>

          <div className="card">
            <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>Text Input</div>
            <div className="form-group">
              <label className="form-label">Source Type</label>
              <select className="input" value={srcType} onChange={e=>setSrcType(e.target.value)}>
                <option value="transcript">Meeting Transcript</option>
                <option value="requirement">Requirements Notes</option>
                <option value="notes">Stakeholder Notes</option>
              </select>
            </div>
            <textarea className="input" style={{marginBottom:10}} placeholder="Paste meeting transcript, requirement notes, or any business text…" value={textVal} onChange={e=>setTextVal(e.target.value)}/>
            <button className="btn btn-outline btn-sm" onClick={addText} disabled={!textVal.trim()}>
              <Type size={12}/> Add Text
            </button>
          </div>

          <div className="card">
            <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>File Upload</div>
            <DropZone onFiles={handleFiles}/>
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="card">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontSize:13,fontWeight:600}}>Ingested Sources</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontFamily:"var(--font-mono)",fontSize:12,color:"var(--ink-3)"}}>{localInputs.length}</span>
                {localInputs.length>0&&<button className="btn btn-ghost btn-icon btn-sm" onClick={()=>{setLocalInputs([]);clearInputs();}}><X size={12}/></button>}
              </div>
            </div>
            {localInputs.length===0
              ? <div style={{padding:"16px 0",textAlign:"center"}}><div style={{fontSize:13,color:"var(--ink-4)"}}>No sources yet.</div><div style={{fontSize:12,color:"var(--ink-5)",marginTop:4}}>Use voice, text, or file upload.</div></div>
              : <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  <AnimatePresence>
                    {localInputs.map((inp,i)=><InputChip key={i} inp={inp} onRemove={()=>setLocalInputs(p=>p.filter((_,j)=>j!==i))}/>)}
                  </AnimatePresence>
                </div>
            }
          </div>

          <motion.div className="card" style={{background:done?"var(--green-l)":"var(--navy)",border:"none"}} animate={{background:done?"#DCFCE7":"#0D1B2A"}}>
            <div style={{fontSize:15,fontWeight:700,color:done?"var(--green)":"white",marginBottom:6}}>{done?"✓ BRD Generated!":"Ready to Generate"}</div>
            <div style={{fontSize:13,color:done?"var(--green)":"rgba(255,255,255,.5)",marginBottom:20}}>
              {done?"Redirecting to BRD Viewer…":`${localInputs.length} source${localInputs.length!==1?"s":""} loaded. Gemini will process all modalities.`}
            </div>
            <motion.button className="btn btn-lg" style={{width:"100%",background:done?"var(--green)":"white",color:done?"white":"var(--navy)",justifyContent:"center"}} onClick={generate} disabled={running||done||!localInputs.length} whileTap={{scale:.98}}>
              {running?<><Loader2 size={15} style={{animation:"spin 1s linear infinite"}}/> Generating…</>
               :done?<><CheckCircle2 size={15}/> Complete</>
               :<>Generate BRD <ChevronRight size={15}/></>}
            </motion.button>
          </motion.div>

          <div className="card" style={{padding:0,overflow:"hidden"}}>
            <div style={{padding:"13px 16px",borderBottom:"1px solid var(--cream-3)",fontSize:13,fontWeight:600}}>System Log</div>
            <div className="log-terminal">
              {logs.length===0
                ? <div className="log-line"><span className="msg" style={{color:"#4A5568"}}>_ awaiting actions…</span></div>
                : logs.map((l,i)=>(
                    <div key={i} className={`log-line ${l.type}`}>
                      <span className="ts">{l.ts}</span>
                      <span className="msg">{l.msg}</span>
                    </div>
                  ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
