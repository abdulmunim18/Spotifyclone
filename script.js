console.log("Lets start js");
let songs;
let currfolder;
let currentsong = new Audio();


// Function that converts seconds to MM:SS format
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsong(folder){
    currfolder=folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response= await a.text();
    div=document.createElement("div");
    console.log(response);
    div.innerHTML=response;
    let as =div.getElementsByTagName("a");
    songs=[];
    for(let i=0;i<as.length;i++){
        const element=as[i];
        if(element.href.endsWith(".mp3")){
             songs.push(element.href.split(`/${folder}/`)[1]);
        }
       
    }
 // show all sonds in the playlist
let songul =document.querySelector(".songlist").getElementsByTagName("ul")[0];
songul.innerHTML = ""; // clear the previous songs
for (const song of songs) {
    // songul.innerHTML=songul.innerHTML + song;
    songul.innerHTML=songul.innerHTML + `<li><img class="invert" width="34" src="music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>Sidhu Mossewala</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div> </li>`;
}
// attach event listener to each song
Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e)=>{
    e.addEventListener("click", element=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML);
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    })
    
})
}


const playMusic =(track, pause=false)=>{
    // let audio= new Audio("/songs/" + track);
    currentsong.src=`/${currfolder}/` + track;
    if(!pause){
        currentsong.play();
        play.src = "pause.svg";
        
        }
     document.querySelector(".songinfo").innerHTML=decodeURI(track);
     document.querySelector(".songtime").innerHTML="00:00 / 00:00";
}
async function displayAlbums() {
    console.log("displaying albums")
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response= await a.text();
    div=document.createElement("div");
    console.log(response);
    div.innerHTML=response;
    let anchors = div.getElementsByTagName("a")
    let cards = document.querySelector(".cards")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
            let response = await a.json(); 
            cards.innerHTML = cards.innerHTML + ` <div data-folder="punjabi" class="card ">
                        <div class="play">
                            <svg width="44" height="44" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>

            <img src="/songs/${folder}/cover.jpg" alt="">
            <h2>${response.Title}</h2>
            <p>${response.Description}</p>
        </div>`
        }
    }
}

async function main(){
    
// get the list of all the songs 
await getsong("songs/punjabi");
playMusic(songs[0],true);



// Display all the albums on the page
displayAlbums();

// Attach event listener to play next and previous songs

play.addEventListener("click", ()=>{
    if(currentsong.paused){
        currentsong.play();
        play.src = "pause.svg";
    }
    else{
        currentsong.pause();
        play.src="play.svg";
    }
})

// listen to the time update event of the audio
currentsong.addEventListener("timeupdate", ()=>{
    console.log(currentsong.currentTime, currentsong.duration);
     document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
    document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
})
    // Add event listener to the seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

    // Add event listener for the hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })
    // Add event listener for the close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })
    // Adevent listener for the previous nd next button
    previous.addEventListener("click", ()=>{
        console.log("previous clicked")
        let index= songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if ((index-1) >=0){
            playMusic(songs[index-1]);
    }
    })
     next.addEventListener("click", ()=>{
        console.log("next clicked")
        // currentsong.pause();
        let index= songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if ((index+1) < songs.length){
            playMusic(songs[index+1]);
    }
    })
    // Ad event to volume
        document.querySelector(".range").getElementsByTagName("input")[0]
    .addEventListener("change", (e)=>{

        currentsong.volume = parseInt(e.target.value)/ 100;
})

// load the playlist whenever the card is clicked
Array.from(document.getElementsByClassName("card")).forEach(e=>{
e.addEventListener("click",async item=>{
    console.log(item, item.currentTarget.dataset)
    songs= await getsong(`songs/${item.currentTarget.dataset.folder}`);
})  })

// Add event listener to mute volume
document.querySelector(".volume>img").addEventListener("click", e=>{
    if(e.target.src.includes("volume.svg")){
       e.target.src= e.target.src.replace("volume.svg","mute.svg");
        currentsong.volume=0;
        document.querySelector(".range").getElementsByTagName("input")[0].value=0;
    }
    
    else{
       e.target.src= e.target.src.replace("mute.svg","volume.svg");
        currentsong.volume= .50;
        document.querySelector(".range").getElementsByTagName("input")[0].value=50;
    }
})   

 }
main();