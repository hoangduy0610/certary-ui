export const abi = [
    "function mintCertificate(address to, address issuer, string certificateId, string metadataURI, uint256 expire_time) external returns (uint256)",
    "function transferCertificate(uint256 tokenId, address to) external",
    "function revokeCertificate(uint256 tokenId) external",
    "function getCertificateByTokenId(uint256 tokenId) external view returns (tuple(string certificateId, address issuerOrg, bool revoked, uint256 issuedAt, uint256 expiredAt))",
    "function getCertificateByCertificateId(string certificateId) external view returns (tuple(string certificateId, address issuerOrg, bool revoked, uint256 issuedAt, uint256 expiredAt), uint256)",
    "function verifyCertificate(string certificateId) external view returns (bool)",
    "function addIssuer(address issuer) external",
    "function removeIssuer(address issuer) external",
    "function addPlatformRole(address platform) external",
    "function supportsInterface(bytes4 interfaceId) public view returns (bool)",
    "function exists(uint256 tokenId) public view returns (bool)",
    "event CertificateMinted(uint256 indexed tokenId, string certificateId, address issuer, address initialOwner)",
    "event CertificateTransferred(uint256 indexed tokenId, address from, address to)",
    "event CertificateRevoked(uint256 indexed tokenId, string certificateId)"
];