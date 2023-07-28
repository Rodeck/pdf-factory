import axios from 'axios';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

export default function Upload() {

    const [inputFile, setInputFile] = useState<HTMLInputElement | null>(null);
    const [templateName, seTemplateName] = useState<string | null>(null);

    useEffect(() => {
      setInputFile(document.getElementById("input-file") as HTMLInputElement);
    }, []);
  
    const handleUpload = () => {
        console.log(inputFile?.files);

        let file = inputFile?.files?.item(0);
        if (file)
        {  
            // Create an object of formData
            const formData = new FormData();
            // Update the formData object
            formData.append(
                "pdfFile",
                file,
                file.name
            );
            formData.append('templateName', templateName as string);

            // Request made to the backend api
            // Send formData object
            axios.post("http://localhost:3030/api/v1/template", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        }
    };

    function setName(event: ChangeEvent<HTMLInputElement>): void {
        event.preventDefault();
        seTemplateName(event.target.value)
    }

	return (
        <Form className='mb-5'>
            <Form.Group className="mb-3" controlId="templateName">
                <Form.Label>Template name</Form.Label>
                <Form.Control type="text" placeholder="Enter template name" onChange={setName} />
            </Form.Group>

            <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Choose file</Form.Label>
                <Form.Control type="file" id='input-file'/>
            </Form.Group>
            <Button variant="secondary" onClick={handleUpload}>Upload</Button>{' '}

        </Form>
	);
}