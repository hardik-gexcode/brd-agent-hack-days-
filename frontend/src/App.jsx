import { Suspense, lazy } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./components/Sidebar";
import { useStore } from "./utils/store";
const HomePage      = lazy(() => import("./pages/HomePage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const IngestPage    = lazy(() => import("./pages/IngestPage"));
const ViewerPage    = lazy(() => import("./pages/ViewerPage"));
const MAP = { home:HomePage, dashboard:DashboardPage, ingest:IngestPage, viewer:ViewerPage };
function Loader() {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",gap:12}}>
      <div style={{width:20,height:20,border:"2px solid var(--cream-3)",borderTop:"2px solid var(--ink)",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
      <span style={{color:"var(--ink-4)",fontSize:14}}>Loading…</span>
    </div>
  );
}
function HomeNav() {
  const { setPage } = useStore();
  return (
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,background:"rgba(247,246,242,0.88)",backdropFilter:"blur(12px)",borderBottom:"1px solid var(--cream-3)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 48px",height:60}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:28,height:28,borderRadius:8,background:"var(--navy)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span style={{color:"white",fontSize:13,lineHeight:1}}>⚡</span>
        </div>
        <span style={{fontSize:14,fontWeight:700,letterSpacing:"-0.01em"}}>REQUIX</span>
        <span className="badge badge-neutral" style={{fontSize:10}}>PS21 · AgniBytes</span>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button className="btn btn-ghost btn-sm" onClick={()=>setPage("dashboard")}>Dashboard</button>
        <button className="btn btn-primary btn-sm" onClick={()=>setPage("ingest")}>Get Started →</button>
      </div>
    </nav>
  );
}
export default function App() {
  const { page } = useStore();
  const isHome = page === "home";
  const Page = MAP[page] || HomePage;
  return (
    <div style={{display:"flex",minHeight:"100vh",background:"var(--cream)"}}>
      {!isHome && <Sidebar/>}
      <main style={{flex:1,marginLeft:isHome?0:220,minHeight:"100vh"}}>
        {isHome && <HomeNav/>}
        <Suspense fallback={<Loader/>}>
          <AnimatePresence mode="wait">
            <motion.div key={page} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.2,ease:[0.16,1,0.3,1]}}>
              <Page/>
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>
    </div>
  );
}
