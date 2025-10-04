// useCurrency.js
import { useEffect, useState } from "react";

export default function useCurrency(inrPrice) {
  const [currency, setCurrency] = useState("INR");
  const [convertedPrice, setConvertedPrice] = useState(inrPrice);

  useEffect(() => {
    // 🚨 Force test for UAE (remove after testing)
    const forcedCountry = "UAE"; // <--- manually set for testing

    if (forcedCountry === "UAE") {
      setCurrency("AED");
      setConvertedPrice((inrPrice / 22).toFixed(2)); // approx conversion
    } else {
      setCurrency("INR");
      setConvertedPrice(inrPrice);
    }
  }, [inrPrice]);

  return { currency, convertedPrice };
}
