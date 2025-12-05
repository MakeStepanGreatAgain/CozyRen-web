#!/usr/bin/env python3
"""
Simple API for product catalog
Works with PostgreSQL database
"""

import os
import json
import psycopg2
from psycopg2.extras import RealDictCursor
from fastapi import FastAPI, HTTPException, Query, Depends, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional, List, Dict, Any
import uvicorn
import jwt
import hashlib
from datetime import datetime, timedelta
from dotenv import load_dotenv
import logging

# Загружаем переменные окружения из .env файла
load_dotenv()

# Database connection settings
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'database': os.getenv('DB_DATABASE', 'cozyrenovations'),
    'user': os.getenv('DB_USER', 'stepanivanov'),
    'password': os.getenv('DB_PASSWORD')
}

# Admin credentials из переменных окружения
ADMIN_USERNAME = os.getenv('ADMIN_USERNAME')
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD')
JWT_SECRET = os.getenv('JWT_SECRET')
JWT_ALGORITHM = 'HS256'

app = FastAPI(
    title="Cozy Home Craft API",
    description="API for product catalog",
    version="1.0.0"
)

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    """Get database connection"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except psycopg2.Error as e:
        print(f"Database connection error: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")

def verify_admin_token(authorization: str = Header(None)):
    """Verify admin JWT token"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization header missing or invalid")
    
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        username = payload.get("username")
        if username != ADMIN_USERNAME:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Cozy Home Craft API", "version": "1.0.0"}

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT 1")
        conn.close()
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

@app.post("/api/admin/login")
async def admin_login(credentials: dict):
    """Admin login endpoint"""
    username = credentials.get('username')
    password = credentials.get('password')
    
    # Log login attempt
    print(f"Login attempt: username={username}, time={datetime.utcnow()}")
    
    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        # Create JWT token
        payload = {
            'username': username,
            'exp': datetime.utcnow() + timedelta(hours=24),
            'iat': datetime.utcnow()
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        print(f"Successful login for user: {username}")
        return {"token": token, "message": "Login successful"}
    else:
        print(f"Failed login attempt for user: {username}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/products")
async def get_products(
    category: Optional[str] = Query(None, description="Filter by category"),
    brand: Optional[str] = Query(None, description="Filter by brand"),
    search: Optional[str] = Query(None, description="Search by name or description"),
    limit: int = Query(50, ge=1, le=100, description="Number of products per page"),
    offset: int = Query(0, ge=0, description="Offset for pagination")
):
    """Get products list with filtering"""
    try:
        conn = get_db_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            # Base query
            query = """
                SELECT 
                    p.id,
                    p.name,
                    p.description,
                    p.price,
                    p.specifications,
                    p.image_url,
                    p.created_at,
                    p.updated_at,
                    c.name as category_name,
                    c.description as category_description,
                    b.name as brand_name,
                    b.description as brand_description,
                    b.logo_url as brand_logo
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN brands b ON p.brand_id = b.id
                WHERE p.is_active = TRUE
            """
            
            params = []
            
            # Add filters
            if category:
                query += " AND c.name ILIKE %s"
                params.append(f"%{category}%")
            
            if brand:
                query += " AND b.name ILIKE %s"
                params.append(f"%{brand}%")
            
            if search:
                query += " AND (p.name ILIKE %s OR p.description ILIKE %s OR c.name ILIKE %s OR b.name ILIKE %s)"
                search_term = f"%{search}%"
                params.extend([search_term, search_term, search_term, search_term])
            
            # Add sorting and pagination
            query += " ORDER BY p.created_at DESC LIMIT %s OFFSET %s"
            params.extend([limit, offset])
            
            cursor.execute(query, params)
            products = cursor.fetchall()
            
            # Get total count for pagination
            count_query = """
                SELECT COUNT(*)
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN brands b ON p.brand_id = b.id
                WHERE p.is_active = TRUE
            """
            
            count_params = []
            if category:
                count_query += " AND c.name ILIKE %s"
                count_params.append(f"%{category}%")
            
            if brand:
                count_query += " AND b.name ILIKE %s"
                count_params.append(f"%{brand}%")
            
            if search:
                count_query += " AND (p.name ILIKE %s OR p.description ILIKE %s OR c.name ILIKE %s OR b.name ILIKE %s)"
                search_term = f"%{search}%"
                count_params.extend([search_term, search_term, search_term, search_term])
            
            cursor.execute(count_query, count_params)
            total_count = cursor.fetchone()['count']
            
        conn.close()
        
        return {
            "products": [dict(product) for product in products],
            "pagination": {
                "total": total_count,
                "limit": limit,
                "offset": offset,
                "has_more": offset + limit < total_count
            }
        }
        
    except Exception as e:
        print(f"Error getting products: {e}")
        raise HTTPException(status_code=500, detail="Error getting products")

@app.get("/api/products/{product_id}")
async def get_product(product_id: int):
    """Get specific product by ID"""
    try:
        conn = get_db_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                SELECT 
                    p.id,
                    p.name,
                    p.description,
                    p.price,
                    p.specifications,
                    p.image_url,
                    p.created_at,
                    p.updated_at,
                    c.name as category_name,
                    c.description as category_description,
                    b.name as brand_name,
                    b.description as brand_description,
                    b.logo_url as brand_logo
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN brands b ON p.brand_id = b.id
                WHERE p.id = %s AND p.is_active = TRUE
            """, (product_id,))
            
            product = cursor.fetchone()
            
        conn.close()
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        return dict(product)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting product: {e}")
        raise HTTPException(status_code=500, detail="Error getting product")

@app.get("/api/categories")
async def get_categories():
    """Get categories list"""
    try:
        conn = get_db_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                SELECT 
                    c.id,
                    c.name,
                    c.description,
                    c.created_at,
                    COUNT(p.id) as products_count
                FROM categories c
                LEFT JOIN products p ON c.id = p.category_id AND p.is_active = TRUE
                GROUP BY c.id, c.name, c.description, c.created_at
                ORDER BY c.name
            """)
            
            categories = cursor.fetchall()
            
        conn.close()
        
        return [dict(category) for category in categories]
        
    except Exception as e:
        print(f"Error getting categories: {e}")
        raise HTTPException(status_code=500, detail="Error getting categories")

