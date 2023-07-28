import { useEffect, useState } from 'react';
import { Button, Stack, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UploadData from './uploadData';
import Spin from './spinner';


export default function Data() {

	const navigate = useNavigate();
	const [dataSets, setDataSets] = useState(Array<{ id: string, name: string, itemsCount: number }>)
	const [isLoading, setIsLoading] = useState(false);
	const [showAdd, setShowAdd] = useState(false);

	useEffect(() => {
		fetchSets()
	}, [])

	const openTemplate = (name: string) => () => {
		console.log("Open template: ", name);
		navigate('/dataSet/' + name);
	}

	const fetchSets = () => {
		setIsLoading(true);
		setDataSets([]);
		fetch("http://localhost:3030/api/v1/data")
			.then(response => {
				return response.json()
			})
			.then(data => {
				setDataSets(data);
				setIsLoading(false);
			})
	}

	const toggleAdd = () => {
        setShowAdd(!showAdd);
    }

	const refresh = () => {
		toggleAdd();
		fetchSets();
	}

	if (isLoading) return (<Spin></Spin>);

	const upload = showAdd ? (<UploadData onRefresh={refresh}/>) : null;

	return (

		<div>
			
			<Stack direction="horizontal" gap={3}>
                <div className="p-2 ms-auto"><Button onClick={() => toggleAdd()}>Upload</Button></div>
            </Stack>

			{upload}

			<Table striped bordered hover variant="dark">
				<thead>
					<tr>
						<th>Id</th>
						<th>Name</th>
						<th>Items</th>
					</tr>
				</thead>
				<tbody>
					{dataSets.map(set => (
						<tr onClick={openTemplate(set.name)}>
							<td>{set.id}</td>
							<td>{set.name}</td>
							<td>{set.itemsCount}</td>
						</tr>
					))}

				</tbody>
			</Table>

		</div>
	);

}