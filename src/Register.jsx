import { useState } from "react";

function Register({ onSwitch }) {
    const [user, setUser] = useState({username: "", password: ""});

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('http://localhost:8080/api/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
        .then(res => res.text())
        .then(() => {
            alert("Registered Successfully");
            onSwitch(); //go back to login
        });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">

                <div className="col-md-6">
                    <h2>Register</h2>

                    <form onSubmit={handleSubmit}>
                        <input placeholder="Username" className="form-control mb-3" 
                            onChange={(e)=>setUser({...user, username:e.target.value})}/>

                        <input type="password" placeholder="Password" className="form-control mb-3" 
                            onChange={(e)=>setUser({...user, password:e.target.value})}/>

                        <button className="btn btn-primary">Register</button>
                    </form>

                    <p className="mt-2">
                        Already have account? <button onClick={onSwitch}>Login</button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;