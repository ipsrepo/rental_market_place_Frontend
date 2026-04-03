import {useState} from 'react';
import {LocationIcon, HeartIcon} from '../assets/icons';
import {formatEURO} from "../utils/currency";
import {formatDate} from "../utils/date.js";
import {addFavorite, deleteFavorite} from "../services/favorite.service.js";
import {getLocalStorage} from "../utils/localStorage.js";
import {SUCCESS, USER} from "../constants/app.constant.js";

const PropertyCard = ({property}) => {
    const {
        title,
        location,
        price,
        pricedisplay,
        propertytype,
        rentaltype,
        bedrooms,
        bathrooms,
        isprivatebathroom,
        issharedbed,
        primaryimage,
        ismyfavorite,
        isnew,
        availablefrom,
        billsincluded,
        ownerrating,
        berrating,
        tags,
        _id
    } = property;


    const [isFavorite, setIsFavorite] = useState(ismyfavorite);
    const user = getLocalStorage(USER);

    const toggleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const formatData = {
            property: _id,
            user: user?._id
        };


        try {

            let res;
            if (!isFavorite) {
                res = await addFavorite(formatData)
            } else {
                res = await deleteFavorite(formatData)
            }

            if (res.status == SUCCESS) {
                setIsFavorite(!isFavorite);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const formattedPrice = formatEURO(price);

    return (
        <div
            className="bg-white cursor-pointer rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 relative">
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={primaryimage}
                    alt={title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />

                {/* Favorite Button */}
                <button
                    onClick={toggleFavorite}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full cursor-pointer  hover:bg-gray-100 transition"
                >
                    {isFavorite ? "❤️" : '🩶'}
                </button>

                {/* New Badge */}
                {isnew && (
                    <span
                        className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                        NEW
                    </span>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4">
                {/* Title and Location */}
                <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
                <p className=" mt-1 flex items-center">
                    <LocationIcon/>
                    {location}
                </p>

                {/* Price */}
                <div className="mt-3 flex items-baseline">
                    <span className="text-2xl font-bold text-primary">{formattedPrice}</span>
                    <span className="text-sm  ml-1">/{pricedisplay}</span>
                </div>

                {/* Property Type & Rental Type */}
                <div className="mt-2 flex flex-wrap gap-2">
                    <span className="bg-light text-xs font-medium px-2 py-1 rounded">
                        {propertytype}
                    </span>
                    <span className="bg-light text-xs font-medium px-2 py-1 rounded">
                        {rentaltype}
                    </span>
                    {billsincluded && (
                        <span className="bg-green-100 text-primary text-xs font-medium px-2 py-1 rounded">
                            Bills included
                        </span>
                    )}
                </div>

                {/* Room Details */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-700">
                    <div className="flex items-center">
                        <svg className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                        </svg>
                        <span>{bedrooms} {bedrooms === 1 ? 'bed' : 'beds'}</span>
                    </div>
                    <div className="flex items-center">
                        <svg className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                        </svg>
                        <span>{bathrooms} {bathrooms === 1 ? 'bath' : 'baths'}</span>
                    </div>
                    {isprivatebathroom && (
                        <div className="flex items-center col-span-2 text-xs text-primary">
                            ✓ Private bathroom
                        </div>
                    )}
                    {issharedbed && (
                        <div className="flex items-center col-span-2 text-xs text-orange-600">
                            ⚡ Shared bed
                        </div>
                    )}
                </div>

                {/* Tags */}
                {tags && tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                        {tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="bg-gray-100 text-xs text-gray-600 px-2 py-1 rounded">
                                {tag}
                            </span>
                        ))}
                        {tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{tags.length - 3}</span>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                    <div className="flex items-center">
                        <svg className="h-4 w-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <span>{ownerrating?.toFixed(1) || 'No Rating'}</span>
                    </div>
                    <div className="flex items-center">
                        <svg className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <span>Available {formatDate(availablefrom) ?? 'Immediately'}</span>
                    </div>
                    {berrating && (
                        <div className="flex items-center">
                            <span className="bg-gray-200 text-xs font-bold px-1.5 py-0.5 rounded">BER {berrating}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;