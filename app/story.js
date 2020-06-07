class Story {
    static getStories() {
        $('.loading-overlay').show();
        axios.get(`/stories`)
            .then(function (response) {
                $('.loading-overlay').hide();
                const storiesContainer = $('#stories-container');
                storiesContainer.empty();
                if (page && page === 'home') {
                    if (response.data.length > 3) {
                        response.data = response.data.slice(0, 3);
                    }
                    response.data.forEach((story, index) => {
                        storiesContainer.append(storyCard(story));
                    });
                }
                if(page && page === 'stories') {
                    response.data.forEach((story, index) => {
                        storiesContainer.append(storyCardStoriesPage(story));
                    });
                }
                if (page && (page === 'story-details' || page === 'stories')) {
                    const relatedStoriesContainer = $('#side-stories-container');
                    relatedStoriesContainer.empty();
                    response.data.forEach((story, index) => {
                        relatedStoriesContainer.append(sideStoryTemp(story));
                    });
                }
            })
            .catch(function (error) {
                defaultErrorHandler(error);
            });
    }

    static async getStoryDetails(storyId) {
        $('.loading-overlay').show();
        axios.get(`/stories/${storyId}`)
            .then(function (response) {
                $('.loading-overlay').hide();
                const story = response.data;
                $('.article-name').text(story.title);
                $('.article-shortDescription').text(story.shortDescription);
                $('.article-description').html(story.description);
                $('.article-tag').text(story.tag);
                $('.article-date').text(moment(event.createdAt).format('MMMM Do YYYY'));
                $('.article-time').text(moment(event.createdAt).format('h:mm a'));
                $('.article-image').attr('src', story.image);
            })
            .catch(function (error) {
                defaultErrorHandler(error);
            });
    }
}

urlParams = new URLSearchParams(window.location.search);
const storyId = urlParams.get('story');

$(document).ready(() => {
    Story.getStories();

    if (storyId) {
        Story.getStoryDetails(storyId);
    }
});

const storyCard = (story) => {
    return `
         <div class="col-md-4" data-aos="fade-up">
            <div class="card">
                <img src="${story.image}" alt="img1" class="card-img-top">
                <div class="card-body">
                    <h4 class="card-title">${story.title}</h4>
                    <p class="card-text">
                        <i class="fas fa-calendar-week"></i> ${moment(story.createdAt).format('MMMM Do YYYY')}
                    </p>
                    <label for="" class="card-text details">
                        ${story.shortDescription}
                    </label>
                    <br>
                    <a href="blog.html?story=${story.id}">
                        <input type="button" value="Read More" class="btn">
                    </a>
                </div>
            </div>
        </div>
    `;
};

const sideStoryTemp = (story) => {
    return `
    <article>
        <div class="row">
            <!--Blog Details-->
            <div class="article-heading">
                <a href="blog.html?story=${story.id}" class=" text-dark">
                    <h5>${story.title}</h5>
                </a>
                <p class="text-muted">
                    <span class="mr-3"><i
                            class="far fa-calendar-alt mr-1"></i>${moment(story.createdAt).format('MMMM Do YYYY')}</span>
                </p>
            </div>
        </div>
    </article>
  `;
};

const storyCardStoriesPage = (story) => {
  return `
    <article class="blog-post mb-3 py-4 px-4" data-aos="fade-up">
        <div class="row">
            <!--Blog Image-->
            <div class="col-sm-4">
                <img src="${story.image}" alt="blog-image" class="img-fluid">
            </div>
            <!--Blog Details-->
            <div class="col-sm-8">
                <a href="blog.html?story=${story.id}">
                    <h3>${story.title}</h3>
                </a>
                <p class="text-muted">
                    <span class="mr-3"><i class="far fa-calendar-alt mr-1"></i>${moment(story.createdAt).format('MMMM Do YYYY')}</span>
                    <span><i class="far fa-clock mr-1"></i>${moment(story.createdAt).format('h:mm a')}</span>
                </p>
                <hr>
                <p>
                    ${story.shortDescription}
                </p>
            </div>
        </div>
    </article>
  `;
};
