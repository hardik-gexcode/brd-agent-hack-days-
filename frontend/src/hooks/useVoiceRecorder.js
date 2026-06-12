import { useState, useRef, useCallback } from "react";
import { sarvamSTT } from "../utils/api";
import toast from "react-hot-toast";

export function useVoiceRecorder({ onTranscript, language="en-IN" }) {
  const [recording,  setRecording]  = useState(false);
  const [processing, setProcessing] = useState(false);
  const media  = useRef(null);
  const chunks = useRef([]);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec    = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunks.current = [];
      rec.ondataavailable = e => { if (e.data.size > 0) chunks.current.push(e.data); };
      rec.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        setProcessing(true);
        try {
          const t = await sarvamSTT(new Blob(chunks.current, { type: "audio/webm" }), language);
          if (t) { onTranscript(t); toast.success("Voice captured via Sarvam Saarika v2.5"); }
          else     toast.error("No speech detected — try again");
        } catch {
          const demo = "The system must support real-time processing of text, images, and documents. Response time should not exceed 60 seconds. Integrate with Google Cloud Storage and BigQuery. Voice-enabled multilingual input via Sarvam AI Saarika is required for Indian language accessibility.";
          onTranscript(demo);
          toast("Demo transcript — add VITE_SARVAM_API_KEY for live STT", { icon: "ℹ️" });
        } finally { setProcessing(false); }
      };
      media.current = rec;
      rec.start(250);
      setRecording(true);
    } catch { toast.error("Microphone access denied"); }
  }, [language, onTranscript]);

  const stop   = useCallback(() => { if (media.current?.state === "recording") { media.current.stop(); setRecording(false); } }, []);
  const toggle = useCallback(() => recording ? stop() : start(), [recording, start, stop]);
  return { recording, processing, toggle };
}
