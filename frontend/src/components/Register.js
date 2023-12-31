import React, { useState } from "react";
import { Form, Input, Button } from "antd";

const Register = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async () => {
    // Appel API pour l'inscription
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: "Entrez votre email !" }]}>
        <Input
          type="email"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </Form.Item>
      <Form.Item
        label="Mot de passe"
        name="password"
        rules={[{ required: true, message: "Créez un mot de passe !" }]}>
        <Input.Password
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Inscription
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Register;
