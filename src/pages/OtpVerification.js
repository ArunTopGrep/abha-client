import { useState } from 'react';
import './AbhaStepper.css';

export default function OtpVerification({ onAccountExists, onNoAccount }) {
    const [otp, setOtp] = useState("");
    const [mobile, setMobile] = useState("");
    const [loading, setLoading] = useState(false);
    const url = process.env.REACT_APP_BASE_URL

    const handleVerify = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${url}/otp/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    otp,
                    txnId: localStorage.getItem('txnId'),
                    publicKey: localStorage.getItem('publicKey'),
                    mobile
                })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('enrollResponse', JSON.stringify(data?.message));
                localStorage.setItem('x-token', JSON.stringify(data?.tokens?.token));
                if (data.message == "This account already exist") onAccountExists();
                else onNoAccount();
            } else { alert(data.message || "Verification Failed"); }
        } catch (err) { alert("API Error"); }
        finally { setLoading(false); }
    };

    return (
        <div className="form-group">
            <label>Enter OTP <span className="req">*</span></label>
            <input type="password" placeholder="Enter 6-digit OTP" className="stepper-input" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength="6" />
            <label>Mobile Number (Linked with Aadhaar) <span className="req">*</span></label>
            <input type="text" className="stepper-input" value={mobile} onChange={(e) => setMobile(e.target.value)} />
            <button className="action-btn" onClick={handleVerify} disabled={loading || otp.length < 6}>
                {loading ? "Verifying..." : "Verify OTP"}
            </button>
        </div>
    );
}