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
          setCurrency("AED");
          setRate(0.044); // ₹1 = ~0.044 AED
        } else {
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
