import React, { useState, useEffect, useRef } from 'react';
import { naturalProducts, NaturalProduct } from '../data/naturalProducts';
import { Plus, Trash2, Edit2, Upload, X, Search, ShoppingCart, Leaf } from 'lucide-react';

interface NaturalHubProps {
    onClose: () => void;
    onSelectProduct?: (product: NaturalProduct) => void;
}

const NaturalHub: React.FC<NaturalHubProps> = ({ onClose, onSelectProduct }) => {
    // Initialize state with localStorage data or default constant
    const [products, setProducts] = useState<NaturalProduct[]>(() => {
        const saved = localStorage.getItem('natural_store_products');
        return saved ? JSON.parse(saved) : naturalProducts;
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<NaturalProduct | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Derived categories from current products
    const categories = Array.from(new Set(products.map(p => p.category)));

    // Sync to LocalStorage whenever products change
    useEffect(() => {
        localStorage.setItem('natural_store_products', JSON.stringify(products));
    }, [products]);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.benefits.some(b => b.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    const handleAddProduct = (newProduct: NaturalProduct) => {
        setProducts([newProduct, ...products]);
        setIsAddModalOpen(false);
    };

    const handleDeleteProduct = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('¿Estás seguro de eliminar este producto del catálogo?')) {
            setProducts(products.filter(p => p.id !== id));
            if (selectedProduct?.id === id) setSelectedProduct(null);
        }
    };

    return (
        <div className="absolute inset-0 bg-slate-950 z-40 flex flex-col animate-in fade-in duration-300">
            {/* Header Hub */}
            <div className="p-4 border-b border-emerald-500/20 bg-emerald-950/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-900/50 border border-emerald-500/50 flex items-center justify-center">
                        <Leaf className="text-emerald-400" size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-cyber text-emerald-100">Tienda Naturista</h2>
                        <p className="text-[10px] text-emerald-500/80 font-mono tracking-wider">PLANTAS DE VIDA // MARKETPLACE</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg border border-emerald-500/50 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                    >
                        <Plus size={14} />
                        <span className="hidden md:inline">Alta Producto</span>
                    </button>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="p-4 md:px-8 space-y-4 shrink-0">
                <div className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/50" size={16} />
                    <input
                        type="text"
                        placeholder="Buscar por planta o dolencia (ej. Ansiedad, Dolor)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900/50 border border-emerald-500/30 rounded-full py-2 pl-12 pr-4 text-emerald-100 placeholder:text-emerald-500/30 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 transition-all font-mono text-sm"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${selectedCategory === null
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                            : 'bg-transparent border-slate-700 text-slate-400 hover:border-emerald-500/50'
                            }`}
                    >
                        Todo
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${selectedCategory === cat
                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                                : 'bg-transparent border-slate-700 text-slate-400 hover:border-emerald-500/50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto pb-10">
                    {filteredProducts.map(product => (
                        <div
                            key={product.id}
                            onClick={() => setSelectedProduct(product)}
                            className="bg-slate-900/40 border border-emerald-500/20 rounded-xl overflow-hidden hover:border-emerald-400/50 transition-all cursor-pointer group relative"
                        >
                            {/* Delete Button (visible on hover) */}
                            <button
                                onClick={(e) => handleDeleteProduct(e, product.id)}
                                className="absolute top-2 right-2 z-20 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Eliminar Producto"
                            >
                                <Trash2 size={14} />
                            </button>

                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] text-emerald-300 border border-emerald-500/30 font-bold uppercase tracking-wider">
                                    {product.category}
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-lg text-emerald-100 flex items-center justify-between mb-1">
                                    {product.name}
                                </h3>
                                <p className="text-xs text-emerald-500/60 italic mb-3">{product.scientificName}</p>
                                <div className="flex flex-wrap gap-1">
                                    {product.benefits.slice(0, 3).map((benefit, i) => (
                                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/20 text-emerald-400/80">
                                            {benefit}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal Detail */}
            {selectedProduct && (
                <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-emerald-500 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-[0_0_50px_rgba(16,185,129,0.2)] animate-in zoom-in-95 duration-200 relative">
                        <div className="md:w-1/2 h-64 md:h-auto relative shrink-0">
                            <img
                                src={selectedProduct.imageUrl}
                                alt={selectedProduct.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r"></div>
                        </div>
                        <div className="p-8 md:w-1/2 flex flex-col relative overflow-y-auto">
                            <button
                                onClick={(e) => { e.stopPropagation(); setSelectedProduct(null); }}
                                className="absolute top-4 right-4 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white z-10"
                            >
                                <X size={20} />
                            </button>

                            <div className="mb-6">
                                <span className="text-emerald-400 text-xs font-mono tracking-widest uppercase mb-2 block">Ficha Técnica</span>
                                <h2 className="text-3xl font-bold text-white mb-2 leading-tight">{selectedProduct.name}</h2>
                                <p className="text-emerald-500/70 italic text-sm">{selectedProduct.scientificName}</p>
                            </div>

                            <div className="space-y-6 text-sm text-slate-300 flex-1">
                                <div>
                                    <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                                        <Leaf size={12} /> Descripción
                                    </h4>
                                    <p className="leading-relaxed opacity-90 text-justify">{selectedProduct.description}</p>
                                </div>

                                <div>
                                    <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                                        <i className="fas fa-check"></i> Beneficios
                                    </h4>
                                    <ul className="list-disc pl-5 space-y-1.5 marker:text-emerald-500 text-slate-400">
                                        {selectedProduct.benefits.map((b, i) => <li key={i}>{b}</li>)}
                                    </ul>
                                </div>

                                {selectedProduct.preparation && (
                                    <div>
                                        <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                                            <i className="fas fa-flask"></i> Uso Sugerido
                                        </h4>
                                        <p className="leading-relaxed opacity-90 bg-emerald-950/30 p-4 rounded-lg border border-emerald-500/20 text-emerald-100">
                                            {selectedProduct.preparation}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-700/50">
                                <button
                                    onClick={() => window.open('https://www.plantasdevida.com', '_blank')}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 uppercase tracking-widest"
                                >
                                    <ShoppingCart size={16} />
                                    Ver Disponibilidad
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Product Modal */}
            {isAddModalOpen && (
                <AddProductModal
                    onClose={() => setIsAddModalOpen(false)}
                    onSave={handleAddProduct}
                />
            )}
        </div>
    );
};

export default NaturalHub;

// --- Subcomponent: Add Product Modal ---

function AddProductModal({ onClose, onSave }: { onClose: () => void, onSave: (prod: NaturalProduct) => void }) {
    const [name, setName] = useState('');
    const [scientificName, setScientificName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [benefitsStr, setBenefitsStr] = useState('');
    const [preparation, setPreparation] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [previewFile, setPreviewFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let finalImage = imageUrl;
        if (previewFile) {
            finalImage = URL.createObjectURL(previewFile);
        }

        const newProduct: NaturalProduct = {
            id: Date.now().toString(),
            name,
            scientificName,
            category: category || 'General',
            description,
            benefits: benefitsStr.split(',').map(s => s.trim()).filter(Boolean),
            preparation,
            imageUrl: finalImage || 'https://images.unsplash.com/photo-1540420772988-4c38d2e5d687?q=80&w=800&auto=format&fit=crop' // Fallback image
        };
        onSave(newProduct);
    };

    return (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-emerald-500/50 rounded-2xl w-full max-w-lg overflow-y-auto max-h-[90vh] shadow-2xl">
                <div className="p-6 border-b border-emerald-500/20 flex justify-between items-center bg-emerald-950/20">
                    <h3 className="text-xl font-bold text-emerald-100 uppercase tracking-wide flex items-center gap-2">
                        <Plus size={20} className="text-emerald-400" />
                        Alta de Producto
                    </h3>
                    <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-white" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Nombre Comercial</label>
                        <input required value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white outline-none focus:border-emerald-500" placeholder="Ej. Jarabe de Bugambilia" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Nombre Científico</label>
                            <input value={scientificName} onChange={e => setScientificName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white outline-none focus:border-emerald-500" placeholder="Opcional" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Categoría</label>
                            <input list="cat-suggestions" value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white outline-none focus:border-emerald-500" placeholder="Ej. Respiratorio" />
                            <datalist id="cat-suggestions">
                                <option value="Relajante" />
                                <option value="Respiratorio" />
                                <option value="Digestivo" />
                                <option value="Piel" />
                            </datalist>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Imagen del Producto</label>
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                                    <input type="radio" name="imgSource" checked={previewFile === null} onChange={() => setPreviewFile(null)} className="accent-emerald-500" /> URL
                                </label>
                                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                                    <input type="radio" name="imgSource" checked={previewFile !== null} onChange={() => { if (fileInputRef.current) fileInputRef.current.click() }} className="accent-emerald-500" /> Subir Foto
                                </label>
                            </div>

                            {previewFile ? (
                                <div className="p-2 border border-emerald-500/30 rounded bg-emerald-900/10 text-xs text-emerald-300 flex justify-between items-center">
                                    <span>{previewFile.name}</span>
                                    <button type="button" onClick={() => setPreviewFile(null)} className="text-emerald-500 hover:text-white">Cambiar</button>
                                </div>
                            ) : (
                                <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white outline-none focus:border-emerald-500 text-xs" placeholder="https://..." />
                            )}
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => e.target.files && setPreviewFile(e.target.files[0])} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Descripción</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white outline-none focus:border-emerald-500 h-20 resize-none" placeholder="Describe el producto..."></textarea>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Beneficios (Separados por coma)</label>
                        <input value={benefitsStr} onChange={e => setBenefitsStr(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white outline-none focus:border-emerald-500" placeholder="Ej. Dolor, Inflamación, Sueño" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Uso / Preparación</label>
                        <input value={preparation} onChange={e => setPreparation(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white outline-none focus:border-emerald-500" placeholder="Ej. 10 gotas cada 8 horas" />
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/50">
                            Guardar Producto
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}
