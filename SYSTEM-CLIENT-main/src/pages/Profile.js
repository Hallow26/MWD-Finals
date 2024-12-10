import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card, Spinner, Row, Col, Alert } from "react-bootstrap";
import Swal from "sweetalert2";

// Utility for API calls
const fetchData = async (url, options) => {
    try {
        const response = await fetch(url, options);
        return await response.json();
    } catch (error) {
        return { error: "Network error. Please try again later." };
    }
};

// Profile Component
export default function Profile() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");

    // Fetch User Profile
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            const data = await fetchData("http://localhost:4000/users/details", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.code === "USER-FOUND") {
                setUserProfile(data.result);
            } else {
                Swal.fire({
                    title: "Error",
                    text: data.message || "Unable to fetch profile.",
                    icon: "error",
                });
            }
            setLoading(false);
        };

        fetchProfile();
    }, []);

    // Handle Password Update
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            return Swal.fire({
                title: "Passwords don't match!",
                text: "Please ensure both passwords match.",
                icon: "error",
            });
        }

        const token = localStorage.getItem("token");
        const data = await fetchData("http://localhost:4000/users/update-password", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ newPassword, confirmPassword }),
        });

        if (data.code === "PASSWORD-UPDATE-SUCCESS") {
            setSuccessMessage(data.message || "Password updated successfully!");
            setNewPassword("");
            setConfirmPassword("");
        } else {
            Swal.fire({
                title: "Error",
                text: data.message || "Unable to update password.",
                icon: "error",
            });
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Profile Settings</h2>

            <Row>
                {/* User Profile Section */}
                <Col lg={6} className="mb-4">
                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <h5>Your Profile</h5>
                        </Card.Header>
                        <Card.Body>
                            {loading ? (
                                <div className="text-center">
                                    <Spinner animation="border" />
                                    <p>Loading profile...</p>
                                </div>
                            ) : userProfile ? (
                                <div>
                                    <p>
                                        <strong>Name:</strong> {userProfile.firstName}{" "}
                                        {userProfile.middleName} {userProfile.lastName}
                                    </p>
                                    <p>
                                        <strong>Email:</strong> {userProfile.email}
                                    </p>
                                    <p>
                                        <strong>Contact Number:</strong> {userProfile.contactNumber}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-danger">Unable to load profile information.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Password Update Section */}
                <Col lg={6} className="mb-4">
                    <Card className="shadow-sm">
                        <Card.Header className="bg-secondary text-white">
                            <h5>Update Password</h5>
                        </Card.Header>
                        <Card.Body>
                            {successMessage && (
                                <Alert
                                    variant="success"
                                    onClose={() => setSuccessMessage("")}
                                    dismissible
                                >
                                    {successMessage}
                                </Alert>
                            )}
                            <Form onSubmit={handlePasswordUpdate}>
                                <Form.Group className="mb-3">
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Confirm New Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Button
                                    variant="secondary"
                                    type="submit"
                                    className="w-100"
                                    disabled={loading || !newPassword || !confirmPassword}
                                >
                                    {loading ? <Spinner size="sm" animation="border" /> : "Update Password"}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
