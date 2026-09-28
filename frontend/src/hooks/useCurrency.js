import { useEffect, useState } from "react";

const FALLBACK_RATE = 95;

export const useCurrency = () => {
    const [rate, setRate] = useState(FALLBACK_RATE);

    useEffect(() => {
        const getRate = async () => {
            try {
                const response = await fetch(
                    "https://api.frankfurter.dev/v2/rate/usd/inr"
                );

                const data = await response.json();

                if (data.rate) {
                    setRate(data.rate);
                }
            } catch (error) {
                console.log("Using fallback rate:", FALLBACK_RATE);
            }
        };

        getRate();
    }, []);

    const convertToINR = (amount) => {
        return Number(amount || 0) * rate;
    };

    const formatINR = (amount) => {
        return `₹${amount.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
        })}`;
    };

    return {
        rate,
        convertToINR,
        formatINR,
    };
};