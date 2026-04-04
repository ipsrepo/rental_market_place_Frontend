import { useEffect, useMemo, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import { getAllProperties } from "../services/property.service";
import { SUCCESS, USER } from "../constants/app.constant.js";
import { getLocalStorage } from "../utils/localStorage.js";
import { getUserFavorites } from "../services/favorite.service.js";

const Home = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [favoritesLoaded, setFavoritesLoaded] = useState(false);

    const userId = useMemo(() => getLocalStorage(USER)?._id, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const res = await getAllProperties();
                if (res.status == SUCCESS) {
                    let propertiesData = res.data;

                    if (userId && !favoritesLoaded) {
                        const favRes = await getUserFavorites(userId);
                        if (favRes.status == SUCCESS) {
                            const favList = favRes.data.map(fav => fav.property._id);

                            propertiesData = propertiesData.map(item => ({
                                ...item,
                                ismyfavorite: favList.includes(item._id)
                            }));
                            setFavoritesLoaded(true);
                        }
                    } else {
                        propertiesData = propertiesData.map(item => ({
                            ...item,
                            ismyfavorite: false
                        }));
                    }

                    setProperties(propertiesData);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <div className="grid grid-cols-2 gap-4">
                {properties.length > 0 && properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>
        </>
    );
};

export default Home;