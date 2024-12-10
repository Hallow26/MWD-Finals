import { Container, Button, Nav } from "react-bootstrap"
import { NavLink } from "react-router-dom"



export default function ErrorPage(){
    return(
        <Container fluid className="p-5 vh-100">
            <Container className="p-5 d-flex flex-column justify-content-center align-items-center vh-100">
                <h1 className="display-3 fw-bold">PAGE NOT FOUND</h1>
                <p className="mb-5 display-6">The page you are trying to look is not existing.</p>
                <Button className="px-5 rounded-pill" as={NavLink} to="/">Home</Button>
            </Container>
        </Container>
    )
}