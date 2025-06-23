import MainApiRequest from "./MainApiRequest";

export const fileApi = {
    async uploadFile(file: File): Promise<string> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await MainApiRequest.post('/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 201) {
                return response.data.url;
            } else {
                throw new Error('File upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    }
}