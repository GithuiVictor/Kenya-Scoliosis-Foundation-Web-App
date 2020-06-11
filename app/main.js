let API = 'http://localhost:3000';
if (location.protocol == "https:") {
    API = 'https://scoliosis-api.herokuapp.com';
}
const JWT_TOKEN_NAME = '77DBF735F4270529CE923C3CB6767396E147E5FC';
axios.defaults.baseURL = API;
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem(JWT_TOKEN_NAME)}`;

let urlParams = null;

const formDataToJson = (formData) => {
    const object = {};
    formData.forEach(function (value, key) {
        object[key] = value;
    });
    return object;
};

const defaultErrorHandler = (error, title, toastrOptions) => {
    console.error(error);
    $('.loading-overlay').hide();
    if (String(error && error.response && error.response.status).startsWith(4)) {
        toastr.error(error.response && error.response.data && error.response.data.message ||
            'An error occurred. Please try again', title, toastrOptions);
    } else {
        toastr.error('An error occurred. Please try again.');
    }
};
