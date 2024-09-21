export function cleanFileName(fileName: string): string {
	const fileExtension = fileName.substring(fileName.lastIndexOf('.'))

	const cleanName = fileName
		.substring(0, fileName.lastIndexOf('.'))
		.replace(/[^a-zA-Z0-9-_]/g, '')

	return cleanName + fileExtension
}
