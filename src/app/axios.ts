import axios from 'axios';

const myAxios = axios.create({
  baseURL: 'https://a883dpu3d9.us-east-1.awsapprunner.com'
});

export default myAxios;