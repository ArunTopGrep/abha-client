import React, { useState } from 'react';
import './AbhaStepper.css';

export default function EmailVerification({ onVerify }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const url = process.env.REACT_APP_BASE_URL

    const handleEmailSubmit = async () => {
        if (!email) return alert("Please enter a valid email");
        
        setLoading(true);
        try {
            const enrollData = localStorage.getItem('x-token');
            const publicKey = localStorage.getItem('publicKey');
            const accessToken = localStorage.getItem('accessToken');

            const tokenString = String(enrollData).replace(/^["']|["']$/g, '').trim();

            const response = await fetch(`${url}/email/verify`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'X-Token': tokenString
                },
                body: JSON.stringify({
                    email: email,
                    publicKey: publicKey
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Verification link sent to your email!");
                onVerify(); // Move to the next step in Stepper
            } else {
                alert(data.message || "Failed to send verification link");
            }
        } catch (err) {
            console.error("Email API Error:", err);
            alert("Error connecting to server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-group">
            <label>Email ID <span className="req">*</span></label>
            <input 
                type="email" 
                placeholder="example@email.com" 
                className="stepper-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
            />
            <p className="hint-text" style={{ fontSize: '12px', color: '#94a3b8', marginTop: '5px' }}>
                We will send a verification link to this email to secure your ABHA profile.
            </p>
            <button 
                className={`action-btn ${loading ? 'disabled' : ''}`} 
                onClick={handleEmailSubmit}
                disabled={loading}
            >
                {loading ? "Sending Link..." : "Verify Email"}
            </button>
        </div>
    );
}