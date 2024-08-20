import React, { useState } from "react";
import Setup from "../../components/Setup";

const Interests = () => {
  const [totalList, setTotalList] = useState([{
    items: [
      "aries",
      "taurus",
      "gemini",
      "cancer",
      "leo",
      "virgo",
      "libra",
      "scorpio",
      "sagittarius",
      "capricorn",
      "aquarius",
      "pisces",
    ],
    selectedItems: [
      "aries",
      "taurus",
      "libra",
      "scorpio",
      "aquarius",
      "pisces",
    ],
    multipleSelection: true,
  }]);

  const gggg = [
    {
      title: "Fruits",
      items: ["Apple", "Banana", "Cherry", "Date"],
      selectedItems: ["Apple", "Cherry"],
      multipleSelection: true,
    },
    {
      title: "Vegetables",
      items: ["Carrot", "Broccoli", "Spinach", "Peas"],
      selectedItems: ["Carrot", "Peas"],
      multipleSelection: true,
    },
    {
      title: "Dairy",
      items: ["Milk", "Cheese", "Yogurt", "Butter"],
      selectedItems: ["Milk", "Yogurt"],
      multipleSelection: false,
    },
  ];

  return <Setup title="Interests" ItemList={gggg} subCategory={true} />;
};

export default Interests;
