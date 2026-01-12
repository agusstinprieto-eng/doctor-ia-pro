import React, { useState, useRef } from 'react';
import { BookOpen, Video, FileText, Search, Play, ExternalLink, Plus, Upload, X, Image as ImageIcon } from 'lucide-react';

interface Resource {
    id: string;
    title: string;
    type: 'video' | 'pdf' | 'image';
    category: string;
    url: string;
    thumbnail?: string;
    description: string;
}

const INITIAL_RESOURCES: Resource[] = [
    // Anatomy / Surgery Videos
    {
        id: 'v1',
        title: 'Anatomía Cardíaca 3D',
        type: 'video',
        category: 'Anatomía',
        url: 'https://www.youtube.com/embed/j_nco2J7nVU',
        thumbnail: 'https://img.youtube.com/vi/j_nco2J7nVU/mqdefault.jpg',
        description: 'Exploración detallada de las válvulas y ventrículos.'
    },
    {
        id: 'v2',
        title: 'Cirugía Laparoscópica: Fundamentos',
        type: 'video',
        category: 'Cirugía',
        url: 'https://www.youtube.com/embed/w0fXjF5IqX8',
        thumbnail: 'https://img.youtube.com/vi/w0fXjF5IqX8/mqdefault.jpg',
        description: 'Técnicas básicas de acceso e instrumentación.'
    },
    // PDFs 
    {
        id: 'p1',
        title: 'Guía de Práctica Clínica: Hipertensión',
        type: 'pdf',
        category: 'Cardiología',
        url: 'https://www.cenetec-difusion.com/CMGPC/GPC-IMSS-076-08/ER.pdf',
        description: 'Protocolo actualizado para el tratamiento de HTA.'
    }
];

const CATEGORIES = ['Todas', 'Anatomía', 'Cirugía', 'Cardiología', 'Dermatología', 'Pediatría', 'Radiología'];

