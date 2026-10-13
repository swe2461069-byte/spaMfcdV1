import { getNutritions } from "../services/nutritionService.js";
import { getImages } from "../services/imageService.js";
import { renderSidebarPageLayout } from "../layouts/sidebarPageLayout.js";
import { renderSearchFoodName } from "../components/searchFoodNameSidebar.js";
import { renderSearchSettings } from "../components/searchSettingsSidebar.js";
import { renderFoodGroupList } from "../components/searchFoodGroupListSidebar.js";
import { renderImageModal, bindImageModalEvents } from "../components/imageModal.js";
import { bindSidebar, bindMenuListToggle } from "../fn/sidebarEvents.js";
import { bindFoodSearchEvents } from "../fn/foodSearchEvents.js";

export async function renderSearchPage() {
  const app = document.getElementById("app");
  app.innerHTML = `<div class="p-4">Loading Search Page...</div>`;

  try {
    const [nutritions, imagesMap] = await Promise.all([
      getNutritions(),
      getImages()
    ]);

    const groupMap = {};
    nutritions.forEach((item) => {
      const groupName = item.food_group || "Other";
      if (!groupMap[groupName]) {
        groupMap[groupName] = [];
      }
      groupMap[groupName].push(item);
    });

    const foodGroups = Object.keys(groupMap).map((groupName) => ({
      groupName,
      items: groupMap[groupName],
    }));

    const sidebarContent = `
      ${renderSearchFoodName()}
      ${renderSearchSettings()}
      ${renderFoodGroupList(foodGroups)}
    `;

    const mainContent = `
      <div id="searchResults"></div>
      ${renderImageModal()}
    `;

    app.innerHTML = renderSidebarPageLayout({
      pageId: "search-page",
      pageTitle: "Food Search Engine",
      sidebarContent,
      mainContent,
    });

    bindSidebar();
    bindMenuListToggle();
    bindFoodSearchEvents(nutritions, imagesMap);
    bindImageModalEvents();
  } catch (error) {
    console.error(error);
    app.innerHTML = `<div class="notification is-danger">Error loading data.</div>`;
  }
}