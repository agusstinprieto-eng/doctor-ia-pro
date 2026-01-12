
export interface NaturalProduct {
    id: string;
    name: string;
    scientificName: string;
    category: string;
    description: string;
    benefits: string[];
    imageUrl: string; // Placeholder URL initially
    preparation?: string;
}

export const naturalProducts: NaturalProduct[] = [
    {
        id: '1',
        name: 'Cannabis Medicinal Premium',
        scientificName: 'Cannabis sativa L. (CBD Full Spectrum)',
        category: 'Oncológico',
        description: 'Aceite de grado farmacéutico. Potentes propiedades analgésicas, antieméticas y antitumorales. Formulado para regular la homeostasis sin efectos psicotrópicos agresivos.',
        benefits: ['Alivio del dolor oncológico', 'Control de náuseas severas', 'Neuroprotección avanzada', 'Estimulación del apetito'],
        imageUrl: 'https://images.unsplash.com/photo-1609159516335-a6e5072061f3?q=80&w=800&auto=format&fit=crop',
        preparation: 'Gotas sublinguales dosificadas o vaporización clínica.'
    },
    {
        id: '2',
        name: 'Eucalipto Azul Real',
        scientificName: 'Eucalyptus globulus',
        category: 'Respiratorio',
        description: 'Concentrado puro de hojas jóvenes ricas en cineol. El estándar de oro para la salud respiratoria y la purificación del aire.',
        benefits: ['Broncodilatador natural', 'Antiséptico de vías aéreas', 'Expectorante profundo', 'Claridad mental'],
        imageUrl: 'https://images.unsplash.com/photo-1596727763690-3ce73cc09040?q=80&w=800&auto=format&fit=crop',
        preparation: 'Vahos terapéuticos, difusor ultrasónico o baños de vapor.'
    },
    {
        id: '3',
        name: 'Raíz de Valeriana Extracto',
        scientificName: 'Valeriana officinalis',
        category: 'Relajante',
        description: 'Extracto estandarizado de raíz para inducción del sueño profundo y restauración del sistema nervioso agotado.',
        benefits: ['Sueño reparador sin resaca', 'Ansiolítico potente no adictivo', 'Relajante muscular', 'Calma palpitaciones'],
        imageUrl: 'https://images.unsplash.com/photo-1628104394939-f9c1db16d10f?q=80&w=800&auto=format&fit=crop',
        preparation: 'Infusión nocturna o tintura madre concentrada.'
    },
    {
        id: '4',
        name: 'Jengibre Dorado Orgánico',
        scientificName: 'Zingiber officinale',
        category: 'Digestivo',
        description: 'Rizoma fresco de cultivo orgánico. Un poderoso antiinflamatorio sistémico y el mejor aliado contra el malestar gástrico.',
        benefits: ['Anti-náuseas inmediato', 'Antiinflamatorio articular', 'Termogénico natural', 'Protector gástrico'],
        imageUrl: 'https://images.unsplash.com/photo-1615485290327-0470929555c4?q=80&w=800&auto=format&fit=crop',
        preparation: 'Decocción de raíz fresca, rallado en jugos o compresas.'
    },
    {
        id: '5',
        name: 'Cúrcuma Activada',
        scientificName: 'Curcuma longa + Piper nigrum',
        category: 'Oncológico',
        description: 'La especia dorada potenciada con pimienta negra para máxima absorción. El antiinflamatorio natural más potente de la naturaleza.',
        benefits: ['Antioxidante celular masivo', 'Soporte hepático detox', 'Antiinflamatorio crónico', 'Inmunomodulador'],
        imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800&auto=format&fit=crop',
        preparation: 'Leche dorada (Golden Milk) o cápsulas liposomales.'
    },
    {
        id: '6',
        name: 'Aloe Vera Puro',
        scientificName: 'Aloe barbadensis miller',
        category: 'Piel',
        description: 'Gel cristalino 100% puro. El regenerador celular por excelencia para pieles dañadas, quemaduras o irritaciones.',
        benefits: ['Regeneración tisular acelerada', 'Hidratación profunda', 'Calmante inmediato', 'Cicatrizante'],
        imageUrl: 'https://images.unsplash.com/photo-1596547610015-89b52479e493?q=80&w=800&auto=format&fit=crop',
        preparation: 'Aplicación tópica directa o jugo digestivo en ayunas.'
    },
    {
        id: '7',
        name: 'Flores de Manzanilla',
        scientificName: 'Matricaria recutita',
        category: 'Relajante',
        description: 'Flores enteras de cosecha selecta. Suavidad digestiva y calma mental en una infusión dorada.',
        benefits: ['Digestivo suave', 'Calmante infantil seguro', 'Antiinflamatorio ocular', 'Relajante sutil'],
        imageUrl: 'https://images.unsplash.com/photo-1595123550441-d377e017de6a?q=80&w=800&auto=format&fit=crop',
        preparation: 'Infusión caliente, compresas oculares frías.'
    },
    {
        id: '8',
        name: 'Equinácea Purpúrea',
        scientificName: 'Echinacea purpurea',
        category: 'Inmunológico',
        description: 'El escudo del sistema inmune. Estimula las defensas naturales del cuerpo ante los primeros signos de enfermedad.',
        benefits: ['Potenciador de defensas', 'Antiviral natural', 'Reduce duración de gripes', 'Cicatrizante'],
        imageUrl: 'https://images.unsplash.com/photo-1627663484210-94d75d38f87b?q=80&w=800&auto=format&fit=crop',
        preparation: 'Extracto fluido, té de raíz y flor, o cápsulas.'
    },
    {
        id: '9',
        name: 'Lavanda Francesa',
        scientificName: 'Lavandula angustifolia',
        category: 'Relajante',
        description: 'Flores de alta montaña con el perfil de aroma más puro. Relajación instantánea a través del olfato y el gusto.',
        benefits: ['Sedante nervioso', 'Alivio de migrañas', 'Antiséptico cutáneo', 'Reductor de estrés'],
        imageUrl: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=800&auto=format&fit=crop',
        preparation: 'Infusión, aromaterapia, baños relajantes.'
    },
    {
        id: '10',
        name: 'Gel de Peyote Reforzado',
        scientificName: 'Lophophora williamsii (Extracto)',
        category: 'Analgesico',
        description: 'Antigua fórmula analgésica reforzada. Gel de rápida absorción que combina el poder antiinflamatorio del Peyote y la Marihuana para dolores profundos.',
        benefits: ['Alivio inmediato de artritis', 'Desinflamatorio muscular potente', 'Reduce dolor de ciática', 'Mejora la circulación local'],
        imageUrl: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?q=80&w=800&auto=format&fit=crop',
        preparation: 'Aplicación tópica con masaje suave en la zona afectada.'
    }
];
