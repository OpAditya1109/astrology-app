import moneyMagnet from "../assets/product/Bracelets/money-magnet.webp";
import roseQuartz from "../assets/product/Bracelets/rose-quartz.webp";
import greenAventurine from "../assets/product/Bracelets/Green-Aventurine.jpg";
import amethyst from "../assets/product/Bracelets/Amethyst-Bracelet.jpg";
import sulemani from "../assets/product/Bracelets/Sulemani-Hakik.avif";
import clearQuartz from "../assets/product/Bracelets/Clear-Quartz.jfif";
import blackTourmaline from "../assets/product/Bracelets/Black-Tourmaline.jpg";
import yellowTigerEye from "../assets/product/Bracelets/Yellow-TigerEye.jpg";

const products = [
  {
    id: "money-magnet",
    name: "Natural Money Magnet Stone Bracelet",
    img: moneyMagnet,
    price: 699,
    oldPrice: 1999,
    offer: "45% + Extra 20% OFF",
    desc: "Attracts wealth, prosperity, and abundance into your life.",
    description:
      "The Money Magnet Bracelet is designed with natural stones that attract prosperity, abundance, and financial stability.",
    crystals: ["Pyrite", "Citrine", "Green Aventurine"],
    benefits: [
      "Attracts wealth and prosperity",
      "Boosts confidence in financial decisions",
      "Improves opportunities for growth",
    ],
    howToWear: "Wear on your left hand for maximum attraction of wealth energy.",
    bestDay: "Friday and Thursday are considered most auspicious.",
  },
  {
    id: "rose-quartz",
    name: "Natural Rose Quartz Bracelet",
    img: roseQuartz,
    price: 599,
    oldPrice: 1299,
    offer: "40% OFF",
    desc: "Stone of love, harmony, and emotional healing.",
    description:
      "Rose Quartz, known as the stone of love, brings harmony in relationships and promotes emotional healing.",
    crystals: ["Rose Quartz"],
    benefits: [
      "Promotes unconditional love",
      "Heals emotional wounds",
      "Restores harmony in relationships",
    ],
    howToWear: "Wear on the left wrist for attracting love and harmony.",
    bestDay: "Friday is the best day to wear Rose Quartz.",
  },
  {
    id: "green-aventurine",
    name: "Green Aventurine Bracelet",
    img: greenAventurine,
    price: 649,
    oldPrice: 1499,
    offer: "50% OFF",
    desc: "Known as the stone of luck and opportunity.",
    description:
      "Green Aventurine is considered the stone of luck, helping to manifest opportunities and attract good fortune.",
    crystals: ["Green Aventurine"],
    benefits: [
      "Brings good luck and prosperity",
      "Enhances creativity and motivation",
      "Helps in making clear decisions",
    ],
    howToWear: "Wear on the left wrist to attract luck and positive opportunities.",
    bestDay: "Wednesday is the most auspicious day.",
  },
  {
    id: "amethyst",
    name: "Natural Amethyst Bracelet",
    img: amethyst,
    price: 749,
    oldPrice: 1499,
    offer: "50% OFF",
    desc: "Promotes peace, calm, and spiritual awareness.",
    description:
      "Amethyst is a calming stone that promotes peace, balances emotions, and enhances spiritual awareness.",
    crystals: ["Amethyst"],
    benefits: [
      "Reduces stress and anxiety",
      "Improves focus during meditation",
      "Promotes restful sleep",
    ],
    howToWear: "Wear on the right hand to enhance calmness and focus.",
    bestDay: "Monday and Saturday are ideal.",
  },
  {
    id: "sulemani-hakik",
    name: "Natural Sulemani Hakik Bracelet",
    img: sulemani,
    price: 599,
    oldPrice: 1299,
    offer: "40% OFF",
    desc: "Protects from negativity and balances energy.",
    description:
      "Sulemani Hakik is a powerful stone that protects from negativity, evil eye, and helps balance inner energy.",
    crystals: ["Sulemani Hakik"],
    benefits: [
      "Shields from negative energies",
      "Balances emotional and physical health",
      "Strengthens intuition",
    ],
    howToWear: "Wear on the left hand to absorb protective energies.",
    bestDay: "Saturday is the most suitable day.",
  },
  {
    id: "clear-quartz",
    name: "Natural Clear Quartz (Spatic) Bracelet",
    img: clearQuartz,
    price: 699,
    oldPrice: 1499,
    offer: "50% OFF",
    desc: "Powerful healing stone, enhances clarity and focus.",
    description:
      "Clear Quartz is known as the 'master healer'. It amplifies energy, enhances clarity, and supports overall healing.",
    crystals: ["Clear Quartz"],
    benefits: [
      "Enhances concentration and focus",
      "Amplifies positive energies",
      "Boosts immunity and healing",
    ],
    howToWear: "Wear daily for mental clarity and healing benefits.",
    bestDay: "Sunday and full moon days.",
  },
  {
    id: "black-tourmaline",
    name: "Natural Black Tourmaline Bracelet",
    img: blackTourmaline,
    price: 799,
    oldPrice: 1599,
    offer: "50% OFF",
    desc: "Strong protection stone against negative energies.",
    description:
      "Black Tourmaline is a powerful grounding stone that provides protection from negative energies and psychic attacks.",
    crystals: ["Black Tourmaline"],
    benefits: [
      "Shields from negative energies",
      "Reduces stress and anxiety",
      "Improves confidence and stability",
    ],
    howToWear: "Wear on the left hand for protection and grounding.",
    bestDay: "Saturday is ideal.",
  },
  {
    id: "yellow-tiger-eye",
    name: "Natural Yellow Tiger Eye Bracelet",
    img: yellowTigerEye,
    price: 699,
    oldPrice: 1499,
    offer: "50% OFF",
    desc: "Boosts confidence, courage, and decision making.",
    description:
      "Tiger Eye is a stone of courage and motivation. It boosts confidence and sharpens decision-making skills.",
    crystals: ["Tiger Eye"],
    benefits: [
      "Enhances courage and confidence",
      "Helps in overcoming fear",
      "Sharpens focus and decision making",
    ],
    howToWear: "Wear on the right hand for courage and confidence.",
    bestDay: "Tuesday and Sunday are auspicious.",
  },
];

export default products;
