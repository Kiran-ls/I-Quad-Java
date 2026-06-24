import { useEffect, useState } from "react";

function Login({onLogin, onSwitch}) {

    const [user, setUser] = useState({username: "", password: ""});


    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        if (queryParams.get("login") === "success") {
            window.history.replaceState({}, document.title, window.location.pathname);
            onLogin();
        } else if (queryParams.get("login") === "error") {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [onLogin]);

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

                    <a href="http://localhost:8080/oauth2/authorization/google">
                            <button className="btn btn-danger  w-100 mt-2">
                                Continue with Google
                            </button>
                    </a>

                    <p className="mt-2">
                        New User? <button onClick={onSwitch}>Register</button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;