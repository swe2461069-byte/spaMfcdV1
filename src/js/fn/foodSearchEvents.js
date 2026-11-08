import { renderNotification } from "../layouts/notificationLayout.js";
import { renderNutritionTables } from "../components/nutritionTables.js";
import { nutritionGroups } from "../components/searchSettingsSidebar.js";
import { getLocalizedValue, t } from "../i18n/i18n.js";

export function buildFoodGroups(data) {
  const grouped = new Map();
  for (const item of data) {
    const groupKey = item.food_group?.en || "Other";
    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, {
        groupName: item.food_group,
        items: new Map(),
      });
    }
    const groupData = grouped.get(groupKey);
    groupData.items.set(item.food_code, {
      food_code: item.food_code,
      food_name: item.food_name,
    });
  }
  return Array.from(grouped.values()).map((group) => ({
    groupName: group.groupName,
    items: Array.from(group.items.values()).sort((a, b) => getLocalizedValue(a.food_name).localeCompare(getLocalizedValue(b.food_name))),
  }));
}

let nutritionData = [];
export function initNutritionData(data) {
  nutritionData = data;
}

const DEFAULT_TYPES = nutritionGroups
  .flatMap((group) => group.items)
  .filter((item) => item.checked)
  .map((item) => item.value);
const DEFAULT_ITEM_COUNT = 3;

export function bindSearchEvents() {
  const searchRoot = document;
  const searchBtn = document.getElementById("searchBtn");
  const searchTxt = document.getElementById("searchTxt");
  if (!searchRoot) return;

  searchBtn?.addEventListener("click", handleTextSearch);
  searchTxt?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleTextSearch();
    }
  });

  searchRoot.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.matches('input[name="foodcode"]')) {
      handleFoodCodeSearch();
      return;
    }
    if (target.matches('input[name="nutrition"]')) {
      rerenderCurrentSelection();
    }
  });
}

function handleTextSearch() {
  clearCheckedFoodCodes();
  const keyword = getSearchKeyword();
  if (!keyword) {
    setResultHtml(renderNotification(t("notification.enterFoodName")));
    return;
  }
  renderCurrentResults();
}

function handleFoodCodeSearch() {
  const searchTxt = document.getElementById("searchTxt");
  if (searchTxt) searchTxt.value = "";
  const selectedCodes = getSelectedFoodCodes();
  if (!selectedCodes.length) {
    setResultHtml(renderDefaultTables(nutritionData));
    return;
  }
  renderCurrentResults();
}

function rerenderCurrentSelection() {
  renderCurrentResults();
}

function renderCurrentResults() {
  const matched = getMatchedItems();
  const selectedTypes = getSelectedNutritionTypes();
  setResultHtml(renderNutritionTables(matched, selectedTypes));
}

function getMatchedItems() {
  const selectedCodes = getSelectedFoodCodes();
  const keyword = getSearchKeyword();
  if (selectedCodes.length) {
    return nutritionData.filter((item) => selectedCodes.includes(item.food_code));
  }
  if (keyword) {
    if (keyword.length < 2) return [];
    return nutritionData.filter((item) => {
      const foodName = getLocalizedValue(item.food_name).toLowerCase();
      const words = foodName.split(/\s+/);
      return words.some((word) => word.startsWith(keyword));
    });
  }
  return nutritionData.slice(0, DEFAULT_ITEM_COUNT);
}

function getSearchKeyword() {
  return document.getElementById("searchTxt")?.value.trim().toLowerCase() || "";
}

function getSelectedFoodCodes() {
  return Array.from(document.querySelectorAll('input[name="foodcode"]:checked')).map((checkbox) => checkbox.value);
}

function getSelectedNutritionTypes() {
  return Array.from(document.querySelectorAll('input[name="nutrition"]:checked')).map((checkbox) => checkbox.value);
}

function clearCheckedFoodCodes() {
  document.querySelectorAll('input[name="foodcode"]:checked').forEach((checkbox) => {
    checkbox.checked = false;
  });
}

function setResultHtml(html) {
  const resultTbl = document.getElementById("resultTbl");
  if (resultTbl) {
    resultTbl.innerHTML = html;
  }
}

export function renderDefaultTables(data) {
  const defaultItems = data.slice(0, DEFAULT_ITEM_COUNT);
  return renderNutritionTables(defaultItems, DEFAULT_TYPES);
}
