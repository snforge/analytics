import { RestOp } from './restop';

//import { pathOr } from 'ramda';
const basePath = process.env.GRIDSOME_API_URL || '/';

const backendAPI = {
  // Get US Trend Data
  async getUSTrendData(json_name) {
    return new RestOp({ method: 'get', url: basePath + json_name }).execute();
  }
};

export default backendAPI;
