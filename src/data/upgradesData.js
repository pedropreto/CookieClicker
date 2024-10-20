import cursorIcon from '../images/cursor_icon.png';  // Adjust path to where the image is located
import grandmaIcon from '../images/grandma_icon.png';
import farmIcon from '../images/farm_icon.png';

export const buildingUpgrades = [
    {
      name: "Double Cursor",
      building: "Cursor",  // Affects only the cursor building
      type: 1,              // Type 1: Single building multiplier
      multiplier: 2,        // Multiplies cursor CpS by 2
      baseCost: 10,
      icon: cursorIcon,
      description: "Doubles the CpS of all cursors.",
      buildingCount: 1, // Can be purchased after owning 1 cursor
      purchasedAt: [],
    },
    {
      name: "Cursor Efficiency",
      building: "Cursor",  // Affects only the cursor building
      type: 1,              // Type 1: Single building multiplier
      multiplier: 5,        // Multiplies cursor CpS by 2
      baseCost: 50,
      icon: cursorIcon,
      description: "Doubles the CpS of cursors again.",
      buildingCount: 1, // Can be purchased after owning 5 cursors
      purchasedAt: [],
    },
    {
        name: "Cursor Max Efficiency",
        building: "Cursor",  // Affects only the cursor building
        type: 1,              // Type 1: Single building multiplier
        multiplier: 10,        // Multiplies cursor CpS by 2
        baseCost: 10000,
        icon: cursorIcon,
        description: "Doubles the CpS of cursors again.",
        buildingCount: 10, // Can be purchased after owning 5 cursors
        purchasedAt: [],
      },
    {
      name: "Grandma Boost",
      building: "Grandma",  // Affects only the grandma building
      type: 1,               // Type 1: Single building multiplier
      multiplier: 2,       // Boosts grandma CpS by 50%.
      baseCost: 3000,
      icon: grandmaIcon,
      description: "Boosts the CpS of all grandmas by 50%.",
      buildingCount: 1, // Can be purchased after owning 3 grandmas
      purchasedAt: [],
    },
    {
      name: "Click Boost",
      building: "Cursor",  // Affects only the grandma building
      type: 2,               // Type 1: Single building multiplier
      multiplier: 1.01,       // Boosts grandma CpS by 50%.
      baseCost: 20,
      icon: cursorIcon,
      description: "Adds 1% of the CpS to the manual click.",
      buildingCount: 1, // Can be purchased after owning 3 grandmas
      purchasedAt: [],
    },
  ];