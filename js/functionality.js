    const button = document.querySelector('.button');
    const imagesContainer = document.querySelector('.images');

    button.addEventListener('click', async () => {
        const files  =  await selectFile('image/*', false);
        onFileSelected(files);
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
                // if (multiple) {
                //   resolve(files);
                // } else {
                //   resolve(files[0]);
                // }
                resolve(files[0]);
            };
            input.click();
        });
    }