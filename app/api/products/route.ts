import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const productsFile = path.join(dataDir, 'products.json');

// GET - Read all products
export async function GET() {
  try {
    const data = fs.readFileSync(productsFile, 'utf8');
    const products = JSON.parse(data);
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read products' }, { status: 500 });
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const data = fs.readFileSync(productsFile, 'utf8');
    const products = JSON.parse(data);
    
    const newProduct = await request.json();
    const maxId = products.length > 0 ? Math.max(...products.map((p: any) => p.id)) : 0;
    newProduct.id = maxId + 1;
    
    products.push(newProduct);
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

// PUT - Update product
export async function PUT(request: NextRequest) {
  try {
    const data = fs.readFileSync(productsFile, 'utf8');
    const products = JSON.parse(data);
    
    const updatedProduct = await request.json();
    const index = products.findIndex((p: any) => p.id === updatedProduct.id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    products[index] = updatedProduct;
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');
    
    const data = fs.readFileSync(productsFile, 'utf8');
    const products = JSON.parse(data);
    
    const filtered = products.filter((p: any) => p.id !== id);
    fs.writeFileSync(productsFile, JSON.stringify(filtered, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

