# CozRen E-commerce Platform

This is a comprehensive e-commerce platform built with React, TypeScript, and a custom PostgreSQL backend.

## Features

- **Product Catalog**: Browse categories and products with detailed specifications
- **Shopping Cart**: Add, remove, and manage products in cart
- **Checkout Process**: Multi-step checkout with contact info, delivery options, and payment
- **Map Integration**: Interactive store locations with Mapbox
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Backend Integration

The application uses a custom PostgreSQL backend API for:
- Product management
- Order processing 
- Payment integration w/ Strapi
- PDF order generation


## API Configuration

Configure the `VITE_API_BASE_URL` environment variable to point to your backend API:
- Development: `http://localhost:8000/api`
- Production: Your production API domain

## Backend Requirements

The application expects a PostgreSQL backend with the following endpoints:
- `GET /products` - List all products
- `GET /products?category={category}` - Products by category
- `GET /products/{id}` - Single product details
- `POST /orders` - Create new order

## Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn-ui components
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Maps**: Mapbox GL JS
- **PDF Generation**: jsPDF
- **Backend**: Custom PostgreSQL API
