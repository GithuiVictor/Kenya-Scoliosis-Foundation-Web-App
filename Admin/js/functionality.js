$(document).ready(function(){
    const button = document.querySelector('.button');
    const imagesContainer = document.querySelector('.images');

    button.addEventListener('click', async () => {
        const files  =  await selectFile('image/*', false);
        onFileSelected(files);
        $(imagesContainer).html("");
    });

    const addImage = (src) => {
        const img = document.createElement('img');
        img.setAttribute('src', src);
        imagesContainer.appendChild(img);
    };

    const onFileSelected = (file) => {
        if (typeof (FileReader) !== 'undefined') {
            const reader = new FileReader();

            reader.onload = (e) => {
                if (typeof reader.result === 'string') {
                    addImage(reader.result)
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const selectFile = (contentType, multiple) => {
        return new Promise(resolve => {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = false;
            input.accept = contentType;
            input.onchange = () => {
                const files = Array.from(input.files);
                resolve(files[0]);
            };
            input.click();
        });
    }

    //Location Autocomplete
    var autocompleteAddEvent;
    var autocompleteEventDetail;
    autocompleteAddEvent = new google.maps.places.Autocomplete((document.getElementById('eventVenue')), {
        types: ['geocode'],
    });

    google.maps.event.addListener(autocompleteAddEvent, 'place_changed', function(){
        var near_place1 = autocompleteAddEvent.getPlace();
    });


    autocompleteEventDetail = new google.maps.places.Autocomplete((document.getElementById('eventVenueDetail')), {
        types: ['geocode'],
    });

    google.maps.event.addListener(autocompleteEventDetail, 'place_changed', function(){
        var near_place2 = autocompleteEventDetail.getPlace();
    });
});

    