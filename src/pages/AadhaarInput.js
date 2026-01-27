import React, { useState } from 'react';
import './AbhaStepper.css';

export default function AadhaarInput({ onNext, onAccountExists }) {
    const [aadhaar, setAadhaar] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const url = process.env.REACT_APP_BASE_URL

    const handleAadhaarSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${url}/aadhar/otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({ aadhaar, publicKey: localStorage.getItem('publicKey') })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('txnId', data.txnId); 
                onNext();
            } else if (data.code === "ABDM-1011") { 
                onAccountExists();
            } else { alert(data.message || "Error sending OTP"); }
        } catch (err) { alert("API Error"); }
        finally { setLoading(false); }
    };

    return (
        <div className="form-group">
            <label>Aadhaar Number <span className="req">*</span></label>
            <input type="text" className="stepper-input" value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} maxLength="12" />
            <div className="consent-container">
                <input type="checkbox" id="consent" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                <label htmlFor="consent">I agree to share my Aadhaar details for ABHA creation.</label>
            </div>
            <button className={`action-btn ${(!agreed || aadhaar.length < 12) ? 'disabled' : ''}`} onClick={handleAadhaarSubmit} disabled={!agreed || aadhaar.length < 12 || loading}>
                {loading ? "Sending..." : "Submit"}
            </button>
        </div>
    );
}