import {useEffect, useState} from "react";
import PropertyCard from "../components/PropertyCard";
import {getAllProperties} from "../services/property.service";
import {SUCCESS} from "../constants/app.constant.js";

const Home = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // fetch(`/data/fakeData.json`)
        //     .then((response) => {
        //         if (!response.ok) {
        //             throw new Error("Failed to fetch JSON data");
        //         }
        //         return response.json();
        //     })
        //     .then((res) => {
        //         setData(res);
        //         setLoading(false);
        //     })
        //     .catch((error) => console.error("Error loading JSON:", error));

        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getAllProperties();
                if (res.status == SUCCESS) {
                    setData(res.data);
                    setLoading(false);
                }
            } catch (error) {
                setLoading(false);
                console.error(error);
            }
        }

        fetchData();
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
