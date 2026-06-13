const ProductList = ({ products }) => {
    return (
        <div className="row">
            {products.map(product => (
                <div className="col-lg-4 col-md-6 mb-4 col-sm-12 mb-4" key={product.id}>
                    <div className = "card h-100">
                        <img
                            src = {product.imgUrl || 'https://placeholder.co/600x400'}
                            className = "card-img-top"
                            alt = {product.name} />
                        <div className = "card-body d-flex flex-column h-100">
                            <h5 className = "card-title">{product.name}</h5>
                            <p className = "card-text">{product.description}</p>
                            <p className = "card-text"><strong>${product.price}</strong></p>
                            <div className="mt-auto" d-flex justify-content-end gap-2>
                                <button className="btn btn-danger btn-sm">Delete</button>
                                <button className="btn btn-secondary btn-sm">Edit</button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ProductList;