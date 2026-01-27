import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AbhaProfilePage.css';

export default function AbhaProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const url = process.env.REACT_APP_BASE_URL

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // Get the enrollment response saved during OTP verification
                const enrollData = localStorage.getItem('x-token');
                const accessToken = localStorage.getItem('accessToken');

                if (!enrollData) {
                    console.error("No enrollment data found. Redirecting to registration.");
                    setError("No enrollment data found. Please complete registration first.");
                    setTimeout(() => navigate('/registration-auth'), 2000);
                    return;
                }


                if (!enrollData) {
                    console.error("No X-Token found in enrollment data");
                    // Use enrollment data as fallback
                    setLoading(false);
                    return;
                }

                if (!accessToken) {
                    console.error("No access token found");
                    setError("Authentication required. Redirecting...");
                    setTimeout(() => navigate('/'), 2000);
                    return;
                }

                const tokenString = String(enrollData).replace(/^["']|["']$/g, '').trim();


                const response = await fetch(`${url}/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'X-Token': tokenString
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // Merge enrollment data with profile data (in case profile API returns partial data)
                setProfile({
                    ...data
                });

            } catch (err) {
                console.error("Profile Error:", err);

                // Try to use enrollment data as fallback
                const enrollData = localStorage.getItem('enrollResponse');
                if (enrollData) {
                    try {
                        const parsedData = JSON.parse(enrollData);
                        console.warn("Using fallback enrollment data");
                        setProfile(parsedData);
                    } catch (parseErr) {
                        setError("Failed to load profile data");
                    }
                } else {
                    setError("Failed to load profile data");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Syncing with ABDM Profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-card">
                    <h3>⚠️ Error</h3>
                    <p>{error}</p>
                    <button className="btn-primary" onClick={() => navigate('/registration-auth')}>
                        Go to Registration
                    </button>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="error-container">
                <div className="error-card">
                    <h3>No Profile Data</h3>
                    <p>No profile information available. Please complete registration first.</p>
                    <button className="btn-primary" onClick={() => navigate('/registration-auth')}>
                        Go to Registration
                    </button>
                </div>
            </div>
        );
    }

    // Format date of birth
    const formatDOB = () => {
        const day = profile?.dayOfBirth || profile?.day;
        const month = profile?.monthOfBirth || profile?.month;
        const year = profile?.yearOfBirth || profile?.year;

        if (day && month && year) {
            return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
        }
        return 'N/A';
    };

    return (
        <div className="profile-page-container">
            <div className="profile-card-large">
                <div className="profile-header">
                    <div className="profile-avatar-large">
                        {profile?.photo || profile?.kycPhoto ? (
                            <img
                                src={`data:image/jpeg;base64,${profile?.photo || profile?.kycPhoto}`}
                                alt="Profile"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
                            />
                        ) : (
                            profile?.name?.charAt(0)?.toUpperCase() || profile?.firstName?.charAt(0)?.toUpperCase() || 'U'
                        )}
                    </div>
                    <div>
                        <h2 className="profile-title">ABHA Profile Details</h2>
                        <p className="profile-subtitle">Your digital health identity</p>
                    </div>
                </div>

                <div className="profile-details-grid">
                    <div className="detail-item">
                        <label>Full Name</label>
                        <p>{profile?.name || `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || 'N/A'}</p>
                    </div>

                    <div className="detail-item">
                        <label>ABHA Number</label>
                        <p className="highlight-text">
                            {profile?.abhaNumber || profile?.healthIdNumber || profile?.ABHANumber || 'N/A'}
                        </p>
                    </div>

                    <div className="detail-item">
                        <label>Address</label>
                        <p>{profile?.address || 'N/A'}</p>
                    </div>

                    <div className="detail-item">
                        <label>Gender</label>
                        <p>{profile?.gender || 'N/A'}</p>
                    </div>

                    <div className="detail-item">
                        <label>Date of Birth</label>
                        <p>{formatDOB()}</p>
                    </div>

                    <div className="detail-item">
                        <label>Mobile Number</label>
                        <p>{profile?.mobile || profile?.mobileNumber || 'N/A'}</p>
                    </div>

                    {profile?.email && (
                        <div className="detail-item">
                            <label>Email</label>
                            <p>{profile.email}</p>
                        </div>
                    )}

                    {profile?.stateName && (
                        <div className="detail-item">
                            <label>State</label>
                            <p>{profile.stateName}</p>
                        </div>
                    )}

                    {profile?.districtName && (
                        <div className="detail-item">
                            <label>District</label>
                            <p>{profile.districtName}</p>
                        </div>
                    )}

                    {profile?.preferredAbhaAddress && (
                        <div className="detail-item">
                            <label>ABHA Address</label>
                            <p>{profile.preferredAbhaAddress}</p>
                        </div>
                    )}
                </div>

                <div className="profile-actions">
                    <button className="btn-secondary" onClick={() => navigate('/')}>
                        Back to Home
                    </button>
                    <button className="btn-secondary" onClick={() => navigate('/registration-auth')}>
                        New Registration
                    </button>
                    <button className="btn-primary" onClick={() => window.print()}>
                        Print Profile
                    </button>
                </div>
            </div>
        </div>
    );
}