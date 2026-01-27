import React, { useState, useEffect } from 'react';
import './AbhaStepper.css';
import { useNavigate } from 'react-router-dom';

export default function AbhaAddressCreation() {
    const [suggestions, setSuggestions] = useState([]);
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();
    const url = process.env.REACT_APP_BASE_URL

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const txnId = localStorage.getItem('txnId');
                const token = localStorage.getItem('accessToken');

                const response = await fetch(`${url}/address/suggestion`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Transaction_Id': txnId
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    setSuggestions(data.abhaAddressList || []);
                }
            } catch (err) {
                console.error("Suggestion Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
    }, []);

    const handleCreateAbha = async () => {
        setIsCreating(true);
        try {
            const txnId = localStorage.getItem('txnId');
            const token = localStorage.getItem('accessToken');

            const response = await fetch(`${url}/address/enroll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    txnId: txnId,
                    abhaAddress: address 
                })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('enrollResponse', JSON.stringify(data));
                alert("Congratulations! Your ABHA Address has been created successfully.");
                navigate('/abha-profile');
            } else {
                alert(data.message || "Failed to finalize ABHA address. Please try another address.");
            }
        } catch (err) {
            console.error("Final Enrollment Error:", err);
            alert("Connection error. Please try again.");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="address-creation-container">
            <h3 className="step-sub-title">Create Your Unique ABHA Address</h3>
            <p className="step-description">
                ABHA address is a unique username that allows you to share and access your health records digitally.
                It is similar to an email address, but it is only used for health records.
            </p>
            <p className="hint-text">Min - 8 characters, Max - 18 characters. Special characters allowed: . and _</p>

            <div className="form-group">
                <label>Enter ABHA address<span className="req">*</span></label>
                <div className="input-with-suffix">
                    <input
                        type="text"
                        placeholder="Enter ABHA address"
                        className="stepper-input"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <span className="input-suffix">@abdm</span>
                </div>
            </div>

            <div className="suggestions-section">
                <span className="suggestion-label">Suggestions: </span>
                {loading ? (
                    <span className="loading-text">Loading...</span>
                ) : (
                    suggestions.map((s, i) => (
                        <button
                            key={i}
                            className="suggestion-tag"
                            onClick={() => setAddress(s)}
                        >
                            {s}
                        </button>
                    ))
                )}
            </div>

            <div className="button-row" style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    className="action-btn"
                    onClick={handleCreateAbha}
                    disabled={address.length < 8 || isCreating}
                >
                    {isCreating ? "Creating..." : "Create ABHA"}
                </button>
            </div>
        </div>
    );
}