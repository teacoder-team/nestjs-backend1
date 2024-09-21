export interface MediaResponse {
	url: string
	name: string
}

export interface File extends Express.Multer.File {
	name?: string
}
