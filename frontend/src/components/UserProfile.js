import React, { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";

const UserProfile = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    // Appel API pour récupérer les informations de l'utilisateur
  }, []);

  const handleSubmit = async () => {
    // Appel API pour mettre à jour le profil
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item
        label="Nom"
        name="name"
        rules={[{ required: true, message: "Entrez votre nom !" }]}>
        <Input
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: "Entrez votre email !" }]}>
        <Input
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Mettre à jour le profil
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserProfile;
