// import { useState } from "react"

// export default function Equipement(){


// //   Gestion des équipements
// // 	Enregistrement des équipements par infrastructure
// // 	Description (numérotation, dimension, état, localisation, adresse, Géolocalisation, valeur locative, Type de service)
// // 	Ajout de documents/photos
//     const [equipement, setEquipement] = useState({
//         id:1,
//         dimension:'400m',
//         etat: 'fonctionnel',
//         adresse: 'lome',
//         geolocalisation:'',
//         valeur:'',
//         type_service:'',
//     })

//     return(
//         <div className="flex-1 flex flex-col text-black">
//         </div>
//     )
// }

import { Plus, Package, Edit3, Trash2, Filter, Search, Eye } from 'lucide-react';
import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';

export default function Equipements() {
    const navigate = useNavigate();
    const { token, role } = useContext(AuthContext);
    const [equipements, setEquipements] = useState([
        {
            id: 1,
            nom: "Stand A12",
            description: "15m² - Poissonnerie",
            infrastructure: "Marché Central",
            type: "Étal",
            statut: "Occupé",
            occupant: "Dupont Marine",
            redevance: 12450,
            icon: Package
        },
        {
            id: 2,
            nom: "Box B05",
            description: "20m² - Boucherie",
            infrastructure: "Marché Central",
            type: "Box commercial",
            statut: "Occupé",
            occupant: "Boucherie Moderne",
            redevance: 26800,
            icon: Package
        },
        {
            id: 3,
            nom: "Quai Q3",
            description: "100m² - Marchandises",
            infrastructure: "Gare Routière Nord",
            type: "Quai",
            statut: "Libre",
            occupant: null,
            redevance: 12000,
            icon: Package
        },
        {
            id: 4,
            nom: "Stand C08",
            description: "12m² - Légumes",
            infrastructure: "Marché Central",
            type: "Étal",
            statut: "Maintenance",
            occupant: null,
            redevance: 13800,
            icon: Package
        },
        {
            id: 5,
            nom: "Dock D1",
            description: "200m² - Container",
            infrastructure: "Port de Commerce",
            type: "Dock",
            statut: "Occupé",
            occupant: "Maritime Express",
            redevance: 25000,
            icon: Package
        }
    ]);

    const [search, setSearch] = useState("");
    const [infrastructureFilter, setInfrastructureFilter] = useState("Toutes");
    const [typeFilter, setTypeFilter] = useState("Tous types");
    const [statutFilter, setStatutFilter] = useState("Tous statuts");
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingEquipement, setEditingEquipement] = useState(null);
    const [users, setUsers] = useState([]);

    const infrastructures = ["Toutes", "Marché Central", "Gare Routière Nord", "Port de Commerce"];
    const types = ["Tous types", "Étal", "Box commercial", "Quai", "Dock"];
    const statuts = ["Tous statuts", "Occupé", "Libre", "Maintenance"];

    function handleSearch(e) {
        setSearch(e.target.value);
    }

    function showAddEquipmentModal() {
        navigate('/equipement/new');
    }

    function handleEdit(equipement) {
        navigate(`/equipement/${equipement.id}/edit`);
    }

    function handleDelete(id) {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet équipement ?")) {
            setEquipements(prev => prev.filter(eq => eq.id !== id));
        }
    }

    async function handleDeleteUserByUsername(username) {
        if (!username) return;
        const user = users.find(u => u.username === username);
        if (!user) return;
        if (!window.confirm(`Supprimer l'utilisateur ${user.username} ?`)) return;
        try {
            const res = await fetch(`http://localhost:8080/api/users/${user.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setUsers(prev => prev.filter(u => u.id !== user.id));
            } else {
                alert('Suppression utilisateur échouée');
            }
        } catch (e) {
            alert('Erreur réseau lors de la suppression utilisateur');
        }
    }

    function handleViewUserByUsername(username) {
        const user = users.find(u => u.username === username);
        if (!user) return;
        alert(`Utilisateur\n- Nom: ${user.username}\n- Rôle: ${user.role}`);
    }

    useEffect(() => {
        // Charger les utilisateurs pour l'ADMIN uniquement
        async function fetchUsers() {
            if (!token || role !== 'ADMIN') return;
            try {
                const res = await fetch('http://localhost:8080/api/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data);
                }
            } catch (e) {
                // noop
            }
        }
        fetchUsers();
    }, [token, role]);

    const filteredEquipements = equipements.filter(eq => {
        const matchesSearch = eq.nom.toLowerCase().includes(search.toLowerCase()) ||
                            eq.description.toLowerCase().includes(search.toLowerCase()) ||
                            (eq.occupant && eq.occupant.toLowerCase().includes(search.toLowerCase()));
        const matchesInfrastructure = infrastructureFilter === "Toutes" || eq.infrastructure === infrastructureFilter;
        const matchesType = typeFilter === "Tous types" || eq.type === typeFilter;
        const matchesStatut = statutFilter === "Tous statuts" || eq.statut === statutFilter;
        
        return matchesSearch && matchesInfrastructure && matchesType && matchesStatut;
    });

    const getStatutColor = (statut) => {
        switch(statut) {
            case "Occupé": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
            case "Libre": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
            case "Maintenance": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
            default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
        }
    };

    const getTypeIcon = (type) => {
        // Vous pouvez personnaliser les icônes selon le type
        return Package;
    };

    return (
        <div id="equipements" className="module-content p-6 animate-fade-in">
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Gestion des Équipements
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Gérez les emplacements et équipements
                        </p>
                    </div>
                    <button 
                        onClick={showAddEquipmentModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                        <Plus size={20} />
                        <span>Ajouter Équipement</span>
                    </button>
                </div>
            </div>

            {/* Filtres */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Infrastructure
                        </label>
                        <select 
                            value={infrastructureFilter}
                            onChange={(e) => setInfrastructureFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base"
                        >
                            {infrastructures.map(infra => (
                                <option key={infra} value={infra}>{infra}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Type
                        </label>
                        <select 
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base"
                        >
                            {types.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Statut
                        </label>
                        <select 
                            value={statutFilter}
                            onChange={(e) => setStatutFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base"
                        >
                            {statuts.map(statut => (
                                <option key={statut} value={statut}>{statut}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Recherche
                        </label>
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Nom, utilisateur..." 
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base" 
                                onChange={handleSearch} 
                                value={search}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {equipements.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total équipements</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="text-2xl font-bold text-green-600">
                        {equipements.filter(eq => eq.statut === "Occupé").length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Occupés</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="text-2xl font-bold text-blue-600">
                        {equipements.filter(eq => eq.statut === "Libre").length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Libres</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {equipements.filter(eq => eq.statut === "Occupé").reduce((sum, eq) => sum + eq.redevance, 0).toLocaleString()}F
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Recettes/mois</div>
                </div>
            </div>

            {/* Tableau des équipements */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Équipement
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Infrastructure
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Utilisateur
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Redevance
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredEquipements.map((equipement) => {
                                const IconComponent = getTypeIcon(equipement.type);
                                return (
                                    <tr key={equipement.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                                                    <IconComponent size={20} className="text-blue-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {equipement.nom}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {equipement.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {equipement.infrastructure}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {equipement.type}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatutColor(equipement.statut)}`}>
                                                {equipement.statut}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            <div className="flex items-center gap-2">
                                                <span>{equipement.occupant || '-'}</span>
                                                {role === 'ADMIN' && equipement.occupant && users.find(u => u.username === equipement.occupant) && (
                                                    <>
                                                        <button
                                                            title="Voir utilisateur"
                                                            onClick={() => handleViewUserByUsername(equipement.occupant)}
                                                            className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            title="Supprimer utilisateur"
                                                            onClick={() => handleDeleteUserByUsername(equipement.occupant)}
                                                            className="text-red-600 hover:text-red-900 inline-flex items-center"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {equipement.redevance.toLocaleString()}F/mois
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button 
                                                onClick={() => handleEdit(equipement)}
                                                className="text-blue-600 hover:text-blue-900 mr-3 inline-flex items-center"
                                            >
                                                <Edit3 size={16} className="mr-1" />
                                                Modifier
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(equipement.id)}
                                                className="text-red-600 hover:text-red-900 inline-flex items-center"
                                            >
                                                <Trash2 size={16} className="mr-1" />
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredEquipements.length === 0 && (
                <div className="text-center py-12">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                        Aucun équipement trouvé avec les critères sélectionnés.
                    </p>
                </div>
            )}

            {/* Formulaire modal remplacé par des pages dédiées */}
        </div>
    );
}