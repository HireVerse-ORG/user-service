import axios from "axios";
import jwt, { JwtPayload } from "jsonwebtoken";
import { checkEnvVariables } from '@hireverse/service-common/dist/utils';

interface OpenIdConfig {
    issuer: string;
    jwks_uri: string;
}

checkEnvVariables('MSAL_CLIENT_ID', 'MSAL_TENANT_ID');
export const microsoftConfig = {
    clientId: process.env.MSAL_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.MSAL_TENANT_ID}/v2.0/.well-known/openid-configuration`,
};
export async function fetchOpenIdConfig(authority: string): Promise<OpenIdConfig> {
    const response = await axios.get(`${authority}`);
    return response.data;
}

// https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/Overview
export async function verifyMsToken(accessToken: string, clientId: string, authority: string): Promise<JwtPayload> {
    const config = await fetchOpenIdConfig(authority);
    const jwksResponse = await axios.get(config.jwks_uri);
    const jwks = jwksResponse.data.keys;

    const decodedHeader = jwt.decode(accessToken, { complete: true });

    if (!decodedHeader) throw new Error("Invalid token");

    const kid = decodedHeader.header.kid;
    const signingKey = jwks.find((key: any) => key.kid === kid);
    if (!signingKey) throw new Error("Signing key not found");

    const publicKey = `-----BEGIN CERTIFICATE-----\n${signingKey.x5c[0]}\n-----END CERTIFICATE-----`;
    return jwt.verify(accessToken, publicKey, { audience: clientId, issuer: config.issuer }) as JwtPayload;
}
