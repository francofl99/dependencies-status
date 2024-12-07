const axios = require('axios');

class GetPackageVersion {
    static create() {
        return new GetPackageVersion();
    }

    async latest(packageName) {
        const response = await axios.get(`https://registry.npmjs.org/${packageName}/latest`);

        return response.data.version;
    }
}

module.exports = GetPackageVersion;
