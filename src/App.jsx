import './App.css'
import { useState, useEffect } from 'react';
import ProductList from './ProductList';
import CategoryFilter from './CategoryFilter';
import AddProduct from './AddProduct';

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => { //useEffect hook to fetch data from backend
    fetch('http://localhost:8080/api/products') //fecthing data from backend
      .then(response => response.json()) //converting response to json
      .then(data => setProducts(data)); //setting the data to products state

    fetch('http://localhost:8080/api/categories') 
      .then(response => response.json()) 
      .then(data => setCategories(data)); //setting the data to categories state
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId ? Number(categoryId) : null);
  };

  const filteredProducts = products
        .filter(product => {
          console.log("Product Category: ", product.category?.id, "Selected Category: ", selectedCategory);
          return (
            (selectedCategory ? Number(product.category?.id) === Number(selectedCategory) : true)
            && 
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        })
        .sort((a, b) =>{
          if(sortOrder === "asc") {
            return a.price - b.price;
          } else {
            return b.price - a.price;
          }
        });

  const handleProductAdded = (newProduct) => {
    setProducts(products.map(p =>
      p.id === newProduct.id ? newProduct : p
    ).concat(
      products.some(p => p.id === newProduct.id) ? [] : [newProduct]
    ));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/api/products/${id}`, {
      method:"DELETE"
    })
    .then((res) => {
      console.log("DELETE status:", res.status);
      alert("Product deleted successfully");
      return res.text();
    })
    .then(() => {
      setProducts(products.filter(product => product.id !== id));
    })
    .catch(error => {console.error("Error deleting product:", error)});
  };

  const handleEdit = (product) => {
    console.log("Editing: ", product);
    setEditingProduct(product);
  }

  return (
    <div className='container'>
      <h1 className='my-4'> Product Catalog</h1>


      <div className='row align-items-center mb-4'>
        <div className='col-md-3 col-sm-12 mb-2'>
          <CategoryFilter categories={categories} onSelect={handleCategorySelect} />
        </div>

        <div className='col-md-5 col-sm-12 mb-2'>
          <input
            type="text"
            className='form-control'
            placeholder='Search products...' 
            onChange={handleSearchChange}
            />


        </div>
        <div className='col-md-4 col-sm-12 mb-2'>
          <select className='form-select' onChange={handleSortChange}>
            <option value="asc">Sort by Price (Low to High)</option>
            <option value="desc">Sort by Price (High to Low)</option>
          </select>
        </div>
      </div>

      <div>
         {filteredProducts.length ? (
          // Display products
          <ProductList 
            products={filteredProducts} 
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ) : (
          <p>No products found</p>
        )}
        </div>

        {/* add product */}
      <AddProduct
        categories={categories}
        onProductAdded={handleProductAdded}
        editingProduct={editingProduct}
        />
        
    </div> 
  )}

export default App
