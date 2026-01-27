import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AbhaStepper.css';
import OtpVerification from './OtpVerification';
import AadhaarInput from './AadhaarInput';
import EmailVerification from './EmailVerification';
import AbhaAddressCreation from './AbhaAddressCreation';

const STEPS = ["Aadhaar", "OTP Verification", "Email Verification", "Create ABHA"];

export default function AbhaStepper() {
    const [currentStep, setCurrentStep] = useState(0);
    const [showExistPopup, setShowExistPopup] = useState(false);
    const [showNoAccountPopup, setShowNoAccountPopup] = useState(false);
    const navigate = useNavigate();

    const progressWidth = (currentStep / (STEPS.length - 1)) * 100;

    const handleNext = () => {
        setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    };

    return (
        <div className="stepper-page">
            <h2 className="page-title">Create ABHA Number</h2>
            <div className="stepper-container">
                <div className="step-counter-container">
                    <span className="step-count-text">Step {currentStep + 1} of {STEPS.length}</span>
                </div>
                <div className="progress-wrapper">
                    <div className="progress-bg">
                        <div className="progress-fill" style={{ width: `${progressWidth}%` }}></div>
                    </div>
                </div>

                <div className="tabs-header">
                    {STEPS.map((step, index) => (
                        <div key={index} className={`tab-item ${index <= currentStep ? 'active' : ''}`}>
                            <span className="step-label">{step}</span>
                        </div>
                    ))}
                </div>

                <div className="step-content-card">
                    {currentStep === 0 && <AadhaarInput onNext={handleNext} onAccountExists={() => setShowExistPopup(true)} />}
                    {currentStep === 1 && <OtpVerification onAccountExists={() => setShowExistPopup(true)} onNoAccount={() => setShowNoAccountPopup(true)} />}
                    {currentStep === 2 && <EmailVerification onVerify={handleNext} />}
                    {currentStep === 3 && <AbhaAddressCreation />}
                </div>
            </div>

            {showExistPopup && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <div className="modal-icon">⚠️</div>
                        <h3>Account Already Exists</h3>
                        <p>This Aadhaar is already linked to an ABHA number.</p>
                        <div className="modal-actions">
                            <button className="btn-primary" onClick={() => navigate('/abha-profile')}>View Profile</button>
                        </div>
                    </div>
                </div>
            )}

            {showNoAccountPopup && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h3>No Account Linked</h3>
                        <p>No ABHA address is found. Click continue to proceed with registration.</p>
                        <button className="btn-primary" onClick={() => { setShowNoAccountPopup(false); handleNext(); }}>Continue</button>
                    </div>
                </div>
            )}
        </div>
    );
}