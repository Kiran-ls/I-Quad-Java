function Navbar({ onLogout }) {
    return (
        <div className="d-flex justify-content-end">
            <button className="btn btn-danger" onClick={onLogout}>
                Logout
            </button>
        </div>
    );
}

export default Navbar;