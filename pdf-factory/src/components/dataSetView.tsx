import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

export default function Data() {

    let {setName} = useParams();
    const [columns, setColumns] = useState<Array<any> | null>();
    const [rows, setRows] = useState<Array<any> | null>();

    useEffect(() => {
        fetchSet(setName)
    }, [])

    const fetchSet = (name: string | undefined) => {

        if (name === undefined) return;

        fetch(`http://localhost:3030/api/v1/data/${name}`)
            .then(response => {
                return response.json()
            })
            .then(response => {
                setColumns(response.set.columns);
                setRows(response.items);
            })
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
                    </tr>
                ))}

            </tbody>
        </Table>
    );
}