@app.get("/api/brands")
async def get_brands():
    """Get brands list"""
    try:
        conn = get_db_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                SELECT 
                    b.id,
                    b.name,
                    b.description,
                    b.logo_url,
                    b.created_at,
                    COUNT(p.id) as products_count
                FROM brands b
                LEFT JOIN products p ON b.id = p.brand_id AND p.is_active = TRUE
                GROUP BY b.id, b.name, b.description, b.logo_url, b.created_at
                ORDER BY b.name
            """)
            
            brands = cursor.fetchall()
            
        conn.close()
        
        return [dict(brand) for brand in brands]
        
    except Exception as e:
        print(f"Error getting brands: {e}")
        raise HTTPException(status_code=500, detail="Error getting brands")

@app.get("/api/search")
async def search_products(
    q: str = Query(..., description="Search query"),
    limit: int = Query(20, ge=1, le=50, description="Number of results")
):
    """Search products"""
    try:
        conn = get_db_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("SELECT * FROM search_products(%s) LIMIT %s", (q, limit))
            results = cursor.fetchall()
            
        conn.close()
        
        return {
            "query": q,
            "results": [dict(result) for result in results],
            "count": len(results)
        }
        
    except Exception as e:
        print(f"Search error: {e}")
        raise HTTPException(status_code=500, detail="Search error")

# Admin endpoints
@app.post("/api/admin/products")
async def create_product(product_data: dict, current_user: str = Depends(verify_admin_token)):
    """Create new product"""
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO products (name, description, price, category_id, brand_id, specifications, image_url, is_active)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                product_data.get('name'),
                product_data.get('description'),
                product_data.get('price'),
                product_data.get('category_id'),
                product_data.get('brand_id'),
                json.dumps(product_data.get('specifications', {})),
                product_data.get('image_url'),
                product_data.get('is_active', True)
            ))
            product_id = cursor.fetchone()[0]
            conn.commit()
            
        conn.close()
        return {"id": product_id, "message": "Product created successfully"}
        
    except Exception as e:
        print(f"Error creating product: {e}")
        raise HTTPException(status_code=500, detail="Error creating product")

@app.put("/api/admin/products/{product_id}")
async def update_product(product_id: int, product_data: dict):
    """Update product"""
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                UPDATE products 
                SET name = %s, description = %s, price = %s, category_id = %s, 
                    brand_id = %s, specifications = %s, image_url = %s, is_active = %s
                WHERE id = %s
            """, (
                product_data.get('name'),
                product_data.get('description'),
                product_data.get('price'),
                product_data.get('category_id'),
                product_data.get('brand_id'),
                json.dumps(product_data.get('specifications', {})),
                product_data.get('image_url'),
                product_data.get('is_active', True),
                product_id
            ))
            conn.commit()
            
        conn.close()
        return {"message": "Product updated successfully"}
        
    except Exception as e:
        print(f"Error updating product: {e}")
        raise HTTPException(status_code=500, detail="Error updating product")

