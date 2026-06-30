import {useEffect, useState} from 'react';

function AddProduct({categories, onProductAdded, editingProduct}) {

    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        imgUrl: "",
        category: {id: ""}
    });


    const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "categoryId") {
      setProduct({
        ...product,
        category: { id: value }
      });
    } else {
      setProduct({
        ...product,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (product.id) {
        // UPDATE
        fetch(`http://localhost:8080/api/products/${product.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(product)
        })
            .then(res => res.json())
            .then(data => {
                onProductAdded(data); 
            });

    } else {
        // CREATE
        fetch("http://localhost:8080/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(product)
            })
            .then(res => res.json())
            .then(data => {
                onProductAdded(data);
            });
        }
    };

    useEffect(() => {
        if (editingProduct) {
        setProduct(editingProduct);
        }
    },[editingProduct]);


  return (
    <div className="card p-3 mb-4 border-warning shadow-sm">
        <h4>{product.id ? " Update Product" : " Add New Product"}</h4>

        <form onSubmit={handleSubmit}>
            <div className="row">
                
                <div className="col-md-2">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={product.name}
                        className="form-control mb-2"
                        onChange={handleChange}
                    />
                </div>

                <div className="col-md-3">
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={product.description}
                        className="form-control mb-2"
                        onChange={handleChange}
                    />
                </div>

                 <div className="col-md-2">
                    <input
                        type="text"
                        name="imgUrl"
                        placeholder="Image URL"
                        value={product.imgUrl}
                        className="form-control mb-2"
                        onChange={handleChange}
                    />
                </div>

                <div className="col-md-2">
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={product.price}
                        className="form-control mb-2"
                        onChange={handleChange}
                    />
                </div>

                <div className="col-md-2">
                    <select
                        name="categoryId"
                        value={product.category?.id || ""}
                        className="form-select mb-2"
                        onChange={handleChange}
                    >
                        <option value="">Category</option>
                        {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                        ))}
                    </select>
                </div>

                <div className="col-md-1">
                    <button className={`btn w-100 mb-2 ${product.id ? "btn-warning" : "btn-primary"}`}>
                        {product.id ? "Update" : "Add"}
                    </button>
                </div>

            </div>
        </form>
    </div>
  );

}

export default AddProduct;