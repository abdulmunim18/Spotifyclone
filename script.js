console.log("Lets start js");

async function getsong(){
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response= await a.text();
    console.log(response);
    div=document.createElement("div");
    div.innerHTML=response;
    let as =div.getElementsByTagName("a");
    let songs=[];
    for(let i=0;i<as.length;i++){
        const element=as[i];
        if(element.href.endsWith(".mp3")){
             songs.push(element.href.split("/songs/")[1]);
        }
       
    }
    return songs;
}
async function main(){
let songs= await getsong();
console.log(songs);
let songul =document.querySelector(".songlist").getElementsByTagName("ul")[0];
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
                            </div>`;
}
var audio =new Audio(songs[0]);
// audio.play();

audio.addEventListener("loaddata",()=> {
 
    console.log(audio.duration, audio.currentSrc, audio.currentTime)
});

 }
main();