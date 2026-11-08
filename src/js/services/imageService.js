let imageMap = {};

export async function loadImages() {
  if (Object.keys(imageMap).length > 0) return;
  const response = await fetch("./data/images.json");
  if (!response.ok) {
    throw new Error("Failed to load images.json");
  }
  imageMap = await response.json();
}

export function getImagesByFoodCode(foodCode) {
  return imageMap[foodCode] || [];
}