@app.delete("/api/admin/products/{product_id}")
async def delete_product(product_id: int):
    """Delete product (soft delete)"""
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("UPDATE products SET is_active = FALSE WHERE id = %s", (product_id,))
            conn.commit()
            
        conn.close()
        return {"message": "Product deleted successfully"}
        
    except Exception as e:
        print(f"Error deleting product: {e}")
        raise HTTPException(status_code=500, detail="Error deleting product")

@app.post("/api/admin/categories")
async def create_category(category_data: dict, current_user: str = Depends(verify_admin_token)):
    """Create new category"""
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO categories (name, description)
                VALUES (%s, %s)
                RETURNING id
            """, (
                category_data.get('name'),
                category_data.get('description')
            ))
            category_id = cursor.fetchone()[0]
            conn.commit()
            
        conn.close()
        return {"id": category_id, "message": "Category created successfully"}
        
    except Exception as e:
        print(f"Error creating category: {e}")
        raise HTTPException(status_code=500, detail="Error creating category")

@app.put("/api/admin/categories/{category_id}")
async def update_category(category_id: int, category_data: dict, current_user: str = Depends(verify_admin_token)):
    """Update category"""
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                UPDATE categories 
                SET name = %s, description = %s, updated_at = NOW()
                WHERE id = %s
                RETURNING id, name, description, created_at, updated_at
            """, (
                category_data.get('name'), 
                category_data.get('description'),
                category_id
            ))
            
            result = cursor.fetchone()
            if not result:
                raise HTTPException(status_code=404, detail="Category not found")
            
            conn.commit()
            conn.close()
            
            return {
                "id": result[0],
                "name": result[1],
                "description": result[2],
                "created_at": result[3].isoformat() if result[3] else None,
                "updated_at": result[4].isoformat() if result[4] else None
            }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating category: {e}")
        raise HTTPException(status_code=500, detail="Error updating category")

@app.delete("/api/admin/categories/{category_id}")
async def delete_category(category_id: int, current_user: str = Depends(verify_admin_token)):
    """Delete category"""
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            # Check if category exists
            cursor.execute("SELECT id FROM categories WHERE id = %s", (category_id,))
            if not cursor.fetchone():
                raise HTTPException(status_code=404, detail="Category not found")
            
            # Check if category is used in products
            cursor.execute("SELECT COUNT(*) FROM products WHERE category_id = %s", (category_id,))
            product_count = cursor.fetchone()[0]
            
            if product_count > 0:
                raise HTTPException(status_code=400, detail=f"Cannot delete category: {product_count} products are using this category")
            
            # Delete category
            cursor.execute("DELETE FROM categories WHERE id = %s", (category_id,))
            conn.commit()
            conn.close()
            
            return {"message": "Category deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting category: {e}")
        raise HTTPException(status_code=500, detail="Error deleting category")

