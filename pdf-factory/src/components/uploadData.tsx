import { Button, Stack } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import {
	useCSVReader,
} from 'react-papaparse';
import { useState } from "react";
import axios from "axios";

export default function UploadData(props: { onRefresh: () => void} ) {

    const [rowIdColumn, setRowIdColumn] = useState<string | null>(null);
    const { CSVReader } = useCSVReader();
    const [records, setRecords] = useState<Array<any>>([]);
	const [columns, setColumns] = useState<Array<string> | null>([]);
	const [dataName, setDataName] = useState<string | null>(null);
    
    
	const send = async () => {
		// Create an object of formData
		const data = {
			rowId: rowIdColumn,
			data: records,
			columns: columns,
			dataSetName: dataName
		}

		console.log(data);

		// Request made to the backend api
		// Send formData object
		await axios.post("http://localhost:3030/api/v1/data", data);

        props.onRefresh();
    }

    const selection = columns ? (
        <Form.Select aria-label="Default select example" onChange={(event) => { setRowIdColumn(event.target.value) }}>
            {columns.map((column: string) => (<option value={column}>{column}</option>))}
        </Form.Select>
    ) : null;

    return (
        <Form>
        <CSVReader
        eader
            onUploadAccepted={(results: any) => {
                setRecords(results.data.slice(1, results.data.length));
                setColumns(results.data[0]);
                setRowIdColumn(results.data[0][0]);
            }}
            onRemoveFile={() => {
                setRecords([]);
                setColumns(null);
            }}
        >
            {({
                getRootProps,
                ProgressBar,
                getRemoveFileProps,
            }: any) => (
                <>
                    <Stack direction="horizontal" gap={3}>
                        <Button {...getRootProps()}>Browse file</Button>
                        <Button {...getRemoveFileProps()}>Remove</Button>
                    </Stack>
                    {/* {acceptedFile && acceptedFile.name} */}
                    <ProgressBar />
                </>
            )}
        </CSVReader>

        <Stack direction="horizontal" gap={3}>
            <Form.Group className="mb-3" controlId="dataName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Sample data name" onChange={(e) => { setDataName(e.target.value) }} />
            </Form.Group>

            {selection}

            <Button onClick={async () => await send()}>Send</Button>
        </Stack>
        </Form>
    )
}