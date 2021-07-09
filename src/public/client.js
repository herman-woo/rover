//declare the state
const store = {
    apod: '',
    curiosity: 'empty',
    opportunity: 'empty',
    spirit: 'empty',
    index: 'empty',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

// get the whole HTML document
const root = document.getElementById('root')
//create a function that updates state by using Object.assign to take in an argument called newState and writing into old store
const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}
//I honestly dont understand, but you're basically calling the app at this point.
//Seriously the introduction of Asynch at this point is really confusing.
const render = async (root, state) => {
    root.innerHTML = App(state)
}


// this is the main application/fnction that gets called everytime state is updated

const App = (state) => {
    let { rovers, apod, index, curiosity, opportunity, spirit } = state
    //API calls will be made upon the first loading of application
    if (curiosity === 'empty'){
        getCuriosityGallery(store)}
    if (opportunity === 'empty'){
        getOpportunityGallery(store)}    
    if (spirit === 'empty'){
        getSpiritGallery(store)}
    //After that the wont be reloaded, only once the whole page itself is reloaded on the browser    
    //Calling components to generate the UI
    //1. Call Header
    //2. Call Buttons dashbaord
    //3. Call Data container
        //This is where all the conent will be placed
    //4. Call Footer
    return `
        ${header()}
        ${mars(rovers)}
        <div id="container">
            ${container(rovers[index])}
        </div>
        ${footer()}
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS
//overall i prefer writing the components as regular ES6 functions, with the actual functions being arrow functions
//1. HEADER COMPONENT
    function header(){
        return `
        <header><a href="javascript:window.location.href=window.location.href"><h1> Nasa Mars Rover Dashboard</h1></a></header>
    `
    }

//2. BUTTONS DASHBOARD COMPONENT
    //Uses the array of rovers and displays names as buttons
    //each button contains an onclick which calls updateUI, sending a specific index
    function mars(rovers){
        return `
        <div class="rovers">
            <div id="rover-pannel">
                <a class="rover-button" id="inactive" onclick='updateUI(0)'><h2>${rovers[0]}</h2></a>
                <a class="rover-button" id="inactive" onclick='updateUI(1)'><h2>${rovers[1]}</h2></a>
                <a class="rover-button" id="inactive" onclick='updateUI(2)'><h2>${rovers[2]}</h2></a>
            </div>
        </div>
            `
    }

//3. MAIN INFO CONTAINER COMPONENT
    //This is where all the information is stored. By default we will be displaying the APOD information, since there will be no rovername selected, leaving the variable as undefined.

    //3A APOD INFO COMPONENT
    //This is the component called by default as there is no selection made yet.
    //These functions are Out of the Box - not my code
    function apodBody(apod){
        return `
        <main id="main">
            <section id="apod">
                <h3> Astronomy Photo of the Day! </h3>
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>
                ${ImageOfTheDay(apod)}
            </section>
        </main>
    `
    }

    //3B ROVER INFO COMPONENT
    //This is component is called once a selection is made via the rover buttons
    //the Rover varaible is returned from callback function
    function roverBody(selected){
            //i just need to see the data to know what to call
    //        console.log('Rover data:',selected,rover)
        const roverElements = (rover) => {
            let photos = rover.image.photos 
            let data = missionManifest(selected)
                return `
                <main id="main">
                    <div id="rover-data">
                        ${data(photos)}
                    </div>
                    <div id="rover-gallery">
                        ${gallerySorter(photos)}
                    </div>
                </main>
                `
            }
            return roverElements
        }

//Footer component
function footer(){
    return `
        <footer>
            <h5>All data taken from 
                <a href="https://api.nasa.gov/">
                    https://api.nasa.gov/
                </a>
            </h5>
        </footer>
    `
}

// ------------------------------------------------------  FUNCTIONS
//updateUI(num) - For when each button is clicked to update the UI
    const updateUI = (index) => {
        updateStore(store, { index: index })
    }

//container(string) - the main point of this function is to determine which info is displayed in container
    const container = (rovername) => {
        let roverTrue = roverBody(rovername)
        if (rovername === undefined){
            return apodBody(store.apod)
        }
        else{
            return roverTrue(selection(rovername))}
    }

//selection(string) - rover selection callback function, returns the desired state for the components to display
//passed in as a variable
    const selection = (selected) => {
        if (selected === "Curiosity"){
            return store.curiosity
        } else if (selected === 'Opportunity'){
            return store.opportunity
        } else if (selected === 'Spirit'){
            return store.spirit
        }
    }
//

//Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    //console.log(photodate.getDate(), today.getDate());

    //console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }
    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="500px" />
            <p>${apod.image.explanation}</p>
        `)
    }
}


const missionManifest = (name) => {
    let roverInfo = `<h1> Selected Rover: ${name} </h1>`
    const manifestData = (photos) => {
        let origin = photos[0].rover
        roverInfo += `
            <div>
                <h2> Launch Date: ${origin.launch_date} </h2>
                <h2> Landing Date: ${origin.landing_date} </h2>
                <h2> Status: ${origin.status}
            </div>
        `
        return roverInfo
    }
    return manifestData
}


const gallerySorter = (photos) => {
    let gallery = photos.map((photo) => {
        return `
            <div id="image-item">
                <div id="image-data">
                    <h2>Photo ID: ${photo.id}</h2>
                    <h2>Earth Date Taken: ${photo.earth_date}</h2>
                    <h2> Camera: ${photo.camera.full_name}(${photo.camera.name})
                </div>
                <a href="${photo.img_src}"><img src="${photo.img_src}" height="500px" width="500px"></a>
                <h5>Rover: ${photo.rover.name} - Status: ${photo.rover.status}</h5>
            </div>
            `
    })
    let result = ''
    if (photos.length !== 0){
        result = gallery.reduce((all, image) => {
            let final = all + image
            return final
            })
        }
    return `
        <h2 id="gallery-title">Gallery [${photos.length}] photos</h2>
        <div id="gallery">
            ${result}
        </div> 
    `
}

// ------------------------------------------------------  API CALLS
const getImageOfTheDay = (state) => {
    console.log('called apod')
    let { apod } = state
    fetch(`/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))
    return data
}

const getCuriosityGallery = (state) => {
    console.log('called curiosity')
    let { curiosity } = state
    fetch(`/curiosity`)
        .then(res => res.json())
        .then(curiosity => updateStore(store, { curiosity }))

    return data
}

const getOpportunityGallery = (state) => {
    console.log('called opportunity')
    let { opportunity } = state
    fetch(`/opportunity`)
        .then(res => res.json())
        .then(opportunity => updateStore(store, { opportunity }))

    return data
}

const getSpiritGallery = (state) => {
    console.log('called spirit')
    let { spirit } = state
    fetch(`/spirit`)
        .then(res => res.json())
        .then(spirit => updateStore(store, { spirit }))

    return data
}