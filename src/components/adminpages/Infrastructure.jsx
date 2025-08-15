import { Plus, MoreVertical, MapPin, Store, Bus, Anchor, ImagePlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Infrastructure() {
    const navigate = useNavigate();
    const [infrastructure, setInfrastructure] = useState({
        id: '1',
        nom: 'gare',
        image: "",
    });
    
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("Tous types");
    const [statusFilter, setStatusFilter] = useState("Tous statuts");
    const [zoneFilter, setZoneFilter] = useState("Toutes zones");

    const infrastructures = [
        {
            id: 1,
            nom: "Marché Central",
            type: "Marché",
            statut: "Actif",
            zone: "Centre-ville",
            adresse: "Place de la République, Centre-ville",
            equipements: 45,
            occupation: 92,
            recettes: 12450,
            gradient: "from-blue-500 to-purple-600",
            icon: Store
        },
        {
            id: 2,
            nom: "Gare Routière Nord",
            type: "Gare routière",
            statut: "Maintenance",
            zone: "Zone Nord",
            adresse: "Avenue de la Gare, Zone Nord",
            equipements: 12,
            occupation: 75,
            recettes: 8200,
            gradient: "from-green-500 to-teal-600",
            icon: Bus
        },
        {
            id: 3,
            nom: "Port de Commerce",
            type: "Port",
            statut: "Actif",
            zone: "Zone Portuaire",
            adresse: "Quai du Commerce, Zone Portuaire",
            equipements: 8,
            occupation: 88,
            recettes: 24580,
            gradient: "from-purple-500 to-pink-600",
            icon: Anchor
        }
    ];

    const [imagesMap, setImagesMap] = useState({});

    useEffect(() => {
        try {
            const raw = localStorage.getItem('infra_images');
            if (raw) setImagesMap(JSON.parse(raw));
        } catch {}
    }, []);

    function handleSearch(e) {
        setSearch(e.target.value);
    }

    function goToCreate() {
        navigate('/infrastructure/new');
    }

    const filteredInfrastructures = infrastructures.filter(infra => {
        const matchesSearch = infra.nom.toLowerCase().includes(search.toLowerCase()) || 
                            infra.adresse.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === "Tous types" || infra.type === typeFilter;
        const matchesStatus = statusFilter === "Tous statuts" || infra.statut === statusFilter;
        const matchesZone = zoneFilter === "Toutes zones" || infra.zone === zoneFilter;
        
        return matchesSearch && matchesType && matchesStatus && matchesZone;
    });

    const getStatusColor = (statut) => {
        switch(statut) {
            case "Actif": return "bg-green-500";
            case "Maintenance": return "bg-yellow-500";
            case "Fermé": return "bg-red-500";
            default: return "bg-gray-500";
        }
    };

    const getOccupationColor = (occupation) => {
        if (occupation >= 90) return "text-green-600";
        if (occupation >= 70) return "text-yellow-600";
        return "text-red-600";
    };

    return (
        <div id="infrastructures" className="module-content p-6 animate-fade-in">
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Gestion des Infrastructures
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Gérez vos équipements marchands
                        </p>
                    </div>
                    <button 
                        onClick={goToCreate}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                        <Plus size={20} />
                        <span>Ajouter Infrastructure</span>
                    </button>
                </div>
            </div>

            {/* Filtres */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Type
                        </label>
                        <select 
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base"
                        >
                            <option>Tous types</option>
                            <option>Marché</option>
                            <option>Gare routière</option>
                            <option>Abattoir</option>
                            <option>Port</option>
                            <option>Parking</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Statut
                        </label>
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base"
                        >
                            <option>Tous statuts</option>
                            <option>Actif</option>
                            <option>Maintenance</option>
                            <option>Fermé</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Zone
                        </label>
                        <select 
                            value={zoneFilter}
                            onChange={(e) => setZoneFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base"
                        >
                            <option>Toutes zones</option>
                            <option>Centre-ville</option>
                            <option>Zone industrielle</option>
                            <option>Périphérie</option>
                            <option>Zone Nord</option>
                            <option>Zone Portuaire</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Recherche
                        </label>
                        <input 
                            type="text" 
                            placeholder="Nom, adresse..." 
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base" 
                            onChange={handleSearch} 
                            value={search}
                        />
                    </div>
                </div>
            </div>

            {/* Cartes d'Infrastructure */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInfrastructures.map((infra) => {
                    const IconComponent = infra.icon;
                    return (
                        <div key={infra.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
                            <div className={`h-48 relative ${imagesMap[infra.id] ? '' : `bg-gradient-to-r ${infra.gradient}`}`}>
                                {imagesMap[infra.id] && (
                                    <img src={imagesMap[infra.id]} alt={infra.nom} className="absolute inset-0 w-full h-full object-cover" />
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className={`${getStatusColor(infra.statut)} text-white px-2 py-1 rounded-full text-xs`}>
                                        {infra.statut}
                                    </span>
                                </div>
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button
                                        onClick={() => navigate(`/infrastructure/${infra.id}/edit`)}
                                        title="Ajouter/Modifier l'image"
                                        className="text-white hover:text-gray-200 flex items-center gap-1 bg-white/20 rounded px-2 py-1"
                                    >
                                        <ImagePlus size={16} />
                                        <span className="hidden sm:inline text-xs">Edit image</span>
                                    </button>
                                    <button className="text-white hover:text-gray-200">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <IconComponent size={32} />
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {infra.nom}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                    {infra.adresse}
                                </p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {infra.type === "Port" || infra.type === "Gare routière" ? "Quais:" : "Équipements:"}
                                        </span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {infra.equipements}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Occupation:</span>
                                        <span className={`font-medium ${getOccupationColor(infra.occupation)}`}>
                                            {infra.occupation}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Recettes/mois:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {infra.recettes.toLocaleString()}€
                                        </span>
                                    </div>
                                </div>
                                <div className="flex space-x-2 mt-4">
                                    <button onClick={() => navigate(`/infrastructure/${infra.id}/edit`)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm transition-colors">
                                        Modifier
                                    </button>
                                    <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <MapPin size={16} className="text-gray-600 dark:text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredInfrastructures.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                        Aucune infrastructure trouvée avec les critères sélectionnés.
                    </p>
                </div>
            )}
        </div>
    );
}