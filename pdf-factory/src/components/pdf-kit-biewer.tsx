import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { PdfViewerRef } from "./pdf-viewer";

export const PdfKitViewerComponent = forwardRef<PdfViewerRef, { document: Blob }>((props: { document: Blob }, ref) => {
    const containerRef = useRef(null);
	const blobUrl = URL.createObjectURL(props.document);

	useImperativeHandle(ref, () => ({
		fillData(data: Array<{fieldId: string, data: string}>) {

		}
	}));

return (
    <iframe src={blobUrl} style={{width: "100%", height: "100vh"}} title='pdf-document'>

    </iframe>
)
})