@app.post("/api/admin/brands")
async def create_brand(brand_data: dict, current_user: str = Depends(verify_admin_token)):
    """Create new brand"""
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO brands (name, description, logo_url)
                VALUES (%s, %s, %s)
                RETURNING id
            """, (
                brand_data.get('name'),
                brand_data.get('description'),
                brand_data.get('logo_url')
            ))
            brand_id = cursor.fetchone()[0]
            conn.commit()
            
        conn.close()
        return {"id": brand_id, "message": "Brand created successfully"}
        
    except Exception as e:
        print(f"Error creating brand: {e}")
        raise HTTPException(status_code=500, detail="Error creating brand")

@app.put("/api/admin/brands/{brand_id}")
async def update_brand(brand_id: int, brand_data: dict, current_user: str = Depends(verify_admin_token)):
    """Update brand"""
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                UPDATE brands 
                SET name = %s, description = %s, logo_url = %s, updated_at = NOW()
                WHERE id = %s
                RETURNING id, name, description, logo_url, created_at, updated_at
            """, (
                brand_data.get('name'), 
                brand_data.get('description'), 
                brand_data.get('logo_url'),
                brand_id
            ))
            
            result = cursor.fetchone()
            if not result:
                raise HTTPException(status_code=404, detail="Brand not found")
            
            conn.commit()
            conn.close()
            
            return {
                "id": result[0],
                "name": result[1],
                "description": result[2],
                "logo_url": result[3],
                "created_at": result[4].isoformat() if result[4] else None,
                "updated_at": result[5].isoformat() if result[5] else None
            }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating brand: {e}")
        raise HTTPException(status_code=500, detail="Error updating brand")

@app.delete("/api/admin/brands/{brand_id}")
async def delete_brand(brand_id: int, current_user: str = Depends(verify_admin_token)):
    """Delete brand"""
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            # Check if brand exists
            cursor.execute("SELECT id FROM brands WHERE id = %s", (brand_id,))
            if not cursor.fetchone():
                raise HTTPException(status_code=404, detail="Brand not found")
            
            # Check if brand is used in products
            cursor.execute("SELECT COUNT(*) FROM products WHERE brand_id = %s", (brand_id,))
            product_count = cursor.fetchone()[0]
            
            if product_count > 0:
                raise HTTPException(status_code=400, detail=f"Cannot delete brand: {product_count} products are using this brand")
            
            # Delete brand
            cursor.execute("DELETE FROM brands WHERE id = %s", (brand_id,))
            conn.commit()
            conn.close()
            
            return {"message": "Brand deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting brand: {e}")
        raise HTTPException(status_code=500, detail="Error deleting brand")

@app.post("/api/admin/sync-1c")
async def sync_1c(sync_data: dict, current_user: str = Depends(verify_admin_token)):
    """Sync with 1C system"""
    try:
        # Здесь будет логика синхронизации с 1С
        # Пока что просто имитируем процесс
        import time
        import datetime
        
        sync_time = sync_data.get('sync_time', 'now')
        print(f"Starting 1C sync at {sync_time}")
        
        # Имитация времени синхронизации
        time.sleep(2)
        
        # Обновляем время последней синхронизации в базе данных
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO sync_log (sync_type, status, sync_time, details)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (sync_type) 
                DO UPDATE SET 
                    status = EXCLUDED.status,
                    sync_time = EXCLUDED.sync_time,
                    details = EXCLUDED.details
            """, (
                '1c_sync',
                'completed',
                datetime.datetime.now(),
                f'Sync scheduled for: {sync_time}'
            ))
            conn.commit()
            conn.close()
        
        return {
            "message": "Синхронизация с 1С запущена",
            "sync_time": sync_time,
            "status": "completed"
        }
    except Exception as e:
        print(f"Error during 1C sync: {e}")
        raise HTTPException(status_code=500, detail="Ошибка синхронизации с 1С")

@app.get("/api/admin/sync-status")
async def get_sync_status(current_user: str = Depends(verify_admin_token)):
    """Get last sync status"""
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT sync_type, status, sync_time, details
                FROM sync_log 
                WHERE sync_type = '1c_sync'
                ORDER BY sync_time DESC 
                LIMIT 1
            """)
            result = cursor.fetchone()
            conn.close()
            
            if result:
                return {
                    "sync_type": result[0],
                    "status": result[1],
                    "sync_time": result[2].isoformat() if result[2] else None,
                    "details": result[3]
                }
            else:
                return {
                    "sync_type": "1c_sync",
                    "status": "never",
                    "sync_time": None,
                    "details": "Синхронизация еще не выполнялась"
                }
    except Exception as e:
        print(f"Error getting sync status: {e}")
        raise HTTPException(status_code=500, detail="Ошибка получения статуса синхронизации")

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Webhook endpoint для получения прайс-листа от 1С (старый)
@app.post("/webhook/price-list")
async def receive_price_list(request: Request):
    """
    Webhook endpoint для получения прайс-листа от 1С
    """
    try:
        # Получаем данные от 1С
        data = await request.json()
        logger.info(f"Получен прайс-лист от 1С: {len(data.get('products', []))} товаров")
        
        # Обрабатываем данные
        result = await process_price_list(data)
        
        return JSONResponse(content={
            "status": "success",
            "message": f"Обработано {result['processed']} товаров",
            "created": result['created'],
            "updated": result['updated'],
            "errors": result['errors']
        })
        
    except Exception as e:
        logger.error(f"Ошибка обработки прайс-листа: {e}")
        raise HTTPException(status_code=500, detail=f"Ошибка обработки прайс-листа: {str(e)}")

