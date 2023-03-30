import React from "react"
import ReactDOM from "react-dom/client"
import { ChakraProvider, Container } from "@chakra-ui/react"
import App from "./App"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ChakraProvider>
            <Container minHeight="100vh" minWidth="100vw">
                <App />
            </Container>
        </ChakraProvider>
    </React.StrictMode>
)
