import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Spin from "./spinner";
import { PdfViewerComponent, PdfViewerRef } from "./pdf-viewer";
import { Button, Col, Container, Form, Row, Stack, Table } from "react-bootstrap";
import axios from "axios";

interface Set {
    id: string, name: string, itemsCount: number 
}

interface Field {
    id: { id: string, EN: string },
    page: number,
}

export default function TemplateView() {

    let {templateId} = useParams();
    const ref = useRef<PdfViewerRef>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDataLoading, setDataLoading] = useState(false);
    const [template, setTemplate] = useState<{id: string, fields: Field[], name: string, fileName: string}>();
    const [file, setFile] = useState<Blob | null>(null);
    const [dataSets, setDataSets] = useState(Array<Set>)
    const [set, setSet] = useState<Set>()
    const [columns, setColumns] = useState<Array<any> | null>();
    const [rows, setRows] = useState<Array<any> | null>();
    const [fieldAssignments, setFieldAssignments] = useState<Array<{field: Field, column: string}>>([]);

    useEffect(() => {
        fetchTemplate();
        fetchSets();
    }, [])

    const fetchSets = () => {
		setDataSets([]);
		fetch("http://localhost:3030/api/v1/data")
			.then(response => {
				return response.json()
			})
			.then(data => {
				setDataSets(data);
			})
	}

    const fetchSet = (name: string | undefined) => {

        setDataLoading(true);
        if (name === undefined) return;

        fetch(`http://localhost:3030/api/v1/data/${name}`)
            .then(response => {
                return response.json()
            })
            .then(response => {
                setDataLoading(false);
                setColumns(response.set.columns);
                setRows(response.items);
            })
    }

    const fetchTemplate = () => {

        if (templateId === undefined) return;

        setIsLoading(true);
        return fetch(`http://localhost:3030/api/v1/template/${templateId}`)
            .then(response => {
                return response.json()
            })
            .then(data => {
                setTemplate(data);

                fetchFile(templateId!, data.fileName);
            })
    }

    const fetchFile = (templateId: string, file: string) => {
        return fetch(`http://localhost:3030/api/v1/template/${templateId}/file/${file}`)
            .then(response => {
                return response.blob()
            })
            .then(data => {
                console.log(data);
                setFile(data);
                setIsLoading(false);
            })
    }

    const chooseSet = (id: string) => {
        const set = dataSets.find(s => s.id === id);

        if (!set) return;

        setSet(set);
        fetchSet(set.name);
    }


    const getDocumentFrame = () => {
        var iframes = document.getElementsByTagName('iframe');

        return iframes.length !== 0 ? iframes[0] : null;
    }

    const getInput = (field: Field, frame: HTMLIFrameElement) => {
        const inputs = frame.contentDocument?.getElementsByName(field.id.id);

        return inputs?.length !== 0 ? inputs![0] : null;
    }

    const inputHovered = (field: Field) => () => {

        const frame = getDocumentFrame();
        
        if (frame === null) return;

        let input = getInput(field, frame);

        input?.style.setProperty('border', '2px solid red');
        input?.style.setProperty('border-radius', '4px');
        input?.style.setProperty('opacity', '1');
    }

    const moseOut = (field: Field) => () => {
        const frame = getDocumentFrame();
        
        if (frame === null) return;

        let input = getInput(field, frame);

        input?.style.setProperty('border', null);
        input?.style.setProperty('border-radius', null);
        input?.style.setProperty('opacity', '0');
    }

    const getTable = () => {

        const assignRow = (row: any) => {
            const inputs = fieldAssignments.map(assignment => {
                return {fieldId: assignment.field.id.id, data: row[assignment.column]};
            })

            ref.current?.fillData(inputs);
        }

        return (
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        {columns?.map((column: string) => (<th>{column}</th>))}
                    </tr>
                </thead>
                <tbody>
                    {rows?.map(row => (
                        <tr>
                            {columns?.map((column) => (<td>{row[column]}</td>))}
                            <td>
                                <Button variant="secondary" onClick={() => assignRow(row)}>Assign</Button>{' '}
                            </td>
                        </tr>
                    ))}

                </tbody>
            </Table>
        )
    }

    const assignColumn = (column: string, field: Field) => {
        fieldAssignments.push({field: field, column: column});
    }

    const getDataAssigner = () => {
        return (
            <Stack direction="horizontal" gap={3} className="mt-5">
                { template?.fields.map(field => (
                    <Stack>
                        <Form.Group as={Row} className="mb-3" onMouseOver={inputHovered(field)} onMouseOut={moseOut(field)}>
                            <Form.Label column sm="2">{field.id.id}</Form.Label>
                            <Col sm="10">
                                <Form.Select aria-label="Default select example" onChange={(event) => { assignColumn(event.target.value, field) }}>
                                    {columns!.map((column) => (<option value={column}>{column}</option>))}
                                </Form.Select>
                            </Col>
                            </Form.Group>
                    </Stack>
                )) }
            </Stack>
        )
    }

    const generateFiles = async (templateId: string, set: Set, fieldAssignments: Array<{field: Field, column: string}>) => {
        const data = {
            templateId: templateId,
            set: set.id,
            fieldAssignments: fieldAssignments.map(assignment => ({
                fieldId: assignment.field.id.id,
                column: assignment.column
            })),
        }
        axios.post('http://localhost:3030/api/v1/generate', data);
    }

    const generate = async () => {
        await generateFiles(template!.id, set!, fieldAssignments);
    }

    if (isLoading) return (<Spin></Spin>);

    let setView = (<span></span>);

    if (dataSets && isDataLoading)
        setView = (<Spin></Spin>);
    else if (dataSets && set)
        setView = (getDataAssigner())

    let table = getTable();

    return (
        <Container fluid className='main-container'>
            <Row>
                <Col lg={8}>
                    {file !== null ? ( <PdfViewerComponent document={file!} ref={ref}></PdfViewerComponent>) : null}
                </Col>
                <Col>
                    <Container>
                        <Row>
                            {dataSets ? (
                                <Stack>
                                    <Form.Group>
                                        <Form.Label>Choose data set</Form.Label>
                                        <Form.Select aria-label="Default select example" onChange={(event) => { chooseSet(event.target.value) }}>
                                            {dataSets.map((set) => (<option value={set.id}>{set.name}</option>))}
                                        </Form.Select>
                                    </Form.Group>
                                </Stack>

                                ) : <Spin></Spin>}
                        </Row>
                        <Row className="justify-content-md-center">
                            {setView}
                        </Row>
                        <Row className="justify-content-md-center">
                            {table}
                        </Row>
                        <Row className="justify-content-md-center">
                            <Button onClick={() => generate()}>Generate</Button>
                        </Row>
                    </Container>
                </Col>
            </Row>

        </Container>);
}