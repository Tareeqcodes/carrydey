'use client';
import { useState, useEffect } from "react";
import { databases, ID, Query } from "@/config/Appwriteconfig";

export default function page() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await databases.listDocuments(
                "your_database_id",
                "your_collection_id"
            );
            setData(response.documents);
        };
        fetchData();
    }, []);

    return (
        <div>
            {data.map(item => (
                <div key={item.$id}>{item.title}</div>
            ))}
        </div>
    )
}
