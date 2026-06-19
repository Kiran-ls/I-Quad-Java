import { useState } from "react";

function ForgotPassword({onBack}) {

    const [email, setEmail] = useState("");


    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`http://localhost:8080/api/forgot-password?email=${email}`, {
            method: "POST"
        })
        .then(res => res.text())
        .then(data => {
            alert(data);
        })
        .catch(err => {
            console.error(err);
            alert("Something went wrong");
        });
    };


    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">

                    <h2>Forgot Password</h2>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="form-control mb-3"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <button className="btn btn-primary w-100">
                            Send Reset Link
                        </button>
                    </form>

                    <p className="mt-3 text-center">
                        <button className="btn btn-link" onClick={onBack}>
                            Back to login
                        </button>
                    </p>

                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;