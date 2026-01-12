export class VoiceService {
    private synthesis: SpeechSynthesis;
    private voices: SpeechSynthesisVoice[] = [];
    private enabled: boolean = false;
    private recognition: any = null;
    private isListening: boolean = false;

    constructor() {
        this.synthesis = window.speechSynthesis;
        this.loadVoices();
        if (this.synthesis.onvoiceschanged !== undefined) {
            this.synthesis.onvoiceschanged = this.loadVoices;
        }

        // Initialize Speech Recognition
        if ('webkitSpeechRecognition' in window) {
            // @ts-ignore
            this.recognition = new window.webkitSpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
        }
    }

    private loadVoices = () => {
        this.voices = this.synthesis.getVoices();
        if (this.voices.length > 0) {
            console.log(`Doctor IA PRO: ${this.voices.length} voices loaded.`);
        }
    };

    public setEnabled(enabled: boolean, currentLang: 'es' | 'en' = 'es') {
        this.enabled = enabled;
        if (enabled) {
            this.init();
            // immediate feedback to let the user know it's working
            const feedback = currentLang === 'es' ? 'Sistema de voz activado' : 'Voice system activated';
            setTimeout(() => this.speak(feedback, currentLang), 100);
        } else {
            this.stop();
        }
    }

    private init() {
        // Unlock speech synthesis (required by some browsers)
        const unlockUtterance = new SpeechSynthesisUtterance('');
        unlockUtterance.volume = 0;
        this.synthesis.speak(unlockUtterance);

        // Ensure voices are loaded
        if (this.voices.length === 0) {
            this.loadVoices();
        }
    }

    public isEnabled(): boolean {
        return this.enabled;
    }

    public speak(text: string, lang: 'es' | 'en' = 'es') {
        if (!this.enabled) return;
        this.stop();

        // Clean text from markdown for better speech
        const cleanText = text
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/###/g, '')
            .replace(/Nivel \d:/g, '')
            .replace(/IA\.AGUS_PROTOCOL_EXECUTED/g, '')
            .replace(/\[(.*?)\]\((.*?)\)/g, '$1'); // Remove links

        const utterance = new SpeechSynthesisUtterance(cleanText);

        // Prioritize "Google" voices which are usually higher quality, otherwise default to language
        let preferredVoice = this.voices.find(v =>
            v.lang.startsWith(lang) && v.name.includes('Google')
        );

        // Fallback to any voice for the language
        if (!preferredVoice) {
            preferredVoice = this.voices.find(v => v.lang.startsWith(lang));
        }

        if (preferredVoice) {
            utterance.voice = preferredVoice;
            console.log(`Doctor IA PRO Speaking with: ${preferredVoice.name}`);
        }

        utterance.lang = lang === 'es' ? 'es-ES' : 'en-US';
        utterance.rate = 1.0; // Natural speed
        utterance.pitch = 1.0; // Natural pitch

        this.synthesis.speak(utterance);
    }

    public stop() {
        this.synthesis.cancel();
        if (this.isListening) {
            this.recognition?.stop();
            this.isListening = false;
        }
    }

    public startListening(onResult: (text: string) => void, onError: (error: any) => void, lang: 'es' | 'en' = 'es') {
        if (!this.recognition) {
            onError('Speech recognition not supported in this browser.');
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            return;
        }

        this.recognition.lang = lang === 'es' ? 'es-ES' : 'en-US';

        this.recognition.onstart = () => {
            this.isListening = true;
        };

        this.recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            onResult(transcript);
            this.isListening = false;
        };

        this.recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            this.isListening = false;
            onError(event.error);
        };

        this.recognition.onend = () => {
            this.isListening = false;
        };

        this.recognition.start();
    }
}

export const voiceService = new VoiceService();
