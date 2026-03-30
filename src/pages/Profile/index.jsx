import {useEffect, useState} from 'react';
import Profile from "./Profile.jsx";
import SavedProperties from "./SavedProperties.jsx";
import MyProperties from "./MyProperties.jsx";
import {getLocalStorage} from "../../utils/localStorage.js";
import {SUCCESS, USER} from "../../constants/app.constant.js";
import {useSearchParams} from "react-router-dom";
import {getUserFavorites} from "../../services/favorite.service.js";


const TABS = [
    {key: 'profile', label: 'Profile'},
    {key: 'saved', label: 'Saved Properties'},
    {key: 'listings', label: 'My Properties'},
];

const ProfilePage = () => {
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(
        searchParams.get('tab') || 'profile'
    );
    const [savedProperties, setSavedProperties] = useState([]);
    const [myProperties, setMyProperties] = useState([]);
    const userDetails = getLocalStorage(USER);

    useEffect(() => {

        const fetchSaved = async () => {
            try {
                const res = await getUserFavorites(userDetails?._id);
                if(res.status === SUCCESS) {
                    setSavedProperties(res.data);
                }
            } catch (e) {
                console.error(e);
            }
        }

        fetchSaved()
    })

    const handleDeleteAccount = () => {
        alert('Account deleted (wire up your API call here)');
    };

    const handleEdit = (property) => {
        alert(`Edit property: ${property.title}\n(wire up your edit modal/page here)`);
    };

    const handleToggleAvailability = (id) => {
        setMyProperties((prev) =>
            prev.map((p) => p._id === id ? {...p, available: !p.available} : p)
        );
    };

    const tabCounts = {
        saved: savedProperties.length,
        listings: myProperties.length,
    };

    return (
        <div className="bg-bg w-3/4 max-w-[1280px] p-8">
            <div className="">

                <h1 className="text-2xl font-bold text-accent mb-6">My Account</h1>

                <div className="flex gap-1 justify-center bg-gray-200 p-1 rounded-xl mb-8 w-fit">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                                activeTab === tab.key
                                    ? 'bg-white text-accent shadow-sm'
                                    : 'opacity-75 hover:opacity-100'
                            }`}
                        >
                            {tab.label}
                            {tabCounts[tab.key] > 0 && (
                                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                                    activeTab === tab.key
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-300 text-gray-600'
                                }`}>
                  {tabCounts[tab.key]}
                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                {activeTab === 'profile' && (
                    <Profile user={userDetails} onDeleteAccount={handleDeleteAccount}/>
                )}
                {activeTab === 'saved' && (
                    <SavedProperties properties={savedProperties}/>
                )}
                {activeTab === 'listings' && (
                    <MyProperties
                        properties={myProperties}
                        onEdit={handleEdit}
                        onToggleAvailability={handleToggleAvailability}
                    />
                )}

            </div>
        </div>
    );
};

export default ProfilePage;