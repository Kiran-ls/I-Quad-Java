import { useState, useEffect } from "react";

function ResetPassword ({token, onBack}) {

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        fetch(`http://localhost:8080/api/reset-password?token=${token}&newPassword=${newPassword}`, {
            method: "POST"
        })
        .then(res => res.text())
        .then(data => {
            alert(data);
            onBack(); //back to login
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

                    <h2>Reset Password</h2>

                    <form onSubmit={handleSubmit}>

                        <input
                            type="password"
                            placeholder="New Password"
                            className="form-control md-3"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required 
                        />

                         <input
                            type="password"
                            placeholder="Confirm Password"
                            className="form-control md-3"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required 
                        />

                        <button className="btn btn-success w-100">
                            Reset Password
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
}

export default ResetPassword;