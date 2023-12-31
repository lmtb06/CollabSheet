import React, { useState } from "react";
import { Form, Input, Button } from "antd";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    // Appel API pour la réinitialisation du mot de passe
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message:
              "Entrez votre email pour réinitialiser votre mot de passe !",
          },
        ]}>
        <Input type="email" onChange={(e) => setEmail(e.target.value)} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Réinitialiser le mot de passe
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ForgotPassword;
