import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function Infrastructure({isLight, toggleDarkMode}) {

    const [search, setSearch] = useState("");

    function Search(e) {
        setSearch(e.target.value)
    }
   
    return (
        <div className={`flex flex-col w-full h-screen
        ${isLight ?
            "text-black" :
            "text-white"
        }
        `}>
            <div className=" flex justify-between w-full p-2">
                <section className="ml-4 ">
                    <h1 className="text-2xl font-bold whitespace-nowrap">Toutes les infrastructures</h1>
                    <p className="text-sm">Gérer les infrastructures</p>
                </section>
                <div>
                    <button className="flex cursor-pointer justify-center items-center gap-2 rounded-lg text-white text-sm whitespace-nowrap bg-blue-600 hover:bg-blue-700 p-2 mt-3 mr-5">
                        <Plus className="font-extrabold text-xl" />
                        <span>Ajouter une infrastructure</span>
                    </button>
                </div>
            </div>
            <div className={
                ` dark:bg-gray-800 rounded-xl shadow-lg mx-5 my-4 p-6 mb-6 border border-gray-200 dark:border-gray-700
                ${isLight ? "bg-white" : "bg-gray-800 text-white shadow-gray-400/55 shadow-2xl"

                }
                `}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
                            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-base">
                                <option>Tous types</option>
                                <option>Marché</option>
                                <option>Gare routière</option>
                                <option>Abattoir</option>
                                <option>Port</option>
                                <option>Parking</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Statut</label>
                            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-base">
                                <option>Tous statuts</option>
                                <option>Actif</option>
                                <option>Maintenance</option>
                                <option>Fermé</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Zone</label>
                            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-base">
                                <option>Toutes zones</option>
                                <option>Centre-ville</option>
                                <option>Zone industrielle</option>
                                <option>Périphérie</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recherche</label>
                            <input type="text" placeholder='Nom, adresse...' className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 
                            ${isLight ?
                                "text-base dark:text-white" :
                                "text-white"
                            }
                            `}
                            value={search}
                            onChange={(e) => Search(e)}
                            />

                        </div>
                    </div>
                </div>
        </div>
    );
}
