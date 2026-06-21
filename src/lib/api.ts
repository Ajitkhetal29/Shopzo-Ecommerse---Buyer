const API_BASE_URL = "http://localhost:8000/api";

export const API_ENDPOINTS = {
  /* AUTH */
  REGISTER: `${API_BASE_URL}/auth/buyer/register`,
  LOGIN: `${API_BASE_URL}/auth/buyer/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,

  /* USER */
  CURRENT_USER: `${API_BASE_URL}/me`,

  // category
  GET_CATEGORIES: `${API_BASE_URL}/category/list`,
  GET_SUBCATEGORIES: `${API_BASE_URL}/subcategory/list`,

  // home — 4 random categories with 4 products each
  HOME_SHOWCASE: `${API_BASE_URL}/product/home-showcase`,

  // carousel — 10 products by subcategory
  PRODUCTS_BY_SUBCATEGORY: `${API_BASE_URL}/product/by-subcategory`,

  // product listing
  GET_PRODUCTS: `${API_BASE_URL}/product/list`,
  GET_PRODUCT_BY_ID: `${API_BASE_URL}/product`,
  GET_PRODUCT_BY_SLUG: `${API_BASE_URL}/product/slug`,
  GET_PRODUCT_VARIANTS: `${API_BASE_URL}/product/variants/product`,

    // cart
    GET_CART: `${API_BASE_URL}/cart`,
    ADD_TO_CART: `${API_BASE_URL}/cart/add`,
    UPDATE_CART_QUANTITY: `${API_BASE_URL}/cart/update`,
    REMOVE_FROM_CART: `${API_BASE_URL}/cart/remove`,
    CLEAR_CART: `${API_BASE_URL}/cart/clear`,
};
