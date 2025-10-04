import { useEffect, useState } from "react";
import axios from "axios";

export default function useCurrency() {
  const [currency, setCurrency] = useState("INR");
  const [rate, setRate] = useState(1);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { data } = await axios.get("https://ipapi.co/json/");
        if (data.country_code === "AE") {
          // 🇦🇪 UAE users → convert INR to AED and double for shipping
          const conversionRate = 0.044; // ₹1 = ~0.044 AED
          setCurrency("AED");
          setRate(conversionRate * 2); // ✅ double for shipping
        } else {
          // 🇮🇳 India or others → keep INR
          setCurrency("INR");
          setRate(1);
        }
      } catch (error) {
        console.log("Currency detection failed:", error);
      }
    };

    fetchLocation();
  }, []);

  return { currency, rate };
}