export function MedicalLibrary() {
    const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeResource, setActiveResource] = useState<Resource | null>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // Filter Logic
    const filteredResources = resources.filter(res => {
        const matchesCategory = selectedCategory === 'Todas' || res.category === selectedCategory;
        const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            res.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleSaveResource = (newResource: Resource) => {
        setResources([newResource, ...resources]);
        setIsUploadModalOpen(false);
    };

    return (
        <div className="flex flex-col h-full bg-slate-950 text-slate-200 p-6 overflow-hidden relative">

            {/* Header */}
            <div className="flex justify-between items-center mb-8 shrink-0">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                        <span className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20 text-cyan-400">
                            <BookOpen size={24} />
                        </span>
                        Compendio Médico
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Biblioteca universal de recursos educativos</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar recursos..."
                            className="bg-slate-900 border border-slate-700 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:border-cyan-500 outline-none w-64 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(8,145,178,0.4)] hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]"
                    >
                        <Upload size={16} />
                        <span className="hidden md:inline">Subir Recurso</span>
                    </button>
                </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 shrink-0">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all border ${selectedCategory === cat ? 'bg-cyan-500 text-white border-cyan-500 shadow-lg shadow-cyan-500/20' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="flex gap-6 h-full overflow-hidden">

                {/* Resource List / Grid */}
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-start overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800 ${activeResource ? 'w-full lg:w-1/3 hidden lg:grid' : 'w-full'}`}>
                    {filteredResources.map(res => (
                        <div
                            key={res.id}
                            onClick={() => setActiveResource(res)}
                            className={`group bg-slate-900/50 border rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] ${activeResource?.id === res.id ? 'border-cyan-500 ring-1 ring-cyan-500/50' : 'border-slate-800 hover:border-slate-600'}`}
                        >
                            {/* Thumbnail Logic */}
                            <div className="aspect-video bg-slate-950 relative overflow-hidden">
                                {res.type === 'video' ? (
                                    <>
                                        <img src={res.thumbnail || 'https://via.placeholder.com/320x180/000000/FFFFFF?text=VIDEO'} alt={res.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-colors">
                                            <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                                                <Play size={16} className="text-white ml-1" />
                                            </div>
                                        </div>
                                    </>
                                ) : res.type === 'image' ? (
                                    <img src={res.url} alt={res.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 group-hover:text-slate-300">
                                        <FileText size={48} className="mb-2" />
                                    </div>
                                )}

                                {/* Type Badge */}
                                <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 rounded text-[10px] font-bold uppercase text-white flex items-center gap-1 backdrop-blur-sm border border-white/10">
                                    {res.type === 'video' && <Video size={10} />}
                                    {res.type === 'pdf' && <FileText size={10} />}
                                    {res.type === 'image' && <ImageIcon size={10} />}
                                    {res.type.toUpperCase()}
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-1">{res.category}</div>
                                <h3 className="font-bold text-white text-sm leading-tight mb-2 group-hover:text-cyan-400 transition-colors">{res.title}</h3>
                                <p className="text-xs text-slate-500 line-clamp-2">{res.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Active Resource Viewer */}
                {activeResource && (
                    <Viewer
                        resource={activeResource}
                        onClose={() => setActiveResource(null)}
                    />
                )}

            </div>

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <UploadModal
                    onClose={() => setIsUploadModalOpen(false)}
                    onSave={handleSaveResource}
                />
            )}

        </div>
    );
}

// --- Subcomponents ---

function Viewer({ resource, onClose }: { resource: Resource, onClose: () => void }) {
    return (
        <div className="flex-1 bg-black/50 rounded-2xl border border-slate-700 overflow-hidden flex flex-col animate-in fade-in slide-in-from-right-10 duration-300 absolute inset-0 md:relative z-20 md:z-auto m-2 md:m-0 backdrop-blur-xl md:backdrop-blur-none">
            <div className="flex justify-between items-center p-4 bg-slate-900 border-b border-slate-800">
                <div>
                    <h3 className="text-lg font-bold text-white line-clamp-1">{resource.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="bg-slate-800 px-2 py-0.5 rounded uppercase font-bold text-xs">{resource.type}</span>
                        <span>{resource.category}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors" title="Abrir en pestaña">
                        <ExternalLink size={18} />
                    </a>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-black relative flex items-center justify-center overflow-auto">
                {resource.type === 'video' ? (
                    <iframe
                        src={`${resource.url.includes('youtube') && !resource.url.includes('embed') ? resource.url.replace('watch?v=', 'embed/') : resource.url}`}
                        title={resource.title}
                        className="w-full h-full absolute inset-0 border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                ) : resource.type === 'image' ? (
                    <img src={resource.url} alt={resource.title} className="max-w-full max-h-full object-contain" />
                ) : (
                    <iframe
                        src={resource.url}
                        title={resource.title}
                        className="w-full h-full absolute inset-0 border-0 bg-white"
                    ></iframe>
                )}
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 shrink-0">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Descripción del Recurso</h4>
                <p className="text-sm text-slate-300">{resource.description}</p>
            </div>
        </div>
    );
}

function UploadModal({ onClose, onSave }: { onClose: () => void, onSave: (res: Resource) => void }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(CATEGORIES[1]); // Default to first real category
    const [type, setType] = useState<'video' | 'pdf' | 'image'>('pdf');
    const [url, setUrl] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let finalUrl = url;
        if (file) {
            // Limit: 5MB to protect free tier storage
            if (file.size > 5 * 1024 * 1024) {
                alert("⚠️ El archivo es demasiado pesado.\n\nPara cuidar el espacio de tu cuenta gratuita, el límite es de 5MB por archivo.");
                return;
            }
            finalUrl = URL.createObjectURL(file);
        }

        // Basic Youtube URL Fixer for embeds
        if (type === 'video' && finalUrl.includes('youtube.com/watch?v=')) {
            finalUrl = finalUrl.replace('watch?v=', 'embed/');
        }

        const newResource: Resource = {
            id: Date.now().toString(),
            title,
            description,
            category,
            type,
            url: finalUrl,
            // Create a simple thumbnail for uploaded images/videos if possible or use placeholder
            thumbnail: type === 'image' && file ? URL.createObjectURL(file) : undefined
        };

        onSave(newResource);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden">

                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                        <Upload className="text-cyan-400" size={20} />
                        Subir Nuevo Recurso
                    </h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Título del Recurso</label>
                        <input required value={title} onChange={e => setTitle(e.target.value)} type="text" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" placeholder="Ej: Radiografía Torácica..." />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Categoría</label>
                            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none">
                                {CATEGORIES.filter(c => c !== 'Todas').map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Tipo</label>
                            <select value={type} onChange={e => setType(e.target.value as any)} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none">
                                <option value="pdf">Documento PDF</option>
                                <option value="video">Video</option>
                                <option value="image">Imagen / Foto</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Archivo / Enlace</label>

                        <div className="flex flex-col gap-3">
                            {/* File Switcher */}
                            <div className="flex gap-4 mb-2">
                                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                                    <input type="radio" name="source" checked={file === null} onChange={() => setFile(null)} className="accent-cyan-500" />
                                    <span>URL Externa</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                                    <input type="radio" name="source" checked={file !== null} onChange={() => { if (fileInputRef.current) fileInputRef.current.click() }} className="accent-cyan-500" />
                                    <span>Subir Archivo Local</span>
                                </label>
                            </div>

                            {file ? (
                                <div className="flex items-center justify-between bg-cyan-900/20 border border-cyan-500/30 p-3 rounded-lg">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <FileText size={20} className="text-cyan-400 shrink-0" />
                                        <span className="text-sm text-cyan-200 truncate">{file.name}</span>
                                    </div>
                                    <button type="button" onClick={() => setFile(null)} className="text-cyan-500 hover:text-white px-2">Cambiar</button>
                                </div>
                            ) : (
                                <input
                                    value={url}
                                    onChange={e => setUrl(e.target.value)}
                                    type="text"
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                                    placeholder={type === 'video' ? "https://youtube.com/..." : "https://ejemplo.com/archivo.pdf"}
                                    required={!file}
                                />
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept={type === 'image' ? "image/*" : type === 'pdf' ? "application/pdf" : "video/*"}
                                onChange={e => e.target.files && setFile(e.target.files[0])}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Descripción</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none h-20 resize-none" placeholder="Breve descripción del contenido..."></textarea>
                    </div>

                    <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl uppercase tracking-widest shadow-lg shadow-cyan-500/20 transition-all mt-4">
                        Guardar en Biblioteca
                    </button>

                </form>
            </div>
        </div>
    );
}
