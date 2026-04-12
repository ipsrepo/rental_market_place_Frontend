import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {getPropertyById} from "../services/property.service";
import {addFavorite, deleteFavorite, getUserFavorites} from "../services/favorite.service";
import {sendMail} from "../services/mail.service.js";
import {BerColor, SUCCESS, USER} from "../constants/app.constant";
import {getLocalStorage} from "../utils/localStorage";
import {getUser} from "../services/user.service.js";
import Modal from "../components/Modal.jsx";

const Icon = ({d, className = "w-5 h-5", filled = false}) => (
    <svg className={className} fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24"
         stroke={filled ? "none" : "currentColor"} strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d={d}/>
    </svg>
);

const Icons = {
    back: "M15 19l-7-7 7-7",
    location: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
    bed: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    bath: "M4 4a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm0 8h16v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4z",
    calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    tag: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
    check: "M5 13l4 4L19 7",
    star: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
    mail: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    close: "M6 18L18 6M6 6l12 12",
    chevLeft: "M15 19l-7-7 7-7",
    chevRight: "M9 5l7 7-7 7",
    heart: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    home: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    bolt: "M13 10V3L4 14h7v7l9-11h-7z",
    user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    phone: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    furniture: "M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zm-9 8H5v-2h6v2zm8 0h-6v-2h6v2zM4 7V5a2 2 0 012-2h12a2 2 0 012 2v2H4z",
    bill: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z",
    share: "M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13",
    ber: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
};

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
}) : 'Immediately';
const capitalize = (s) => s ? s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '';

