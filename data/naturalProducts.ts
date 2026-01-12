
export interface NaturalProduct {
    id: string;
    name: string;
    scientificName: string;
    category: 'Relajante' | 'Respiratorio' | 'Digestivo' | 'Inmunológico' | 'Piel' | 'Oncológico' | 'Otro';
    description: string;
    benefits: string[];
    imageUrl: string; // Placeholder URL initially
    preparation?: string;
}

export const naturalProducts: NaturalProduct[] = [
    {
        id: '1',
        name: 'Cannabis Medicinal',
        scientificName: 'Cannabis sativa L.',
        category: 'Oncológico',
        description: 'Planta con potentes propiedades analgésicas, antieméticas y antitumorales. Actúa sobre el sistema endocannabinoide para regular la homeostasis.',
        benefits: ['Alivio del dolor crónico', 'Reducción de náuseas (quimioterapia)', 'Estimulación del apetito', 'Propiedades neuroprotectoras'],
        imageUrl: 'https://images.unsplash.com/photo-1603909223429-69bb71a1f420?q=80&w=300&auto=format&fit=crop', // Generic High Quality
        preparation: 'Aceites sublinguales (Ratios THC:CBD), vaporización de flor seca, cremas tópicas.'
    },
    {
        id: '2',
        name: 'Eucalipto',
        scientificName: 'Eucalyptus globulus',
        category: 'Respiratorio',
        description: 'Árbol perenne cuyas hojas son ricas en cineol. Es el estándar de oro para afecciones respiratorias.',
        benefits: ['Descongestionante natural', 'Expectorante', 'Antiséptico en vías aéreas', 'Alivio de bronquitis'],
        imageUrl: 'https://images.unsplash.com/photo-1515446055536-1db8d4bb9ce7?q=80&w=300&auto=format&fit=crop',
        preparation: 'Vahos (vaporizaciones), infusión de hojas, aceite esencial difusor.'
    },
    {
        id: '3',
        name: 'Valeriana',
        scientificName: 'Valeriana officinalis',
        category: 'Relajante',
        description: 'Raíz utilizada milenariamente para calmar el sistema nervioso sin los efectos adictivos de los fármacos.',
        benefits: ['Inductor del sueño profundo', 'Ansiolítico natural', 'Relajante muscular', 'Reductor de taquicardia nerviosa'],
        imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=300&auto=format&fit=crop',
        preparation: 'Infusión de la raíz (sabor fuerte), extracto líquido, cápsulas.'
    },
    {
        id: '4',
        name: 'Jengibre',
        scientificName: 'Zingiber officinale',
        category: 'Digestivo',
        description: 'Rizoma con potentes efectos antiinflamatorios y digestivos. Un aliado clave en la oncología integrativa para el confort gástrico.',
        benefits: ['Antiemético potente (náuseas)', 'Antiinflamatorio sistémico', 'Mejora la digestión', 'Calienta el cuerpo'],
        imageUrl: 'https://images.unsplash.com/photo-1615485925694-a031e893db2c?q=80&w=300&auto=format&fit=crop',
        preparation: 'Té de la raíz fresca, rallado en comidas, extracto seco.'
    },
    {
        id: '5',
        name: 'Cúrcuma',
        scientificName: 'Curcuma longa',
        category: 'Oncológico',
        description: 'La especia dorada. Su principio activo, la curcumina, es uno de los antiinflamatorios naturales más estudiados del mundo.',
        benefits: ['Potente antiinflamatorio', 'Antioxidante celular', 'Apoyo hepático', 'Coadyuvante en terapias oncológicas'],
        imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=300&auto=format&fit=crop',
        preparation: 'Leche dorada (con pimienta negra para absorción), cápsulas de alta concentración.'
    }
];
