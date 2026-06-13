import {useState} from 'react';

function AddProduct({categories, onProductAdded}) {

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

    fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    })
    .then(res => res.json())
    .then(data => {
        onProductAdded(data);
    });
  };

  return (
    <div className="card p-3 mb-4">
        <h4>Add Product</h4>

        <form onSubmit={handleSubmit}>
            <div className="row">
                
                <div className="col-md-2">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        className="form-control mb-2"
                        onChange={handleChange}
                    />
                </div>

                <div className="col-md-3">
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        className="form-control mb-2"
                        onChange={handleChange}
                    />
                </div>

                 <div className="col-md-2">
                    <input
                        type="text"
                        name="imgUrl"
                        placeholder="Image URL"
                        className="form-control mb-2"
                        onChange={handleChange}
                    />
                </div>

                <div className="col-md-2">
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        className="form-control mb-2"
                        onChange={handleChange}
                    />
                </div>

                <div className="col-md-2">
                    <select
                        name="categoryId"
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
                    <button className="btn btn-primary w-100">
                        Add
                    </button>
                </div>

            </div>
        </form>
    </div>
  );

}

export default AddProduct;