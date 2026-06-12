const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const SK   = import.meta.env.VITE_SARVAM_API_KEY || "";

async function req(path, opts={}) {
  const r = await fetch(`${BASE}${path}`,{headers:{"Content-Type":"application/json",...(opts.headers||{})},...opts});
  if(!r.ok){const e=await r.json().catch(()=>({detail:r.statusText}));throw new Error(e.detail||`API ${r.status}`);}
  return r.json();
}
export const API = {
  createJob:()=>req("/api/jobs/create",{method:"POST"}),
  uploadText:(jid,text,st="transcript")=>req(`/api/jobs/${jid}/upload/text`,{method:"POST",body:JSON.stringify({text,source_type:st})}),
  uploadFile:async(jid,file)=>{const f=new FormData();f.append("file",file);const r=await fetch(`${BASE}/api/jobs/${jid}/upload/file`,{method:"POST",body:f});if(!r.ok)throw new Error(`Upload ${r.status}`);return r.json();},
  generateBRD:(jid,pn,domain,st=[])=>req("/api/brd/generate",{method:"POST",body:JSON.stringify({job_id:jid,project_name:pn,domain,stakeholders:st})}),
  getBRDStatus:(id)=>req(`/api/brd/${id}/status`),
  getBRD:(id)=>req(`/api/brd/${id}`),
  listBRDs:()=>req("/api/brds"),
};

export async function sarvamSTT(blob,language="en-IN"){
  if(!SK)throw new Error("no key");
  const f=new FormData();f.append("file",blob,"rec.wav");f.append("model","saarika:v2.5");f.append("language_code",language);
  const r=await fetch("https://api.sarvam.ai/speech-to-text",{method:"POST",headers:{"api-subscription-key":SK},body:f});
  if(!r.ok)throw new Error(`STT ${r.status}`);
  return (await r.json()).transcript||"";
}

export async function sarvamTTS(text,language="en-IN",speaker="meera"){
  if(!SK)throw new Error("no key");
  const r=await fetch("https://api.sarvam.ai/text-to-speech",{
    method:"POST",
    headers:{"Content-Type":"application/json","api-subscription-key":SK},
    body:JSON.stringify({inputs:[text.slice(0,500)],target_language_code:language,speaker,model:"bulbul:v1",pitch:0,pace:1.0,loudness:1.5,speech_sample_rate:22050,enable_preprocessing:true})
  });
  if(!r.ok)throw new Error(`TTS ${r.status}`);
  const d=await r.json();
  const bytes=atob(d.audios[0]);const buf=new Uint8Array(bytes.length);
  for(let i=0;i<bytes.length;i++)buf[i]=bytes.charCodeAt(i);
  return new Blob([buf],{type:"audio/wav"});
}

