import PropertyCard from "../../components/PropertyCard.jsx";
import {Link, useNavigate} from "react-router-dom";
import Modal from "../../components/Modal.jsx";
import {useState} from "react";

const MyProperties = ({properties, deleteProperty, closeModal}) => {
    const navigate = useNavigate();
    const [deleteId, setDeleteId] = useState(null);
    const [showModel, setShowModel] = useState(closeModal)


    const handleEdit = (property) => {
        navigate('/addProperty', {state: {property}});
    };

    const addNewListing = () => {
        navigate('/addProperty', {state: {}});
    };

    const handleDeleteProperty = (property_id) => {
        setDeleteId(property_id);
        setShowModel(true);
    }

    const initiateDeleteProperty = () => {
        deleteProperty(deleteId);
        setShowModel(false);
    }


    if (properties.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div
                    className="w-16 h-16 rounded-full bg-bg flex items-center justify-center mb-4 border border-border">
                    <svg className="w-8 h-8 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-accent">No listings yet</h3>
                <p className="text-text text-sm mt-1">Properties you post will appear here.</p>
                <button onClick={addNewListing}
                        className="mt-4 bg-primary text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
                    Post a property
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-text">
                    {properties.length} {properties.length === 1 ? 'listing' : 'listings'}
                </p>
                <button onClick={addNewListing}
                        className="bg-primary cursor-pointer text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                    </svg>
                    Add listing
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {properties.map((property) => (
                    <div key={property._id} className="relative group">
                        <PropertyCard property={property}/>

                        <div className="mt-2 flex gap-2">
                            {/* Edit → navigates to /addProperty with property state */}
                            <button
                                onClick={() => handleEdit(property)}
                                className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-border text-text text-sm font-medium py-2 rounded-lg hover:bg-bg transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                                Edit
                            </button>

                            {/* Delete */}
                            <button
                                onClick={() => handleDeleteProperty(property._id)}
                                className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium py-2 rounded-lg transition-colors border border-red text-red hover:bg-red/5"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/*Delete Modal*/}
            <Modal show={showModel} onClose={() => setShowModel(false)}>
                <div className="p-6">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-accent">Delete this property?</h3>
                    <p className="text-sm text-gray-600 mt-2">
                        This will permanently remove the listing and all associated data. This action cannot be undone.
                    </p>
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={() => setShowModel(false)}
                            className="flex-1 py-2 border border-border rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={()=> initiateDeleteProperty()}
                            className="flex-1 py-2 bg-red text-white rounded-lg text-sm font-medium hover:bg-red transition-colors"
                        >
                            Yes, delete
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default MyProperties;