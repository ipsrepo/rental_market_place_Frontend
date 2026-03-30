// ═══════════════════════════════════════════════════════════════════════════════
// My Properties Tab
// ═══════════════════════════════════════════════════════════════════════════════
import PropertyCard from "../../components/PropertyCard.jsx";

const MyProperties = ({properties, onEdit, onToggleAvailability}) => {
    if (properties.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No listings yet</h3>
                <p className="text-gray-500 text-sm mt-1">Properties you post will appear here.</p>
                <button
                    className="mt-4 bg-primary text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-primary transition-colors">
                    Post a property
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">{properties.length} {properties.length === 1 ? 'listing' : 'listings'}</p>
                <button
                    className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary transition-colors flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                    </svg>
                    Add listing
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {properties.map((property) => (
                    <div key={property._id} className="relative group">

                        {/* Availability badge */}
                        <div className="absolute top-2 left-2 z-10">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  property.available
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-500 text-white'
              }`}>
                {property.available ? 'Available' : 'Let agreed'}
              </span>
                        </div>

                        <PropertyCard property={property}/>

                        {/* Action buttons overlay */}
                        <div className="mt-2 flex gap-2">
                            <button
                                onClick={() => onEdit(property)}
                                className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                                Edit
                            </button>
                            <button
                                onClick={() => onToggleAvailability(property._id)}
                                className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-medium py-2 rounded-lg transition-colors border ${
                                    property.available
                                        ? 'bg-white border-orange-300 text-orange-600 hover:bg-orange-50'
                                        : 'bg-white border-green-300 text-green-600 hover:bg-green-50'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                                </svg>
                                {property.available ? 'Mark as let' : 'Mark available'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export  default MyProperties;