import { MessageInstance } from "antd/es/message/interface";
import { Certificate, CertificateAPI } from "../services/certificateAPI";

export const handleDownloadCertificate = async (certificate: Certificate, messageApi?: MessageInstance) => {
    try {
        const response = await CertificateAPI.download(certificate.id);
        const blob = new Blob([response], { type: 'image/png' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${certificate.certificateId}.png`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        messageApi?.error('Error downloading certificate');
    }
}