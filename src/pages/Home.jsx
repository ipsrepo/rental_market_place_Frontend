import {useEffect, useState} from "react";
import PropertyCard from "../components/PropertyCard.jsx";

const Home = () => {

    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/data/fakeData.json`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch JSON data");
                }
                return response.json();
            })
            .then((res) => {
                setData(res);
                setLoading(false);
            })
            .catch((error) => console.error("Error loading JSON:", error));
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <div className="grid grid-cols-2 gap-4">
                {data.length > 0 && data.map((property) => (<PropertyCard key={property.id} property={property}/>))}
            </div>

        </>
    );
};

export default Home;
