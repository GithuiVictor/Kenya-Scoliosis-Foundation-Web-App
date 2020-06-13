let mapInitialized = false;
const coord = {latitude: null, longitude: null};

urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('event');
let currentEvent = null;

class Event {
    static getEvents() {
        $('.loading-overlay').show();
        axios.get(`/events`)
            .then(function (response) {
                $('.loading-overlay').hide();
                const eventsContainer = $('#events-container');
                eventsContainer.empty();
                if (page === 'home') {
                    if (response.data.length > 3) {
                        response.data = response.data.slice(0, 3);
                    }
                }
                response.data.forEach(event => {
                    eventsContainer.append(eventCard(event));
                });
            })
            .catch(function (error) {
                defaultErrorHandler(error);
            });
    }

    static async getEventDetails(eventId) {
        $('.loading-overlay').show();
        axios.get(`/events/${eventId}`)
            .then(function (response) {
                $('.loading-overlay').hide();
                const event = response.data;
                currentEvent = event;

                coord.latitude = event.latitude;
                coord.longitude = event.longitude;


                $('.event-name').text(event.title);
                $('.event-shortDescription').text(event.shortDescription);
                $('.event-description').html(event.description);
                $('.event-date').text(moment(event.eventDate).format('MMMM Do YYYY'));
                const eventTime = `2020-01-01T${event.eventTime}`;
                $('.event-time').text(moment(eventTime).format('h:mm a'));
                $('.event-location').text(event.location);
                $('.event-locationDetails').text(event.locationDetails);
                $('.event-amount').text(event.amount ? `Ksh ${event.amount}` : 'Free');
                $('.event-image').attr('src', event.image);
                $('.rsvp-btn').attr('href', `rsvp.html?event=${event.id}`);

                if (!mapInitialized) {
                    try {
                        initMap()
                    } catch (e) {

                    }
                }

                // for checking out
                if (event.paid && event.amount) {
                    // show checkout
                    $('#payment-options').show();
                    $('#checkout-btn').text('checkout');
                } else {
                    // normal rsvp
                    // hide payments
                    $('#payment-options').hide();
                    // change button text from checkout to rsvp
                    $('#checkout-btn').text('RSVP');
                }

            })
            .catch(function (error) {
                defaultErrorHandler(error);
            });
    }

    static async rsvpEvent(form) {
        const loader = $('.loading-overlay');
        try {
            loader.show();
            let data = new FormData(form[0]);
            if (CURRENT_USER && CURRENT_USER.id) {
                data.append('userId', CURRENT_USER.id);
            }
            data = formDataToJson(data);
            const resp = await axios.post(`events/${currentEvent && currentEvent.id}/rsvps`, data);


            if (currentEvent.paid && currentEvent.amount) {
                Event.pay(resp.data.id);
            } else {
                location.href = `rsvpThankyou.html?event=${currentEvent.id}`;
            }
            loader.hide();
        } catch (e) {
            $('.loading-overlay').hide();
            console.log(e);
        }
    }

