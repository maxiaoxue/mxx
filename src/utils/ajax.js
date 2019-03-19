import axios from 'axios';
axios.defaults.timeout = 300000;

export default {
    get (url, data, okFn, failFn, errFn) {
        axios.get(url, {
            "params": data
        })
        .then( (response) => {
            if(response.data.error_code == 200){
                okFn && okFn(response.data);
            } else {
                if(failFn) {
                    failFn(response.data);
                } else {
                    alert(response.data.error_msg);
                }
            }
        })
        .catch( (error) => {
            if(errFn) {
                errFn(error);
            } else {
                alert(error);
            }
        });
    },
    post (url, data, okFn, failFn) {
        axios.post(url, data).then( (response) => {
            if(response.data.error_code == 200){
                okFn && okFn();
            } else {
                alert(response.data.error_msg);
                failFn && failFn();
            }
        })
        .catch( (response) => {
            alert(response);
            failFn && failFn();
        });
    },
    silentPost (url, data, okFn, failFn) {
        axios.post(url, data).then( (response) => {
            if(response.data.error_code == 200) {
                okFn && okFn(response.data);
            } else {
                failFn && failFn();
            }
        })
        .catch( (response) => {
            failFn && failFn();
        });
    },

    silentPost2 (url, data, okFn, failFn) {
        axios.post(url, data).then( (response) => {
            if(response.data.error_code == 200 || response.data.error_code == 1000) {
            okFn && okFn(response.data);
        } else {
            failFn && failFn();
        }
    })
    .catch( (response) => {
            failFn && failFn();
    });
    }
}