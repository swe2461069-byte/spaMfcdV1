import { titleFromKey } from "../fn/format.js";
import { renderTable } from "../layouts/tableLayout.js";

export function renderNutritionTables(foods = [], selectedKeys = [], imagesMap = {}) {
  if (!foods.length) {
    return `<div class="notification is-warning">No food data found.</div>`;
  }

  return selectedKeys
    .map((groupKey) => {
      // images группийн тусгай рендер
      if (groupKey === "images") {
        const columns = [
          { key: "food_name", label: "Food Name" },
          { key: "image_preview", label: "Image" }
        ];

        const rows = foods.map((food) => {
          const imgList = imagesMap[food.food_code] || [];
          const firstImg = imgList[0] || "./img/no-image.png";
          return {
            food_name: food.food_name,
            image_preview: `<img src="${firstImg}" class="food-image-thumb" data-src="${firstImg}" style="width: 50px; cursor: pointer; border-radius: 4px;" alt="thumb" />`
          };
        });

        return renderTable({
          title: "Images",
          columns,
          rows
        });
      }

      const sampleFood = foods[0];
      const groupData = sampleFood?.[groupKey];

      if (!groupData || typeof groupData !== "object") return "";

      const columns = [
        { key: "food_name", label: "Food Name" },
        ...Object.keys(groupData).map((key) => ({
          key,
          label: titleFromKey(key),
        })),
      ];

      const rows = foods.map((food) => {
        const itemData = food[groupKey] || {};
        return {
          food_name: food.food_name,
          ...itemData,
        };
      });

      return renderTable({
        title: titleFromKey(groupKey),
        columns,
        rows,
      });
    })
    .join("");
}