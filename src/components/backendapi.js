import { RestOp } from './restop';

//import { pathOr } from 'ramda';
const basePath = process.env.GRIDSOME_API_URL || '/analytics/';

const backendAPI = {
  // Get US Trend Data
  async getUSTrendData(json_name) {
    return new RestOp({ method: 'get', url: basePath + json_name }).execute();
  },
  async getUSCATrendData() {
    return new RestOp({ method: 'get', url: `${basePath}us_CA_trend.json` }).execute();
  },
  async getUSNewCasesTrendData() {
    return new RestOp({ method: 'get', url: `${basePath}us_new_cases_trend.json` }).execute();
  },
  async getUSCANewCasesTrendData() {
    return new RestOp({ method: 'get', url: `${basePath}us_CA_new_cases_trend.json` }).execute();
  }
};

export default backendAPI;
