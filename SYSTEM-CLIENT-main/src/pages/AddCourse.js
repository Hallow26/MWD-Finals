import { use } from "react";
import { useState } from "react"
import { Container, Form, Button, Image } from "react-bootstrap"
import Swal from "sweetalert2";



export default function AddCourse(){

    const [imgLink, setImgLink] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [img, setImg] = useState("none");

    function addCourse(e){
        e.preventDefault();

        fetch("http://localhost:4000/courses/", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({
                imgLink: imgLink,
                name: name,
                description: description,
                price: price
            })
        })
        .then(result => result.json())
        .then(data => {
            if(data.code === "COURSE-ADDED"){
                Swal.fire({
                    title: "COURSE ADDED!",
                    text: data.message,
                    icon: "success"
                })
                setImgLink("");
                setName("");
                setDescription("");
                setPrice("");
            }else{
                Swal.fire({
                    title: "SOMETHING WENT WRONG!",
                    text: "Please try again!",
                    icon: "error"
                })
            }
            
        })
    }

    return(
        <Container fluid className="vh-100 p-5">
            <Container className=" mb-5">
                <h1 className="display-3 fw-bold">ADD NEW COURSE</h1>
            </Container>

            <Container className="d-flex flex-column col-lg-6 col-12">

            <Form className="w-100 p-5 shadow rounded-3 border-bottom border-3 border-warning" onSubmit={(e) => addCourse(e)}>

            <Image src={imgLink} className={`img-fluid center-crop mb-3 ${imgLink === "" ? "d-none" : ""}`}></Image>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Control type="text" placeholder="Image Link" required value={imgLink} onChange={e => setImgLink(e.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Control type="text" placeholder="Course Name" required value={name} onChange={e => setName(e.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Control type="text" placeholder="Course Description" required value={description} onChange={e => setDescription(e.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Control type="number" placeholder="Course Price" required value={price} onChange={e => setPrice(e.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Button variant="warning" className="w-100 rounded-pill" type="submit">ADD COURSE</Button>
            </Form.Group>

            </Form>
            </Container>
        </Container>
    )
}