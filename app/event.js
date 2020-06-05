let mapInitialized = false;
const coord = {latitude: null, longitude: null};

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
                coord.latitude = event.latitude;
                coord.longitude = event.longitude;


                $('.event-name').text(event.title);
                $('.event-shortDescription').text(event.shortDescription);
                $('.event-description').html(event.description);
                $('.event-date').text(moment(event.eventDate).format('MMMM Do YYYY'));
                const eventTime = `2020-01-01 ${event.eventTime}`;
                $('.event-time').text(moment(eventTime).format('h:mm a'));
                $('.event-location').text(event.location);
                $('.event-locationDetails').text(event.locationDetails);
                $('.event-image').attr('src', event.image);

                if (!mapInitialized) {
                    try {
                        initMap()
                    } catch (e) {

                    }
                }
            })
            .catch(function (error) {
                defaultErrorHandler(error);
            });
    }
}

urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('event');

$(document).ready(() => {
    Event.getEvents();

    if (eventId) {
        Event.getEventDetails(eventId);
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
     <div class="col-md-4" data-aos="fade-right">
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
                <div class="card-footer mt-3">
                    <a href="eventDetails.html?event=${event.id}">
                        <input type="button" value="RSVP" class="btn">
                    </a>
                </div>
            </div>
        </div>
    </div>
    `;
};
