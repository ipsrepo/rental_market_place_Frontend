import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyById } from "../services/property.service";
import { getUserFavorites, addFavorite, deleteFavorite } from "../services/favorite.service";
import { sendMessage } from "../services/message.service";
import { SUCCESS, USER } from "../constants/app.constant";
import { getLocalStorage } from "../utils/localStorage";

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [messageData, setMessageData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });
    const [sending, setSending] = useState(false);
    const [messageSent, setMessageSent] = useState(false);

    const userId = getLocalStorage(USER)?._id;
    const user = getLocalStorage(USER);

    // Fetch property details
    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await getPropertyById(id);
                if (res.status === SUCCESS) {
                    setProperty(res.data.doc);

                    // Check if property is in user's favorites
                    if (userId) {
                        const favRes = await getUserFavorites(userId);
                        if (favRes.status === SUCCESS) {
                            const isFav = favRes.data.some(fav => fav.property._id === id);
                            setIsFavorite(isFav);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching property:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id, userId]);

    // Handle favorite toggle
    const handleFavoriteToggle = async () => {
        if (!userId) {
            navigate("/signin");
            return;
        }

        try {
            if (isFavorite) {
                const res = await deleteFavorite(id);
                if (res.status === SUCCESS) {
                    setIsFavorite(false);
                }
            } else {
                const res = await addFavorite(id);
                if (res.status === SUCCESS) {
                    setIsFavorite(true);
                }
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    // Handle message input change
    const handleMessageChange = (e) => {
        const { name, value } = e.target;
        setMessageData(prev => ({ ...prev, [name]: value }));
    };

    // Handle message submit
    const handleSendMessage = async (e) => {
        e.preventDefault();
        setSending(true);

        try {
            const messagePayload = {
                propertyId: id,
                ownerId: property?.owner?._id,
                name: messageData.name,
                email: messageData.email,
                phone: messageData.phone,
                message: messageData.message
            };

            const res = await sendMessage(messagePayload);
            if (res.status === SUCCESS) {
                setMessageSent(true);
                setTimeout(() => {
                    setShowMessageModal(false);
                    setMessageSent(false);
                    setMessageData({ name: "", email: "", phone: "", message: "" });
                }, 2000);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setSending(false);
        }
    };

    // Image slider navigation
    const nextImage = () => {
        if (property?.images?.length) {
            setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
        }
    };

    const prevImage = () => {
        if (property?.images?.length) {
            setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="text-center text-red-600 p-8">
                <p>Property not found</p>
                <button onClick={() => navigate("/")} className="mt-4 bg-primary text-white px-4 py-2 rounded">
                    Go Back Home
                </button>
            </div>
        );
    }

    const allImages = property.images || [property.primaryImage];
    const hasMultipleImages = allImages.length > 1;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="mb-4 flex items-center gap-2 text-gray-600 hover:text-primary transition"
            >
                {/* <ChevronLeftIcon className="h-5 w-5" /> */}
                Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Gallery Section */}
                <div className="space-y-4">
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video">
                        <img
                            src={allImages[currentImageIndex]}
                            alt={property.title}
                            className="w-full h-full object-cover"
                        />

                        {/* Favorite Button */}
                        <button
                            onClick={handleFavoriteToggle}
                            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition"
                        >
                            {isFavorite ? (
                                '❤️'
                            ) : (
                                '🩶'
                            )}
                        </button>

                        {/* Image Navigation Buttons */}
                        {hasMultipleImages && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition"
                                >
                                    <ChevronLeftIcon className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition"
                                >
                                    <ChevronRightIcon className="h-6 w-6" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnail Gallery */}
                    {hasMultipleImages && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {allImages.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                                        currentImageIndex === index ? 'border-primary' : 'border-transparent'
                                    }`}
                                >
                                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Property Info Section */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-accent mb-2">{property.title}</h1>
                        <p className="text-gray-600 flex items-center gap-2">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {property.location}
                        </p>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-primary">€{property.price}</span>
                        <span className="text-gray-600">/{property.pricedisplay}</span>
                    </div>

                    {/* Property Details Grid */}
                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-line">
                        <div>
                            <p className="text-sm text-gray-500">Property Type</p>
                            <p className="font-semibold capitalize">{property.propertytype}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Rental Type</p>
                            <p className="font-semibold capitalize">{property.rentaltype}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Bedrooms</p>
                            <p className="font-semibold">{property.bedrooms}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Bathrooms</p>
                            <p className="font-semibold">{property.bathrooms}</p>
                        </div>
                        {property.isprivatebathroom && (
                            <div>
                                <p className="text-sm text-gray-500">Private Bathroom</p>
                                <p className="font-semibold text-green-600">Yes</p>
                            </div>
                        )}
                        {property.billsincluded && (
                            <div>
                                <p className="text-sm text-gray-500">Bills Included</p>
                                <p className="font-semibold text-green-600">Yes</p>
                            </div>
                        )}
                        {property.furnished && (
                            <div>
                                <p className="text-sm text-gray-500">Furnished</p>
                                <p className="font-semibold">Yes</p>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Description</h3>
                        <p className="text-gray-700 leading-relaxed">{property.shortdescription || property.description}</p>
                    </div>

                    {/* Amenities */}
                    {property.tags && property.tags.length > 0 && (
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Amenities</h3>
                            <div className="flex flex-wrap gap-2">
                                {property.tags.map((tag, index) => (
                                    <span key={index} className="bg-light px-3 py-1 rounded-full text-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Owner Info */}
                    {property.owner && (
                        <div className="bg-light p-4 rounded-lg">
                            <h3 className="text-xl font-semibold mb-2">Hosted by {property.owner.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                {property.ownerrating && (
                                    <div className="flex items-center gap-1">
                                        <span className="text-yellow-500">★</span>
                                        <span>{property.ownerrating.toFixed(1)}</span>
                                    </div>
                                )}
                                {property.berrating && (
                                    <div>BER: {property.berrating}</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Message Button */}
                    <button
                        onClick={() => setShowMessageModal(true)}
                        className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/80 transition flex items-center justify-center gap-2"
                    >
                        {/* <EnvelopeIcon className="h-5 w-5" /> */}
                        Contact Host
                    </button>
                </div>
            </div>

            {/* Message Modal */}
            {showMessageModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-semibold">Send Message to Host</h2>
                            <button
                                onClick={() => setShowMessageModal(false)}
                                className="p-1 hover:bg-gray-100 rounded-full transition"
                            >
                                {/* <XMarkIcon className="h-6 w-6" /> */} X
                            </button>
                        </div>

                        {messageSent ? (
                            <div className="p-8 text-center">
                                <div className="text-green-600 text-5xl mb-4">✓</div>
                                <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                                <p className="text-gray-600">The host will respond to you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSendMessage} className="p-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={messageData.name}
                                        onChange={handleMessageChange}
                                        defaultValue={user?.name}
                                        required
                                        className="w-full px-4 py-2 border border-line rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={messageData.email}
                                        onChange={handleMessageChange}
                                        defaultValue={user?.email}
                                        required
                                        className="w-full px-4 py-2 border border-line rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={messageData.phone}
                                        onChange={handleMessageChange}
                                        className="w-full px-4 py-2 border border-line rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                                    <textarea
                                        name="message"
                                        rows="4"
                                        value={messageData.message}
                                        onChange={handleMessageChange}
                                        placeholder={`Hi, I'm interested in ${property.title}...`}
                                        required
                                        className="w-full px-4 py-2 border border-line rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {sending ? "Sending..." : "Send Message"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyDetails;