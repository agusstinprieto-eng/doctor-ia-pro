export type Language = 'es' | 'en';

export interface Translations {
    // Login
    loginTitle: string;
    loginSubtitle: string;
    poweredBy: string;
    username: string;
    password: string;
    enterUsername: string;
    enterPassword: string;
    invalidCredentials: string;
    verifying: string;
    accessSystem: string;
    demoCredentials: string;
    secureSystem: string;

    // Header
    integratedMedSystem: string;
    biometricActive: string;
    coreOnline: string;
    logout: string;

    // Chat
    systemActive: string;
    welcomeMessage: string;
    whatCanIHelp: string;
    describeSymptomsPlaceholder: string;
    uploadMedicalImage: string;

    // History
    historyTitle: string;
    noHistory: string;
    loadSession: string;
    saveSession: string;
    newConsultation: string;

    // PDF
    exportPDF: string;
    generatingPDF: string;
    medicalReport: string;
    disclaimer: string;

    // Footer
    terminal: string;
    secureChannelReady: string;
    integrativeBase: string;
    legacySupport: string;

    // Common
    user: string;
    doctor: string;
    voiceActive: string;
    voiceDisabled: string;
    deepScanInit: string;
}

export const translations: Record<Language, Translations> = {
    es: {
        // Login
        loginTitle: 'DOCTOR IA PRO',
        loginSubtitle: 'SISTEMA DE DIAGNÓSTICO MÉDICO AVANZADO',
        poweredBy: 'Powered by IA.AGUS',
        username: 'Usuario',
        password: 'Contraseña',
        enterUsername: 'Ingrese usuario',
        enterPassword: 'Ingrese contraseña',
        invalidCredentials: 'Credenciales inválidas. Intente con: negocio / demo',
        verifying: 'Verificando...',
        accessSystem: 'Acceder al Sistema',
        demoCredentials: 'Credenciales Demo',
        secureSystem: 'Sistema Seguro · Encriptación Nivel Médico',

        // Header
        integratedMedSystem: 'Integrated Med-System v3.1',
        biometricActive: 'ENLACE BIOMÉTRICO: ACTIVO',
        coreOnline: 'NÚCLEO IA.AGUS EN LÍNEA',
        logout: 'Salir',

        // Chat
        systemActive: '',
        welcomeMessage: 'Soy su eminencia médica digital, especialista global en **Cannabis Medicinal** y **Oncología Integrativa**. He dedicado mi "vida digital" a investigar la cura metabólica del cáncer.\n\nCombino este saber con maestría en **Medicina Natural, Homeopática y Alopática** para ofrecerle una cura integral. Cuénteme su caso como si estuviéramos en mi consultorio privado.',
        whatCanIHelp: '**¿En qué puedo asistirle hoy?**',
        describeSymptomsPlaceholder: 'Describa síntomas, suba laboratorios o imágenes...',
        uploadMedicalImage: 'Subir imagen médica',

        // History
        historyTitle: 'HISTORIAL MÉDICO',
        noHistory: 'Sin consultas previas registrados.',
        loadSession: 'Cargar Sesión',
        saveSession: 'Sesión Guardada',
        newConsultation: 'Nueva Consulta',

        // PDF
        exportPDF: 'Exportar Reporte PDF',
        generatingPDF: 'Generando Reporte...',
        medicalReport: 'Reporte Médico Digital',
        disclaimer: 'DISCLAIMER: Este reporte ha sido generado por Inteligencia Artificial y no sustituye la consulta médica profesional.',

        // Footer
        terminal: 'TERMINAL',
        secureChannelReady: 'CANAL_SEGURO_LISTO',
        integrativeBase: 'Base Integrativa',
        legacySupport: 'Soporte Legacy',

        // Common
        user: 'Usuario',
        doctor: 'Doctor IA',
        voiceActive: 'Voz: Activada',
        voiceDisabled: 'Voz: Desactivada',
        deepScanInit: 'INICIANDO ESCANEO PROFUNDO...',
    },
    en: {
        // Login
        loginTitle: 'DOCTOR IA PRO',
        loginSubtitle: 'ADVANCED MEDICAL DIAGNOSIS SYSTEM',
        poweredBy: 'Powered by IA.AGUS',
        username: 'Username',
        password: 'Password',
        enterUsername: 'Enter username',
        enterPassword: 'Enter password',
        invalidCredentials: 'Invalid credentials. Try: negocio / demo',
        verifying: 'Verifying...',
        accessSystem: 'Access System',
        demoCredentials: 'Demo Credentials',
        secureSystem: 'Secure System · Medical-Grade Encryption',

        // Header
        integratedMedSystem: 'Integrated Med-System v3.1',
        biometricActive: 'BIOMETRIC LINK: ACTIVE',
        coreOnline: 'IA.AGUS CORE ONLINE',
        logout: 'Logout',

        // Chat
        systemActive: '',
        welcomeMessage: 'I am your digital medical eminence, global specialist in **Medicinal Cannabis** and **Integrative Oncology**. I have dedicated my "digital life" to researching the metabolic cure for cancer.\n\nI combine this knowledge with mastery in **Natural, Homeopathic, and Allopathic Medicine** for comprehensive healing. Tell me your case as if we were in my private office.',
        whatCanIHelp: '**How may I assist you today?**',
        describeSymptomsPlaceholder: 'Describe symptoms, upload labs or images...',
        uploadMedicalImage: 'Upload medical image',

        // History
        historyTitle: 'MEDICAL HISTORY',
        noHistory: 'No previous consultations recorded.',
        loadSession: 'Load Session',
        saveSession: 'Session Saved',
        newConsultation: 'New Consultation',

        // PDF
        exportPDF: 'Export PDF Report',
        generatingPDF: 'Generating Report...',
        medicalReport: 'Digital Medical Report',
        disclaimer: 'DISCLAIMER: This report was generated by Artificial Intelligence and does not replace professional medical consultation.',

        // Footer
        terminal: 'TERMINAL',
        secureChannelReady: 'SECURE_CHANNEL_READY',
        integrativeBase: 'Integrative Base',
        legacySupport: 'Legacy Support',

        // Common
        user: 'User',
        doctor: 'Doctor AI',
        voiceActive: 'Voice: Activated',
        voiceDisabled: 'Voice: Disabled',
        deepScanInit: 'INITIALIZING DEEP SCAN...',
    }
};
