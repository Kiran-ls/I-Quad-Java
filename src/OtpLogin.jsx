import { useEffect, useState } from "react";

function OtpLogin({ onLogin }) {

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        if (queryParams.get("login") === "success") {
            window.history.replaceState({}, document.title, window.location.pathname);
            onLogin();
        } else if (queryParams.get("login") === "error") {
            window.history.replaceState({}, document.title, window.location.pathname);
            alert("Google Sign-In failed");
        }
    }, [onLogin]);

    //request otp frpm backend
    const handleRequestOtp = (e) => {
        e.preventDefault();
        if (!email) return alert("Please enter a valid email address.");

        setLoading(true);
        fetch('http://localhost:8080/api/request-otp', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email})
        })
        .then(res => res.text())
        .then(data => {
            alert(data);
            setIsOtpSent(true);
        })
        .catch(err => console.error("Error sending OTP:", err))
        .finally(() => setLoading(false));
    };

    //verify OTP and login
    const handleVerifyOtp =(e) => {
        e.preventDefault();
        if (!otp) return alert("Please enter the verification code.");

        setLoading(true);
        fetch('http://localhost:8080/api/verify-otp', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({email, otp})
        })
        .then(res => {
            if (res.ok) {
                onLogin();
            } else {
                alert("Invalid or Expired OTP code.");
            }
        })
        .catch(err => console.error("Error verifying OTP:", err))
        .finally(() => setLoading(false));
    };

    
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5 card p-4 shadow-sm">
                    <h2 className="text-center mb-4">Welcome back</h2>
                    <p className="text-muted text-center small mb-4">
                        Enter your email to log-in
                    </p>

                    {!isOtpSent ? (
                        <form onSubmit={handleRequestOtp}>
                            <div className="mb-3">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                {loading ? "Sending..." : "Send Verification Code"}
                            </button>
                        </form>
                    ) : (
                        //otp input form
                        <form onSubmit={handleVerifyOtp}>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    className="form-control text-center tracking-widest"
                                    maxLength="6"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <button type="submit" className="btn btn-success w-100 mb-2" disabled={loading}>
                                {loading ? "Verifying..." : "Verify & Login"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-link w-100 text-decoration-none text-muted btn-sm"
                                onClick={() => setIsOtpSent(false)}
                            >
                                Change Email
                            </button>
                        </form>
                    )}

                    <div className="text-center my-3 text-muted position-relative">
                        <hr />
                        <span className="px-2 bg-white position-absolute top-50 start-50 translate-middle small">or</span>
                    </div>

                    {/* Google login */}
                    <a href="http://localhost:8080/oauth2/authorization/google">
                        <button className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
                                <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0c2.204 0 4.09.811 5.536 2.151l-2.201 2.2a4.58 4.58 0 1 0-3.335 1.233c.894 0 1.656.246 2.234.654l-.015-.015z"/>
                            </svg>
                            Continue with Google
                        </button>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default OtpLogin;