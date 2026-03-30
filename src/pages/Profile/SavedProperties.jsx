import PropertyCard from "../../components/PropertyCard.jsx";

const SavedProperties = ({ properties }) => {
    if (properties.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-accent">No saved properties</h3>
                <p className="text-gray-500 text-sm mt-1">Properties you save will appear here.</p>
            </div>
        );
    }

    return (
        <div>
            <p className="text-sm text-gray-500 mb-4">{properties.length} saved {properties.length === 1 ? 'property' : 'properties'}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {properties.map((property) => (
                    <PropertyCard key={property._id} property={property} />
                ))}
            </div>
        </div>
    );
};

export default SavedProperties;