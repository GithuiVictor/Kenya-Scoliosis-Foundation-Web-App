class Donation {
    static getActiveProject() {
        $('.loading-overlay').show();
        axios.get(`/projects?status=active`)
            .then(function (response) {
                $('.loading-overlay').hide();
                if (response.data.length > 0) {
                    $('#active-project-container').prepend(activeProjectCard(response.data[0]));
                }
            })
            .catch(function (error) {
                defaultErrorHandler(error);
            });
    }

    static async donate(data) {
        const name = $("input[name='name'].donation-name").val();
        const email = $("input[name='email'].donation-email").val();
        const amount = $("input[name='amount'].donation-amount").val();
        const phone = $("input[name='phone'].donation-phone").val();

        if (CURRENT_USER && CURRENT_USER.id) {
            data.userId = CURRENT_USER.id;
        }

        var x = getpaidSetup({
            PBFPubKey: RAVE_PUBLIC_KEY,
            customer_name: name,
            customer_email: email,
            amount: +amount,
            customer_phone: phone,
            currency: "KES",
            txref: uuidv4(),
            onclose: function () {
            },
            callback: function (response) {
                // collect txRef returned and pass to a  server page to complete status check.
                if (
                    response.data && response.data.data && response.data.data.status === 'successful'
                ) {
                    // redirect to a success page
                    data.txref = response.data.data.txRef;
                    Donation.verifyDonation(data);
                } else {
                    // redirect to a failure page.
                    toastr.warning('Your payment did not go through. Please try again or contact support for help.',
                        'Payment Failed', {
                            closeButton: true,
                            timeOut: 0,
                            extendedTimeOut: 0,
                            positionClass: 'toast-top-full-width',
                        });
                }

                x.close(); // use this to close the modal immediately after payment.
            }
        });
    }

    static async verifyDonation(data) {
        const loader = $('.loading-overlay');
        try {
            loader.show();

            const resp = await axios.post(`donations`, data);
            location.href = `donateThankyou.html`;

            loader.hide();
        } catch (e) {
            loader.hide();
            console.log(e);
            defaultErrorHandler(e, 'Donation Verification failed!', {
                closeButton: true,
                timeOut: 0,
                extendedTimeOut: 0,
                positionClass: 'toast-top-full-width',
            });
        }
    }
}

const activeProjectCard = (project) => {
    return `
         <div class="card project" data-aos="fade">
            <div class="card-body">
                <h4 class="text-center mb-1">${project.name}</h4>
                <hr>
                <img src="${project.image}" alt="project image" class="card-img-top">
                <p class="para-1 mt-2">
                    ${project.description || ''}
                </p>
                <h6 class="text-muted text-center">Target Amount: KES <span>${project.targetAmount}</span></h6>
            </div>
        </div>
    `;
};

$(document).ready(() => {
    Donation.getActiveProject();
});

const donationForm = $('#donation-form');
donationForm.on('submit', (e) => {
    e.preventDefault();
    if (+($('input[name="amount"]').val()) < 100) {
        toastr.warning(`Donation amount must be greater than or equal to Ksh 100.
         This restriction is put across so as to cater for transaction costs. 
         For more details, please contact support.`, 'Invalid Amount');
        return;
    }
    let data = new FormData(donationForm[0]);
    data = formDataToJson(data);
    Donation.donate(data);
});
