import { create } from "zustand";
export const useStore = create((set) => ({
  page:"home", setPage:(v)=>set({page:v}),
  jobId:null,  setJobId:(v)=>set({jobId:v}),
  inputs:[], addInput:(i)=>set(s=>({inputs:[...s.inputs,i]})),
  clearInputs:()=>set({inputs:[],jobId:null}),
  brd:null, setBRD:(v)=>set({brd:v}),
  brds:[], addBRD:(b)=>set(s=>({brds:[b,...s.brds]})),
  genStatus:"idle", genProgress:0,
  setGenStatus:(v)=>set({genStatus:v}),
  setGenProgress:(v)=>set({genProgress:v}),
  logs:[],
  addLog:(msg,type="info")=>set(s=>({logs:[...s.logs,{msg,type,
    ts:new Date().toLocaleTimeString("en-IN",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"})
  }].slice(-40)})),
  clearLogs:()=>set({logs:[]}),
  projectName:"", domain:"Technology",
  setProjectName:(v)=>set({projectName:v}),
  setDomain:(v)=>set({domain:v}),
}));
