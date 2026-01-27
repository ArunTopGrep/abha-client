import React from 'react';
import './RegistrationAuth.css'; // Make sure the path matches your file structure
import { useNavigate } from 'react-router-dom';

export default function RegistrationAuth() {

    const navigate = useNavigate();

    return (
        <div className="registration-container">
            <h2 className="registration-title">Create ABHA Number</h2>
            <p className="registration-subtitle">
                Please choose the below option to start with the creation of your ABHA
            </p>

            <div className="card-wrapper">
                {/* Aadhaar Card */}
                <div className="auth-card" onClick={() => navigate('/create-abha')}>
                    <div className="logo-container">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/Aadhaar_Logo.svg/1200px-Aadhaar_Logo.svg.png"
                            alt="Aadhaar"
                            className="aadhaar-logo"
                        />
                    </div>
                    <p className="card-text">
                        Create your ABHA number using
                    </p>
                    <h3 className="card-brand">Aadhaar</h3>
                </div>
            </div>
        </div>
    );
}