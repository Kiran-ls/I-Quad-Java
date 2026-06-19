import { useState } from "react";

function Login({onLogin, onSwitch}) {

    const [user, setUser] = useState({username: "", password: ""});

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('http://localhost:8080/api/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(user)
        })
        .then(res => res.text())
        .then(data => {
            if(data === "success") {
                onLogin(); //go to app
            } else {
                alert("Invalid credentials");
            }
        });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2>Login</h2>

                    <form onSubmit={handleSubmit}>
                        <input placeholder="Username" className="form-control mb-3" 
                            onChange={(e)=>setUser({...user, username:e.target.value})}/>

                        <input type="password" placeholder="Password" className="form-control mb-3" 
                            onChange={(e)=>setUser({...user, password:e.target.value})}/>

                        {/* <input type="email" placeholder="Email" className="form-control mb-3" 
                            onChange={(e)=>setUser({...user, email:e.target.value})}/> */}

                        <button className="btn btn-primary">Login</button>
                    </form>

                    <p className="mt-2">
                        <button className="btn btn-link" onClick={() => onSwitch("forgot")}>
                            Forgot Password?
                        </button>
                    </p>

                    <p className="mt-2">
                        New User? <button onClick={onSwitch}>Register</button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;