async def process_1c_data(data: Dict[str, Any], content_type: str) -> Dict[str, int]:
    """
    Обработка данных от 1С в любом формате
    """
    logger.info(f"Обработка данных от 1С. Формат: {content_type}")
    
    # Пытаемся извлечь товары из разных форматов
    products = []
    
    if "xml_data" in data:
        # Обработка XML данных
        products = await parse_1c_xml(data["xml_data"])
    elif "raw_data" in data:
        # Обработка сырых данных
        products = await parse_1c_raw_data(data["raw_data"])
    elif isinstance(data, dict) and "products" in data:
        # JSON с товарами
        products = data["products"]
    else:
        # Пытаемся найти товары в структуре данных
        products = await find_products_in_data(data)
    
    logger.info(f"Найдено товаров для обработки: {len(products)}")
    
    # Обрабатываем товары
    created = 0
    updated = 0
    errors = 0
    
    conn = None
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        for product in products:
            try:
                result = await sync_product(cursor, product)
                if result == 'created':
                    created += 1
                elif result == 'updated':
                    updated += 1
            except Exception as e:
                logger.error(f"Ошибка обработки товара {product.get('name', 'Unknown')}: {e}")
                errors += 1
                
        conn.commit()
        
    except Exception as e:
        logger.error(f"Ошибка подключения к БД: {e}")
        if conn:
            conn.rollback()
        raise
    finally:
        if conn:
            conn.close()
    
    # Записываем результат синхронизации
    await log_sync_result(created, updated, errors, "1c_webhook")
    
    return {
        "processed": created + updated,
        "created": created,
        "updated": updated,
        "errors": errors
    }

async def parse_1c_xml(xml_data: str) -> List[Dict[str, Any]]:
    """
    Парсинг XML данных от 1С
    """
    try:
        import xml.etree.ElementTree as ET
        root = ET.fromstring(xml_data)
        
        products = []
        
        # Ищем товары в XML (адаптируем под структуру 1С)
        for item in root.findall('.//Товар') or root.findall('.//Product') or root.findall('.//item'):
            product = {
                'name': get_xml_text(item, ['Наименование', 'Name', 'name']),
                'description': get_xml_text(item, ['Описание', 'Description', 'description']),
                'price': float(get_xml_text(item, ['Цена', 'Price', 'price']) or '0'),
                'category': get_xml_text(item, ['Категория', 'Category', 'category']),
                'brand': get_xml_text(item, ['Бренд', 'Brand', 'brand']),
                'sku': get_xml_text(item, ['Артикул', 'Article', 'sku']),
                'stock_quantity': int(get_xml_text(item, ['Остаток', 'Stock', 'stock_quantity']) or '0')
            }
            products.append(product)
        
        return products
        
    except Exception as e:
        logger.error(f"Ошибка парсинга XML: {e}")
        return []

