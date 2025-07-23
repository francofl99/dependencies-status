jest.mock('axios');
const axios = require('axios');
const GetPackageVersion = require('../GetPackageVersion');

describe('GetPackageVersion.latest', () => {
  it('returns the latest version from npm', async () => {
    const mockVersion = '1.2.3';
    axios.get.mockResolvedValue({ data: { version: mockVersion } });

    const service = GetPackageVersion.create();
    const version = await service.latest('test-package');

    expect(version).toBe(mockVersion);
    expect(axios.get).toHaveBeenCalledWith(
      'https://registry.npmjs.org/test-package/latest'
    );
  });
});
