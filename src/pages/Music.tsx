import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX,
  Upload, Mic, Square, Headphones, TreePine, Waves, Cloud, Wind,
  Flame, Bird, Coffee, Radio, Disc3, Trash2, Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

/* ─── Types ─── */
interface Track {
  id: string;
  title: string;
  category: string;
  icon: React.ElementType;
  generator: (ctx: AudioContext) => AudioNode[];
}

interface Recording {
  id: string;
  name: string;
  blob: Blob;
  url: string;
  date: string;
  duration: number;
}

interface UploadedTrack {
  id: string;
  name: string;
  url: string;
  date: string;
}

/* ─── Ambient sound generators using Web Audio API ─── */
const createNoise = (ctx: AudioContext, type: "white" | "pink" | "brown"): AudioNode[] => {
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    if (type === "white") {
      data[i] = white * 0.3;
    } else if (type === "pink") {
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
      b6 = white * 0.115926;
    } else {
      b0 = (b0 + (0.02 * white)) / 1.02;
      data[i] = b0 * 2.5;
    }
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  const gain = ctx.createGain();
  gain.gain.value = 0.4;
  source.connect(gain);
  gain.connect(ctx.destination);
  source.start();
  return [source, gain];
};

const createBinaural = (ctx: AudioContext, baseFreq: number, beatFreq: number): AudioNode[] => {
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  gain.gain.value = 0.15;
  osc1.frequency.value = baseFreq;
  osc2.frequency.value = baseFreq + beatFreq;
  osc1.type = "sine";
  osc2.type = "sine";
  const merger = ctx.createChannelMerger(2);
  osc1.connect(merger, 0, 0);
  osc2.connect(merger, 0, 1);
  merger.connect(gain);
  gain.connect(ctx.destination);
  osc1.start();
  osc2.start();
  return [osc1, osc2, gain, merger];
};

const createDrone = (ctx: AudioContext, freq: number): AudioNode[] => {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = freq;
  const gain = ctx.createGain();
  gain.gain.value = 0.08;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.1;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.03;
  lfo.connect(lfoGain);
  lfoGain.connect(gain.gain);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  lfo.start();
  return [osc, gain, lfo, lfoGain];
};

/* ─── Track definitions ─── */
const AMBIENT_TRACKS: Track[] = [
  { id: "rain", title: "Rain Sounds", category: "Nature", icon: Cloud, generator: (ctx) => createNoise(ctx, "pink") },
  { id: "ocean", title: "Ocean Waves", category: "Nature", icon: Waves, generator: (ctx) => createNoise(ctx, "brown") },
  { id: "forest", title: "Forest Ambience", category: "Nature", icon: TreePine, generator: (ctx) => createNoise(ctx, "pink") },
  { id: "wind", title: "Gentle Wind", category: "Nature", icon: Wind, generator: (ctx) => createNoise(ctx, "brown") },
  { id: "campfire", title: "Crackling Fire", category: "Nature", icon: Flame, generator: (ctx) => createNoise(ctx, "white") },
  { id: "birds", title: "Bird Songs", category: "Nature", icon: Bird, generator: (ctx) => createBinaural(ctx, 400, 8) },
];

const FOCUS_TRACKS: Track[] = [
  { id: "alpha", title: "Alpha Waves (10Hz)", category: "Focus", icon: Headphones, generator: (ctx) => createBinaural(ctx, 200, 10) },
  { id: "theta", title: "Theta Waves (6Hz)", category: "Focus", icon: Headphones, generator: (ctx) => createBinaural(ctx, 200, 6) },
  { id: "deep-focus", title: "Deep Focus Drone", category: "Focus", icon: Coffee, generator: (ctx) => createDrone(ctx, 120) },
  { id: "beta", title: "Beta Waves (18Hz)", category: "Focus", icon: Radio, generator: (ctx) => createBinaural(ctx, 250, 18) },
  { id: "concentration", title: "Concentration Tone", category: "Focus", icon: Disc3, generator: (ctx) => createDrone(ctx, 174) },
  { id: "calm", title: "Calming Hum", category: "Focus", icon: Headphones, generator: (ctx) => createDrone(ctx, 85) },
];

