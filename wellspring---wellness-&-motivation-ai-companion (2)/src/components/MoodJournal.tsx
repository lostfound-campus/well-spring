import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, JournalAnalysis, DiaryMood, DiaryEntry } from '../types';
import {
  Sparkles,
  BookOpen,
  Camera,
  Mic,
  Square,
  Play,
  Pause,
  Trash2,
  Calendar,
  Clock,
  Image as ImageIcon,
  CheckCircle2,
  Quote,
  X,
  Volume2,
  Bookmark,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface MoodJournalProps {
  user: UserProfile | null;
  onShowToast: (msg: string) => void;
}

const STORAGE_KEY = 'wellspring_diary_entries';

const MOOD_OPTIONS: {
  key: DiaryMood;
  emoji: string;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}[] = [
  {
    key: 'happy',
    emoji: '😊',
    label: 'Happy',
    color: 'text-amber-600 dark:text-amber-300',
    bgColor: 'bg-amber-100/70 dark:bg-amber-950/50',
    borderColor: 'border-amber-300 dark:border-amber-700',
    description: 'Feeling joyful, grateful, inspired, or content',
  },
  {
    key: 'anxiety',
    emoji: '😰',
    label: 'Anxiety',
    color: 'text-indigo-600 dark:text-indigo-300',
    bgColor: 'bg-indigo-100/70 dark:bg-indigo-950/50',
    borderColor: 'border-indigo-300 dark:border-indigo-700',
    description: 'Feeling overwhelmed, nervous, restless, or stressed',
  },
  {
    key: 'sad',
    emoji: '😔',
    label: 'Sad',
    color: 'text-sky-700 dark:text-sky-300',
    bgColor: 'bg-sky-100/70 dark:bg-sky-950/50',
    borderColor: 'border-sky-300 dark:border-sky-700',
    description: 'Feeling low energy, downhearted, lonely, or quiet',
  },
  {
    key: 'cry',
    emoji: '😭',
    label: 'Cry',
    color: 'text-rose-600 dark:text-rose-300',
    bgColor: 'bg-rose-100/70 dark:bg-rose-950/50',
    borderColor: 'border-rose-300 dark:border-rose-700',
    description: 'Feeling heartbroken, crying, tender, or emotionally overflowing',
  },
];

export const MoodJournal: React.FC<MoodJournalProps> = ({ user, onShowToast }) => {
  // Diary Form State
  const [activeTab, setActiveTab] = useState<'write' | 'archive'>('write');
  const [selectedMood, setSelectedMood] = useState<DiaryMood>('happy');
  const [content, setContent] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [voiceNoteUrl, setVoiceNoteUrl] = useState<string | null>(null);
  const [voiceNoteDuration, setVoiceNoteDuration] = useState<number>(0);

  // Live Camera Viewfinder State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Voice-to-Text Dictation State
  const [isListeningDictation, setIsListeningDictation] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Audio Note Recorder State
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // Audio Playback State for Current Note
  const [isPlayingCurrentAudio, setIsPlayingCurrentAudio] = useState(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Archive & Storage State
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [filterMood, setFilterMood] = useState<'all' | DiaryMood>('all');
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

  // Analysis State
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<JournalAnalysis | null>(null);

  // Audio player map for archive entries
  const [playingArchiveId, setPlayingArchiveId] = useState<string | null>(null);
  const archiveAudioRef = useRef<HTMLAudioElement | null>(null);

  // Load saved diary entries from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEntries(parsed);
          return;
        }
      }

      // Initial friendly sample entry
      const initialEntry: DiaryEntry = {
        id: 'seed-entry-1',
        date: new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        timestamp: Date.now(),
        mood: 'happy',
        content: `Today I took a moment to breathe and check in with Wellspring. The sky is calm, and I am learning to appreciate little moments of peace in between busy routines. Here's to being gentle with myself! ❀｡˚○`,
        aiAnalysis: {
          sentiment: 'Radiant Joy & Gratitude',
          title: `A Gentle Beginning for You, ${user?.name || 'Friend'}`,
          comfortText:
            'Taking time to honor your day is an act of deep self-respect. Welcome to your personal sanctuary.',
          microSteps: [
            'Take 3 slow deep breaths right now.',
            'Sip a warm cup of water or tea.',
            'Smile gently at yourself in the mirror.',
          ],
          affirmation: 'I am rooted in quiet peace and trust my journey.',
        },
      };

      setEntries([initialEntry]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([initialEntry]));
    } catch (e) {
      console.error('Failed to load diary entries from storage', e);
    }
  }, [user]);

  // Clean up streams & timers on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (currentAudioRef.current) currentAudioRef.current.pause();
      if (archiveAudioRef.current) archiveAudioRef.current.pause();
    };
  }, []);

  // Save entries to localStorage whenever they update
  const persistEntries = (updated: DiaryEntry[]) => {
    setEntries(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage limit or error when storing diary:', e);
    }
  };

  // --- Camera Operations ---
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraOpen(true);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      videoStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(
        'Camera permission was not granted or not available. You can also pick a photo file directly below!'
      );
    }
  };

  const stopCamera = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach((track) => track.stop());
      videoStreamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      setPhotoUrl(dataUrl);
      onShowToast('Photo captured for your diary! 📸');
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setPhotoUrl(result);
        onShowToast('Photo attached to diary! 🌸');
      }
    };
    reader.readAsDataURL(file);
  };

  // --- Voice-to-Text Dictation ---
  const toggleDictation = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onShowToast('Speech recognition is not supported in this browser. Please type directly ✍️');
      return;
    }

    if (isListeningDictation) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListeningDictation(false);
      onShowToast('Voice dictation stopped 🎙️');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListeningDictation(true);
        onShowToast('Listening... Speak your thoughts naturally 🎙️');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript + ' ';
          }
        }
        if (transcript) {
          setContent((prev) => (prev ? `${prev.trim()} ${transcript}` : transcript));
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListeningDictation(false);
        onShowToast('Voice listening paused. Check microphone permission.');
      };

      recognition.onend = () => {
        setIsListeningDictation(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListeningDictation(false);
    }
  };

  // --- Voice Note Audio Recorder ---
  const startVoiceRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        onShowToast('Voice recording is not supported on this browser.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setVoiceNoteUrl(base64data);
          onShowToast('Voice memo recorded! 🎧');
        };
        reader.readAsDataURL(audioBlob);

        // Stop mic tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(200);

      setIsRecordingVoice(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 180) {
            // max 3 mins
            stopVoiceRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      onShowToast('Recording voice note... 🎙️ Speak your mind freely');
    } catch (err) {
      console.error('Mic error:', err);
      onShowToast('Microphone permission needed to record voice memo.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecordingVoice) {
      mediaRecorderRef.current.stop();
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setVoiceNoteDuration(recordingSeconds);
    setIsRecordingVoice(false);
  };

  // Playback of current draft voice note
  const togglePlayCurrentAudio = () => {
    if (!voiceNoteUrl) return;

    if (isPlayingCurrentAudio && currentAudioRef.current) {
      currentAudioRef.current.pause();
      setIsPlayingCurrentAudio(false);
      return;
    }

    if (!currentAudioRef.current) {
      const audio = new Audio(voiceNoteUrl);
      audio.onended = () => setIsPlayingCurrentAudio(false);
      currentAudioRef.current = audio;
    } else {
      currentAudioRef.current.src = voiceNoteUrl;
    }

    currentAudioRef.current.play();
    setIsPlayingCurrentAudio(true);
  };

  // Playback of archive entry voice note
  const togglePlayArchiveAudio = (entryId: string, url: string) => {
    if (playingArchiveId === entryId && archiveAudioRef.current) {
      archiveAudioRef.current.pause();
      setPlayingArchiveId(null);
      return;
    }

    if (archiveAudioRef.current) {
      archiveAudioRef.current.pause();
    }

    const audio = new Audio(url);
    audio.onended = () => setPlayingArchiveId(null);
    archiveAudioRef.current = audio;
    audio.play();
    setPlayingArchiveId(entryId);
  };

  // --- AI Analysis & Save ---
  const handleAnalyzeWithAI = async () => {
    if (!content.trim() && !voiceNoteUrl && !photoUrl) {
      onShowToast('Please write something or attach a thought first ✍️');
      return;
    }

    setLoadingAnalysis(true);
    try {
      const textToAnalyze =
        content.trim() ||
        `I felt ${selectedMood} today and recorded a voice note in my diary.`;
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entry: textToAnalyze,
          userName: user?.name,
          mood: selectedMood,
        }),
      });

      let journalData: JournalAnalysis | null = null;
      if (res.ok) {
        journalData = await res.json();
      }

      if (!journalData) {
        journalData = {
          sentiment:
            selectedMood === 'happy'
              ? 'Radiant Joy & Gratitude'
              : selectedMood === 'anxiety'
              ? 'Anxious & Seeking Grounding'
              : selectedMood === 'cry'
              ? 'Emotional Release & Tender Healing'
              : 'Tender Heart & Quiet Reflection',
          title: `Holding Space for Your Day, ${user?.name || 'Friend'}`,
          comfortText:
            'Writing down your feelings is a courageous act of mindfulness. Honor everything you felt today without judgment.',
          microSteps: [
            'Take 3 gentle belly breaths right now.',
            'Wrap yourself in comfort and soften your shoulders.',
            'Give yourself credit for simply navigating this day.',
          ],
          affirmation: 'I am safe in this moment and gentle with my heart.',
        };
      }

      setCurrentAnalysis(journalData);
      onShowToast('Gemini reflection generated ✨');
    } catch (e) {
      console.error(e);
      onShowToast('Reflection generated with care 🌸');
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const handleSaveToDiary = async () => {
    if (!content.trim() && !photoUrl && !voiceNoteUrl) {
      onShowToast('Please write or record a memory before saving 📖');
      return;
    }

    let analysis = currentAnalysis;
    // If analysis hasn't been fetched yet, fetch or create one
    if (!analysis) {
      const fallbackSentiments: Record<DiaryMood, string> = {
        happy: 'Radiant Joy & Gratitude',
        anxiety: 'Anxious & Seeking Grounding',
        sad: 'Tender Heart & Quiet Reflection',
        cry: 'Emotional Release & Tender Healing',
      };
      analysis = {
        sentiment: fallbackSentiments[selectedMood],
        title: `A Mindful Reflection for ${user?.name || 'You'}`,
        comfortText:
          'Every feeling has its own season. By honoring your emotions in this diary, you give yourself the kindness and peace you truly deserve.',
        microSteps: [
          'Place a hand gently on your chest and take a calm breath.',
          'Release any pressure to solve everything tonight.',
          'Carry forward warmth and self-compassion.',
        ],
        affirmation: 'I honor my feelings, release my burdens, and embrace peace.',
      };
    }

    const newEntry: DiaryEntry = {
      id: `entry-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      timestamp: Date.now(),
      mood: selectedMood,
      content: content.trim(),
      photoUrl: photoUrl || undefined,
      voiceNoteUrl: voiceNoteUrl || undefined,
      voiceNoteDuration: voiceNoteDuration || recordingSeconds || undefined,
      aiAnalysis: analysis,
    };

    const updatedList = [newEntry, ...entries];
    persistEntries(updatedList);

    // Reset draft
    setContent('');
    setPhotoUrl(null);
    setVoiceNoteUrl(null);
    setVoiceNoteDuration(0);
    setCurrentAnalysis(null);
    stopCamera();

    onShowToast('Page saved to your Personal Diary! 📖✨');
    setActiveTab('archive');
    setExpandedEntryId(newEntry.id);
  };

  const handleDeleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    persistEntries(updated);
    onShowToast('Diary page deleted 🗑️');
  };

  const filteredEntries = entries.filter((e) => {
    if (filterMood === 'all') return true;
    return e.mood === filterMood;
  });

  const activeMoodInfo = MOOD_OPTIONS.find((m) => m.key === selectedMood)!;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6">
      {/* Diary Header & Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#163e66] dark:text-sky-300 font-bold mb-1">
            <span>❀｡˚○</span>
            <span>Personal Mindfulness Diary</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#14395b] dark:text-sky-100 flex items-center gap-2">
            <span>My Daily Wellness Diary</span>
            <BookOpen className="w-6 h-6 text-sky-700 dark:text-sky-300 inline" />
          </h1>
          <p className="text-xs sm:text-sm text-[#204972]/85 dark:text-sky-200/80 mt-0.5">
            Capture today with your voice, camera photos, personal reflections, and heartfelt mood emojis.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center p-1 rounded-full bg-white/40 dark:bg-sky-950/60 border border-white/50 dark:border-white/10 backdrop-blur-md shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'write'
                ? 'bg-sky-100/95 dark:bg-sky-200 text-[#133557] shadow-md shadow-sky-950/10'
                : 'text-[#14395b] dark:text-sky-200 hover:text-sky-900'
            }`}
          >
            ✍️ Write in Diary
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('archive')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'archive'
                ? 'bg-sky-100/95 dark:bg-sky-200 text-[#133557] shadow-md shadow-sky-950/10'
                : 'text-[#14395b] dark:text-sky-200 hover:text-sky-900'
            }`}
          >
            <span>📖 Diary Pages</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/60 dark:bg-sky-900/80 text-[#14395b] dark:text-sky-200 font-bold">
              {entries.length}
            </span>
          </button>
        </div>
      </div>

      {activeTab === 'write' ? (
        /* WRITE IN DIARY PAGE */
        <div className="backdrop-blur-md bg-white/45 dark:bg-[#0c2440]/80 rounded-3xl p-5 sm:p-8 border border-white/50 dark:border-white/15 shadow-2xl shadow-sky-950/15 relative overflow-hidden">
          {/* Subtle Decorative Bookmark Ribbon at top right */}
          <div className="absolute top-0 right-8 w-6 h-10 bg-rose-400/80 dark:bg-rose-500/80 rounded-b-md shadow-sm pointer-events-none flex items-end justify-center pb-1">
            <span className="text-[10px] text-white">❀</span>
          </div>

          {/* Today's Date Banner */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-white/50 dark:border-white/10 text-xs sm:text-sm font-medium text-[#14395b] dark:text-sky-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-700 dark:text-sky-300" />
              <span className="font-semibold">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#204972]/80 dark:text-sky-300/80">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* 1. EMOJI MOOD SELECTOR (happy, anxiety, sad, cry) */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#14395b] dark:text-sky-200 mb-2">
              How are you feeling today? (Select Your Mood)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {MOOD_OPTIONS.map((mood) => {
                const isSelected = selectedMood === mood.key;
                return (
                  <button
                    key={mood.key}
                    type="button"
                    onClick={() => {
                      setSelectedMood(mood.key);
                      onShowToast(`Mood set to ${mood.label} ${mood.emoji}`);
                    }}
                    className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer select-none ${
                      isSelected
                        ? `${mood.bgColor} ${mood.borderColor} ring-2 ring-sky-400 shadow-md scale-102`
                        : 'bg-white/40 dark:bg-sky-950/40 border-white/40 dark:border-white/10 hover:bg-white/70'
                    }`}
                  >
                    <span className="text-3xl sm:text-4xl filter drop-shadow-sm transition-transform hover:scale-115">
                      {mood.emoji}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#14395b] dark:text-sky-100">
                      {mood.label}
                    </span>
                    <span className="text-[10px] text-center text-[#204972]/70 dark:text-sky-300/70 hidden sm:block line-clamp-1">
                      {mood.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. WHAT HAPPENED TODAY (LINED NOTEBOOK TEXTAREA) */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="diaryTextArea"
                className="text-xs font-bold uppercase tracking-wider text-[#14395b] dark:text-sky-200 flex items-center gap-1.5"
              >
                <span>Dear Diary, what happened today?</span>
              </label>
              <span className="text-[11px] text-[#204972]/75 dark:text-sky-300/75">
                {content.length} characters
              </span>
            </div>

            <div className="relative rounded-2xl bg-white/70 dark:bg-[#091e36]/80 border border-white/60 dark:border-white/20 overflow-hidden shadow-inner">
              <textarea
                id="diaryTextArea"
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Dear Diary, today I felt... Something that happened was... I want to remember that..."
                className="w-full p-4 text-sm sm:text-base text-[#14395b] dark:text-sky-100 placeholder:text-slate-400/90 focus:outline-none diary-lines resize-none bg-transparent"
              />
            </div>
          </div>

          {/* 3. MULTIMEDIA ATTACHMENTS TOOLBAR: Camera, Voice-to-Text, Voice Note */}
          <div className="mb-6 p-3 sm:p-4 rounded-2xl bg-white/40 dark:bg-sky-950/50 border border-white/50 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#14395b] dark:text-sky-200 uppercase tracking-wider">
                Multimedia Diary Tools
              </span>
              <span className="text-[11px] text-[#204972]/80 dark:text-sky-300/80">
                Camera, Voice-to-Text & Voice Note
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Camera Button */}
              <button
                type="button"
                onClick={() => {
                  if (isCameraOpen) stopCamera();
                  else startCamera();
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border cursor-pointer ${
                  isCameraOpen
                    ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                    : 'bg-white/70 dark:bg-sky-900/60 text-[#14395b] dark:text-sky-100 border-white/50 dark:border-white/15 hover:bg-white'
                }`}
              >
                <Camera className="w-4 h-4 text-sky-600 dark:text-sky-300" />
                <span>{isCameraOpen ? 'Close Camera' : 'Take Photo (Camera)'}</span>
              </button>

              {/* Upload Photo File Alternative */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/70 dark:bg-sky-900/60 text-[#14395b] dark:text-sky-100 border border-white/50 dark:border-white/15 hover:bg-white transition-all cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Choose Photo</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Voice-to-Text Dictation Button */}
              <button
                type="button"
                onClick={toggleDictation}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border cursor-pointer ${
                  isListeningDictation
                    ? 'bg-red-500 text-white border-red-500 animate-mic-pulse'
                    : 'bg-white/70 dark:bg-sky-900/60 text-[#14395b] dark:text-sky-100 border-white/50 dark:border-white/15 hover:bg-white'
                }`}
              >
                <Mic className={`w-4 h-4 ${isListeningDictation ? 'text-white' : 'text-rose-500'}`} />
                <span>{isListeningDictation ? 'Listening... Speak' : 'Voice to Text (Dictate)'}</span>
              </button>

              {/* Voice Note Audio Recording Button */}
              {!isRecordingVoice ? (
                <button
                  type="button"
                  onClick={startVoiceRecording}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/70 dark:bg-sky-900/60 text-[#14395b] dark:text-sky-100 border border-white/50 dark:border-white/15 hover:bg-white transition-all cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Record Voice Note</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopVoiceRecording}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-rose-500 text-white border border-rose-600 animate-pulse cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>Stop Recording ({recordingSeconds}s)</span>
                </button>
              )}
            </div>

            {/* LIVE CAMERA VIEWFINDER MODAL/INLINE */}
            {isCameraOpen && (
              <div className="mt-3 p-3 rounded-2xl bg-black/80 backdrop-blur-md border border-white/20 text-white flex flex-col items-center">
                {cameraError ? (
                  <div className="p-3 text-xs text-rose-300 text-center max-w-sm">
                    <p>{cameraError}</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs"
                    >
                      Pick Image from Device
                    </button>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full max-w-md h-56 sm:h-72 object-cover rounded-xl bg-black shadow-lg"
                    />
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="px-5 py-2 rounded-full bg-white text-[#133557] font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg hover:scale-105 transition-all cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Snap Photo 📸</span>
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ATTACHED PHOTO PREVIEW */}
            {photoUrl && (
              <div className="mt-3 flex items-center gap-3 p-2.5 rounded-2xl bg-white/60 dark:bg-sky-950/70 border border-white/60 dark:border-white/10">
                <div className="relative group">
                  <img
                    src={photoUrl}
                    alt="Diary snapshot"
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-white/80 shadow-md rotate-[-2deg]"
                  />
                  <span className="absolute -top-1.5 -left-1.5 text-xs">📌</span>
                </div>
                <div className="flex-1 min-w-0 text-xs">
                  <p className="font-bold text-[#14395b] dark:text-sky-100">Photo Memory Attached</p>
                  <p className="text-[11px] text-[#204972]/70 dark:text-sky-300/70">
                    Will be preserved on your diary page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPhotoUrl(null)}
                  title="Remove photo"
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* RECORDED VOICE NOTE PREVIEW */}
            {voiceNoteUrl && (
              <div className="mt-3 flex items-center gap-3 p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 text-xs">
                <button
                  type="button"
                  onClick={togglePlayCurrentAudio}
                  className="p-2.5 rounded-full bg-purple-600 text-white shadow-md hover:scale-105 transition-all cursor-pointer shrink-0"
                >
                  {isPlayingCurrentAudio ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 fill-white" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-purple-900 dark:text-purple-200">
                      Voice Memo Ready
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 font-mono">
                      {voiceNoteDuration ? `${voiceNoteDuration}s` : 'Audio Note'}
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-700/80 dark:text-purple-300/70">
                    Click to listen to your voice recording before saving.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (currentAudioRef.current) currentAudioRef.current.pause();
                    setVoiceNoteUrl(null);
                    setVoiceNoteDuration(0);
                    setIsPlayingCurrentAudio(false);
                  }}
                  title="Remove voice note"
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* 4. AI REFLECTION RESULT CARD IF GENERATED */}
          {currentAnalysis && (
            <div className="mb-6 p-5 rounded-2xl bg-white/60 dark:bg-sky-950/60 border border-white/60 dark:border-white/15 shadow-sm animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 text-xs font-bold">
                  {currentAnalysis.sentiment}
                </span>
                <span className="text-xs text-[#204972]/80 dark:text-sky-300/80">
                  Gemini Reflection
                </span>
              </div>
              <h4 className="text-base font-bold font-serif text-[#14395b] dark:text-sky-100 mb-1">
                {currentAnalysis.title}
              </h4>
              <p className="text-xs sm:text-sm text-[#204972]/90 dark:text-sky-200/90 leading-relaxed mb-3">
                {currentAnalysis.comfortText}
              </p>
              <div className="p-3 rounded-xl bg-white/60 dark:bg-sky-900/40 text-xs italic font-medium text-[#14395b] dark:text-sky-100 flex items-start gap-2">
                <Quote className="w-4 h-4 text-sky-500 shrink-0 rotate-180" />
                <span>"{currentAnalysis.affirmation}"</span>
              </div>
            </div>
          )}

          {/* 5. ACTION BUTTONS: REFLECT & SAVE */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/40 dark:border-white/10">
            <button
              type="button"
              onClick={handleAnalyzeWithAI}
              disabled={loadingAnalysis}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 dark:bg-sky-950/70 hover:bg-white text-[#14395b] dark:text-sky-100 border border-white/60 dark:border-white/10 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${loadingAnalysis ? 'animate-spin' : 'text-sky-600'}`} />
              <span>{loadingAnalysis ? 'Reflecting with Gemini...' : 'Reflect with Gemini AI'}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveToDiary}
              disabled={!content.trim() && !photoUrl && !voiceNoteUrl}
              className="flex items-center gap-2 px-7 py-3 rounded-full bg-sky-100/95 dark:bg-sky-100 hover:bg-white text-[#133557] font-bold text-sm transition-all shadow-lg shadow-sky-950/15 cursor-pointer hover:scale-105 disabled:opacity-50"
            >
              <Bookmark className="w-4 h-4 fill-current" />
              <span>Save Page to My Diary 🌸</span>
            </button>
          </div>
        </div>
      ) : (
        /* DIARY ARCHIVE & PAST PAGES VIEW */
        <div className="space-y-6">
          {/* Mood Filter Pill Tabs */}
          <div className="backdrop-blur-md bg-white/40 dark:bg-[#0c2440]/80 rounded-2xl p-3 border border-white/50 dark:border-white/15 flex flex-wrap items-center justify-between gap-2 shadow-sm">
            <span className="text-xs font-bold text-[#14395b] dark:text-sky-200 uppercase tracking-wider pl-2">
              Filter by Mood:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFilterMood('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  filterMood === 'all'
                    ? 'bg-sky-100/90 dark:bg-sky-200 text-[#133557] font-bold shadow-sm'
                    : 'text-[#14395b] dark:text-sky-200 hover:bg-white/40'
                }`}
              >
                All Entries ({entries.length})
              </button>
              {MOOD_OPTIONS.map((m) => {
                const count = entries.filter((e) => e.mood === m.key).length;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setFilterMood(m.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                      filterMood === m.key
                        ? 'bg-sky-100/90 dark:bg-sky-200 text-[#133557] font-bold shadow-sm'
                        : 'text-[#14395b] dark:text-sky-200 hover:bg-white/40'
                    }`}
                  >
                    <span>{m.emoji}</span>
                    <span>{m.label}</span>
                    <span className="text-[10px] opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Diary Entries List */}
          {filteredEntries.length === 0 ? (
            <div className="backdrop-blur-md bg-white/40 dark:bg-[#0c2440]/80 rounded-3xl p-10 text-center border border-white/50 dark:border-white/15">
              <span className="text-4xl mb-3 block">📖</span>
              <h3 className="text-lg font-bold font-serif text-[#14395b] dark:text-sky-100 mb-1">
                No diary entries found for this mood
              </h3>
              <p className="text-xs sm:text-sm text-[#204972]/80 dark:text-sky-200/80 mb-4">
                Click below to write your first reflection for this mood!
              </p>
              <button
                type="button"
                onClick={() => {
                  if (filterMood !== 'all') setSelectedMood(filterMood);
                  setActiveTab('write');
                }}
                className="px-6 py-2.5 rounded-full bg-sky-100 text-[#133557] font-bold text-xs sm:text-sm shadow-md hover:scale-105 transition-all cursor-pointer"
              >
                Write in Diary ✍️
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {filteredEntries.map((entry) => {
                const moodInfo =
                  MOOD_OPTIONS.find((m) => m.key === entry.mood) || MOOD_OPTIONS[0];
                const isExpanded = expandedEntryId === entry.id;

                return (
                  <div
                    key={entry.id}
                    className="backdrop-blur-md bg-white/45 dark:bg-[#0c2440]/80 rounded-3xl p-5 sm:p-7 border border-white/50 dark:border-white/15 shadow-xl shadow-sky-950/15 relative transition-all"
                  >
                    {/* Header Row: Mood Badge + Date + Trash */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-white/40 dark:border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl filter drop-shadow-sm">{moodInfo.emoji}</span>
                        <div>
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${moodInfo.bgColor} ${moodInfo.borderColor} ${moodInfo.color}`}
                          >
                            {moodInfo.label}
                          </span>
                          <span className="ml-2 text-xs font-semibold text-[#14395b] dark:text-sky-200">
                            {entry.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setExpandedEntryId(isExpanded ? null : entry.id)}
                          className="p-1.5 rounded-lg text-xs font-medium text-[#14395b] dark:text-sky-200 hover:bg-white/40 flex items-center gap-1 cursor-pointer"
                        >
                          <span>{isExpanded ? 'Collapse' : 'Details'}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEntry(entry.id)}
                          title="Delete entry"
                          className="p-1.5 rounded-lg text-rose-500/80 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Entry Content (Text) */}
                    {entry.content && (
                      <p className="text-sm sm:text-base text-[#14395b] dark:text-sky-100 leading-relaxed diary-lines mb-4 font-normal whitespace-pre-line">
                        {entry.content}
                      </p>
                    )}

                    {/* Media Attachments Container: Photo + Voice Note */}
                    <div className="flex flex-wrap items-center gap-4 my-3">
                      {/* Attached Photo */}
                      {entry.photoUrl && (
                        <div className="relative">
                          <img
                            src={entry.photoUrl}
                            alt="Diary memory"
                            className="w-36 h-36 sm:w-44 sm:h-44 object-cover rounded-2xl border-2 border-white shadow-md rotate-[-1.5deg]"
                          />
                          <span className="absolute -top-1 -left-1 text-sm">📌</span>
                        </div>
                      )}

                      {/* Attached Voice Note Audio Player */}
                      {entry.voiceNoteUrl && (
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/50">
                          <button
                            type="button"
                            onClick={() => togglePlayArchiveAudio(entry.id, entry.voiceNoteUrl!)}
                            className="p-3 rounded-full bg-purple-600 text-white shadow-md hover:scale-105 transition-all cursor-pointer"
                          >
                            {playingArchiveId === entry.id ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4 fill-white" />
                            )}
                          </button>
                          <div>
                            <div className="text-xs font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Recorded Voice Note</span>
                            </div>
                            <p className="text-[11px] text-purple-700 dark:text-purple-300">
                              {playingArchiveId === entry.id
                                ? 'Playing audio memo...'
                                : 'Click to listen to your voice memo'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* AI Reflection & Guidance (Shown always or when expanded) */}
                    {entry.aiAnalysis && (
                      <div className="mt-4 p-4 rounded-2xl bg-white/50 dark:bg-sky-950/60 border border-white/50 dark:border-white/10 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-sky-700 dark:text-sky-300 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{entry.aiAnalysis.sentiment}</span>
                          </span>
                        </div>
                        <h4 className="text-sm font-bold font-serif text-[#14395b] dark:text-sky-100">
                          {entry.aiAnalysis.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-[#204972]/85 dark:text-sky-200/80 leading-relaxed">
                          {entry.aiAnalysis.comfortText}
                        </p>

                        {isExpanded && entry.aiAnalysis.microSteps && (
                          <div className="pt-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#14395b] dark:text-sky-200 block mb-1.5">
                              Suggested Micro Self-Care:
                            </span>
                            <ul className="space-y-1.5">
                              {entry.aiAnalysis.microSteps.map((step, idx) => (
                                <li
                                  key={idx}
                                  className="text-xs text-[#204972]/90 dark:text-sky-100 flex items-start gap-1.5"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="pt-2 flex items-start gap-2 italic text-xs text-[#14395b] dark:text-sky-200 font-medium">
                          <Quote className="w-3.5 h-3.5 text-sky-500 shrink-0 rotate-180" />
                          <span>"{entry.aiAnalysis.affirmation}"</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
