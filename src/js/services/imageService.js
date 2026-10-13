let imagesCache = null;

export async function getImages() {
  if (imagesCache) return imagesCache;

  try {
    const response = await fetch("./data/images.json");
    if (!response.ok) return {};
    const data = await response.json();
    imagesCache = data;
    return data;
  } catch (error) {
    console.error("Failed to load images.json:", error);
    return {};
  }
}