    static async pay(rsvpId) {
        const tickets = $("input[name='tickets'].rsvp-tickets").val();
        const amount = +tickets * +(currentEvent.amount);
        var x = getpaidSetup({
            PBFPubKey: RAVE_PUBLIC_KEY,
            customer_name: $("input[name='name'].rsvp-name").val(),
            customer_email: $("input[name='email'].rsvp-email").val(),
            amount,
            customer_phone: $("input[name='phone'].rsvp-phone").val(),
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
                    const txref = response.data.data.txRef;
                    Event.verifyPayment(txref, rsvpId);
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

    static async verifyPayment(txref, rsvpId) {
        const loader = $('.loading-overlay');
        try {
            loader.show();

            const resp = await axios.post(`events/${currentEvent && currentEvent.id}/rsvps/${rsvpId}/pay`, {txref});
            if (resp.data.code === 3) {
                toastr.warning(resp.data.message, 'Payment Verification failed!!', {
                    closeButton: true,
                    timeOut: 0,
                    extendedTimeOut: 0,
                    positionClass: 'toast-top-full-width',
                });
            } else if (resp.data.code === 2) {
                toastr.success(resp.data.message, 'Overpayment!!', {
                    closeButton: true,
                    timeOut: 0,
                    extendedTimeOut: 0,
                    positionClass: 'toast-top-full-width',
                });
                setTimeout(() => {
                    location.href = `rsvpThankyou.html?event=${currentEvent.id}`;
                }, 3000);
            } else {
                location.href = `rsvpThankyou.html?event=${currentEvent.id}`;
            }

            loader.hide();
        } catch (e) {
            loader.hide();
            console.log(e);
            defaultErrorHandler(e, 'Payment Verification failed!', {
                closeButton: true,
                timeOut: 0,
                extendedTimeOut: 0,
                positionClass: 'toast-top-full-width',
            });
        }
    }
}

$(document).ready(() => {
    Event.getEvents();

    if (eventId) {
        Event.getEventDetails(eventId);
    }

    if (page === 'rsvp') {
        loadRaveScript();

        // if there is a logged in user, auto populate their details in the rsvp form
        if (CURRENT_USER) {
            $('#name').val(`${CURRENT_USER.firstName || ''} ${CURRENT_USER.lastName || ''}`);
            $('#emailAddress').val(`${CURRENT_USER.email || ''}`);
            $('#phoneNumber').val(`${CURRENT_USER.phone || ''}`);
        }


        const rsvpForm = $('#rsvp-form');
        rsvpForm.on('submit', (e) => {
            e.preventDefault();

            if (!currentEvent) {
                toastr.warning('Please search for this event in events page and click rsvp to rsvp.', 'Invalid Event');
                return;
            }

            if (currentEvent.paid && currentEvent.amount) {
                if (!$("input[name='payment-opt']:checked").val()) {
                    toastr.warning('Please select a payment option.');
                    return;
                }
                if ($("input[name='payment-opt']:checked").val() === 'mpesa') {
                    toastr.warning('Mpesa payment option is currently not supported. We are working hard to improve your experience.');
                    return;
                }
            }
            Event.rsvpEvent(rsvpForm);
        });
    }

    if (page === 'rsvp-thankyou') {
        $('.add-calendar-btn').on('click', () => {
            if (currentEvent) {
                window.open(`
                https://calendar.google.com/calendar/render?action=TEMPLATE&text=${currentEvent.title}
        &dates=${currentEvent.eventDate.split('-').join('')}T${currentEvent.eventTime}/${currentEvent.eventDate.split('-').join('')}T${currentEvent.eventTime}&details=${currentEvent.title}
        &location=${currentEvent.location}
            `, '_blank');
            }
        })
    }
});

function initMap() {
    if (coord.latitude) {
        console.log(coord);
        const map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: parseInt(coord.latitude), lng: parseInt(coord.longitude)},
            zoom: 8
        });
        mapInitialized = true;
    }
}

const eventCard = (event) => {
    const eventTime = `2020-01-01 ${event.eventTime}`;
    return `
    <div class="col-md-4" data-aos="fade-up">
        <div class="card card-1">
            <img src="${event.image}" alt="img1" class="card-img-top">
            <div class="card-body">
                <h4 class="card-title">Event</h4>
                <p class="card-text">
                    <i class="fas fa-calendar-week"></i> ${moment(event.eventDate).format('MMMM Do YYYY')}
                    <i class="fas fa-clock ml-2"></i> ${moment(event.eventTime).format('h:mm a')}
                    <br>
                    <i class="fas fa-map-marker-alt"></i> Venue
                    <i class="fas fa-ticket-alt ml-2"></i> <span>${event.paid && event.amount || 'free'}</span>
                </p>
                <label for="" class="card-text details">
                    ${event.shortDescription}
                </label>
                <a href="eventDetails.html?event=${event.id}">
                    <input type="button" value="RSVP" class="btn">
                </a>
            </div>
        </div>
    </div>

    `;
};


