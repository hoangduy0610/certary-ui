export const comparePathname = (pathname1: string, pathname2: string) => {
    const path1 = pathname1.replace(/(^\/)|(\/$)/g, '');
    const path2 = pathname2.replace(/(^\/)|(\/$)/g, '');
    return path1 === path2;
}

export const renderQr = (uri: string) => {
    if (!uri) return '';
    const encodedUri = encodeURIComponent(uri);
    return `https://api.qrserver.com/v1/create-qr-code/?data=${encodedUri}`;
}

export const renderCertQr = (certId: string) => {
    const currentHostname = window.location.origin;
    const certUri = `${currentHostname}/verify-certificate?id=${certId}`;
    return renderQr(certUri);
}