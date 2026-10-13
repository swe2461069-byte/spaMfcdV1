import { renderNutritionTables } from "../components/nutritionTables.js";

export function bindFoodSearchEvents(allFoods = [], imagesMap = {}) {
  const searchTxt = document.getElementById("searchTxt");
  const searchBtn = document.getElementById("searchBtn");
  const resultsContainer = document.getElementById("searchResults");

  function filterAndRender() {
    if (!resultsContainer) return;

    const query = (searchTxt?.value || "").toLowerCase().trim();

    const selectedNutrientCheckboxes = Array.from(
      document.querySelectorAll('input[name="nutrition"]:checked')
    );
    const selectedKeys = selectedNutrientCheckboxes.map((cb) => cb.value);

    const selectedFoodCheckboxes = Array.from(
      document.querySelectorAll('input[name="foodcode"]:checked')
    );
    const selectedFoodCodes = selectedFoodCheckboxes.map((cb) => cb.value);

    const filteredFoods = allFoods.filter((food) => {
      const matchesName = food.food_name.toLowerCase().includes(query);
      const matchesGroup =
        selectedFoodCodes.length === 0 ||
        selectedFoodCodes.includes(food.food_code);
      return matchesName && matchesGroup;
    });

    resultsContainer.innerHTML = renderNutritionTables(
      filteredFoods,
      selectedKeys,
      imagesMap
    );
  }

  searchBtn?.addEventListener("click", filterAndRender);
  searchTxt?.addEventListener("keyup", (e) => {
    if (e.key === "Enter") filterAndRender();
  });

  document
    .querySelectorAll('input[name="nutrition"], input[name="foodcode"]')
    .forEach((cb) => {
      cb.addEventListener("change", filterAndRender);
    });

  filterAndRender();
}