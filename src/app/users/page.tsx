'use client'

import { useEffect, useState } from "react";

export default function User() {
    const [total, setTotal] = useState(0)

    const count = () => {
        setTotal(total+100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000)
    }

    useEffect(() => {
        count()
    }, [])
    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <h1>{total}</h1>
            <button onClick={count} className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                Click Button
            </button>        
        </div>
    );
}