// ── Badge ─────────────────────────────────────────────────────────────────────
const Badge = ({children, green}) => (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
        green ? 'bg-[#62be6320] text-[#3a7a3b]' : 'bg-bg text-text border border-border'
    }`}>
        {children}
    </span>
);

// ── Detail row ────────────────────────────────────────────────────────────────
const DetailRow = ({icon, label, value, highlight}) => (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
        <div
            className="w-8 h-8 rounded-lg bg-bg flex items-center justify-center flex-shrink-0 text-primary">
            <Icon d={Icons[icon]} className="w-4 h-4"/>
        </div>
        <div className="flex-1">
            <p className="text-xs text-text opacity-70">{label}</p>
            <p className={`text-sm font-semibold mt-0.5 ${highlight ? 'text-primary' : 'text-accent'}`}>{value}</p>
        </div>
    </div>
);

// ══════════════════════════════════════════════════════════════════════════════
const PropertyDetails = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [sending, setSending] = useState(false);
    const [messageSent, setMessageSent] = useState(false);
    const [messageData, setMessageData] = useState({name: '', email: '', mobile: '', message: ''});
    const [owner, setOwner] = useState({})

    const user = getLocalStorage(USER);
    const userId = user?._id;

    useEffect(() => {
        setMessageData({
            name: user?.name,
            email: user?.email,
            mobile: user?.mobile,
            message: `Hi, I'm interested in ${property?.title ?? ''}`
        })
    }, []);

    useEffect(() => {
        const fetchOwner = async () => {
            try {
                const res = await getUser(property.owner);
                if (res.status == SUCCESS) {
                    setOwner(res?.data?.doc);
                }
            } catch (error) {
                console.error(error);
            }
        }

        if (property?.owner) fetchOwner()
    }, [property]);

    const handleContactHost = () => {
        if(!userId){
            navigate('/login')
        } else {
            setShowModal(true);
        }
    }

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await getPropertyById(id);
                if (res.status === SUCCESS) {
                    setProperty(res.data.doc);
                    if (userId) {
                        const favRes = await getUserFavorites(userId);
                        if (favRes.status === SUCCESS) {
                            setIsFavorite(favRes.data.some(f => f.property._id === id));
                        }
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id, userId]);

    const handleFavoriteToggle = async () => {
        if (!userId) {
            navigate('/login');
            return;
        }
        try {

            const formatData = {
                property: property._id,
                user: userId
            };

            if (isFavorite) {
                const res = await deleteFavorite(formatData);
                if (res.status == SUCCESS) setIsFavorite(false);
            } else {
                const res = await addFavorite(formatData);
                if (res.status == SUCCESS) setIsFavorite(true);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            const res = await sendMail(property._id, messageData);
            if (res.status == SUCCESS) {
                setMessageSent(true);
                setTimeout(() => {
                    setShowModal(false);
                    setMessageSent(false);
                    setMessageData({name: '', email: '', mobile: '', message: ''});
                }, 2500);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSending(false);
        }
    };

    const allImages = property ? [property.primaryimage, ...(property.images || [])].filter(Boolean) : [];
    const hasMultiple = allImages.length > 1;

    const nextImage = () => setCurrentImageIndex(p => (p + 1) % allImages.length);
    const prevImage = () => setCurrentImageIndex(p => (p - 1 + allImages.length) % allImages.length);

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) return (
        <div className="flex justify-center items-center h-96">
            <div className="w-12 h-12 rounded-full border-4 border-bg border-t-primary animate-spin"/>
        </div>
    );

    if (!property) return (
        <div className="text-center p-16">
            <p className="text-red font-medium mb-4">Property not found</p>
            <button onClick={() => navigate('/')} className="bg-primary text-white px-6 py-2 rounded-lg">Go Home
            </button>
        </div>
    );

    document.title = property.title || 'Rental Market Place';

    return (
        <div className="bg-bg w-3/4 max-w-[1280px] p-4">
            <div className="max-w-6xl mx-auto px-4 py-8">

                {/* ── Back bar ─────────────────────────────────────────────── */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-text hover:text-primary transition-colors text-sm font-medium cursor-pointer"
                >
                    <Icon d={Icons.back} className="w-4 h-4"/> Back to listings
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                    {/* ── LEFT COLUMN (images + description) ───────────────── */}
                    <div className="lg:col-span-3 space-y-5">

                        {/* Main image */}
                        <div
                            className="relative bg-accent rounded-2xl overflow-hidden aspect-[16/10] shadow-[0_8px_20px_8px_#21223308]">
                            <img
                                src={allImages[currentImageIndex]}
                                alt={property.title}
                                className="w-full h-full object-cover"
                            />

                            {/* New badge */}
                            {property.isnew && (
                                <span
                                    className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                                    NEW
                                </span>
                            )}

                            {/* Image counter */}
                            {hasMultiple && (
                                <div
                                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                                    {currentImageIndex + 1} / {allImages.length}
                                </div>
                            )}

                            {/* Nav buttons */}
                            {hasMultiple && (
                                <>
                                    <button onClick={prevImage}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/85 rounded-full flex cursor-pointer items-center justify-center hover:bg-white transition">
                                        <Icon d={Icons.chevLeft} className="w-4 h-4 text-accent"/>
                                    </button>
                                    <button onClick={nextImage}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/85 rounded-full flex cursor-pointer items-center justify-center hover:bg-white transition">
                                        <Icon d={Icons.chevRight} className="w-4 h-4 text-accent"/>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {hasMultiple && (
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {allImages.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentImageIndex(i)}
                                        className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                                            i === currentImageIndex ? 'border-primary scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover"/>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Description */}
                        <div className="bg-white rounded-2xl p-6 shadow-[0_8px_20px_8px_#21223308]">
                            <h2 className="text-lg font-bold text-accent mb-3 flex items-center gap-2">
                                <Icon d={Icons.info} className="w-5 h-5 text-primary"/>
                                About this property
                            </h2>
                            <p className="text-text text-sm leading-relaxed">{property.details}</p>
                        </div>

                        {/* Tags */}
                        {property.tags && property.tags.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 shadow-[0_8px_20px_8px_#21223308]">
                                <h2 className="text-lg font-bold text-accent mb-3 flex items-center gap-2">
                                    <Icon d={Icons.tag} className="w-5 h-5 text-primary"/>
                                    Amenities & features
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {property.tags.map((tag, i) => (
                                        <Badge key={i}>{tag}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT COLUMN (info + contact) ────────────────────── */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* Title & Price card */}
                        <div className="bg-white rounded-2xl p-6 shadow-[0_8px_20px_8px_#21223308]">
                            <div className="flex flex-wrap gap-2 mb-3">
                                <Badge>{capitalize(property.propertytype)}</Badge>
                                <Badge>{capitalize(property.rentaltype)}</Badge>
                                {property.available && <Badge green>Available</Badge>}
                            </div>

                            <h1 className="text-xl font-bold text-accent leading-snug mb-3">{property.title}</h1>

                            <p className="text-text text-sm flex items-center gap-1.5 mb-4">
                                <Icon d={Icons.location} className="w-4 h-4 text-primary flex-shrink-0"/>
                                {property.location}
                            </p>

                            <div className="flex items-baseline gap-1 pb-4 border-b border-border">
                                <span
                                    className="text-4xl font-bold text-primary">€{property.price?.toLocaleString('en-IE')}</span>
                                <span className="text-sm text-text">/ {property.pricedisplay}</span>
                            </div>

                            {/* Quick stats row */}
                            <div className="grid grid-cols-3 gap-3 pt-4">
                                {[
                                    {icon: 'bed', val: property.bedrooms, label: 'Beds'},
                                    {icon: 'bath', val: property.bathrooms, label: 'Baths'},
                                    {icon: 'ber', val: property.berrating?.toUpperCase() || '—', label: 'BER'},
                                ].map(({icon, val, label}) => (
                                    <div key={label} className="bg-bg rounded-xl p-3 text-center">
                                        <Icon d={Icons[icon]} className="w-4 h-4 text-primary mx-auto mb-1"/>
                                        <p className="text-base font-bold text-accent">{val}</p>
                                        <p className="text-xs text-text opacity-70">{label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Property details card */}
                        <div className="bg-white rounded-2xl p-6 shadow-[0_8px_20px_8px_#21223308]">
                            <h2 className="text-base font-bold text-accent mb-2">Property details</h2>

                            <DetailRow icon="calendar" label="Available from"
                                       value={formatDate(property.availablefrom)}/>
                            <DetailRow icon="home" label="Property type" value={capitalize(property.propertytype)}/>
                            <DetailRow icon="share" label="Rental type" value={capitalize(property.rentaltype)}/>
                            {property.isprivatebathroom && (
                                <DetailRow icon="check" label="Private bathroom" value="Yes" highlight/>
                            )}
                            {property.issharedbed && (
                                <DetailRow icon="info" label="Shared bed" value="Yes"/>
                            )}
                            {property.billsincluded && (
                                <DetailRow icon="bill" label="Bills" value="Included" highlight/>
                            )}
                            {property.furnished && (
                                <DetailRow icon="furniture" label="Furnished" value="Yes" highlight/>
                            )}
                            {property.berrating && (
                                <div className="flex items-start gap-3 py-3">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                         style={{background: BerColor[property.berrating] + '20'}}>
                                        <Icon d={Icons.ber} className="w-4 h-4"/>
                                    </div>
                                    <div>
                                        <p className="text-xs text-text opacity-70">BER Rating</p>
                                        <span
                                            className="text-xs font-bold px-2 py-0.5 rounded text-white mt-0.5 inline-block"
                                            style={{background: BerColor[property.berrating] || '#888'}}>
                                            {property.berrating?.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Owner card */}
                        {owner && (
                            <div className="bg-white rounded-2xl p-6 shadow-[0_8px_20px_8px_#21223308]">
                                <h2 className="text-base font-bold text-accent mb-4 flex items-center gap-2">
                                    <Icon d={Icons.user} className="w-4 h-4 text-primary"/>
                                    Hosted by
                                </h2>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-12 h-12 rounded-full bg-[#62be6320] flex items-center justify-center text-primary text-lg font-bold flex-shrink-0">
                                        {owner.name?.[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-accent">{owner.name}</p>
                                        {property.ownerrating && (
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <Icon d={Icons.star} className="w-3.5 h-3.5 text-yellow-400" filled/>
                                                <span
                                                    className="text-xs text-text">{property.ownerrating.toFixed(1)} rating</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Contact button */}
                        <button
                            onClick={handleContactHost}
                            className="w-full bg-primary hover:opacity-90 cursor-pointer text-white font-semibold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-[0_8px_20px_8px_#21223308]"
                        >
                            <Icon d={Icons.mail} className="w-5 h-5"/>
                            Contact Host
                        </button>

                        {/* Favourite button */}
                        <button
                            onClick={handleFavoriteToggle}
                            className={`w-full font-semibold py-3 px-6 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2 border-2 ${
                                isFavorite
                                    ? 'border-red text-red hover:bg-red-50'
                                    : 'border-border text-text hover:border-primary hover:text-primary'
                            }`}
                        >
                            <Icon d={Icons.heart} className="w-5 h-5" filled={isFavorite}/>
                            {isFavorite ? 'Saved to favourites' : 'Save to favourites'}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Message Modal ─────────────────────────────────────────────── */}
            {showModal && (
                <Modal show={showModal} onClose={() => setShowModal(false)}>


                    {/* Modal header */}
                    <div className="flex justify-between items-center pb-5 border-b border-border">
                        <div>
                            <h2 className="text-lg font-bold text-accent">Send message to host</h2>
                            <p className="text-xs text-text mt-0.5 opacity-70">{property.title}</p>
                        </div>
                        <button
                            onClick={() => setShowModal(false)}
                            className="w-8 h-8 rounded-full cursor-pointer bg-bg flex items-center justify-center hover:bg-gray-200 transition"
                        >
                            <Icon d={Icons.close} className="w-4 h-4 text-accent"/>
                        </button>
                    </div>

                    {messageSent ? (
                        <div className="p-10 text-center">
                            <div
                                className="w-16 h-16 bg-[#62be6320] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Icon d={Icons.check} className="w-8 h-8 text-primary"/>
                            </div>
                            <h3 className="text-xl font-bold text-accent mb-2">Message Sent!</h3>
                            <p className="text-text text-sm">The host will respond to you shortly.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSendMessage} className="p-5 space-y-4">

                            {[
                                {
                                    label: 'Your name',
                                    name: 'name',
                                    type: 'text',
                                    icon: 'user',
                                    required: true,
                                    placeholder: 'John Murphy',
                                    default: user?.name
                                },
                                {
                                    label: 'Email',
                                    name: 'email',
                                    type: 'email',
                                    icon: 'mail',
                                    required: true,
                                    placeholder: 'john@example.com',
                                    default: user?.email
                                },
                                {
                                    label: 'mobile',
                                    name: 'mobile',
                                    type: 'tel',
                                    icon: 'mobile',
                                    required: false,
                                    placeholder: '+353 87 123 4567',
                                    default: user?.mobile
                                },
                            ].map(({label, name, type, required, placeholder, default: def}) => (
                                <div key={name}>
                                    <label className="block text-sm font-medium text-accent mb-1.5">
                                        {label} {required && <span className="text-red">*</span>}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={type}
                                            name={name}
                                            required={required}
                                            defaultValue={def}
                                            placeholder={placeholder}
                                            value={messageData[name]}
                                            onChange={(e) => setMessageData(p => ({...p, [name]: e.target.value}))}
                                            className="w-full pl-9 pr-3.5 py-2.5 border border-border rounded-lg text-sm text-accent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                        />
                                    </div>
                                </div>
                            ))}

                            <div>
                                <label className="block text-sm font-medium text-accent mb-1.5">
                                    Message <span className="text-red">*</span>
                                </label>
                                <textarea
                                    name="message"
                                    rows={4}
                                    required
                                    placeholder={`Hi, I'm interested in "${property.title}"...`}
                                    value={messageData.message}
                                    onChange={(e) => setMessageData(p => ({...p, message: e.target.value}))}
                                    className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm text-accent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full bg-primary cursor-pointer hover:bg-primary disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                {sending ? (
                                    <>
                                        <div
                                            className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Icon d={Icons.mail} className="w-4 h-4"/>
                                        Send message
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </Modal>
            )}
        </div>
    );
};

export default PropertyDetails;