def get_xml_text(element, tag_names: List[str]) -> str:
    """
    Получение текста из XML элемента по списку возможных тегов
    """
    for tag in tag_names:
        child = element.find(tag)
        if child is not None and child.text:
            return child.text.strip()
    return ''

async def parse_1c_raw_data(raw_data: str) -> List[Dict[str, Any]]:
    """
    Парсинг сырых данных от 1С
    """
    # Пытаемся найти JSON в сырых данных
    try:
        import json
        data = json.loads(raw_data)
        if isinstance(data, list):
            return data
        elif isinstance(data, dict) and "products" in data:
            return data["products"]
    except:
        pass
    
    # Пытаемся найти CSV данные
    try:
        import csv
        from io import StringIO
        reader = csv.DictReader(StringIO(raw_data))
        products = []
        for row in reader:
            product = {
                'name': row.get('Наименование', row.get('name', '')),
                'description': row.get('Описание', row.get('description', '')),
                'price': float(row.get('Цена', row.get('price', 0))),
                'category': row.get('Категория', row.get('category', '')),
                'brand': row.get('Бренд', row.get('brand', '')),
                'sku': row.get('Артикул', row.get('sku', '')),
                'stock_quantity': int(row.get('Остаток', row.get('stock_quantity', 0)))
            }
            products.append(product)
        return products
    except:
        pass
    
    logger.warning("Не удалось распарсить сырые данные от 1С")
    return []

