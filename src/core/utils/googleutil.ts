import axios from "axios";

export const fetchGoogleUserInfo = async (accessToken: string) => {
    const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
}


