const loggedInTemplate = () => `
        <span style="padding-left: 1rem">Account | ${CURRENT_USER.firstName || 'user'}</span>
    `;

class User {

    static login(form) {
        $('.loading-overlay').show();
        let data = new FormData(form[0]);
        data = formDataToJson(data);
        axios.post(`/auth/login`, data)
            .then(function (response) {
                $('.loading-overlay').hide();
                localStorage.setItem(JWT_TOKEN_NAME, response.data.jwt);
                CURRENT_USER = response.data.user;
                $('#login').empty().append(loggedInTemplate());
                document.querySelector('#closeModal').click();
            })
            .catch(function (error) {
                defaultErrorHandler(error, 'Sign in Failed', {
                    closeButton: true,
                    timeOut: 0,
                    extendedTimeOut: 0,
                    positionClass: 'toast-top-full-width',
                });
            });
    }

    static register(form) {
        $('.loading-overlay').show();
        let data = new FormData(form[0]);
        data = formDataToJson(data);
        axios.post(`/auth/register`, data)
            .then(function (response) {
                $('.loading-overlay').hide();
                toastr.success(response.data && response.data.message
                    || 'You have successfully registered. Pleas login to continue.', 'Successfully Registered', {
                    closeButton: true,
                    timeOut: 0,
                    extendedTimeOut: 0,
                    positionClass: 'toast-top-full-width',
                });
            })
            .catch(function (error) {
                defaultErrorHandler(error, 'Registration Failed', {
                    closeButton: true,
                    timeOut: 0,
                    extendedTimeOut: 0,
                    positionClass: 'toast-top-full-width',
                });
            });
    }

    static verifyEmail(data) {
        $('.loading-overlay').show();
        axios.post(`/auth/verify`, data)
            .then(function (response) {
                $('.loading-overlay').hide();
                toastr.success(response.data && response.data.message
                    || 'Your account has ben successfully verified. Please login to continue', 'Successfully Verified.', {
                    closeButton: true,
                    timeOut: 0,
                    extendedTimeOut: 0,
                    positionClass: 'toast-top-full-width',
                });
            })
            .catch(function (error) {
                defaultErrorHandler(error, 'Verification Failed', {
                    closeButton: true,
                    timeOut: 0,
                    extendedTimeOut: 0,
                    positionClass: 'toast-top-full-width',
                });
            });
    }

    static loginWithFacebook() {
        location.href = `${API}/auth/facebook`;
    }

    static loginWithGoogle() {
        location.href = `${API}/auth/google`;
    }

    static async validateLogin(jwt) {
        const resp = await axios({
            url: `/auth/profile`, method: 'get', headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        return resp.data;
    }

    static async getProfile() {
        axios.get('/auth/profile').then(res => {
            CURRENT_USER = res.data;
            $('#login').empty().append(loggedInTemplate());

            $('.user-name').val(CURRENT_USER.firstName || '' + ' ' + CURRENT_USER.lastName || '').text(CURRENT_USER.firstName || '' + ' ' + CURRENT_USER.lastName || '');
            $('.user-email').val(CURRENT_USER.email || '').val(CURRENT_USER.email || '');
            $('.user-phone').val(CURRENT_USER.phone || '').val(CURRENT_USER.email || '');
        }).catch(e => {
            $('#login').empty().append(`
                <a href="#" class="ml-4" data-toggle="modal" data-target="#loginModal">
                    <span>Log in</span>
                    <i class="fas fa-sign-in-alt mr-4 "></i>
                </a>
            `)
        });
    }
}

$(document).ready(() => {
    $('.loginGoogle').on('click', () => {
        User.loginWithGoogle();
    });

    $('.loginFacebook').on('click', () => {
        User.loginWithFacebook();
    });
});

// Callback after social login. Verify and save the logged in user
const checkAuth = async () => {
    try {
        if (page === 'home') {
            let authResp = new URLSearchParams(window.location.search).get('auth');
            let token = new URLSearchParams(window.location.search).get('token');
            if (authResp) {
                try {
                    if (authResp === 'success' && token) {
                        const user = await User.validateLogin(token);
                        if (user) {
                            CURRENT_USER = user;
                            localStorage.setItem(JWT_TOKEN_NAME, token);
                            $('#login').empty().append(loggedInTemplate());
                            toastr.info(`Welcome ${user.firstName || ''}.`, 'Sign in successful');
                        } else
                            throw new Error();
                    } else {
                        throw new Error();
                    }
                } catch (err) {
                    localStorage.removeItem(JWT_TOKEN_NAME);
                    toastr.error('Authorization Failed. Please reload this tab and try again.',
                        'Authentication Error', {
                            closeButton: true,
                            timeOut: 0,
                            extendedTimeOut: 0,
                            positionClass: 'toast-top-full-width',
                        });
                }
            } else {
                // try to get profile
                User.getProfile();
            }
        } else {
            User.getProfile();
        }
    } catch (e) {
        User.getProfile();
        console.log(e);
    }
};

// Link on user registration
const verifyEmail = async () => {
    try {
        if (page === 'home') {
            let emailVerify = new URLSearchParams(window.location.search).get('email-verify');
            let token = new URLSearchParams(window.location.search).get('token');
            let email = new URLSearchParams(window.location.search).get('email');
            if (emailVerify) {
                try {
                    if (emailVerify === 'success' && token && email) {
                        User.verifyEmail({email, token});
                    }
                } catch (err) {
                    toastr.warning(`Please use the link sent to your email to verify your account. 
                    If you were not trying to verify your email, please ignore this message.`,
                        'Verification Failed', {
                            closeButton: true,
                            timeOut: 0,
                            extendedTimeOut: 0,
                            positionClass: 'toast-top-full-width',
                        });
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
};

verifyEmail();

checkAuth();

const registerForm = $('#register-form');
registerForm.on('submit', (e) => {
    e.preventDefault();
    if ($('#register-pass').val() !== $('#register-confirm-pass').val()) {
        toastr.warning('Passwords must match');
        return;
    }
    User.register(registerForm);
});

const loginForm = $('#login-form');
loginForm.on('submit', (e) => {
    e.preventDefault();
    User.login(loginForm);
});





