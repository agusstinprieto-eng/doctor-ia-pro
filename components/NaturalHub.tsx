
import React, { useState } from 'react';
import { naturalProducts, NaturalProduct } from '../data/naturalProducts';

interface NaturalHubProps {
    onClose: () => void;
    onSelectProduct?: (product: NaturalProduct) => void;
}

const NaturalHub: React.FC<NaturalHubProps> = ({ onClose, onSelectProduct }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<NaturalProduct | null>(null);

    const categories = Array.from(new Set(naturalProducts.map(p => p.category)));

    const filteredProducts = naturalProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.benefits.some(b => b.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="absolute inset-0 bg-slate-950 z-40 flex flex-col animate-in fade-in duration-300">
            {/* Header Hub */}
            <div className="p-4 border-b border-emerald-500/20 bg-emerald-950/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-900/50 border border-emerald-500/50 flex items-center justify-center">
                        <i className="fas fa-leaf text-emerald-400"></i>
                    </div>
                    <div>
                        <h2 className="text-xl font-cyber text-emerald-100">Tienda Naturista</h2>
                        <p className="text-[10px] text-emerald-500/80 font-mono tracking-wider">PLANTAS DE VIDA // MARKETPLACE</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onClose}
                        className="hidden md:flex px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-xs text-slate-400 transition-colors"
                    >
                        Volver al Chat
                    </button>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="p-4 md:px-8 space-y-4">
                <div className="relative max-w-2xl mx-auto">
                    <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/50"></i>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                    {filteredProducts.map(product => (
                        <div
                            key={product.id}
                            onClick={() => setSelectedProduct(product)}
                            className="bg-slate-900/40 border border-emerald-500/20 rounded-xl overflow-hidden hover:border-emerald-400/50 transition-all cursor-pointer group"
                        >
                            <div className="h-40 overflow-hidden relative">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] text-emerald-300 border border-emerald-500/30">
                                    {product.category}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-emerald-100 flex items-center justify-between">
                                    {product.name}
                                    <i className="fas fa-chevron-right text-emerald-500/30 text-xs"></i>
                                </h3>
                                <p className="text-xs text-emerald-500/60 italic mb-2">{product.scientificName}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {product.benefits.slice(0, 3).map((benefit, i) => (
                                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/30 border border-emerald-500/10 text-emerald-400/80">
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
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-emerald-500 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-[0_0_50px_rgba(16,185,129,0.2)] animate-in zoom-in-95 duration-200">
                        <div className="md:w-1/2 h-48 md:h-auto relative">
                            <img
                                src={selectedProduct.imageUrl}
                                alt={selectedProduct.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r"></div>
                        </div>
                        <div className="p-6 md:w-1/2 flex flex-col relative">
                            <button
                                onClick={(e) => { e.stopPropagation(); setSelectedProduct(null); }}
                                className="absolute top-4 right-4 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white z-10"
                            >
                                <i className="fas fa-times"></i>
                            </button>

                            <div className="mb-4">
                                <span className="text-emerald-400 text-xs font-mono tracking-widest uppercase mb-1 block">Ficha Técnica</span>
                                <h2 className="text-2xl font-bold text-white mb-1">{selectedProduct.name}</h2>
                                <p className="text-emerald-500/70 italic text-sm">{selectedProduct.scientificName}</p>
                            </div>

                            <div className="space-y-4 text-sm text-slate-300 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-500/20">
                                <div>
                                    <h4 className="text-emerald-400 font-semibold mb-1"><i className="fas fa-info-circle mr-2"></i>Descripción</h4>
                                    <p className="leading-relaxed opacity-90">{selectedProduct.description}</p>
                                </div>

                                <div>
                                    <h4 className="text-emerald-400 font-semibold mb-1"><i className="fas fa-check mr-2"></i>Beneficios Principales</h4>
                                    <ul className="list-disc pl-5 space-y-1 marker:text-emerald-500">
                                        {selectedProduct.benefits.map((b, i) => <li key={i}>{b}</li>)}
                                    </ul>
                                </div>

                                {selectedProduct.preparation && (
                                    <div>
                                        <h4 className="text-emerald-400 font-semibold mb-1"><i className="fas fa-flask mr-2"></i>Preparación Sugerida</h4>
                                        <p className="leading-relaxed opacity-90 bg-emerald-950/20 p-3 rounded border border-emerald-500/20">
                                            {selectedProduct.preparation}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-700 flex gap-2">
                                <button
                                    onClick={() => window.open('https://www.plantasdevida.com', '_blank')}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                                >
                                    <i className="fas fa-shopping-cart"></i>
                                    Ver Disponibilidad
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NaturalHub;
