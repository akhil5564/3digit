// import { basUrl } from "./baseUrl"
// import { commonApi } from "./commonApi"

// export const reportData = async (requestBody:any)=> {
// return await commonApi ( 'POST',`${basUrl}/addData`,requestBody,'')
// }
import { commonApi } from "./commonApi";
import { basUrl } from "./baseUrl";

interface DataType {
    number: string;
    count: string;
    type: string;
}

// Function to report data (POST request)
export const reportData = async (requestBody: any) => {
    try {
        const response = await commonApi('POST', `${basUrl}/addData`, requestBody, '');
        return response;  // Return the response data from the API
    } catch (error) {
        console.error('Error reporting data:', error);
        throw new Error('Error reporting data. Please try again later.');
    }
};

// Function to get data (GET request) with correct typing
export const getData = async (): Promise<DataType[]> => {
    try {
        const response = await commonApi('GET', `${basUrl}/fetchData`, '', '');
        return response as DataType[];  // Explicitly cast the response to DataType[]
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('Error fetching data');
    }
};
export const getNumberCountFromDb = async (_number: string) => {
    // Your logic to get count for a number from the database
    // For example, returning an object like { count: '2' }
};
