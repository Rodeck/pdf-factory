import React, { useEffect, useState } from 'react'
import { Button, Container, Stack, Table } from 'react-bootstrap'
import Upload from './pdfUpload'
import Spin from './spinner'
import { useNavigate } from 'react-router-dom';

export default function Data() {

    const [templates, setTemplates] = useState(Array<{id: string, template: string, fileName: string, name: string}>)
    const [showAdd, setShowAdd] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        fetchTemplates()
    }, [])

    const openTemplate = (id: string) => () => {
        console.log("Open template: ", id);
        navigate('/template/' + id);
    }

    const fetchTemplates = () => {
        setIsLoading(true);
        fetch("http://localhost:3030/api/v1/template")
            .then(response => {
                return response.json()
            })
            .then(data => {
                setTemplates(data);
                setIsLoading(false);
            })
    }

    const toggleAdd = () => {
        setShowAdd(!showAdd);
    }

    const upload = showAdd ? (<Upload />) : null;

    if (isLoading) return (<Spin></Spin>);

    return (
        <Container>

            <h1>Templates</h1>

            <Stack direction="horizontal" gap={3}>
                <div className="p-2 ms-auto"><Button onClick={() => toggleAdd()}>Upload</Button></div>
            </Stack>

            {upload}

            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Template name</th>
                        <th>File</th>
                    </tr>
                </thead>
                <tbody>
                    {templates.map(template => (
                        <tr onClick={openTemplate(template.id)}>
                            <td>{template.name}</td>
                            <td>{template.fileName}</td>
                        </tr>
                            ))}
            
                </tbody>
            </Table>
        </Container>
    );
}