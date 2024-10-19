import cursorIcon from '../images/cursor_icon.png';  // Adjust path to where the image is located
import grandmaIcon from '../images/grandma_icon.png';
import farmIcon from '../images/farm_icon.png';

export const buildingUpgrades = [
    {
      name: "Double Cursor",
      building: "Cursor",  // Affects only the cursor building
      type: 1,              // Type 1: Single building multiplier
      multiplier: 2,        // Multiplies cursor CpS by 2
      baseCost: 100,
      icon: cursorIcon,
      description: "Doubles the CpS of all cursors.",
      buildingCount: 1, // Can be purchased after owning 1 cursor
      purchasedAt: [],
    },
    {
      name: "Cursor Efficiency",
      building: "Cursor",  // Affects only the cursor building
      type: 1,              // Type 1: Single building multiplier
      multiplier: 2,        // Multiplies cursor CpS by 2
      baseCost: 500,
      icon: cursorIcon,
      description: "Doubles the CpS of cursors again.",
      buildingCount: 1, // Can be purchased after owning 5 cursors
      purchasedAt: [],
    },
    {
        name: "Cursor Efficiency",
        building: "Cursor",  // Affects only the cursor building
        type: 1,              // Type 1: Single building multiplier
        multiplier: 2,        // Multiplies cursor CpS by 2
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
  ];