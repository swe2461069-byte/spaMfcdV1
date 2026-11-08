import { getNutritions } from "../services/nutritionService.js";
import { buildFoodGroups, bindSearchEvents, renderDefaultTables, initNutritionData } from "../fn/foodSearchEvents.js";
import { renderSidebarPageLayout } from "../layouts/sidebarPageLayout.js";
import { bindSidebar, bindMenuListToggle } from "../fn/sidebarEvents.js";
import { renderPageLayout } from "../layouts/pageLayout.js";
import { renderNotification } from "../layouts/notificationLayout.js";
import { renderSearchFoodName } from "../components/searchFoodNameSidebar.js";
import { renderSearchSettings } from "../components/searchSettingsSidebar.js";
import { renderFoodGroupList } from "../components/searchFoodGroupListSidebar.js";
import { loadImages } from "../services/imageService.js";
import { renderImageModal, bindImageModalEvents } from "../components/imageModal.js";
import { t } from "../i18n/i18n.js";

let imageModalBound = false;

export async function renderSearchPage() {
  const app = document.getElementById("app");
  app.innerHTML = renderPageLayout({
    content: renderNotification(t("notification.loadingData")),
  });
  try {
    const nutritionData = await getNutritions();
    await loadImages();
    initNutritionData(nutritionData);
    const groupedFoods = buildFoodGroups(nutritionData);
    app.innerHTML =
      renderSidebarPageLayout({
        sidebarContent: `${renderSearchFoodName()} ${renderSearchSettings()} ${renderFoodGroupList(groupedFoods)}`,
        pageId: "search",
        pageTitle: t("searchPage.title"),
        mainContent: `
      <div id="resultTbl">
        ${renderDefaultTables(nutritionData)}
      </div>
    `,
      }) + renderImageModal();

    bindSidebar();
    bindMenuListToggle();
    bindSearchEvents();
    if (!imageModalBound) {
      bindImageModalEvents();
      imageModalBound = true;
    }
  } catch (error) {
    app.innerHTML = renderPageLayout({
      content: renderNotification(t("notification.failedToLoadNutritionData"), "danger"),
    });
    console.error("Failed to load nutrition data:", error);
  }
}