/* ─── Component ─── */
const MusicPage = () => {
  const { toast } = useToast();
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Voice recorder
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordings, setRecordings] = useState<Recording[]>(() => {
    try {
      const stored = localStorage.getItem("nf-recordings-meta");
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [playingRecId, setPlayingRecId] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recAudioRef = useRef<HTMLAudioElement | null>(null);

  // Uploaded tracks
  const [uploadedTracks, setUploadedTracks] = useState<UploadedTrack[]>(() => {
    try {
      const stored = localStorage.getItem("nf-uploaded-meta");
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [playingUploadId, setPlayingUploadId] = useState<string | null>(null);
  const uploadAudioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup
  useEffect(() => {
    return () => {
      stopGeneratedAudio();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  /* ─── Generated Audio Controls ─── */
  const stopGeneratedAudio = useCallback(() => {
    nodesRef.current.forEach((n) => {
      try {
        if (n instanceof AudioScheduledSourceNode) n.stop();
        n.disconnect();
      } catch {}
    });
    nodesRef.current = [];
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    gainNodeRef.current = null;
  }, []);

  const playTrack = useCallback((track: Track) => {
    stopGeneratedAudio();
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;
    const nodes = track.generator(ctx);
    nodesRef.current = nodes;
    // Find gain node for volume control
    const gn = nodes.find((n) => n instanceof GainNode) as GainNode | undefined;
    if (gn) gainNodeRef.current = gn;
    setActiveTrack(track);
    setIsPlaying(true);
    // Apply current volume
    if (gn) gn.gain.value = isMuted ? 0 : volume / 100;
  }, [stopGeneratedAudio, volume, isMuted]);

  const togglePlay = useCallback(() => {
    if (!audioCtxRef.current) return;
    if (isPlaying) {
      audioCtxRef.current.suspend();
      setIsPlaying(false);
    } else {
      audioCtxRef.current.resume();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const handleVolumeChange = useCallback((val: number[]) => {
    const v = val[0];
    setVolume(v);
    setIsMuted(v === 0);
    if (gainNodeRef.current) gainNodeRef.current.gain.value = v / 100;
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((m) => {
      const next = !m;
      if (gainNodeRef.current) gainNodeRef.current.gain.value = next ? 0 : volume / 100;
      return next;
    });
  }, [volume]);

  const playNext = useCallback((direction: 1 | -1) => {
    if (!activeTrack) return;
    const allTracks = [...AMBIENT_TRACKS, ...FOCUS_TRACKS];
    const idx = allTracks.findIndex((t) => t.id === activeTrack.id);
    const next = allTracks[(idx + direction + allTracks.length) % allTracks.length];
    playTrack(next);
  }, [activeTrack, playTrack]);

  /* ─── Voice Recorder ─── */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const rec: Recording = {
          id: Date.now().toString(),
          name: `Recording ${recordings.length + 1}`,
          blob, url,
          date: new Date().toLocaleDateString(),
          duration: recordingTime,
        };
        const updated = [rec, ...recordings];
        setRecordings(updated);
        // Save metadata (without blob URLs)
        localStorage.setItem("nf-recordings-meta", JSON.stringify(updated.map(r => ({ ...r, blob: undefined, url: "" }))));
        // Save blob as base64
        const reader = new FileReader();
        reader.onloadend = () => {
          localStorage.setItem(`nf-rec-${rec.id}`, reader.result as string);
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach(t => t.stop());
        setRecordingTime(0);
        toast({ title: "Recording saved!", description: `${formatTime(recordingTime)} recorded` });
      };
      mr.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
    } catch {
      toast({ title: "Microphone access denied", description: "Please allow mic access to record.", variant: "destructive" });
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const playRecording = (rec: Recording) => {
    if (playingRecId === rec.id) {
      recAudioRef.current?.pause();
      setPlayingRecId(null);
      return;
    }
    // Try to load from localStorage if URL is empty
    let audioUrl = rec.url;
    if (!audioUrl || audioUrl === "") {
      const stored = localStorage.getItem(`nf-rec-${rec.id}`);
      if (stored) audioUrl = stored;
    }
    if (!audioUrl) {
      toast({ title: "Recording unavailable", variant: "destructive" });
      return;
    }
    const audio = new Audio(audioUrl);
    recAudioRef.current = audio;
    audio.play();
    setPlayingRecId(rec.id);
    audio.onended = () => setPlayingRecId(null);
  };

  const deleteRecording = (id: string) => {
    const updated = recordings.filter(r => r.id !== id);
    setRecordings(updated);
    localStorage.setItem("nf-recordings-meta", JSON.stringify(updated.map(r => ({ ...r, blob: undefined, url: "" }))));
    localStorage.removeItem(`nf-rec-${id}`);
    if (playingRecId === id) { recAudioRef.current?.pause(); setPlayingRecId(null); }
  };

  /* ─── Upload ─── */
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      if (!file.type.startsWith("audio/")) {
        toast({ title: "Invalid file", description: "Please upload audio files only.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const track: UploadedTrack = {
          id: Date.now().toString() + Math.random(),
          name: file.name.replace(/\.[^.]+$/, ""),
          url: reader.result as string,
          date: new Date().toLocaleDateString(),
        };
        const updated = [track, ...uploadedTracks];
        setUploadedTracks(updated);
        localStorage.setItem("nf-uploaded-meta", JSON.stringify(updated.map(t => ({ ...t, url: "" }))));
        localStorage.setItem(`nf-upload-${track.id}`, reader.result as string);
        toast({ title: "Track uploaded!", description: track.name });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const playUpload = (track: UploadedTrack) => {
    if (playingUploadId === track.id) {
      uploadAudioRef.current?.pause();
      setPlayingUploadId(null);
      return;
    }
    let url = track.url || localStorage.getItem(`nf-upload-${track.id}`) || "";
    if (!url) { toast({ title: "Track unavailable", variant: "destructive" }); return; }
    const audio = new Audio(url);
    uploadAudioRef.current = audio;
    audio.volume = volume / 100;
    audio.play();
    setPlayingUploadId(track.id);
    audio.onended = () => setPlayingUploadId(null);
  };

  const deleteUpload = (id: string) => {
    const updated = uploadedTracks.filter(t => t.id !== id);
    setUploadedTracks(updated);
    localStorage.setItem("nf-uploaded-meta", JSON.stringify(updated.map(t => ({ ...t, url: "" }))));
    localStorage.removeItem(`nf-upload-${id}`);
    if (playingUploadId === id) { uploadAudioRef.current?.pause(); setPlayingUploadId(null); }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold flex items-center gap-3">
          <Music className="w-8 h-8 text-primary" /> Music & Audio
        </h1>
        <p className="text-muted-foreground mt-1">Ambient sounds, focus music, voice recorder & your own tracks</p>
      </motion.div>

      {/* Now Playing Bar */}
      {activeTrack && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-xl p-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <activeTrack.icon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{activeTrack.title}</p>
              <p className="text-xs text-muted-foreground">{activeTrack.category}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => playNext(-1)}>
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full bg-primary/10" onClick={togglePlay}>
                {isPlaying ? <Pause className="w-5 h-5 text-primary" /> : <Play className="w-5 h-5 text-primary" />}
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => playNext(1)}>
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
            <div className="hidden sm:flex items-center gap-2 w-32">
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={toggleMute}>
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <Slider value={[isMuted ? 0 : volume]} max={100} step={1} onValueChange={handleVolumeChange} className="flex-1" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="ambient" className="space-y-4">
        <TabsList className="bg-secondary/50 border border-border/30 rounded-xl p-1">
          <TabsTrigger value="ambient" className="rounded-lg text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">🌿 Ambient</TabsTrigger>
          <TabsTrigger value="focus" className="rounded-lg text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">🎧 Focus</TabsTrigger>
          <TabsTrigger value="recorder" className="rounded-lg text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">🎙️ Recorder</TabsTrigger>
          <TabsTrigger value="library" className="rounded-lg text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">📁 My Music</TabsTrigger>
        </TabsList>

        {/* Ambient Tab */}
        <TabsContent value="ambient">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {AMBIENT_TRACKS.map((track, i) => (
              <TrackCard
                key={track.id}
                track={track}
                isActive={activeTrack?.id === track.id && isPlaying}
                onPlay={() => activeTrack?.id === track.id ? togglePlay() : playTrack(track)}
                delay={i * 0.05}
              />
            ))}
          </div>
        </TabsContent>

        {/* Focus Tab */}
        <TabsContent value="focus">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FOCUS_TRACKS.map((track, i) => (
              <TrackCard
                key={track.id}
                track={track}
                isActive={activeTrack?.id === track.id && isPlaying}
                onPlay={() => activeTrack?.id === track.id ? togglePlay() : playTrack(track)}
                delay={i * 0.05}
              />
            ))}
          </div>
        </TabsContent>

        {/* Recorder Tab */}
        <TabsContent value="recorder" className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-border/30 bg-card/50 backdrop-blur-xl p-6 text-center"
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div
                animate={isRecording ? { scale: [1, 1.2, 1], boxShadow: ["0 0 0 0 hsl(var(--destructive) / 0.3)", "0 0 0 20px hsl(var(--destructive) / 0)", "0 0 0 0 hsl(var(--destructive) / 0.3)"] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
                  isRecording ? "bg-destructive/20 border-2 border-destructive" : "bg-secondary/50 border border-border/30"
                }`}
              >
                {isRecording ? (
                  <Square className="w-8 h-8 text-destructive" />
                ) : (
                  <Mic className="w-8 h-8 text-primary" />
                )}
              </motion.div>

              {isRecording && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-mono font-bold text-destructive">
                  {formatTime(recordingTime)}
                </motion.p>
              )}

              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "default"}
                className={`rounded-xl h-11 px-6 font-semibold ${!isRecording ? "gradient-primary text-primary-foreground glow-primary" : ""}`}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
              <p className="text-xs text-muted-foreground">Record voice notes for studying</p>
            </div>
          </motion.div>

          {/* Recordings list */}
          {recordings.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Your Recordings</h3>
              {recordings.map((rec) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border/30 bg-card/50"
                >
                  <Button size="icon" variant="ghost" className="h-9 w-9 shrink-0" onClick={() => playRecording(rec)}>
                    {playingRecId === rec.id ? <Pause className="w-4 h-4 text-primary" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{rec.name}</p>
                    <p className="text-xs text-muted-foreground">{rec.date} • {formatTime(rec.duration)}</p>
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive/60 hover:text-destructive" onClick={() => deleteRecording(rec.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* My Music / Upload Tab */}
        <TabsContent value="library" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input ref={fileInputRef} type="file" accept="audio/*" multiple className="hidden" onChange={handleUpload} />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="gradient-primary text-primary-foreground rounded-xl h-11 px-6 font-semibold glow-primary"
            >
              <Upload className="w-4 h-4 mr-2" /> Upload Music
            </Button>
            <Button
              variant="outline"
              className="rounded-xl h-11 px-6 font-semibold border-border/30"
              onClick={() => {
                window.open("https://open.spotify.com", "_blank");
                toast({ title: "Spotify", description: "Spotify integration coming soon! For now, open Spotify in a new tab." });
              }}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Open Spotify
            </Button>
          </div>

          {uploadedTracks.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <Upload className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No uploaded tracks yet</p>
              <p className="text-muted-foreground/60 text-xs mt-1">Upload MP3s or other audio files to listen while studying</p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              {uploadedTracks.map((track) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border/30 bg-card/50"
                >
                  <Button size="icon" variant="ghost" className="h-9 w-9 shrink-0" onClick={() => playUpload(track)}>
                    {playingUploadId === track.id ? <Pause className="w-4 h-4 text-primary" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{track.name}</p>
                    <p className="text-xs text-muted-foreground">{track.date}</p>
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive/60 hover:text-destructive" onClick={() => deleteUpload(track.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

/* ─── Track Card ─── */
const TrackCard = ({ track, isActive, onPlay, delay }: { track: Track; isActive: boolean; onPlay: () => void; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onPlay}
    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
      isActive
        ? "border-primary/40 bg-primary/10 shadow-lg shadow-primary/5"
        : "border-border/30 bg-card/50 hover:border-border/50 hover:bg-card/80"
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        isActive ? "bg-primary/20" : "bg-secondary/50"
      }`}>
        {isActive ? (
          <motion.div className="flex gap-[2px]">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{ height: [4, 14, 4] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                className="w-[3px] bg-primary rounded-full"
              />
            ))}
          </motion.div>
        ) : (
          <track.icon className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-semibold ${isActive ? "text-primary" : ""}`}>{track.title}</p>
        <p className="text-xs text-muted-foreground">{track.category}</p>
      </div>
      <Play className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground/40"}`} />
    </div>
  </motion.div>
);

export default MusicPage;
