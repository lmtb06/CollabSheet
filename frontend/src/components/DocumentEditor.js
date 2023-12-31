import React, { useEffect, useState } from "react";

const connectWebSocket = () => {

    const docId =  '6591cc653e7a7b0d0ee90f31'
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENvbXB0ZSI6IjY1OTFjYzQwM2U3YTdiMGQwZWU5MGYyZSIsImlhdCI6MTcwNDA1MzgyNCwiZXhwIjoxNzA0MDU3NDI0fQ.OgVtq5iDKCasgTj4WvqlrEdas2LNg_jLjIWd6oCo484';
    const wsUrl = `ws://localhost:3000/`;
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => {
        ws.send(JSON.stringify({
            type: "auth",
            token,
            idDocument: docId
        }));
    };

    ws.onmessage = (event) => {
        console.log(event);
    };

    ws.onclose = () => {
        // Gére la fermeture de la connexion
        console.log('disconnected');
    };

    return ws;
};

const DocumentEditor = (props) => {
    const { id: docId } = props;
    const [ws, setWs] = useState(null);

    useEffect(() => {
        // Établi la connexion WebSocket à l'ouverture du composant
        const newWs = connectWebSocket(docId);
        setWs(newWs);

        // TODO Nettoyer la connexion WebSocket à la fermeture du composant
        return () => {
            if (newWs) {
                newWs.close();
            }
        };
    }, [docId]);

    return (
        <div>
            {/* Interface d'édition du document */}
        </div>
    );
};

export default DocumentEditor;