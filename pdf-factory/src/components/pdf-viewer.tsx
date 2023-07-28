import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import PSPDFKit, { Instance } from 'pspdfkit';

export interface PdfViewerRef {
	fillData(data: Array<{fieldId: string, data: string}>): void;
}

export const PdfViewerComponent = forwardRef<PdfViewerRef, { document: string | Blob }>((props: { document: string | Blob }, ref) => {
	const containerRef = useRef(null);
	const [instance, setInstance] = useState<Instance>();

	useImperativeHandle(ref, () => ({
		fillData(data: Array<{fieldId: string, data: string}>) {
			data.forEach((item) => {
				const formFieldValue = new PSPDFKit.FormFieldValue({
					name: item.fieldId,
					value: item.data,
				  });
				  instance!.update(formFieldValue);
			})
		}
	}));

	const getDocument = (document: string | Blob) => {
		if (typeof document === 'string') {
			return document;
		} else {
			console.log(document);
			const url = URL.createObjectURL(document)
			console.log(url);
			return url;
		}
	}

	useEffect(() => {
		const load = async () => {
			const document = getDocument(props.document);
			console.log(document);
			PSPDFKit.unload('.pdf-container');
			await PSPDFKit.load({
				document,
				container: '.pdf-container',
				// eslint-disable-next-line no-restricted-globals
				baseUrl: location.origin + "/",
			})
				.then((instance) => {
					setInstance(instance);
				})
				.catch(console.error);
		}
		load();
	}, []);

	return (
		<div
			className='pdf-container'
			ref={containerRef}
			style={{ width: '100%', height: '100vh' }}
		/>
	)
})