export function buildDemoBRD(id,pn,domain,inputs){
  const mods=[...new Set(inputs.map(i=>i.type==="text"?"meeting transcripts":i.type==="image"?"whiteboard diagrams":"legacy documents"))];
  return{
    id,project_name:pn||"BRD Agent",domain:domain||"Technology",
    generated_at:new Date().toISOString(),status:"complete",
    source_summary:{total_inputs:inputs.length,modalities_processed:mods,requirements_extracted:10,inconsistencies_resolved:2,tokens_processed:4820},
    sections:[
      {title:"1. Executive Summary",content:`This BRD defines requirements for ${pn}. Powered by Google Gemini 1.5 Pro + Sarvam AI (Saarika v2.5 STT + Bulbul v1 TTS) + Vertex AI + BigQuery. Requirements extracted from ${inputs.length} source(s) across ${mods.join(", ")}.`,sources:mods,confidence:0.96,rationale:"Synthesized from all ingested data sources with BigQuery cross-validation."},
      {title:"2. Business Objectives & Scope",content:"OBJECTIVE: Eliminate manual BRD creation bottlenecks by 90%.\n\nSCOPE:\n• Multi-modal data ingestion (text, image, document)\n• Voice capture via Sarvam Saarika v2.5 STT\n• Automated requirement extraction and conflict resolution\n• Explainable AI outputs with full source attribution\n• BRD narration via Sarvam Bulbul v1 TTS\n• GitHub auto-push for version control",sources:["transcripts","docs"],confidence:0.93,rationale:"Scope from stakeholder transcripts with Sarvam AI accessibility mandate."},
      {title:"3. Functional Requirements",content:"[REQ-A1B2C3] (MUST) Multi-modal ingestion — text, image, document\n[REQ-D4E5F6] (MUST) Extract requirements from whiteboard diagrams via Gemini vision\n[REQ-G7H8I9] (MUST) Detect and resolve conflicting requirements across sources\n[REQ-J0K1L2] (MUST) Voice-enabled input via Sarvam Saarika v2.5 STT\n[REQ-K3L4M5] (MUST) BRD narration via Sarvam Bulbul v1 TTS",sources:["transcripts"],confidence:0.95,rationale:"Extracted directly from multi-modal analysis."},
      {title:"4. Non-Functional Requirements",content:"[REQ-M3N4O5] (MUST) Generate draft BRD within 60 seconds\n[REQ-P6Q7R8] (MUST) 99.5% uptime SLA via Vertex AI\n[REQ-Q1R2S3] (SHOULD) Support Hindi/English code-mix transcription",sources:["docs"],confidence:0.90,rationale:"Performance benchmarks from SLA documentation."},
      {title:"5. Technical Architecture",content:"[REQ-S9T0U1] (MUST) Google Cloud Storage for raw file hosting\n[REQ-V2W3X4] (SHOULD) BigQuery for historical requirement analysis\n[REQ-W5X6Y7] (MUST) Sarvam Saarika v2.5 STT integration\n[REQ-Z8A9B0] (MUST) Sarvam Bulbul v1 TTS integration\n\nARCHITECTURE:\nIngestion (GCS) → Vertex AI + Gemini 1.5 Pro → BigQuery → FastAPI → React",sources:["transcripts","docs"],confidence:0.92,rationale:"GCP-first with Sarvam AI for Indian language accessibility."},
      {title:"6. Security & Compliance",content:"[REQ-C1D2E3] (MUST) All uploads encrypted at rest via GCP KMS\n[REQ-F4G5H6] (MUST) Explainable AI outputs with full source attribution\n[REQ-I7J8K9] (MUST) Data residency compliance (asia-south1 region)",sources:["compliance docs"],confidence:0.98,rationale:"Cross-referenced with organizational compliance policy."},
      {title:"7. Inconsistency Resolution Log",content:"[CONFLICT] Response time: transcript (30s) vs legacy doc (60s)\n→ RESOLUTION: Adopted 60s conservative baseline\n\n[GAP] No data retention policy found across any source\n→ RESOLUTION: Added GDPR-aligned 90-day retention requirement",sources:["all"],confidence:0.91,rationale:"Gemini cross-referenced all inputs to surface conflicts."},
      {title:"8. Acceptance Criteria",content:"AC-001: Processes text, image, doc inputs without errors\nAC-002: BRD achieves >85% stakeholder satisfaction\nAC-003: Processing time ≤ 60 seconds\nAC-004: Every requirement traceable to source fragment\nAC-005: Sarvam STT accuracy >90% Hindi/English\nAC-006: Sarvam TTS narration within 5 seconds",sources:["transcripts","docs"],confidence:0.90,rationale:"Criteria from stakeholder sessions."},
    ],
    raw_requirements:[
      {id:"REQ-A1B2C3",category:"Functional",requirement:"Multi-modal data ingestion (text, image, document formats)",source:"transcript",priority:"MUST",confidence:0.97},
      {id:"REQ-D4E5F6",category:"Functional",requirement:"Extract structured requirements from whiteboard diagrams via Gemini vision",source:"image",priority:"MUST",confidence:0.94},
      {id:"REQ-G7H8I9",category:"Functional",requirement:"Reconcile conflicting requirements across all data sources",source:"transcript",priority:"MUST",confidence:0.91},
      {id:"REQ-J0K1L2",category:"Functional",requirement:"Voice input capture via Sarvam AI Saarika v2.5 STT",source:"transcript",priority:"MUST",confidence:0.96},
      {id:"REQ-M3N4O5",category:"Non-Functional",requirement:"Generate draft BRD within 60 seconds of submission",source:"document",priority:"SHOULD",confidence:0.89},
      {id:"REQ-P6Q7R8",category:"Non-Functional",requirement:"Maintain 99.5% uptime SLA via Vertex AI",source:"document",priority:"MUST",confidence:0.95},
      {id:"REQ-S9T0U1",category:"Technical",requirement:"Google Cloud Storage integration for raw file hosting",source:"transcript",priority:"MUST",confidence:0.98},
      {id:"REQ-V2W3X4",category:"Technical",requirement:"Sarvam Bulbul v1 TTS for BRD section narration",source:"transcript",priority:"MUST",confidence:0.93},
      {id:"REQ-C1D2E3",category:"Security",requirement:"All uploads encrypted at rest via GCP KMS",source:"document",priority:"MUST",confidence:0.99},
      {id:"REQ-H4I5J6",category:"Integration",requirement:"Auto-push finalized BRDs to GitHub via API v3",source:"transcript",priority:"COULD",confidence:0.82},
    ],
    inconsistencies:[
      {type:"Conflict",description:"Response time differs: transcript says 30s, doc says 60s",resolution:"Adopted 60s conservative baseline; recommend stakeholder alignment"},
      {type:"Gap",description:"No data retention policy found across any source",resolution:"Added GDPR-aligned 90-day default retention requirement"},
    ],
    explainability_report:{
      model_used:"gemini-1.5-pro",processing_time_ms:1480,
      sarvam_features_used:["saarika:v2.5 (STT)","bulbul:v1 (TTS)"],
      bigquery_validation:"Validated against 847 historical requirements. 96.2% alignment with organizational standards.",
      vertex_ai_pipeline:"brd-generation-v1",
      github_repo:"https://github.com/hardik-gexcode/brd-agent-hack-days-",
      source_attribution:{
        "REQ-A1B2C3":{source:"meeting transcript",confidence:0.97},
        "REQ-D4E5F6":{source:"whiteboard image",confidence:0.94},
        "REQ-G7H8I9":{source:"meeting transcript",confidence:0.91},
        "REQ-C1D2E3":{source:"compliance policy",confidence:0.99},
      },
    },
  };
}
