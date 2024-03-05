const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const PRODUCTS_FILE_PATH = path.join(__dirname, 'products.json');

app.use(express.json());
app.use(cors());

let products = [];
if (fs.existsSync(PRODUCTS_FILE_PATH)) {
  products = fs.readJsonSync(PRODUCTS_FILE_PATH).data;
}

// Routes

app.get('/products', (req, res) => {
  let { first = 0, rows = 10, sortField, sortOrder, filters } = req.query;

  first = parseInt(first);
  rows = parseInt(rows);
  filters = filters ? JSON.parse(filters) : undefined;

  const filteredProducts = (filters != undefined && filters != null)? products.filter(product => {
    for (const [key, filter] of Object.entries(filters)) {
      if(filter.value == undefined || filter.value == null || filter.value == '' || filter.value =='null' || filter.value =='undefined'){
        continue;
      }
      const value = ''+product[key];
      const filterValue = ''+filter.value;

      // Apply the filter based on the provided matchMode
      switch (filter.matchMode) {
        case 'contains':
          if (!value.includes(filterValue)) {
            return false;
          }
          break;
        default:
          break;
      }
    }
    return true;
  }) : products;

  
  if (sortField !== 'undefined' && sortField !== undefined && sortOrder !== undefined) {
    filteredProducts.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
  
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === '1' ? aValue - bValue : bValue - aValue;
      } else {
        return sortOrder === '1' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
    });
  }
  const paginatedProducts = filteredProducts.slice(first, first + rows);


  res.json({ data: paginatedProducts, totalRecords: filteredProducts.length });
});

app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  const product = products.find(p => p.id === parseInt(id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.post('/products', (req, res) => {
  const productData = req.body;
  //find id max and add 1
  let id = 0;
  for(let i = 0; i < products.length; i++){
    if(products[i].id > id){
      id = products[i].id;
    }
  }
  const newProduct = productData;
  newProduct.id = id + 1;
  products.push(newProduct);
  saveProductsToFile();
  res.status(201).json(newProduct);
});

app.patch('/products/:id', (req, res) => {
  const { id } = req.params;
  const productData = req.body;
  const productIndex = products.findIndex(p => p.id === parseInt(id));
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  products[productIndex] = { ...products[productIndex], ...productData };
  saveProductsToFile();
  res.json(products[productIndex]);
});

app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  const productIndex = products.findIndex(p => p.id === parseInt(id));
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  products.splice(productIndex, 1);
  saveProductsToFile();
  res.json({ message: 'Product deleted successfully' });
});

function saveProductsToFile() {
  fs.writeJsonSync(PRODUCTS_FILE_PATH, {data : products});
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});