async def find_products_in_data(data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Поиск товаров в структуре данных
    """
    products = []
    
    # Рекурсивно ищем массивы товаров
    def find_products_recursive(obj, path=""):
        if isinstance(obj, list):
            for item in obj:
                if isinstance(item, dict) and any(key in item for key in ['name', 'Наименование', 'price', 'Цена']):
                    products.append(item)
                find_products_recursive(item, f"{path}[]")
        elif isinstance(obj, dict):
            for key, value in obj.items():
                if key.lower() in ['products', 'товары', 'items', 'элементы']:
                    find_products_recursive(value, f"{path}.{key}")
                find_products_recursive(value, f"{path}.{key}")
    
    find_products_recursive(data)
    return products

async def process_price_list(data: Dict[str, Any]) -> Dict[str, int]:
    """
    Обработка прайс-листа от 1С
    """
    products = data.get('products', [])
    created = 0
    updated = 0
    errors = 0
    
    conn = None
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        for product in products:
            try:
                # Обрабатываем каждый товар
                result = await sync_product(cursor, product)
                if result == 'created':
                    created += 1
                elif result == 'updated':
                    updated += 1
                    
            except Exception as e:
                logger.error(f"Ошибка обработки товара {product.get('name', 'Unknown')}: {e}")
                errors += 1
                
        conn.commit()
        
    except Exception as e:
        logger.error(f"Ошибка подключения к БД: {e}")
        if conn:
            conn.rollback()
        raise
    finally:
        if conn:
            conn.close()
    
    # Записываем результат синхронизации
    await log_sync_result(created, updated, errors)
    
    return {
        "processed": created + updated,
        "created": created,
        "updated": updated,
        "errors": errors
    }

async def sync_product(cursor, product: Dict[str, Any]) -> str:
    """
    Синхронизация одного товара
    """
    # Извлекаем данные товара
    name = product.get('name', '')
    description = product.get('description', '')
    price = float(product.get('price', 0))
    category_1c = product.get('category', '')
    brand_1c = product.get('brand', '')
    sku = product.get('sku', '')
    stock_quantity = int(product.get('stock_quantity', 0))
    
    # Сопоставляем категорию
    category_id = await map_category(cursor, category_1c)
    
    # Сопоставляем бренд
    brand_id = await map_brand(cursor, brand_1c)
    
    # Проверяем, существует ли товар
    cursor.execute("""
        SELECT id FROM products 
        WHERE sku = %s OR (name = %s AND brand_id = %s)
    """, (sku, name, brand_id))
    
    existing_product = cursor.fetchone()
    
    if existing_product:
        # Обновляем существующий товар
        cursor.execute("""
            UPDATE products SET
                name = %s,
                description = %s,
                price = %s,
                category_id = %s,
                brand_id = %s,
                stock_quantity = %s,
                updated_at = NOW()
            WHERE id = %s
        """, (name, description, price, category_id, brand_id, stock_quantity, existing_product[0]))
        return 'updated'
    else:
        # Создаем новый товар
        cursor.execute("""
            INSERT INTO products (name, description, price, category_id, brand_id, sku, stock_quantity, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
        """, (name, description, price, category_id, brand_id, sku, stock_quantity))
        return 'created'

async def map_category(cursor, category_1c: str) -> int:
    """
    Сопоставление категории из 1С с нашей БД
    """
    if not category_1c:
        # Возвращаем ID категории "Другое" или создаем ее
        cursor.execute("SELECT id FROM categories WHERE name = 'Другое'")
        result = cursor.fetchone()
        if result:
            return result[0]
        else:
            cursor.execute("INSERT INTO categories (name, created_at, updated_at) VALUES ('Другое', NOW(), NOW()) RETURNING id")
            return cursor.fetchone()[0]
    
    # Ищем существующую категорию
    cursor.execute("SELECT id FROM categories WHERE name ILIKE %s", (f"%{category_1c}%",))
    result = cursor.fetchone()
    
    if result:
        return result[0]
    else:
        # Создаем новую категорию
        cursor.execute("INSERT INTO categories (name, created_at, updated_at) VALUES (%s, NOW(), NOW()) RETURNING id", (category_1c,))
        return cursor.fetchone()[0]

async def map_brand(cursor, brand_1c: str) -> int:
    """
    Сопоставление бренда из 1С с нашей БД
    """
    if not brand_1c:
        # Возвращаем ID бренда "Неизвестно" или создаем его
        cursor.execute("SELECT id FROM brands WHERE name = 'Неизвестно'")
        result = cursor.fetchone()
        if result:
            return result[0]
        else:
            cursor.execute("INSERT INTO brands (name, created_at, updated_at) VALUES ('Неизвестно', NOW(), NOW()) RETURNING id")
            return cursor.fetchone()[0]
    
    # Ищем существующий бренд
    cursor.execute("SELECT id FROM brands WHERE name ILIKE %s", (f"%{brand_1c}%",))
    result = cursor.fetchone()
    
    if result:
        return result[0]
    else:
        # Создаем новый бренд
        cursor.execute("INSERT INTO brands (name, created_at, updated_at) VALUES (%s, NOW(), NOW()) RETURNING id", (brand_1c,))
        return cursor.fetchone()[0]

async def log_sync_result(created: int, updated: int, errors: int, sync_type: str = 'price_list_1c'):
    """
    Логирование результата синхронизации
    """
    conn = None
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO sync_log (sync_type, status, details, created_at)
            VALUES (%s, %s, %s, NOW())
        """, (
            sync_type,
            'completed' if errors == 0 else 'completed_with_errors',
            json.dumps({
                'created': created,
                'updated': updated,
                'errors': errors,
                'total_processed': created + updated
            })
        ))
        
        conn.commit()
        
    except Exception as e:
        logger.error(f"Ошибка записи лога синхронизации: {e}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            conn.close()

# API endpoint для ручной синхронизации
@app.post("/admin/sync/price-list")
async def manual_sync_price_list(admin_token: str = Depends(verify_admin_token)):
    """
    Ручная синхронизация прайс-листа (для тестирования)
    """
    try:
        # Здесь можно добавить логику для получения данных из 1С
        # Пока что возвращаем заглушку
        return JSONResponse(content={
            "status": "success",
            "message": "Функция ручной синхронизации готова к настройке"
        })
        
    except Exception as e:
        logger.error(f"Ошибка ручной синхронизации: {e}")
        raise HTTPException(status_code=500, detail=f"Ошибка синхронизации: {str(e)}")

if __name__ == "__main__":
    print("Starting API server...")
    print(f"Database: {DB_CONFIG['database']} on {DB_CONFIG['host']}")
    uvicorn.run(app, host="0.0.0.0", port=8000)