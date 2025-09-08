# 🛒 Product Pilot Home Frontend - E-commerce Customization

> **Backend Repository**: [product-pilot-home](https://github.com/HeatherCyber/product-pilot-home) - Spring Boot Microservices Backend

## 🌟 Overview

This project extends the [renren-fast-vue](https://github.com/renrenio/renren-fast-vue) scaffold with custom e-commerce business modules, forming the frontend of the Product Pilot Home demo platform. It focuses on integrating a Vue.js admin interface with a distributed Spring Cloud backend.

## 🛍️ Custom Business Modules

The following modules have been custom-developed for e-commerce product management:

| Module | Components | Description |
|--------|------------|-------------|
| **SPU Management** | `spu.vue`, `spuinfo.vue`, `spuinfo-add-or-update.vue` | Standard Product Unit management |
| **SKU Management** | `sku.vue` | Stock Keeping Unit management |
| **Category Management** | `category.vue`, `category-add-or-update.vue` | Product categorization |
| **Brand Management** | `brand.vue`, `brand-add-or-update.vue` | Brand management |
| **Attribute Management** | `baseAttr.vue`, `saleAttr.vue`, `attrgroup.vue` | Product attributes |
| **Product Launch** | `commoditylaunch.vue` | Product publishing workflow |

## 🛠️ Technology Stack

| Category | Technologies |
|----------|-------------|
| **Frontend Framework** | Vue.js, ElementUI, Axios |
| **Backend Integration** | Spring Cloud Gateway, Product Service, Admin Service |
| **Build Tools** | Node.js, npm |

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 👤 My Contributions

- ✅ **Custom Components**: Developed 19 custom Vue components for e-commerce management
- ✅ **Business Logic**: Implemented SPU, SKU, category, brand, attributes, and product launch workflows
- ✅ **Backend Integration**: Connected frontend modules with backend services (API Gateway, Product Service, Admin Service)
- ✅ **User Experience**: Improved admin interface to support full product publishing workflows

## 📄 License

This project extends renren-fast-vue with custom e-commerce business logic for educational purposes, licensed under the MIT License.

---

📌 **Note**: This project is for educational purposes, demonstrating how to extend an existing scaffold with custom modules and integrate with a distributed backend.