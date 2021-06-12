import { auth } from 'strapi-helper-plugin';
import axios from 'axios';

module.exports = {
    async handleAwsS3Link(prefixedFileURL) {
        if(prefixedFileURL.indexOf('amazonaws.com') === -1) return prefixedFileURL;
    
        const urlObj = new URL(prefixedFileURL);
        const path = urlObj.pathname
        const fileHash = path.substring(1, path.lastIndexOf('.'));
        const ext = path.substr(path.lastIndexOf('.'), path.length -1);
    
        const requestUrl = `${window.origin}/workorders/certificate/download/${fileHash}/${ext}`
        const signedUrl = await axios.get(
            requestUrl,
            {
                'headers': {
                    'Authorization': 'Bearer ' + auth.getToken('jwtToken')
    
                }
            }
        )
        .then((res) => res.data.signed_url)
        .catch((err) => {
            console.error(err)
        })

        if(signedUrl) {
            return signedUrl;
        } else {
            return prefixedFileURL
        }
    }
}