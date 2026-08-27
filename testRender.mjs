import React from "react";
import { renderToString } from "react-dom/server";
import { BrowserRouter } from "react-router-dom";
import ShopCatalog from "./frontend/src/pages/ShopCatalog.jsx";

// Mock the shopService
jest.mock("./frontend/src/services/shop.service.js", () => ({
  getProducts: () => Promise.resolve({ success: true, data: [] })
}));

try {
  const html = renderToString(
    <BrowserRouter>
      <ShopCatalog />
    </BrowserRouter>
  );
  console.log("RENDER SUCCESS");
} catch(e) {
  console.log("RENDER ERROR:", e);
}
